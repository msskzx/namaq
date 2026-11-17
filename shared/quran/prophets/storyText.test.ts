import { describe, expect, it } from 'vitest';
import { PROPHETS } from './index';
import { STORIES } from './stories';
import { buildStory, storyKeys } from './story';
import { quranStoryText } from './storyText';

describe.each(PROPHETS)('the story of $slug', ({ slug }) => {
  it('reads every one of its ayat from the Madina pages', () => {
    expect(storyKeys(STORIES[slug].events).filter(key => !quranStoryText.ayah(key))).toEqual([]);
    expect(() => buildStory(STORIES[slug].events, quranStoryText)).not.toThrow();
  });
});
