import { describe, expect, it } from 'vitest';
import { PROPHETS } from '.';
import { MUSA } from './musa';
import { SHUAYB } from './shuayb';
import { STORIES } from './stories';
import { storyKeys } from './story';

const MUSA_EVENTS = MUSA.events;

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
  const keys = storyKeys(MUSA_EVENTS);

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
});

describe('SHUAYB', () => {
  const keys = storyKeys(SHUAYB.events);
  const flat = (byS: Record<number, number[]>) => Object.entries(byS).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names Shuayb', () => {
    const named = flat({ 7: [85, 88, 90, 92], 11: [84, 87, 91, 94], 26: [177], 29: [36] });
    expect(named).toHaveLength(10);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('holds every ayah that names his people, Madyan or the people of the thicket', () => {
    const named = flat({ 7: [85], 9: [70], 11: [84, 95], 15: [78], 22: [44], 26: [176], 29: [36], 38: [13], 50: [14] });
    expect(named).toHaveLength(10);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });
});

describe('STORIES', () => {
  it('gives every prophet a story', () => {
    expect(Object.keys(STORIES).sort()).toEqual(PROPHETS.map(p => p.slug).sort());
  });

  it.each(PROPHETS)('$slug puts every event in a phase, in order, and leaves no phase empty', ({ slug }) => {
    const phases = STORIES[slug].events.map(e => e.phase);
    expect(phases).toEqual([...phases].sort((a, b) => a - b));
    expect([...new Set(phases)]).toEqual(STORIES[slug].phases.map((_, i) => i));
  });
});
