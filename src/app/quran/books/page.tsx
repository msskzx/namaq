import type { Metadata } from 'next';
import BooksShelf from './BooksShelf';

export const metadata: Metadata = { title: 'المكتبة' };

export default function BooksPage() {
  return <BooksShelf />;
}
