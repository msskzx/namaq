// docs/plans/quran-shared-openings.md
import type { BranchView } from './branchView';
import { num } from './arabicNumber';
import type { GroupFilters } from './mutashabih/browse';
import type { JuzRange } from './juz';
import { normalizeWord } from './normalize';
import { findText, firstLevel, searchQuery, textKeys, type Level, type SearchQuery } from './searchText';
import type { ReaderPageData } from './readerPage';

export type WordFeatures = { gender?: string; number?: string; case?: string; pos?: string };

export type BranchAyah = { features?: (WordFeatures | null)[]; key: string; page: number; words: string[]; roots?: (string | null)[]; lemmas?: (string | null)[]; conjs?: (string | null)[]; conj?: string; next?: string[]; nextRoots?: (string | null)[]; nextLemmas?: (string | null)[]; through?: string };
export type Branch = { words: string[]; ayat: string[]; children: Branch[]; forms?: Record<string, string[]>; partition?: string; through?: Record<string, string> };
export type Opening = { id: string; text: string; count: number; partition?: string; textEn?: string; aliases?: string[] };
export type Variant = { words?: string[]; word: string; conj: string; keys: string[]; id: string; forms?: Record<string, string[]>; partition?: string };

const OPENING_WORDS = 2;

const CHAPTER_OPENINGS = new Map<string, string>(Object.entries({
  'الم': [2, 3, 29, 30, 31, 32],
  'المص': [7],
  'الر': [10, 11, 12, 14, 15],
  'المر': [13],
  'كهيعص': [19],
  'طه': [20],
  'طسم': [26, 28],
  'طس': [27],
  'يس': [36],
  'ص': [38],
  'حم': [40, 41, 42, 43, 44, 45, 46],
  'ق': [50],
  'ن': [68],
}).flatMap(([letters, chapters]) => chapters.map(chapter => [`${chapter}:1`, letters] as const)));

const chapterOpening = (ayah: BranchAyah) => {
  const opening = CHAPTER_OPENINGS.get(ayah.key);
  return opening && normalizeWord(ayah.words[0]) === opening.split(' ')[0] ? opening : undefined;
};
const openingLength = (ayah: BranchAyah) => chapterOpening(ayah)?.split(' ').length ?? OPENING_WORDS;

export type BranchesView = { scope?: 'all' | 'opening' | 'inside'; kind?: 'inside'; phraseId?: string; occurrences?: string[]; grouped?: boolean; page?: number; spelling?: string; partition?: string; context?: boolean; query?: string; surah?: number; mode?: 'list' | BranchView; card?: number | 'last'; saved?: string[]; filters?: GroupFilters };

export function branchesHref(id: string, juz?: JuzRange, view: BranchesView = {}) {
  const params = new URLSearchParams();
  if (id) params.set('o', id);
  if (id && view.occurrences?.length) params.set('at', view.occurrences.join(','));
  if (juz) params.set('juzFrom', `${juz.from}`);
  if (juz) params.set('juzTo', `${juz.to}`);
  if (view.page && view.page > 1) params.set('p', `${view.page}`);
  if (id && view.context) params.set('c', '1');
  if (view.mode === 'cards' || view.mode === 'tree' || (view.mode === 'list' && !id)) params.set('m', view.mode);
  if (id && view.mode === 'cards' && view.card && view.card !== 1) params.set('n', `${view.card}`);
  if (view.query) params.set('q', view.query);
  if (view.surah) params.set('s', `${view.surah}`);
  if (view.saved?.length) params.set('b', view.saved.join('|'));
  for (const [key, value] of Object.entries(view.filters ?? {})) if (value) params.set(key, value);
  return `/quran/branches${params.size ? `?${params}` : ''}`;
}

export function readerAyat(pages: ReaderPageData[], pageOf?: Map<string, number>): BranchAyah[] {
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
          ayat.push({ key: `${surah}:${token}`, page: pageOf?.get(`${surah}:${token}`) ?? i + 1, words });
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
  for (const match of morphology.matchAll(/^\((\d+:\d+:\d+):1\)\t[^\t]*\t[^\t]*\tPREFIX\|([wf]):(?!P\+)/gm)) found.set(match[1], CONJ[match[2]]);
  return found;
}

export function withConjunctions(ayat: BranchAyah[], morphology: string): BranchAyah[] {
  const found = conjunctions(morphology);
  return ayat.map(ayah => {
    const conjs = ayah.words.map((word, i) => {
      const location = `${ayah.key}:${i + 1}`;
      const conj = found.get(location) ?? null;
      if (conj && !normalizeWord(word).startsWith(conj)) throw new Error(`${location} starts with ${word}, not ${conj}`);
      return conj;
    });
    if (!conjs.some(Boolean)) return ayah;
    return { ...ayah, conjs, ...(conjs[0] ? { conj: conjs[0] } : {}) };
  });
}

