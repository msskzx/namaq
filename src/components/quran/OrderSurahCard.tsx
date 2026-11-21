'use client';

import { BookOpen } from 'lucide-react';
import AyahFlow from '@/components/quran/text/AyahFlow';
import Button from '@/components/common/Button';
import CardWithRow from '@/components/common/CardWithRow';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { orderSource, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';

/**
 * A surah's card of the surah-order page (owner, 2026-11-13): its opening ayat and al-Biqa'i's aim with his page. Also what
 * «رتّب سور الجزء» opens for a box (OrderSurahSheet).
 */
export default function OrderSurahCard({ s }: { s: OrderSurah }) {
  return (
    <CardWithRow className="px-4 pt-2.5 pb-2" source={[orderSource(s.aim.src, num)]}
      lead={<Button size="lg" variant="muted" href={ayahHref(`${s.surah}:1`)} aria-label={`افتح سورة ${s.name} في المصحف`} title="في المصحف"><BookOpen aria-hidden /></Button>}>
      <OrderSurahBody s={s} />
    </CardWithRow>
  );
}

/** A surah's name and number, its opening ayat and al-Biqa'i's aim: the card's inside, as the page, a sheet and the feed show it. */
export function OrderSurahBody({ s }: { s: OrderSurah }) {
  return <>
    <h2 className="flex items-baseline gap-2"><span className="text-2xl text-[var(--home-accent)]">{s.name}</span><span className="text-sm text-[var(--home-muted)]">{num(s.surah)}</span></h2>
    <AyahFlow>
      {s.opening.map(a => <span key={a.ayah}>{`${a.text} `}<span className="text-[var(--home-amber)]">{`${num(a.ayah)} `}</span></span>)}
    </AyahFlow>
    <p className="mt-1 text-lg leading-loose">«{s.aim.text}»</p>
  </>;
}

function PairAyah({ ayah }: { ayah: OrderAyah }) {
  return <>
    <span className="whitespace-nowrap pt-1.5 text-sm text-[var(--home-muted)]">{ayah.place}</span>
    <AyahFlow>
      {ayah.words.map((w, i) => <span key={i} data-shared={w.shared || undefined} className={w.shared ? 'text-[var(--home-accent)]' : undefined}>{`${w.text} `}</span>)}
    </AyahFlow>
  </>;
}

/**
 * al-Suyuti's words on what joins a surah to the one before it, and under them the two ayat each pair of his names. `barred`:
 * each pair behind a line of its own (the feed card), where no line already runs beside the whole link (the page).
 */
export function OrderLinkWords({ link, barred = false }: { link: OrderLinkView; barred?: boolean }) {
  return <>
    <p className="text-lg leading-loose">«{link.text}»</p>
    {link.pairs.map(([a, b]) => (
      <div key={a.key + b.key} className={`my-1 grid grid-cols-[auto_1fr] items-baseline gap-x-2.5 ${barred ? 'border-s-2 border-[var(--home-rule)] ps-2.5' : ''}`}>
        <PairAyah ayah={a} />
        <PairAyah ayah={b} />
      </div>
    ))}
  </>;
}
