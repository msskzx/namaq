import { num } from '@shared/quran/arabicNumber';
import { DOT_NAMES, legendKinds, yearAnchor, yearLabel, type DotKind, type TimelineYear } from '@shared/battles/timeline';
import TapRow from '@/components/common/TapRow';

const DOT = 8;
const STEP = DOT + 3;
/** Room between the lowest dot and the axis. */
const ABOVE_AXIS = 6;

/** A battle's dot: filled for a غزوة, a ring for a سرية, a quiet filled dot for a later معركة. */
function DotShape({ kind, cx, cy }: { kind: DotKind; cx: number | string; cy: number }) {
  const color = kind === 'battle' ? 'var(--home-muted)' : 'var(--home-accent)';
  return <circle cx={cx} cy={cy} r={DOT / 2 - 0.75} fill={kind === 'sariyyah' ? 'none' : color} stroke={color} strokeWidth={1.5} />;
}

/** One year: its battles stacked above the axis, the year under it. A year with battles links to its group in the list. */
function Year({ column, height }: { column: TimelineYear; height: number }) {
  const drawing = (
    <>
      {/* The axis is each column's bottom border, so columns of fractional widths still join into one line. */}
      <svg width="100%" height={height} aria-hidden className="block border-b border-[var(--home-rule)]">
        {column.dots.map((dot, i) => <DotShape key={dot.slug} kind={dot.kind} cx="50%" cy={height - 1 - ABOVE_AXIS - DOT / 2 - i * STEP} />)}
      </svg>
      <span className="mt-1 text-xs text-[var(--home-muted)]">{num(column.year)}</span>
    </>
  );
  return column.dots.length
    ? <TapRow href={`#${yearAnchor(column.year)}`} label={yearLabel(column)} className="flex-col justify-end">{drawing}</TapRow>
    : <div className="flex flex-col items-center justify-end">{drawing}</div>;
}

/** An axis of years, right to left, every column at least 44px wide; it scrolls sideways where the page is narrower. */
function Axis({ columns, wide }: { columns: TimelineYear[]; wide: boolean }) {
  const height = Math.max(...columns.map(column => column.dots.length)) * STEP + ABOVE_AXIS;
  return (
    <div className={`grid grid-flow-col justify-start overflow-x-auto ${wide ? 'auto-cols-[minmax(2.75rem,1fr)]' : 'auto-cols-[2.75rem]'}`}>
      {columns.map(column => <Year key={column.year} column={column} height={height} />)}
    </div>
  );
}

/**
 * The battles drawn over the years (owner, 2026-11-20; layout-cleanup sketch, panel 5), as the app's BattleTimeline: the
 * Prophet's ﷺ years in Madinah on one axis, the later battles on a second by their own years. A year links to its group
 * in the list under it (`yearAnchor`); the list opens each battle.
 */
export default function BattleTimeline({ madinah, after }: { madinah: TimelineYear[]; after: TimelineYear[] }) {
  return (
    <div dir="rtl" className="flex flex-col gap-2.5">
      <Axis columns={madinah} wide />
      {after.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[var(--home-muted)]">بعد السنة {num(madinah.length)}</span>
          <Axis columns={after} wide={false} />
        </div>
      )}
      <div className="flex gap-3.5 text-sm text-[var(--home-muted)]">
        {legendKinds([...madinah, ...after]).map(kind => (
          <span key={kind} className="flex items-center gap-1.5">
            <svg width={DOT} height={DOT} aria-hidden><DotShape kind={kind} cx={DOT / 2} cy={DOT / 2} /></svg>
            {DOT_NAMES[kind]}
          </span>
        ))}
      </div>
    </div>
  );
}
