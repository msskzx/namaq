'use client';

import { Fragment } from 'react';
import { Check, CircleHelp, X } from 'lucide-react';
import { placeState } from './PlaceReview';
import { counted } from '@shared/quran/arabicNumber';
import { placeKeyOf, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { dotSize, type EventView, type StoryMap as StoryMapData } from '@shared/quran/prophets/story';

export const groupColor = (phase: number) => `var(--story-${phase % 5})`;

/** On the owner's review: dropped and drafted-to-drop dots are rings, and a small mark says what the owner chose. */
export type StoryReview = { slug: string; verdicts: PlaceVerdicts };

const SMALLEST = 7;
const LARGEST = 28;
const CELL = 'w-[2.375rem] min-w-[2.375rem]';

/**
 * The story as a grid: a column for each event under its group's colour, a row for each surah.
 * A dot's size is how many ayat that surah gives the event; tapping it opens the event's ayat at that surah.
 */
export default function StoryMap({ map, events, phases, onRead, current, review, only }: {
  review?: StoryReview;
  current?: { event: number; surah?: number };
  map: StoryMapData;
  events: EventView[];
  phases: readonly string[];
  onRead: (event: number, surah?: number) => void;
  /** One group only (the home feed's card), by its phase: drawn in its card, with no sideways scroll. */
  only?: number;
}) {
  const groups = phases.map((name, phase) => ({ name, phase, events: events.map((e, i) => ({ e, i })).filter(({ e }) => e.phase === phase) }))
    .filter(g => g.events.length > 0 && (only === undefined || g.phase === only));

  return (
    <div className={only === undefined ? '-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10' : 'pb-2'}>
        <table className="border-collapse" aria-label="أحداث القصة في السور">
          <thead>
            <tr>
              <th className="sticky start-0 z-10 bg-[var(--story-map-bg,var(--home-paper))]" />
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
              <th className="sticky start-0 z-10 bg-[var(--story-map-bg,var(--home-paper))]" />
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
                <th scope="row" className="sticky start-0 z-10 bg-[var(--story-map-bg,var(--home-paper))] pe-3 text-start text-sm font-normal whitespace-nowrap">{name}</th>
                {groups.map((g, k) => (
                  <Fragment key={g.name}>
                    {k > 0 && <td aria-hidden />}
                    {g.events.map(({ e, i }) => {
                      const here = map.places[i].find(p => p.surah === surah);
                      const on = current?.event === i && current.surah === surah;
                      const size = here ? dotSize(here.count, map.most, SMALLEST, LARGEST) : 0;
                      const verdict = here && review ? review.verdicts[placeKeyOf(review.slug, here)] : undefined;
                      const ring = verdict?.keep === false;
                      const state = review ? placeState(verdict) : null;
                      return (
                        <td key={e.n} className={`${CELL} text-center`}>
                          {here && (
                            <button
                              type="button"
                              data-dot
                              aria-label={`${e.title}، ${name}، ${counted(here.count, ['آية', 'آيتان', 'آيات'])}${review ? `، ${STATE_LABEL[state ?? (ring ? 'draftDrop' : 'draftKeep')]}` : ''}`}
                              aria-current={on || undefined}
                              onClick={() => onRead(i, surah)}
                              className="inline-flex size-8 items-center justify-center rounded-full align-middle focus-visible:outline-2 focus-visible:outline-[var(--home-ink)]"
                            >
                              <span
                                className={`relative block rounded-full transition-transform hover:scale-110 ${on ? 'outline-[3px] outline-offset-2 outline-[var(--home-ink)]' : ''}`}
                                style={{ width: ring ? Math.max(size, 12) : size, height: ring ? Math.max(size, 12) : size, background: ring ? 'transparent' : groupColor(g.phase), boxShadow: ring ? `inset 0 0 0 2px ${groupColor(g.phase)}` : undefined, outlineStyle: on ? 'solid' : undefined }}
                              >
                                {state && <StateMark state={state} />}
                              </span>
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
  );
}

const STATE_LABEL = { keep: 'أبقيته', drop: 'حذفته', discuss: 'للنقاش', draftKeep: 'مسودة: إبقاء', draftDrop: 'مسودة: حذف' } as const;

/** The owner's choice on a dot, as a small badge at its corner. */
function StateMark({ state }: { state: 'keep' | 'drop' | 'discuss' }) {
  const [Icon, color, label] = ({ keep: [Check, 'var(--home-green)', 'أبقيته'], drop: [X, 'var(--home-accent)', 'حذفته'], discuss: [CircleHelp, 'var(--home-accent)', 'للنقاش'] } as const)[state];
  return (
    <span aria-hidden title={label} className="absolute -top-2.5 -end-3 flex size-3.5 items-center justify-center rounded-full bg-[var(--story-map-bg,var(--home-paper))]" style={{ color }}>
      <Icon size={11} strokeWidth={3} aria-hidden />
    </span>
  );
}
