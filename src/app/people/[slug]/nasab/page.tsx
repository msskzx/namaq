import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findPerson, nasabView, pickPeople, personName } from '@/lib/tarajim';
import NasabPage from './NasabPage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const person = findPerson((await params).slug);
  return { title: person ? `نسب ${personName(person)}` : 'النسب' };
}

/**
 * «النسب» (the app's nasab screen, owner 2026-11-18): the tree of the picked people's fathers, one person to start and
 * more added (`?with=a,b`), parting where their nasabs part, with where each pair meets written out.
 */
export default async function PersonNasabPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ with?: string }> }) {
  const { slug } = await params;
  if (!findPerson(slug)) notFound();
  const others = ((await searchParams).with ?? '').split(',').filter(s => s && s !== slug && findPerson(s)).slice(0, 7);
  return <NasabPage view={nasabView([slug, ...others])} people={pickPeople()} />;
}
