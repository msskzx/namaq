import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { num } from '@shared/quran/arabicNumber';
import { DOT_NAMES, legendKinds, MADINAH_YEARS, yearLabel, type DotKind, type TimelineYear } from '@shared/battles/timeline';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import RowScroll from '@/ui/RowScroll';
import { MIN_TAP } from '@/ui/tapSize';
import type { Palette } from '@/lib/theme';

const DOT = 8;
const STEP = DOT + 3;
/** Room between the lowest dot and the axis. */
const ABOVE_AXIS = 6;
/** The dotted stretch where years are skipped. */
const SKIP = 28;

/** A battle's dot: filled for a غزوة, a ring for a سرية, a quiet filled dot for a later معركة; `size` across. */
export function DotShape({ kind, palette, cx, cy, size = DOT }: { kind: DotKind; palette: Palette; cx: number; cy: number; size?: number }) {
  const color = kind === 'battle' ? palette.muted : palette.accent;
  return <Circle cx={cx} cy={cy} r={size / 2 - 0.75} fill={kind === 'sariyyah' ? 'none' : color} stroke={color} strokeWidth={1.5} />;
}

/**
 * One year: its battles stacked above the axis, the year under it. A year with battles is the tap that brings its list group
 * up. `lit` marks the year a card is about: its number in the accent and bold.
 */
function Year({ column, height, width, lit, palette, onYear }: { column: TimelineYear; height: number; width: number; lit: boolean; palette: Palette; onYear: (year: number) => void }) {
  const drawing = (
    <>
      <Svg width={width} height={height}>
        <Line x1={0} x2={width} y1={height - 0.5} y2={height - 0.5} stroke={lit ? palette.accent : palette.rule} strokeWidth={lit ? 2 : 1} />
        {column.dots.map((dot, i) => <DotShape key={dot.slug} kind={dot.kind} palette={palette} cx={width / 2} cy={height - ABOVE_AXIS - DOT / 2 - i * STEP} />)}
      </Svg>
      <Text style={{ color: lit ? palette.accent : palette.muted, fontSize: lit ? 15 : 12, fontWeight: lit ? '700' : '400', textAlign: 'center', marginTop: 4 }}>{num(column.year)}</Text>
    </>
  );
  return column.dots.length
    ? <TapRow onPress={() => onYear(column.year)} label={yearLabel(column)} style={{ flexDirection: 'column', alignItems: 'center', width }}>{drawing}</TapRow>
    : <View style={{ width, alignItems: 'center' }}>{drawing}</View>;
}

/** How many jumps in the years an axis draws as dotted stretches. */
const skips = (columns: TimelineYear[]) => columns.filter((column, i) => i > 0 && column.year > columns[i - 1].year + 1).length;

/** Where years are skipped on an axis: the line goes on dotted, with no year under it. */
function Skip({ height, palette }: { height: number; palette: Palette }) {
  return (
    <View style={{ width: SKIP, alignItems: 'center' }} accessible={false}>
      <Svg width={SKIP} height={height}>
        <Line x1={0} x2={SKIP} y1={height - 0.5} y2={height - 0.5} stroke={palette.rule} strokeWidth={1} strokeDasharray="2 3" />
      </Svg>
    </View>
  );
}

/**
 * An axis of years, right to left, every column `width` wide (MIN_TAP at least); it scrolls sideways where the screen is
 * narrower. Where the years jump (11 to 15), a short dotted stretch stands for the skipped ones.
 */
function Axis({ columns, width = MIN_TAP, lit, palette, onYear }: { columns: TimelineYear[]; width?: number; lit?: number; palette: Palette; onYear: (year: number) => void }) {
  const height = Math.max(...columns.map(column => column.dots.length)) * STEP + ABOVE_AXIS;
  return (
    <RowScroll gap={0}>
      {columns.flatMap((column, i) => [
        ...(i > 0 && column.year > columns[i - 1].year + 1 ? [<Skip key={`skip-${column.year}`} height={height} palette={palette} />] : []),
        <Year key={column.year} column={column} height={height} width={Math.max(width, MIN_TAP)} lit={column.year === lit} palette={palette} onYear={onYear} />,
      ])}
    </RowScroll>
  );
}

/** The kinds drawn, right to left: «● غزوة ○ سرية». */
export function Legend({ kinds, palette }: { kinds: DotKind[]; palette: Palette }) {
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
 * A few years of the timeline, `lit` among them (owner, 2026-11-21; feed-visuals sketch, panel 4): the feed's card of one
 * year with the years either side, drawn as the battles screen draws them, the columns sharing `width`.
 */
export function BattleYears({ columns, lit, width, palette, onYear }: { columns: TimelineYear[]; lit: number; width: number; palette: Palette; onYear: (year: number) => void }) {
  return (
    <View style={{ gap: 10 }}>
      {/* A slice of the later years shows none of the Madinah years, so it says where it stands. */}
      {lit > MADINAH_YEARS && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>بعد السنة {num(MADINAH_YEARS)}</Text>}
      <Axis columns={columns} width={Math.floor((width - skips(columns) * SKIP) / columns.length)} lit={lit} palette={palette} onYear={onYear} />
      <Legend kinds={legendKinds(columns)} palette={palette} />
    </View>
  );
}
