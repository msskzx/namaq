'use client';

import type { ReactNode } from 'react';
import useSWR from 'swr';
import Sheet from '@/components/common/Sheet';
import Button from '@/components/common/Button';
import OrderSurahCard from '@/components/quran/OrderSurahCard';
import type { OrderSurah } from '@shared/quran/surahOrder';

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  return response.json();
};

/**
 * A surah's card in a sheet (owner, 2026-11-21; sketch surah-order-tray/sketch-home-dark.png, the app's SurahSheet): what
 * «ابحث عن الجواب» opens for a box of «رتّب سور الجزء», and what a box opens once checked.
 */
export default function OrderSurahSheet({ surah, onClose, top, surahs }: { surah: number | null; onClose: () => void; top?: ReactNode;
  /** The cards already at hand (the surah-order page), so nothing is fetched. */
  surahs?: OrderSurah[] }) {
  const known = surahs?.find(s => s.surah === surah);
  const { data } = useSWR(surah === null || known ? null : `/api/quran/order?surah=${surah}`, fetchJson<{ surah?: OrderSurah }>, { revalidateOnFocus: false });
  const card = known ?? data?.surah;
  return (
    <Sheet open={surah !== null} onClose={onClose} label="بطاقة السورة" className="overflow-y-auto">
      {surah !== null && <>
        {top && <div className="sticky top-0 z-10 flex justify-center bg-[var(--home-paper)] pt-3 pb-2">{top}</div>}
        <div className="flex flex-col gap-3 p-4">
          {card ? <OrderSurahCard s={card} /> : <p className="text-[var(--home-muted)]">…</p>}
          <Button className="self-start" onClick={onClose}>رجوع</Button>
        </div>
      </>}
    </Sheet>
  );
}
