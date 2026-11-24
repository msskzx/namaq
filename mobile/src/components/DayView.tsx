import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { Text } from '@/ui/Text';
import { ALL, clock, dayDigits, PRAYER_NAMES, type PrayerDay, type PrayerKey } from '@shared/prayer';
import { DAY_MINUTES, dayMinute, dialAngle, dialArc, lineRows, moonPath, onCircle } from '@shared/dayDial';
import { inMinutes } from '@shared/homeFeed';
import { DAY_SKY, type Palette } from '@/lib/theme';

const known = (date: Date) => !Number.isNaN(date.getTime());

type Next = { key: PrayerKey; at: Date; left: number };

/** The next prayer's name, time and the time left, read out as one line. */
const nextLabel = (next: Next) => `الصلاة التالية ${PRAYER_NAMES[next.key]} ${clock(next.at, true)}، ${inMinutes(next.left)}`;

/**
 * The day as a 24-hour dial (owner, 2026-11-24): noon on top, the day an amber arc from sunrise to maghrib, the dawn and
 * dusk light grey, each prayer a point at its time, a dashed hand at the moment, and the next prayer in the middle.
 */
export function DayDial({ times, now, next, palette }: { times: PrayerDay; now: Date; next: Next; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const size = Math.min(width, 340);
  const r = size / 2 - 44;
  const m = (key: PrayerKey) => dayMinute(times[key]);
  const arc = (from: PrayerKey, to: PrayerKey, color: string) =>
    known(times[from]) && known(times[to]) ? <Path d={dialArc(m(from), m(to), r)} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" /> : null;
  // The moment as a short dashed hand near the rim, clear of the next prayer in the middle.
  const [hx, hy] = onCircle(dialAngle(dayMinute(now)), r - 26);
  const [tx, ty] = onCircle(dialAngle(dayMinute(now)), r - 62);
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ alignSelf: 'stretch', alignItems: 'center' }}>
      {size > 0 && (
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} accessible={false}>
            <Circle r={r} stroke={`${palette.rule}44`} strokeWidth={14} fill="none" />
            {arc('fajr', 'sunrise', DAY_SKY.twilight)}
            {arc('sunrise', 'maghrib', palette.amber)}
            {arc('maghrib', 'isha', DAY_SKY.twilight)}
            {Array.from({ length: 24 }, (_, h) => {
              const [x1, y1] = onCircle(dialAngle(h * 60), r - 12);
              const [x2, y2] = onCircle(dialAngle(h * 60), r - (h % 6 ? 17 : 22));
              return <Line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.rule} strokeWidth={h % 6 ? 1 : 2} />;
            })}
            <Line x1={tx} y1={ty} x2={hx} y2={hy} stroke={palette.muted} strokeWidth={2} strokeDasharray="3 4" />
            <Circle cx={hx} cy={hy} r={4} fill={palette.muted} />
            {ALL.filter(key => known(times[key])).map(key => {
              const on = key === next.key;
              const [x, y] = onCircle(dialAngle(m(key)), r);
              const [lx, ly] = onCircle(dialAngle(m(key)), r + 28);
              const color = on ? palette.accent : palette.ink;
              return [
                <Circle key={`${key}-dot`} cx={x} cy={y} r={on ? 8 : 5} fill={color} stroke={palette.card} strokeWidth={3} />,
                <SvgText key={`${key}-name`} x={lx} y={ly + 5} fontSize={15} fill={color} textAnchor="middle" fontFamily="Amiri">{PRAYER_NAMES[key]}</SvgText>,
              ];
            })}
          </Svg>
          <View accessible accessibilityLabel={nextLabel(next)} style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: palette.accent, fontSize: 22, lineHeight: 30 }}>{PRAYER_NAMES[next.key]}</Text>
            <Text style={{ color: palette.ink, fontSize: 34, lineHeight: 44 }}>{clock(next.at, true)}</Text>
            <Text style={{ color: palette.muted, fontSize: 15 }}>{inMinutes(next.left)}</Text>
          </View>
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
        {[[palette.amber, 'النهار'], [DAY_SKY.twilight, 'الفجر والشفق']].map(([color, name]) => (
          <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 14, height: 5, backgroundColor: color }} />
            <Text style={{ color: palette.muted, fontSize: 13 }}>{name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** The six times under the dial, three to a row, each with its bell, so the exact minute and the adhan switch are a glance away. */
export function TimeCells({ times, next, palette, bell }: { times: PrayerDay; next: Next; palette: Palette; bell: (key: PrayerKey) => React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {ALL.map(key => {
        const on = key === next.key;
        const color = on ? palette.accent : palette.ink;
        return (
          <View key={key} style={{ flexBasis: '31%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 4 }}>
            <View accessible accessibilityState={{ selected: on }} accessibilityLabel={`${PRAYER_NAMES[key]} ${clock(times[key], true)}${on ? '، التالية' : ''}`} style={{ flex: 1 }}>
              <Text style={{ color: on ? palette.accent : palette.muted, fontSize: 14 }}>{PRAYER_NAMES[key]}</Text>
              <Text style={{ color, fontSize: 17 }}>{clock(times[key], true)}</Text>
            </View>
            {bell(key)}
          </View>
        );
      })}
    </View>
  );
}

const LINE = 480;
const ROW = 34;

/**
 * The day as a line from midnight down to midnight (owner, 2026-11-24): the sky's colour by the hour beside it, each time
 * at its place on the line (pushed apart only where two would touch), and a dashed line at the moment with the time left.
 */
export function DayLine({ times, now, next, palette, bell }: { times: PrayerDay; now: Date; next: Next; palette: Palette; bell: (key: PrayerKey) => React.ReactNode }) {
  const keys = ALL.filter(key => known(times[key]));
  const rows = lineRows(keys.map(key => dayMinute(times[key])), LINE - ROW, ROW);
  const at = (key: PrayerKey) => known(times[key]) ? dayMinute(times[key]) / DAY_MINUTES : null;
  // The sky's stops: night, the dawn light from fajr to sunrise, day to maghrib, the dusk light to isha, night.
  const stops: [number | null, string][] = [[at('fajr'), DAY_SKY.night], [at('sunrise'), DAY_SKY.glow], [at('sunrise'), DAY_SKY.day], [at('maghrib'), DAY_SKY.day], [at('maghrib'), DAY_SKY.glow], [at('isha'), DAY_SKY.night]];
  const nowY = (dayMinute(now) / DAY_MINUTES) * LINE;
  return (
    <View style={{ flexDirection: 'row', gap: 14, height: LINE }}>
      <Svg width={22} height={LINE} accessible={false}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            {[[0, DAY_SKY.night] as const, ...stops.filter((stop): stop is [number, string] => stop[0] !== null), [1, DAY_SKY.night] as const]
              .map(([offset, color], i) => <Stop key={i} offset={offset} stopColor={color} />)}
          </LinearGradient>
        </Defs>
        <Rect width={22} height={LINE} rx={11} fill="url(#sky)" />
      </Svg>
      <View style={{ flex: 1 }}>
        {keys.map((key, i) => {
          const on = key === next.key;
          const color = on ? palette.accent : palette.ink;
          return (
            <View key={key} style={{ position: 'absolute', top: rows[i], left: 0, right: 0, height: ROW, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View accessible accessibilityState={{ selected: on }} accessibilityLabel={`${PRAYER_NAMES[key]} ${clock(times[key], true)}${on ? '، التالية' : ''}`}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color, fontSize: 18 }}>{PRAYER_NAMES[key]}</Text>
                <Text style={{ color, fontSize: 18 }}>{clock(times[key], true)}</Text>
              </View>
              {bell(key)}
            </View>
          );
        })}
        <View accessible accessibilityLabel={nextLabel(next)} style={{ position: 'absolute', top: nowY, left: 0, right: -36, borderTopWidth: 2, borderStyle: 'dashed', borderColor: palette.accent }}>
          <Text style={{ position: 'absolute', top: -1, right: 36, backgroundColor: palette.card, paddingHorizontal: 4, color: palette.accent, fontSize: 13 }}>
            الآن · {PRAYER_NAMES[next.key]} {inMinutes(next.left)}
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * The Hijri month as its moons (owner, 2026-11-24, under the qibla): each day's moon drawn from its number, the days gone
 * faded and today ringed. `days` is the month's length; `today` its day, or null on a phone without the Hijri calendar.
 */
export function MonthMoons({ days, today, palette }: { days: number; today: number; palette: Palette }) {
  const R = 9;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', rowGap: 6 }}>
      {Array.from({ length: days }, (_, i) => i + 1).map(day => {
        const on = day === today;
        return (
          <View key={day} style={{ width: '10%', alignItems: 'center', opacity: day < today ? 0.45 : 1 }}>
            <Svg width={2 * R + 4} height={2 * R + 4} viewBox={`${-R - 2} ${-R - 2} ${2 * R + 4} ${2 * R + 4}`}>
              <Circle r={R} fill={palette.paperDeep} stroke={on ? palette.accent : 'none'} strokeWidth={2} />
              <Path d={moonPath(day, R - (on ? 1 : 0))} fill={palette.amber} />
            </Svg>
            <Text style={{ color: on ? palette.accent : palette.muted, fontSize: on ? 13 : 11 }}>{dayDigits(day)}</Text>
          </View>
        );
      })}
    </View>
  );
}
