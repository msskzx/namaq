'use client';

import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, PenLine } from 'lucide-react';
import ExternalLink from '@/components/common/ExternalLink';
import Reference from '@/components/common/Reference';
import { ShareImageButton } from '@/components/share/ShareImage';
import { num } from '@shared/quran/arabicNumber';
import { CONDITION_NOTES, CONDITION_SOURCES, ITQAN_KIND_NOTES, ITQAN_OPENING, ITQAN_QUOTES, OPENINGS_LEGEND, OPENING_KINDS, inKind, soleCard, type ConditionRole, type OpeningCard, type OpeningKindId, type OpeningWord } from '@shared/quran/openingKinds';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';

export type ConditionText = Record<string, { key: string; role: ConditionRole; ours: boolean; words: string[] }[]>;

const icon = 'inline-flex size-8 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-ink)]';
const ROLE: Record<ConditionRole, string> = {
  condition: 'border-[var(--home-rule)]',
  answer: 'border-[var(--home-green)] text-[var(--home-green)]',
  disputed: 'border-dashed border-[var(--home-muted)]',
};

function Words({ words }: { words: OpeningWord[] }) {
  return <>{words.map((word, i) => <span key={i}>{i > 0 && ' '}{'end' in word ? num(word.end) : <span data-mark={word.mark?.kind} data-some={word.mark?.some || undefined} style={word.mark ? { color: word.mark.some ? `color-mix(in srgb, var(--mark-${word.mark.kind}) var(--mark-some), var(--home-muted))` : `var(--mark-${word.mark.kind})` } : undefined}><AyahWords>{word.text}</AyahWords></span>}</span>)}</>;
}

function Conditions({ lines }: { lines: ConditionText[string] }) {
  return (
    <div className="flex flex-col gap-1 pt-1">
      {lines.map(line => (
        <div key={line.key} data-role={line.role} className={`border-s-2 ps-2 ${ROLE[line.role]}`}><AyahFlow>
          <AyahWords>{`${line.words.join(' ')} ${num(Number(line.key.split(':')[1]))}`}</AyahWords>
          {line.role !== 'condition' && <span className="font-sans text-xs text-[var(--home-muted)] ms-2">{line.role === 'answer' ? (line.ours ? 'الجواب، قراءتنا' : 'الجواب') : 'موضع الخلاف في الجواب'}</span>}
        </AyahFlow></div>
      ))}
    </div>
  );
}

/** A card's own part labels (الزمر and الحواميم, or what each lone oath swears by), shown over the part's first row. */
const partAt = (card: OpeningCard, surah: number) => card.parts?.find(part => part.surahs[0] === surah)?.label;

/** A card's surahs, each its name (a link to the mushaf) over its opening ayah, or its condition and answer when `open`: the page's card and its feed card. */
export function OpeningRows({ card, names, conditions, open = false }: { card: OpeningCard; names: Record<number, string>; conditions?: ConditionText; open?: boolean }) {
  return <>
    {card.rows.map((row, r) => (
      <div key={row.surah} className={`${r ? 'border-t border-[var(--home-rule)]/40' : ''} py-1.5`}>
        {partAt(card, row.surah) && <p data-part className="pb-1 text-sm font-semibold">{partAt(card, row.surah)}</p>}
        <div className="flex items-center gap-2 text-sm text-[var(--home-muted)]">
          <Link href={`/quran/read/ayah/${row.surah}/1`} className="hover:underline" title="افتح في المصحف">{names[row.surah]}</Link>
        </div>
        {open && conditions?.[row.surah]
          ? <Conditions lines={conditions[row.surah]} />
          : <AyahFlow><Words words={row.words} />{row.cut && <span className="text-[var(--home-muted)]"> …</span>}</AyahFlow>}
      </div>
    ))}
  </>;
}

