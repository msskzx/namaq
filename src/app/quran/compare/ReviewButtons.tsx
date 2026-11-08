'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { reviewedAs, type ReviewAction } from '@/lib/quran/curation/reviewPage';
import type { PairCard } from './pairCards';

const post = (a: number, b: number, action: ReviewAction | 'undo') => fetch('/api/quran/compare-review', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ a, b, action }) });

/** The owner's two choices for a whole page, on their own machine. The press is saved at once, so the page can be left straight away; pressing the current choice again restores the draft. */
export default function ReviewButtons({ a, b, cards, nextHref }: { a: number; b: number; cards: PairCard[]; nextHref?: string }) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const [chosen, setChosen] = useState<ReviewAction | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  useEffect(() => setChosen(undefined), [a, b]);
  const current = chosen !== undefined ? chosen : reviewedAs(cards.flatMap(card => card.pairs?.map(pair => pair.verdict) ?? [card.verdict]));
  const send = async (action: ReviewAction) => {
    const undo = action === current;
    setChosen(undo ? null : action);
    setFailed(false);
    try {
      const response = await post(a, b, undo ? 'undo' : action);
      if (!response.ok) throw new Error(String(response.status));
      router.refresh();
    } catch {
      setChosen(undefined);
      setFailed(true);
    }
  };
  const agree = ar ? 'موافق' : 'Agreed';
  const drop = ar ? 'حذف' : 'Drop';
  const Forward = ar ? ArrowLeft : ArrowRight;
  const next = ar ? 'التالية غير المراجَعة' : 'Next unreviewed';
  return (
    <div className="flex items-center justify-end gap-2">
      {failed && <p role="alert" className="text-sm text-[var(--home-accent)]">{ar ? 'تعذّر الحفظ.' : 'Could not save.'}</p>}
      <Button size="lg" variant="neutral" active={current === 'agree'} aria-pressed={current === 'agree'} aria-label={agree} title={agree} onClick={() => send('agree')}><Check aria-hidden /></Button>
      <Button size="lg" variant="neutral" active={current === 'drop'} aria-pressed={current === 'drop'} aria-label={drop} title={drop} onClick={() => send('drop')}><X aria-hidden /></Button>
      {nextHref && <Button size="lg" variant="neutral" href={nextHref} aria-label={next} title={next}><Forward aria-hidden /></Button>}
    </div>
  );
}
