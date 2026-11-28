import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import land from '@shared/data/battles/land.json';
import { frameOf, landPath, PIN_JOIN, pinsOf, placeLabels, projector, type Box, type LonLat } from '@shared/battles/map';
import { LANDMARKS, PLACES } from '@shared/battles/places';
import type { Palette } from '@/lib/theme';
import TapRow from '@/ui/TapRow';
import { MIN_TAP } from '@/ui/tapSize';
import { num } from '@shared/quran/arabicNumber';

/** A battle map's height over its width, so a page can keep its room before it is drawn. */
export const MAP_ASPECT = 0.85;
const ASPECT = MAP_ASPECT;
/** How far from a battle (in degrees) a well-known city still shows beside it. */
const NEAR = 7;

/**
 * How a pin is drawn: `lit` in the accent with its name (the default), `quiet` a small muted dot with no name (the atlas's
 * earlier years), `choice` an ink dot with no name (a «أين كانت؟» question before its answer), `selected` that dot framed,
 * `right` green and named, `wrong` the accent framed and named (a question once answered).
 */
export type PinLook = 'lit' | 'quiet' | 'choice' | 'selected' | 'right' | 'wrong';
/** How far each pin's drawing reaches, its halo included, so no name is laid over it. */
const HALO: Record<PinLook, number> = { lit: 16, right: 16, selected: 15, wrong: 15, choice: 8, quiet: 6 };
export type MapPlace = { name: string; at: LonLat; look?: PinLook };

/**
 * A battle's place on a still map in the app's colours (owner, 2026-11-18: no map service). The well-known cities near
 * it (Madinah and Makkah in the Hijaz, Damascus and Jerusalem in al-Sham) stay on the map, so the reader can tell where it was.
 * With several `places` (owner, 2026-11-22: a year's battles on one map) each gets a pin, and places too close to tell apart
 * share one (`pinsOf`); the names are laid out so none covers another or a pin (owner, 2026-11-23; `placeLabels`).
 * The atlas gives a fixed `box`, so the map stays still while its pins change, and `onPin` for a tap on a pin, with the
 * names that pin holds.
 */
