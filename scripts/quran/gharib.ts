// see docs/plans/alfaz-al-quran.md
import { same, skeleton } from './irabUkbari';
import { firstWords, placesOf, type MushafWord, type TurathPage } from './itqanBalagha';
import type { GharibEntry, GharibPlace, MufradatEntry } from '../../shared/quran/gharib';
import { spellSigns } from './signs';

export { firstWords, type MushafWord, type TurathPage };

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const number = (text: string) => Number([...text].map(c => ARABIC_DIGITS.indexOf(c)).join(''));

export const authorText = (text: string) =>
  text.split('_________')[0]
    .replace(/<span data-type="title"[^>]*>([^<]*)<\/span>/g, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s*\(\s*[٠-٩]+\s*\)/g, '')
    .replace(/\s*«\s*[٠-٩]+\s*»/g, '')
    .replace(/[ \t]+([.،؛:])/g, '$1')
    .replace(/[^\n]+/g, spellSigns)
    .normalize('NFC');

const NUMBERED = /^([٠-٩]+)(?:\s*-\s*([٠-٩]+))?\s*-\s*/;
const OPENS = /^(?:و\s*)?[﴿(]/;
const SURAH = /^سُ?ورة\s/;

export type RawEntry = { surah: number; from: number; to: number; numbered: boolean; page: number; id: number; text: string };

export function readGharib(pages: (TurathPage & { id: number })[]): RawEntry[] {
  const entries: RawEntry[] = [];
  let surah = 0;
  let from = 0;
  let to = 0;
  for (const page of pages) {
    for (const raw of authorText(page.text).split('\n')) {
      const line = raw.trim();
      if (!line || /^\*(\s*\*)*$/.test(line)) continue;
      if (SURAH.test(line)) { surah++; from = to = 0; continue; }
      if (!surah) continue;
      const head = line.match(NUMBERED);
      if (head) {
        from = number(head[1]);
        to = head[2] ? number(head[2]) : from;
        entries.push({ surah, from, to, numbered: true, page: page.page, id: page.id, text: line });
      } else if (OPENS.test(line) && entries.length) {
        entries.push({ surah, from, to, numbered: false, page: page.page, id: page.id, text: line });
      } else if (entries.length && entries.at(-1)!.surah === surah) {
        entries.at(-1)!.text += `\n${line}`;
      }
    }
  }
  return entries;
}

export function quotesOf(text: string): string[] {
  const line = text.split('\n')[0];
  const marked = [...line.matchAll(/﴿([^﴾]*)﴾/g)].map(match => match[1]);
  if (marked.length) return marked.flatMap(quote => quote.split('*').map(part => part.trim()).filter(Boolean));
  const paren = line.replace(NUMBERED, '').match(/^(?:و\s*)?\(([^)]+)\)/);
  return paren ? [paren[1]] : [];
}

const firm = (word: string) => letters(word).replace(/ـ/g, '').replace(/^(?:وال|فال|بال|ال|و|ف)(?=...)/, '').replace(/[ءا]/g, '').replace(/ة/g, 'ه').replace(/[^ء-ي]/g, '');
const quoteTokens = (quote: string) => quote.replace(/[^ء-ۭ\s]/g, ' ').split(/\s+/).filter(Boolean);
function firmlyOne(his: string, mushaf: string | undefined) {
  if (!mushaf) return false;
  const [a, b] = [firm(his), firm(mushaf)];
  const prefixed = (long: string, short: string) => long.endsWith(short) && /^[وفبكل]{1,2}$/.test(long.slice(0, long.length - short.length));
  return a.length > 0 && b.length > 0 && (a === b || prefixed(a, b) || prefixed(b, a));
}

const loose = (word: string) => word.replace(/^[وف](?=..)/, '').replace(/^[بكل]?ال(?=..)/, '').replace(/^[بكل](?=...)/, '');

function looseRun(quote: string[], ayah: MushafWord[]): [number, number] | null {
  const want = quote.map(loose);
  if (!want.length) return null;
  for (let start = 0; start < ayah.length; start++) {
    let i = 0;
    let j = start;
    while (i < want.length && j < ayah.length) {
      const have = loose(ayah[j].skeleton);
      if (want[i] === have) i++;
      else if (i + 1 < want.length && want[i] + want[i + 1] === have) i += 2;
      else break;
      j++;
    }
    if (i === want.length) return [ayah[start].at, ayah[j - 1].at];
  }
  return null;
}

