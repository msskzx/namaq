'use client';

import { BookOpen } from 'lucide-react';
import AyahFlow from '@/components/quran/text/AyahFlow';
import Button from '@/components/common/Button';
import CardWithRow from '@/components/common/CardWithRow';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { orderSource, type OrderSurah } from '@shared/quran/surahOrder';

/**
 * A surah's card of the surah-order page (owner, 2026-11-13): its opening ayat and al-Biqa'i's aim with his page. Also what
 * «رتّب سور الجزء» opens for a box (OrderSurahSheet).
 */
export default function OrderSurahCard({ s }: { s: OrderSurah }) {
  return (
    <CardWithRow className="px-4 pt-2.5 pb-2" source={[orderSource(s.aim.src, num)]}
      lead={<Button size="lg" variant="muted" href={ayahHref(`${s.surah}:1`)} aria-label={`افتح سورة ${s.name} في المصحف`} title="في المصحف"><BookOpen aria-hidden /></Button>}>
      <h2 className="flex items-baseline gap-2"><span className="text-2xl text-[var(--home-accent)]">{s.name}</span><span className="text-sm text-[var(--home-muted)]">{num(s.surah)}</span></h2>
      <AyahFlow>
        {s.opening.map(a => <span key={a.ayah}>{`${a.text} `}<span className="text-[var(--home-amber)]">{`${num(a.ayah)} `}</span></span>)}
      </AyahFlow>
      <p className="mt-1 text-lg leading-loose">«{s.aim.text}»</p>
    </CardWithRow>
  );
}

