// docs/plans/quran-shared-openings.md
import { num } from './arabicNumber';
import type { JuzRange } from './juz';
import { normalizeWord } from './normalize';
import type { ReaderPageData } from './readerPage';

export type BranchAyah = { key: string; page: number; words: string[]; roots?: (string | null)[]; lemmas?: (string | null)[]; conj?: string; next?: string[]; nextRoots?: (string | null)[]; nextLemmas?: (string | null)[]; through?: string };
export type Branch = { words: string[]; ayat: string[]; children: Branch[]; forms?: Record<string, string[]>; partition?: string; through?: Record<string, string> };
export type Opening = { id: string; text: string; count: number; partition?: string; textEn?: string };
export type Variant = { word: string; conj: string; keys: string[]; id: string; forms?: Record<string, string[]>; partition?: string };

export const OPENING_WORDS = 2;
export const TOP = 8;

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

export type BranchScope = 'all' | 'opening' | 'inside';
export type BranchesView = { scope?: BranchScope; kind?: 'inside'; phraseId?: string; occurrences?: string[]; grouped?: boolean; page?: number; spelling?: string; partition?: string; context?: boolean; query?: string; surah?: number };

export function branchesHref(id: string, juz?: JuzRange, view: BranchesView = {}) {
  const params = new URLSearchParams();
  if (view.scope && view.scope !== 'all') params.set('scope', view.scope);
  if (id && view.kind === 'inside') params.set('kind', 'inside');
  if (id) params.set('o', id);
  if (id && view.kind === 'inside' && view.occurrences?.length) params.set('at', view.occurrences.join(','));
  if (juz) params.set('juzFrom', `${juz.from}`);
  if (juz) params.set('juzTo', `${juz.to}`);
  if (view.grouped) params.set('g', 'opening');
  if (view.page && view.page > 1) params.set('p', `${view.page}`);
  if (id && view.spelling) params.set('w', view.spelling);
  if (id && view.partition) params.set('r', view.partition);
  if (id && view.context) params.set('c', '1');
  if (!id && view.query) params.set('q', view.query);
  if (!id && view.surah) params.set('s', `${view.surah}`);
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

export const rootPartition = (ayah: BranchAyah, length: number) => {
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

const bySpelling = (ayat: BranchAyah[]) => {
  const classes = wordClasses(ayat, 0);
  const found = new Map<number, BranchAyah[]>();
  ayat.forEach((ayah, i) => found.set(classes[i], [...(found.get(classes[i]) ?? []), ayah]));
  return found;
};

const norm = (ayah: BranchAyah) => ayah.words.map(lettersOf);

const plain = (forms: string[]) => {
  if (forms.every(form => form === forms[0])) return forms[0];
  if (isEnd(forms[0])) return END;
  const letters = forms.map(form => form.replace(/[\u0640\u2060]/g, '').normalize('NFD').match(/[^\p{M}\u06D6-\u06ED][\p{M}\u06D6-\u06ED]*/gu) ?? []);
  if (letters.some(other => other.length !== letters[0].length || other.some((letter, i) => letter[0] !== letters[0][i][0]))) return forms[0];
  return letters[0].map((letter, i) => [...letter].filter((mark, at) => at === 0 || letters.every(other => other[i]?.includes(mark))).join('')).join('').normalize('NFC');
};

const originalForms = (entries: [string, string[]][]) => new Set(entries.map(([, words]) => words.map(word => (isEnd(word) ? END : word)).join(' '))).size > 1
  ? Object.fromEntries(entries)
  : undefined;

export function stem(ayah: BranchAyah): BranchAyah {
  if (!ayah.conj) return ayah;
  const [first, ...rest] = ayah.words;
  let i = 1;
  while (i < first.length && normalizeWord(first[i]) === '') i++;
  return { ...ayah, words: [first.slice(i), ...rest] };
}

export const mixed = (ayat: BranchAyah[]) => new Set(ayat.map(ayah => ayah.conj ?? '')).size > 1;

export const split = (ayat: BranchAyah[]) => new Set(wordClasses(ayat, 0)).size > 1;

export function shown(ayat: BranchAyah[]): BranchAyah[] {
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

function openingOf(group: BranchAyah[]): Opening {
  const words = shown(group)[0].words.slice(0, openingLength(group[0]));
  return { id: words.map(normalizeWord).join(' '), text: words.join(' '), count: group.length };
}

function distinguish<T extends Opening>(entries: T[]): T[] {
  const counts = new Map<string, number>();
  entries.forEach(entry => counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1));
  return entries.map(entry => {
    if (counts.get(entry.id)! > 1) return entry;
    const plain = { ...entry };
    delete plain.partition;
    return plain;
  });
}

export function listOpenings(groups: Map<string, BranchAyah[]>): Opening[] {
  return distinguish([...groups.values()].map(group => ({ ...openingOf(group), partition: rootPartition(group[0], openingLength(group[0])) })))
    .sort((a, b) => b.count - a.count);
}

export const startsWith = (id: string, phrase: string) => `${id} `.startsWith(`${phrase} `);

export const opens = (ayah: BranchAyah, phrase: string) => {
  if ([...CHAPTER_OPENINGS.values()].includes(phrase)) return chapterOpening(ayah) === phrase;
  const source = phrase.includes('﴿') ? grown([ayah])[0] : ayah;
  return startsWith(norm(source).join(' '), phrase) || startsWith(norm(stem(source)).join(' '), phrase);
};

export const searchKey = (value: string) => normalizeWord(value.normalize('NFC')).replace(/[ؤئء]/g, 'ا').trim().split(/\s+/).join(' ').replace(/(^| )يا (?=\S)/g, '$1ي').replace(/ا+/g, 'ا');

export function searchPhrases(phrases: Opening[], query: string) {
  const needle = searchKey(query);
  if (!needle) return [];
  const keyed = phrases.map(phrase => ({ phrase, values: [phrase.id, phrase.text, phrase.textEn ?? ''].map(searchKey) }));
  const starts = (candidate: typeof keyed[number]) => candidate.values.some(value => value.startsWith(needle));
  return [...keyed.filter(starts), ...keyed.filter(candidate => !starts(candidate) && candidate.values.some(value => value.includes(needle)))].map(candidate => candidate.phrase);
}

export const startingWith = (ayat: BranchAyah[], phrase: string, partition?: string) => ayat.filter(ayah => opens(ayah, phrase) && (!partition || rootPartition(ayah, phrase.split(' ').length) === partition));

export const size = (node: Branch): number => node.ayat.length + node.children.reduce((sum, child) => sum + size(child), 0);

export const keys = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(keys)];

export function listPhrases(groups: Map<string, BranchAyah[]>): Opening[] {
  const phrases = new Map<string, Opening>();
  const all = [...groups.values()].flat();
  const byKey = new Map(all.map(ayah => [ayah.key, ayah]));
  const conj = new Map(all.map(ayah => [ayah.key, ayah.conj ?? '']));
  const found = new Map<string, Set<string>>();
  const add = (id: string, text: string, members: BranchAyah[]) => {
    const partition = rootPartition(members[0], id.split(' ').length);
    const key = `${id}\u0000${partition}`;
    const seen = new Set([...(found.get(key) ?? []), ...members.map(ayah => ayah.key)]);
    found.set(key, seen);
    phrases.set(key, { ...(phrases.get(key) ?? { id, text, partition }), count: seen.size });
  };
  groups.forEach(group => {
    const opening = openingOf(group);
    add(opening.id, opening.text, group);
  });
  const walk = (node: Branch, path: string[], stemmed: boolean) => {
    const words = [...path, ...node.words];
    const under = keys(node);
    const conjs = under.map(key => conj.get(key));
    if (under.length < 2) return;
    const id = words.map(normalizeWord).join(' ');
    if (words.length >= OPENING_WORDS && (!stemmed || new Set(conjs).size > 1 || conjs[0] === '')) add(id, words.join(' '), under.map(key => byKey.get(key)!));
    node.children.forEach(child => walk(child, words, stemmed));
  };
  groups.forEach(group => {
    walk(phraseTree(group), [], mixed(group));
    if (!mixed(group)) return;
    const exact = new Map<string, BranchAyah[]>();
    for (const ayah of group) {
      const id = norm(ayah).slice(0, OPENING_WORDS).join(' ');
      exact.set(id, [...(exact.get(id) ?? []), ayah]);
    }
    exact.forEach(sub => walk(phraseTree(sub), [], false));
  });
  groups.forEach(group => {
    const linked = (node: Branch, path: string[], tagged: boolean) => {
      const words = [...path, ...node.words];
      if (path.length > 0 && node.children.length > 0 && linkable(words)) {
        const id = linkId(words, tagged ? keys(node).map(key => conj.get(key)!) : []);
        add(id, words.join(' '), keys(node).map(key => byKey.get(key)!));
      }
      node.children.forEach(child => linked(child, words, tagged));
    };
    linked(branch(group), [], split(group));
    if (split(group)) bySpelling(group).forEach(sub => sub.length > 1 && linked(branch(sub), [], false));
  });
  const ids = new Set([...phrases.values()].map(phrase => phrase.id));
  const matches = new Map<string, Map<string, BranchAyah[]>>();
  for (const ayah of all) {
    const seen = new Set<string>();
    for (const words of [norm(ayah), norm(stem(ayah))]) {
      for (let length = OPENING_WORDS; length <= words.length; length++) {
        const id = words.slice(0, length).join(' ');
        if (!ids.has(id) || seen.has(id)) continue;
        seen.add(id);
        const partition = rootPartition(ayah, length);
        const partitions = matches.get(id) ?? new Map<string, BranchAyah[]>();
        partitions.set(partition, [...(partitions.get(partition) ?? []), ayah]);
        matches.set(id, partitions);
      }
    }
  }
  matches.forEach((partitions, id) => {
    if (partitions.size < 2) return;
    partitions.forEach(members => {
      if (members.length < 2) return;
      const length = id.split(' ').length;
      const source = members.map(ayah => startsWith(norm(ayah).join(' '), id) ? ayah : stem(ayah));
      const text = source[0].words.slice(0, length).map((_, i) => plain(source.map(ayah => ayah.words[i]))).join(' ');
      add(id, text, members);
    });
  });
  return distinguish([...phrases.values()]).sort((a, b) => b.count - a.count || a.id.length - b.id.length);
}

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

const through = (ayat: BranchAyah[]) => (ayat.length ? { through: Object.fromEntries(ayat.map(ayah => [ayah.key, ayah.through!])) } : {});

function grow(ayat: BranchAyah[], from: number, firstWords?: Map<string, string>, preserveOpenings = false): Branch {
  let to = ayat.length === 1 ? ayat[0].words.length : from;
  let classes = wordClasses(ayat, to, preserveOpenings);
  while (classes.every(id => id === classes[0] && id >= 0)) classes = wordClasses(ayat, ++to, preserveOpenings);
  const children = new Map<number, BranchAyah[]>();
  ayat.forEach((ayah, i) => {
    if (classes[i] >= 0) children.set(classes[i], [...(children.get(classes[i]) ?? []), ayah]);
  });
  const words = ayat[0].words.slice(from, to).map((_, i) => plain(ayat.map(ayah => ayah.words[from + i])));
  const forms = originalForms(ayat.map(ayah => [ayah.key, ayah.words.slice(from, to).map((word, i) => from + i === 0 ? firstWords?.get(ayah.key) ?? word : word)]));
  return {
    words,
    ...(ayat[0].roots && { partition: rootPartition(ayat[0], to) }),
    ayat: ayat.filter(ayah => ayah.words.length === to).map(ayah => ayah.key),
    ...through(ayat.filter(ayah => ayah.words.length === to && ayah.through && ayah.words.some(isEnd))),
    children: [...children.values()].map(group => grow(group, to, undefined, preserveOpenings)),
    ...(forms && { forms }),
  };
}

export const branch = (ayat: BranchAyah[], preserveOpenings = false) => grow(grown(preserveOpenings ? ayat : shown(ayat)), 0, new Map(ayat.map(ayah => [ayah.key, ayah.words[0]])), preserveOpenings);

const trees = new WeakMap<BranchAyah[], Branch>();

export const phraseTree = (ayat: BranchAyah[]) => trees.get(ayat) ?? trees.set(ayat, grow(shown(ayat), 0)).get(ayat)!;

export const variants = (ayat: BranchAyah[]): Variant[] => !split(ayat) ? [] : [...bySpelling(ayat).values()]
  .map(members => ({
    word: plain(members.map(ayah => ayah.words[0])),
    conj: members[0].conj ?? '',
    keys: members.map(ayah => ayah.key),
    id: phraseTree(ayat).words.map(normalizeWord).join(' '),
    forms: originalForms(members.map(ayah => [ayah.key, [ayah.words[0]]])),
    ...(members[0].roots && { partition: rootPartition(members[0], phraseTree(ayat).words.length) }),
  }))
  .sort((a, b) => Math.min(...a.keys.map(mushafOrder)) - Math.min(...b.keys.map(mushafOrder)));

export function spelledAs(ayat: BranchAyah[], spelling: string | null) {
  if (!spelling) return [];
  const exact = ayat.filter(ayah => spell(ayah.words[0]) === spell(spelling));
  const seeds = exact.length > 0 ? exact : ayat.filter(ayah => normalizeWord(ayah.words[0]) === normalizeWord(spelling));
  return ayat.filter(ayah => seeds.some(seed => sameWord(seed, 0, ayah, 0)));
}

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
    .filter(phrase => phrase.id !== id && (length(phrase.id) < length(id) || (length(phrase.id) === length(id) && phrase.count > group.length)) && group.every(ayah => opens(ayah, phrase.id) && (!phrase.partition || rootPartition(ayah, length(phrase.id)) === phrase.partition)))
    .sort((a, b) => a.id.length - b.id.length);
}

