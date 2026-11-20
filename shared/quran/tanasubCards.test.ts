import { describe, expect, it } from 'vitest';
import generated from '../data/quran/compareCards';
import type { StoredCards } from './compareCards';
import { ORDER_LINKS } from './surahOrder';
import { pairNote, TANASUB_LINKS } from './tanasubCards';

const stored = generated as unknown as StoredCards;
const ayahOf = (key: string) => Number(key.split(':')[1]);

describe('surah-order book cards on the compare pages', () => {
  it('turns every link that names ayah pairs into one card on a listed page, holding exactly the ayat it names', () => {
    for (const link of TANASUB_LINKS) {
      const page = `${link.a}:${link.b}`;
      expect(stored.listed.some(pair => pair.a === link.a && pair.b === link.b), page).toBe(true);
      const cards = (stored.cards[page] ?? []).filter(card => card.k === link.link);
      expect(cards, page).toHaveLength(1);
      const [card] = cards;
      expect(card.p).toEqual(link.pairs.map(([a, b]) => `${a}|${b}`));
      expect(card.a).toEqual([0, 1].map(side => [...new Set(link.pairs.map(pair => ayahOf(pair[side])))].sort((x, y) => x - y)));
      // Every book entry is a card: a verdict on the same pair of ours never hides it.
      expect(card.x).toBeUndefined();
    }
  });

  it('keeps no card of ours whose pairs a book card already holds', () => {
    for (const [page, cards] of Object.entries(stored.cards)) {
      const named = new Set(cards.filter(card => card.k).flatMap(card => card.p));
      if (!named.size) continue;
      expect(cards.filter(card => !card.k && card.p.every(id => named.has(id))), page).toEqual([]);
    }
  });

  it('notes a link that names no ayah pair on its two neighbouring surahs only', () => {
    expect(pairNote(85, 86)?.text).toBe(ORDER_LINKS[86].text);
    expect(pairNote(86, 85)).toBe(pairNote(85, 86));
    // A link that names ayat is a card, not a note; surahs that are not neighbours have none.
    expect(pairNote(87, 88)).toBeUndefined();
    expect(pairNote(85, 87)).toBeUndefined();
  });
});
