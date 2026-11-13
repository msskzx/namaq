import type { Metadata } from 'next';
import SearchView from './SearchView';

export const metadata: Metadata = { title: 'البحث', robots: { index: false, follow: false } };

export default function SearchPage() {
  return <SearchView />;
}
