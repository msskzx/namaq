import Link from 'next/link';
import { BookOpenText } from 'lucide-react';
import type { ReaderBookId } from '@shared/bookReader';

/** «اقرأ في الكتاب»: the book reader at the page of this ayah's passage (docs/plans/book-reader.md), as the app's sheets. */
export default function OpenInBook({ book, ayah, className = '' }: { book: ReaderBookId; ayah: string; className?: string }) {
  return (
    <Link href={`/quran/books/${book}?ayah=${ayah}`} className={`inline-flex shrink-0 items-center gap-1 text-[var(--home-accent)] ${className}`}>
      <BookOpenText size={16} aria-hidden />اقرأ في الكتاب
    </Link>
  );
}
