import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findPerson, lifeCompare, PEOPLE, personName } from '@/lib/tarajim';
import LifePage from './LifePage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const person = findPerson((await params).slug);
  return { title: person ? `حياة ${personName(person)}` : 'حياتهما' };
}

/**
 * «حياتهما» (the app's life screen, owner 2026-11-18; sketch timeline-events/sketch-dark.png, screen 4): two lives or
 * more side by side by year (`?with=a,b`), what they shared on one row.
 */
export default async function PersonLifePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ with?: string }> }) {
  const { slug } = await params;
  if (!findPerson(slug)) notFound();
  const others = ((await searchParams).with ?? '').split(',').filter(s => s && s !== slug && findPerson(s)).slice(0, 7);
  const people = PEOPLE.map(person => ({ slug: person.slug, name: personName(person) }));
  return <LifePage view={lifeCompare([slug, ...others])} people={people} />;
}
