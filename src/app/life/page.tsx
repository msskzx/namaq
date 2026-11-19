import type { Metadata } from 'next';
import { lifeCompare, pickedSlugs, pickPeople } from '@/lib/tarajim';
import LifePage from './LifePage';

export const metadata: Metadata = { title: 'حياتهم جنبًا إلى جنب' };

/**
 * «حياتهما» (the app's life screen, owner 2026-11-18; sketch timeline-events/sketch-dark.png, screen 4): two lives or
 * more side by side by year (`?slugs=a,b`), what they shared on one row. Opened from the hub with nobody picked yet.
 */
export default async function LifeComparePage({ searchParams }: { searchParams: Promise<{ slugs?: string }> }) {
  return <LifePage view={lifeCompare(pickedSlugs((await searchParams).slugs))} people={pickPeople()} />;
}
