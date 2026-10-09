import { describe, expect, it } from 'vitest';
import { findPassages } from './passages';
import runs from '@/app/quran/data/runs.json';

const LETTERS = 'ابتثجحخ';
const MORE = 'دذرزسشص';
const words = (n: number) => Array.from({ length: n }, (_, i) => `ك${LETTERS[i % 7]}${MORE[Math.floor(i / 7) % 7]}`);

describe('findPassages', () => {
  const shared = words(24);
  const run = shared.slice(0, 14);

  it('finds a run that crosses an ayah boundary in two surahs', () => {
    const found = findPassages([
      { surah: 1, ayah: 2, text: shared.slice(0, 7).join(' ') },
      { surah: 1, ayah: 3, text: run.slice(7).join(' ') },
      { surah: 2, ayah: 5, text: shared.slice(0, 9).join(' ') },
      { surah: 2, ayah: 6, text: run.slice(9).join(' ') },
    ]);
    expect(found).toHaveLength(1);
    expect(found[0].matched).toBe(14);
    expect(found[0].a.from).toEqual({ surah: 1, ayah: 2, word: 0 });
    expect(found[0].b.to).toEqual({ surah: 2, ayah: 6, word: 4 });
    expect(found[0].marksA).toEqual([]);
  });

  it('ignores a run shorter than ten words', () => {
    expect(findPassages([
      { surah: 1, ayah: 1, text: shared.slice(0, 9).join(' ') },
      { surah: 2, ayah: 1, text: shared.slice(0, 9).join(' ') },
    ])).toEqual([]);
  });

  it('ignores a repeat inside one surah', () => {
    expect(findPassages([
      { surah: 3, ayah: 1, text: shared.join(' ') },
      { surah: 3, ayah: 2, text: shared.join(' ') },
    ])).toEqual([]);
  });

  it('does not run on through the end of a surah into the next', () => {
    const found = findPassages([
      { surah: 1, ayah: 1, text: shared.join(' ') },
      { surah: 2, ayah: 1, text: shared.join(' ') },
      { surah: 3, ayah: 1, text: 'مختلف جدا' },
    ]);
    expect(found[0].a.to.surah).toBe(1);
  });

  it('bridges a differing word and marks it on both sides', () => {
    const other = [...shared];
    other[11] = 'غير';
    const found = findPassages([
      { surah: 1, ayah: 1, text: shared.join(' ') },
      { surah: 2, ayah: 1, text: other.join(' ') },
    ]);
    expect(found).toHaveLength(1);
    expect(found[0].marksA).toEqual([11]);
    expect(found[0].marksB).toEqual([11]);
  });
});

type Run = (typeof runs.passages)[number];

function covers(p: Run, side: 'a' | 'b', surah: number, from: number, to: number) {
  const s = p[side];
  return s.from.surah === surah && s.from.ayah <= to && s.to.ayah >= from;
}

describe('the committed passages', () => {
  it.each([
    [7, 106, 109, 26, 31, 34],
    [15, 29, 31, 38, 72, 74],
    [20, 71, 71, 26, 49, 49],
  ])('hold %i:%i-%i and %i:%i-%i as one passage', (s1, f1, t1, s2, f2, t2) => {
    expect(runs.passages.some(p => covers(p, 'a', s1, f1, t1) && covers(p, 'b', s2, f2, t2))).toBe(true);
  });

  it('keeps every passage at ten words or more across two surahs', () => {
    for (const p of runs.passages) {
      expect(p.matched).toBeGreaterThanOrEqual(runs.minWords);
      expect(p.a.from.surah).not.toBe(p.b.from.surah);
    }
  });
});
