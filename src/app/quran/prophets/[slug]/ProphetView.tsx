'use client';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBookQuran } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import AyatDisclosure from '@/components/quran/AyatDisclosure';
import { num } from '@/lib/quran/arabicNumber';
import type { EventView, SegmentView } from '@/lib/quran/prophets/story';

// docs/plans/quran-prophet-timelines.md
const STEP = 400;
const PHASE_STYLE = [
  { dot: 'bg-sky-500', line: 'bg-sky-500', bar: '!border-t-sky-500', edge: '!border-s-sky-500', text: 'text-sky-600 dark:text-sky-400' },
  { dot: 'bg-amber-500', line: 'bg-amber-500', bar: '!border-t-amber-500', edge: '!border-s-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  { dot: 'bg-rose-500', line: 'bg-rose-500', bar: '!border-t-rose-500', edge: '!border-s-rose-500', text: 'text-rose-600 dark:text-rose-400' },
  { dot: 'bg-emerald-500', line: 'bg-emerald-500', bar: '!border-t-emerald-500', edge: '!border-s-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  { dot: 'bg-violet-500', line: 'bg-violet-500', bar: '!border-t-violet-500', edge: '!border-s-violet-500', text: 'text-violet-600 dark:text-violet-400' },
];
const style = (phase: number) => PHASE_STYLE[phase % PHASE_STYLE.length];

const ref = ({ surah, name, range: [lo, hi] }: SegmentView) => `${num(surah)} ${name} ${num(lo)}${hi > lo ? `-${num(hi)}` : ''}`;

export default function ProphetView({ name, phases, events }: { name: string; phases: readonly string[]; events: EventView[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>();
  const scroll = (dir: 1 | -1) => {
    setActive(undefined);
    track.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' });
  };
  const jump = (n: number) => {
    setActive(n);
    track.current?.querySelector(`[data-event="${n}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'start' });
  };
  const ayat = events.reduce((t, e) => t + e.count, 0);
  const surahs = new Set(events.flatMap(e => e.segments.map(g => g.surah))).size;
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-wrap gap-2" aria-label="ملخص">
        <li><Badge text={`${num(events.length)} محطة`} color="amber" size="sm" /></li>
        <li><Badge text={`${num(ayat)} آية`} color="indigo" size="sm" /></li>
        <li><Badge text={`${num(surahs)} سورة`} color="emerald" size="sm" /></li>
      </ul>
      <nav aria-label="فهرس المحطات" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {phases.map((phase, ph) => {
          const inPhase = events.filter(e => e.phase === ph);
          return (
            <section key={phase} className={`flex flex-col gap-2 rounded-xl border border-s-4 border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/5 ${style(ph).edge}`}>
              <h2 className={`flex items-baseline justify-between gap-2 text-sm font-semibold ${style(ph).text}`}>
                {phase}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{`${num(inPhase.length)} محطة`}</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {inPhase.map(e => (
                  <button
                    key={e.n}
                    type="button"
                    aria-label={e.title}
                    data-active={active === e.n || undefined}
                    onClick={() => jump(e.n)}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-0.5 pe-3 ps-0.5 text-xs transition hover:border-gray-400 hover:bg-gray-100 data-active:border-amber-500 data-active:bg-amber-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/10 dark:data-active:bg-amber-900/40"
                  >
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] text-white ${style(ph).dot}`}>{num(e.n)}</span>
                    {e.title}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </nav>
      <section className="flex flex-col gap-3" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="sr-only">{`أحداث قصة ${name}`}</h2>
        <div className="flex items-center justify-between gap-2">
          <Button size="sm" onClick={() => scroll(1)}>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden />
            السابق
          </Button>
          <Button size="sm" onClick={() => scroll(-1)}>
            التالي
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
          </Button>
        </div>
        <div ref={track} className="-mx-4 overflow-x-auto px-4 pb-4 snap-x snap-proximity scroll-px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10" data-timeline-track>
          <ol className="flex w-max items-start gap-5 pt-[4.75rem]" aria-label={`أحداث قصة ${name}`}>
            {events.map((e, i) => {
              const st = style(e.phase);
              const starts = i === 0 || events[i - 1].phase !== e.phase;
              return (
                <li key={e.n} data-event={e.n} className="relative w-80 shrink-0 snap-center scroll-mt-40 sm:w-96">
                  <span aria-hidden className={`absolute -top-[2.4rem] h-1 opacity-70 ${st.line} ${i === 0 ? 'start-4' : '-start-2.5'} ${i === events.length - 1 ? 'end-[calc(100%-2.5rem)]' : '-end-2.5'}`} />
                  {starts && <span className={`absolute -top-[4.75rem] start-0 text-sm font-semibold ${st.text}`}>{phases[e.phase]}</span>}
                  <span
                    aria-hidden
                    className={`absolute -top-[3.1rem] start-4 flex h-7 w-7 items-center justify-center rounded-full text-xs text-white ring-4 ring-white dark:ring-black ${st.dot}`}
                  >
                    {num(e.n)}
                  </span>
                  <article
                    className={`flex flex-col gap-3 rounded-2xl border border-t-4 border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 ${st.bar} ${active === e.n ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    <h3 className="text-xl font-semibold leading-snug">{e.title}</h3>
                    <ul className="flex flex-wrap gap-1" aria-label="السور">
                      {[...new Set(e.segments.map(g => g.name))].map(surah => <li key={surah}><Badge text={surah} size="sm" color="gray" /></li>)}
                    </ul>
                    <div className="flex flex-col gap-2">
                      {e.segments.map(g => <AyatDisclosure key={`${g.surah}:${g.range[0]}`} title={ref(g)} lines={g.lines} />)}
                    </div>
                    <p className="flex items-center gap-1.5 pt-1 text-xs text-gray-500 dark:text-gray-400">
                      <FontAwesomeIcon icon={faBookQuran} aria-hidden />
                      {`${num(e.count)} آية في ${num(e.segments.length)} موضع`}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
