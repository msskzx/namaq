import { describe, expect, it } from 'vitest';
import { pairCards } from './pairCards';

describe('compare pair cards', () => {
  it('shows At-Tur and Al-Qalam as six single-ayah cards with marks inside each ayah', () => {
    const cards = pairCards(68, 52);
    expect(cards.map(card => card.sides.map(side => `${side.surah}:${side.ayah}`).join('~'))).toEqual(['52:17~68:34', '52:25~68:30', '52:29~68:2', '52:34~68:41', '52:40~68:46', '52:41~68:47']);
    for (const side of cards.flatMap(card => card.sides)) for (const index of Object.keys(side.ayat[0].marks ?? {})) expect(Number(index)).toBeLessThan(side.ayat[0].words.length);
  });

  it('gives both words of a match the same link', () => {
    for (const card of pairCards(7, 26)) {
      const links = card.sides.map(side => Object.values(side.ayat[0].marks ?? {}).map(mark => mark.link).sort());
      expect(links[0]).toEqual(links[1]);
      expect(links[0].length).toBeGreaterThan(0);
    }
  });
});
