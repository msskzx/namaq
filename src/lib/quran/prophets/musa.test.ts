import { describe, expect, it } from 'vitest';
import data from '@/app/quran/prophets/ayat/musa.json';
import { MUSA } from './musa';
import { buildStory } from './story';

const MUSA_EVENTS = MUSA.events;
const buildMusa = (d: Parameters<typeof buildStory>[1]) => buildStory(MUSA_EVENTS, d);

const NAMED: Record<number, number[]> = {
  2: [51, 53, 54, 55, 60, 61, 67, 87, 92, 108, 136, 246, 248],
  3: [84],
  4: [153, 164],
  5: [20, 22, 24],
  6: [84, 91, 154],
  7: [103, 104, 115, 117, 122, 127, 128, 131, 134, 138, 142, 143, 144, 148, 150, 154, 155, 159, 160],
  10: [75, 77, 80, 81, 83, 84, 87, 88],
  11: [17, 96, 110],
  14: [5, 6, 8],
  17: [2, 101],
  18: [60, 66],
  19: [51],
  20: [9, 11, 17, 19, 36, 40, 49, 57, 61, 65, 67, 70, 77, 83, 86, 88, 91],
  21: [48],
  22: [44],
  23: [45, 49],
  25: [35],
  26: [10, 43, 45, 48, 52, 61, 63, 65],
  27: [7, 9, 10],
  28: [3, 7, 10, 15, 18, 19, 20, 29, 30, 31, 36, 37, 38, 43, 44, 48, 76],
  29: [39],
  32: [23],
  33: [7, 69],
  37: [114, 120],
  40: [23, 26, 27, 37, 53],
  41: [45],
  42: [13],
  43: [46],
  46: [12, 30],
  51: [38],
  53: [36],
  61: [5],
  79: [15],
  87: [19],
};

const PHARAOH: Record<number, number[]> = {
  2: [49, 50],
  3: [11],
  7: [103, 104, 109, 113, 123, 127, 130, 137, 141],
  8: [52, 54],
  10: [75, 79, 83, 88, 90],
  11: [97],
  14: [6],
  17: [101, 102],
  20: [24, 43, 60, 78, 79],
  23: [46],
  26: [11, 16, 23, 41, 44, 53],
  27: [12],
  28: [3, 4, 6, 8, 9, 32, 38],
  29: [39],
  38: [12],
  40: [24, 26, 28, 29, 36, 37, 45, 46],
  43: [46, 51],
  44: [17, 31],
  50: [13],
  51: [38],
  54: [41],
  66: [11],
  69: [9],
  73: [15, 16],
  79: [17],
  85: [18],
  89: [10],
};

describe('MUSA_EVENTS', () => {
  const keys = MUSA_EVENTS.flatMap(e => e.segments.flatMap(({ surah, range: [lo, hi] }) => Array.from({ length: hi - lo + 1 }, (_, k) => `${surah}:${lo + k}`)));

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names Musa', () => {
    const named = Object.entries(NAMED).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));
    expect(named).toHaveLength(131);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('holds every ayah that names Pharaoh or Haman', () => {
    const named = Object.entries(PHARAOH).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));
    expect(named).toHaveLength(67);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('keeps every range ordered', () => {
    for (const e of MUSA_EVENTS) for (const g of e.segments) expect(g.range[0]).toBeLessThanOrEqual(g.range[1]);
  });

  it('starts with the mother of Musa and keeps phases in order', () => {
    expect(MUSA_EVENTS[0].title).toBe('أم موسى والتابوت في اليم');
    const phases = MUSA_EVENTS.map(e => e.phase);
    expect(phases).toEqual([...phases].sort((a, b) => a - b));
  });

  it('has the stored text of every ayah', () => {
    for (const k of keys) expect((data.ayat as Record<string, string>)[k], k).toBeTruthy();
    expect(Object.keys(data.ayat)).toHaveLength(keys.length);
  });
});

describe('buildStory', () => {
  const events = buildMusa(data);

  it('numbers events in order and counts their ayat', () => {
    expect(events.map(e => e.n)).toEqual(events.map((_, i) => i + 1));
    for (const e of events) expect(e.count).toBe(e.segments.reduce((t, g) => t + g.lines.length, 0));
  });

  it('names the surah of each segment without its prefix', () => {
    const nile = events[0].segments[0];
    expect(nile.surah).toBe(28);
    expect(nile.name).not.toMatch(/^سُورَةُ/);
  });

  it('throws when an ayah is missing', () => {
    expect(() => buildMusa({ names: {}, ayat: {} })).toThrow(/missing/);
  });
});
