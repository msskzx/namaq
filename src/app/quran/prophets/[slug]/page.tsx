import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProphet, PROPHETS, storyTitle } from '@shared/quran/prophets';
import { buildStory, placesOf, storedText, type EventView } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import data from '@shared/quran/prophets/verdicts.json';
import { keptViews, placeKeyOf, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { compareLinksFor, type CompareLink } from '../../compare/pairCards';
import { withUnappliedStoryReviews } from '@/lib/quran/curation/storyReviewLog';
import { AYAT } from '../ayat';
import ProphetView from './ProphetView';

/** Each place's compare pages: listed surah pairs holding a kept card of one of its ayat with an ayah another surah gives the same event. */
function compareOf(slug: string, events: EventView[]): Record<string, CompareLink[]> {
  const out: Record<string, CompareLink[]> = {};
  for (const event of events) {
    const places = placesOf(event);
    const links = compareLinksFor(event.segments.flatMap(g => g.lines.map(line => `${g.surah}:${line.ayah}`)));
    for (const place of places) out[placeKeyOf(slug, place)] = links.filter(({ surahs }) => surahs && surahs[0] !== surahs[1] && surahs.includes(place.surah));
  }
  return out;
}

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
  const events = buildStory(story.events, storedText(AYAT[prophet.slug]));
  // Readers get the story already cut; the dropped dots and the drafted reasons go only to the owner's own machine, where review can save.
  const owner = process.env.NODE_ENV === 'development';
  const shown = owner ? events : keptViews(prophet.slug, events, verdicts);
  return (
    <div dir="rtl" className="w-full px-4 py-6 sm:px-6 lg:px-10 flex flex-col gap-8 text-[var(--home-ink)]">
      <ProphetView slug={prophet.slug} title={storyTitle(prophet)} intro={story.intro} phases={story.phases} events={shown} compare={compareOf(prophet.slug, shown)} {...(owner ? { verdicts } : {})} />
    </div>
  );
}
