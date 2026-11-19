import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoryView from '@/components/stories/StoryView';
import { STORIES, storyOf } from '@/lib/stories';
import { ayatPages } from '@/lib/storyAyat';

export const generateStaticParams = () => STORIES.map(story => ({ slug: story.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const story = storyOf((await params).slug);
  return { title: story?.name ?? 'قصص السيرة' };
}

/** A sira story, as the app's story page (owner, 2026-11-18; every phone feature on the website too, owner 2026-11-19). */
export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = storyOf((await params).slug);
  if (!story) notFound();
  const ayat = await Promise.all(story.ayat.map(item => ayatPages(item.from, item.to)));
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 text-[var(--home-ink)]">
      <StoryView story={story} ayat={ayat} />
    </div>
  );
}