export function placeEntry(entry: RawEntry, mushaf: MushafWord[], first: Map<string, number[]>, after: number): GharibPlace[] {
  const places: GharibPlace[] = [];
  const add = (ayah: number, from: number, to: number) => {
    const run = places.find(place => place[0] === ayah && place[2] === from - 1);
    if (run) run[2] = to;
    else places.push([ayah, from, to]);
  };
  const ayahWords = (ayah: number) => mushaf.filter(word => word.surah === entry.surah && word.ayah === ayah);
  let floor = after;
  for (const quote of quotesOf(entry.text)) {
    const tokens = quote.replace(/[^ء-ۭ\s]/g, ' ').split(/\s+/).map(skeleton).filter(Boolean);
    const starts = placesOf(quote, mushaf, first).filter(start => mushaf[start].surah === entry.surah);
    const pick = (pool: number[]) => {
      const inRange = pool.filter(start => mushaf[start].ayah >= entry.from && mushaf[start].ayah <= entry.to);
      const later = pool.filter(start => mushaf[start].ayah >= floor).sort((a, b) => a - b);
      return entry.numbered ? inRange[0] : later[0] ?? (pool.length === 1 ? pool[0] : undefined);
    };
    const firmly = (start: number) => quoteTokens(quote).every((token, j) => firmlyOne(token, mushaf[start + j]?.text));
    const firmStart = pick(starts.filter(firmly));
    if (firmStart === undefined && !starts.some(firmly)) {
      const near = entry.numbered ? Array.from({ length: entry.to - entry.from + 1 }, (_, i) => entry.from + i) : floor ? [floor, floor + 1, floor + 2] : [];
      const found = near.map(ayah => ({ ayah, words: ayahWords(ayah), run: looseRun(tokens, ayahWords(ayah)) }))
        .find(({ words, run }) => run && firmly(mushaf.indexOf(words.find(word => word.at === run[0])!)));
      if (found?.run) { add(found.ayah, found.run[0], found.run[1]); floor = found.ayah; continue; }
    }
    const start = firmStart ?? pick(starts);
    if (start !== undefined) {
      for (let j = 0; j < tokens.length; j++) {
        const word = mushaf[start + j];
        if (!word || word.surah !== entry.surah) break;
        add(word.ayah, word.at, word.at);
      }
      floor = mushaf[start].ayah;
      continue;
    }
    const near = entry.numbered ? Array.from({ length: entry.to - entry.from + 1 }, (_, i) => entry.from + i) : floor ? [floor, floor + 1, floor + 2] : [];
    for (const ayah of near) {
      const run = looseRun(tokens, ayahWords(ayah));
      if (run) { add(ayah, run[0], run[1]); floor = ayah; break; }
    }
  }
  if (!places.length && entry.numbered && ayahWords(entry.from).length) places.push([entry.from, -1, -1]);
  return places;
}

export const gharibEntry = (entry: RawEntry, places: GharibPlace[]): GharibEntry => [entry.surah, entry.page, entry.id, entry.text, places];

export function readMufradat(pages: (TurathPage & { id: number })[]): MufradatEntry[] {
  const entries: MufradatEntry[] = [];
  let started = false;
  let ended = false;
  for (const page of pages) {
    for (const raw of page.text.split('_________')[0].split('\n')) {
      const line = raw.trim();
      const title = line.match(/^(?:<span data-type="title"[^>]*>)+([^<]*)(?:<\/span>)+\s*(?:«[٠-٩]+»)?$/)?.[1].trim();
      const plain = line.replace(/<[^>]+>/g, '').trim().normalize('NFC');
      const heading = title?.normalize('NFC') ?? (/^[ء-ي\u064B-\u0652\u0670]{2,6}$/.test(plain) ? plain : undefined);
      if (heading) {
        if (/^كتاب\s/.test(heading)) { started = true; continue; }
        if (/^مقدّمة للفهارس/.test(heading)) ended = true;
        if (started && !ended) entries.push([heading, page.page, page.page, page.id, '']);
        continue;
      }
      if (!started || ended || !entries.length) continue;
      const text = authorText(line.replace(/<[^>]+>/g, '')).replace(/^[٠-٩]+\s*-\s*$/, '').trim();
      if (!text) continue;
      const last = entries.at(-1)!;
      last[4] = last[4] ? `${last[4]}${text.startsWith('[') ? ' ' : '\n'}${text}` : text;
      last[2] = page.page;
    }
  }
  return entries.filter(entry => entry[4]);
}

