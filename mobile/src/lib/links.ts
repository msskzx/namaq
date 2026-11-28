import dataFile from '@shared/data/links.json';
import type { Link, LinkIndex } from '@shared/links';
import { ayatOf, type AppStory, type AppStoryAyat } from '@shared/stories/story';
import { STORIES, storyOf } from './stories';
import { dataOf } from '@shared/appData';

export { ayatOf };

const data = dataOf(dataFile);

const LINKS = data as unknown as LinkIndex;

export const linksOf = (id: string): readonly Link[] => LINKS[id] ?? [];

export const idKey = (id: string) => id.slice(id.indexOf(':') + 1);

export function storiesOfPerson(slug: string): AppStory[] {
  const linked = new Set(linksOf(`person:${slug}`).filter(link => link.t === 'IN_EVENT' || link.t === 'SPEAKS_IN').map(link => idKey(link.to)));
  return STORIES.filter(story => linked.has(story.slug));
}

export const storiesOfHadith = (book: string, n: number): AppStory[] =>
  linksOf(`hadith:${book}:${n}`).filter(link => link.t === 'TOLD_IN').flatMap(link => storyOf(idKey(link.to)) ?? []);

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

const ayahOrder = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return surah * 1000 + ayah; };

export const inAyat = (key: string, from: string, to: string) => ayahOrder(key) >= ayahOrder(from) && ayahOrder(key) <= ayahOrder(to);
