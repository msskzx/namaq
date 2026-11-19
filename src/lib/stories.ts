import data from '@shared/data/events/stories.json';
import battlesData from '@shared/data/battles/battles.json';
import type { AppStory } from '@shared/stories/story';
import type { AppBattle } from '@shared/battles/battle';
import { ayatPages, type AyatPage } from '@/lib/storyAyat';

/** The sira stories, in the source's order, as the app has them (mobile/src/lib/stories.ts; scripts/battles/buildAppBattles.ts writes them). */
export const STORIES = data as AppStory[];

export const storyOf = (slug: string): AppStory | undefined => STORIES.find(story => story.slug === slug);

/** Every tag the stories carry, in the order they first come. */
export const STORY_TAGS = [...new Set(STORIES.flatMap(story => story.tags))];

/** A story's ayat in the mushaf's lines, one list of pages for each of its ayat (the story page, its feed card and its quiz look-up). */
export const storyAyat = (story: AppStory): Promise<AyatPage[][]> => Promise.all(story.ayat.map(item => ayatPages(item.from, item.to)));

/** The battles as the app has them (shared/data/battles/battles.json), for the sira quiz's look-up. */
export const BATTLES = battlesData as AppBattle[];

export const battleOf = (slug: string): AppBattle | undefined => BATTLES.find(battle => battle.slug === slug);
