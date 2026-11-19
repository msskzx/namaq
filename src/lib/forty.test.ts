import { describe, expect, it } from 'vitest';
import { fortyEntry, hadithCards } from './forty';

describe('the Forty in the feed', () => {
  it('takes turns: a hadith of the Sahihayn, an Ibn Rajab passage, then the books that record one', () => {
    const cards = hadithCards(20000, [0, 1, 2, 3]);
    expect(cards.map(card => [card.slot, card.kind])).toEqual([[0, 'hadith'], [1, 'rajab'], [2, 'recorded'], [3, 'hadith']]);
    const rajab = cards[1];
    expect(rajab.kind === 'rajab' && rajab.passage.length).toBeGreaterThan(0);
    expect(hadithCards(20000, [0, 1])).toEqual(cards.slice(0, 2));
  });

  it('carries only the Forty al-Nawawi takes whole from the Sahihayn (the most authentic first), in every card', () => {
    const cards = hadithCards(20000, Array.from({ length: 90 }, (_, i) => i));
    expect(cards.some(card => card.kind === 'recorded')).toBe(true);
    for (const card of cards) {
      const entry = fortyEntry(card.entry.n)!;
      expect(entry.partial, `${card.kind} ${entry.n}`).toBeFalsy();
      expect(entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'), `${card.kind} ${entry.n}`).toBe(true);
    }
  });
});