export const PIECE_MAX = 6;

export type Piece = { family?: boolean; partition?: string; id: string; text: string; count: number; shared: number; opening: Opening; keys: string[] };

const mushafOrder = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return surah * 1000 + ayah;
};

export function pieces(groups: Map<string, BranchAyah[]>, phrases = listPhrases(groups)): Piece[] {
  const found: Piece[] = [];
  const openings = listOpenings(groups);
  groups.forEach(group => {
    const base = openingOf(group);
    const opening = openings.find(candidate => candidate.id === base.id && (!candidate.partition || candidate.partition === rootPartition(group[0], openingLength(group[0]))))!;
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
          const own = phraseTree(sub).words;
          found.push({ partition: rootPartition(sub[0], own.length), id: own.map(normalizeWord).join(' '), text: own.join(' '), count: sub.length, shared: own.length, opening, keys: sub.map(ayah => ayah.key) });
        });
        return;
      }
      found.push({ partition: rootPartition(group.find(ayah => ayah.key === under[0])!, words.length), id: linkId(words, under.map(key => conj.get(key)!)), text: words.join(' '), count: under.length, shared: words.length, opening, keys: under });
    };
    walk(phraseTree(group), []);
  });
  const first = (piece: Piece) => Math.min(...piece.keys.map(mushafOrder));
  const ambiguous = new Set(phrases.filter(phrase => phrase.partition).map(phrase => phrase.id));
  return found.map(piece => {
    if (ambiguous.has(piece.id)) return piece;
    const plain = { ...piece };
    delete plain.partition;
    return plain;
  }).sort((a, b) => b.shared - a.shared || a.count - b.count || first(a) - first(b));
}

