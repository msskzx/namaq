import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProphet, PROPHETS } from '@/lib/quran/prophets';
import { buildStory } from '@/lib/quran/prophets/story';
import { STORIES } from '@/lib/quran/prophets/stories';
import { AYAT } from '../ayat';
import ProphetView from './ProphetView';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROPHETS.map(({ slug }) => ({ slug }));
}

const title = (name: string) => `خط ${name} عليه السلام الزمني في القرآن`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prophet = findProphet((await params).slug);
  return prophet ? { title: title(prophet.name) } : {};
}

export default async function QuranProphetPage({ params }: Props) {
  const prophet = findProphet((await params).slug);
  if (!prophet) notFound();
  const story = STORIES[prophet.slug];
  return (
    <div dir="rtl" className="w-full px-4 py-6 sm:px-6 lg:px-10 flex flex-col gap-8 text-gray-900 dark:text-gray-200">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">قصص الأنبياء في القرآن</p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title(prophet.name)}</h1>
        <p className="max-w-4xl text-sm leading-7 text-gray-600 dark:text-gray-400">{story.intro}</p>
      </header>
      <ProphetView name={prophet.name} phases={story.phases} events={buildStory(story.events, AYAT[prophet.slug])} />
    </div>
  );
}