export function withRoots(ayat: BranchAyah[], morphology: string): BranchAyah[] {
  const roots = new Map<string, string | null>();
  const lemmas = new Map<string, string | null>();
  const join = (found: Map<string, string | null>, location: string, value: string | null) => {
    const previous = found.get(location);
    found.set(location, previous && value ? `${previous}+${value}` : previous ?? value);
  };
  for (const match of morphology.matchAll(/^\((\d+:\d+:\d+):\d+\)\t[^\t]*\t[^\t]*\t(STEM[^\r\n]*)/gm)) {
    join(roots, match[1], match[2].match(/(?:^|\|)ROOT:([^|\r\n]+)/)?.[1] ?? null);
    join(lemmas, match[1], match[2].match(/(?:^|\|)LEM:([^|\r\n]+)/)?.[1] ?? null);
  }
  const at = (ayah: BranchAyah, i: number) => {
    const location = `${ayah.key}:${i + 1}`;
    if (!roots.has(location)) throw new Error(`Missing STEM annotation at ${location}`);
    return location;
  };
  return ayat.map(ayah => ({ ...ayah, roots: ayah.words.map((_, i) => roots.get(at(ayah, i))!), lemmas: ayah.words.map((_, i) => lemmas.get(at(ayah, i))!) }));
}

const rootPartition = (ayah: BranchAyah, length: number) => {
  const source = length > ayah.words.length ? grown([ayah])[0] : ayah;
  return JSON.stringify(Array.from({ length }, (_, i) => source.roots?.[i] ?? null));
};
const memo = (f: (word: string) => string) => {
  const seen = new Map<string, string>();
  return (word: string) => seen.get(word) ?? seen.set(word, f(word)).get(word)!;
};

export const spell = (word: string) => word.replace(/[\u0640\u2060]/g, '').replace(/[\u06D6-\u06ED]/g, '').replace(/^(\p{L}[\u064B-\u0650]?)\u0651/u, '$1').replace(/\u0652$/u, '').normalize('NFC');

const spellingOf = memo(spell);

const lettersOf = memo(normalizeWord);

const sameWord = (a: BranchAyah, i: number, b: BranchAyah, j: number) => lettersOf(a.words[i]) === lettersOf(b.words[j])
  && (a.roots?.[i] ?? null) === (b.roots?.[j] ?? null)
  && (spellingOf(a.words[i]) === spellingOf(b.words[j]) || (a.lemmas?.[i] ?? null) === (b.lemmas?.[j] ?? null));

// Grown ayat end in ﴿n﴾; runs that end on different ayah numbers still share their node.
const END = '۝';
const isEnd = (word: string) => word.startsWith('﴿') || word === END;

/** Whether a node's words open a phrase the page can list: nothing past an ayah end, but a letter opening's own ﴿١﴾. */
export const linkable = (words: string[]) => words.every((word, i) => !isEnd(word) || i === 1);

const wordClasses = (ayat: BranchAyah[], at: number, preserveOpenings = false) => {
  const parent = ayat.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const first = new Map<string, number>();
  const join = (key: string, i: number) => {
    if (first.has(key)) parent[find(i)] = find(first.get(key)!);
    else first.set(key, i);
  };
  ayat.forEach((ayah, i) => {
    if (ayah.words.length <= at) return;
    const word = isEnd(ayah.words[at]) ? END : ayah.words[at];
    const letters = JSON.stringify([lettersOf(word), ayah.roots?.[at] ?? null]);
    join(`${letters}\u0000s${spellingOf(word)}`, i);
    if (!preserveOpenings) join(`${letters}\u0000l${ayah.lemmas?.[at] ?? null}`, i);
  });
  return ayat.map((ayah, i) => (ayah.words.length > at ? find(i) : -1));
};

const norm = (ayah: BranchAyah) => ayah.words.map(lettersOf);

export function stem(ayah: BranchAyah): BranchAyah {
  if (!ayah.conj) return ayah;
  const [first, ...rest] = ayah.words;
  let i = 1;
  while (i < first.length && normalizeWord(first[i]) === '') i++;
  return { ...ayah, words: [first.slice(i), ...rest] };
}

const split = (ayat: BranchAyah[]) => new Set(wordClasses(ayat, 0)).size > 1;

function shown(ayat: BranchAyah[]): BranchAyah[] {
  if (!split(ayat)) return ayat;
  const first = stem(ayat[0]).words[0];
  return ayat.map(ayah => ({ ...ayah, words: [first, ...ayah.words.slice(1)] }));
}

