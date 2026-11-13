'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { SourceShelfEntry } from '@/types/provenance';
import { sourcesIn } from '@shared/sources';

interface ShelfResponse {
  sources: SourceShelfEntry[];
}

const CARD = 'block h-full rounded-lg border border-amber-400/40 bg-white p-4 dark:bg-gray-900';

/**
 * Every book Namaq quotes or follows (shared/sources.ts), with what it is used for and where. The list is in the
 * code, so it shows at once; a book whose pages are held (the shelf, /api/sources) also links to its reader. A shelf
 * source is one edition of one work, so two editions would stand as two books (docs/data-pipelines.md).
 */
export default function SourcesPage() {
  const { language } = useLanguage();
  const { data } = useSWR<ShelfResponse>('/api/sources', fetcher);
  const books = sourcesIn('books');
  const shelf = new Map((data?.sources ?? []).map(source => [source.slug, source]));
  const listed = new Set(books.map(book => book.shelf));
  const unlisted = (data?.sources ?? []).filter(source => !listed.has(source.slug));
  const sep = language === 'ar' ? '، ' : ', ';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="w-full px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl mb-2 text-gray-900 dark:text-gray-100">
          <FontAwesomeIcon icon={faBookOpen} className="w-8 h-8 text-amber-500 mx-2" />
          {language === 'ar' ? 'المصادر' : 'Source material'}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {language === 'ar' ? 'الكتب التي ينقل عنها نمق، وفيمَ يُستعمل كل منها. وانظر أيضًا ' : 'The books Namaq quotes, and what each is used for. See also '}
          <Link href="/attributions" className="text-amber-600 hover:underline dark:text-amber-400">
            {language === 'ar' ? 'العزو' : 'Attributions'}
          </Link>
          {language === 'ar' ? ': مصادر البيانات والخطوط وتراخيصها.' : ': the data, fonts and their licences.'}
        </p>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map(book => {
            const held = book.shelf ? shelf.get(book.shelf) : undefined;
            return (
              <li key={book.id} id={book.id} className={CARD}>
                <h2 dir="rtl" lang="ar" className="text-2xl text-gray-900 dark:text-gray-100">{book.title.ar}</h2>
                {book.author && <p dir="rtl" lang="ar" className="mt-1 text-gray-700 dark:text-gray-300">{book.author.ar}</p>}
                {book.edition && <p dir="rtl" lang="ar" className="mt-1 text-sm text-gray-600 dark:text-gray-400">{book.edition}</p>}
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  {language === 'ar' ? 'يُستعمل في: ' : 'Used in: '}
                  {book.uses.map((use, i) => (
                    <span key={i}>
                      {i > 0 && sep}
                      {use.href ? <Link className="underline" href={use.href}>{use[language]}</Link> : use[language]}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-sm">
                  <a className="text-amber-600 hover:underline dark:text-amber-400" href={book.link.url} target="_blank" rel="noreferrer">{book.link.label}</a>
                  {book.shelf && (
                    <>
                      {' · '}
                      <Link className="text-amber-600 hover:underline dark:text-amber-400" href={`/sources/${book.shelf}`}>
                        {held
                          ? language === 'ar' ? `اقرأ الصفحات (التراجم: ${held.entryCount} · الصفحات: ${held.pageCount})` : `Read the pages (${held.entryCount} entries · ${held.pageCount} pages)`
                          : language === 'ar' ? 'اقرأ الصفحات' : 'Read the pages'}
                      </Link>
                    </>
                  )}
                </p>
              </li>
            );
          })}
          {unlisted.map(source => (
            <li key={source.slug}>
              <Link href={`/sources/${source.slug}`} className={`${CARD} transition hover:border-amber-400`}>
                <h2 dir="rtl" lang="ar" className="text-2xl text-gray-900 dark:text-gray-100">{source.title}</h2>
                {source.author && <p dir="rtl" lang="ar" className="mt-1 text-gray-700 dark:text-gray-300">{source.author}</p>}
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? `التراجم: ${source.entryCount} · الصفحات: ${source.pageCount}` : `${source.entryCount} entries · ${source.pageCount} pages`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
