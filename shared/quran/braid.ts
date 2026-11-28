import { num } from './arabicNumber';
import { letters, sharedDisplay } from './phraseTrees';
import { END, type Branch } from './branches';
import { likeness } from './wordMatch';
import { bare } from './quranText/ayahWords';
import { writtenForms } from './writtenForms';
import type { CardAyah, CardMark, CardSide } from './compareCards';

export type Span = [number, number];
export type Strand = { kind: 'shared' | 'split'; a: Span; b: Span };

export const MIN_SHARED = 2;

const key = (word: string) => letters(word).replace(/[\s\u200e\u200f]/g, '');

export function braid(a: string[], b: string[], minShared = MIN_SHARED): Strand[] {
  const x = a.map(key);
  const y = b.map(key);
  const table = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) {
    table[i][j] = x[i] === y[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  }
  const matches: [number, number][] = [];
  for (let i = 0, j = 0; i < x.length && j < y.length;) {
    if (x[i] === y[j]) matches.push([i++, j++]);
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  const runs: { a: Span; b: Span }[] = [];
  for (const [i, j] of matches) {
    const last = runs.at(-1);
    if (last && last.a[1] === i && last.b[1] === j) { last.a[1]++; last.b[1]++; }
    else runs.push({ a: [i, i + 1], b: [j, j + 1] });
  }
  const strands: Strand[] = [];
  let at: [number, number] = [0, 0];
  for (const run of runs.filter(run => run.a[1] - run.a[0] >= minShared)) {
    if (run.a[0] > at[0] || run.b[0] > at[1]) strands.push({ kind: 'split', a: [at[0], run.a[0]], b: [at[1], run.b[0]] });
    strands.push({ kind: 'shared', a: run.a, b: run.b });
    at = [run.a[1], run.b[1]];
  }
  if (at[0] < x.length || at[1] < y.length) strands.push({ kind: 'split', a: [at[0], x.length], b: [at[1], y.length] });
  return strands;
}

export type BraidWord = { text: string; ayah: number; mark?: CardMark; end?: number; moved?: true };
export type BraidStrand = { kind: Strand['kind']; a: BraidWord[]; b: BraidWord[] };

const flat = (ayat: CardAyah[]): BraidWord[] => ayat.flatMap(ayah => ayah.words.map((text, i) => ({
  text, ayah: ayah.number, mark: ayah.marks?.[i], ...(i === ayah.words.length - 1 ? { end: ayah.number } : {}),
})));

const apart = (a: BraidWord, b: BraidWord) => likeness([a.text, b.text]) !== 'exact';
const signsApart = (a: BraidWord, b: BraidWord) => a.text !== b.text && bare(a.text) === bare(b.text);

export function foldStrands(strands: BraidStrand[]): BraidStrand[] {
  const out = strands.map(strand => ({ kind: strand.kind, a: [...strand.a], b: [...strand.b] }));
  const move = (word: BraidWord): BraidWord => ({ ...word, moved: true });
  for (let i = 0; i < out.length; i++) {
    const strand = out[i];
    if (strand.kind !== 'shared') continue;
    const before = out[i - 1]?.kind === 'split' ? out[i - 1] : undefined;
    const after = out[i + 1]?.kind === 'split' ? out[i + 1] : undefined;
    if (before && strand.a.length && apart(strand.a[0], strand.b[0])) {
      before.a.push(move(strand.a.shift()!));
      before.b.push(move(strand.b.shift()!));
    }
    const keep = before || i > 0 ? 0 : 1;
    if (after && strand.a.length > keep && apart(strand.a[strand.a.length - 1], strand.b[strand.b.length - 1])) {
      after.a.unshift(move(strand.a.pop()!));
      after.b.unshift(move(strand.b.pop()!));
    }
    if (strand.a.length) continue;
    if (before && after) {
      before.a.push(...after.a);
      before.b.push(...after.b);
      out.splice(i, 2);
    } else out.splice(i, 1);
    i--;
  }
  return out;
}

export function braidOf(sides: [CardSide, CardSide]): BraidStrand[] {
  const a = flat(sides[0].ayat);
  const b = flat(sides[1].ayat);
  return foldStrands(braid(a.map(word => word.text), b.map(word => word.text))
    .map(strand => ({ kind: strand.kind, a: a.slice(...strand.a), b: b.slice(...strand.b) })));
}

export type CompareTree = { tree: Branch; sides: Map<Branch, 0 | 1> };

export const sideKey = (side: CardSide) => `${side.surah}:${side.ayah}`;

const sign = (ends: number[]) => (ends.length > 1 ? END : `﴿${num(ends[0])}﴾`);

function one(words: BraidWord[], written: Set<string>): Pick<Branch, 'words' | 'tones'> {
  const out: string[] = [];
  const tones: Branch['tones'] = [];
  for (const word of words) {
    const mark = word.mark;
    out.push(word.text);
    tones.push(word.moved || (mark?.kind === 'exact' && mark.link && written.has(mark.link)) ? 'written' : mark?.kind);
    if (word.end !== undefined) { out.push(sign([word.end])); tones.push(undefined); }
  }
  return { words: out, tones };
}

function both(a: BraidWord[], b: BraidWord[], surahs: [number, number], shown: (a: BraidWord, b: BraidWord) => number[], paths: [string, string]): Pick<Branch, 'words' | 'tones' | 'forms'> {
  const out: string[] = [];
  const tones: Branch['tones'] = [];
  const forms: [string[], string[]] = [[], []];
  a.forEach((word, i) => {
    const partner = b[i];
    const differ = apart(word, partner);
    out.push(differ ? sharedDisplay([word.text, partner.text]) : signsApart(word, partner) ? writtenForms({ forms: { a: [word.text], b: [partner.text] } }, 0, word.text)[0].word : word.text);
    forms[0].push(word.text);
    forms[1].push(partner.text);
    tones.push(differ ? undefined : 'exact');
    const ends = shown(word, partner);
    if (ends.length) { out.push(sign(ends)); forms[0].push(sign(ends)); forms[1].push(sign(ends)); tones.push(undefined); }
  });
  const at = a.findIndex((word, i) => apart(word, b[i]));
  const signs = a.some((word, i) => signsApart(word, b[i]));
  const keys = at >= 0 ? [`${surahs[0]}:${a[at].ayah}`, `${surahs[1]}:${b[at].ayah}`] : signs ? paths : [];
  return { words: out, tones, ...(keys.length && keys[0] !== keys[1] ? { forms: { [keys[0]]: forms[0], [keys[1]]: forms[1] } } : {}) };
}

function runs(surah: number, numbers: number[]): string[][] {
  const out: number[][] = [];
  for (const n of new Set(numbers)) {
    const last = out.at(-1);
    if (last && n === last[last.length - 1] + 1) last.push(n);
    else out.push([n]);
  }
  return out.map(run => run.map(n => `${surah}:${n}`));
}

type Step = BraidStrand & { lead?: [number | undefined, number | undefined] };

function endsApart(strands: BraidStrand[], last: Set<BraidWord>): Step[] {
  const out: Step[] = [];
  const carry = (lead: Step['lead']) => {
    const next = out.at(-1)!;
    next.lead = [next.lead?.[0] ?? lead![0], next.lead?.[1] ?? lead![1]];
  };
  let pending: Step['lead'];
  for (const strand of strands) {
    if (strand.kind === 'split') {
      out.push({ ...strand });
      if (pending) { carry(pending); pending = undefined; }
      continue;
    }
    if (pending) { out.push({ kind: 'split', a: [], b: [], lead: pending }); pending = undefined; }
    let from = 0;
    strand.a.forEach((word, i) => {
      const partner = strand.b[i];
      if ((word.end === undefined) === (partner.end === undefined) || last.has(word) || last.has(partner)) return;
      out.push({ kind: 'shared', a: strand.a.slice(from, i + 1), b: strand.b.slice(from, i + 1) });
      from = i + 1;
      const lead: Step['lead'] = [word.end, partner.end];
      if (i < strand.a.length - 1) out.push({ kind: 'split', a: [], b: [], lead });
      else pending = lead;
    });
    if (from < strand.a.length) out.push({ kind: 'shared', a: strand.a.slice(from), b: strand.b.slice(from) });
  }
  if (pending) out.push({ kind: 'split', a: [], b: [], lead: pending });
  return out;
}

export function compareTree(sides: [CardSide, CardSide], written: Set<string> = new Set()): CompareTree {
  const braided = braidOf(sides);
  const lasts = new Set([0, 1].flatMap(side => braided.flatMap(strand => (side ? strand.b : strand.a)).slice(-1)));
  const strands = endsApart(braided, lasts);
  const shown = (a: BraidWord, b: BraidWord) => [a, b].flatMap(word => (word.end !== undefined && ((a.end !== undefined && b.end !== undefined) || lasts.has(word)) ? [word.end] : []))
    .filter((end, i, list) => list.indexOf(end) === i);
  const ends = sides.map(sideKey) as [string, string];
  const all = [...new Set(ends)];
  const owner = new Map<Branch, 0 | 1>();
  const part = (words: BraidWord[], side: 0 | 1, lead?: number): Branch => {
    const own = one(words, written);
    const branch: Branch = {
      words: lead === undefined ? own.words : [sign([lead]), ...own.words], tones: lead === undefined ? own.tones : [undefined, ...(own.tones ?? [])],
      ayat: [], children: [], via: [ends[side]], holds: runs(sides[side].surah, [...(lead === undefined ? [] : [lead]), ...words.map(word => word.ayah)]),
    };
    owner.set(branch, side);
    return branch;
  };
  const common = (a: BraidWord[], b: BraidWord[]): Branch => {
    const ending = [a, b].flatMap((words, side) => runs(sides[side].surah, words.flatMap((word, i) => (shown(a[i], b[i]).length && word.end !== undefined && (lasts.has(word) || [a, b][1 - side][i].end !== undefined) ? [word.end] : []))));
    return { ...both(a, b, [sides[0].surah, sides[1].surah], shown, ends), ayat: [], children: [], via: all, holds: ending };
  };
  const last: (Branch | undefined)[] = [undefined, undefined];
  const note = (node: Branch, a: boolean, b: boolean) => { if (a) last[0] = node; if (b) last[1] = node; return node; };
  const root = strands[0]?.kind === 'shared' ? note(common(strands[0].a, strands[0].b), true, true) : { words: [], ayat: [], children: [], via: all } as Branch;
  let at = root;
  strands.forEach((strand, i) => {
    if (at === root && i === 0 && strand.kind === 'shared') return;
    if (strand.kind === 'split') {
      const between = i > 0 && i < strands.length - 1;
      const [leadA, leadB] = strand.lead ?? [];
      at.children = [note(part(strand.a, 0, leadA), strand.a.length > 0 || leadA !== undefined, false), note(part(strand.b, 1, leadB), false, strand.b.length > 0 || leadB !== undefined)].filter((child, side) => child.words.length || between || !sides[side].ayat.length);
      return;
    }
    const next = note(common(strand.a, strand.b), true, true);
    at.rejoin = next;
    at = next;
  });
  last.forEach((node, side) => {
    if (!node) return;
    node.ayat.push(ends[side]);
    node.through = { ...node.through, [ends[side]]: `${sides[side].surah}:${Math.max(...sides[side].ayat.map(ayah => ayah.number))}` };
  });
  return { tree: root, sides: owner };
}
