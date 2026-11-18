import { notFound } from 'next/navigation';
import { branchInventory, reviewFilters } from '@shared/quran/branchInventory';
import { treePreviewOf } from '@/app/quran/read/ayahPreview';
import { branchReviewState, branchVerdictFor, twinOf } from '@shared/quran/branchVerdicts';
import tiers from './tiers.json';
import ReviewList from './ReviewList';

/** TEMPORARY (2026-11-17, not for main): every tree in open-audits/trees-like-musa.md on one page, for the owner to scroll. */
export const dynamic = 'force-dynamic';

const GROUPS = ['M', 'T', 'S', 'U'] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ g?: string }> }) {
  if (process.env.NODE_ENV === 'production' && !process.env.REVIEW_LIST) notFound();
  const g = (await searchParams).g;
  const group = GROUPS.find(name => name === g) ?? 'M';
  const pool = new Map(branchInventory(reviewFilters({}), null, true).map(piece => [piece.id, piece]));
  const ids = (tiers as unknown as Record<string, string[]>)[group];
  const whys = (tiers as unknown as { why: Record<string, string> }).why ?? {};
  const trees = ids.flatMap(id => { const piece = pool.get(id); return piece ? [{ ...treePreviewOf(piece), matrixOnly: false, why: whys[id] ?? '', state: branchReviewState(branchVerdictFor(piece)), twin: !!twinOf(piece) }] : []; });
  const missing = ids.filter(id => !pool.has(id));
  return <ReviewList group={group} groups={GROUPS.map(name => ({ name, count: (tiers as unknown as Record<string, string[]>)[name].length }))} trees={trees} missing={missing} />;
}
