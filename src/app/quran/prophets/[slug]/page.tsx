import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProphet, PROPHETS } from '@shared/quran/prophets';
import { buildStory, storedText } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import { AYAT } from '../ayat';
import ProphetView from './ProphetView';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROPHETS.map(({ slug }) => ({ slug }));
}

const title = (name: string) => `قصة ${name} عليه السلام في القرآن`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prophet = findProphet((await params).slug);
  return prophet ? { title: title(prophet.name) } : {};
}

export default async function QuranProphetPage({ params }: Props) {
  const prophet = findProphet((await params).slug);
  if (!prophet) notFound();
  const story = STORIES[prophet.slug];
  return (
    <div dir="rtl" className="w-full px-4 py-6 sm:px-6 lg:px-10 flex flex-col gap-8 text-[var(--home-ink)]">
      <ProphetView slug={prophet.slug} title={title(prophet.name)} intro={story.intro} phases={story.phases} events={buildStory(story.events, storedText(AYAT[prophet.slug]))} />
    </div>
  );
}
