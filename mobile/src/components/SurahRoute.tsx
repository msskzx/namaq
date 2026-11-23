import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { surahRoute } from '@shared/quran/surahRoute';
import type { Palette } from '@/lib/theme';

const HEIGHT = 30;
const LINE = 6;
const SIDE = 10;

/**
 * «مسار السورة» (owner, 2026-11-23, sketch quran-design/ayah-page): the surah's sections as stops on one line from its
 * first ayah on the right, their parts as ticks, the stretch the ayah falls in and the ayah itself in the accent; above
 * it which section of how many, under it the stretch's title in the book's words and its ayat.
 */
export default function SurahRoute({ surah, ayah, count, palette }: { surah: number; ayah: number; count: number; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const route = surahRoute(surah, ayah, count);
  if (!route) return null;
  const x = (at: number) => width - SIDE - at * (width - 2 * SIDE);
  const mid = HEIGHT / 2;
  const { here } = route;
  const range = here && (here.from === here.to ? num(here.from) : `${num(here.from)}–${num(here.to)}`);
  return (
    <View style={{ gap: 6 }} accessible accessibilityLabel={`الآية ${num(ayah)} من ${num(count)}، في القسم ${num(route.section + 1)} من ${num(route.sections)}${here ? `: ${here.title}` : ''}`}>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`القسم ${num(route.section + 1)} من ${num(route.sections)} · ${route.stops[route.section]?.title ?? ''}`}</Text>
      <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ height: HEIGHT }}>
        {width > 0 && (
          <Svg width={width} height={HEIGHT}>
            <Line x1={x(0)} x2={x(1)} y1={mid} y2={mid} stroke={`${palette.rule}66`} strokeWidth={LINE} strokeLinecap="round" />
            <Line x1={x(0)} x2={x(route.at)} y1={mid} y2={mid} stroke={palette.rule} strokeWidth={LINE} strokeLinecap="round" />
            {route.ticks.map((at, i) => <Line key={i} x1={x(at)} x2={x(at)} y1={mid - LINE} y2={mid + LINE} stroke={palette.paper} strokeWidth={2} />)}
            {here && <Line x1={x(here.at)} x2={x(here.end)} y1={mid} y2={mid} stroke={palette.accent} strokeWidth={LINE} strokeLinecap="round" />}
            {route.stops.map((stop, i) => stop && (
              <Rect key={i} x={x(stop.at) - 6} y={mid - 8} width={12} height={16} rx={6} fill={palette.card} stroke={i === route.section ? palette.accent : palette.ink} strokeWidth={2} />
            ))}
            <Circle cx={x(route.at)} cy={mid} r={8} fill={palette.accent} stroke={palette.card} strokeWidth={3} />
          </Svg>
        )}
      </View>
      {here && (
        <Text style={{ textAlign: 'right' }}>
          <Text style={{ color: palette.accent, fontSize: 17 }}>{here.title}</Text>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{`  ${range}`}</Text>
        </Text>
      )}
    </View>
  );
}
