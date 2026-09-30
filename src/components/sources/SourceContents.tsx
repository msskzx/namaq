'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { AccountSummary, VolumeContents } from '@/types/provenance';

/**
 * One volume's contents, read in the book's own printed-page order -- not
 * grouped by whose entry a page belongs to, since the page belongs to the
 * book first (docs/adr/0018-a-page-belongs-to-the-edition.md). A page shows
 * up once, whichever entry opens on it (if any) named inline, next to
 * whatever section headings the page itself declares.
 */
function VolumeBody({ slug, volume }: { slug: string; volume: VolumeContents }) {
  const { language } = useLanguage();
  const t = language === 'ar';
  const pageLabel = (page: string) => (t ? `ص ${page}` : `p. ${page}`);

  return (
    <ol className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-white/10 dark:border-white/10">
      {volume.items.map((item) => (
        <li key={item.printedPage} className="p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {item.entries.length > 0 ? (
                item.entries.map((entry) => (
                  <Link
                    key={entry.accountId}
                    href={`/sources/${slug}?volume=${volume.number}&page=${item.printedPage}`}
                    dir="rtl"
                    lang="ar"
                    className="text-lg text-gray-900 hover:underline dark:text-gray-100"
                  >
                    {entry.label}
                  </Link>
                ))
              ) : item.headings.length > 0 ? (
                <Link
                  href={`/sources/${slug}?volume=${volume.number}&page=${item.printedPage}`}
                  dir="rtl"
                  lang="ar"
                  className="text-sm text-gray-700 hover:underline dark:text-gray-300"
                >
                  {item.headings[0]}
                </Link>
              ) : null}
            </div>
            <span className="shrink-0 text-xs text-gray-500">{pageLabel(item.printedPage)}</span>
          </div>

          {item.entries.length > 0 && item.headings.length > 0 && (
            <ol dir="rtl" lang="ar" className="mt-2 space-y-1 ps-1 text-sm text-gray-700 dark:text-gray-300">
              {item.headings.map((heading, index) => (
                <li key={index}>{heading}</li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Where a volume's read pages leave off its own declared extent -- what the shamela id check in AGENTS.md's "Content sources" catches by hand, shown here instead. */
function unreadStretches(volume: VolumeContents): { from: number; to: number }[] {
  if (volume.firstPrintedPage === null || volume.lastPrintedPage === null) return [];
  const skipped = new Set(volume.skippedPrintedPages);
  const read = new Set(volume.items.map((item) => Number(item.printedPage)));
  const stretches: { from: number; to: number }[] = [];
  let open: { from: number; to: number } | null = null;
  for (let page = volume.firstPrintedPage; page <= volume.lastPrintedPage; page += 1) {
    if (skipped.has(page) || read.has(page)) {
      if (open) { stretches.push(open); open = null; }
      continue;
    }
    if (open) open.to = page;
    else open = { from: page, to: page };
  }
  if (open) stretches.push(open);
  return stretches;
}

export default function SourceContents({
  slug,
  volumes,
  accounts,
}: {
  slug: string;
  volumes: { number: number; name: string | null }[];
  accounts: AccountSummary[];
}) {
  const { language } = useLanguage();
  const t = language === 'ar';
  const [openVolume, setOpenVolume] = useState<number | null>(null);

  // A volume with nothing read from it yet still shows, so a reader can see
  // that the work runs to twenty-eight volumes and that two are read.
  const readVolumeNumbers = new Set(
    accounts.flatMap((account) => account.volumes?.map((span) => span.number) ?? []),
  );

  const { data: openContents, isLoading } = useSWR<VolumeContents>(
    openVolume !== null ? `/api/sources/${slug}/volumes/${openVolume}` : null,
    fetcher,
  );

  return (
    <div className="space-y-3">
      {volumes.map((volume) => {
        const open = openVolume === volume.number;
        const read = readVolumeNumbers.has(volume.number);
        const contents = open ? openContents : undefined;
        const gaps = contents ? unreadStretches(contents) : [];

        return (
          <section
            key={volume.number}
            className={`rounded-lg border ${read ? 'border-gray-200 dark:border-white/10' : 'border-dashed border-gray-200/70 dark:border-white/5'}`}
          >
            <button
              type="button"
              onClick={() => read && setOpenVolume(open ? null : volume.number)}
              aria-expanded={read ? open : undefined}
              disabled={!read}
              className={`flex w-full flex-wrap items-baseline justify-between gap-2 p-4 text-start ${
                read ? 'transition hover:bg-amber-50 dark:hover:bg-white/5' : 'cursor-default'
              }`}
            >
              <span
                dir="rtl"
                lang="ar"
                className={`text-xl ${read ? 'text-amber-600 dark:text-amber-500' : 'text-gray-400 dark:text-gray-600'}`}
              >
                {read && (
                  <FontAwesomeIcon
                    icon={open ? faChevronDown : t ? faChevronLeft : faChevronRight}
                    className="w-3 h-3 mx-2"
                  />
                )}
                {volume.name ?? (t ? `الجزء ${volume.number}` : `Volume ${volume.number}`)}
              </span>
              <span className={`text-sm ${read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                {read ? (t ? 'مقروء جزئياً أو كاملاً' : 'Read') : t ? 'لم يُقرأ بعد' : 'Not read yet'}
              </span>
            </button>

            {open && (
              <>
                {isLoading && <div className="p-4"><LoadingSpinner /></div>}
                {contents && (
                  <>
                    <VolumeBody slug={slug} volume={contents} />
                    {gaps.length > 0 && (
                      <p dir="rtl" lang="ar" className="border-t border-gray-200 p-4 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
                        {t ? 'صفحات لم تُقرأ بعد: ' : 'Not yet read: '}
                        {gaps
                          .map((gap) => (gap.from === gap.to ? `${gap.from}` : `${gap.from}–${gap.to}`))
                          .join('، ')}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
