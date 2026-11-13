import { describe, expect, it } from 'vitest';
import { nextOpening, openingKeys, openingRound, type Openings } from './openings';

describe('surah openings quiz', () => {
  it('asks the surahs that start inside the range', () => {
    expect(openingKeys(null)).toHaveLength(114);
    // Juz 30 starts at an-Naba.
    expect(openingKeys({ from: 30, to: 30 })).toEqual(Array.from({ length: 37 }, (_, i) => `${78 + i}:1`));
    // Juz 2 lies inside al-Baqara; juz 3 holds the start of Al Imran, juz 4 that of an-Nisa.
    expect(openingKeys({ from: 2, to: 2 })).toEqual([]);
    expect(openingKeys({ from: 3, to: 4 })).toEqual(['3:1', '4:1']);
  });

  it('asks every opening once a round, then starts a new round without repeating the last one', () => {
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const keys = openingRound({ from: 30, to: 30 }, random);
    expect([...keys].sort()).toEqual(openingKeys({ from: 30, to: 30 }).sort());
    let openings: Openings = { range: { from: 30, to: 30 }, keys, at: 0 };
    const asked = [keys[0]];
    for (let i = 0; i < 36; i++) { openings = nextOpening(openings, random); asked.push(openings.keys[openings.at]); }
    expect(new Set(asked).size).toBe(37);
    for (let i = 0; i < 50; i++) {
      const last = openings.keys[openings.keys.length - 1];
      const next = nextOpening({ ...openings, at: openings.keys.length - 1 }, random);
      expect(next.at).toBe(0);
      expect(next.keys[0]).not.toBe(last);
      openings = next;
    }
  });
});
