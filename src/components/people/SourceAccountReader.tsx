'use client';

import React from 'react';
import useSWR from 'swr';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { AccountPage, AccountSummary } from '@/types/provenance';

interface AccountsResponse {
  accounts: AccountSummary[];
  account: AccountSummary | null;
  page: AccountPage | null;
}

interface SourceAccountReaderProps {
  slug: string;
}

/**
 * Splits stored Markdown into paragraphs. The source pages hold plain
 * paragraphs, and rendering them as text keeps any markup in the source inert.
 */
function paragraphs(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function accountLabel(account: AccountSummary) {
  return [account.source.title, account.source.edition, account.volume && `ج${account.volume}`]
    .filter(Boolean)
    .join(' — ');
}

/**
 * The complete account of a person in one work, one printed page at a time.
 * Book and page live in the URL so a citation can link straight to the passage
 * it cites and Back/Forward move through the reading, per
 * docs/data-quality-references-plan.md.
 */
export default function SourceAccountReader({ slug }: SourceAccountReaderProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const book = searchParams.get('book');
  const requestedPage = Number(searchParams.get('page') ?? '1');
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const query = new URLSearchParams({ page: String(page) });
  if (book) query.set('account', book);

  const { data, error, isLoading } = useSWR<AccountsResponse>(
    slug ? `/api/people/${slug}/accounts?${query.toString()}` : null,
    fetcher,
  );

  const setSelection = (nextBook: string | null, nextPage: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (nextBook) next.set('book', nextBook);
    else next.delete('book');
    next.set('page', String(nextPage));
    router.replace(`${pathname}?${next.toString()}`);
  };

  if (error) {
    return (
      <ErrorMessage
        title={language === 'ar' ? 'تعذر تحميل نص المصدر' : 'The source text could not be loaded'}
        description={String(error)}
      />
    );
  }

  if (isLoading || !data) return <LoadingSpinner />;
  if (!data.account || !data.page) return null;

  const { accounts, account } = data;
  const current = data.page;
  const printed = current.printedPage ?? String(current.sequence);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faBookOpen} className="w-7 h-7 text-amber-500 ml-2" />
        {language === 'ar' ? 'نص المصدر' : 'Source text'}
      </h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        {accounts.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'الكتاب' : 'Book'}
            <select
              className="rounded border border-amber-400 bg-white dark:bg-gray-950 px-2 py-1 text-sm text-gray-800 dark:text-gray-100"
              value={account.id}
              onChange={(changed) => setSelection(changed.target.value, 1)}
            >
              {accounts.map((option) => (
                <option key={option.id} value={option.id}>
                  {accountLabel(option)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {language === 'ar' ? 'الصفحة المطبوعة' : 'Printed page'}
          <select
            className="rounded border border-amber-400 bg-white dark:bg-gray-950 px-2 py-1 text-sm text-gray-800 dark:text-gray-100"
            value={current.sequence}
            onChange={(changed) => setSelection(account.id, Number(changed.target.value))}
          >
            {Array.from({ length: account.pageCount }, (_, index) => index + 1).map((sequence) => (
              <option key={sequence} value={sequence}>
                {sequence}
              </option>
            ))}
          </select>
        </label>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={current.sequence <= 1}
          onClick={() => setSelection(account.id, current.sequence - 1)}
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
          {language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={current.sequence >= account.pageCount}
          onClick={() => setSelection(account.id, current.sequence + 1)}
        >
          <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
          {language === 'ar' ? 'الصفحة التالية' : 'Next page'}
        </Button>
      </div>

      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {accountLabel(account)}
        {' · '}
        {language === 'ar' ? `ص ${printed}` : `p. ${printed}`}
      </p>

      <article dir="rtl" lang="ar" className="space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
        {paragraphs(current.bodyMarkdown).map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </article>

      {current.notesMarkdown && (
        <aside className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'حواشي المحقق' : "The editor's notes"}
          </h3>
          <div dir="rtl" lang="ar" className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {paragraphs(current.notesMarkdown).map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </aside>
      )}

      {current.extractionUrl && (
        <a
          className="mt-3 inline-block text-sm underline text-gray-600 dark:text-gray-400"
          href={current.extractionUrl}
          target="_blank"
          rel="noreferrer"
        >
          {language === 'ar' ? 'الصفحة على الموقع الناشر' : 'This page on the host site'}
        </a>
      )}
    </section>
  );
}
