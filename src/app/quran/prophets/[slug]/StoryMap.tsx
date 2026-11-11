'use client';

import { Fragment, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, BookOpen, Columns3, X } from 'lucide-react';
import { counted } from '@shared/quran/arabicNumber';
import { dotSize, placeIn, rangeText, type EventView, type Place, type StoryMap as StoryMapData } from '@shared/quran/prophets/story';

export const groupColor = (phase: number) => `var(--story-${phase % 5})`;

type Picked = { event: number; surah: number; x: number; y: number };

const SMALLEST = 7;
const LARGEST = 28;
const CELL = 'w-[2.375rem] min-w-[2.375rem]';

/** Where to compare a place: the other surah with the most ayat in the same event. */
const partnerOf = (places: Place[], surah: number) => places.filter(p => p.surah !== surah).sort((a, b) => b.count - a.count)[0];

function PlaceCard({ card, event, place, places, onRead, onClose, sheet }: {
  card: RefObject<HTMLDivElement | null>;
  event: EventView;
  place: Place;
  places: Place[];
  onRead: () => void;
  onClose: () => void;
  sheet: boolean;
}) {
  const partner = partnerOf(places, place.surah);
  const first = place.segments[0];
  const action = 'flex items-center gap-2 rounded-lg border border-[var(--home-rule)] px-3 py-2 text-start text-sm hover:bg-[var(--home-paper-deep)]';
  return (
    <div ref={card} id="place-card" role="dialog" aria-label={`${event.title} · ${place.name}`} className={`flex flex-col gap-2 border border-[var(--home-rule)] bg-[var(--home-card)] p-3 shadow-lg ${sheet ? 'rounded-t-2xl px-4 pb-[calc(1.25rem+var(--app-tabbar)+var(--app-safe-bottom))] pt-4' : 'w-72 rounded-xl'}`}>
      <div className="flex items-start gap-2">
        <div className="flex flex-1 flex-col">
          <p className="font-semibold leading-snug">{`${event.title} · ${place.name}`}</p>
          <p className="text-xs text-[var(--home-muted)]">{`${place.segments.map(g => `${place.name} ${rangeText(g.range)}`).join('، ')} · ${counted(place.count, ['آية', 'آيتان', 'آيات'])}`}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="إغلاق" className="rounded p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]"><X size={16} aria-hidden /></button>
      </div>
      <button type="button" onClick={onRead} className={`${action} border-transparent bg-[var(--home-ink)] text-[var(--home-paper)] hover:bg-[var(--home-ink)] hover:opacity-90`}>
        <Columns3 size={16} aria-hidden />
        {places.length > 1 ? `اقرأ مواضعه في ${counted(places.length, ['سورة', 'سورتين', 'سور'])}` : 'اقرأ آياته'}
      </button>
      <Link href={`/quran/read/ayah/${place.surah}/${first.range[0]}`} className={action}>
        <BookOpen size={16} aria-hidden />
        افتح الآيات في المصحف
      </Link>
      {partner && (
        <Link href={`/quran/compare?a=${place.surah}&b=${partner.surah}`} className={action}>
          <ArrowLeftRight size={16} aria-hidden />
          {`قارن ${place.name} بـ${partner.name}`}
        </Link>
      )}
    </div>
  );
}

/**
 * The story as a grid: a column for each event under its group's colour, a row for each surah.
 * A dot's size is how many ayat that surah gives the event; tapping it opens what can be done with them.
 */
