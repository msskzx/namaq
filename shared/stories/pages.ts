import { num } from '../quran/arabicNumber';
import type { AppCite } from '../battles/battle';
import type { AppStory, StoryPage } from './story';

export type PageKey = StoryPage | 'none';

export type StoryChapter = { name: string; stories: AppStory[] };

export type StoriesPage = {
  key: PageKey;
  label: string;
  title: string;
  chapters: StoryChapter[];
  refs: AppCite[];
};

const chaptersOf = (stories: AppStory[]): StoryChapter[] => {
  const chapters = new Map<string, AppStory[]>();
  for (const story of stories) chapters.set(story.chapter, [...(chapters.get(story.chapter) ?? []), story]);
  return [...chapters].map(([name, list]) => ({ name, stories: list }));
};

export const storyChapters = (stories: AppStory[]) => chaptersOf(stories);

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
