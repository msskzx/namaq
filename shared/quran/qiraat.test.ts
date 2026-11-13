import { describe, expect, it } from 'vitest';
import { whoReads } from './qiraat';
import { hasQiraat, qiraatOf } from './qiraatData';

const all = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe('whoReads', () => {
  it('names a reader when both his riwayat read alike, else the riwaya', () => {
    const readings = [{ text: 'أ', rawis: [9, 10, 11, 12] }, { text: 'ب', rawis: [1, 2, 3] }];
    expect(whoReads(readings[0], readings)).toBe('عاصم، حمزة');
    expect(whoReads(readings[1], readings)).toBe('نافع، البزي');
  });

  it('calls the biggest reading «the rest» when all twenty are named', () => {
    const readings = [{ text: 'أ', rawis: all(20).filter(n => n !== 11 && n !== 12) }, { text: 'ب', rawis: [11, 12] }];
    expect(whoReads(readings[0], readings)).toBe('الباقون');
    expect(whoReads(readings[1], readings)).toBe('حمزة');
  });

  it('names everyone when a riwaya is missing from the data', () => {
    const readings = [{ text: 'أ', rawis: all(18) }, { text: 'ب', rawis: [19] }];
    expect(whoReads(readings[0], readings)).not.toBe('الباقون');
  });
});

describe('the per-ayah readings', () => {
  it('put Hafs first and anchor each word in the ayah', () => {
    expect(hasQiraat('2:85')).toBe(true);
    expect(hasQiraat('112:1')).toBe(false);
    const words = qiraatOf('2:85');
    expect(words.map(w => w.at[0])).toEqual([10, 16, 17, 48]);
    for (const word of words) expect(word.readings[0].rawis).toContain(10);
  });
});

describe('whoReads with a riwaya that reads two ways', () => {
  it('does not call a reading «the rest» when a riwaya in it is also named for another', () => {
    const readings = [{ text: 'إبراهيم', rawis: all(20).filter(n => n !== 7) }, { text: 'إبراهام', rawis: [7, 8] }];
    expect(whoReads(readings[0], readings)).not.toBe('الباقون');
    expect(whoReads(readings[1], readings)).toBe('ابن عامر');
  });
});
