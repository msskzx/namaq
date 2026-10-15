// docs/plans/quran-relations-page.md
import { ayahWords } from './normalize';
import { wordDiff } from './wordDiff';

export type AyahInput = { surah: number; ayah: number; text: string };
export type Pos = { surah: number; ayah: number; word: number };
export type Passage = {
  a: { from: Pos; to: Pos };
  b: { from: Pos; to: Pos };
  matched: number;
  places: number;
  marksA: number[];
  marksB: number[];
};

export const MIN_WORDS = 10;
const MAX_SKIP = 4;
const RESYNC = 3;
// A gram repeating past this is ordinary diction, not a surprising shared
// passage - capping it bounds the O(m^2) pairing below regardless of how
// common the most frequent gram turns out to be.
const MAX_OCC = 150;

function flatten(ayat: AyahInput[]) {
  const norm: string[] = [];
  const pos: (Pos | null)[] = [];
  let current = -1;
  for (const { surah, ayah, text } of ayat) {
    if (surah !== current) {
      current = surah;
      norm.push(`#${surah}`);
      pos.push(null);
    }
    ayahWords(text, ayah === 1 && surah !== 1 && surah !== 9).norm.forEach((w, word) => {
      norm.push(w);
      pos.push({ surah, ayah, word });
    });
  }
  return { norm, pos };
}

function resyncs(w: string[], i: number, j: number, step: number, a: number, b: number): boolean {
  for (let k = 0; k < a + RESYNC; k++) if ((w[i + k * step] ?? '#')[0] === '#') return false;
  for (let k = 0; k < b + RESYNC; k++) if ((w[j + k * step] ?? '#')[0] === '#') return false;
  for (let k = 0; k < RESYNC; k++) if (w[i + (a + k) * step] !== w[j + (b + k) * step]) return false;
  return true;
}

function extend(w: string[], start: number, other: number, step: number): { last: [number, number] | null; hits: number } {
  let [i, j] = [start, other];
  let last: [number, number] | null = null;
  let hits = 0;
  while (i >= 0 && j >= 0 && i < w.length && j < w.length) {
    if (w[i][0] !== '#' && w[i] === w[j]) {
      last = [i, j];
      hits++;
      i += step;
      j += step;
      continue;
    }
    let moved = false;
    for (let sum = 1; sum <= 2 * MAX_SKIP && !moved; sum++) {
      for (let a = Math.max(0, sum - MAX_SKIP); a <= Math.min(sum, MAX_SKIP); a++) {
        if (resyncs(w, i, j, step, a, sum - a)) {
          i += a * step;
          j += (sum - a) * step;
          moved = true;
          break;
        }
      }
    }
    if (!moved) break;
  }
  return { last, hits };
}

export function findPassages(ayat: AyahInput[]): Passage[] {
  const { norm, pos } = flatten(ayat);
  const seeds = new Map<string, number[]>();
  for (let i = 0; i + MIN_WORDS <= norm.length; i++) {
    const gram = norm.slice(i, i + MIN_WORDS);
    if (gram.some(w => w[0] === '#')) continue;
    const key = gram.join(' ');
    const at = seeds.get(key);
    if (at) { if (at.length < MAX_OCC) at.push(i); } else seeds.set(key, [i]);
  }

  // A position already matched against a given surah is skipped against
  // that same surah again - O(1) amortized per candidate instead of
  // scanning every match found so far (found.some(...) used to re-check
  // every candidate against the whole result list, which made the cost grow
  // with the result list itself). Coverage is tracked per target surah
  // rather than globally, so a position already connected to surah A can
  // still branch out to surah B: dropping that would silently lose real
  // connections whenever the same gram recurs across three or more surahs.
  const covered: (Set<number> | undefined)[] = new Array(norm.length);
  const sawSurah = (p: number, surah: number) => covered[p]?.has(surah) ?? false;
  const markSurah = (from: number, to: number, surah: number) => {
    for (let k = from; k <= to; k++) (covered[k] ??= new Set()).add(surah);
  };

  const found: { a: [number, number]; b: [number, number]; matched: number; places: number }[] = [];
  for (const at of seeds.values()) {
    for (let x = 0; x < at.length; x++) {
      const i = at[x];
      const surahI = pos[i]!.surah;
      for (let y = x + 1; y < at.length; y++) {
        const j = at[y];
        const surahJ = pos[j]!.surah;
        if (surahI === surahJ) continue;
        if (sawSurah(i, surahJ) || sawSurah(j, surahI)) continue;
        const back = extend(norm, i - 1, j - 1, -1);
        const fwd = extend(norm, i, j, 1);
        const a: [number, number] = [back.last?.[0] ?? i, fwd.last![0]];
        const b: [number, number] = [back.last?.[1] ?? j, fwd.last![1]];
        found.push({ a, b, matched: back.hits + fwd.hits, places: at.length });
        markSurah(a[0], a[1], surahJ);
        markSurah(b[0], b[1], surahI);
      }
    }
  }

  return found
    .map(f => {
      const diff = wordDiff(norm.slice(f.a[0], f.a[1] + 1), norm.slice(f.b[0], f.b[1] + 1));
      return {
        a: { from: pos[f.a[0]]!, to: pos[f.a[1]]! },
        b: { from: pos[f.b[0]]!, to: pos[f.b[1]]! },
        matched: f.matched,
        places: f.places,
        marksA: diff.a,
        marksB: diff.b,
      };
    })
    .sort((p, q) => p.a.from.surah - q.a.from.surah || p.a.from.ayah - q.a.from.ayah || p.a.from.word - q.a.from.word);
}
