import { num } from '@shared/quran/arabicNumber';
import type { Place } from '@shared/quran/prophets/story';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';

/** The website's PlaceText: a place's ayat as the page sets them (AyahFlow), words another surah also has (`shared`, from sharedWords) in colour. */
export default function PlaceText({ place, shared, palette }: { place: Place; shared: boolean[][][]; palette: Palette }) {
  return (
    <>
      {place.segments.map((g, gi) => (
        <AyahFlow key={g.range[0]} color={palette.ink}>
          {g.lines.map((line, li) => [
            ...line.words.map((word, w) => <AyahWords key={`${line.ayah}/${w}`} look={shared[gi][li][w] ? { color: palette.accent } : undefined}>{`${word} `}</AyahWords>),
            <AyahWords key={`${line.ayah}#`} look={{ color: palette.muted }}>{`${num(line.ayah)} `}</AyahWords>,
          ])}
        </AyahFlow>
      ))}
    </>
  );
}
