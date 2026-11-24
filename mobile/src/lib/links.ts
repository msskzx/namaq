import data from '@shared/data/links.json';
import type { Link, LinkIndex } from '@shared/links';
import type { AppStory, AppStoryAyat } from '@shared/stories/story';
import { STORIES, storyOf } from './stories';

/**
 * Every link between two things, both ways (owner, 2026-11-24), as the catalog build writes it (shared/links.ts). A page
 * finds what touches its own thing here, by its id, and never by searching another feature's data.
 */
const LINKS = data as unknown as LinkIndex;

export const linksOf = (id: string): readonly Link[] => LINKS[id] ?? [];

/** The slug or key an id names after its kind: «person:abu-bakr» → «abu-bakr», «ayah:49:1» → «49:1». */
export const idKey = (id: string) => id.slice(id.indexOf(':') + 1);

/** The stories a person is in or speaks in, in al-Bukhari's order as «قصص السيرة» has them. */
export function storiesOfPerson(slug: string): AppStory[] {
  const linked = new Set(linksOf(`person:${slug}`).filter(link => link.t === 'IN_EVENT' || link.t === 'SPEAKS_IN').map(link => idKey(link.to)));
  return STORIES.filter(story => linked.has(story.slug));
}

/** The stories a hadith tells («في هذا الحديث»). */
export const storiesOfHadith = (book: string, n: number): AppStory[] =>
  linksOf(`hadith:${book}:${n}`).filter(link => link.t === 'TOLD_IN').flatMap(link => storyOf(idKey(link.to)) ?? []);

/**
 * The ayat a story says were revealed about a person (the link written on the story, not on his entry), each with the
 * story and its ayat as the story holds them; `given` are the ayat his entry already gives, not drawn twice.
 */
export function storyAyatOf(slug: string, given: readonly string[] = []): { key: string; story: AppStory; ayat: AppStoryAyat }[] {
  return linksOf(`person:${slug}`).filter(link => link.to.startsWith('ayah:') && !given.includes(idKey(link.to))).flatMap(link => {
    const key = idKey(link.to);
    const story = link.at.filter(at => at.startsWith('event:')).map(at => storyOf(idKey(at))).find(Boolean);
    const ayat = story?.ayat.find(each => each.about?.slug === slug && inAyat(key, each.from, each.to));
    return story && ayat ? [{ key, story, ayat }] : [];
  });
}

/** Whether an ayah («2:255») is within a run of ayat, which may cross a surah's end. */
export const inAyat = (key: string, from: string, to: string) => {
  const order = (each: string) => { const [surah, ayah] = each.split(':').map(Number); return surah * 1000 + ayah; };
  return order(key) >= order(from) && order(key) <= order(to);
};
