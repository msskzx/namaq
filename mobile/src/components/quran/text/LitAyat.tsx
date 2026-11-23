import { num } from '@shared/quran/arabicNumber';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './AyahFlow';
import type { AyahMenuKeys } from '@/ui/AyahMenuPress';

/** The band under the ayah words a book's paragraph quotes: the reader's sheets and the balagha terms' examples. */
export const deepBand = (palette: Palette) => `${palette.ink}33`;

/**
 * Ayat as the page sets them (AyahFlow: the reader's line size and height), each as its page words, the words in `lit`
 * (runs of word indices) on the band, and the ayah's number after it when it has one: the balagha and gharib sheets' ayah,
 * a balagha term's example, a qira'at place.
 */
export default function LitAyat({ ayat, menu, palette }: { ayat: { words: string[]; lit: [number, number][]; number?: number }[];
  /** The ayah a long press opens the reader's menu on (AyahFlow's `menu`), or false. */
  menu: AyahMenuKeys; palette: Palette }) {
  return (
    <AyahFlow color={palette.ink} menu={menu}>
      {ayat.map((ayah, k) => ayah.words.map((word, i) => (
        <AyahWords key={`${k}/${i}`} look={ayah.lit.some(([from, to]) => i >= from && i <= to) ? { backgroundColor: deepBand(palette) } : undefined}>{`${k || i ? ' ' : ''}${word}`}</AyahWords>
      )).concat(ayah.number !== undefined ? [<AyahWords key={`${k}#`}>{` ${num(ayah.number)}`}</AyahWords>] : []))}
    </AyahFlow>
  );
}
