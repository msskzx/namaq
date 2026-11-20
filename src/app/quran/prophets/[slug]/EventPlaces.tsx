'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { rangeText, sharedWords, type EventView, type Place } from '@shared/quran/prophets/story';
import { placeKeyOf } from '@shared/quran/prophets/review';
import CompareLinks from '@/components/common/CompareLinks';
import { ShareImageButton } from '@/components/share/ShareImage';
import { SLIDE, useSwipe } from '@/components/common/useSwipe';
import type { CompareLink } from '@/app/quran/compare/pairCards';
import { PlaceReview } from './PlaceReview';
import PlaceText from './PlaceText';
import { groupColor, type StoryReview } from './StoryMap';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

/**
 * One event read across the surahs that tell it: a card for each surah, one under another, words another surah also has in colour.
 * A sideways swipe steps to the next or previous event; the step buttons show on wider screens only.
 */
export default function EventPlaces({ slug, compare, event, places, phase, focus, onStep, hasPrev, hasNext, review, readable = true }: {
  /** The step, mushaf, compare and share buttons, and the swipe: off in a home card, whose row opens the story at this event. */
  readable?: boolean;
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
  useSwipe(box, readable && (hasPrev || hasNext), {
    forward: dx => dx > 0,
    canStep: forward => (forward ? hasNext : hasPrev),
    start: () => setSettling(false),
    drag: setX,
    step: forward => { setX(0); onStep(forward ? 1 : -1); },
    cancel: back,
  });
  const icon = 'rounded p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]';
  return (
    <section ref={box} aria-labelledby={readable ? 'event-heading' : undefined} aria-label={readable ? undefined : event.title} className={`flex flex-col gap-4 ${settling ? 'transition-transform duration-[250ms]' : ''}`} style={x ? { transform: `translateX(${x}px)` } : undefined}>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-semibold" style={{ color: groupColor(event.phase) }}>{phase}</p>
          <h2 id={readable ? 'event-heading' : undefined} className="text-2xl font-bold leading-snug">{event.title}</h2>
        </div>
        {readable && <span className="hidden sm:contents">
          <Button size="round" variant="outline" onClick={() => onStep(-1)} disabled={!hasPrev} aria-label="الحدث السابق"><ArrowRight aria-hidden /></Button>
          <Button size="round" variant="outline" onClick={() => onStep(1)} disabled={!hasNext} aria-label="الحدث التالي"><ArrowLeft aria-hidden /></Button>
        </span>}
      </div>
      <div className="flex max-w-4xl flex-col gap-3">
        {places.map((place, k) => (
          <Card
            as="article"
            key={place.surah}
            data-share-card
            data-surah={place.surah}
            faded={review?.verdicts[placeKeyOf(review.slug, place)]?.keep === false}
            picked={focus === place.surah}
            className="flex flex-col gap-1 p-4"
          >
            {/* In the image the place carries its event, as in the phone app. */}
            <div data-share-only hidden>
              <p className="text-sm font-semibold" style={{ color: groupColor(event.phase) }}>{phase}</p>
              <p className="text-xl font-bold leading-snug">{event.title}</p>
            </div>
            <header className="flex items-center gap-2">
              <h3 className="font-semibold">{place.name}</h3>
              <span className="text-xs text-[var(--home-muted)]">{place.segments.map(g => rangeText(g.range)).join('، ')}</span>
              {readable && <span data-share-skip className="ms-auto flex items-center gap-2">
                <Link href={`/quran/read/ayah/${place.surah}/${place.segments[0].range[0]}`} aria-label={`افتح ${place.name} في المصحف`} title="افتح في المصحف" className={icon}>
                  <BookOpen size={16} aria-hidden />
                </Link>
                <CompareLinks links={compare[placeKeyOf(slug, place)] ?? []} label={`قارن ${place.name}`} className={icon} />
                <ShareImageButton size="icon" iconSize={16} href={`/quran/read/ayah/${place.surah}/${place.segments[0].range[0]}`} />
              </span>}
            </header>
            <PlaceText place={place} shared={shared[k]} />
            {review && <PlaceReview key={placeKeyOf(review.slug, place)} id={placeKeyOf(review.slug, place)} verdict={review.verdicts[placeKeyOf(review.slug, place)]} />}
          </Card>
        ))}
      </div>
    </section>
  );
}
