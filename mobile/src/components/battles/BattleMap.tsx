import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import land from '@shared/data/battles/land.json';
import { frameOf, landPath, projector, type LonLat } from '@shared/battles/map';
import { LANDMARKS, PLACES } from '@shared/battles/places';
import type { Palette } from '@/lib/theme';

const ASPECT = 0.85;
/** How far from a battle (in degrees) a well-known city still shows beside it. */
const NEAR = 7;

/**
 * A battle's place on a still map in the app's colours (owner, 2026-11-18: no map service). The well-known cities near
 * it (Madinah and Makkah in the Hijaz, Damascus and Jerusalem in al-Sham) stay on the map, so the reader can tell where it was.
 */
export default function BattleMap({ place, palette }: { place: { name: string; at: LonLat }; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const cities = useMemo(() => {
    const near = (city: { at: LonLat }) => Math.hypot(place.at[0] - city.at[0], place.at[1] - city.at[1]) < NEAR;
    return LANDMARKS.map(key => PLACES[key]).filter(city => city.name !== place.name && near(city));
  }, [place]);
  const drawing = useMemo(() => {
    if (!width) return null;
    const box = frameOf([place.at, ...cities.map(city => city.at)], ASPECT);
    const { height, at } = projector(box, width);
    return { height, d: landPath(land as unknown as LonLat[][], box, width), at };
  }, [width, place, cities]);
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
      accessibilityRole="image" accessibilityLabel={`خريطة: ${place.name}`}>
      {drawing && (
        <Svg width={width} height={drawing.height} style={{ direction: 'ltr' }}>
          <Rect width={width} height={drawing.height} fill={palette.paper} />
          <Path d={drawing.d} fill={palette.card} stroke={palette.rule} strokeOpacity={0.6} strokeWidth={0.8} fillRule="evenodd" />
          {cities.map(city => {
            const [x, y] = drawing.at(city.at);
            return (
              <G key={city.name}>
                <Rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={palette.ink} />
                {label(x, y, city.name, 14)}
              </G>
            );
          })}
          {(() => {
            const [x, y] = drawing.at(place.at);
            return (
              <>
                <Circle cx={x} cy={y} r={16} fill={palette.accent} fillOpacity={0.2} />
                <Circle cx={x} cy={y} r={7.5} fill={palette.accent} stroke={palette.paper} strokeWidth={2} />
                {label(x, y, place.name, 16)}
              </>
            );
          })()}
        </Svg>
      )}
    </View>
  );
}
