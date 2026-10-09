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
  for (let k = 0; k < RESYNC; k++) {
    const x = w[i + (a + k) * step];
    if (x === undefined || x[0] === '#' || x !== w[j + (b + k) * step]) return false;
  }
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
    if (at) at.push(i);
    else seeds.set(key, [i]);
  }

  const found: { a: [number, number]; b: [number, number]; matched: number; places: number }[] = [];
  for (const at of seeds.values()) {
    for (let x = 0; x < at.length; x++) {
      for (let y = x + 1; y < at.length; y++) {
        const [i, j] = [at[x], at[y]];
        if (pos[i]!.surah === pos[j]!.surah) continue;
        if (found.some(f => i >= f.a[0] && i <= f.a[1] && j >= f.b[0] && j <= f.b[1])) continue;
        const back = extend(norm, i - 1, j - 1, -1);
        const fwd = extend(norm, i, j, 1);
        found.push({
          a: [back.last?.[0] ?? i, fwd.last![0]],
          b: [back.last?.[1] ?? j, fwd.last![1]],
          matched: back.hits + fwd.hits,
          places: at.length,
        });
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
