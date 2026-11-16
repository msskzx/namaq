'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { BOOK_KINDS, bookOf } from '@shared/books';
import { READER_BOOKS, pageName } from '@shared/readerBooks';
import { readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import FasilaIcon from '@/components/quran/FasilaIcon';
import styles from './Books.module.css';

const kindOf = (kind: string) => BOOK_KINDS.find(item => item.kind === kind)?.title ?? '';

/** The books the reader turns, as square cards two to a row, each with where its فاصلة is; Tuhfa opens its own page. */
export default function BooksShelf() {
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  return (
    <div dir="rtl" lang="ar" className={`${styles.reader} ${styles.shelf}`}>
      <h1 className="mb-3 px-1 text-2xl">الكتب</h1>
      <ul className={styles.grid}>
        {READER_BOOKS.map(id => {
          const book = bookOf(id);
          const fasila = fasilas[id];
          return (
            <li key={id}>
              <Link href={`/quran/books/${id}`} className={styles.card}>
                <span className={styles.kind}>{kindOf(book.kind)}</span>
                <span className={styles.bookTitle}>{book.title}</span>
                <span className={styles.by}>{book.by}</span>
                {fasila && <span className={styles.stop}><FasilaIcon aria-hidden width={16} height={16} />فاصلتك: {pageName(id, fasila.part, fasila.page)}</span>}
              </Link>
            </li>
          );
        })}
        <li>
          <Link href="/quran/tajwid/tuhfat-al-atfal" className={styles.card}>
            <span className={styles.kind}>التجويد</span>
            <span className={styles.bookTitle}>تحفة الأطفال</span>
            <span className={styles.by}>سليمان الجمزوري</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
