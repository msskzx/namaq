// Every card the website feed lists is found by its id and drawn as the app's feed draws it, and a saved card comes back
// the same (owner 2026-11-19: every phone feature on the website; 2026-11-20: every home card can be saved).
import { describe, expect, it } from 'vitest';
import { cardBookmarkId } from '@shared/bookmarkKind';
import { LIST_KINDS } from '@shared/homeFeed';
import { savedFeedCard } from './feedCard';
import { feedItemIds } from './feedLists';

/** Any day: the feed's turns differ day by day, the ids do not. */
const DAY = 20412;
const itemOf = (card: NonNullable<Awaited<ReturnType<typeof savedFeedCard>>>) =>
  'card' in card ? card.card.item : 'note' in card ? card.note.key : 'view' in card ? card.view.key : card.ayah;

describe('a feed card', () => {
  it('of every content kind is drawn from the ids its list gives, the same item again', async () => {
    for (const kind of LIST_KINDS) {
      const ids = feedItemIds(kind, DAY, 5);
      const cards = await Promise.all(ids.map(id => savedFeedCard(cardBookmarkId(kind, id), DAY)));
      // A Sahih number its text lacks, or an ayah whose word has no i'rab, draws nothing; a kind always draws some.
      expect(cards.some(Boolean), kind).toBe(true);
      cards.forEach((card, i) => { if (card) expect([card.kind, itemOf(card)], kind).toEqual([kind, ids[i]]); });
    }
    // The scene cards read every page's words once.
  }, 60_000);

  it('is nothing when the data no longer holds it', async () => {
    expect(await savedFeedCard(cardBookmarkId('hadith', '9999'), DAY)).toBeNull();
    expect(await savedFeedCard(cardBookmarkId('unknown', 'x'), DAY)).toBeNull();
    expect(await savedFeedCard('tree-id', DAY)).toBeNull();
  });
});
