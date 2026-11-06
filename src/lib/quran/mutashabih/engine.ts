// docs/plans/quran-mutashabih.md
import { spell, type BranchAyah } from '../branches';
import { normalizeWord, plainName } from '../normalize';
import { buildPhraseGroups, type PhraseOccurrence } from '../phraseTrees';
import rawEvidence from './evidence.json';

import { type Column, type Group, type Tag, type Kind, type Comparison, type Citation, type Word, type Level, type Position, type Place } from './types';
export { TAGS, KINDS } from './types';
export type { Group } from './types';

export const MATCH_CONFIG = {
  minMatchedWords: 6,
  minCoverage: 0.72,
  maxInteriorGap: 3,
  minLocalMatchedWords: 8,
  minPhraseWords: 6,
  maxPhrasePlaces: 36,
};

const letters = (word: string) => normalizeWord(word.normalize('NFC'));
const pairKey = (a: string, b: string) => [a, b].sort().join('|');
const unique = <T>(values: T[]) => [...new Set(values)];
const same = (a: Word, b: Word) => a.base === b.base && a.root === b.root && (a.lemma === b.lemma || spell(a.text) === spell(b.text));
const asPosition = ({ key, index }: Word): Position => ({ key, index });
const wordsOf = (ayah: BranchAyah): Word[] => ayah.words.flatMap((text, index) => {
  const norm = letters(text);
  if (!norm || !/\p{L}/u.test(norm) || text.startsWith('﴿')) return [];
  const conj = ayah.conjs?.[index] ?? undefined;
  return [{ key: ayah.key, index, text, letters: norm, base: conj ? norm.slice(1) : norm, conj,
    features: ayah.features?.[index] ?? undefined, lemma: ayah.lemmas?.[index]?.replace(/\d+$/, ''), root: ayah.roots?.[index] ?? undefined }];
});

function levelOf(a: Word, b: Word): Level | undefined {
  if (same(a, b)) return a.text === b.text ? 'exact' : 'letters';
  if (a.lemma && a.lemma === b.lemma && a.root === b.root) return 'lemma';
  if (a.root && a.root === b.root) return 'root';
}

const weight: Record<Level, number> = { exact: 8, letters: 8, lemma: 5, root: 1 };
const isStrong = (level?: Level) => level === 'exact' || level === 'letters' || level === 'lemma';

function lcs(a: Word[], b: Word[]) {
  const stride = b.length + 1;
  const table = new Uint16Array((a.length + 1) * stride);
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      const level = levelOf(a[i], b[j]);
      const k = i * stride + j;
      table[k] = Math.max(table[k + stride], table[k + 1], level ? weight[level] + table[k + stride + 1] : 0);
    }
  }
  const hits: { i: number; j: number; level: Level }[] = [];
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    const level = levelOf(a[i], b[j]);
    const k = i * stride + j;
    if (level && table[k] === weight[level] + table[k + stride + 1]) {
      hits.push({ i, j, level });
      i++;
      j++;
    } else if (table[k + stride] >= table[k + 1]) i++;
    else j++;
  }
  return hits;
}

function tagsFor(a?: Word, b?: Word, level?: Level): Tag[] {
  if (!a || !b) return ['addition_omission'];
  const morphology: Tag[] = [];
  const compatible = a.root && a.root === b.root && a.lemma === b.lemma;
  if (compatible) {
    for (const [feature, tag] of [['number', 'number'], ['gender', 'gender'], ['case', 'case']] as const) {
      if (a.features?.[feature] && b.features?.[feature] && a.features[feature] !== b.features[feature]) morphology.push(tag);
    }
  }
  if (a.letters === b.letters) return morphology;
  if (same(a, b) && a.conj !== b.conj) return [a.conj && b.conj ? 'particle' : 'addition_omission'];
  if ((a.base === 'ال' + b.base || b.base === 'ال' + a.base) && a.root && a.root === b.root) return ['definiteness'];
  if (level === 'root' || level === 'lemma') {
    if (a.base.replace(/(.)\1$/u, '$1') === b.base || b.base.replace(/(.)\1$/u, '$1') === a.base) return ['assimilation'];
  }
  return morphology.length ? morphology : ['word'];
}

