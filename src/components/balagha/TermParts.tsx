'use client';

import { num } from '@shared/quran/arabicNumber';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { placesLabel } from '@shared/quran/branches';
import { ayahHref } from '@shared/ayahMarks';
import { ITQAN_BOOK, ITQAN_EDITION, itqanCredit, itqanPage } from '@shared/quran/itqanBalagha';
import { termCredit, termPage, type BalaghaTerm, type TermQuote } from '@shared/quran/balaghaTerms';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Folded from '@/components/common/Folded';
import ExternalLink from '@/components/common/ExternalLink';
import BookRuns from '@/components/quran/text/BookRuns';
import QuranWords from '@/components/quran/text/QuranWords';
import type { ExampleAyah, ExampleView } from '@/lib/balaghaTerms';

/**
 * The pieces of the balagha terms (the app's BalaghaTerm.tsx), shared by the terms' page, a term's feed card and the quiz's
 * look-up: a term's defining quotes each with its folded credit, and an example of al-Suyuti's with the ayah words he quotes lit.
 */
const TALKHIS_EDITION = 'تلخيص المفتاح لجلال الدين القزويني (ت ٧٣٩هـ)، متنًا فوق شرح بهاء الدين السبكي «عروس الأفراح في شرح تلخيص المفتاح»، تحقيق عبد الحميد هنداوي، المكتبة العصرية، ١٤٢٣هـ/٢٠٠٣م';
const BY: Record<TermQuote['book'], string> = { itqan: 'قال السيوطي في الإتقان:', talkhis: 'قال القزويني في تلخيص المفتاح:' };
const names: Record<number, string> = SURAH_NAMES;

/** What heads a term's quotes: «تعريفه» where they define it, otherwise his words on it. */
export const quotesTitle = (term: Pick<BalaghaTerm, 'defines'>) => (term.defines ? 'تعريفه' : 'من كلام السيوطي عليه');
/** «القيامة ٢٩–٣٠», «المسد ١، ٤–٥». */
export const ayatName = (ayat: string[]) => placesLabel(ayat, names);

function QuoteCredit({ quote }: { quote: TermQuote }) {
  return (
    <Folded credit={termCredit(quote)}>
      <p>{quote.book === 'itqan'
        ? `${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، الفقرة كاملة كما في الكتاب.`
        : `${TALKHIS_EDITION}. كلام القزويني في أعلى الصفحة، من نسخة المكتبة الشاملة التي نشرها موقع تراث. لم يعرّفه السيوطي في الإتقان، فنقلنا تعريف القزويني.`}</p>
      <ExternalLink href={termPage(quote)}>اقرأ الصفحة</ExternalLink>
    </Folded>
  );
}

/** A term's quotes in one card, each whole, with its credit under it. */
export function TermQuotes({ term }: { term: BalaghaTerm }) {
  const mixed = new Set(term.quotes.map(quote => quote.book)).size > 1;
  return (
    <Card className="flex flex-col gap-1 px-3.5 py-2.5">
      <p className="text-sm text-[var(--home-muted)]">{quotesTitle(term)}</p>
      {term.quotes.map((quote, i) => (
        <div key={`${quote.book}${quote.id}/${i}`}>
          {mixed && quote.book !== term.quotes[i - 1]?.book && <p className={`text-sm text-[var(--home-muted)] ${i ? 'mt-2' : ''}`}>{BY[quote.book]}</p>}
          <p className="text-[1.125rem] leading-[1.85]"><BookRuns text={quote.text} /></p>
          <QuoteCredit quote={quote} />
        </div>
      ))}
    </Card>
  );
}

/** Ayat in the mushaf's font, the words he quotes on the band, each ayah's number after it (the app's LitAyat). */
export function LitAyat({ lines, size = 'text-2xl' }: { lines: ExampleAyah[]; size?: string }) {
  return (
    <p className={`${size} leading-[2] text-justify [text-align-last:right]`}>
      <QuranWords>
        {lines.map((ayah, k) => <span key={ayah.key}>
          {ayah.words.map((word, i) => <span key={i} className={ayah.lit.some(([from, to]) => i >= from && i <= to) ? 'bg-[color-mix(in_srgb,var(--home-ink)_20%,transparent)]' : undefined}>{`${k || i ? ' ' : ''}${word}`}</span>)}
          {` ${num(ayah.number)}`}
        </span>)}
      </QuranWords>
    </p>
  );
}

/** One example: the ayat with his quoted words lit, his paragraph whole (unless the definition already quotes it), the ayat as links to the mushaf, and its credit. */
export function TermExampleCard({ example }: { example: ExampleView }) {
  return (
    <Card className="flex flex-col gap-1.5 px-3.5 py-2.5">
      <LitAyat lines={example.lines} />
      <hr className="border-[var(--home-rule)] opacity-60" />
      {example.inDefinition
        ? <p className="text-[var(--home-muted)]">ذكرها في كلامه المنقول في التعريف أعلاه.</p>
        : <p className="text-[1.125rem] leading-[1.85]"><BookRuns text={example.text} /></p>}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {example.ayat.map(key => {
          const [surah, number] = key.split(':').map(Number);
          const name = `${names[surah] ?? num(surah)} ${num(number)}`;
          return <Chip key={key} small label={name} href={ayahHref(key)} name={`افتح ${name} في المصحف`} />;
        })}
      </div>
      <Folded credit={itqanCredit(example)}>
        <p>{`${ITQAN_BOOK}، ${ITQAN_EDITION}. الفقرة كاملة كما في الكتاب، تحت عنوانه.`}</p>
        <ExternalLink href={itqanPage(example)}>اقرأ الصفحة</ExternalLink>
      </Folded>
    </Card>
  );
}
