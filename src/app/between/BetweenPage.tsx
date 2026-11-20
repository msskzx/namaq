'use client';

import { useState } from 'react';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import type { BetweenView, PickPerson } from '@/lib/tarajim';
import Segmented from '@/components/common/Segmented';
import CardWithRow from '@/components/common/CardWithRow';
import PeoplePicker from '@/components/tarajim/PeoplePicker';
import { betweenHref, BookCredit, TiesChain } from '@/components/tarajim/TarajimParts';

export default function BetweenPage({ view, people }: { view: BetweenView; people: PickPerson[] }) {
  const [first] = view.people;
  // The chain drawn or said in one sentence: one at a time, the drawing first (owner, 2026-11-20).
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3.5 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">بين عدة أشخاص</h1>
      <PeoplePicker picked={view.people} people={people} hrefOf={betweenHref} keepLast={false} />
      {view.people.length < 2 && <p className="text-[var(--home-muted)]">اختر شخصين أو أكثر لترى أقرب الصلات بينهم.</p>}
      {view.people.length > 1 && <>
        {view.apart.length > 0 && (
          <p className="text-[var(--home-muted)]">لا صلة معروفة بعد بين {first.name} و{view.apart.map(p => p.name).join(' و')} في التراجم المضافة.</p>
        )}
        {view.sentence && <Segmented tabs label="كيف تُعرض الصلة" className="self-start"
          options={DRAWING_OR_TEXT.map(item => ({ ...item, current: shown === item.key, onClick: () => setShown(item.key) }))} />}
        {/* The chain in the home card's shape, its pages on the book line under it (owner 2026-11-20). */}
        <CardWithRow className="px-4 py-3">
          {shown === 'text' && view.sentence ? <p className="text-lg leading-8">{view.sentence}</p> : <TiesChain chain={view.chain} inCard />}
          <BookCredit credit={view.credit} />
        </CardWithRow>
      </>}
    </div>
  );
}