function align(a: Word[], b: Word[]) {
  const hits = lcs(a, b);
  const byA = new Map(hits.map(hit => [hit.i, hit]));
  const usedB = new Set(hits.map(hit => hit.j));
  const moved = new Set<number>();
  const replacedB = new Set<number>();
  a.forEach((word, i) => {
    if (isStrong(byA.get(i)?.level)) return;
    const candidates = b.flatMap((other, j) => !usedB.has(j) && same(word, other) ? [j] : []);
    if (candidates.length !== 1) return;
    const j = candidates[0];
    if (a.filter((other, at) => !isStrong(byA.get(at)?.level) && same(other, b[j])).length !== 1) return;
    const prev = byA.get(i);
    if (prev) replacedB.add(prev.j);
    byA.set(i, { i, j, level: levelOf(word, b[j])! });
    usedB.add(j);
    moved.add(i);
    for (const hit of hits) {
      if ((i - hit.i) * (j - hit.j) >= 0 || !isStrong(hit.level)) continue;
      if (a.filter(other => same(other, a[hit.i])).length === 1 && b.filter(other => same(other, b[hit.j])).length === 1) moved.add(hit.i);
    }
  });

  const columns: Column[] = [];
  let ai = 0;
  let bi = 0;
  for (const hit of [...hits, { i: a.length, j: b.length, level: undefined }]) {
    const left = a.slice(ai, hit.i).filter((_, i) => !byA.has(ai + i));
    const right = b.slice(bi, hit.j).filter((_, j) => !usedB.has(bi + j) || replacedB.has(bi + j));
    for (let n = 0; n < Math.max(left.length, right.length); n++) {
      columns.push({ a: left[n] && asPosition(left[n]), b: right[n] && asPosition(right[n]), tags: tagsFor(left[n], right[n]) });
    }
    const match = byA.get(hit.i);
    if (hit.i < a.length && match) {
      const leftWord = a[match.i];
      const rightWord = b[match.j];
      columns.push({ a: asPosition(leftWord), b: asPosition(rightWord), level: match.level, tags: moved.has(match.i) ? ['order'] : tagsFor(leftWord, rightWord, match.level) });
    }
    ai = hit.i + 1;
    bi = hit.j + 1;
  }
  for (const i of moved) {
    if (hits.some(hit => hit.i === i)) continue;
    const hit = byA.get(i)!;
    columns.push({ a: asPosition(a[i]), b: asPosition(b[hit.j]), level: hit.level, tags: ['order'] });
  }
  return { hits, columns, matched: [...byA.values()].filter(hit => isStrong(hit.level)).length };
}

const place = (a: Word, b: Word): Place => ({ key: a.key, start: a.index, end: b.index + 1, ...(a.key !== b.key && { through: b.key }) });

function sharedRun(a: Word[], b: Word[]) {
  let best = { i: 0, j: 0, length: 0 };
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    let length = 0;
    while (a[i + length] && b[j + length] && same(a[i + length], b[j + length])) length++;
    if (length > best.length) best = { i, j, length };
  }
  return best;
}

