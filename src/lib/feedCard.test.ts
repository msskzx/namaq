// A card saved from the website's feed is found again by its id and drawn as it was (owner 2026-11-20: every home card
// has its save in the row under it, on the app and the website alike).
import { describe, expect, it } from 'vitest';
import { cardBookmarkId } from '@shared/bookmarkKind';
import { savedFeedCard } from './feedCard';
import { hadithCards } from './forty';
import { siraCards, storyCards } from './homeFeed';
import { sahihCards } from './sahih';
import { nameCards, tarajimCards } from './tarajim';
import { termCard } from './balaghaTerms';

/** Any day: the feed's turns differ day by day, the ids do not. */
const DAY = 20412;
const SLOTS = [0, 1, 2, 3, 4, 5];

describe('a saved feed card', () => {
  it('is found again by its kind and item, the same card the feed drew', async () => {
    const drawn = [
      ...hadithCards(DAY, SLOTS), ...tarajimCards(DAY, SLOTS), ...nameCards(DAY, SLOTS),
      ...(await siraCards(DAY, SLOTS)), ...(await sahihCards(DAY, [0, 1])),
      ...storyCards(DAY, SLOTS).map(card => ({ ...card, kind: 'prophets' })),
      { ...(await termCard(DAY, 1)), kind: 'term' },
    ];
    // Every kind the website's feed draws from the server.
    expect([...new Set(drawn.map(card => card.kind))].sort()).toEqual(['bukhari', 'hadith', 'isnad', 'kunya', 'laqab', 'life', 'moment', 'muslim', 'prophets', 'rajab', 'recorded', 'sira', 'term', 'tarajim', 'tie'].sort());
    for (const card of drawn) {
      const again = await savedFeedCard(cardBookmarkId(card.kind, card.item), DAY);
      expect(again, `${card.kind}:${card.item}`).not.toBeNull();
      expect(again && 'card' in again ? { kind: again.kind, item: again.card.item } : null).toEqual({ kind: card.kind, item: card.item });
    }
  });

  it('is nothing when the data no longer holds it', async () => {
    expect(await savedFeedCard(cardBookmarkId('hadith', '9999'), DAY)).toBeNull();
    expect(await savedFeedCard(cardBookmarkId('unknown', 'x'), DAY)).toBeNull();
    expect(await savedFeedCard('tree-id', DAY)).toBeNull();
  });
});
