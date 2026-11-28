import dataFile from '@shared/data/events/stories.json';
import type { AppStory } from '@shared/stories/story';
import { storyPages, storyChapters } from '@shared/stories/pages';
import { dataOf } from '@shared/appData';

const data = dataOf(dataFile);

export const STORIES = data as AppStory[];

export const storyOf = (slug: string): AppStory | undefined => STORIES.find(story => story.slug === slug);

export const STORY_TAGS = [...new Set(STORIES.flatMap(story => story.tags))];

export const STORY_PAGES = storyPages(STORIES);
export const STORY_CHAPTERS = storyChapters(STORIES);
