// docs/plans/quran-shared-openings.md
import type { JuzRange } from './juz';
import { normalizeWord } from './normalize';
import type { ReaderPageData } from './readerPage';

export type BranchAyah = { key: string; page: number; words: string[]; conj?: string };
export type Branch = { words: string[]; ayat: string[]; children: Branch[] };
export type Opening = { id: string; text: string; count: number };
export type Variant = { word: string; conj: string; keys: string[]; id?: string };

export const OPENING_WORDS = 2;
export const TOP = 8;

export type BranchesView = { list?: boolean; grouped?: boolean; page?: number };

export function branchesHref(id: string, juz?: JuzRange, view: BranchesView = {}) {
  const params = new URLSearchParams({ o: id });
  if (juz) params.set('juzFrom', `${juz.from}`);
  if (juz) params.set('juzTo', `${juz.to}`);
  if (view.list) params.set('v', 'list');
  if (view.list && view.grouped) params.set('g', 'opening');
  if (view.list && view.page && view.page > 1) params.set('p', `${view.page}`);
  return `/quran/branches?${params}`;
}

export function readerAyat(pages: ReaderPageData[]): BranchAyah[] {
  const ayat: BranchAyah[] = [];
  let surah = 0;
  let words: string[] = [];
  pages.forEach((data, i) => {
    for (const item of data.items) {
      if ('surah' in item) {
        surah = item.surah;
        continue;
      }
      for (const token of item.line) {
        if (typeof token === 'number') {
          ayat.push({ key: `${surah}:${token}`, page: i + 1, words });
          words = [];
        } else {
          const word = token.split(' ').filter(piece => normalizeWord(piece) !== '').join(' ');
          if (word) words.push(word);
        }
      }
    }
  });
  return ayat;
}

const CONJ: Record<string, string> = { w: 'و', f: 'ف' };

export function conjunctions(morphology: string): Map<string, string> {
  const found = new Map<string, string>();
  for (const match of morphology.matchAll(/^\((\d+:\d+):1:1\)\t[^\t]*\t[^\t]*\tPREFIX\|([wf]):(?!P\+)/gm)) found.set(match[1], CONJ[match[2]]);
  return found;
}

export function withConjunctions(ayat: BranchAyah[], morphology: string): BranchAyah[] {
  const found = conjunctions(morphology);
  return ayat.map(ayah => {
    const conj = found.get(ayah.key);
    if (!conj) return ayah;
    if (!normalizeWord(ayah.words[0]).startsWith(conj)) throw new Error(`${ayah.key} opens with ${ayah.words[0]}, not ${conj}`);
    return { ...ayah, conj };
  });
}

const norm = (ayah: BranchAyah) => ayah.words.map(normalizeWord);

export function stem(ayah: BranchAyah): BranchAyah {
  if (!ayah.conj) return ayah;
  const [first, ...rest] = ayah.words;
  let i = 1;
  while (i < first.length && normalizeWord(first[i]) === '') i++;
  return { ...ayah, words: [first.slice(i), ...rest] };
}

export const mixed = (ayat: BranchAyah[]) => new Set(ayat.map(ayah => ayah.conj ?? '')).size > 1;

export const shown = (ayat: BranchAyah[]) => (mixed(ayat) ? ayat.map(stem) : ayat);

export const openingId = (ayah: BranchAyah) =>
  ayah.words.length < OPENING_WORDS ? null : norm(stem(ayah)).slice(0, OPENING_WORDS).join(' ');

export function sharedOpenings(ayat: BranchAyah[]): Map<string, BranchAyah[]> {
  const groups = new Map<string, BranchAyah[]>();
  for (const ayah of ayat) {
    const id = openingId(ayah);
    if (id) groups.set(id, [...(groups.get(id) ?? []), ayah]);
  }
  return new Map([...groups].filter(([, group]) => group.length > 1));
}

function openingOf(group: BranchAyah[]): Opening {
  const words = shown(group)[0].words.slice(0, OPENING_WORDS);
  return { id: words.map(normalizeWord).join(' '), text: words.join(' '), count: group.length };
}

export function listOpenings(groups: Map<string, BranchAyah[]>): Opening[] {
  return [...groups]
    .map(([, group]) => openingOf(group))
    .sort((a, b) => b.count - a.count);
}

export const startsWith = (id: string, phrase: string) => `${id} `.startsWith(`${phrase} `);

export const opens = (ayah: BranchAyah, phrase: string) => startsWith(norm(ayah).join(' '), phrase) || startsWith(norm(stem(ayah)).join(' '), phrase);

export const startingWith = (ayat: BranchAyah[], phrase: string) => ayat.filter(ayah => opens(ayah, phrase));

export const size = (node: Branch): number => node.ayat.length + node.children.reduce((sum, child) => sum + size(child), 0);

export const keys = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(keys)];

