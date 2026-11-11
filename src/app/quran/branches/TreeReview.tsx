'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CircleHelp, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import type { BranchReviewState } from '@shared/quran/branchVerdicts';

type Action = Exclude<BranchReviewState, null>;

/** The owner's three choices for one branches card, on their own machine. Pressing the current choice again clears it. */
export default function TreeReview({ id, text, state }: { id: string; text: string; state: BranchReviewState }) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const [chosen, setChosen] = useState<BranchReviewState | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  useEffect(() => setChosen(undefined), [id, state]);
  const current = chosen !== undefined ? chosen : state;
  const send = async (action: Action) => {
    const undo = action === current;
    setChosen(undo ? null : action);
    setFailed(false);
    try {
      const response = await fetch('/api/quran/branch-review', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, text, action: undo ? 'undo' : action }) });
      if (!response.ok) throw new Error(String(response.status));
      router.refresh();
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
  return <div className="flex items-center gap-1" data-tree-review>
    {failed && <p role="alert" className="text-sm text-[var(--home-accent)]">{ar ? 'تعذّر الحفظ.' : 'Could not save.'}</p>}
    {choices.map(({ action, label, Icon }) => <Button key={action} size="lg" variant="muted" active={current === action} aria-pressed={current === action} aria-label={label} title={label} onClick={() => send(action)}><Icon aria-hidden /></Button>)}
  </div>;
}
