import { Suspense } from 'react';
import type { Metadata } from 'next';
import RepetitionLoader from './RepetitionLoader';

export const metadata: Metadata = {
  title: 'القرآن: تكرار العبارات',
};

export default function QuranPage() {
  return (
    <Suspense>
      <RepetitionLoader />
    </Suspense>
  );
}
