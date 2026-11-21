'use client';

import AyahFlow from '@/components/quran/text/AyahFlow';
import { useState } from 'react';
import { ArrowDownWideNarrow, X } from 'lucide-react';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import ExternalLink from '@/components/common/ExternalLink';
import { num } from '@shared/quran/arabicNumber';
import { BOOKS, orderSource, ORDER_HELP, linkShows, ORDER_JUZ, orderInJuz, toggledJuz, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';
import Button from '@/components/common/Button';
import SourceLine from '@/components/common/SourceLine';
import Chip from '@/components/common/Chip';
import OrderSurahCard from '@/components/quran/OrderSurahCard';
import OrderSurahSheet from '@/components/quran/OrderSurahSheet';
import OrderTray from '@/components/common/OrderTray';
import { shuffle } from '@shared/quiz/random';

/** The page's own practice (owner, 2026-11-21): the shown surahs to put back in order, `start` keeping the boxes a retry keeps. */
type Practice = { key: string; choices: { value: string; labelArabic: string }[]; order: string[]; start?: string; sent?: string };

const HELP = [
  ...ORDER_HELP.map((text, i) => <p key={i} className={i === ORDER_HELP.length - 1 ? 'text-[var(--home-muted)]' : undefined}>{text}</p>),
  <ul key="books" className="text-[var(--home-muted)]">
    {Object.values(BOOKS).map(book => <li key={book.shamela}><ExternalLink href={`https://shamela.ws/book/${book.shamela}`} className="underline underline-offset-4">{book.title}</ExternalLink></li>)}
  </ul>,
];

/** A quote's book as the line under it (owner 2026-11-20): its page and full title in the line's sheet (the app's). */
const Source = ({ cite }: { cite: Cite }) => <SourceLine sources={[orderSource(cite, num)]} />;

function PairAyah({ ayah }: { ayah: OrderAyah }) {
  return <>
    <span className="whitespace-nowrap pt-1.5 text-sm text-[var(--home-muted)]">{ayah.place}</span>
    <AyahFlow>
      {ayah.words.map((w, i) => <span key={i} data-shared={w.shared || undefined} className={w.shared ? 'text-[var(--home-accent)]' : undefined}>{`${w.text} `}</span>)}
    </AyahFlow>
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

/**
 * Surah order from al-Fatiha to al-Nas, as in the app (owner, 2026-11-13): each surah's opening ayat and aim, and between two
 * surahs what joins them, all quoted from al-Biqa'i, al-Suyuti and Ibn al-Zubayr with their pages. A juz chip narrows the list.
 */
export default function OrderView({ surahs, juz: opened = null }: { surahs: OrderSurah[]; juz?: number | null }) {
  // Several juz at once (owner, 2026-11-20); none picked shows them all.
  const [juz, setJuz] = useState<readonly number[]>(opened ? [opened] : []);
  const shown = orderInJuz(surahs, juz);
  // «رتّبها بنفسك» (owner, 2026-11-21; sketch surah-order-tray/sketch-dark.png, screen 4): the surahs of the picked juz, their
  // names shuffled into a tray, to fill back into their boxes; each box once checked opens the surah's card.
  const [practice, setPractice] = useState<Practice | null>(null);
  const [card, setCard] = useState<number | null>(null);
  const begin = () => setPractice({
    key: `${juz.join(',')}:${Date.now()}`,
    choices: shuffle(shown, Math.random).map(s => ({ value: String(s.surah), labelArabic: s.name })),
    order: shown.map(s => String(s.surah)),
  });
  const chip = (label: string, value: number | null) => (
    <li key={label}>
      <Chip label={label} on={value === null ? !juz.length : juz.includes(value)} onClick={() => setJuz(value === null ? [] : toggledJuz(juz, value))} />
    </li>
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SettingsHelp label="من أين هذا الكلام؟">{HELP}</SettingsHelp>
        {practice
          ? <Button onClick={() => setPractice(null)} aria-label="أوقف الترتيب"><X size={16} aria-hidden />أوقف الترتيب</Button>
          : shown.length > 1 && <Button onClick={begin}><ArrowDownWideNarrow size={16} aria-hidden />رتّبها بنفسك</Button>}
      </div>
      <h1 className="sr-only">ترتيب السور</h1>
      <ul aria-label="الجزء" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {chip('الكل', null)}
        {ORDER_JUZ.map(j => chip(num(j), j))}
      </ul>
      {practice ? <div>
        <OrderTray key={practice.key} question={practice} given={practice.sent} start={practice.start} ar pinned
          onAnswer={sent => setPractice({ ...practice, sent })} onLook={setCard} onBox={setCard}
          onRetry={start => setPractice({ ...practice, key: `${practice.key}+`, start, sent: undefined })} />
        <OrderSurahSheet surah={card} onClose={() => setCard(null)} surahs={surahs} />
      </div> : <ol aria-label="السور" className="flex flex-col gap-2.5">
        {shown.flatMap((s, i) => [
          ...(linkShows(shown, i) ? [<LinkBlock key={`link-${s.surah}`} link={s.link!} />] : []),
          <li key={s.surah}><OrderSurahCard s={s} /></li>,
        ])}
      </ol>}
    </div>
  );
}
