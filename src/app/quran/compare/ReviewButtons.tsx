'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CircleHelp, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { OWNER_ASK, reviewedAs, type CardAction, type ReviewAction } from '@/lib/quran/curation/reviewPage';
import type { PairCard } from './pairCards';

const post = (a: number, b: number, action: ReviewAction | CardAction | 'undo', card?: string[]) => fetch('/api/quran/compare-review', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ a, b, action, card }) });

function cardState(card: PairCard): CardAction | null {
  const verdicts = card.pairs?.map(pair => pair.verdict) ?? [card.verdict];
  if (verdicts.some(verdict => verdict?.ask === OWNER_ASK)) return 'discuss';
  const reviewed = reviewedAs(verdicts);
  return reviewed ? ({ agree: 'keep', drop: 'drop' } as const)[reviewed] : null;
}

/** The owner's three choices for one card, on their own machine. A range card is decided whole; pressing the current choice again undoes it. */
export function CardReview({ a, b, card }: { a: number; b: number; card: PairCard }) {
  const ar = useLanguage().language === 'ar';
  const [chosen, setChosen] = useState<CardAction | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const current = chosen !== undefined ? chosen : cardState(card);
  const send = async (action: CardAction) => {
    const undo = action === current;
    setChosen(undo ? null : action);
    setFailed(false);
    try {
      const response = await post(a, b, undo ? 'undo' : action, card.pairs?.map(pair => pair.id) ?? [card.id]);
      if (!response.ok) throw new Error(String(response.status));
    } catch {
      setChosen(undefined);
      setFailed(true);
    }
  };
  const choices = [
    { action: 'keep' as const, label: ar ? 'إبقاء' : 'Keep', Icon: Check },
    { action: 'drop' as const, label: ar ? 'حذف البطاقة' : 'Drop card', Icon: X },
    { action: 'discuss' as const, label: ar ? 'للنقاش' : 'Discuss', Icon: CircleHelp },
  ];
  return <>
    {failed && <p role="alert" className="self-center text-sm text-[var(--home-accent)]">{ar ? 'تعذّر الحفظ.' : 'Could not save.'}</p>}
    {choices.map(({ action, label, Icon }) => <Button key={action} size="icon" variant="muted" active={current === action} aria-pressed={current === action} aria-label={label} title={label} onClick={() => send(action)}><Icon size={18} aria-hidden /></Button>)}
  </>;
}

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