export const openingId = (ayah: BranchAyah) => chapterOpening(ayah) ??
  (ayah.words.length < OPENING_WORDS ? null : norm(stem(ayah)).slice(0, OPENING_WORDS).join(' '));

export function sharedOpenings(ayat: BranchAyah[]): Map<string, BranchAyah[]> {
  const groups = new Map<string, BranchAyah[]>();
  for (const ayah of ayat) {
    const id = openingId(ayah);
    const key = `${id}\u0000${rootPartition(ayah, openingLength(ayah))}`;
    if (id) groups.set(key, [...(groups.get(key) ?? []), ayah]);
  }
  const shared = [...groups].filter(([, group]) => group.length > 1);
  const counts = new Map<string, number>();
  shared.forEach(([, group]) => counts.set(openingId(group[0])!, (counts.get(openingId(group[0])!) ?? 0) + 1));
  return new Map(shared.map(([key, group]) => [counts.get(openingId(group[0])!) === 1 ? openingId(group[0])! : key, group]));
}

export const searchKey = (value: string) => normalizeWord(value.normalize('NFC')).replace(/[ؤئء]/g, 'ا').trim().split(/\s+/).join(' ').replace(/(^| )يا (?=\S)/g, '$1ي').replace(/ا+/g, 'ا');

/** The query, and without a leading و / ف on its first word, as the trees drop it. */
function queryForms(wanted: SearchQuery): SearchQuery[] {
  const [head, ...rest] = wanted.strict;
  return head && /^[وف]./.test(head) ? [wanted, searchQuery([head.slice(1), ...rest].join(' '))] : [wanted];
}

/**
 * Phrases holding the query at one level (see searchText.ts): the exact phrase, then phrases whose text opens with it,
 * whose text holds it, then those an alias or the English opens with or holds; within each, the closest (shortest) phrase first.
 */
function phrasesAt(phrases: Opening[], wanted: SearchQuery, english: string, level: Level) {
  const forms = queryForms(wanted);
  const found: { phrase: Opening; start: boolean; rank: number; length: number }[] = [];
  for (const phrase of phrases) {
    const own = textKeys(phrase.text);
    const aliases = (phrase.aliases ?? []).map(textKeys);
    const en = level === 'strict' && english && phrase.textEn ? phrase.textEn.toLowerCase() : '';
    const holds = (texts: ReturnType<typeof textKeys>[], start: boolean) => texts.some(words => forms.some(form => findText(words, form, level, start)));
    const exact = forms.some(form => form.strict.length === own.length && !!findText(own, form, level, true));
    const rank = exact ? 0 : holds([own], true) ? 1 : holds([own], false) ? 2 : holds(aliases, true) || (en && en.startsWith(english)) ? 3 : holds(aliases, false) || (en && en.includes(english)) ? 4 : -1;
    if (rank >= 0) found.push({ phrase, start: rank <= 1 || rank === 3, rank, length: own.length });
  }
  return found.sort((a, b) => a.rank - b.rank || a.length - b.length).map(({ phrase, start }) => ({ phrase, start }));
}

/**
 * Phrases holding the query; hamza-loose matches only when nothing matches as typed. When none holds it all,
 * the longest end of the query that some phrase holds (قل أطيعوا الله وأطيعوا الرسول finds أطيعوا الله وأطيعوا الرسول).
 */
function rankPhrases(phrases: Opening[], query: string): { phrase: Opening; start: boolean }[] {
  const wanted = searchQuery(query);
  const english = /[a-z]/i.test(query) ? query.trim().toLowerCase() : '';
  if (!wanted.strict.length && english) return phrasesAt(phrases, wanted, english, 'strict');
  for (let drop = 0; drop === 0 || wanted.strict.length - drop >= 2; drop++) {
    const tail = drop ? searchQuery(wanted.strict.slice(drop).join(' ')) : wanted;
    const found = firstLevel(tail, level => phrasesAt(phrases, tail, drop ? '' : english, level));
    if (found.length) return drop ? found.map(({ phrase }) => ({ phrase, start: false })) : found;
  }
  return [];
}

export const searchPhrases = (phrases: Opening[], query: string) => rankPhrases(phrases, query).map(found => found.phrase);

/** Does the text hold the query anywhere at this level (a leading و / ف on the query may be dropped)? */
export function textHolds(text: string, query: string, level: Level = 'strict'): boolean {
  const words = textKeys(text);
  const wanted = searchQuery(query);
  if (findText(words, wanted, level)) return true;
  const [head, ...rest] = wanted.strict;
  return !!head && /^[وف]./.test(head) && !!findText(words, searchQuery([head.slice(1), ...rest].join(' ')), level);
}

