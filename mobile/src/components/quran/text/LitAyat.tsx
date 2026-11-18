import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import type { Palette } from '@/lib/theme';
import QuranWords from './QuranWords';

/** The band under the ayah words a book's paragraph quotes: the reader's sheets and the balagha terms' examples. */
export const deepBand = (palette: Palette) => `${palette.ink}33`;

/**
 * Ayat in the mushaf's font, each as its page words, the words in `lit` (runs of word indices) on the band, and the
 * ayah's number after it when it has one: the balagha and gharib sheets' ayah, a balagha term's example.
 */
export default function LitAyat({ ayat, palette, size = 23 }: { ayat: { words: string[]; lit: [number, number][]; number?: number }[]; palette: Palette; size?: number }) {
  return (
    <QuranWords style={{ fontSize: size, lineHeight: size * 2, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
      {ayat.map((ayah, k) => ayah.words.map((word, i) => (
        <Text key={`${k}/${i}`} style={ayah.lit.some(([from, to]) => i >= from && i <= to) ? { backgroundColor: deepBand(palette) } : undefined}>{`${k || i ? ' ' : ''}${word}`}</Text>
      )).concat(ayah.number !== undefined ? [<Text key={`${k}#`}>{` ${num(ayah.number)}`}</Text>] : []))}
    </QuranWords>
  );
}
