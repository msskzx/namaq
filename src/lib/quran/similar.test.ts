import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import built from '@/app/quran/compare/similar.json';
import { findSimilar, readAyat, type SimilarPair, type Span } from './similar';

const MORPHOLOGY = join(__dirname, '../../../data/quran/quranic-corpus-morphology-0.4.txt');
const JUZ_TABARAK_AND_AMMA = readFileSync(MORPHOLOGY, 'utf8').split(/\r?\n/)
  .filter(line => { const s = Number(/^\((\d+):/.exec(line)?.[1]); return s >= 67; }).join('\n');

const has = (pairs: SimilarPair[], a: Span, b: Span) => pairs.some(p =>
  (p.a.join() === a.join() && p.b.join() === b.join()) || (p.a.join() === b.join() && p.b.join() === a.join()));

describe('readAyat', () => {
  it('turns content words into roots and keeps particles as lemmas', () => {
    const [ayah] = readAyat([
      '(74:54:1:1)\tkal~aA^\tAVR\tSTEM|POS:AVR|LEM:kal~aA',
      '(74:54:2:1)\t<in~a\tACC\tSTEM|POS:ACC|LEM:<in~|SP:<in~',
      '(74:54:2:2)\thu,\tPRON\tSUFFIX|PRON:3MS',
      '(74:54:3:1)\tta*okirapN\tN\tSTEM|POS:N|VN|(II)|LEM:ta*okirap|ROOT:*kr|F|INDEF|NOM\r',
    ].join('\r\n'));
    expect(ayah).toMatchObject({ surah: 74, ayah: 54 });
    expect(ayah.tokens).toEqual([{ key: 'p:kal~aA', word: 0 }, { key: 'p:<in~', word: 1 }, { key: 'r:*kr', word: 2 }]);
  });
});

describe('findSimilar', () => {
  const pairs = findSimilar(readAyat(JUZ_TABARAK_AND_AMMA));

  it('pairs ayat that say the same thing in different words', () => {
    expect(has(pairs, [74, 54, 55], [80, 11, 12])).toBe(true);
    expect(has(pairs, [73, 19, 19], [76, 29, 30])).toBe(true);
    expect(has(pairs, [75, 20, 21], [76, 27, 27])).toBe(true);
  });

  it('highlights the shared words on both sides', () => {
    const p = pairs.find(x => x.a.join() === '74,54,55' && x.b.join() === '80,11,12')!;
    expect(p.roots).toEqual(expect.arrayContaining(['ذكر']));
    expect(p.marksA).toEqual(expect.arrayContaining([54002, 55001, 55002]));
    expect(p.marksB).toEqual(expect.arrayContaining([11002, 12001, 12002]));
  });

  it('keeps one pair where windows overlap on both sides', () => {
    const overlapping = pairs.filter(p => p.a[0] === 74 && p.b[0] === 80 && p.a[1] <= 55 && p.a[2] >= 54 && p.b[1] <= 12 && p.b[2] >= 11);
    expect(overlapping).toHaveLength(1);
  });

  it('never pairs a window with itself or an overlapping window', () => {
    for (const p of pairs) if (p.a[0] === p.b[0]) expect(p.a[2] < p.b[1] || p.b[2] < p.a[1]).toBe(true);
  });
});

describe('similar.json', () => {
  it('holds the examples from the whole Qur\'an', () => {
    const all = built.pairs as SimilarPair[];
    expect(has(all, [74, 54, 55], [80, 11, 12])).toBe(true);
    expect(has(all, [73, 19, 19], [76, 29, 30])).toBe(true);
    expect(has(all, [75, 20, 21], [76, 27, 27])).toBe(true);
    expect(has(all, [74, 53, 53], [75, 20, 21])).toBe(true);
  });
});
