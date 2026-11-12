'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowLeftRight, ArrowRight, BookOpen } from 'lucide-react';
import { rangeText, sharedWords, type EventView, type Place } from '@shared/quran/prophets/story';
import { placeKeyOf } from '@shared/quran/prophets/review';
import useDismissable from '@/components/common/useDismissable';
import { SLIDE, useSwipe } from '@/components/common/useSwipe';
import type { CompareLink } from '../../compare/pairCards';
import { PlaceReview } from './PlaceReview';
import PlaceText from './PlaceText';
import { groupColor, type StoryReview } from './StoryMap';

/**
 * One event read across the surahs that tell it: a card for each surah, one under another, words another surah also has in colour.
 * A sideways swipe steps to the next or previous event; the step buttons show on wider screens only.
 */
export default function EventPlaces({ slug, compare, event, places, phase, focus, onStep, hasPrev, hasNext, review }: {
  review?: StoryReview;
  slug: string;
  /** A place's compare pages, by its review key. */
  compare: Record<string, CompareLink[]>;
  event: EventView;
  places: Place[];
  phase: string;
  focus?: number;
  onStep: (dir: 1 | -1) => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const shared = sharedWords(places);
  const box = useRef<HTMLElement>(null);
  const [x, setX] = useState(0);
  const [settling, setSettling] = useState(false);
  const back = () => { setSettling(true); setX(0); setTimeout(() => setSettling(false), SLIDE); };
  // A finger moving right goes on to the next event, as an Arabic page turns.
  useSwipe(box, hasPrev || hasNext, {
    forward: dx => dx > 0,
    canStep: forward => (forward ? hasNext : hasPrev),
    start: () => setSettling(false),
    drag: setX,
    step: forward => { setX(0); onStep(forward ? 1 : -1); },
    cancel: back,
  });
  const icon = 'rounded p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]';
  const step = 'hidden sm:inline-flex size-9 items-center justify-center rounded-lg border border-[var(--home-rule)] text-[var(--home-ink)] hover:bg-[var(--home-paper-deep)] disabled:opacity-40';
  return (
    <section ref={box} aria-labelledby="event-heading" className={`flex flex-col gap-4 ${settling ? 'transition-transform duration-[250ms]' : ''}`} style={x ? { transform: `translateX(${x}px)` } : undefined}>
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
            className={`flex flex-col gap-1 rounded-xl border bg-[var(--home-card)] p-4 ${review?.verdicts[placeKeyOf(review.slug, place)]?.keep === false ? 'opacity-60' : ''} ${focus === place.surah ? 'border-[var(--home-ink)]' : 'border-[var(--home-rule)]'}`}
          >
            <header className="flex items-center gap-2">
              <h3 className="font-semibold">{place.name}</h3>
              <span className="text-xs text-[var(--home-muted)]">{place.segments.map(g => rangeText(g.range)).join('، ')}</span>
              <Link href={`/quran/read/ayah/${place.surah}/${place.segments[0].range[0]}`} aria-label={`افتح ${place.name} في المصحف`} title="افتح في المصحف" className={`ms-auto ${icon}`}>
                <BookOpen size={16} aria-hidden />
              </Link>
              <CompareLinks links={compare[placeKeyOf(slug, place)] ?? []} label={`قارن ${place.name}`} className={icon} />
            </header>
            <PlaceText place={place} shared={shared[k]} />
            {review && <PlaceReview key={placeKeyOf(review.slug, place)} id={placeKeyOf(review.slug, place)} verdict={review.verdicts[placeKeyOf(review.slug, place)]} />}
          </article>
        ))}
      </div>
    </section>
  );
}

/** The compare pages holding a kept card of this place's ayat with another surah's in the event: one opens at once, several open a list to choose from. */
function CompareLinks({ links, label, className }: { links: CompareLink[]; label: string; className: string }) {
  const ref = useDismissable<HTMLDetailsElement>();
  if (!links.length) return null;
  if (links.length === 1) return <Link href={links[0].href} aria-label={label} title={label} className={className}><ArrowLeftRight size={16} aria-hidden /></Link>;
  return (
    <details ref={ref} className="relative">
      <summary aria-label={label} title={label} className={`flex cursor-pointer list-none [&::-webkit-details-marker]:hidden ${className}`}>
        <ArrowLeftRight size={16} aria-hidden />
      </summary>
      <div className="absolute top-full end-0 z-30 mt-1 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-md border border-[var(--home-rule)] bg-[var(--home-paper)] p-2 shadow-lg">
        <p className="px-2 text-sm font-semibold">افتح في المقارنة</p>
        {links.map(link => <Link key={link.href} href={link.href} className="rounded px-2 py-2 text-sm hover:bg-[var(--home-paper-deep)]">{link.label}</Link>)}
      </div>
    </details>
  );
}
