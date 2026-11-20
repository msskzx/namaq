'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ayahHref } from '@shared/ayahMarks';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { num } from '@shared/quran/arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanCredit, itqanPage } from '@shared/quran/itqanBalagha';
import { KASHSHAF_BOOK, KASHSHAF_EDITION, kashshafCredit, kashshafPage, kashshafRuns, litWords } from '@shared/quran/kashshaf';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import OpenInBook from '@/components/quran/OpenInBook';
import type { BalaghaAyah } from './balagha';
import Card from '@/components/common/Card';
import CardWithRow from '@/components/common/CardWithRow';
import Segmented from '@/components/common/Segmented';
import Folded from '@/components/common/Folded';
import Pickable from '@/components/common/Pickable';
import Chip from '@/components/common/Chip';
import LitAyat from '@/components/quran/text/LitAyat';
import QuranWords from '@/components/quran/text/QuranWords';

// The reader's neutral band (Mushaf.module.css .marked), seen on a card in both themes.
const LIT = 'bg-[var(--home-band-mark)]';
// The sentence whose ayah words are lit: a deeper band.
const PICKED = 'bg-[color-mix(in_srgb,var(--home-ink)_20%,var(--home-card))]';
const BOOKS = { itqan: 'الإتقان للسيوطي', kashshaf: 'الكشاف للزمخشري' } as const;
type Book = keyof typeof BOOKS;

/**
 * The reader's balagha sheet on the website, the app's BalaghaSheet (mobile/src/components/BalaghaSheet.tsx): pills pick
 * the book. Al-Itqan: al-Suyuti's paragraphs that quote the ayah, whole, under his heading. Al-Kashshaf: al-Zamakhshari's
 * whole passage, the sentences where he names a device lit with his word in front. A click on a paragraph or a lit
 * sentence lights the ayah words it quotes; each book's page is on the line under its card.
 */
export default function BalaghaPanel({ ayah, data }: { ayah: string; data: BalaghaAyah }) {
  const { passage, words, itqan } = data;
  const router = useRouter();
  const [shown, setShown] = useState<Book>(itqan.length ? 'itqan' : 'kashshaf');
  const [paragraph, setParagraph] = useState(0);
  const firstLit = passage ? passage.lit.findIndex((_, at) => litWords(passage, at, ayah)) : -1;
  const [picked, setPicked] = useState<number | null>(null);
  const lit = picked ?? (firstLit >= 0 ? firstLit : null);
  const kashshafWords = passage && lit !== null ? litWords(passage, lit, ayah) : null;
  const span: [number, number][] = shown === 'itqan' ? itqan[paragraph]?.words ?? [] : kashshafWords ? [kashshafWords] : [];
  return (
    <>
      <Card className="block shrink-0 px-3.5 py-2.5">
        <LitAyat ayat={[{ words, lit: span }]} />
      </Card>
      <Segmented tabs label="الكتاب" className="shrink-0 self-start"
        options={(Object.keys(BOOKS) as Book[]).map(book => ({ key: book, label: BOOKS[book], current: shown === book, onClick: () => setShown(book) }))} />
      {shown === 'itqan' && (itqan.length ? itqan.map((item, i) => (
        <CardWithRow key={`${item.id}/${i}`} card={{ picked: paragraph === i && itqan.length > 1 }} className="block px-3.5 py-2.5"
          source={[{ line: ITQAN_BOOK, quotes: [{ text: '', cite: itqanCredit(item), url: itqanPage(item) },
            { text: `${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث. الفقرة كاملة كما في الكتاب، والعنوان عنوانه.` }] }]}>
          {/* The paragraph lights the words it quotes; its book is on the line under it (owner 2026-11-20). */}
          <Pickable picked={paragraph === i} onPick={() => setParagraph(i)}>
          <p className="text-sm leading-6 text-[var(--home-muted)]">{item.heading ? `«${item.heading}» · ${item.kind}` : item.kind}</p>
          <p className="text-[1.125rem] leading-[1.9]">
            {tafsirRuns(item.text).map((run, j) => (run.quran ? <QuranWords key={j} className="text-[var(--home-accent)]">{run.text}</QuranWords> : run.text))}
          </p>
          </Pickable>
          {/* A quote that names no ayah: every ayah it fits, listed, none chosen for him (owner, 2026-11-18). */}
          {item.matches.length > 0 && (
            <Folded credit={`مواضع الشاهد في القرآن: ${num(item.matches.length)}، ولم يعيّن السيوطي أحدها`}>
              <span className="flex flex-wrap gap-1.5 pt-1">
                {item.matches.map(key => {
                  const [surah, number] = key.split(':').map(Number);
                  const name = `${SURAH_NAMES[surah] ?? num(surah)} ${num(number)}`;
                  return <Chip key={key} small label={name} name={`افتح ${name} في المصحف`} onClick={() => router.push(ayahHref(key))} />;
                })}
              </span>
            </Folded>
          )}
        </CardWithRow>
      )) : <p className="py-6 text-center text-sm text-[var(--home-muted)]">لم يستشهد السيوطي بهذه الآية في أنواع البلاغة.</p>)}
      {shown === 'kashshaf' && (passage ? (
        <CardWithRow className="block px-3.5 py-2.5" lead={<OpenInBook book="kashshaf" ayah={ayah} className="min-h-11 px-2" />}
          source={[{ line: KASHSHAF_BOOK, quotes: [{ text: '', cite: kashshafCredit(passage), url: kashshafPage(passage) },
            { text: `${KASHSHAF_BOOK}، ${KASHSHAF_EDITION}. نص الموسوعة القرآنية، إصدار ${data.version}، بلا حواشي الكتب المطبوعة معه. تضاء الجملة التي يسمّي فيها الزمخشري فنًّا من فنون البلاغة.` }] }]}>
          <p className="whitespace-pre-line text-[1.125rem] leading-[1.9]">
            {kashshafRuns(passage).map((run, i) => {
              const text = run.quran ? <QuranWords className="text-[var(--home-accent)]">{run.text}</QuranWords> : run.text;
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
        </CardWithRow>
      ) : <p className="py-6 text-center text-sm text-[var(--home-muted)]">لا كلام للكشاف على هذه الآية.</p>)}
    </>
  );
}
