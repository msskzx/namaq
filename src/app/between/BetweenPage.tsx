'use client';

import type { BetweenView, PickPerson } from '@/lib/tarajim';
import Card from '@/components/common/Card';
import PeoplePicker from '@/components/tarajim/PeoplePicker';
import { betweenHref, CreditFold, TiesChain } from '@/components/tarajim/TarajimParts';

export default function BetweenPage({ view, people }: { view: BetweenView; people: PickPerson[] }) {
  const [first] = view.people;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3.5 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">بين عدة أشخاص</h1>
      <PeoplePicker picked={view.people} people={people} hrefOf={betweenHref} keepLast={false} />
      {view.people.length < 2 && <p className="text-[var(--home-muted)]">اختر شخصين أو أكثر لترى أقرب الصلات بينهم.</p>}
      {view.people.length > 1 && <>
        {view.sentence && <Card className="px-4 py-3 text-lg leading-8">{view.sentence}</Card>}
        {view.apart.length > 0 && (
          <p className="text-[var(--home-muted)]">لا صلة معروفة بعد بين {first.name} و{view.apart.map(p => p.name).join(' و')} في التراجم المضافة.</p>
        )}
        <TiesChain chain={view.chain} />
        <CreditFold credit={view.credit} />
      </>}
    </div>
  );
}
