'use client';

import { useNavigatingRouter } from '@/components/common/NavigationLoader';

/** Compare is reviewed one surah pair at a time: a plain list of every pair with its number of cards, in mushaf order. */
export default function PairPicker({ pairs, current, names, hrefOf }: { pairs: { page: string; count: number }[]; current: string; names: Record<number, string>; hrefOf: Record<string, string> }) {
  const router = useNavigatingRouter();
  const label = (page: string) => page.split('/').map(n => names[Number(n)]).join(' و');
  const at = pairs.findIndex(pair => pair.page === current);
  return <label className="flex flex-wrap items-center gap-2 text-sm">
    <span>السورتان</span>
    <select value={current} onChange={event => router.push(hrefOf[event.target.value])} className="min-h-11 rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 text-base">
      {pairs.map(pair => <option key={pair.page} value={pair.page}>{label(pair.page)} ({pair.count})</option>)}
    </select>
    <span className="text-[var(--home-muted)]">{at + 1} من {pairs.length}</span>
  </label>;
}
