'use client';

import { num } from '@shared/quran/arabicNumber';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { placesLabel } from '@shared/quran/branches';
import { ayahHref } from '@shared/ayahMarks';
import { exampleSource, plainName, termSource, type BalaghaTerm, type TermQuote } from '@shared/quran/balaghaTerms';
import CardWithRow from '@/components/common/CardWithRow';
import Chip from '@/components/common/Chip';
import { sourcesOf } from '@/components/common/SourceLine';
import BookRuns from '@/components/quran/text/BookRuns';
import LitAyat from '@/components/quran/text/LitAyat';
import type { ExampleAyah, ExampleView } from '@/lib/balaghaTerms';

/**
 * The pieces of the balagha terms (the app's BalaghaTerm.tsx), shared by the terms' page, a term's feed card and the quiz's
 * look-up: a term's defining quotes, and an example of al-Suyuti's with the ayah words he quotes lit, each card with its
 * books on the line under it.
 */
const BY: Record<TermQuote['book'], string> = { itqan: 'قال السيوطي في الإتقان:', talkhis: 'قال القزويني في تلخيص المفتاح:' };
const names: Record<number, string> = SURAH_NAMES;

/** The address of a term's page: its plain name. */
export const termHref = (name: string) => `/quran/terms/${encodeURIComponent(plainName(name))}`;

/** What heads a term's quotes: «تعريفه» where they define it, otherwise his words on it. */
export const quotesTitle = (term: Pick<BalaghaTerm, 'defines'>) => (term.defines ? 'تعريفه' : 'من كلام السيوطي عليه');
/** «القيامة ٢٩–٣٠», «المسد ١، ٤–٥». */
export const ayatName = (ayat: string[]) => placesLabel(ayat, names);

/** A term's quotes in one card, each whole, their books on the line under it (owner 2026-11-20). */
export function TermQuotes({ term }: { term: BalaghaTerm }) {
  const mixed = new Set(term.quotes.map(quote => quote.book)).size > 1;
  return (
    <CardWithRow source={sourcesOf(term.quotes.map(termSource))} className="flex flex-col gap-1 px-3.5 py-2.5">
      <p className="text-sm text-[var(--home-muted)]">{quotesTitle(term)}</p>
      {term.quotes.map((quote, i) => (
        <div key={`${quote.book}${quote.id}/${i}`}>
          {mixed && quote.book !== term.quotes[i - 1]?.book && <p className={`text-sm text-[var(--home-muted)] ${i ? 'mt-2' : ''}`}>{BY[quote.book]}</p>}
          <p className="text-[1.125rem] leading-[1.85]"><BookRuns text={quote.text} /></p>
        </div>
      ))}
    </CardWithRow>
  );
}

/** An example's ayat as the page sets them, the words he quotes on the band, each ayah's number after it (the app's ExampleAyat). */
export const ExampleAyat = ({ lines }: { lines: ExampleAyah[] }) => <LitAyat ayat={lines} />;

/**
 * One example: the ayat with his quoted words lit and his paragraph whole (unless the definition already quotes it);
 * under the card each ayah as a chip to the mushaf, then his book on the line (owner 2026-11-20).
 */
export function TermExampleCard({ example }: { example: ExampleView }) {
  return (
    <CardWithRow source={sourcesOf([exampleSource(example)])} className="flex flex-col gap-1.5 px-3.5 py-2.5" row={
      <div className="flex flex-wrap gap-1.5 px-1">
        {example.ayat.map(key => {
          const [surah, number] = key.split(':').map(Number);
          const name = `${names[surah] ?? num(surah)} ${num(number)}`;
          return <Chip key={key} small label={name} href={ayahHref(key)} name={`افتح ${name} في المصحف`} />;
        })}
      </div>}>
      <ExampleAyat lines={example.lines} />
      <hr className="border-[var(--home-rule)] opacity-60" />
      {example.inDefinition
        ? <p className="text-[var(--home-muted)]">ذكرها في كلامه المنقول في التعريف أعلاه.</p>
        : <p className="text-[1.125rem] leading-[1.85]"><BookRuns text={example.text} /></p>}
    </CardWithRow>
  );
}
