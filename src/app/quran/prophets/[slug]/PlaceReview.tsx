'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CircleHelp, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { OWNER_ASK, type CardAction } from '@/lib/quran/curation/reviewPage';
import type { Verdict } from '@shared/quran/compareCards';

// docs/plans/quran-prophet-timelines.md
export type PlaceState = CardAction | null;

/** What the owner has done with a dot: `null` while only drafted. */
export function placeState(verdict: Verdict | undefined): PlaceState {
  if (verdict?.ask === OWNER_ASK) return 'discuss';
  if (!verdict?.checked) return null;
  return verdict.keep ? 'keep' : 'drop';
}

/** Whether the page was opened for review: `?review=1`, read after the first paint so the page itself stays static. */
export function useReviewMode() {
  const [review, setReview] = useState(false);
  useEffect(() => setReview(new URLSearchParams(window.location.search).get('review') === '1'), []);
  return review;
}

async function post(key: string, action: CardAction | 'undo') {
  const send = () => fetch('/api/quran/story-review', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key, action }) });
  let response = await send();
  // While the dev server recompiles, the route answers 404.
  for (let tries = 0; response.status === 404 && tries < 6; tries++) {
    await new Promise(resolve => setTimeout(resolve, 700));
    response = await send();
  }
  return response;
}

const CHOICES = [
  { action: 'keep' as const, label: 'إبقاء', Icon: Check },
  { action: 'drop' as const, label: 'حذف الموضع', Icon: X },
  { action: 'discuss' as const, label: 'للنقاش', Icon: CircleHelp },
];

/** The owner's three choices for one dot, on their own machine; pressing the current choice again brings back the draft. */
export function PlaceReview({ id, verdict }: { id: string; verdict: Verdict | undefined }) {
  const router = useRouter();
  const [chosen, setChosen] = useState<PlaceState | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  useEffect(() => setChosen(undefined), [verdict]);
  const current = chosen !== undefined ? chosen : placeState(verdict);
  const send = async (action: CardAction) => {
    const undo = action === current;
    setChosen(undo ? null : action);
    setFailed(false);
    try {
      const response = await post(id, undo ? 'undo' : action);
      if (!response.ok) throw new Error(String(response.status));
      router.refresh();
    } catch {
      setChosen(undefined);
      setFailed(true);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {CHOICES.map(({ action, label, Icon }) => (
          <Button key={action} size="icon" variant="muted" active={current === action} aria-pressed={current === action} aria-label={label} title={label} onClick={() => send(action)}>
            <Icon size={18} aria-hidden />
          </Button>
        ))}
        {failed && <p role="alert" className="text-sm text-[var(--home-accent)]">تعذّر الحفظ.</p>}
      </div>
      <p dir="ltr" className="text-start text-sm text-[var(--home-muted)]">
        <span className={verdict?.keep === false ? 'text-[var(--home-accent)]' : 'text-[var(--home-green)]'}>{verdict ? (verdict.keep ? 'keep' : 'drop') : 'no verdict'}</span>
        {verdict ? ` · ${verdict.why}` : ''}
      </p>
    </div>
  );
}
