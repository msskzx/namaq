import dataFile from '@shared/data/events/stories.json';
import type { AppStory } from '@shared/stories/story';
import { storyPages, storyChapters } from '@shared/stories/pages';
import { dataOf } from '@shared/appData';

const data = dataOf(dataFile);

/** The sira stories in the app, in al-Bukhari's order of chapters: written from the catalog by scripts/battles/buildAppBattles.ts. */
export const STORIES = data as AppStory[];

export const storyOf = (slug: string): AppStory | undefined => STORIES.find(story => story.slug === slug);

/** Every tag the stories carry, in the order they first come. */
export const STORY_TAGS = [...new Set(STORIES.flatMap(story => story.tags))];

/** The year pages of «قصص السيرة» and the chapters of its «الفهرس». */
export const STORY_PAGES = storyPages(STORIES);
export const STORY_CHAPTERS = storyChapters(STORIES);