export const letters = (text: string) => text.normalize('NFC').replace(/[ً-ٰٟۖ-ۭ]/g, '').replace(/[أإآٱؤئء]/g, 'ء').replace(/ى/g, 'ي');

export function headingsFor(root: string, headings: Map<string, number[]>): number[] {
  const r = letters(root).replace(/ا/g, 'ء');
  const weakLast = r.length === 3 && /[وي]/.test(r[2]);
  const tiers: string[][] = [
    [r, ...(r.length === 3 && r[1] === r[2] ? [r.slice(0, 2)] : [])],
    [...(weakLast ? (r[2] === 'و' ? [`${r.slice(0, 2)}ا`, `${r.slice(0, 2)}و`] : [`${r.slice(0, 2)}ي`]) : []), ...(r.length === 3 && /[وي]/.test(r[1]) ? [`${r[0]}ا${r[2]}`] : [])],
    weakLast ? [r.slice(0, 2)] : [],
  ];
  for (const forms of tiers) {
    const found = [...new Set(forms.flatMap(form => headings.get(form) ?? []))];
    if (found.length) return found;
  }
  return [];
}

export { same };

const VOWELS = /[\u064B-\u0652\u0670\u0640]/;
const VOWELS_ALL = /[\u064B-\u0652\u0670\u0640]/g;

export type MeaningPick = { asked: number; others: [number, number, number] };

