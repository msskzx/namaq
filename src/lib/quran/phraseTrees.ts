// docs/plans/quran-phrase-trees.md
import { keys, PIECE_MAX, spell, type Branch, type BranchAyah, type Variant } from './branches';
import { chapterFamilies } from './chapterFamilies';
import { num } from './arabicNumber';
import { normalizeWord } from './normalize';

export type PhraseOccurrence = { key: string; start: number; end: number };
export type PhraseGroup = { id: string; text: string; occurrences: PhraseOccurrence[] };
export type TreeGroup = PhraseGroup & { textEn?: string; family?: true };

const letters = (word: string) => normalizeWord(word.normalize('NFC')).replace(/[ؤئء]/g, 'ا');
const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');
const members = (occurrences: PhraseOccurrence[]) => [...new Set(occurrences.map(o => o.key))];
const phraseId = (words: string[]) => words.map(letters).join(' ');

const withoutConjunction = (word: string, conjunction: string | null | undefined) => {
  if (!conjunction) return word;
  let at = 1;
  while (at < word.length && normalizeWord(word[at]) === '') at++;
  return word.slice(at);
};

function wordIds(ayat: BranchAyah[], occurrenceStart = false) {
  const parent: number[] = [];
  const find = (i: number): number => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const seen = new Map<string, number>();
  const ids = ayat.map(ayah => ayah.words.map((original, at) => {
    const word = occurrenceStart ? withoutConjunction(original, ayah.conjs?.[at]) : original;
    const i = parent.length;
    parent.push(i);
    const comparable = isEnd(word) ? '۝' : word;
    const base = JSON.stringify([letters(comparable), ayah.roots?.[at] ?? null]);
    for (const key of [`${base}:s:${spell(comparable)}`, `${base}:l:${ayah.lemmas?.[at] ?? null}`]) {
      const prior = seen.get(key);
      if (prior === undefined) seen.set(key, i);
      else parent[find(i)] = find(prior);
    }
    return i;
  }));
  return ids.map(row => row.map(find));
}

export function buildPhraseGroups(ayat: BranchAyah[]): PhraseGroup[] {
  const ids = wordIds(ayat);
  const starts = wordIds(ayat, true);
  type Run = { tokens: number[]; at: [number, number][] };
  let runs = new Map<string, Run>();
  ids.forEach((row, a) => {
    for (let start = 0; start + 1 < row.length; start++) {
      const tokens = [starts[a][start], row[start + 1]];
      const id = tokens.join(',');
      const run = runs.get(id) ?? { tokens, at: [] };
      run.at.push([a, start]);
      runs.set(id, run);
    }
  });
  const byMembers = new Map<string, Run[]>();
  while (runs.size > 0) {
    const next = new Map<string, Run>();
    for (const run of runs.values()) {
      const keys = [...new Set(run.at.map(([a]) => a))].sort((a, b) => a - b);
      if (keys.length < 2) continue;
      const length = run.tokens.length;
      const key = keys.join(',');
      byMembers.set(key, [...(byMembers.get(key) ?? []), run]);
      for (const [a, start] of run.at) {
        const token = ids[a][start + length];
        if (token === undefined) continue;
        const tokens = [...run.tokens, token];
        const key = tokens.join(',');
        const extended = next.get(key) ?? { tokens, at: [] };
        extended.at.push([a, start]);
        next.set(key, extended);
      }
    }
    runs = next;
  }
  const result: PhraseGroup[] = [];
  for (const sameMembers of byMembers.values()) {
    const retained: Run[] = [];
    for (const run of sameMembers.sort((a, b) => b.tokens.length - a.tokens.length)) {
      if (retained.some(longer => longer.tokens.some((_, at) => run.tokens.every((token, i) => longer.tokens[at + i] === token)))) continue;
      retained.push(run);
      const [first, start] = run.at[0];
      const words = ayat[first].words.slice(start, start + run.tokens.length);
      words[0] = withoutConjunction(words[0], ayat[first].conjs?.[start]);
      result.push({ id: phraseId(words), text: words.join(' '), occurrences: run.at.map(([a, begin]) => ({ key: ayat[a].key, start: begin, end: begin + run.tokens.length })) });
    }
  }
  const counts = new Map<string, number>();
  result.forEach(group => counts.set(group.id, (counts.get(group.id) ?? 0) + 1));
  return result.map(group => counts.get(group.id)! > 1 ? { ...group, id: `${group.id}~${group.occurrences.map(o => `${o.key}:${o.start}`).join(',')}` } : group)
    .sort((a, b) => b.occurrences[0].end - b.occurrences[0].start - (a.occurrences[0].end - a.occurrences[0].start) || members(a.occurrences).length - members(b.occurrences).length || a.id.localeCompare(b.id));
}

