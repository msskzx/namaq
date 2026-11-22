import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import land from '@shared/data/battles/land.json';
import { frameOf, landPath, pinsOf, projector, type LonLat } from '@shared/battles/map';
import { LANDMARKS, PLACES } from '@shared/battles/places';
import type { Palette } from '@/lib/theme';

const ASPECT = 0.85;
/** How far from a battle (in degrees) a well-known city still shows beside it. */
const NEAR = 7;
/** Places drawn closer than this (in points) share one pin. */
const JOIN = 24;
type Place = { name: string; at: LonLat };

/**
 * A battle's place on a still map in the app's colours (owner, 2026-11-18: no map service). The well-known cities near
 * it (Madinah and Makkah in the Hijaz, Damascus and Jerusalem in al-Sham) stay on the map, so the reader can tell where it was.
 * With several `places` (owner, 2026-11-22: a year's battles on one map) each gets a pin, and places too close to tell apart
 * share one (`pinsOf`).
 */
export default function BattleMap({ places: given, palette }: { places: readonly Place[]; palette: Palette }) {
  const [width, setWidth] = useState(0);
  // A caller's new array of the same places keeps the drawing.
  const key = given.map(place => `${place.name}@${place.at.join(',')}`).join('|');
  const places = useMemo(() => given, [key]);
  const cities = useMemo(() => {
    const near = (city: { at: LonLat }) => places.some(place => Math.hypot(place.at[0] - city.at[0], place.at[1] - city.at[1]) < NEAR);
    return LANDMARKS.map(key => PLACES[key]).filter(city => places.every(place => place.name !== city.name) && near(city));
  }, [places]);
  const drawing = useMemo(() => {
    if (!width) return null;
    const box = frameOf([...places.map(place => place.at), ...cities.map(city => city.at)], ASPECT);
    const { height, at } = projector(box, width);
    const pins = pinsOf(places.map(place => { const [x, y] = at(place.at); return { name: place.name, x, y }; }), JOIN);
    const shown = cities.map(city => ({ name: city.name, xy: at(city.at) }));
    return { height, d: landPath(land as unknown as LonLat[][], box, width), pins, cities: shown };
  }, [width, places, cities]);
  const label = (x: number, y: number, text: string, size: number) => {
    const left = x > width * 0.6;
    const at = { x: left ? x - 12 : x + 12, y: y + size / 3, fontSize: size, textAnchor: left ? 'end' as const : 'start' as const, fontFamily: 'Amiri' };
    // The paper-coloured outline first, under the letters, so a name stays readable over a coast.
    return (
      <G>
        <SvgText {...at} fill={palette.paper} stroke={palette.paper} strokeWidth={4}>{text}</SvgText>
        <SvgText {...at} fill={palette.ink}>{text}</SvgText>
      </G>
    );
  };
  return (
    <View onLayout={event => setWidth(Math.round(event.nativeEvent.layout.width))} style={{ width: '100%' }}
      accessibilityRole="image" accessibilityLabel={`خريطة: ${places.map(place => place.name).join('، ')}`}>
      {drawing && (
        <Svg width={width} height={drawing.height} style={{ direction: 'ltr' }}>
          <Rect width={width} height={drawing.height} fill={palette.paper} />
          <Path d={drawing.d} fill={palette.card} stroke={palette.rule} strokeOpacity={0.6} strokeWidth={0.8} fillRule="evenodd" />
          {drawing.cities.map(({ name, xy: [x, y] }) => (
            <G key={name}>
              <Rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={palette.ink} />
              {label(x, y, name, 14)}
            </G>
          ))}
          {drawing.pins.map(({ name, x, y }) => (
            <G key={name}>
              <Circle cx={x} cy={y} r={16} fill={palette.accent} fillOpacity={0.2} />
              <Circle cx={x} cy={y} r={7.5} fill={palette.accent} stroke={palette.paper} strokeWidth={2} />
              {label(x, y, name, 16)}
            </G>
          ))}
        </Svg>
      )}
    </View>
  );
}