function compareWords(a: Word[], b: Word[], config = MATCH_CONFIG): Comparison {
  const { columns, hits, matched } = align(a, b);
  const tags = unique(columns.flatMap(column => column.tags));
  const full = matched / Math.max(a.length, b.length);
  const spans: [Place, Place] = [place(a[0], a.at(-1)!), place(b[0], b.at(-1)!)];
  if (a.length === b.length && a.every((word, i) => word.text === b[i].text)) return { columns, tags: [], score: 1, coverage: 1, kind: 'identical', spans };
  let score = full;
  let close = matched >= config.minMatchedWords && score >= config.minCoverage;
  const strong = hits.filter(hit => isStrong(hit.level));
  for (let start = 0; start < strong.length; start++) {
    const first = strong[start];
    for (let end = start + 1; end < strong.length; end++) {
      const last = strong[end];
      const prev = strong[end - 1];
      if (Math.max(last.i - prev.i, last.j - prev.j) > config.maxInteriorGap + 1) break;
      const count = end - start + 1;
      if (count < config.minLocalMatchedWords) continue;
      const longest = Math.max(last.i - first.i + 1, last.j - first.j + 1);
      const local = count / longest;
      if (local < config.minCoverage || longest === count || local <= score && close) continue;
      score = local;
      close = true;
      spans[0] = place(a[first.i], a[last.i]);
      spans[1] = place(b[first.j], b[last.j]);
    }
  }
  if (close && tags.length) return { columns, tags, score, coverage: full, kind: 'mutashabih_lafzi', spans };
  const run = sharedRun(a, b);
  if (run.length >= config.minPhraseWords) {
    return { columns, tags, score, coverage: full, kind: 'shared_phrase', spans: [place(a[run.i], a[run.i + run.length - 1]), place(b[run.j], b[run.j + run.length - 1])] };
  }
  return { columns, tags, score, coverage: full, spans };
}

export function compareAyat(a: BranchAyah, b: BranchAyah, config = MATCH_CONFIG): Comparison {
  const left = wordsOf(a);
  const right = wordsOf(b);
  if (!left.length || !right.length) return {
    columns: [], tags: [], score: 0, coverage: 0,
    spans: [{ key: a.key, start: 0, end: a.words.length }, { key: b.key, start: 0, end: b.words.length }],
  };
  return compareWords(left, right, config);
}

const cases: Citation[] = rawEvidence.cases.map(row => {
  const [book, edition] = rawEvidence.books[row.id[0] as keyof typeof rawEvidence.books];
  return { ...row, tags: row.tags as Tag[], book, edition };
});

