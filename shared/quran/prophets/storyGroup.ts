// The home feed's prophets card (owner, 2026-11-14): one group of a prophet's story map, the same dots and all its surahs,
// narrow enough to need no sideways scroll; a tap on a dot opens the story there. The feed walks them in order (LIST_OF).
import { STORIES } from './stories';

/** The most events a group may have to fit a phone's card without scrolling sideways (a column is about 2.4rem). */
export const STORY_CARD_EVENTS = 6;

export type StoryGroup = { slug: string; phase: number };

/** Every group of every story that fits a card, in the stories' order: at least two events, at most STORY_CARD_EVENTS. */
export const STORY_GROUPS: StoryGroup[] = Object.entries(STORIES).flatMap(([slug, story]) => story.phases.flatMap((_, phase) => {
  const count = story.events.filter(event => event.phase === phase).length;
  return count >= 2 && count <= STORY_CARD_EVENTS ? [{ slug, phase }] : [];
}));
