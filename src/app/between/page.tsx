import type { Metadata } from 'next';
import { betweenView, pickedSlugs, pickPeople } from '@/lib/tarajim';
import BetweenPage from './BetweenPage';

export const metadata: Metadata = { title: 'بين عدة أشخاص' };

/**
 * «بين عدة أشخاص» (the app's between screen, owner 2026-11-18; sketch tarajim-app/graph/sketch2-dark.png, screen 7): the
 * reader picks two people or more (`?slugs=a,b`), and the nearest ties that join them are drawn and said in one sentence,
 * with the pages that state each tie.
 */
export default async function BetweenComparePage({ searchParams }: { searchParams: Promise<{ slugs?: string }> }) {
  return <BetweenPage view={betweenView(pickedSlugs((await searchParams).slugs))} people={pickPeople()} />;
}