type Selection = [key: string, start: number, end: number, through?: string];
type Attested = { places: Selection[]; citations: string[]; focus?: Record<string, number[]>; detail?: string; kind?: Kind };
const attested: Attested[] = [
  { places: [['2:6', 3, 11], ['36:10', 0, 8]], citations: ['Z02'], focus: { '2:6': [3], '36:10': [0] }, detail: 'سواء / وسواء' },
  { places: [['2:35', 1, 18], ['7:19', 0, 16]], citations: ['Z06', 'K01', 'I01'], focus: { '2:35': [6, 8], '7:19': [5] }, detail: 'وكلا / فكلا' },
  { places: [['2:48', 0, 19], ['2:123', 0, 18]], citations: ['K02', 'I02'], focus: { '2:48': [11, 13, 14, 15], '2:123': [11, 13, 14] }, detail: 'شفاعة / عدل' },
  { places: [['2:49', 2, 18], ['7:141', 2, 18], ['14:6', 10, 26]], citations: ['K03', 'I03'], focus: { '2:49': [8], '7:141': [8], '14:6': [16] }, detail: 'يذبحون / يقتلون / ويذبحون' },
  { places: [['2:58', 0, 20], ['7:161', 0, 20]], citations: ['Z01'], focus: { '2:58': [10, 11, 12, 13, 14], '7:161': [10, 11, 12, 13, 14] }, detail: 'ادخلوا الباب / قولوا حطة' },
  { places: [['2:58', 0, 18, '2:59'], ['7:161', 0, 17, '7:162']], citations: ['K04', 'I04'], focus: { '2:58': [5, 9, 10, 11, 12, 13, 14, 17, 18], '7:161': [6, 10, 11, 12, 13, 14, 17, 18], '2:59': [8], '7:162': [3, 9] }, detail: 'ادخلوا الباب / قولوا حطة' },
  { places: [['2:61', 47, 54], ['3:21', 2, 9], ['3:112', 23, 30]], citations: ['Z04', 'K05', 'I05'], focus: { '2:61': [53], '3:21': [8], '3:112': [29] }, detail: 'الحق / حق' },
  { places: [['2:62', 0, 7], ['5:69', 0, 7], ['22:17', 0, 7]], citations: ['I06'], focus: { '2:62': [5, 6], '5:69': [5, 6], '22:17': [5, 6] }, detail: 'النصارى والصابئين / الصابئون والنصارى' },
  { places: [['2:80', 0, 7], ['3:24', 2, 9]], citations: ['Z05', 'K06', 'I07'], focus: { '2:80': [6], '3:24': [8] }, detail: 'معدودة / معدودات' },
  { places: [['2:126', 0, 8], ['14:35', 0, 8]], citations: ['I08'], focus: { '2:126': [6], '14:35': [6] }, detail: 'بلدا / البلد' },
  { places: [['2:129', 3, 12], ['2:151', 3, 12], ['3:164', 8, 18], ['62:2', 5, 14]], citations: ['Z03'], focus: { '2:129': [8, 11], '2:151': [8, 9], '3:164': [14, 15], '62:2': [10, 11] }, detail: 'ويعلمهم / ويزكيهم' },
  { places: [['2:136', 1, 31], ['3:84', 1, 29]], citations: ['K07', 'I09'], focus: { '2:136': [5, 8, 18, 19], '3:84': [5, 8] }, detail: 'إلينا / علينا' },
  { places: [['2:170', 0, 16], ['31:21', 0, 16]], citations: ['Z07', 'K08', 'I10'], focus: { '2:170': [11], '31:21': [11] }, detail: 'ألفينا / وجدنا' },
  { places: [['2:219', 24, 26], ['2:266', 33, 35]], citations: ['Z09'], kind: 'shared_phrase' },
  { places: [['3:126', 0, 17], ['8:10', 0, 18]], citations: ['Z10'], focus: { '3:126': [7, 8], '8:10': [6, 7] }, detail: 'قلوبكم به / به قلوبكم' },
  { places: [['8:13', 0, 13], ['59:4', 0, 12]], citations: ['Z08', 'K09'], focus: { '8:13': [6, 8], '59:4': [6] }, detail: 'يشاقق / يشاقّ' },
  { places: [['55:13', 0, 4], ['55:16', 0, 4]], citations: ['K10'], kind: 'identical' },
];

function anchorFor(rows: Word[][]): { text: string; occurrences: PhraseOccurrence[] } {
  const first = rows[0];
  for (let start = 0; start < first.length; start++) {
    const matches = rows.map(row => row.findIndex(word => same(word, first[start])));
    if (matches.some(index => index < 0)) continue;
    let length = 1;
    while (rows.every((row, i) => {
      const word = row[matches[i] + length];
      const initial = row[matches[i]];
      return first[start + length]?.key === first[start].key && word?.key === initial.key && same(word, first[start + length]);
    })) length++;
    return {
      text: first.slice(start, start + length).map(word => word.text).join(' '),
      occurrences: rows.map((row, i) => ({ key: row[matches[i]].key, start: row[matches[i]].index, end: row[matches[i] + length - 1].index + 1 })),
    };
  }
  return {
    text: first[0].text,
    occurrences: rows.map(row => ({ key: row[0].key, start: 0, end: 0 })),
  };
}

