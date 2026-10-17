import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import built from '@/app/quran/compare/similar.json';
import { findSimilar, readAyat, SAME_ROOT, SAME_WORD, type SimilarPair, type Span } from './similar';

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
    expect(has(pairs, [73, 19, 19], [76, 29, 29])).toBe(true);
    expect(has(pairs, [75, 20, 21], [76, 27, 27])).toBe(true);
  });

  it('marks a word the other side repeats as the same word, and a different form of a shared root or particle apart', () => {
    const p = pairs.find(x => x.a.join() === '74,54,55' && x.b.join() === '80,11,12')!;
    expect(p.roots).toEqual(expect.arrayContaining(['ذكر']));
    expect(p.marksA).toEqual([[54, 0, SAME_WORD], [54, 1, SAME_ROOT], [54, 2, SAME_WORD], [55, 0, SAME_WORD], [55, 1, SAME_WORD], [55, 2, SAME_WORD]]);
    expect(p.marksB).toContainEqual([11, 1, SAME_ROOT]);
  });

  it('does not pad a match with a neighbouring ayah that shares nothing', () => {
    const tail = findSimilar(readAyat(readFileSync(MORPHOLOGY, 'utf8').split(/\r?\n/)
      .filter(line => /^\((56|69):/.test(line)).join('\n')));
    expect(has(tail, [56, 74, 74], [69, 52, 52])).toBe(true);
    expect(tail.some(p => p.b.join() === '69,51,52' || p.a.join() === '69,51,52')).toBe(false);
  });

  it('pairs ayat repeated word for word in two surahs, but not inside one', () => {
    const tail = findSimilar(readAyat(readFileSync(MORPHOLOGY, 'utf8').split(/\r?\n/)
      .filter(line => /^\((55|56|69):/.test(line)).join('\n')));
    expect(has(tail, [56, 80, 80], [69, 43, 43])).toBe(true);
    expect(tail.some(p => p.a[0] === 55 && p.b[0] === 55 && p.a[1] === p.a[2] && p.b[1] === p.b[2] && p.a[1] === 13 && p.b[1] === 16)).toBe(false);
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
    expect(has(all, [73, 19, 19], [76, 29, 29])).toBe(true);
    expect(has(all, [56, 74, 74], [69, 52, 52])).toBe(true);
    expect(has(all, [56, 80, 80], [69, 43, 43])).toBe(true);
    expect(has(all, [75, 20, 21], [76, 27, 27])).toBe(true);
    expect(has(all, [74, 53, 53], [75, 20, 21])).toBe(true);
    expect(has(all, [56, 1, 1], [69, 15, 15])).toBe(true);
  });

  it('counts a word as the same when only a leading wa or fa differs', () => {
    const p = (built.pairs as SimilarPair[]).find(x => x.a.join() === '56,75,77' && x.b.join() === '69,38,40')!;
    expect(p.marksA).toContainEqual([76, 0, SAME_WORD]);
    expect(p.marksA).toContainEqual([76, 1, SAME_ROOT]);
    expect(p.marksB).toContainEqual([38, 0, SAME_WORD]);
  });

  it('marks a lone particle only where its counterpart ayah has it in the same place', () => {
    const p = (built.pairs as SimilarPair[]).find(x => x.a.join() === '56,75,77' && x.b.join() === '69,38,40')!;
    expect(p.marksB.filter(([ayah]) => ayah === 39)).toEqual([]);
    expect(p.marksB).toContainEqual([40, 0, SAME_WORD]);
    expect(p.marksA).toContainEqual([77, 0, SAME_WORD]);
  });
});
