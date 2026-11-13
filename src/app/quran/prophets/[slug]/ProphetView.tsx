'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { NavActions } from '@/components/common/NavBar';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import { PROPHETS, prophetName } from '@shared/quran/prophets';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { storyMap, type EventView } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import type { CompareLink } from '../../compare/pairCards';
import EventPlaces from './EventPlaces';
import { useReviewMode } from './PlaceReview';
import StoryMap from './StoryMap';
import { rememberProphet } from '../OpenLastProphet';

// docs/plans/quran-prophet-timelines.md
/** `verdicts` comes only on the owner's machine, with every dot in `events`; readers get the story already cut. */
export default function ProphetView({ slug, title, intro, phases, events: all, verdicts, compare }: { slug: string; title: string; intro: string; phases: readonly string[]; events: EventView[]; verdicts?: PlaceVerdicts; compare: Record<string, CompareLink[]> }) {
  const router = useRouter();
  useEffect(() => rememberProphet(slug), [slug]);
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

  // The search opens an event with ?event=<its place in the story>: shown open, scrolled to. The kept story can drop events, so it is found by title.
  useEffect(() => {
    const asked = Number(new URLSearchParams(window.location.search).get('event') ?? NaN);
    const title = Number.isInteger(asked) ? STORIES[slug]?.events[asked]?.title : undefined;
    const at = title ? events.findIndex(event => event.title === title) : -1;
    if (at >= 0) read(at);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        {/* As in the app: the prophet picker sits in the top bar, and the help behind its question mark. */}
        <NavActions><div className="flex flex-1 justify-center"><ProphetPicker slug={slug} onPick={next => router.push(`/quran/prophets/${next}`)} /></div></NavActions>
        <SettingsHelp label="كيف تُقرأ القصة؟">{STORY_HELP}<p className="text-[var(--home-muted)]">{intro}</p></SettingsHelp>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
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

const STORY_HELP = <>
  <p>كل عمود حدث تحت لون مجموعته، وكل سطر سورة. حجم الدائرة على قدر آيات السورة في الحدث.</p>
  <p>اضغط دائرة لتقرأ آياتها مع مواضع الحدث في السور الأخرى، ومن كل موضع تفتحه في المصحف أو تقارنه بسورة أخرى. وفي المواضع تُلوَّن الكلمة إذا جاءت في سورة أخرى من مواضع الحدث نفسه.</p>
</>;

/** Which prophet's story the page shows: the prophet's name and a dropdown, in the top bar as in the app. */
function ProphetPicker({ slug, onPick }: { slug: string; onPick: (slug: string) => void }) {
  const prophet = PROPHETS.find(p => p.slug === slug);
  const name = prophet && prophetName(prophet);
  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--home-rule)] px-3 py-1.5 text-[0.9375rem] text-[var(--home-ink)]" title="قصة نبي آخر">
      <span className="truncate">{name}</span>
      <ChevronDown size={14} aria-hidden />
      <select value={slug} onChange={e => onPick(e.target.value)} aria-label="قصة نبي آخر" className="absolute inset-0 cursor-pointer opacity-0 text-base">
        {PROPHETS.map(p => <option key={p.slug} value={p.slug}>{prophetName(p)}</option>)}
      </select>
    </label>
  );
}
