// docs/plans/quran-similar-ayat.md
import { fromBuckwalter } from './lemmas';

export type Span = [surah: number, from: number, to: number];
export type Mark = [ayah: number, word: number, kind: typeof SAME_WORD | typeof SAME_ROOT];
export type SimilarPair = { a: Span; b: Span; score: number; roots: string[]; marksA: Mark[]; marksB: Mark[] };

export const SAME_WORD = 0;
export const SAME_ROOT = 1;

type Token = { key: string; word: number };
type Ayah = { surah: number; ayah: number; tokens: Token[]; words: string[] };

const CONTENT = new Set(['N', 'V', 'ADJ', 'PN']);
const DROPPED = new Set(['P', 'CONJ', 'DET', 'PRON', 'REM']);
const MAX_WINDOW = 3;
const RARE = 2.5;
const SEED = 0.3;
export const MIN_SCORE = 0.5;
const MIN_SHARED = 6.5;
const STRONG = 0.8;
const OPENING = 0.1;
const MARKS = /[aiuoFNK~`^#:@"[;,.!\-+%\]]/g;
const bare = (form: string) => form.replace(MARKS, '').replace(/[{<>]/g, 'A');

export function readAyat(morphology: string): Ayah[] {
  const ayat: Ayah[] = [];
  for (const line of morphology.split(/\r?\n/)) {
    if (!line.startsWith('(')) continue;
    const [location, form, tag, features] = line.split('\t');
    const [surah, ayah, word] = location.slice(1, -1).split(':').map(Number);
    let last = ayat[ayat.length - 1];
    if (!last || last.surah !== surah || last.ayah !== ayah) ayat.push(last = { surah, ayah, tokens: [], words: [] });
    const joiner = features.startsWith('PREFIX|') && (tag === 'CONJ' || tag === 'REM');
    last.words[word - 1] = (last.words[word - 1] ?? '') + (joiner ? '' : bare(form));
    const root = /\|ROOT:([^|]+)/.exec(features)?.[1];
    const lemma = /\|LEM:([^|]+)/.exec(features)?.[1];
    const key = CONTENT.has(tag) && root ? `r:${root}` : lemma && !DROPPED.has(tag) ? `p:${lemma}` : null;
    if (key) last.tokens.push({ key, word: word - 1 });
  }
  return ayat;
}

export function findSimilar(ayat: Ayah[]): SimilarPair[] {
  const n = ayat.length;
  const df = new Map<string, number>();
  for (const a of ayat) for (const key of new Set(a.tokens.map(t => t.key))) df.set(key, (df.get(key) ?? 0) + 1);
  const idf = new Map([...df].map(([key, d]) => [key, Math.log(n / d) * (key.startsWith('p:') ? 0.5 : 1)]));
  const w = (key: string) => idf.get(key)!;
  const weight = ayat.map(a => [...new Set(a.tokens.map(t => t.key))].reduce((s, key) => s + w(key), 0));

  const postings = new Map<string, number[]>();
  ayat.forEach((a, i) => {
    for (const key of new Set(a.tokens.map(t => t.key))) {
      if (!key.startsWith('r:') || w(key) < RARE) continue;
      postings.set(key, [...(postings.get(key) ?? []), i]);
    }
  });
  const shared = new Map<number, number>();
  for (const [key, list] of postings) {
    for (let p = 0; p < list.length; p++) for (let q = p + 1; q < list.length; q++) {
      const k = list[p] * n + list[q];
      shared.set(k, (shared.get(k) ?? 0) + w(key));
    }
  }
  const at = (k: number) => shared.get(k) ?? 0;
  const seeds: number[] = [];
  for (const [k, c] of shared) {
    const [i, j] = [Math.floor(k / n), k % n];
    const [wi, wj] = [weight[i], weight[j]];
    const [wi2, wj2] = [wi + (weight[i + 1] ?? 0), wj + (weight[j + 1] ?? 0)];
    const best = Math.max(
      c / Math.sqrt(wi * wj),
      (c + at(k + n)) / Math.sqrt(wi2 * wj),
      (c + at(k + 1)) / Math.sqrt(wi * wj2),
      (c + at(k + n) + at(k + 1) + at(k + n + 1)) / Math.sqrt(wi2 * wj2),
    );
    if (best >= SEED) seeds.push(k);
  }

  const windowOf = (start: number, len: number) => {
    const end = start + len - 1;
    return start >= 0 && end < n && ayat[start].surah === ayat[end].surah ? ayat.slice(start, end + 1) : null;
  };
  const keys = (win: Ayah[]) => win.flatMap(a => a.tokens.map(t => t.key));
  const lcs = (x: string[], y: string[]) => {
    let prev = new Float64Array(y.length + 1);
    for (let i = 1; i <= x.length; i++) {
      const cur = new Float64Array(y.length + 1);
      for (let j = 1; j <= y.length; j++) cur[j] = x[i - 1] === y[j - 1] ? prev[j - 1] + w(x[i - 1]) : Math.max(prev[j], cur[j - 1]);
      prev = cur;
    }
    return prev[y.length];
  };

  type Hit = { sa: number; la: number; sb: number; lb: number; score: number; common: Set<string> };
  const hits: Hit[] = [];
  const seen = new Set<string>();
  for (const k of seeds) {
    const [i, j] = [Math.floor(k / n), k % n];
    for (let la = 1; la <= MAX_WINDOW; la++) for (let sa = i - la + 1; sa <= i; sa++) {
      for (let lb = 1; lb <= MAX_WINDOW; lb++) for (let sb = j - lb + 1; sb <= j; sb++) {
        const id = `${sa}.${la}.${sb}.${lb}`;
        if (seen.has(id)) continue;
        seen.add(id);
        if (sa < sb + lb && sb < sa + la) continue;
        const [wa, wb] = [windowOf(sa, la), windowOf(sb, lb)];
        if (!wa || !wb) continue;
        if (ayat[sa].surah === ayat[sb].surah && wa.map(a => a.words.join(' ')).join('|') === wb.map(a => a.words.join(' ')).join('|')) continue;
        const [x, y] = [keys(wa), keys(wb)];
        const [X, Y] = [new Set(x), new Set(y)];
        const common = new Set([...X].filter(key => Y.has(key)));
        const loose = (win: Ayah[]) => [win[0], win[win.length - 1]].some(a => !a.tokens.some(t => common.has(t.key)));
        if (loose(wa) || loose(wb)) continue;
        const sharedWeight = [...common].reduce((s, key) => s + w(key), 0);
        const d = Math.sqrt([...X].reduce((s, key) => s + w(key), 0) * [...Y].reduce((s, key) => s + w(key), 0));
        const opening = x.length > 1 && x[0] === y[0] && x[1] === y[1] ? OPENING : 0;
        const score = 0.5 * sharedWeight / d + 0.5 * Math.min(lcs(x, y) / d, 1) + opening;
        if (score >= MIN_SCORE && (sharedWeight >= MIN_SHARED || score >= STRONG)) hits.push({ sa, la, sb, lb, score, common });
      }
    }
  }

  hits.sort((p, q) => q.score - p.score || p.sa - q.sa || p.sb - q.sb);
  const overlaps = (a: number, la: number, b: number, lb: number) => a < b + lb && b < a + la;
  const kept: Hit[] = [];
  for (const h of hits) {
    if (!kept.some(k => overlaps(h.sa, h.la, k.sa, k.la) && overlaps(h.sb, h.lb, k.sb, k.lb))) kept.push(h);
  }

  const span = (start: number, len: number): Span => [ayat[start].surah, ayat[start].ayah, ayat[start + len - 1].ayah];
  const marks = (start: number, len: number, otherStart: number, otherLen: number, common: Set<string>): Mark[] => {
    const other = new Set(ayat.slice(otherStart, otherStart + otherLen).flatMap(a => a.words));
    return ayat.slice(start, start + len).flatMap(a => {
      const kind = a.words.map((form, word) => other.has(form) ? SAME_WORD : a.tokens.some(t => t.word === word && common.has(t.key)) ? SAME_ROOT : null);
      const content = (word: number) => a.tokens.some(t => t.word === word && t.key.startsWith('r:'));
      const out: Mark[] = [];
      for (let from = 0; from < kind.length; from++) {
        if (kind[from] === null) continue;
        let to = from;
        while (kind[to + 1] != null) to++;
        const words = Array.from({ length: to - from + 1 }, (_, k) => from + k);
        if (words.length > 1 || words.some(content)) for (const word of words) out.push([a.ayah, word, kind[word]!]);
        from = to;
      }
      return out;
    });
  };
  return kept
    .map(h => ({
      a: span(h.sa, h.la),
      b: span(h.sb, h.lb),
      score: Math.round(Math.min(h.score, 1) * 100) / 100,
      roots: [...h.common].filter(key => key.startsWith('r:')).map(key => fromBuckwalter(key.slice(2))),
      marksA: marks(h.sa, h.la, h.sb, h.lb, h.common),
      marksB: marks(h.sb, h.lb, h.sa, h.la, h.common),
    }))
    .sort((p, q) => p.a[0] - q.a[0] || p.a[1] - q.a[1] || p.b[0] - q.b[0] || p.b[1] - q.b[1]);
}
