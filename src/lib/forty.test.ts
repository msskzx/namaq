import { describe, expect, it } from 'vitest';
import { fortyEntry, hadithCards } from './forty';

describe('the Forty in the feed', () => {
  it('takes turns: a hadith of the Sahihayn, an Ibn Rajab passage, the books that record one, then al-Bukhari\'s chain for one', () => {
    const cards = hadithCards(20000, [0, 1, 2, 3, 4]);
    expect(cards.map(card => [card.slot, card.kind])).toEqual([[0, 'hadith'], [1, 'rajab'], [2, 'recorded'], [3, 'isnad'], [4, 'hadith']]);
    const rajab = cards[1];
    expect(rajab.kind === 'rajab' && rajab.passage.length).toBeGreaterThan(0);
    expect(hadithCards(20000, [0, 1])).toEqual(cards.slice(0, 2));
  });

  it('carries only the Forty al-Nawawi takes whole from the Sahihayn (the most authentic first), in every card', () => {
    const cards = hadithCards(20000, Array.from({ length: 90 }, (_, i) => i));
    expect(cards.some(card => card.kind === 'recorded')).toBe(true);
    // A group's hadith card and its «من أخرجه» card are never the same hadith.
    for (const card of cards.filter(each => each.kind === 'recorded')) expect(cards.find(each => each.slot === card.slot - 2)!.entry.n).not.toBe(card.entry.n);
    // Nor is its «من الإسناد» card the hadith of either.
    for (const card of cards.filter(each => each.kind === 'isnad')) {
      expect([card.slot - 3, card.slot - 1].map(slot => cards.find(each => each.slot === slot)!.entry.n)).not.toContain(card.entry.n);
      expect(card.kind === 'isnad' && card.record.isnad.nodes[0].label).toBe('البخاري');
    }
    for (const card of cards) {
      const entry = fortyEntry(card.entry.n)!;
      expect(entry.partial, `${card.kind} ${entry.n}`).toBeFalsy();
      expect(entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'), `${card.kind} ${entry.n}`).toBe(true);
    }
  });
});
