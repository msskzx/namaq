'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { findProphet } from '@shared/quran/prophets';
import LoadingDots from '@/components/common/LoadingDots';

/** The last prophet's story picked on this device (as the app's tab keeps it), Musa until one is picked. */
export const PROPHET_PICKED = 'prophets-picked';

export function rememberProphet(slug: string) {
  try { localStorage.setItem(PROPHET_PICKED, slug); } catch { /* private mode: the tab opens Musa next time */ }
}

export function lastProphet() {
  try { return findProphet(localStorage.getItem(PROPHET_PICKED) ?? '')?.slug ?? 'musa'; } catch { return 'musa'; }
}

export default function OpenLastProphet() {
  const router = useRouter();
  useEffect(() => { router.replace(`/quran/prophets/${lastProphet()}`); }, [router]);
  return <div className="flex min-h-[50svh] items-center justify-center"><LoadingDots /></div>;
}
