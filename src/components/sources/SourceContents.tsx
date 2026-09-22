'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { AccountSection, AccountSummary } from '@/types/provenance';

interface SectionsResponse {
  sections: AccountSection[];
}

/**
 * One entry inside an opened volume, with whatever chapters it declares.
 *
 * Whether it declares any is only knowable by reading its pages, so the answer
 * arrives with the sections themselves rather than ahead of them: an entry with
 * none simply shows as its own link, and nothing offers to open an index that
 * would be empty.
 */
function VolumeEntry({
  slug,
  account,
  label,
}: {
  slug: string;
  account: AccountSummary;
  label: string;
}) {
  const { language } = useLanguage();
  const { data, isLoading } = useSWR<SectionsResponse>(
    `/api/sources/${slug}/accounts/sections?account=${account.id}`,
    fetcher,
  );
  const sections = data?.sections ?? [];

  return (
    <li className="p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Link
          href={`/sources/${slug}?book=${account.id}&page=1`}
          dir="rtl"
          lang="ar"
          className="text-xl text-gray-900 hover:underline dark:text-gray-100"
        >
          {label}
        </Link>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'ar' ? `الصفحات: ${account.pageCount}` : `${account.pageCount} pages`}
        </span>
      </div>

      {isLoading && <LoadingSpinner />}

      {sections.length > 0 && (
        <ol dir="rtl" lang="ar" className="mt-3 space-y-1 border-t border-gray-200 pt-3 dark:border-white/10">
          {sections.map((section, index) => (
            <li key={index}>
              <Link
                href={`/sources/${slug}?book=${account.id}&page=${section.sequence}`}
                className="flex items-baseline justify-between gap-3 rounded px-2 py-1 text-gray-800 transition hover:bg-amber-50 dark:text-gray-200 dark:hover:bg-white/5"
              >
                <span>{section.heading}</span>
                <span className="shrink-0 text-xs text-gray-500">
                  {section.printedPage ?? section.sequence}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

/**
 * A work's contents, grouped by volume and opened one volume at a time.
 *
 * A volume stays shut until it is asked for, and opening it is what fetches the
 * chapters of the entries inside: building that index reads every page of an
 * account's body, which the sira alone makes 988 pages of work.
 *
 * A SourceAccount records a volume only where the batch authored one, so
 * entries naming none are grouped under the work itself rather than invented
 * into a volume they never claimed.
 */
export default function SourceContents({
  slug,
  volumes,
  accounts,
  label,
}: {
  slug: string;
  volumes: { number: number; name: string | null }[];
  accounts: AccountSummary[];
  label: (account: AccountSummary) => string;
}) {
  const { language } = useLanguage();
  const [openVolume, setOpenVolume] = useState<number | null>(null);

  // Every volume the edition has, not only the ones something was read from:
  // a reader should be able to see that a work runs to twenty-eight volumes
  // and that two of them have been read.
  const groups = volumes.map((volume) => ({
    ...volume,
    accounts: accounts.filter((account) => account.sourceVolume?.number === volume.number),
  }));

  // An entry read before its edition's volumes were recorded belongs nowhere
  // above, and is shown rather than dropped.
  const unplaced = accounts.filter((account) => !account.sourceVolume);

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const open = openVolume === group.number;
        const read = group.accounts.length > 0;
        const pages = group.accounts.reduce((total, account) => total + account.pageCount, 0);

        return (
          <section
            key={group.number}
            className={`rounded-lg border ${read ? 'border-gray-200 dark:border-white/10' : 'border-dashed border-gray-200/70 dark:border-white/5'}`}
          >
            <button
              type="button"
              onClick={() => read && setOpenVolume(open ? null : group.number)}
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
                    icon={open ? faChevronDown : language === 'ar' ? faChevronLeft : faChevronRight}
                    className="w-3 h-3 mx-2"
                  />
                )}
                {group.name ?? (language === 'ar' ? `الجزء ${group.number}` : `Volume ${group.number}`)}
              </span>
              <span className={`text-sm ${read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                {read
                  ? language === 'ar'
                    ? `التراجم: ${group.accounts.length} · الصفحات: ${pages}`
                    : `${group.accounts.length} entries · ${pages} pages`
                  : language === 'ar'
                    ? 'لم يُقرأ بعد'
                    : 'Not read yet'}
              </span>
            </button>

            {open && (
              <ul className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-white/10 dark:border-white/10">
                {group.accounts.map((account) => (
                  <VolumeEntry key={account.id} slug={slug} account={account} label={label(account)} />
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {unplaced.length > 0 && (
        <section className="rounded-lg border border-gray-200 dark:border-white/10">
          <h3 dir="rtl" lang="ar" className="p-4 text-xl text-amber-600 dark:text-amber-500">
            {language === 'ar' ? 'تراجم لم يُحدَّد جزؤها' : 'Entries with no volume recorded'}
          </h3>
          <ul className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-white/10 dark:border-white/10">
            {unplaced.map((account) => (
              <VolumeEntry key={account.id} slug={slug} account={account} label={label(account)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
