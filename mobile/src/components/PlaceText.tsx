import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import type { Place } from '@shared/quran/prophets/story';
import { QURAN_FONT, type Palette } from '@/lib/theme';

/** The website's PlaceText: a place's ayat in the Quran font, words another surah also has (`shared`, from sharedWords) in colour. */
export default function PlaceText({ place, shared, palette, size = 23 }: { place: Place; shared: boolean[][][]; palette: Palette; size?: number }) {
  return (
    <>
      {place.segments.map((g, gi) => (
        <Text key={g.range[0]} style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * 2, color: palette.ink, writingDirection: 'rtl', textAlign: 'justify' }}>
          {g.lines.map((line, li) => (
            <Text key={line.ayah}>
              {line.words.map((word, w) => (
                <Text key={w} style={shared[gi][li][w] ? { color: palette.accent } : undefined}>{`${mushafText(word)} `}</Text>
              ))}
              <Text style={{ color: palette.muted, fontSize: Math.round(size * 0.74) }}>{`${num(line.ayah)} `}</Text>
            </Text>
          ))}
        </Text>
      ))}
    </>
  );
}
