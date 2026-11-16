'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReaderBookId } from '@shared/bookReader';
import { lastBookSpot } from '@shared/readingMarks';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/** The page whose first paragraph is at or before a spot, 1-based. */
export function pageAt(starts: [number, number][], entry: number, at: number) {
  let found = 0;
  starts.forEach(([e, a], i) => { if (e < entry || (e === entry && a <= at)) found = i; });
  return found + 1;
}

/** A book opens where it was last left on this device, else on its first page. */
export default function OpenLastBookPage({ id, starts }: { id: ReaderBookId; starts: [number, number][] }) {
  const router = useRouter();
  useEffect(() => {
    let last;
    try { last = lastBookSpot(id); } catch {}
    router.replace(`/quran/books/${id}/${last ? pageAt(starts, last.entry, last.at) : 1}`);
  }, [id, starts, router]);
  return <LoadingSpinner className="py-24" />;
}