export function meaningOf(entry: { text: string; places: GharibPlace[] }): string | null {
  if (!entry.places.length || entry.places[0][1] < 0) return null;
  const voweled = entry.text.split('\n')[0].replace(NUMBERED, '');
  const at: number[] = [];
  let line = '';
  [...voweled].forEach((char, i) => { if (!VOWELS.test(char)) { at.push(i); line += char; } });
  at.push(voweled.length);
  const quote = line.match(/^(?:و\s*)?(?:﴿[^﴾]*﴾|\([^)]*\))\s*:?\s*/);
  if (!quote) return null;
  if (quote[0].replace(/[^ء-ۭ\s]/g, ' ').trim().split(/\s+/).length > 8) return null;
  let from = quote[0].length;
  const hedged = line.slice(from).match(/^و?يقال\s*:\s*/);
  if (hedged) {
    from += hedged[0].length;
    if (/يقال|قيل|\sأو\s/.test(line.slice(from)) || /يقال|قيل/.test(entry.text.split('\n').slice(1).join(' ').replace(VOWELS_ALL, ''))) return null;
  }
  const lead = line.slice(from).match(/^(?:أي|يعني|يريد|هم)(?=[\s:])\s*:?\s*/)?.[0] ?? '';
  const body = line.slice(from + lead.length);
  const end = body.search(/[.؛:]/);
  let first = end < 0 ? body : body.slice(0, end);
  if (body[end] === ':') {
    const note = first.match(/(?:[،,]?\s*(?:و?واحدها|و?واحده|و?واحدهم|والواحد|و?يقال|ومنه))+\s*$/);
    if (!note || /(?:كأنه|كأن|أي|يعني)\s*[،,]?\s*$/.test(first.slice(0, note.index))) return null;
    first = first.slice(0, note.index);
  }
  first = first.trimEnd();
  const plain = (lead + first + (body[end] === '.' && first.length === (end < 0 ? body : body.slice(0, end)).trimEnd().length ? '.' : '')).trim();
  const next = body.slice(first.length).match(/^[.؛:،,]?\s*(?:و(?:يقال|قيل)(?:\s+أيضا)?\s*:|وفيه قول آخر)\s*([^.]*)/);
  if (next && !/إذا|[:؛]\s*أي/.test(next[1].replace(/\[[^\]]*\]/g, ''))) return null;
  const words = plain.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 10 || !/^[ء-ي]/.test(first)) return null;
  if (!first.split(/[\s،]+/).some(word => /[ء-ي]{3}/.test(word) && !/^و?(?:ذلك|هذا|هذه|ذاك|هؤلاء|أولئك|الذي|التي|الذين|يعني|أي|يريد|لكم|لهم|لها|له|بها|به|بهم|عليه|عليها|عليهم|عليكم|منه|منها|منهم|فيه|فيها|إليه|إليها|إليهم|عنه|عنها|عنهم)$/.test(word))) return null;
  if (/^(?:واحد|جمع)/.test(first) || /(?:^|\s)(?:من|في|على|إلى|عن|ب)\s*$/.test(first)) return null;
  if (/[﴿\[\]"«(]|يقال|قيل|قال|المشكل|تقدم|ذكرت|ذكرنا|بينت|بينا|بيناه|مبين في|مفسر|كتاب|موضع|مجاز|(?:^|\s)أو\s/.test(plain)) return null;
  const start = from + (line.slice(from).length - line.slice(from).trimStart().length);
  return voweled.slice(at[start], at[start + plain.length]).trim();
}

const contentWords = (meaning: string) => new Set(meaning.split(/[\s،؛.:]+/).map(word => skeleton(word).replace(/^(?:وال|فال|بال|لل|ال|و|ف|ب)(?=...)/, '')).filter(word => word.length >= 3 && !['يعني', 'الذي', 'التي', 'الذين', 'ذلك'].includes(word)).map(word => word.slice(0, 3)));

const POINTS = /^(?:يعني|هم|هي|هو|وهو|وهي)\s*:?\s/;

export function meaningPicks(entries: { surah: number; text: string; places: GharibPlace[]; quote: string; roots?: string[] }[], apart: [string, string][] = []): MeaningPick[] {
  const bare = (text: string) => letters(text).replace(/[^ء-ي\s]/g, '');
  const clash = (a: string, b: string) => apart.some(([x, y]) => (bare(a).includes(x) && bare(b).includes(y)) || (bare(a).includes(y) && bare(b).includes(x)));
  const askable = entries.map((entry, at) => ({ at, entry, meaning: meaningOf(entry) })).filter((item): item is { at: number; entry: typeof entries[number]; meaning: string } => !!item.meaning);
  const picks: MeaningPick[] = [];
  for (const item of askable) {
    const ayah = item.entry.places[0][0];
    const length = item.meaning.split(/\s+/).length;
    const taken = [contentWords(item.meaning)];
    const seen = new Set([item.meaning.replace(/[.\s]/g, '')]);
    const quote = skeleton(item.entry.quote);
    const lit = (entry: { surah: number; places: GharibPlace[] }) => `${entry.surah}:${entry.places[0][0]}:${entry.places[0][1]}`;
    const explained = new Set([lit(item.entry)]);
    const pool = askable
      .filter(other => other.at !== item.at && skeleton(other.entry.quote) !== quote && Math.abs(other.entry.surah - item.entry.surah) <= 3
        && !(other.entry.surah === item.entry.surah && other.entry.places[0][0] === ayah) && !POINTS.test(letters(other.meaning))
        && !(other.entry.roots ?? []).some(root => (item.entry.roots ?? []).includes(root)))
      .map(other => ({ other, distance: Math.abs(other.entry.surah - item.entry.surah) * 1000 + Math.abs(other.entry.places[0][0] - ayah) + Math.abs(other.meaning.split(/\s+/).length - length) * 5 }))
      .sort((a, b) => a.distance - b.distance || a.other.at - b.other.at);
    const others: number[] = [];
    for (const { other } of pool) {
      const flat = other.meaning.replace(/[.\s]/g, '');
      const words = contentWords(other.meaning);
      if (seen.has(flat) || explained.has(lit(other.entry)) || taken.some(set => [...words].some(word => set.has(word))) || clash(item.meaning, other.meaning)) continue;
      others.push(other.at);
      seen.add(flat);
      explained.add(lit(other.entry));
      taken.push(words);
      if (others.length === 3) break;
    }
    if (others.length === 3) picks.push({ asked: item.at, others: others as [number, number, number] });
  }
  return picks;
}
