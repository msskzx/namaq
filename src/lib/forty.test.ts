import { describe, expect, it } from 'vitest';
import { hadithCards } from './forty';

describe('the Forty in the feed', () => {
  it('takes turns: a hadith of the Sahihayn in even batches, an Ibn Rajab passage in odd ones', () => {
    const cards = hadithCards(20000, [0, 1, 2, 3]);
    expect(cards.map(card => [card.slot, card.kind])).toEqual([[0, 'hadith'], [1, 'rajab'], [2, 'hadith'], [3, 'rajab']]);
    const rajab = cards[1];
    expect(rajab.kind === 'rajab' && rajab.passage.length).toBeGreaterThan(0);
    expect(hadithCards(20000, [0, 1])).toEqual(cards.slice(0, 2));
  });
});
