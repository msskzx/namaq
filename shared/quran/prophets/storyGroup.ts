import { STORIES } from './stories';

export const STORY_CARD_EVENTS = 6;

export type StoryGroup = { slug: string; phase: number };

export const STORY_GROUPS: StoryGroup[] = Object.entries(STORIES).flatMap(([slug, story]) => story.phases.flatMap((_, phase) => {
  const count = story.events.filter(event => event.phase === phase).length;
  return count >= 2 && count <= STORY_CARD_EVENTS ? [{ slug, phase }] : [];
}));