export default function StoryMap({ map, events, phases, onRead }: {
  map: StoryMapData;
  events: EventView[];
  phases: readonly string[];
  onRead: (event: number, surah?: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<Picked>();
  const [sheet, setSheet] = useState(false);

  const dismiss = () => {
    setPicked(undefined);
    opener.current?.focus();
  };

  useEffect(() => {
    if (!picked) return;
    card.current?.scrollIntoView({ block: 'nearest' });
    card.current?.querySelector<HTMLElement>('button:not([aria-label]), a')?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPicked(undefined); opener.current?.focus(); } };
    const outside = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!card.current?.contains(target) && !(target instanceof Element && target.closest('[data-dot]'))) setPicked(undefined);
    };
    const resize = () => setPicked(undefined);
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', resize);
    };
  }, [picked]);

  const pick = (event: number, surah: number, dot: HTMLElement) => {
    opener.current = dot;
    const outer = box.current?.getBoundingClientRect();
    const at = dot.getBoundingClientRect();
    if (!outer) return;
    setSheet(window.matchMedia('(max-width: 639.98px)').matches);
    setPicked(old => (old?.event === event && old.surah === surah ? undefined : { event, surah, x: at.left + at.width / 2 - outer.left, y: at.bottom - outer.top + 8 }));
  };

  const groups = phases.map((name, phase) => ({ name, phase, events: events.map((e, i) => ({ e, i })).filter(({ e }) => e.phase === phase) })).filter(g => g.events.length > 0);
  const place = picked && placeIn(map, picked.event, picked.surah);
  const width = box.current?.clientWidth ?? 0;

  return (
    <div ref={box} className="relative">
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10" onScroll={() => setPicked(undefined)}>
        <table className="border-collapse" aria-label="أحداث القصة في السور">
          <thead>
            <tr>
              <th className="sticky start-0 z-10 bg-[var(--home-paper)]" />
              {groups.map((g, k) => (
                <Fragment key={g.name}>
                  {k > 0 && <th className="w-4 min-w-4" aria-hidden />}
                  <th colSpan={g.events.length} scope="colgroup" className="border-b-[3px] pb-1 text-sm font-bold whitespace-nowrap" style={{ color: groupColor(g.phase), borderColor: groupColor(g.phase) }}>
                    {g.name}
                  </th>
                </Fragment>
              ))}
            </tr>
            <tr>
              <th className="sticky start-0 z-10 bg-[var(--home-paper)]" />
              {groups.map((g, k) => (
                <Fragment key={g.name}>
                  {k > 0 && <th aria-hidden />}
                  {g.events.map(({ e, i }) => (
                    <th key={e.n} scope="col" className={`${CELL} h-48 align-bottom pb-2 font-normal`}>
                      <button type="button" onClick={() => onRead(i)} className="text-xs text-[var(--home-muted)] [writing-mode:vertical-rl] whitespace-nowrap hover:text-[var(--home-ink)]">
                        {e.title}
                      </button>
                    </th>
                  ))}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {map.surahs.map(({ surah, name }) => (
              <tr key={surah} className="h-9 border-b border-[var(--home-rule)]/50">
                <th scope="row" className="sticky start-0 z-10 bg-[var(--home-paper)] pe-3 text-start text-sm font-normal whitespace-nowrap">{name}</th>
                {groups.map((g, k) => (
                  <Fragment key={g.name}>
                    {k > 0 && <td aria-hidden />}
                    {g.events.map(({ e, i }) => {
                      const here = map.places[i].find(p => p.surah === surah);
                      const on = picked?.event === i && picked.surah === surah;
                      const size = here ? dotSize(here.count, map.most, SMALLEST, LARGEST) : 0;
                      return (
                        <td key={e.n} className={`${CELL} text-center`}>
                          {here && (
                            <button
                              type="button"
                              data-dot
                              aria-label={`${e.title}، ${name}، ${counted(here.count, ['آية', 'آيتان', 'آيات'])}`}
                              aria-expanded={on}
                              aria-haspopup="dialog"
                              aria-controls={on ? 'place-card' : undefined}
                              onClick={ev => pick(i, surah, ev.currentTarget)}
                              className="inline-flex size-8 items-center justify-center rounded-full align-middle focus-visible:outline-2 focus-visible:outline-[var(--home-ink)]"
                            >
                              <span
                                className={`block rounded-full transition-transform hover:scale-110 ${on ? 'outline-[3px] outline-offset-2 outline-[var(--home-ink)]' : ''}`}
                                style={{ width: size, height: size, background: groupColor(g.phase), outlineStyle: on ? 'solid' : undefined }}
                              />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {picked && place && (sheet ? (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <PlaceCard card={card} event={events[picked.event]} place={place} places={map.places[picked.event]} sheet onClose={dismiss} onRead={() => { setPicked(undefined); onRead(picked.event, picked.surah); }} />
        </div>
      ) : (
        <div className="absolute z-30" style={{ top: picked.y, left: Math.max(0, Math.min(width - 288, picked.x - 144)) }}>
          <PlaceCard card={card} event={events[picked.event]} place={place} places={map.places[picked.event]} sheet={false} onClose={dismiss} onRead={() => { setPicked(undefined); onRead(picked.event, picked.surah); }} />
        </div>
      ))}
    </div>
  );
}
