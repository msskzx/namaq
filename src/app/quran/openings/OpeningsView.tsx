'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, PenLine } from 'lucide-react';
import ExternalLink from '@/components/common/ExternalLink';
import Reference from '@/components/common/Reference';
import { ShareImageButton } from '@/components/share/ShareImage';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { CONDITION_NOTES, CONDITION_SOURCES, ITQAN_KIND_NOTES, ITQAN_OPENING, ITQAN_QUOTES, OPENINGS_LEGEND, OPENING_KINDS, type ConditionRole, type OpeningCard, type OpeningKindId, type OpeningWord } from '@shared/quran/openingKinds';

export type ConditionText = Record<string, { key: string; role: ConditionRole; ours: boolean; words: string[] }[]>;

const icon = 'inline-flex size-8 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-ink)]';
const ROLE: Record<ConditionRole, string> = {
  condition: 'border-[var(--home-rule)]',
  answer: 'border-[var(--home-green)] text-[var(--home-green)]',
  disputed: 'border-dashed border-[var(--home-muted)]',
};

function Words({ words }: { words: OpeningWord[] }) {
  return <>{words.map((word, i) => <span key={i}>{i > 0 && ' '}{'end' in word ? num(word.end) : <span data-mark={word.mark?.kind} data-some={word.mark?.some || undefined} style={word.mark ? { color: word.mark.some ? `color-mix(in srgb, var(--mark-${word.mark.kind}) 45%, var(--home-card))` : `var(--mark-${word.mark.kind})` } : undefined}>{mushafText(word.text)}</span>}</span>)}</>;
}

function Conditions({ lines }: { lines: ConditionText[string] }) {
  return (
    <div className="flex flex-col gap-1 pt-1">
      {lines.map(line => (
        <p key={line.key} data-role={line.role} className={`font-quran text-xl leading-[2.1] border-s-2 ps-2 ${ROLE[line.role]}`}>
          {mushafText(line.words.join(' '))} {num(Number(line.key.split(':')[1]))}
          {line.role !== 'condition' && <span className="font-sans text-xs text-[var(--home-muted)] ms-2">{line.role === 'answer' ? (line.ours ? 'الجواب، قراءتنا' : 'الجواب') : 'موضع الخلاف في الجواب'}</span>}
        </p>
      ))}
    </div>
  );
}

function Card({ card, names, conditions }: { card: OpeningCard; names: Record<number, string>; conditions: ConditionText }) {
  const [open, setOpen] = useState(false);
  const expandable = card.rows.some(row => conditions[row.surah]);
  return (
    <div className="flex flex-col gap-1">
      <article id={card.id} data-share-card data-card={card.id} className="scroll-mt-24 flex flex-col rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 pt-3 pb-2">
      <h2 className="text-xl text-[var(--home-accent)]">{card.title}</h2>
      {card.rows.map(row => (
        <div key={row.surah} className="border-t border-[var(--home-rule)]/40 first-of-type:border-t-0 py-1.5">
          <div className="flex items-center gap-2 text-sm text-[var(--home-muted)]">
            <Link href={`/quran/read/ayah/${row.surah}/1`} className="hover:underline" title="افتح في المصحف">{names[row.surah]}</Link>
          </div>
          {open && conditions[row.surah]
            ? <Conditions lines={conditions[row.surah]} />
            : <p className="font-quran text-2xl leading-[2.1] text-justify"><Words words={row.words} />{row.cut && <span className="text-[var(--home-muted)]"> …</span>}</p>}
        </div>
      ))}
        {open && <div data-share-skip className="flex flex-col gap-1 border-t border-[var(--home-rule)]/40 pt-2 text-sm leading-relaxed text-[var(--home-muted)]">
        {CONDITION_NOTES.map(n => <p key={n}>{n}</p>)}
        {CONDITION_SOURCES.map(c => <ExternalLink key={c.url} href={c.url}>{c.title}</ExternalLink>)}
      </div>}
      </article>
      <div className="flex items-center gap-1">
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
        <Link href="/quizzes/openings" aria-label="اختبار أوائل السور" title="اختبار أوائل السور" className={`ms-auto ${icon}`}><PenLine size={18} aria-hidden /></Link>
      </header>
      <div role="group" aria-label="أنواع الافتتاح" className="flex gap-2 overflow-x-auto pb-1">
        {OPENING_KINDS.map(k => (
          <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => choose(k.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1 text-base ${kind === k.id ? 'border-[var(--home-action)] bg-[var(--home-action)] text-[var(--home-on-action)]' : 'border-[var(--home-rule)] text-[var(--home-muted)]'}`}>
            {k.label}
          </button>
        ))}
      </div>
      <Reference title={ITQAN_OPENING.cite} quotes={[ITQAN_OPENING]} />
      <p className="text-sm text-[var(--home-muted)]">{OPENINGS_LEGEND}</p>
      {OPENING_KINDS.filter(k => !kind || k.id === kind).map(k => {
        const quote = ITQAN_QUOTES.find(q => q.kind === k.id)!;
        return (
          <section key={k.id} aria-label={k.label} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 pt-2">
              <h2 className="text-2xl font-bold">{k.label}</h2>
              <Reference title={quote.cite} quotes={[quote, ...(ITQAN_KIND_NOTES[k.id] ?? [])]} />
            </div>
            {cards.filter(card => card.kind === k.id).map(card => <Card key={card.id} card={card} names={names} conditions={conditions} />)}
          </section>
        );
      })}
    </>
  );
}
