'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/common/Pagination';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, type Opening } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';

export const PER_PAGE = 30;

export type ListedOpening = Opening & { ayat: { key: string; page: number }[] };

// docs/plans/quran-shared-openings.md
export default function OpeningList({ openings, names, juz }: { openings: ListedOpening[]; names: Record<number, string>; juz: JuzRange | null }) {
  const [page, setPage] = useState(1);
  const shown = openings.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <div className="flex flex-col gap-3">
      <ul aria-label="الفواتح المشتركة" className="flex flex-col divide-y divide-gray-200 dark:divide-white/10 rounded-lg border border-amber-400">
        {shown.map(o => (
          <li key={o.id} className="flex flex-col gap-1 px-3 py-2">
            <span className="flex items-baseline gap-2">
              <Link href={branchesHref(o.id, juz ?? undefined)} className="text-xl font-arabic leading-loose hover:text-amber-700 dark:hover:text-amber-300 hover:underline">{o.text}</Link>
              <span className="text-amber-700 dark:text-amber-300">{num(o.count)}</span>
            </span>
            <span className="flex flex-wrap gap-1">
              {o.ayat.map(({ key, page: readerPage }) => {
                const [surah, ayah] = key.split(':').map(Number);
                return (
                  <Link key={key} href={`/quran/read/${readerPage}`} className="rounded bg-amber-100 dark:bg-white/10 px-1.5 text-xs text-amber-800 dark:text-amber-300 hover:underline">
                    {`${names[surah] ?? num(surah)} ${num(ayah)}`}
                  </Link>
                );
              })}
            </span>
          </li>
        ))}
      </ul>
      <Pagination page={page} pageCount={Math.ceil(openings.length / PER_PAGE)} onChange={setPage} />
    </div>
  );
}
