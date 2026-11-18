import data from '@shared/data/events/stories.json';
import type { AppStory } from '@shared/stories/story';

/** The sira stories in the app, in the source's order: written from the catalog by scripts/battles/buildAppBattles.ts. */
export const STORIES = data as AppStory[];

export const storyOf = (slug: string): AppStory | undefined => STORIES.find(story => story.slug === slug);

/** Every tag the stories carry, in the order they first come. */
export const STORY_TAGS = [...new Set(STORIES.flatMap(story => story.tags))];
