import type { Metadata } from 'next';
import OpenLastPage from './OpenLastPage';

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

export default function QuranReadPage() {
  return <OpenLastPage />;
}