export function listPage(value: string | null, total: number, perPage: number) {
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  return { page: Math.min(pageCount, Math.max(1, Number.parseInt(value ?? '1', 10) || 1)), pageCount };
}

export function ayahEnds(node: Branch, path: string[] = []): Record<string, string> {
  const words = [...path, ...node.words];
  const grownPast = words.some(word => word.startsWith('﴿'));
  const own = node.ayat.map(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return [key, node.through?.[key] ?? (grownPast ? `${surah}:${ayah + 1}` : key)];
  });
  return Object.assign(Object.fromEntries(own), ...node.children.map(child => ayahEnds(child, words)));
}

export function searchPieces(found: Piece[], phrases: Opening[], ayat: BranchAyah[], query: string) {
  const needle = searchKey(query);
  const owner = new Map(found.flatMap((piece, index) => piece.keys.map(key => [key, index] as const)));
  const byFirst = new Map<string, Set<BranchAyah>>();
  ayat.forEach(ayah => [norm(ayah)[0], norm(stem(ayah))[0]].forEach(word => byFirst.set(word, (byFirst.get(word) ?? new Set()).add(ayah))));
  const rank = new Map<number, number>();
  searchPhrases(phrases, query).forEach(phrase => {
    const hits = new Map<number, number>();
    startingWith([...byFirst.get(phrase.id.split(' ')[0]) ?? []], phrase.id, phrase.partition).forEach(ayah => {
      const index = owner.get(ayah.key);
      if (index !== undefined) hits.set(index, (hits.get(index) ?? 0) + 1);
    });
    hits.forEach((count, index) => { if (count >= 2 && !rank.has(index)) rank.set(index, Number(!searchKey(phrase.id).startsWith(needle))); });
  });
  return [0, 1].flatMap(level => found.filter((_, index) => rank.get(index) === level));
}