function OpeningItem({ card, names, conditions }: { card: OpeningCard; names: Record<number, string>; conditions: ConditionText }) {
  const [open, setOpen] = useState(false);
  const expandable = card.rows.some(row => conditions[row.surah]);
  return (
    <div data-share-card className="flex flex-col gap-1">
      <Card as="article" id={card.id} data-share-image data-card={card.id} className="scroll-mt-24 flex flex-col px-4 pt-3 pb-2">
        {soleCard(card)
          ? <h3 data-share-only hidden className="text-xl text-[var(--home-accent)]">{card.title}</h3>
          : <h3 className="text-xl text-[var(--home-accent)]">{card.title}</h3>}
        {card.refs && !soleCard(card) && <div data-share-skip><Reference title={card.refs[0].cite!} quotes={card.refs} /></div>}
        <OpeningRows card={card} names={names} conditions={conditions} open={open} />
        {open && <div data-share-skip className="flex flex-col gap-1 border-t border-[var(--home-rule)]/40 pt-2 text-sm leading-relaxed text-[var(--home-muted)]">
          {CONDITION_NOTES.map(n => <p key={n}>{n}</p>)}
          {CONDITION_SOURCES.map(c => <ExternalLink key={c.url} href={c.url}>{c.title}</ExternalLink>)}
        </div>}
      </Card>
      <div data-share-skip className="flex items-center gap-1">
        {expandable && <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'إخفاء الشرط وجوابه' : 'الشرط وجوابه'} title="الشرط وجوابه" className={icon}>
          <ChevronDown size={18} aria-hidden className={open ? 'rotate-180' : undefined} />
        </button>}
        <ShareImageButton size="icon" iconSize={16} href={`/quran/openings?kind=${card.kind}#${card.id}`} />
      </div>
    </div>
  );
}

/** The ten kinds of opening as an inline filter, and the cards of the chosen kind (all of them with none chosen). */
export default function OpeningsView({ cards, names, conditions }: { cards: OpeningCard[]; names: Record<number, string>; conditions: ConditionText }) {
  const [kind, setKind] = useState<OpeningKindId | null>(null);
  const [ready, setReady] = useState(false);
  const scrolled = useRef(false);
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get('kind');
    if (OPENING_KINDS.some(k => k.id === asked)) setKind(asked as OpeningKindId);
    setReady(true);
  }, []);
  // The linked card is scrolled to once the kind in the link has filtered the list.
  useEffect(() => {
    if (!ready || scrolled.current) return;
    scrolled.current = true;
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [ready]);
  const choose = (next: OpeningKindId) => {
    const chosen = kind === next ? null : next;
    setKind(chosen);
    window.history.replaceState(window.history.state, '', chosen ? `?kind=${chosen}` : window.location.pathname);
  };
  return (
    <>
      <header className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">افتتاح السور</h1>
        <Link href="/quizzes?topic=OPENINGS" aria-label="اختبار أوائل السور" title="اختبار أوائل السور" className={`ms-auto ${icon}`}><PenLine size={18} aria-hidden /></Link>
      </header>
      <div role="group" aria-label="أنواع الافتتاح" className="flex gap-2 overflow-x-auto pb-1">
        {OPENING_KINDS.map(k => (
          <Chip key={k.id} label={k.label} on={kind === k.id} onClick={() => choose(k.id)} />
        ))}
      </div>
      <Reference title={ITQAN_OPENING.cite} quotes={[ITQAN_OPENING]} />
      <p className="text-sm text-[var(--home-muted)]">{OPENINGS_LEGEND}</p>
      {OPENING_KINDS.filter(k => !kind || k.id === kind).map(k => {
        const quote = ITQAN_QUOTES.find(q => q.kind === k.id)!;
        const sole = cards.find(card => card.kind === k.id && soleCard(card));
        return (
          <section key={k.id} aria-label={k.label} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 pt-2">
              <h2 className="text-2xl font-bold">{k.label}</h2>
              <Reference title={quote.cite} quotes={[quote, ...(ITQAN_KIND_NOTES[k.id] ?? [])]} />
              {sole?.refs && <Reference title={sole.refs[0].cite!} quotes={sole.refs} />}
            </div>
            {cards.filter(card => (kind ? inKind(card, k.id) : card.kind === k.id)).map(card => <OpeningItem key={card.id} card={card} names={names} conditions={conditions} />)}
          </section>
        );
      })}
    </>
  );
}