export default function BattleMap({ places: given, palette, box: fixed, onPin }: {
  places: readonly MapPlace[]; palette: Palette; box?: Box; onPin?: (names: string[]) => void;
}) {
  const [width, setWidth] = useState(0);
  // A caller's new array of the same places keeps the drawing.
  const key = given.map(place => `${place.name}@${place.at.join(',')}@${place.look ?? ''}`).join('|');
  const places = useMemo(() => given, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const cities = useMemo(() => {
    const near = (city: { at: LonLat }) => places.some(place => Math.hypot(place.at[0] - city.at[0], place.at[1] - city.at[1]) < NEAR);
    // A city a lit pin names is that pin; one a quiet pin names stays a city with its name, the quiet dot on it.
    const pinned = (city: { name: string }) => places.some(place => place.name === city.name && place.look !== 'quiet');
    return LANDMARKS.map(key => PLACES[key]).filter(city => !pinned(city) && near(city));
  }, [places]);
  const boxKey = fixed?.join(',');
  const drawing = useMemo(() => {
    if (!width) return null;
    const box = fixed ?? frameOf([...places.map(place => place.at), ...cities.map(city => city.at)], ASPECT);
    const { height, at } = projector(box, width);
    // Pins of one look join; a lit pin never takes a quiet one's name. The lit and answered come first, so their names get the room.
    const order: PinLook[] = ['right', 'wrong', 'lit', 'selected', 'choice', 'quiet'];
    const pins = order.flatMap(look => pinsOf(places.filter(place => (place.look ?? 'lit') === look)
      .map(place => { const [x, y] = at(place.at); return { name: place.name, x, y }; }), PIN_JOIN).map(pin => ({ ...pin, look })))
      // A quiet pin under a lit one would cover it: the lit pin stands for the place.
      .filter((pin, _, all) => pin.look !== 'quiet' || all.every(other => other.look === 'quiet' || Math.hypot(other.x - pin.x, other.y - pin.y) >= PIN_JOIN));
    const shown = cities.map(city => { const [x, y] = at(city.at); return { name: city.name, x, y }; });
    const named = (look: PinLook) => look === 'lit' || look === 'right' || look === 'wrong';
    const labels = placeLabels([
      ...pins.map(pin => ({ x: pin.x, y: pin.y, text: named(pin.look) ? pin.name : '', size: 16, r: HALO[pin.look] })),
      ...shown.map(city => ({ x: city.x, y: city.y, text: city.name, size: 14, r: 4 })),
    ], width, height);
    return {
      height, d: landPath(land as unknown as LonLat[][], box, width),
      pins: pins.map((pin, i) => ({ ...pin, label: named(pin.look) ? labels[i] : null })),
      cities: shown.map((city, i) => ({ ...city, label: labels[pins.length + i] })),
    };
  }, [width, places, cities, boxKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const label = (at: { x: number; y: number; anchor: 'start' | 'middle' | 'end' }, text: string, size: number) => {
    const where = { x: at.x, y: at.y, fontSize: size, textAnchor: at.anchor, fontFamily: 'Amiri' };
    // The paper-coloured outline first, under the letters, so a name stays readable over a coast.
    return (
      <G>
        <SvgText {...where} fill={palette.paper} stroke={palette.paper} strokeWidth={4}>{text}</SvgText>
        <SvgText {...where} fill={palette.ink}>{text}</SvgText>
      </G>
    );
  };
  const dot = (look: PinLook, x: number, y: number) => {
    switch (look) {
      case 'quiet': return <Circle cx={x} cy={y} r={5} fill={palette.muted} stroke={palette.paper} strokeWidth={2} />;
      case 'choice': return <Circle cx={x} cy={y} r={7.5} fill={palette.ink} stroke={palette.paper} strokeWidth={2} />;
      case 'selected': return <G>
        <Circle cx={x} cy={y} r={15} fill="none" stroke={palette.accent} strokeWidth={2} />
        <Circle cx={x} cy={y} r={7.5} fill={palette.accent} stroke={palette.paper} strokeWidth={2} />
      </G>;
      case 'right': return <G>
        <Circle cx={x} cy={y} r={16} fill={palette.green} fillOpacity={0.25} />
        <Circle cx={x} cy={y} r={8.5} fill={palette.green} stroke={palette.paper} strokeWidth={2} />
      </G>;
      case 'wrong': return <G>
        <Circle cx={x} cy={y} r={15} fill="none" stroke={palette.accent} strokeWidth={1.5} strokeDasharray="4 4" />
        <Circle cx={x} cy={y} r={7.5} fill={palette.accent} stroke={palette.paper} strokeWidth={2} />
      </G>;
      default: return <G>
        <Circle cx={x} cy={y} r={16} fill={palette.accent} fillOpacity={0.2} />
        <Circle cx={x} cy={y} r={7.5} fill={palette.accent} stroke={palette.paper} strokeWidth={2} />
      </G>;
    }
  };
  return (
    <View onLayout={event => setWidth(Math.round(event.nativeEvent.layout.width))} style={{ width: '100%' }}
      accessibilityRole="image" accessibilityLabel={`خريطة: ${places.filter(place => place.look !== 'choice' && place.look !== 'selected').map(place => place.name).join('، ')}`}>
      {drawing && (
        <Svg width={width} height={drawing.height} style={{ direction: 'ltr' }}>
          <Rect width={width} height={drawing.height} fill={palette.paper} />
          <Path d={drawing.d} fill={palette.card} stroke={palette.rule} strokeOpacity={0.6} strokeWidth={0.8} fillRule="evenodd" />
          {drawing.cities.map(({ name, x, y, label: at }) => (
            <G key={name}>
              <Rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={palette.ink} />
              {at && label(at, name, 14)}
            </G>
          ))}
          {/* The quiet pins first, under the rest; the names were laid out in the opposite order, the lit first. */}
          {[...drawing.pins].reverse().map(({ name, x, y, look, label: at }) => (
            <G key={`${look}:${name}`}>
              {dot(look, x, y)}
              {at && label(at, name, 16)}
            </G>
          ))}
        </Svg>
      )}
      {/* Each pin a finger-sized button over the drawing; a choice is named by its number in the list only, so it tells nothing. */}
      {drawing && onPin && drawing.pins.map(({ name, x, y, look }) => (
        <TapRow key={`${look}:${name}`} onPress={() => onPin(name.split('، '))}
          label={look === 'choice' || look === 'selected' ? `موضع ${num(places.findIndex(place => place.name === name.split('، ')[0]) + 1)}` : name} selected={look === 'choice' || look === 'selected' ? look === 'selected' : undefined}
          style={{ position: 'absolute', left: x - MIN_TAP / 2, top: y - MIN_TAP / 2, width: MIN_TAP, height: MIN_TAP }} />
      ))}
    </View>
  );
}
