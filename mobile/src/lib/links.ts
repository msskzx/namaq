import data from '@shared/data/links.json';
import type { Link, LinkIndex } from '@shared/links';
import type { AppStory, AppStoryAyat } from '@shared/stories/story';
import { STORIES, storyOf } from './stories';
import surahs from '@shared/data/quran/surahs.json';

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
 * The ayat a story says were revealed about a person (the link written on the story, not on his entry), once for each set
 * of ayat the story gives, in mushaf order; `keys` are the set's ayat less those his entry already gives (`given`), which
 * his page draws from the entry, and a set with none left is left out.
 */
export function storyAyatOf(slug: string, given: readonly string[] = []): { story: AppStory; ayat: AppStoryAyat; keys: string[] }[] {
  const sets = new Map<string, { story: AppStory; ayat: AppStoryAyat; keys: string[] }>();
  for (const link of linksOf(`person:${slug}`)) {
    if (!link.to.startsWith('ayah:')) continue;
    const key = idKey(link.to);
    for (const story of link.at.filter(at => at.startsWith('event:')).flatMap(at => storyOf(idKey(at)) ?? [])) {
      for (const ayat of story.ayat.filter(each => each.about?.slug === slug && inAyat(key, each.from, each.to))) {
        const keys = ayatOf(ayat.from, ayat.to).filter(each => !given.includes(each));
        if (keys.length) sets.set(`${story.slug} ${ayat.from} ${ayat.label}`, { story, ayat, keys });
      }
    }
  }
  return [...sets.values()].sort((a, b) => ayahOrder(a.keys[0]) - ayahOrder(b.keys[0]));
}

/** Every ayah from one key to another in the mushaf's order, across a surah's end: exactly the ayat a source names. */
export function ayatOf(from: string, to: string) {
  let [surah, ayah] = from.split(':').map(Number);
  const keys = [from];
  while (keys[keys.length - 1] !== to && surah <= 114) {
    if (ayah < (surahs.find(row => row.number === surah)?.numberOfAyat ?? 0)) ayah++;
    else { surah++; ayah = 1; }
    keys.push(`${surah}:${ayah}`);
  }
  return keys;
}

const ayahOrder = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return surah * 1000 + ayah; };

/** Whether an ayah («2:255») is within a run of ayat, which may cross a surah's end. */
export const inAyat = (key: string, from: string, to: string) => ayahOrder(key) >= ayahOrder(from) && ayahOrder(key) <= ayahOrder(to);
