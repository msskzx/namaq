'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { SourceShelfEntry } from '@/types/provenance';

interface ShelfResponse {
  sources: SourceShelfEntry[];
}

/**
 * The shelf of works the evidence is read from. A source here is one edition
 * of one work rather than the work in the abstract, so the edition and the
 * editor are part of what identifies it, and two editions would stand as two
 * books (docs/data-pipelines.md).
 */
export default function SourcesPage() {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR<ShelfResponse>('/api/sources', fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl mb-2 text-gray-900 dark:text-gray-100">
          <FontAwesomeIcon icon={faBookOpen} className="w-8 h-8 text-amber-500 mx-2" />
          {language === 'ar' ? 'المصادر' : 'Source material'}
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {language === 'ar'
            ? 'الكتب التي تُقرأ منها الأدلة. لكل كتاب طبعته، فالطبعتان من كتاب واحد مصدران.'
            : 'The works the evidence is read from. A source is one edition of one work, so two editions of a book are two sources.'}
        </p>

        {error && (
          <ErrorMessage
            title={language === 'ar' ? 'تعذر تحميل المصادر' : 'The sources could not be loaded'}
          />
        )}

        {isLoading || !data ? (
          <LoadingSpinner />
        ) : data.sources.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' ? 'لا توجد مصادر بعد.' : 'No sources yet.'}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.sources.map((source) => (
              <li key={source.slug}>
                <Link
                  href={`/sources/${source.slug}`}
                  className="block h-full rounded-lg border border-amber-400/40 bg-white p-4 transition hover:border-amber-400 dark:bg-gray-900"
                >
                  <h2 dir="rtl" lang="ar" className="text-2xl text-gray-900 dark:text-gray-100">
                    {source.title}
                  </h2>
                  {source.author && (
                    <p dir="rtl" lang="ar" className="mt-1 text-gray-700 dark:text-gray-300">
                      {source.author}
                    </p>
                  )}
                  {(source.edition || source.editor) && (
                    <p dir="rtl" lang="ar" className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {[source.edition, source.editor].filter(Boolean).join(' — ')}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ar'
                      ? `التراجم: ${source.entryCount} · الصفحات: ${source.pageCount}`
                      : `${source.entryCount} entries · ${source.pageCount} pages`}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
