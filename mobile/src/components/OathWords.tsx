import { num } from '@shared/quran/arabicNumber';
import type { OathView } from '@shared/quran/oaths';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import type { Palette } from '@/lib/theme';

export default function OathWords({ oath, palette }: { oath: OathView; palette: Palette }) {
  return (
    <AyahFlow color={palette.ink} menu={oath.lines.map(line => `${oath.surah}:${line.ayah}`)}>
      {oath.lines.map(line => [
        ...line.words.map((word, i) => <AyahWords key={`${line.ayah}-${i}`} look={word.sworn ? { color: palette.accent } : undefined}>{`${word.text} `}</AyahWords>),
        <AyahWords key={`${line.ayah}-n`} look={{ color: palette.amber }}>{`${num(line.ayah)} `}</AyahWords>,
      ])}
    </AyahFlow>
  );
}
