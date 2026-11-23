// The «قصص السيرة» page (owner, 2026-11-23): one page for each year, swiped right to left, and al-Bukhari's chapters on
// each page in his order. «قبل الهجرة» comes first and «بلا سنة» last; a year with no story has no page.
import { num } from '../quran/arabicNumber';
import type { AppCite } from '../battles/battle';
import type { AppStory, StoryPage } from './story';

/** A page's key: a year page's, or «بلا سنة». */
export type PageKey = StoryPage | 'none';

export type StoryChapter = { name: string; stories: AppStory[] };

export type StoriesPage = {
  key: PageKey;
  /** The strip's short label («قبل الهجرة», «٨», «بلا سنة»). */
  label: string;
  /** The page's heading. */
  title: string;
  chapters: StoryChapter[];
  /** The quotes that give this page's year, each once. */
  refs: AppCite[];
};

const chaptersOf = (stories: AppStory[]): StoryChapter[] => {
  const chapters = new Map<string, AppStory[]>();
  for (const story of stories) chapters.set(story.chapter, [...(chapters.get(story.chapter) ?? []), story]);
  return [...chapters].map(([name, list]) => ({ name, stories: list }));
};

/** Every chapter with all its stories, whatever their year: the «الفهرس». The stories come in al-Bukhari's order. */
export const storyChapters = (stories: AppStory[]) => chaptersOf(stories);

/** The pages, in time: «قبل الهجرة», the years in order, then «بلا سنة». A story the sources date two ways is on both years. */
export function storyPages(stories: AppStory[]): StoriesPage[] {
  const years = [...new Set(stories.flatMap(story => story.when?.pages ?? []).filter((page): page is number => page !== 'before'))].sort((a, b) => a - b);
  const keys: PageKey[] = [...(stories.some(story => story.when?.pages.includes('before')) ? ['before' as const] : []), ...years,
    ...(stories.some(story => !story.when) ? ['none' as const] : [])];
  return keys.map(key => {
    const on = stories.filter(story => (key === 'none' ? !story.when : story.when?.pages.includes(key)));
    const refs = new Map<string, AppCite>();
    for (const ref of on.flatMap(story => story.when?.refs ?? [])) refs.set(`${ref.cite}|${ref.text}`, ref);
    return {
      key,
      label: key === 'before' ? 'قبل الهجرة' : key === 'none' ? 'بلا سنة' : num(key),
      title: key === 'before' ? 'بمكة قبل الهجرة' : key === 'none' ? 'بلا سنة' : `السنة ${num(key)}`,
      chapters: chaptersOf(on),
      refs: [...refs.values()],
    };
  });
}
