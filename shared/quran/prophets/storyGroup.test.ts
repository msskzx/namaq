import { describe, expect, it } from 'vitest';
import { STORIES } from './stories';
import { STORY_CARD_EVENTS, STORY_GROUPS } from './storyGroup';

describe('the prophets card', () => {
  it('takes only groups that fit a card', () => {
    expect(STORY_GROUPS.length).toBeGreaterThan(50);
    for (const { slug, phase } of STORY_GROUPS) {
      const count = STORIES[slug].events.filter(event => event.phase === phase).length;
      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(STORY_CARD_EVENTS);
    }
  });
});
