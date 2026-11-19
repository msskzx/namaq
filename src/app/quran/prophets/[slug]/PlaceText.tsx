import { num } from '@shared/quran/arabicNumber';
import type { Place } from '@shared/quran/prophets/story';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';

/** A place's ayat as the page sets them (AyahFlow), words another surah also has (`shared`, from sharedWords) in colour. */
export default function PlaceText({ place, shared }: { place: Place; shared: boolean[][][] }) {
  return (
    <>
      {place.segments.map((g, gi) => (
        <AyahFlow key={g.range[0]}>
          {g.lines.map((line, li) => (
            <span key={line.ayah}>
              {line.words.map((word, w) => <AyahWords key={w} className={shared[gi][li][w] ? 'text-[var(--home-accent)]' : undefined}>{`${word} `}</AyahWords>)}
              <AyahWords className="text-[var(--home-muted)]">{`${num(line.ayah)} `}</AyahWords>
            </span>
          ))}
        </AyahFlow>
      ))}
    </>
  );
}
