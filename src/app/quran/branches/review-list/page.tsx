import { notFound } from 'next/navigation';
import { reviewPool } from '@shared/quran/branchInventory';
import { treePreviewOf } from '@/app/quran/read/ayahPreview';
import tiers from './tiers.json';
import ReviewList from './ReviewList';

/** TEMPORARY (2026-11-17, not for main): every tree in open-audits/trees-like-musa.md on one page, for the owner to scroll. */
export const dynamic = 'force-dynamic';

const GROUPS = ['A', 'B', 'C'] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ g?: string }> }) {
  if (process.env.NODE_ENV === 'production' && !process.env.REVIEW_LIST) notFound();
  const g = (await searchParams).g;
  const group = GROUPS.find(name => name === g) ?? 'A';
  const pool = new Map(reviewPool().map(piece => [piece.id, piece]));
  const ids = (tiers as Record<string, string[]>)[group];
  const trees = ids.flatMap(id => { const piece = pool.get(id); return piece ? [{ ...treePreviewOf(piece), matrixOnly: false }] : []; });
  const missing = ids.filter(id => !pool.has(id));
  return <ReviewList group={group} groups={GROUPS.map(name => ({ name, count: (tiers as Record<string, string[]>)[name].length }))} trees={trees} missing={missing} />;
}
