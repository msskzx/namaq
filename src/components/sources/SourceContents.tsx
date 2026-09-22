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
  accounts,
  label,
}: {
  slug: string;
  accounts: AccountSummary[];
  label: (account: AccountSummary) => string;
}) {
  const { language } = useLanguage();
  const [openVolume, setOpenVolume] = useState<number | null>(0);

  const groups = accounts.reduce<{ volume: string | null; accounts: AccountSummary[] }[]>(
    (built, account) => {
      const volume = account.volume ?? null;
      const last = built[built.length - 1];
      if (last && last.volume === volume) last.accounts.push(account);
      else built.push({ volume, accounts: [account] });
      return built;
    },
    [],
  );

  return (
    <div className="space-y-3">
      {groups.map((group, index) => {
        const open = openVolume === index;
        const title = group.volume ?? (language === 'ar' ? 'تراجم من الكتاب' : 'Entries from the work');
        const pages = group.accounts.reduce((total, account) => total + account.pageCount, 0);

        return (
          <section key={index} className="rounded-lg border border-gray-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setOpenVolume(open ? null : index)}
              aria-expanded={open}
              className="flex w-full flex-wrap items-baseline justify-between gap-2 p-4 text-start transition hover:bg-amber-50 dark:hover:bg-white/5"
            >
              <span dir="rtl" lang="ar" className="text-xl text-amber-600 dark:text-amber-500">
                <FontAwesomeIcon
                  icon={open ? faChevronDown : language === 'ar' ? faChevronLeft : faChevronRight}
                  className="w-3 h-3 mx-2"
                />
                {title}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar'
                  ? `التراجم: ${group.accounts.length} · الصفحات: ${pages}`
                  : `${group.accounts.length} entries · ${pages} pages`}
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
    </div>
  );
}
