'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { PROPHETS } from '@shared/quran/prophets';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { storyMap, type EventView } from '@shared/quran/prophets/story';
import type { CompareLink } from '../../compare/pairCards';
import EventPlaces from './EventPlaces';
import { useReviewMode } from './PlaceReview';
import StoryMap from './StoryMap';

// docs/plans/quran-prophet-timelines.md
/** `verdicts` comes only on the owner's machine, with every dot in `events`; readers get the story already cut. */
export default function ProphetView({ slug, title, intro, phases, events: all, verdicts, compare }: { slug: string; title: string; intro: string; phases: readonly string[]; events: EventView[]; verdicts?: PlaceVerdicts; compare: Record<string, CompareLink[]> }) {
  const [help, setHelp] = useState(false);
  const router = useRouter();
  const review = useReviewMode() && verdicts !== undefined;
  // Dropped dots show only in review.
  const events = useMemo(() => (review || !verdicts ? all : keptViews(slug, all, verdicts)), [review, all, slug, verdicts]);
  const map = useMemo(() => storyMap(events), [events]);
  const reviewing = review && verdicts ? { slug, verdicts } : undefined;
  const [open, setOpen] = useState<{ event: number; surah?: number }>();
  const detail = useRef<HTMLDivElement>(null);

  const read = (event: number, surah?: number) => {
    setOpen({ event, surah });
    requestAnimationFrame(() => {
      const target = surah === undefined ? detail.current : detail.current?.querySelector(`[data-surah="${surah}"]`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
          <ProphetPicker slug={slug} onPick={next => router.push(`/quran/prophets/${next}`)} />
          <button type="button" onClick={() => setHelp(!help)} aria-expanded={help} aria-controls="story-help" aria-label="شرح الصفحة" title="شرح الصفحة"
            className="rounded-full p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]">
            <CircleHelp size={20} aria-hidden />
          </button>
        </div>
        {help && (
          <div id="story-help" className="flex max-w-3xl flex-col gap-2 rounded-xl border border-[var(--home-rule)] bg-[var(--home-card)] p-4 text-sm leading-7">
            <p>كل عمود حدث تحت لون مجموعته، وكل سطر سورة. حجم الدائرة على قدر آيات السورة في الحدث.</p>
            <p>اضغط دائرة لتقرأ آياتها مع مواضع الحدث في السور الأخرى، ومن كل موضع تفتحه في المصحف أو تقارنه بسورة أخرى. وفي المواضع تُلوَّن الكلمة إذا جاءت في سورة أخرى من مواضع الحدث نفسه.</p>
            <p className="text-[var(--home-muted)]">{intro}</p>
          </div>
        )}
      </header>
      <StoryMap map={map} events={events} phases={phases} onRead={read} current={open} review={reviewing} />
      <div ref={detail} className="scroll-mt-6 overflow-x-clip">
        {open && events[open.event] && (
          <EventPlaces
            slug={slug}
            compare={compare}
            event={events[open.event]}
            places={map.places[open.event]}
            phase={phases[events[open.event].phase]}
            focus={open.surah}
            review={reviewing}
            hasPrev={open.event > 0}
            hasNext={open.event < events.length - 1}
            onStep={dir => read(open.event + dir)}
          />
        )}
      </div>
    </div>
  );
}

/** Which prophet's story the page shows: an icon-sized dropdown beside the title. */
function ProphetPicker({ slug, onPick }: { slug: string; onPick: (slug: string) => void }) {
  return (
    <label className="relative inline-flex items-center rounded-full p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]" title="قصة نبي آخر">
      <ChevronDown size={20} aria-hidden />
      <select value={slug} onChange={e => onPick(e.target.value)} aria-label="قصة نبي آخر" className="absolute inset-0 cursor-pointer opacity-0 text-base">
        {PROPHETS.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
      </select>
    </label>
  );
}
