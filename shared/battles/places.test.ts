import { describe, expect, it } from 'vitest';
import { GEONAMES, LANDMARKS, PLACES, placeSayer } from './places';

describe('the places on the battle maps', () => {
  const shown = Object.keys(PLACES);

  it('has a record for every landmark the maps show', () => {
    LANDMARKS.forEach(key => expect(PLACES[key], key).toBeDefined());
  });

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

describe('placeSayer', () => {
  it('names the sayer of every quoted place', () => {
    const quoted = Object.values(PLACES).flatMap(place => place.refs).filter(ref => ref.text);
    expect(quoted.length).toBeGreaterThan(0);
    for (const ref of quoted) expect(placeSayer(ref.cite), ref.cite).toBeDefined();
  });
});
