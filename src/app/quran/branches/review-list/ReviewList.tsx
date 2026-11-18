'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import type { TreePreview } from '@/app/quran/read/ayahPreview';
import { useRouter } from 'next/navigation';
import type { BranchReviewState } from '@shared/quran/branchVerdicts';
import TreeViewCard from '../TreeViewCard';
import TreeReview from '../TreeReview';

/** What agreeing with the whole page means: keep for متشابهات and تدبّر, drop for search only; unsure has no default. */
const AGREE: Record<string, 'keep' | 'drop' | undefined> = { M: 'keep', T: 'keep', S: 'drop' };

/** Agrees with every card on the page the owner has not pressed yet, one press each, as if pressed by hand. */
function AgreeAll({ group, ids }: { group: string; ids: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const action = AGREE[group];
  if (!action || !ids.length) return null;
  return <button type="button" disabled={busy} className="rounded-lg border px-3 py-1" onClick={async () => {
    setBusy(true);
    for (const id of ids) await fetch('/api/quran/branch-review', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, action }) });
    setBusy(false);
    router.refresh();
  }}>{busy ? 'Saving…' : `Agree with all ${ids.length} unreviewed (${action})`}</button>;
}

/** Draws a card only once it nears the screen, so 381 trees scroll without drawing all at once. */
function Lazy({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setShown(true); }, { rootMargin: '1200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return <div ref={ref} style={{ minHeight: shown ? undefined : 480 }}>{shown ? children : null}</div>;
}

export default function ReviewList({ group, groups, trees, missing }: {
  group: string; groups: { name: string; count: number }[]; trees: (TreePreview & { why?: string; state: BranchReviewState; twin: boolean })[]; missing: string[];
}) {
  return <main dir="rtl" className="mx-auto max-w-3xl px-4 py-6 flex flex-col gap-6">
    <nav className="flex gap-3 sticky top-0 z-10 py-2" style={{ background: 'var(--home-bg, #1c1c1c)' }}>
      {groups.map(item => <Link key={item.name} href={`?g=${item.name}`} style={{ fontWeight: item.name === group ? 700 : 400, textDecoration: item.name === group ? 'underline' : 'none' }}>
        Group {item.name} ({item.count})
      </Link>)}
    </nav>
    <AgreeAll group={group} ids={trees.filter(tree => !tree.state).map(tree => tree.id)} />
    {missing.length > 0 && <p>Not found today: {missing.join(', ')}</p>}
    {trees.map((tree, i) => <section key={tree.id} className="flex flex-col gap-2">
      <h2 className="text-lg"><span dir="ltr">{group}{i + 1}</span> · {tree.text} <a href={tree.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, opacity: 0.7 }} dir="ltr">{tree.id}</a></h2>
      {tree.why && <p dir="ltr" style={{ fontSize: 16, lineHeight: 1.5 }}><b>{({ M: 'متشابهات', T: 'تدبّر', S: 'Search only', U: 'Unsure' } as Record<string, string>)[group]}:</b> {tree.why}</p>}
      <Lazy><TreeViewCard tree={tree} height="420px" names={SURAH_NAMES} start="cards" /></Lazy>
      <div className="flex items-center justify-end gap-2">
        {tree.twin && <span dir="ltr" className="text-sm opacity-70">also in compare: one verdict</span>}
        <TreeReview id={tree.id} state={tree.state} />
      </div>
    </section>)}
  </main>;
}
