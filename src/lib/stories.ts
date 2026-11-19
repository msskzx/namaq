import data from '@shared/data/events/stories.json';
import type { AppStory } from '@shared/stories/story';

/** The sira stories, in the source's order, as the app has them (mobile/src/lib/stories.ts; scripts/battles/buildAppBattles.ts writes them). */
export const STORIES = data as AppStory[];

export const storyOf = (slug: string): AppStory | undefined => STORIES.find(story => story.slug === slug);

/** Every tag the stories carry, in the order they first come. */
export const STORY_TAGS = [...new Set(STORIES.flatMap(story => story.tags))];
