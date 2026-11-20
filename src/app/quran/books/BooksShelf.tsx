'use client';

import { useSyncExternalStore } from 'react';
import { BOOK_KINDS, BOOKS } from '@shared/books';
import { isReaderBook, pageName } from '@shared/readerBooks';
import { readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import FasilaIcon from '@/components/quran/FasilaIcon';
import styles from './Books.module.css';
import Card from '@/components/common/Card';

const kindOf = (kind: string) => BOOK_KINDS.find(item => item.kind === kind)?.title ?? '';

/** A book's square card: its kind, title and author, and where its فاصلة is; one read from an ayah's buttons says so. */
export function BookCard({ book, fasila, className = '' }: { book: (typeof BOOKS)[number]; fasila?: { part: number; page: number }; className?: string }) {
  const body = <>
    <span className={styles.kind}>{kindOf(book.kind)}</span>
    <span className={styles.bookTitle}>{book.title}</span>
    <span className={styles.by}>{book.by}</span>
  </>;
  if (!isReaderBook(book.id)) return <Card className={`${styles.card} ${className}`}>{body}<span className={styles.note}>يُقرأ من أزرار الآية</span></Card>;
  return (
    <Card href={`/quran/books/${book.id}`} className={`${styles.card} ${className}`}>
      {body}
      {fasila && <span className={styles.stop}><FasilaIcon aria-hidden width={16} height={16} />فاصلتك: {pageName(book.id, fasila.part, fasila.page)}</span>}
    </Card>
  );
}

/** Tuhfat al-Atfal on the shelf: it opens its own page. */
export function TuhfaCard({ className = '' }: { className?: string }) {
  return (
    <Card href="/quran/tajwid/tuhfat-al-atfal" className={`${styles.card} ${className}`}>
      <span className={styles.kind}>التجويد</span>
      <span className={styles.bookTitle}>تحفة الأطفال</span>
      <span className={styles.by}>سليمان الجمزوري</span>
    </Card>
  );
}

/**
 * The library (owner, 2026-11-17): its own tab, as in the app. Every book on square cards, two to a row, each with where its
 * فاصلة is; the short i'rab and al-Itqan are read from an ayah's buttons in the mushaf, so their cards only say so.
 * Tuhfa opens its own page. The website fetches what it shows, so unlike the app it has no books to download or remove.
 */
export default function BooksShelf() {
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  return (
    <div dir="rtl" lang="ar" className={`${styles.reader} ${styles.shelf}`}>
      <h1 className="mb-3 px-1 text-2xl">المكتبة</h1>
      <ul className={styles.grid}>
        {BOOKS.map(book => <li key={book.id}><BookCard book={book} fasila={isReaderBook(book.id) ? fasilas[book.id] : undefined} /></li>)}
        <li><TuhfaCard /></li>
      </ul>
    </div>
  );
}
