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
 * One entry in the contents, and its own sections once opened.
 *
 * The sections are fetched only when the row is expanded: building that index
 * reads every page of the account's body, which the sira alone makes 988 pages
 * of work, and a reader who only wants a different entry should not pay for it.
 */
function ContentsEntry({
  slug,
  account,
  label,
}: {
  slug: string;
  account: AccountSummary;
  label: string;
}) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useSWR<SectionsResponse>(
    open ? `/api/sources/${slug}/accounts/sections?account=${account.id}` : null,
    fetcher,
  );
  const sections = data?.sections ?? [];

  return (
    <li>
      <div className="flex flex-wrap items-baseline justify-between gap-2 p-4">
        <Link
          href={`/sources/${slug}?book=${account.id}&page=1`}
          dir="rtl"
          lang="ar"
          className="text-xl text-gray-900 hover:underline dark:text-gray-100"
        >
          {label}
        </Link>

        <span className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'ar' ? `الصفحات: ${account.pageCount}` : `${account.pageCount} pages`}
          </span>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="rounded border border-amber-400/60 px-2 py-1 text-sm text-gray-700 transition hover:border-amber-400 dark:text-gray-300"
          >
            <FontAwesomeIcon
              icon={open ? faChevronDown : language === 'ar' ? faChevronLeft : faChevronRight}
              className="w-3 h-3 mx-1"
            />
            {language === 'ar' ? 'الفهرس' : 'Index'}
          </button>
        </span>
      </div>

      {open && (
        <div className="border-t border-gray-200 px-4 pb-4 dark:border-white/10">
          {isLoading ? (
            <LoadingSpinner />
          ) : sections.length === 0 ? (
            <p className="py-3 text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar'
                ? 'لا عناوين في هذه الترجمة؛ افتحها لتقرأها صفحة صفحة.'
                : 'This entry declares no headings; open it to read it page by page.'}
            </p>
          ) : (
            <ol dir="rtl" lang="ar" className="space-y-1 pt-3">
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
        </div>
      )}
    </li>
  );
}

/**
 * A work's contents: its entries, grouped by the volume each records, and each
 * opening to its own section index.
 *
 * A SourceAccount records a volume only where the batch authored one, so the
 * entries that name no volume are grouped under the work itself rather than
 * invented into one.
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
    <div className="space-y-6">
      {groups.map((group, index) => (
        <section key={index}>
          <h3 dir="rtl" lang="ar" className="mb-2 text-lg text-amber-600 dark:text-amber-500">
            {group.volume ?? (language === 'ar' ? 'تراجم من الكتاب' : 'Entries from the work')}
          </h3>
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-white/10 dark:border-white/10">
            {group.accounts.map((account) => (
              <ContentsEntry key={account.id} slug={slug} account={account} label={label(account)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
