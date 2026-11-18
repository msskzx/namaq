'use client';

import { useState } from 'react';
import { GHARIB_BOOK, GHARIB_EDITION, MUFRADAT_BOOK, MUFRADAT_EDITION, gharibCredit, gharibOfWord, gharibPage, mufradatCredit, mufradatPage } from '@shared/quran/gharib';
import ExternalLink from '@/components/common/ExternalLink';
import Card from '@/components/common/Card';
import Segmented from '@/components/common/Segmented';
import Folded from '@/components/common/Folded';
import Pickable from '@/components/common/Pickable';
import QuranWords from '@/components/quran/text/QuranWords';
import BookRuns from '@/components/quran/text/BookRuns';
import type { GharibAyah } from './gharib';

// The lit words: BalaghaPanel's deeper band.
const PICKED = 'bg-[color-mix(in_srgb,var(--home-ink)_20%,var(--home-card))]';
const BOOKS = { gharib: 'غريب القرآن لابن قتيبة', mufradat: 'المفردات للراغب' } as const;
type Book = keyof typeof BOOKS;

/**
 * The reader's meaning sheet on the website, the app's GharibSheet (mobile/src/components/GharibSheet.tsx): pills pick
 * the book. Ibn Qutaybah: his entries on the ayah, whole, those on the pressed word first; a click on one lights the
 * words it quotes. Al-Raghib: his whole article on the word's root. A book with nothing here has no pill.
 */
export default function GharibPanel({ data }: { data: GharibAyah }) {
  const { words, word, gharib, mufradat } = data;
  const books = (Object.keys(BOOKS) as Book[]).filter(book => (book === 'gharib' ? gharib.length : mufradat));
  const [shown, setShown] = useState<Book>(gharibOfWord(gharib, word).length || !mufradat ? 'gharib' : 'mufradat');
  const [picked, setPicked] = useState<number | null>(null);
  const showing = books.length === 1 ? books[0] : shown;
  const lit: [number, number][] = showing === 'gharib' && picked !== null ? gharib[picked]?.words ?? [] : [[word, word]];
  return (
    <>
      <Card as="p" className="block shrink-0 px-3.5 py-2.5 text-2xl leading-[2]">
        <QuranWords>{words.map((text, i) => <span key={i} className={lit.some(([from, to]) => i >= from && i <= to) ? PICKED : undefined}>{`${i ? ' ' : ''}${text}`}</span>)}</QuranWords>
      </Card>
      {books.length > 1 && (
        <Segmented tabs label="الكتاب" className="shrink-0 self-start"
          options={books.map(book => ({ key: book, label: BOOKS[book], current: shown === book, onClick: () => { setShown(book); setPicked(null); } }))} />
      )}
      {!books.length && <p className="py-6 text-center text-sm text-[var(--home-muted)]">لا كلام في الكتابين على هذه الكلمة.</p>}
      {showing === 'gharib' && gharib.map((entry, i) => (
        <Card key={entry.at} picked={picked === i} className="block shrink-0 px-3.5 py-2.5">
          {/* The entry lights the words it quotes; its reference below is a control of its own. */}
          <Pickable picked={picked === i} onPick={() => setPicked(i)}>
            <p className="whitespace-pre-line text-[1.125rem] leading-[1.9]"><BookRuns text={entry.text} /></p>
          </Pickable>
          <Folded credit={gharibCredit(entry)}>
            <p>{`${GHARIB_BOOK}، ${GHARIB_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، كلام ابن قتيبة وحده بلا حواشي المحقق.`}</p>
            <ExternalLink href={gharibPage(entry)}>اقرأ الصفحة</ExternalLink>
          </Folded>
        </Card>
      ))}
      {showing === 'mufradat' && mufradat && (
        <Card className="block shrink-0 px-3.5 py-2.5">
          <p className="text-[0.9375rem] text-[var(--home-muted)]">{`[${mufradat[0]}]`}</p>
          <p className="whitespace-pre-line text-[1.125rem] leading-[1.9]"><BookRuns text={mufradat[4]} /></p>
          <Folded credit={mufradatCredit(mufradat)}>
            <p>{`${MUFRADAT_BOOK}، ${MUFRADAT_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، كلام الراغب وحده بلا حواشي المحقق. المادة كاملة تحت عنوانه، ووُصلت بالكلمة من جذرها في المدونة القرآنية.`}</p>
            <ExternalLink href={mufradatPage(mufradat)}>اقرأ الصفحة</ExternalLink>
          </Folded>
        </Card>
      )}
    </>
  );
}
