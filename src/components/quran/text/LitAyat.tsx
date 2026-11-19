import { Fragment } from 'react';
import { num } from '@shared/quran/arabicNumber';
import AyahFlow, { AyahWords } from './AyahFlow';

/** The band under the ayah words a book's paragraph quotes. */
export const BAND = 'bg-[color-mix(in_srgb,var(--home-ink)_20%,transparent)]';

/**
 * Ayat as the page sets them (AyahFlow: the reader's line size and height), each as its page words, the words in `lit`
 * (runs of word indices) on the band, and the ayah's number after it when it has one (the app's LitAyat): a balagha term's
 * example, the gharib panel's ayah, a qira'at place. `className` sets colour only.
 */
export default function LitAyat({ ayat, className }: { ayat: { words: string[]; lit: [number, number][]; number?: number }[]; className?: string }) {
  return (
    <AyahFlow className={className}>
      {ayat.map((ayah, k) => ayah.words.map((word, i) => (
        <Fragment key={`${k}/${i}`}>
          {k || i ? ' ' : ''}
          {ayah.lit.some(([from, to]) => i >= from && i <= to) ? <mark className={`rounded-sm text-inherit ${BAND}`}><AyahWords>{word}</AyahWords></mark> : <AyahWords>{word}</AyahWords>}
        </Fragment>
      )).concat(ayah.number !== undefined ? [<AyahWords key={`${k}#`}>{` ${num(ayah.number)}`}</AyahWords>] : []))}
    </AyahFlow>
  );
}
