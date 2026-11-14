import { describe, expect, it } from 'vitest';
import { STORIES } from './stories';
import { hasStoryCard, STORY_CARD_EVENTS, STORY_GROUPS, storyGroupOfDay } from './storyGroup';

describe('the prophets card', () => {
  it('takes only groups that fit a card', () => {
    expect(STORY_GROUPS.length).toBeGreaterThan(50);
    for (const { slug, phase } of STORY_GROUPS) {
      const count = STORIES[slug].events.filter(event => event.phase === phase).length;
      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(STORY_CARD_EVENTS);
    }
  });

  it('shows a different group in each card of a day and the same one all day', () => {
    const day = 20_406;
    const cards = [1, 3, 5, 7].map(slot => storyGroupOfDay(day, slot));
    expect(new Set(cards.map(group => `${group.slug}/${group.phase}`)).size).toBe(4);
    expect(storyGroupOfDay(day, 1)).toEqual(cards[0]);
    expect([0, 1, 2, 3].map(hasStoryCard)).toEqual([false, true, false, true]);
  });
});
