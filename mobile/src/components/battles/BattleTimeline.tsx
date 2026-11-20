import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { num } from '@shared/quran/arabicNumber';
import { DOT_NAMES, legendKinds, yearLabel, type DotKind, type TimelineYear } from '@shared/battles/timeline';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import RowScroll from '@/ui/RowScroll';
import { MIN_TAP } from '@/ui/tapSize';
import type { Palette } from '@/lib/theme';

const DOT = 8;
const STEP = DOT + 3;
/** Room between the lowest dot and the axis. */
const ABOVE_AXIS = 6;

/** A battle's dot: filled for a غزوة, a ring for a سرية, a quiet filled dot for a later معركة. */
function DotShape({ kind, palette, cx, cy }: { kind: DotKind; palette: Palette; cx: number; cy: number }) {
  const color = kind === 'battle' ? palette.muted : palette.accent;
  return <Circle cx={cx} cy={cy} r={DOT / 2 - 0.75} fill={kind === 'sariyyah' ? 'none' : color} stroke={color} strokeWidth={1.5} />;
}

/** One year: its battles stacked above the axis, the year under it. A year with battles is the tap that brings its list group up. */
function Year({ column, height, palette, onYear }: { column: TimelineYear; height: number; palette: Palette; onYear: (year: number) => void }) {
  const drawing = (
    <>
      <Svg width={MIN_TAP} height={height}>
        <Line x1={0} x2={MIN_TAP} y1={height - 0.5} y2={height - 0.5} stroke={palette.rule} strokeWidth={1} />
        {column.dots.map((dot, i) => <DotShape key={dot.slug} kind={dot.kind} palette={palette} cx={MIN_TAP / 2} cy={height - ABOVE_AXIS - DOT / 2 - i * STEP} />)}
      </Svg>
      <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 4 }}>{num(column.year)}</Text>
    </>
  );
  return column.dots.length
    ? <TapRow onPress={() => onYear(column.year)} label={yearLabel(column)} style={{ flexDirection: 'column', alignItems: 'center', width: MIN_TAP }}>{drawing}</TapRow>
    : <View style={{ width: MIN_TAP, alignItems: 'center' }}>{drawing}</View>;
}

/** An axis of years, right to left, every column MIN_TAP wide; it scrolls sideways where the screen is narrower. */
function Axis({ columns, palette, onYear }: { columns: TimelineYear[]; palette: Palette; onYear: (year: number) => void }) {
  const height = Math.max(...columns.map(column => column.dots.length)) * STEP + ABOVE_AXIS;
  return (
    <RowScroll gap={0}>
      {columns.map(column => <Year key={column.year} column={column} height={height} palette={palette} onYear={onYear} />)}
    </RowScroll>
  );
}

/** The kinds drawn, right to left: «● غزوة ○ سرية». */
function Legend({ kinds, palette }: { kinds: DotKind[]; palette: Palette }) {
  return (
    <View style={{ direction: 'ltr', flexDirection: 'row-reverse', gap: 14 }}>
      {kinds.map(kind => (
        <View key={kind} style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 5 }}>
          <Svg width={DOT} height={DOT}><DotShape kind={kind} palette={palette} cx={DOT / 2} cy={DOT / 2} /></Svg>
          <Text style={{ color: palette.muted, fontSize: 13 }}>{DOT_NAMES[kind]}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * The battles drawn over the years (owner, 2026-11-20; layout-cleanup sketch, panel 5): the Prophet's ﷺ years in Madinah
 * on one axis, the later battles on a second by their own years. Laid out by `battleTimeline` (shared/battles/timeline.ts),
 * as on the website's /battles. A tap on a year hands it to `onYear`; the list under the drawing opens each battle.
 */
export default function BattleTimeline({ madinah, after, palette, onYear }: { madinah: TimelineYear[]; after: TimelineYear[]; palette: Palette; onYear: (year: number) => void }) {
  return (
    <View style={{ gap: 10 }}>
      <Axis columns={madinah} palette={palette} onYear={onYear} />
      {after.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>بعد السنة {num(madinah.length)}</Text>
          <Axis columns={after} palette={palette} onYear={onYear} />
        </View>
      )}
      <Legend kinds={legendKinds([...madinah, ...after])} palette={palette} />
    </View>
  );
}
