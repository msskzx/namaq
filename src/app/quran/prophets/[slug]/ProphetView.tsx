'use client';

import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import AyatDisclosure from '@/components/quran/AyatDisclosure';
import { num } from '@/lib/quran/arabicNumber';
import { PHASES, type MusaEventView, type MusaSegmentView } from '@/lib/quran/musa';

// docs/plans/quran-musa-timeline.md
const STEP = 360;
const PHASE_STYLE = [
  { dot: 'bg-sky-500 border-sky-500', bar: '!border-t-sky-500', text: 'text-sky-600 dark:text-sky-400' },
  { dot: 'bg-amber-500 border-amber-500', bar: '!border-t-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  { dot: 'bg-rose-500 border-rose-500', bar: '!border-t-rose-500', text: 'text-rose-600 dark:text-rose-400' },
  { dot: 'bg-emerald-500 border-emerald-500', bar: '!border-t-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  { dot: 'bg-violet-500 border-violet-500', bar: '!border-t-violet-500', text: 'text-violet-600 dark:text-violet-400' },
];

const ref = ({ surah, name, range: [lo, hi] }: MusaSegmentView) => `${num(surah)} ${name} ${num(lo)}${hi > lo ? `-${num(hi)}` : ''}`;

export default function MusaView({ events }: { events: MusaEventView[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' });
  const jump = (n: number) => track.current?.querySelector(`[data-event="${n}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'start' });
  const ayat = events.reduce((t, e) => t + e.count, 0);
  const surahs = new Set(events.flatMap(e => e.segments.map(g => g.surah))).size;
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-2" aria-label="ملخص">
        <li><Badge text={`${num(ayat)} آية`} color="indigo" /></li>
        <li><Badge text={`${num(surahs)} سورة`} color="emerald" /></li>
      </ul>
      <nav aria-label="فهرس المحطات" className="flex flex-col gap-2">
        {PHASES.map((name, ph) => (
          <div key={name} className="flex flex-wrap items-center gap-1.5">
            <span className={`me-1 text-sm font-semibold ${PHASE_STYLE[ph].text}`}>{name}</span>
            {events.filter(e => e.phase === ph).map(e => (
              <button
                key={e.n}
                type="button"
                aria-label={e.title}
                onClick={() => jump(e.n)}
                className={`flex items-center gap-1.5 rounded-full border border-gray-300 bg-white py-0.5 pe-3 ps-0.5 text-xs hover:bg-gray-100 dark:border-white/20 dark:bg-black dark:hover:bg-white/10`}
              >
                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] text-white ${PHASE_STYLE[ph].dot}`}>{num(e.n)}</span>
                {e.title}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => scroll(1)}>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden />
          السابق
        </Button>
        <Button size="sm" onClick={() => scroll(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
          التالي
        </Button>
      </div>
      <div ref={track} className="overflow-x-auto pb-4 snap-x snap-proximity scroll-px-4" data-timeline-track>
        <ol className="relative flex w-max items-stretch gap-4 pt-14 px-1" aria-label="أحداث قصة موسى">
          <span aria-hidden className="absolute inset-x-0 top-9 h-1 rounded bg-gradient-to-l from-sky-500 via-amber-500 via-40% to-emerald-500 opacity-60" />
          {events.map((e, i) => {
            const st = PHASE_STYLE[e.phase];
            const starts = i === 0 || events[i - 1].phase !== e.phase;
            return (
              <li key={e.n} data-event={e.n} className="relative w-80 shrink-0 snap-center scroll-mt-40">
                {starts && <span className={`absolute -top-12 start-0 text-sm font-semibold ${st.text}`}>{PHASES[e.phase]}</span>}
                <span
                  aria-hidden
                  className={`absolute -top-[2.1rem] start-4 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] ${st.dot} text-white`}
                >
                  {num(e.n)}
                </span>
                <div className={`flex h-full flex-col gap-3 rounded-xl border border-gray-200 border-t-4 bg-gray-50 p-4 shadow-sm dark:border-white/10 dark:bg-black ${st.bar}`}>
                  <h2 className="text-xl leading-snug">{e.title}</h2>
                  <ul className="flex flex-wrap gap-1" aria-label="السور">
                    {[...new Set(e.segments.map(g => g.name))].map(name => <li key={name}><Badge text={name} size="sm" color="" /></li>)}
                  </ul>
                  <div className="flex flex-col gap-2">
                    {e.segments.map(g => <AyatDisclosure key={`${g.surah}:${g.range[0]}`} title={ref(g)} lines={g.lines} />)}
                  </div>
                  <p className="mt-auto text-xs text-gray-500 dark:text-gray-400">{`${num(e.count)} آية`}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
