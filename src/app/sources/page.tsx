'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import styles from '@/components/common/PaperPage.module.css';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import type { SourceShelfEntry } from '@/types/provenance';
import { sourcesIn } from '@shared/sources';

interface ShelfResponse {
  sources: SourceShelfEntry[];
}

const CARD = 'block h-full rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 py-3';
const LINK = 'underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]';
const ACTION = 'text-[var(--home-accent)] underline underline-offset-4';

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
    <div className={`${styles.page} mx-auto w-full max-w-5xl px-4 py-8 sm:px-6`}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className={styles.heading}>
        <h1>{language === 'ar' ? 'الكتب' : 'Books'}</h1>
        <p className="mt-3 text-lg">
          {language === 'ar' ? 'الكتب التي ينقل عنها نمق، وفيمَ يُستعمل كل منها. وانظر أيضًا ' : 'The books Namaq quotes, and what each is used for. See also '}
          <Link href="/attributions" className={ACTION}>
            {language === 'ar' ? 'المصادر والتراخيص' : 'Sources and licences'}
          </Link>
          {language === 'ar' ? ': مصادر البيانات والخطوط وتراخيصها.' : ': the data, fonts and their licences.'}
        </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map(book => {
            const held = book.shelf ? shelf.get(book.shelf) : undefined;
            return (
              <li key={book.id} id={book.id} className={CARD}>
                <h2 dir="rtl" lang="ar" className="text-xl">{book.title.ar}</h2>
                {book.author && <p dir="rtl" lang="ar" className="mt-1 text-[var(--home-muted)]">{book.author.ar}</p>}
                {book.edition && <p dir="rtl" lang="ar" className="mt-1 text-sm text-[var(--home-muted)]">{book.edition}</p>}
                <p className="mt-2 text-sm leading-loose">
                  {language === 'ar' ? 'يُستعمل في: ' : 'Used in: '}
                  {book.uses.map((use, i) => (
                    <span key={i}>
                      {i > 0 && sep}
                      {use.href ? <Link className={LINK} href={use.href}>{use[language]}</Link> : use[language]}
                    </span>
                  ))}
                </p>
                <p className="mt-1 text-sm">
                  <a className={ACTION} href={book.link.url} target="_blank" rel="noreferrer">{book.link.label}</a>
                  {book.shelf && (
                    <>
                      {' · '}
                      <Link className={ACTION} href={`/sources/${book.shelf}`}>
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
              <Link href={`/sources/${source.slug}`} className={`${CARD} transition hover:border-[var(--home-accent)]`}>
                <h2 dir="rtl" lang="ar" className="text-xl">{source.title}</h2>
                {source.author && <p dir="rtl" lang="ar" className="mt-1 text-[var(--home-muted)]">{source.author}</p>}
                <p className="mt-2 text-sm text-[var(--home-muted)]">
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