function makeGroup(places: Place[], rows: Word[][], kind: Kind, citations: Citation[] = [], focus?: Record<string, number[]>, detail?: string): Group {
  const id = 'group:' + places.map(p => p.key + (p.through ? '-' + p.through : '')).join(',');
  const anchor = anchorFor(rows.map((row, i) => {
    const place = places[i];
    return row.filter(word => word.key === place.key);
  }));
  const pairs = rows.slice(1).map((b, offset) => {
    const i = 0;
    const a = rows[0];
    const j = offset + 1;
    const comparison = compareWords(a, b);
    return { a: places[i].key, b: places[j].key, ...comparison };
  });
  const tags = unique(citations.length ? citations.flatMap(citation => citation.tags) : kind === 'same_frame' ? ['frame' as const] : kind === 'identical' || kind === 'shared_phrase' ? [] : pairs.flatMap(pair => pair.tags));
  const examples: Partial<Record<Tag, string>> = {};
  const words = new Map(rows.flatMap(row => row.map(word => [`${word.key}:${word.index}`, word] as const)));
  for (const tag of tags) {
    const cited = citations.find(citation => citation.examples?.[tag])?.examples?.[tag];
    if (cited || tags.length === 1 && detail) {
      examples[tag] = cited ?? detail!;
      continue;
    }
    const pair = pairs.find(pair => pair.columns.some(column => column.tags.includes(tag) || tag === 'frame' && column.tags.length));
    const changed = pair?.columns.filter(column => column.tags.includes(tag) || tag === 'frame' && column.tags.length);
    if (!changed?.length) continue;
    const selected = tag === 'order' || tag === 'inversion' ? changed : changed.slice(0, 1);
    const side = (key: 'a' | 'b') => {
      const positions = selected.flatMap(column => column[key] ? [column[key]!] : []);
      positions.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }) || a.index - b.index);
      const values = unique(positions.map(position => {
        const word = words.get(`${position.key}:${position.index}`)!;
        return tag === 'case' ? spell(word.text) : plainName(word.text);
      }));
      return values.slice(0, 3).join(' ') + (values.length > 3 ? ' …' : '') || '∅';
    };
    examples[tag] = `${side('a')} / ${side('b')}`;
  }
  const differences: Record<string, number[]> = {};
  if (focus) Object.assign(differences, focus);
  else if (tags.length) {
    for (const column of pairs.flatMap(pair => pair.columns)) {
      if (!column.tags.length && kind !== 'same_frame') continue;
      for (const cell of [column.a, column.b]) {
        if (!cell || !column.tags.length) continue;
        const indices = differences[cell.key] ??= [];
        if (!indices.includes(cell.index)) indices.push(cell.index);
      }
    }
  }
  return {
    id, text: anchor.text, tree: { ...anchor, id }, places, kind, tags, differences,
    score: Math.min(...pairs.map(pair => pair.score)),
    citations: citations.map(citation => ({ ...citation, examples: Object.fromEntries(citation.tags.flatMap(tag => examples[tag] ? [[tag, examples[tag]]] : [])) })),
    detail, examples,
    columns: pairs.map(({ a, b, columns }) => ({
      a, b, columns: columns.map(column => {
        if (!focus) return column;
        const focused = [column.a, column.b].some(cell => cell && focus[cell.key]?.includes(cell.index));
        if (!focused) return { ...column, tags: [] };
        const matching = column.tags.filter(tag => tags.includes(tag));
        const replacement = tags.includes('word') && !column.level ? ['word' as const] : [];
        return { ...column, tags: matching.length ? matching : replacement.length ? replacement : tags.length === 1 ? tags : [] };
      }),
    })),
  };
}

function cliques(graph: Map<number, Set<number>>): number[][] {
  const out: number[][] = [];
  const visit = (group: number[], possible: Set<number>, excluded: Set<number>) => {
    if (!possible.size && !excluded.size) {
      if (group.length >= 2) out.push(group.sort((a, b) => a - b));
      return;
    }
    const pivot = [...possible, ...excluded].sort((a, b) => graph.get(b)!.size - graph.get(a)!.size)[0];
    for (const next of [...possible]) {
      if (graph.get(pivot)!.has(next)) continue;
      const neighbors = graph.get(next)!;
      visit([...group, next], new Set([...possible].filter(i => neighbors.has(i))), new Set([...excluded].filter(i => neighbors.has(i))));
      possible.delete(next);
      excluded.add(next);
    }
  };
  visit([], new Set(graph.keys()), new Set());
  return out;
}

