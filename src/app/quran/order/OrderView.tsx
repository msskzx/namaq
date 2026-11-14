'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import ExternalLink from '@/components/common/ExternalLink';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { BOOKS, citeLabel, citeUrl, ORDER_HELP, ORDER_JUZ, orderInJuz, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';

const HELP = [
  ...ORDER_HELP.map((text, i) => <p key={i} className={i === ORDER_HELP.length - 1 ? 'text-[var(--home-muted)]' : undefined}>{text}</p>),
  <ul key="books" className="text-[var(--home-muted)]">
    {Object.values(BOOKS).map(book => <li key={book.shamela}><ExternalLink href={`https://shamela.ws/book/${book.shamela}`} className="underline underline-offset-4">{book.title}</ExternalLink></li>)}
  </ul>,
];
const ICON_BUTTON = 'inline-flex size-9 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]';

function Source({ cite }: { cite: Cite }) {
  return (
    <ExternalLink href={citeUrl(cite)} className="text-sm text-[var(--home-muted)] underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]">
      {citeLabel(cite, num)}
    </ExternalLink>
  );
}

function PairAyah({ ayah }: { ayah: OrderAyah }) {
  return <>
    <span className="whitespace-nowrap pt-1.5 text-sm text-[var(--home-muted)]">{ayah.place}</span>
    <span className="font-quran text-xl leading-[2]">
      {ayah.words.map((w, i) => <span key={i} data-shared={w.shared || undefined} className={w.shared ? 'text-[var(--home-accent)]' : undefined}>{`${mushafText(w.text)} `}</span>)}
    </span>
  </>;
}

function LinkBlock({ link }: { link: OrderLinkView }) {
  return (
    <li className="ms-5 border-s-2 border-[var(--home-rule)] ps-3.5 pb-1" aria-label="الصلة بما قبلها">
      <p className="text-lg leading-loose">«{link.text}»</p>
      {link.pairs.map(([a, b]) => (
        <div key={a.key + b.key} className="my-1 grid grid-cols-[auto_1fr] items-baseline gap-x-2.5">
          <PairAyah ayah={a} />
          <PairAyah ayah={b} />
        </div>
      ))}
      <Source cite={link.src} />
    </li>
  );
}

function SurahCard({ s }: { s: OrderSurah }) {
  return (
    <li className="rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 pt-2.5 pb-1">
      <h2 className="flex items-baseline gap-2"><span className="text-2xl text-[var(--home-accent)]">{s.name}</span><span className="text-sm text-[var(--home-muted)]">{num(s.surah)}</span></h2>
      <p className="font-quran text-2xl leading-[2.1] [text-align:justify] [text-align-last:right]">
        {s.opening.map(a => <span key={a.ayah}>{`${mushafText(a.text)} `}<span className="text-[var(--home-amber)]">{`${num(a.ayah)} `}</span></span>)}
      </p>
      <p className="mt-1 text-lg leading-loose">«{s.aim.text}»</p>
      <Source cite={s.aim.src} />
      <div className="flex gap-1">
        <Link href={ayahHref(`${s.surah}:1`)} className={ICON_BUTTON} aria-label={`افتح سورة ${s.name} في المصحف`} title="في المصحف"><BookOpen size={18} aria-hidden /></Link>
      </div>
    </li>
  );
}

/**
 * Surah order from Fussilat to al-Nas, as in the app (owner, 2026-11-13): each surah's opening ayat and aim, and between two
 * surahs what joins them, all quoted from al-Biqa'i, al-Suyuti and Ibn al-Zubayr with their pages. A juz chip narrows the list.
 */
export default function OrderView({ surahs }: { surahs: OrderSurah[] }) {
  const [juz, setJuz] = useState<number | null>(null);
  const shown = orderInJuz(surahs, juz);
  const chip = (label: string, value: number | null) => (
    <li key={label}>
      <button type="button" aria-pressed={juz === value} onClick={() => setJuz(value)}
        className={`whitespace-nowrap rounded-full border px-3 py-0.5 text-base ${juz === value ? 'border-[var(--home-accent)] bg-[var(--home-accent)] text-[var(--home-on-action)]' : 'border-[var(--home-rule)] text-[var(--home-ink)] hover:border-[var(--home-accent)]'}`}>
        {label}
      </button>
    </li>
  );
  return (
    <div className="flex flex-col gap-3">
      <SettingsHelp label="من أين هذا الكلام؟">{HELP}</SettingsHelp>
      <h1 className="sr-only">ترتيب السور</h1>
      <ul aria-label="الجزء" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {chip('الكل', null)}
        {ORDER_JUZ.map(j => chip(num(j), j))}
      </ul>
      <ol aria-label="السور" className="flex flex-col gap-2.5">
        {shown.flatMap((s, i) => [
          ...(s.link && i > 0 ? [<LinkBlock key={`link-${s.surah}`} link={s.link} />] : []),
          <SurahCard key={s.surah} s={s} />,
        ])}
      </ol>
    </div>
  );
}
