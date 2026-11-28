import { num } from '@shared/quran/arabicNumber';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './AyahFlow';
import type { AyahMenuKeys } from '@/ui/AyahMenuPress';

export const deepBand = (palette: Palette) => `${palette.ink}33`;

export default function LitAyat({ ayat, menu, palette }: { ayat: { words: string[]; lit: [number, number][]; number?: number }[];
  menu: AyahMenuKeys; palette: Palette }) {
  return (
    <AyahFlow color={palette.ink} menu={menu}>
      {ayat.map((ayah, k) => ayah.words.map((word, i) => (
        <AyahWords key={`${k}/${i}`} look={ayah.lit.some(([from, to]) => i >= from && i <= to) ? { backgroundColor: deepBand(palette) } : undefined}>{`${k || i ? ' ' : ''}${word}`}</AyahWords>
      )).concat(ayah.number !== undefined ? [<AyahWords key={`${k}#`}>{` ${num(ayah.number)}`}</AyahWords>] : []))}
    </AyahFlow>
  );
}
