'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanCredit, itqanPage } from '@shared/quran/itqanBalagha';
import { KASHSHAF_BOOK, KASHSHAF_EDITION, kashshafCredit, kashshafPage, kashshafRuns, litWords } from '@shared/quran/kashshaf';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import ExternalLink from '@/components/common/ExternalLink';
import type { BalaghaAyah } from './balagha';

const CARD = 'block shrink-0 rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-3.5 py-2.5';
// The reader's neutral band (Mushaf.module.css .marked), seen on a card in both themes.
const LIT = 'bg-[color-mix(in_srgb,var(--home-ink)_10%,var(--home-card))]';
// The sentence whose ayah words are lit: a deeper band.
const PICKED = 'bg-[color-mix(in_srgb,var(--home-ink)_20%,var(--home-card))]';
const BOOKS = { itqan: 'الإتقان للسيوطي', kashshaf: 'الكشاف للزمخشري' } as const;
type Book = keyof typeof BOOKS;

function Folded({ credit, children }: { credit: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(was => !was)} aria-expanded={open}
        className="mt-2 flex min-h-9 w-full items-center gap-1.5 border-t border-[var(--home-rule)] pt-2 text-sm text-[var(--home-muted)]">
        {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
        {credit}
      </button>
      {open && <div className="flex flex-col gap-1 text-sm leading-6 text-[var(--home-muted)]">{children}</div>}
    </>
  );
}

/**
 * The reader's balagha sheet on the website, the app's BalaghaSheet (mobile/src/components/BalaghaSheet.tsx): pills pick
 * the book. Al-Itqan: al-Suyuti's paragraphs that quote the ayah, whole, under his heading. Al-Kashshaf: al-Zamakhshari's
 * whole passage, the sentences where he names a device lit with his word in front. A click on a paragraph or a lit
 * sentence lights the ayah words it quotes; each book's page folds open below.
 */
export default function BalaghaPanel({ ayah, data }: { ayah: string; data: BalaghaAyah }) {
  const { passage, words, itqan } = data;
  const [shown, setShown] = useState<Book>(itqan.length ? 'itqan' : 'kashshaf');
  const [paragraph, setParagraph] = useState(0);
  const firstLit = passage ? passage.lit.findIndex((_, at) => litWords(passage, at, ayah)) : -1;
  const [picked, setPicked] = useState<number | null>(null);
  const lit = picked ?? (firstLit >= 0 ? firstLit : null);
  const kashshafWords = passage && lit !== null ? litWords(passage, lit, ayah) : null;
  const span: [number, number][] = shown === 'itqan' ? itqan[paragraph]?.words ?? [] : kashshafWords ? [kashshafWords] : [];
  return (
    <>
      <p className={`${CARD} font-quran text-2xl leading-[2]`}>
        {words.map((word, i) => <span key={i} className={span.some(([from, to]) => i >= from && i <= to) ? PICKED : undefined}>{`${i ? ' ' : ''}${word}`}</span>)}
      </p>
      <div role="tablist" aria-label="الكتاب" className="flex shrink-0 gap-2">
        {(Object.keys(BOOKS) as Book[]).map(book => (
          <button key={book} type="button" role="tab" aria-selected={shown === book} onClick={() => setShown(book)}
            className={`rounded-full border px-3 py-1.5 text-[0.9375rem] ${shown === book ? 'border-[var(--home-accent)] bg-[var(--home-accent)] text-[var(--home-paper)]' : 'border-[var(--home-rule)]'}`}>
            {BOOKS[book]}
          </button>
        ))}
      </div>
      {shown === 'itqan' && (itqan.length ? itqan.map((item, i) => (
        <div key={`${item.id}/${i}`} className={`${CARD} ${paragraph === i && itqan.length > 1 ? 'border-[var(--home-ink)]' : ''}`}>
          {/* The paragraph lights the words it quotes; its reference below is a control of its own. */}
          <div role="button" tabIndex={0} aria-pressed={paragraph === i} onClick={() => setParagraph(i)} className="cursor-pointer"
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setParagraph(i); } }}>
          <p className="text-sm leading-6 text-[var(--home-muted)]">{item.heading ? `«${item.heading}» · ${item.kind}` : item.kind}</p>
          {item.places > 1 && <p className="text-[0.8125rem] text-[var(--home-muted)]">{`مواضع الشاهد في القرآن: ${num(item.places)}، ولم يعيّن السيوطي أحدها`}</p>}
          <p className="text-[1.125rem] leading-[1.9]">
            {tafsirRuns(item.text).map((run, j) => (run.quran ? <span key={j} className="font-quran text-[var(--home-accent)]">{run.text}</span> : run.text))}
          </p>
          </div>
          <Folded credit={itqanCredit(item)}>
            <p>{`${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث. الفقرة كاملة كما في الكتاب، والعنوان عنوانه.`}</p>
            <ExternalLink href={itqanPage(item)}>اقرأ الصفحة</ExternalLink>
          </Folded>
        </div>
      )) : <p className="py-6 text-center text-sm text-[var(--home-muted)]">لم يستشهد السيوطي بهذه الآية في أنواع البلاغة.</p>)}
      {shown === 'kashshaf' && (passage ? (
        <div className={CARD}>
          <p className="whitespace-pre-line text-[1.125rem] leading-[1.9]">
            {kashshafRuns(passage).map((run, i) => {
              const text = run.quran ? <span className="font-quran text-[var(--home-accent)]">{run.text}</span> : run.text;
              if (run.lit === null) return <span key={i}>{text}</span>;
              const at = run.lit;
              return (
                <span key={i} role="button" tabIndex={0} aria-pressed={lit === at} onClick={() => setPicked(at)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPicked(at); } }} className={`${lit === at ? PICKED : LIT} cursor-pointer`}>
                  {run.opens && <span className="text-sm text-[var(--home-muted)]">{` ${run.devices.map(device => `«${device}»`).join(' ')} `}</span>}
                  {text}
                </span>
              );
            })}
          </p>
          <Folded credit={kashshafCredit(passage)}>
            <p>{`${KASHSHAF_BOOK}، ${KASHSHAF_EDITION}. نص الموسوعة القرآنية، إصدار ${data.version}، بلا حواشي الكتب المطبوعة معه. تضاء الجملة التي يسمّي فيها الزمخشري فنًّا من فنون البلاغة.`}</p>
            <ExternalLink href={kashshafPage(passage)}>اقرأ الصفحة</ExternalLink>
          </Folded>
        </div>
      ) : <p className="py-6 text-center text-sm text-[var(--home-muted)]">لا كلام للكشاف على هذه الآية.</p>)}
    </>
  );
}
