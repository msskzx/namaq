'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SourceAccountReader from '@/components/people/SourceAccountReader';
import SourceContents from '@/components/sources/SourceContents';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { AccountPage, AccountSummary, SourceShelfEntry } from '@/types/provenance';

interface ShelfResponse {
  sources: SourceShelfEntry[];
}

interface AccountsResponse {
  accounts: AccountSummary[];
  account: AccountSummary | null;
  page: AccountPage | null;
}

/**
 * One work, opened at its contents. A book is not opened partway into whichever
 * entry happens to be stored first, so the entries are listed until the reader
 * picks one; `book` in the query is that choice, and it is the same parameter
 * SourceAccountReader already writes when its own selector is used.
 *
 * The reader itself is the component the profile uses. The difference is only
 * which accounts it may page through, and that the entries here are named by
 * whose they are rather than by the work, since within one book the work is
 * the thing they share.
 */
export default function SourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const openEntry = searchParams.get('book');

  const { data, error, isLoading } = useSWR<ShelfResponse>('/api/sources', fetcher);
  // Only the contents view needs the entry list up front; once one is open the
  // reader fetches what it shows.
  const { data: contents } = useSWR<AccountsResponse>(
    openEntry ? null : `/api/sources/${slug}/accounts`,
    fetcher,
  );

  const source = data?.sources.find((candidate) => candidate.slug === slug);

  const entryLabel = (account: AccountSummary) => {
    const volume = account.volume && (/^[\d٠-٩]+$/.test(account.volume) ? `ج${account.volume}` : account.volume);
    return [account.titleArabic || account.subjectName || account.subjectSlug, volume]
      .filter(Boolean)
      .join(' — ');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Link
          href="/sources"
          className="inline-flex items-center gap-2 text-sm text-gray-600 underline dark:text-gray-400"
        >
          <FontAwesomeIcon icon={language === 'ar' ? faArrowRight : faArrowLeft} className="w-3 h-3" />
          {language === 'ar' ? 'المصادر' : 'Source material'}
        </Link>

        {error && (
          <ErrorMessage
            title={language === 'ar' ? 'تعذر تحميل المصدر' : 'The source could not be loaded'}
          />
        )}

        {isLoading || !data ? (
          <LoadingSpinner />
        ) : !source ? (
          <ErrorMessage
            title={language === 'ar' ? 'لا يوجد مصدر بهذا الاسم' : 'No source by that name'}
          />
        ) : (
          <>
            <header className="mt-4 mb-8">
              <h1 dir="rtl" lang="ar" className="text-4xl text-gray-900 dark:text-gray-100">
                {source.title}
              </h1>
              <dl dir="rtl" lang="ar" className="mt-3 space-y-1 text-gray-700 dark:text-gray-300">
                {source.author && (
                  <div>
                    <dt className="inline text-gray-500 dark:text-gray-500">
                      {language === 'ar' ? 'المؤلف: ' : 'Author: '}
                    </dt>
                    <dd className="inline">{source.author}</dd>
                  </div>
                )}
                {source.editor && (
                  <div>
                    <dt className="inline text-gray-500 dark:text-gray-500">
                      {language === 'ar' ? 'المحقق: ' : 'Editor: '}
                    </dt>
                    <dd className="inline">{source.editor}</dd>
                  </div>
                )}
                {(source.publisher || source.edition || source.publicationYear) && (
                  <div>
                    <dt className="inline text-gray-500 dark:text-gray-500">
                      {language === 'ar' ? 'الطبعة: ' : 'Edition: '}
                    </dt>
                    <dd className="inline">
                      {[source.publisher, source.edition, source.publicationYear].filter(Boolean).join(' — ')}
                    </dd>
                  </div>
                )}
              </dl>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar'
                  ? `التراجم: ${source.entryCount} · الصفحات: ${source.pageCount}`
                  : `${source.entryCount} entries · ${source.pageCount} pages`}
              </p>

              {source.url && (
                <a
                  className="mt-2 inline-block text-sm underline text-gray-600 dark:text-gray-400"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.digitalHost
                    ? language === 'ar'
                      ? `الكتاب على ${source.digitalHost}`
                      : `This work on ${source.digitalHost}`
                    : language === 'ar'
                      ? 'الكتاب على الموقع الناشر'
                      : 'This work on the host site'}
                </a>
              )}
            </header>

            {openEntry ? (
              <>
                <Link
                  href={`/sources/${slug}`}
                  className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 underline dark:text-gray-400"
                >
                  <FontAwesomeIcon icon={language === 'ar' ? faArrowRight : faArrowLeft} className="w-3 h-3" />
                  {/* Not الفهرس: the reader's own section selector already
                      carries that name, and the two pick different things --
                      this returns to the book's entries, that jumps within one. */}
                  {language === 'ar' ? 'محتويات الكتاب' : 'Book contents'}
                </Link>

                <SourceAccountReader
                  basePath={`/api/sources/${slug}`}
                  heading={language === 'ar' ? 'القراءة' : 'Reading'}
                  labelAccount={entryLabel}
                  selectorLabel={{ ar: 'الترجمة', en: 'Entry' }}
                />
              </>
            ) : !contents ? (
              <LoadingSpinner />
            ) : (
              <section>
                <h2 className="mb-4 text-3xl text-gray-900 dark:text-gray-200">
                  <FontAwesomeIcon icon={faBookOpen} className="w-7 h-7 text-amber-500 mx-2" />
                  {language === 'ar' ? 'محتويات الكتاب' : 'Contents'}
                </h2>

                <SourceContents
                  slug={slug}
                  volumes={source.volumes}
                  accounts={contents.accounts}
                  label={(account) => account.titleArabic || account.subjectName || account.subjectSlug}
                />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
