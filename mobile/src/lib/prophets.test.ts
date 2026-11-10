import { describe, expect, it } from 'vitest';
import { PROPHETS } from '@shared/quran/prophets';
import { STORIES } from '@shared/quran/prophets/stories';
import { storyKeys } from '@shared/quran/prophets/story';
import { prophetStory } from './prophets';

describe.each(PROPHETS)('$slug on the phone', ({ slug }) => {
  it('builds every station from the bundled Quran, with every ayah of the story', () => {
    const story = prophetStory(slug)!;
    const shown = story.events.flatMap(e => e.segments.flatMap(g => g.lines.map(l => `${g.surah}:${l.ayah}`)));
    expect(shown).toEqual(storyKeys(STORIES[slug].events));
    expect(story.events.every(e => e.segments.every(g => g.name && g.lines.every(l => l.text)))).toBe(true);
  });
});

