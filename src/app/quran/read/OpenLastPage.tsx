'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LAST_PAGE_KEY } from './ReaderView';

/** The page /quran/read opens: the last page read on this device, else the first. */
export function lastPage(stored: string | null) {
  const page = Number(stored);
  return Number.isInteger(page) && page >= 1 && page <= 604 ? page : 1;
}

/** The mushaf tab opens straight on the mushaf; the surah index is the list button in the reader. */
export default function OpenLastPage() {
  const router = useRouter();
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(LAST_PAGE_KEY); } catch {}
    router.replace(`/quran/read/${lastPage(stored)}`);
  }, [router]);
  return <LoadingSpinner className="py-24" />;
}
