import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

// docs/plans/quran-oaths-and-order-juz-26.md
const DOT_Y = 31;

export type RailColor = { bg: string; text: string; badge: string };
export type RailSpan = { id: string; first: number; last: number; has: Set<number> };

export const RAIL_COLORS: RailColor[] = [
  { bg: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400', badge: 'border-sky-500 bg-sky-50 dark:bg-sky-950' },
  { bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', badge: 'border-rose-500 bg-rose-50 dark:bg-rose-950' },
  { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' },
  { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', badge: 'border-amber-500 bg-amber-50 dark:bg-amber-950' },
  { bg: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', badge: 'border-violet-500 bg-violet-50 dark:bg-violet-950' },
  { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', badge: 'border-orange-500 bg-orange-50 dark:bg-orange-950' },
  { bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400', badge: 'border-teal-500 bg-teal-50 dark:bg-teal-950' },
  { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600 dark:text-fuchsia-400', badge: 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950' },
  { bg: 'bg-lime-500', text: 'text-lime-600 dark:text-lime-400', badge: 'border-lime-500 bg-lime-50 dark:bg-lime-950' },
  { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', badge: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' },
  { bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', badge: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950' },
  { bg: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400', badge: 'border-pink-500 bg-pink-50 dark:bg-pink-950' },
];

export function RailCell({ span, n, color, label }: { span: RailSpan; n: number; color: RailColor; label: string }) {
  const { id, first, last, has } = span;
  return (
    <span data-rail-cell={id} className="relative self-stretch w-2.5 sm:w-3.5 shrink-0">
      {n > first && n < last && <span data-line="full" className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 ${color.bg}`} />}
      {n === first && n < last && <span data-line="below" className={`absolute bottom-0 left-1/2 w-0.5 -translate-x-1/2 ${color.bg}`} style={{ top: DOT_Y }} />}
      {n === last && n > first && <span data-line="above" className={`absolute top-0 left-1/2 w-0.5 -translate-x-1/2 ${color.bg}`} style={{ height: DOT_Y }} />}
      {has.has(n) && (
        <span data-dot={id} className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${color.bg}`} style={{ top: DOT_Y - 5 }}>
          <span className="sr-only">{label}</span>
        </span>
      )}
      {n === last && (
        <FontAwesomeIcon icon={faArrowDown} data-arrow={id} aria-hidden className={`absolute left-1/2 -translate-x-1/2 text-[9px] ${color.text}`} style={{ top: DOT_Y + 6 }} />
      )}
    </span>
  );
}