function candidates(rows: Word[][], max: number) {
  const index = new Map<string, Set<number>>();
  rows.forEach((row, i) => {
    for (let at = 0; at + 1 < row.length; at++) {
      const key = row[at].base + ' ' + row[at + 1].base;
      const bucket = index.get(key) ?? new Set<number>();
      bucket.add(i);
      index.set(key, bucket);
    }
  });
  const result = new Map<number, Set<number>>();
  for (const bucket of index.values()) {
    if (bucket.size > max) continue;
    for (const i of bucket) for (const j of bucket) {
      if (i >= j) continue;
      const related = result.get(i) ?? new Set<number>();
      related.add(j);
      result.set(i, related);
    }
  }
  return result;
}

function frame(row: Word[]) {
  const start = row.findIndex((word, i) => word.base === 'ما' && /^(?:ي|ت)اتيهم$/.test(row[i + 1]?.base ?? '') && row[i + 2]?.base === 'من');
  if (start < 0) return;
  const except = row.findIndex((word, i) => i >= start + 4 && word.base === 'الا');
  if (except >= 0) return row.slice(start, Math.min(row.length, except + 4));
}

export function buildGroups(ayat: BranchAyah[], config = MATCH_CONFIG): Group[] {
  const rows = ayat.map(wordsOf);
  const index = new Map(ayat.map((ayah, i) => [ayah.key, i]));
  const source = (key: string) => rows[index.get(key)!];
  const groups: Group[] = [];
  const declared = new Set<string>();

  for (const { places: selections, citations: ids, focus, detail, kind = 'mutashabih_lafzi' } of attested) {
    if (selections.some(([key, , , through]) => !index.has(key) || through && !index.has(through))) continue;
    const places = selections.map(([key, start, end, through]) => ({ key, start, end, ...(through && { through }) }));
    const selected = places.map(p => p.through
      ? [...source(p.key).filter(word => word.index >= p.start), ...source(p.through).filter(word => word.index < p.end)]
      : source(p.key).filter(word => word.index >= p.start && word.index < p.end));
    const citations = cases.filter(citation => ids.includes(citation.id)).map(citation => ({
      ...citation,
      selections: places.filter(place => citation.places.some(reference => {
        const [key, last] = reference.split('-');
        return place.key === key && (!last || place.through === `${key.split(':')[0]}:${last}`);
      })),
    }));
    groups.push(makeGroup(places, selected, kind, citations, focus, detail));
    for (const a of places) for (const b of places) if (a.key !== b.key) declared.add(pairKey(a.key, b.key));
  }

  const exact = new Map<string, number[]>();
  rows.forEach((row, i) => {
    if (!row.length) return;
    const text = row.map(word => word.text).join(' ');
    const members = exact.get(text) ?? [];
    members.push(i);
    exact.set(text, members);
  });
  for (const members of exact.values()) {
    if (members.length < 2) continue;
    const selected = members.map(i => rows[i]);
    const places = selected.map(row => place(row[0], row.at(-1)!));
    const cited = groups.find(group => group.kind === 'identical' && group.places.every(p => places.some(place => place.key === p.key)));
    if (cited) groups.splice(groups.indexOf(cited), 1);
    groups.push(makeGroup(places, selected, 'identical', cited?.citations));
  }

  const graph = new Map<number, Set<number>>();
  const connect = (graph: Map<number, Set<number>>, i: number, j: number) => {
    for (const [a, b] of [[i, j], [j, i]]) {
      const edges = graph.get(a) ?? new Set<number>();
      edges.add(b);
      graph.set(a, edges);
    }
  };
  for (const [i, others] of candidates(rows, config.maxPhrasePlaces)) for (const j of others) {
    if (declared.has(pairKey(ayat[i].key, ayat[j].key))) continue;
    const { kind } = compareWords(rows[i], rows[j], config);
    if (kind === 'mutashabih_lafzi') connect(graph, i, j);
  }

  const inventory = new Set(groups.map(group => group.id));
  const retain = (places: Place[], selected: Word[][]) => {
    const group = makeGroup(places, selected, 'mutashabih_lafzi');
    if (inventory.has(group.id)) return;
    inventory.add(group.id);
    groups.push(group);
  };
  for (const members of cliques(graph)) {
    const selected = members.map(i => rows[i]);
    const ranges = selected.map(row => place(row[0], row.at(-1)!));
    for (let i = 0; i < selected.length; i++) for (let j = i + 1; j < selected.length; j++) {
      const [a, b] = compareWords(selected[i], selected[j], config).spans;
      for (const [index, span] of [[i, a], [j, b]] as const) {
        const range = ranges[index];
        if (span.end - span.start < range.end - range.start) ranges[index] = span;
      }
    }
    const clipped = selected.map((row, i) => row.filter(word => word.index >= ranges[i].start && word.index < ranges[i].end));
    const valid = clipped.every((row, i) => clipped.slice(i + 1).every(other => compareWords(row, other, config).kind === 'mutashabih_lafzi'));
    if (valid) retain(ranges, clipped);
    else for (let i = 0; i < selected.length; i++) for (let j = i + 1; j < selected.length; j++) {
      const spans = compareWords(selected[i], selected[j], config).spans;
      const pair = [selected[i], selected[j]].map((row, index) => row.filter(word => word.index >= spans[index].start && word.index < spans[index].end));
      if (compareWords(pair[0], pair[1], config).kind === 'mutashabih_lafzi') retain(spans, pair);
    }
  }


  const phrases = buildPhraseGroups(ayat)
    .filter(phrase => phrase.text.split(' ').length >= config.minPhraseWords && new Set(phrase.occurrences.map(o => o.key)).size <= config.maxPhrasePlaces)
    .sort((a, b) => b.text.split(' ').length - a.text.split(' ').length);
  for (const phrase of phrases) {
    const seen = new Set<string>();
    const places = phrase.occurrences.filter(p => !seen.has(p.key) && !!seen.add(p.key));
    if (places.length < 2) continue;
    const selected = places.map(p => source(p.key).filter(word => word.index >= p.start && word.index < p.end));
    if (selected.some(row => !row.length)) continue;
    const id = 'group:' + places.map(p => p.key).join(',');
    if (inventory.has(id)) continue;
    inventory.add(id);
    groups.push(makeGroup(places, selected, 'shared_phrase'));
  }

  const frames = rows.flatMap(row => frame(row) ?? []);
  if (frames.length) {
    const keys = unique(frames.map(word => word.key));
    const selected = keys.map(key => frames.filter(word => word.key === key));
    if (selected.length >= 2) groups.push(makeGroup(selected.map(row => place(row[0], row.at(-1)!)), selected, 'same_frame'));
  }


  const coverage = new Map<string, number>();
  const wholePlace = (p: Place) => p.through ? [...source(p.key), ...source(p.through)] : source(p.key);
  for (const group of groups) {
    let closest = 1;
    for (let i = 0; i < group.places.length; i++) for (let j = i + 1; j < group.places.length; j++) {
      const a = group.places[i];
      const b = group.places[j];
      const key = pairKey(a.key + (a.through ?? ''), b.key + (b.through ?? ''));
      let value = coverage.get(key);
      if (value === undefined) {
        value = compareWords(wholePlace(a), wholePlace(b), config).coverage;
        coverage.set(key, value);
      }
      closest = Math.min(closest, value);
    }
    group.score = closest;
  }

  return groups.sort((a, b) => index.get(a.places[0].key)! - index.get(b.places[0].key)! || a.places[0].start - b.places[0].start || a.id.localeCompare(b.id));
}
