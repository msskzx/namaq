import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProphet, PROPHETS, storyTitle } from '@shared/quran/prophets';
import { buildStory } from '@shared/quran/prophets/story';
import { QURAN_TEXT } from '@shared/quran/prophets/text';
import { STORIES } from '@shared/quran/prophets/stories';
import data from '@shared/quran/prophets/verdicts.json';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { withUnappliedStoryReviews } from '@/lib/quran/curation/storyReviewLog';
import ProphetView from './ProphetView';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROPHETS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prophet = findProphet((await params).slug);
  return prophet ? { title: storyTitle(prophet) } : {};
}

export default async function QuranProphetPage({ params }: Props) {
  const prophet = findProphet((await params).slug);
  if (!prophet) notFound();
  const story = STORIES[prophet.slug];
  const all = withUnappliedStoryReviews(data.places as PlaceVerdicts);
  const verdicts = Object.fromEntries(Object.entries(all).filter(([key]) => key.startsWith(`${prophet.slug}/`)));
  const events = buildStory(story.events, QURAN_TEXT);
  // Readers get the story already cut; the dropped dots and the drafted reasons go only to the owner's own machine, where review can save.
  const owner = process.env.NODE_ENV === 'development';
  return (
    <div dir="rtl" className="w-full px-4 py-6 sm:px-6 lg:px-10 flex flex-col gap-8 text-[var(--home-ink)]">
      <ProphetView slug={prophet.slug} title={storyTitle(prophet)} intro={story.intro} phases={story.phases} events={owner ? events : keptViews(prophet.slug, events, verdicts)} {...(owner ? { verdicts } : {})} />
    </div>
  );
}
