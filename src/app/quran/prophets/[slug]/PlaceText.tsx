import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import type { Place } from '@shared/quran/prophets/story';

/** A place's ayat in the Quran font, words another surah also has (`shared`, from sharedWords) in colour. */
export default function PlaceText({ place, shared, className = 'text-2xl leading-[2.1]' }: { place: Place; shared: boolean[][][]; className?: string }) {
  return (
    <>
      {place.segments.map((g, gi) => (
        <p key={g.range[0]} className={`font-quran text-justify ${className}`}>
          {g.lines.map((line, li) => (
            <span key={line.ayah}>
              {line.words.map((word, w) => (
                <span key={w} style={shared[gi][li][w] ? { color: 'var(--home-accent)' } : undefined}>{`${mushafText(word)} `}</span>
              ))}
              <span className="text-[0.75em] text-[var(--home-muted)]">{`${num(line.ayah)} `}</span>
            </span>
          ))}
        </p>
      ))}
    </>
  );
}