export function listPhrases(groups: Map<string, BranchAyah[]>): Opening[] {
  const phrases = new Map(listOpenings(groups).map(o => [o.id, o]));
  const conj = new Map([...groups.values()].flat().map(ayah => [ayah.key, ayah.conj ?? '']));
  const walk = (node: Branch, path: string[], stemmed: boolean) => {
    const words = [...path, ...node.words];
    const under = keys(node).map(key => conj.get(key));
    if (under.length < 2) return;
    const id = words.map(normalizeWord).join(' ');
    if (!phrases.has(id) && (!stemmed || new Set(under).size > 1 || under[0] === '')) phrases.set(id, { id, text: words.join(' '), count: under.length });
    node.children.forEach(child => walk(child, words, stemmed));
  };
  groups.forEach(group => {
    walk(branch(shown(group)), [], mixed(group));
    if (!mixed(group)) return;
    const exact = new Map<string, BranchAyah[]>();
    for (const ayah of group) {
      const id = norm(ayah).slice(0, OPENING_WORDS).join(' ');
      exact.set(id, [...(exact.get(id) ?? []), ayah]);
    }
    exact.forEach(sub => walk(branch(sub), [], false));
  });
  return [...phrases.values()].sort((a, b) => b.count - a.count || a.id.length - b.id.length);
}

export function branch(ayat: BranchAyah[], from = 0): Branch {
  const norms = ayat.map(norm);
  let to = from;
  while (norms.every(n => n.length > to) && new Set(norms.map(n => n[to])).size === 1) to++;
  const children = new Map<string, BranchAyah[]>();
  ayat.forEach((ayah, i) => {
    if (norms[i].length > to) children.set(norms[i][to], [...(children.get(norms[i][to]) ?? []), ayah]);
  });
  return {
    words: ayat[0].words.slice(from, to),
    ayat: ayat.filter((_, i) => norms[i].length === to).map(ayah => ayah.key),
    children: [...children.values()].map(group => branch(group, to)),
  };
}

export const variants = (ayat: BranchAyah[]): Variant[] => !mixed(ayat) ? [] : ['', 'و', 'ف']
  .map(conj => ayat.filter(ayah => (ayah.conj ?? '') === conj))
  .filter(members => members.length > 0)
  .map(members => ({
    word: members[0].words[0],
    conj: members[0].conj ?? '',
    keys: members.map(ayah => ayah.key),
    id: members.length > 1 ? branch(members).words.map(normalizeWord).join(' ') : undefined,
  }));

export function linkId(words: string[], conjs: string[]) {
  const id = words.map(normalizeWord).join(' ');
  return conjs.length > 0 && conjs[0] !== '' && conjs.every(conj => conj === conjs[0]) ? `${conjs[0]}${id}` : id;
}

export const DEFAULT_PHRASE = 'ان المتقين';

export function pickPhrase(phrases: Opening[], wanted: string | null) {
  const known = (id: string | null) => id !== null && phrases.some(phrase => phrase.id === id);
  if (known(wanted)) return wanted!;
  if (known(DEFAULT_PHRASE)) return DEFAULT_PHRASE;
  return [...phrases].sort((a, b) => b.count - a.count || a.id.split(' ').length - b.id.split(' ').length)[0]?.id ?? '';
}

export function widerPhrases(phrases: Opening[], id: string, group: BranchAyah[]) {
  const length = (phrase: string) => phrase.split(' ').length;
  return phrases
    .filter(phrase => phrase.id !== id && (length(phrase.id) < length(id) || (length(phrase.id) === length(id) && phrase.count > group.length)) && group.every(ayah => opens(ayah, phrase.id)))
    .sort((a, b) => a.id.length - b.id.length);
}

export const PIECE_MAX = 6;

export type Piece = { id: string; text: string; count: number; shared: number; opening: Opening; keys: string[] };

const mushafOrder = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return surah * 1000 + ayah;
};

export function pieces(groups: Map<string, BranchAyah[]>): Piece[] {
  const found: Piece[] = [];
  groups.forEach(group => {
    const opening = openingOf(group);
    const conj = new Map(group.map(ayah => [ayah.key, mixed(group) ? (ayah.conj ?? '') : '']));
    const walk = (node: Branch, path: string[]) => {
      const words = [...path, ...node.words];
      const under = keys(node);
      if (under.length < 2) return;
      if (under.length > PIECE_MAX && node.children.some(child => keys(child).length > 1)) {
        node.children.forEach(child => walk(child, words));
        return;
      }
      const spellings = new Set(under.map(key => conj.get(key)));
      if (under.length > PIECE_MAX && spellings.size > 1) {
        spellings.forEach(spelling => {
          const sub = group.filter(ayah => under.includes(ayah.key) && conj.get(ayah.key) === spelling);
          if (sub.length < 2) return;
          const own = branch(sub).words;
          found.push({ id: own.map(normalizeWord).join(' '), text: own.join(' '), count: sub.length, shared: own.length, opening, keys: sub.map(ayah => ayah.key) });
        });
        return;
      }
      found.push({ id: linkId(words, under.map(key => conj.get(key)!)), text: words.join(' '), count: under.length, shared: words.length, opening, keys: under });
    };
    walk(branch(shown(group)), []);
  });
  const first = (piece: Piece) => Math.min(...piece.keys.map(mushafOrder));
  return found.sort((a, b) => b.shared - a.shared || a.count - b.count || first(a) - first(b));
}

export function listPage(value: string | null, total: number, perPage: number) {
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  return { page: Math.min(pageCount, Math.max(1, Number.parseInt(value ?? '1', 10) || 1)), pageCount };
}
