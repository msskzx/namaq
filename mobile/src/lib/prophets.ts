import { findProphet, storyTitle } from '@shared/quran/prophets';
import { STORIES } from '@shared/quran/prophets/stories';
import { buildStory, type EventView, type Story } from '@shared/quran/prophets/story';
import { QURAN_TEXT } from '@shared/quran/prophets/text';


export type ProphetStory = { slug: string; name: string; title: string; story: Story; events: EventView[] };
const built = new Map<string, ProphetStory>();

/** A prophet's story with its ayat read from the Quran the app bundles; undefined for an unknown slug. */
export function prophetStory(slug: string): ProphetStory | undefined {
  const prophet = findProphet(slug);
  if (!prophet) return undefined;
  let found = built.get(slug);
  if (!found) {
    const story = STORIES[slug];
    found = { slug, name: prophet.name, title: storyTitle(prophet), story, events: buildStory(story.events, QURAN_TEXT) };
    built.set(slug, found);
  }
  return found;
}
