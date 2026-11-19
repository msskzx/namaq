import type { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import { STORIES, STORY_TAGS } from '@/lib/stories';

export const metadata: Metadata = { title: 'قصص السيرة' };

/** «قصص السيرة» (owner, 2026-11-18; the app's stories screen): every story in the source's order, narrowed by a tag. */
export default async function StoriesPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const picked = tag && STORY_TAGS.includes(tag) ? tag : null;
  const shown = picked ? STORIES.filter(story => story.tags.includes(picked)) : STORIES;
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">قصص السيرة</h1>
      <nav aria-label="الوسوم" className="flex flex-wrap gap-1.5">
        {STORY_TAGS.map(name => (
          picked === name
            ? <Chip key={name} label={name} on small clearHref="/stories" clearLabel={`أزل «${name}»`} />
            : <Link key={name} href={`/stories?tag=${encodeURIComponent(name)}`}><Chip label={name} small /></Link>
        ))}
      </nav>
      {shown.map(story => (
        <Card key={story.slug} href={`/stories/${story.slug}`} className="flex flex-col gap-0.5 px-3.5 py-2.5">
          <span className="text-lg">{story.name}</span>
          <span className="text-sm text-[var(--home-muted)]">{story.tags.join(' · ')}</span>
        </Card>
      ))}
    </div>
  );
}
