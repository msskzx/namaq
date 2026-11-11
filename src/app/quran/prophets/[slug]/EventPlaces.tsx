'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { rangeText, sharedWords, type EventView, type Place } from '@shared/quran/prophets/story';
import { groupColor } from './StoryMap';

/** One event read across the surahs that tell it: a card for each surah, one under another, words another surah also has in colour. */
export default function EventPlaces({ event, places, phase, focus, onStep, hasPrev, hasNext }: {
  event: EventView;
  places: Place[];
  phase: string;
  focus?: number;
  onStep: (dir: 1 | -1) => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const shared = sharedWords(places);
  const step = 'inline-flex size-9 items-center justify-center rounded-lg border border-[var(--home-rule)] text-[var(--home-ink)] hover:bg-[var(--home-paper-deep)] disabled:opacity-40';
  return (
    <section aria-labelledby="event-heading" className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-semibold" style={{ color: groupColor(event.phase) }}>{phase}</p>
          <h2 id="event-heading" className="text-2xl font-bold leading-snug">{event.title}</h2>
        </div>
        <button type="button" className={step} onClick={() => onStep(-1)} disabled={!hasPrev} aria-label="الحدث السابق"><ArrowRight size={18} aria-hidden /></button>
        <button type="button" className={step} onClick={() => onStep(1)} disabled={!hasNext} aria-label="الحدث التالي"><ArrowLeft size={18} aria-hidden /></button>
      </div>
      <div className="flex max-w-4xl flex-col gap-3">
        {places.map((place, k) => (
          <article
            key={place.surah}
            data-surah={place.surah}
            className={`flex flex-col gap-1 rounded-xl border bg-[var(--home-card)] p-4 ${focus === place.surah ? 'border-[var(--home-ink)]' : 'border-[var(--home-rule)]'}`}
          >
            <header className="flex items-center gap-2">
              <h3 className="font-semibold">{place.name}</h3>
              <span className="text-xs text-[var(--home-muted)]">{place.segments.map(g => rangeText(g.range)).join('، ')}</span>
              <Link href={`/quran/read/ayah/${place.surah}/${place.segments[0].range[0]}`} aria-label={`افتح ${place.name} في المصحف`} title="افتح في المصحف" className="ms-auto rounded p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]">
                <BookOpen size={16} aria-hidden />
              </Link>
            </header>
            {place.segments.map((g, gi) => (
              <p key={g.range[0]} className="font-quran text-2xl leading-[2.1]">
                {g.lines.map((line, li) => (
                  <span key={line.ayah}>
                    {line.words.map((word, w) => (
                      <span key={w} style={shared[k][gi][li][w] ? { color: 'var(--home-accent)' } : undefined}>{`${mushafText(word)} `}</span>
                    ))}
                    <span className="text-lg text-[var(--home-muted)]">{`${num(line.ayah)} `}</span>
                  </span>
                ))}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
