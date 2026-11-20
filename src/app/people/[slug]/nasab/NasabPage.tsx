'use client';

import type { NasabView, PickPerson } from '@/lib/tarajim';
import PeoplePicker from '@/components/tarajim/PeoplePicker';
import { nasabHref, NasabTree } from '@/components/tarajim/TarajimParts';

/** The people picked (each removed by its ×, the first stays) and «أضف» to pick another from the converted entries. */
export default function NasabPage({ view, people }: { view: NasabView; people: PickPerson[] }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">النسب</h1>
      <PeoplePicker picked={view.people} people={people} hrefOf={nasabHref} keepFirst />
      <NasabTree view={view} />
    </div>
  );
}