export function buildTreeGroups(ayat: BranchAyah[]): TreeGroup[] {
  const single = new Map<string, BranchAyah[]>();
  ayat.filter(ayah => ayah.key.endsWith(':1') && ayah.words.length === 1).forEach(ayah => {
    const id = phraseId(ayah.words);
    single.set(id, [...(single.get(id) ?? []), ayah]);
  });
  const letterTrees: TreeGroup[] = [...single].flatMap(([id, members]) => members.length < 2 ? [] : [{
    id,
    text: members[0].words[0],
    occurrences: members.map(ayah => ({ key: ayah.key, start: 0, end: 1 })),
  }]);
  const families: TreeGroup[] = chapterFamilies(ayat).map(family => ({
    id: family.id,
    text: family.text,
    textEn: family.textEn,
    family: true,
    occurrences: family.keys.map(key => {
      const entry = ayat.find(ayah => ayah.key === key)!;
      return { key, start: 0, end: entry.words.length };
    }),
  }));
  return [...buildPhraseGroups(ayat), ...letterTrees, ...families];
}

function sharedDisplay(forms: string[]) {
  if (forms.every(form => form === forms[0])) return forms[0];
  if (forms.every(isEnd)) return '۝';
  const originals = forms.map(form => form.replace(/[\u0640\u2060]/g, '').normalize('NFC').match(/[^\p{M}\u06D6-\u06ED][\p{M}\u06D6-\u06ED]*/gu) ?? []);
  forms = originals.map(words => words.map((word, i) => {
    const bases = originals.map(other => other[i]?.[0]);
    return bases.every(base => base === bases[0]) ? word : bases.every(base => base && 'ؤئء'.includes(base)) ? word.replace(/^[ؤئ]/, 'ء') : word;
  }).join(''));
  const letters = forms.map(form => form.replace(/[\u0640\u2060]/g, '').normalize('NFD').match(/[^\p{M}\u06D6-\u06ED][\p{M}\u06D6-\u06ED]*/gu) ?? []);
  if (letters.some(other => other.length !== letters[0].length || other.some((letter, i) => letter[0] !== letters[0][i][0]))) return forms[0];
  return letters[0].map((letter, i) => [...letter].filter((mark, at) => at === 0 || letters.every(other => other[i]?.includes(mark))).join('')).join('').normalize('NFC');
}

export function phrasePresentation(group: PhraseGroup, ayat: BranchAyah[], continueIdentical = true, followCorpus = true): { tree: Branch; prefixes: Variant[]; offsets: Record<string, number> } {
  const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
  const positions = new Map(ayat.map((ayah, index) => [ayah.key, index]));
  const seen = new Set<string>();
  const occurrences = group.occurrences.filter(o => {
    if (seen.has(o.key)) return false;
    seen.add(o.key);
    return true;
  });
  const source = occurrences.map(o => {
    const ayah = byKey.get(o.key)!;
    const words = ayah.words.slice(o.start);
    words[0] = withoutConjunction(words[0], ayah.conjs?.[o.start]);
    return { ...ayah, conj: undefined, conjs: undefined, words, roots: ayah.roots?.slice(o.start), lemmas: ayah.lemmas?.slice(o.start) };
  });
  const expanded = source.map(ayah => ({ ...ayah, through: ayah.key }));
  while (true) {
    const sourceIds = wordIds(expanded);
    const extend = expanded.map((ayah, i) => {
      const position = positions.get(ayah.through!);
      const [surah, number] = ayah.through!.split(':').map(Number);
      const explicit = ayah.next ? { key: `${surah}:${number + 1}`, page: ayah.page, words: ayah.next, roots: ayah.nextRoots, lemmas: ayah.nextLemmas } : undefined;
      const next = explicit ?? (followCorpus && position !== undefined ? ayat[position + 1] : undefined);
      if (!next) return undefined;
      const prefix = sourceIds.some((other, at) => at !== i && (other.length > sourceIds[i].length || continueIdentical && other.length === sourceIds[i].length) && sourceIds[i].every((token, word) => token === other[word]));
      return prefix ? next : undefined;
    });
    if (!extend.some(Boolean)) break;
    extend.forEach((next, i) => {
      if (!next) return;
      expanded[i] = {
        ...expanded[i],
        words: [...expanded[i].words, `﴿${num(Number(expanded[i].through!.split(':')[1]))}﴾`, ...next.words],
        roots: [...(expanded[i].roots ?? expanded[i].words.map(() => null)), null, ...(next.roots ?? next.words.map(() => null))],
        lemmas: [...(expanded[i].lemmas ?? expanded[i].words.map(() => null)), null, ...(next.lemmas ?? next.words.map(() => null))],
        through: next.key,
        next: undefined,
        nextRoots: undefined,
        nextLemmas: undefined,
      };
    });
  }
  const ids = wordIds(expanded);
  const grow = (indices: number[], from: number): Branch => {
    let to = from;
    while (indices.every(i => to < ids[i].length && ids[i][to] === ids[indices[0]][to])) to++;
    const children = new Map<number, number[]>();
    indices.forEach(i => {
      if (ids[i][to] !== undefined) children.set(ids[i][to], [...(children.get(ids[i][to]) ?? []), i]);
    });
    const forms = Object.fromEntries(indices.map(i => [expanded[i].key, expanded[i].words.slice(from, to)]));
    return {
      words: expanded[indices[0]].words.slice(from, to).map((_, i) => sharedDisplay(indices.map(a => expanded[a].words[from + i]))),
      ayat: indices.filter(i => expanded[i].words.length === to).map(i => expanded[i].key),
      ...(indices.some(i => expanded[i].words.length === to && expanded[i].through !== expanded[i].key) ? { through: Object.fromEntries(indices.filter(i => expanded[i].words.length === to).map(i => [expanded[i].key, expanded[i].through!])) } : {}),
      children: [...children.values()].map(child => grow(child, to)),
      ...(new Set(Object.values(forms).map(words => words.join(' '))).size > 1 ? { forms } : {}),
    };
  };
  const prefixes = new Map<string, Variant>();
  const before = occurrences.map(o => {
    const ayah = byKey.get(o.key)!;
    const words = ayah.words.slice(0, o.start);
    if (ayah.conjs?.[o.start]) words.push(ayah.conjs[o.start]!);
    return { ...ayah, words, roots: [...(ayah.roots?.slice(0, o.start) ?? []), ...(ayah.conjs?.[o.start] ? [null] : [])], lemmas: [...(ayah.lemmas?.slice(0, o.start) ?? []), ...(ayah.conjs?.[o.start] ? [null] : [])] };
  });
  const prefixIds = wordIds(before);
  occurrences.forEach((o, i) => {
    const words = before[i].words;
    const id = prefixIds[i].join(',');
    const entry = prefixes.get(id) ?? { word: words.join(' '), conj: '', keys: [], id: group.id, forms: {} };
    entry.keys.push(o.key);
    entry.forms![o.key] = words;
    prefixes.set(id, entry);
  });
  const variants = [...prefixes.values()].map(prefix => {
    const forms = Object.values(prefix.forms!);
    const word = forms[0].map((_, i) => sharedDisplay(forms.map(words => words[i]))).join(' ');
    return { ...prefix, word, ...(new Set(forms.map(words => words.join(' '))).size > 1 ? {} : { forms: undefined }) };
  });
  return { tree: grow(expanded.map((_, i) => i), 0), prefixes: variants, offsets: Object.fromEntries(occurrences.map(o => [o.key, o.start])) };
}