/** Is the text exactly the query, word for word? */
export function textIs(text: string, query: string): boolean {
  const words = textKeys(text);
  const wanted = searchQuery(query);
  return wanted.strict.length === words.length && (['strict', 'seat', 'loose'] as const).some(field => words.every((word, at) => word[field].includes(wanted[field][at])));
}

export const keys = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(keys)];

const continues = (ayah: BranchAyah, ayat: BranchAyah[]) => (!!chapterOpening(ayah) && ayah.words.length === 1) || ayat.some(other => other !== ayah && other.words.length > ayah.words.length && ayah.words.every((_, i) => sameWord(ayah, i, other, i)));

const identical = (a: BranchAyah, b: BranchAyah) => a.words.length === b.words.length && a.words.every((_, i) => sameWord(a, i, b, i));

const twinned = (ayah: BranchAyah, ayat: BranchAyah[]) => ayat.some(other => other !== ayah && other.key !== ayah.key && identical(ayah, other));

const ayahEnd = (key: string) => `﴿${num(Number(key.split(':')[1]))}﴾`;

export const grown = (ayat: BranchAyah[]) => ayat.map(ayah => (ayah.next && (continues(ayah, ayat) || twinned(ayah, ayat)) ? { ...ayah, words: [...ayah.words, ayahEnd(ayah.key), ...ayah.next], ...(ayah.roots && { roots: [...ayah.roots, null, ...(ayah.nextRoots ?? ayah.next.map(() => null))] }), ...(ayah.lemmas && { lemmas: [...ayah.lemmas, null, ...(ayah.nextLemmas ?? ayah.next.map(() => null))] }) } : ayah));

/** The ayat that follow, in mushaf order and across surahs, until this ayah's run parts from every identical twin's. */
function following(ayah: BranchAyah, twins: BranchAyah[], after: (key: string) => BranchAyah | undefined): BranchAyah[] {
  const run = (from: BranchAyah, length: number) => {
    const found: BranchAyah[] = [];
    for (let at = after(from.key); at && found.length < length; at = after(at.key)) found.push(at);
    return found;
  };
  for (let length = 1; ; length++) {
    const own = run(ayah, length);
    if (own.length < length || twins.every(twin => {
      const theirs = run(twin, length);
      return theirs.length !== own.length || theirs.some((next, i) => !identical(next, own[i]));
    })) return own;
  }
}

export function withNext(groups: Map<string, BranchAyah[]>, all: BranchAyah[]): BranchAyah[] {
  const index = new Map(all.map((ayah, i) => [ayah.key, i]));
  const after = (key: string) => all[index.get(key)! + 1];
  const selected = [...groups.values()].flatMap(group => {
    const own = shown(group);
    return group.map((ayah, i) => {
      const twins = own.filter(other => other.key !== ayah.key && identical(own[i], other));
      const run = twins.length ? following(ayah, twins, after) : (continues(ayah, group) || continues(own[i], own)) && after(ayah.key) ? [after(ayah.key)] : [];
      if (!run.length) return ayah;
      const joined = <T,>(pick: (next: BranchAyah) => T[]) => run.flatMap((next, j) => [...(j ? [null] : []), ...pick(next)]);
      return {
        ...ayah,
        next: run.flatMap((next, j) => [...(j ? [ayahEnd(run[j - 1].key)] : []), ...next.words]),
        ...(run[0].roots && { nextRoots: joined(next => next.roots!) }),
        ...(run[0].lemmas && { nextLemmas: joined(next => next.lemmas!) }),
        through: run[run.length - 1].key,
      };
    });
  });
  // An ayah can sit in an opening group and a chapter family; the copy that runs on wins.
  const byKey = new Map<string, BranchAyah>();
  selected.forEach(ayah => { if (!byKey.get(ayah.key)?.next || ayah.next) byKey.set(ayah.key, ayah); });
  return [...byKey.values()];
}

export function linkId(words: string[], conjs: string[]) {
  const id = words.map(normalizeWord).join(' ');
  return conjs.length > 0 && conjs[0] !== '' && conjs.every(conj => conj === conjs[0]) ? `${conjs[0]}${id}` : id;
}

export const PIECE_MAX = 6;

export function ayahEnds(node: Branch, path: string[] = []): Record<string, string> {
  const words = [...path, ...node.words];
  const grownPast = words.some(word => word.startsWith('﴿'));
  const own = node.ayat.map(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return [key, node.through?.[key] ?? (grownPast ? `${surah}:${ayah + 1}` : key)];
  });
  return Object.assign(Object.fromEntries(own), ...node.children.map(child => ayahEnds(child, words)));
}

