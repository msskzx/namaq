import { describe, expect, it } from 'vitest';
import generated from '../data/quran/compareCards';
import corpus from './quranText/corpus';
import { shownCards, type StoredCards } from './compareCards';
import { compareMatrixOnly, compareViews } from './compareViews';

const stored = generated as unknown as StoredCards;
const words = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const shown = new Set(stored.listed.flatMap(({ a, b }) => shownCards(stored, key => words.get(key), a, b).map(card => card.id)));

describe('compareViews', () => {
  it('names only cards the compare page shows', () => {
    expect(Object.keys(compareViews).filter(id => !shown.has(id))).toEqual([]);
  });

  it('keeps the owner\'s examples as their matrix only', () => {
    expect(compareMatrixOnly({ id: '9:129|27:26' })).toBe(true);
    expect(compareMatrixOnly({ id: '1:6|4:68' })).toBe(true);
    expect(compareMatrixOnly({ id: '23:13|77:21' })).toBe(false);
  });
});