export function phraseSubtreeTargets(tree: Branch, groups: PhraseGroup[], ayat: BranchAyah[]): Record<string, PhraseGroup> {
  const byKey = new Map(ayat.map(entry => [entry.key, entry]));
  const targets: Record<string, PhraseGroup> = {};
  const visit = (node: Branch) => {
    const end = node.words.findIndex(word => word === '۝' || word.startsWith('﴿'));
    const memberKeys = keys(node);
    if (end >= 2 && node.children.length > 0) {
      const id = phraseId(node.words.slice(0, end));
      for (const group of groups) {
        if (group.id !== id && !group.id.startsWith(`${id}~`)) continue;
        const wanted = new Set(memberKeys);
        const occurrences = group.occurrences.filter(occurrence => {
          const entry = byKey.get(occurrence.key);
          return wanted.has(occurrence.key) && occurrence.end === entry?.words.length && phraseId(entry.words.slice(occurrence.start, occurrence.end)) === id;
        });
        if (new Set(occurrences.map(occurrence => occurrence.key)).size === wanted.size) {
          targets[memberKeys.join(' ')] = { ...group, occurrences };
          break;
        }
      }
    }
    node.children.forEach(visit);
  };
  visit(tree);
  return targets;
}

export function phrasePieces(group: PhraseGroup, ayat: BranchAyah[]): PhraseGroup[] {
  const unique = members(group.occurrences);
  if (unique.length <= PIECE_MAX) return [group];
  const tree = phrasePresentation(group, ayat).tree;
  const chunks: string[][] = [];
  const under = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(under)];
  const cut = (keys: string[]) => {
    for (let i = 0; i < keys.length; i += PIECE_MAX) chunks.push(keys.slice(i, i + PIECE_MAX));
  };
  const walk = (node: Branch) => {
    const keys = under(node);
    if (keys.length <= PIECE_MAX) { chunks.push(keys); return; }
    if (!node.children.some(child => under(child).length > 1)) { cut(keys); return; }
    const singles = [...node.ayat];
    node.children.forEach(child => {
      const keys = under(child);
      if (keys.length > 1) walk(child);
      else singles.push(...keys);
    });
    cut(singles);
  };
  walk(tree);
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i].length !== 1) continue;
    const other = chunks.findIndex((chunk, at) => at !== i && chunk.length > 1 && chunk.length < PIECE_MAX);
    if (other >= 0) { chunks[other].push(...chunks[i]); chunks.splice(i, 1); }
    else {
      const donor = chunks.find(chunk => chunk.length > 2);
      if (donor) chunks[i].unshift(donor.pop()!);
    }
  }
  return chunks.map(keys => ({ ...group, id: `${group.id}~piece:${keys[0]}`, occurrences: group.occurrences.filter(o => keys.includes(o.key)) }));
}
