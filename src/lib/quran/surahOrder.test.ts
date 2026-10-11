import { describe, expect, it } from 'vitest';
import data from '@/app/quran/order/ayat.json';
import { resolve } from './curatedShifts';
import { ayahWords } from './normalize';
import { buildOrder, HOPS } from './surahOrder';

const count = (n: number) => data.counts[String(n) as keyof typeof data.counts];
const norm = (key: string) => ayahWords(data.ayat[key as keyof typeof data.ayat], false).norm;

describe('HOPS', () => {
  it('covers every neighbouring pair from 78 to 113 once, in order', () => {
    expect(HOPS.map(h => h.from)).toEqual(Array.from({ length: 36 }, (_, k) => 78 + k));
  });

  it('keeps each range ordered, at most five ayat, inside its surah', () => {
    for (const h of HOPS) {
      for (const [n, [from, to]] of [[h.from, h.tail], [h.from + 1, h.head]] as const) {
        expect(from).toBeGreaterThanOrEqual(1);
        expect(to).toBeGreaterThanOrEqual(from);
        expect(to - from).toBeLessThan(5);
        expect(to).toBeLessThanOrEqual(count(n));
      }
    }
  });

  it('has a note on every hop, and a titled http source where one is given', () => {
    for (const h of HOPS) {
      expect(h.note.length).toBeGreaterThan(0);
      for (const s of h.src) expect(s.url.startsWith('https://') && s.title.length > 0).toBe(true);
    }
  });

  it('sources the hops whose page was read', () => {
    expect(HOPS.filter(h => h.src.length).map(h => h.from)).toEqual([93, 105, 107, 113]);
  });

  it('finds each shared phrase once in both ayat it names', () => {
    const shared = HOPS.flatMap(h => (h.shared ?? []).map(s => ({ h, s })));
    expect(shared.length).toBeGreaterThan(0);
    for (const { h, s: [phrase, a, b] } of shared) {
      for (const words of [norm(`${h.from}:${a}`), norm(`${h.from + 1}:${b}`)]) expect(resolve(words, [phrase, 'third'])).toHaveLength(phrase.split(' ').length);
    }
  });
});

describe('buildOrder', () => {
  const { chips, hops } = buildOrder(data);

  it('lists one chip per surah from 78 to 114 with its name', () => {
    expect(chips.map(c => c.number)).toEqual(Array.from({ length: 37 }, (_, k) => 78 + k));
    expect(chips.every(c => c.plain.length > 0)).toBe(true);
  });

  it('colors the shared word on both sides with the same slot', () => {
    const hop = hops.find(h => h.hop.from === 109)!;
    const color = (lines: typeof hop.tail) => lines.flatMap(l => (l.slots ? l.text.split(' ').flatMap((w, i) => (i in l.slots! ? [[w, l.slots![i]]] : [])) : []));
    expect(color(hop.tail).map(([, slot]) => slot)).toEqual([1]);
    expect(color(hop.head).map(([, slot]) => slot)).toEqual([1]);
    expect(hop.words.map(w => ayahWords(w, false).norm[0])).toEqual(['دين']);
  });

  it('keeps the basmala out of the first ayah of a surah', () => {
    const first = hops.find(h => h.hop.from === 112)!.tail[0];
    expect(first.text.startsWith('قُلۡ')).toBe(true);
  });
});
