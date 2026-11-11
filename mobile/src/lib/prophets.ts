import corpus from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { findProphet } from '@shared/quran/prophets';
import { STORIES } from '@shared/quran/prophets/stories';
import { buildStory, type EventView, type Story } from '@shared/quran/prophets/story';

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
let text: Map<string, string> | undefined;
const ayah = (key: string) => (text ??= new Map(corpus.ayat.map(a => [a.key, a.words.join(' ')]))).get(key);

export type ProphetStory = { slug: string; name: string; story: Story; events: EventView[] };
const built = new Map<string, ProphetStory>();

/** A prophet's story with its ayat read from the Quran the app bundles; undefined for an unknown slug. */
export function prophetStory(slug: string): ProphetStory | undefined {
  const prophet = findProphet(slug);
  if (!prophet) return undefined;
  let found = built.get(slug);
  if (!found) {
    const story = STORIES[slug];
    found = { slug, name: prophet.name, story, events: buildStory(story.events, { names, ayah }) };
    built.set(slug, found);
  }
  return found;
}
