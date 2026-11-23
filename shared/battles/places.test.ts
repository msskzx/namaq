import { describe, expect, it } from 'vitest';
import { BATTLE_PLACE, GEONAMES, LANDMARKS, PLACES, placeSayer } from './places';

// Owner, 2026-11-23: every place on the battle maps is correct and carries its reference.
describe('the places on the battle maps', () => {
  const shown = [...new Set([...Object.values(BATTLE_PLACE), ...LANDMARKS])];

  it('names, for every pin, a book that places it, in the book’s own words with a link to its page', () => {
    shown.forEach(key => {
      const books = PLACES[key].refs.filter(ref => !ref.cite.startsWith(GEONAMES));
      expect(books.length, key).toBeGreaterThan(0);
      books.forEach(ref => {
        expect(ref.text, key).not.toBe('');
        expect(ref.url, key).toMatch(/^https:\/\/shamela\.ws\/book\/\d+\/\d+$/);
      });
    });
  });

  it('takes every pin from GeoNames records it links, never from coordinates of our own', () => {
    shown.forEach(key => {
      const records = PLACES[key].refs.filter(ref => ref.cite.startsWith(GEONAMES));
      expect(records.length, key).toBeGreaterThan(0);
      records.forEach(ref => expect(ref.url, key).toMatch(/^https:\/\/www\.geonames\.org\/\d+$/));
    });
  });
});

// The battle page names who says each place's words (owner, 2026-11-23: the speaker is clear to a new reader).
describe('placeSayer', () => {
  it('names the sayer of every quoted place', () => {
    const quoted = Object.values(PLACES).flatMap(place => place.refs).filter(ref => ref.text);
    expect(quoted.length).toBeGreaterThan(0);
    for (const ref of quoted) expect(placeSayer(ref.cite), ref.cite).toBeDefined();
  });
});
