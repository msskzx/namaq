import { describe, expect, it } from 'vitest';
import { fortyEntry, hadithCardOf, hadithItems } from './forty';

describe('the Forty in the feed', () => {
  it('carries only the Forty al-Nawawi takes whole from the Sahihayn (the most authentic first), in every card', () => {
    for (const kind of ['hadith', 'rajab', 'recorded', 'isnad'] as const) {
      const cards = hadithItems(kind).map(item => hadithCardOf(kind, item)!);
      expect(cards.length, kind).toBeGreaterThan(0);
      for (const card of cards) {
        const entry = fortyEntry(card.entry.n)!;
        expect(entry.partial, `${kind} ${entry.n}`).toBeFalsy();
        expect(entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'), `${kind} ${entry.n}`).toBe(true);
        // «من الإسناد» draws al-Bukhari's own chain.
        if (card.kind === 'isnad') expect(card.record.isnad.nodes[0].label).toBe('البخاري');
        if (card.kind === 'rajab') expect(card.passage.length).toBeGreaterThan(0);
      }
    }
  });
});
