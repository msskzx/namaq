import { Fragment, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polyline, Rect } from 'react-native-svg';
import type { AppIsnad } from '@shared/hadith';
import { isnadMetro, metroOrder, type Metro, type MetroStation } from '@shared/isnadMetro';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import { blend, type Palette } from '@/lib/theme';

// An isnad as a metro line (owner 2026-11-24, sketch hadith-design/sketch3): a station for each narrator, every station the
// same circle (the collector's filled), the line thick, the word each narrated with on the line between two stations. No
// arrowheads (owner, 2026-11-20): the order down the page and the word on each line say who heard from whom.
const R = 8;
const STROKE = 4;
const LEVEL = 112;
const TOP = 16;
const NAME_W = 100;

const routeColours = (palette: Palette) => [palette.rule, palette.path, palette.amber, palette.green];

function Dot({ station, colour, palette, size = 2 * R + 6 }: { station: MetroStation; colour: string; palette: Palette; size?: number }) {
  const fill = station.kind === 'collector' ? palette.accent : palette.card;
  const ring = station.kind === 'collector' ? palette.accent : station.kind === 'companion' ? palette.green : colour;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={R} fill={fill} stroke={ring} strokeWidth={3} />
    </Svg>
  );
}

const nameColour = (station: MetroStation, palette: Palette) => (station.kind === 'collector' ? palette.accent : station.kind === 'companion' ? palette.green : palette.ink);

/** One plain chain: the line down the right, each name beside its station, the word between two stations on the line. */
function Line({ metro, palette }: { metro: Metro; palette: Palette }) {
  const stations = [...metro.stations].sort((a, b) => a.level - b.level);
  const legTo = new Map(metro.legs.map(leg => [leg.to, leg]));
  const rail = (top: boolean, bottom: boolean) => (
    <View pointerEvents="none" style={{ position: 'absolute', right: 9 + R + 3 - STROKE / 2, width: STROKE, top: top ? 0 : '50%', bottom: bottom ? 0 : '50%', backgroundColor: palette.rule }} />
  );
  return (
    <View style={{ direction: 'ltr' }}>
      {stations.map((station, i) => {
        const leg = legTo.get(station.id);
        return (
          <Fragment key={station.id}>
            {leg && (
              <View style={{ paddingRight: 44, minHeight: 22, justifyContent: 'center' }}>
                {rail(true, true)}
                <Text style={{ color: palette.amber, fontSize: 13, textAlign: 'right' }}>{leg.words.map(word => word.label).join('، ')}</Text>
              </View>
            )}
            <View style={{ paddingRight: 44, minHeight: 32, justifyContent: 'center' }}>
              {rail(i > 0, i < stations.length - 1)}
              <View pointerEvents="none" style={{ position: 'absolute', right: 9, top: '50%', marginTop: -(R + 3) }}><Dot station={station} colour={palette.rule} palette={palette} /></View>
              <Text style={{ color: nameColour(station, palette), fontSize: 16, lineHeight: 26, textAlign: 'right' }}>{station.label}</Text>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
}

/**
 * Routes and tabaqat: each tabaqa a shaded level with its name in the left margin, its people side by side on it; each
 * route its own colour from the collector until the routes meet, then one line. Where the routes over one stretch say
 * different words, their lines run side by side there, each with its word.
 */
function RouteMap({ metro, width, palette }: { metro: Metro; width: number; palette: Palette }) {
  const colours = routeColours(palette);
  const left = NAME_W / 2;
  const right = width - NAME_W / 2;
  const x = (across: number) => (metro.cols > 1 ? right - across * (right - left) : width / 2);
  // A shaded tabaqa is a colour of its own, so a name on it is backed by the same colour where a line runs behind it.
  const shade = blend(palette.ink, palette.card, 0.05);
  const ground = (level: number) => (metro.levels[level]?.tabaqa && level % 2 === 1 ? shade : palette.card);
  const BAND = { above: 26, below: LEVEL - 34 };
  /** The colour under a point: its level's shade inside the level's band, the card between bands. */
  const groundAt = (py: number) => {
    const level = Math.floor((py - TOP + BAND.above) / LEVEL);
    return py <= y(level) + BAND.below ? ground(level) : palette.card;
  };
  const y = (level: number) => TOP + level * LEVEL;
  const height = y(metro.levels.length - 1) + (metro.levels[metro.levels.length - 1].tabaqa ? LEVEL - 30 : 64);
  const at = new Map(metro.stations.map(station => [station.id, { ...station, x: x(station.across), y: y(station.level) }]));
  const legs = metro.legs.map((leg, i) => {
    const from = at.get(leg.from)!;
    const to = at.get(leg.to)!;
    const level = from.level === to.level;
    // Between two levels the line bends, and its word stands, low: under the names and the tabaqa's own name.
    const bendFrom = from.y + 64;
    const bendTo = to.y - 16;
    const lanes = leg.words.length > 1 ? leg.words.map((word, lane) => ({ ...word, shift: (lane - (leg.words.length - 1) / 2) * (STROKE + 3) })) : [{ ...leg.words[0], route: leg.route, shift: 0 }];
    const paths = lanes.map(lane => {
      const s = lane.shift;
      const points = level ? [[from.x, from.y + s], [to.x, to.y + s]]
        : from.x === to.x ? [[from.x + s, from.y], [to.x + s, to.y]]
          : [[from.x + s, from.y], [from.x + s, bendFrom], [to.x + s, bendTo], [to.x + s, to.y]];
      return { colour: colours[lane.route % colours.length], points: points.map(point => point.join(',')).join(' ') };
    });
    const labelX = (from.x + to.x) / 2;
    const labelY = level ? from.y - 22 : (bendFrom + bendTo) / 2 - 9;
    return { i, lanes, paths, labelX, labelY, ground: groundAt(labelY + 8) };
  });
  return (
    <View style={{ width, height, direction: 'ltr' }}>
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        {metro.levels.map((level, i) => level.tabaqa && i % 2 === 1
          ? <Rect key={`b${i}`} x={0} y={y(i) - BAND.above} width={width} height={BAND.above + BAND.below} fill={shade} /> : null)}
        {legs.flatMap(leg => leg.paths.map((path, j) => (
          <Polyline key={`l${leg.i}-${j}`} points={path.points} fill="none" stroke={path.colour} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
        )))}
      </Svg>
      {/* Each tabaqa's number and Ibn Hajar's name for it, low on its own level, under its people's names. */}
      {metro.levels.map((level, i) => level.tabaqa ? (
        <Text key={`t${i}`} pointerEvents="none" numberOfLines={1} style={{ position: 'absolute', left: 6, maxWidth: width - 12, top: y(i) + 54, color: palette.muted, fontSize: 11, lineHeight: 15, textAlign: 'left', backgroundColor: ground(i), paddingHorizontal: 2 }}>
          {`الطبقة ${num(level.tabaqa)}${level.name ? `، ${level.name}` : ''}`}
        </Text>
      ) : null)}
      {legs.map(leg => (
        <View key={`w${leg.i}`} pointerEvents="none" style={{ position: 'absolute', left: leg.labelX - 70, top: leg.labelY, width: 140, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          {leg.lanes.filter(lane => lane.label).map((lane, j) => (
            <Text key={j} style={{ color: leg.lanes.length > 1 ? colours[lane.route % colours.length] : palette.muted, fontSize: 12, lineHeight: 17, backgroundColor: leg.ground, paddingHorizontal: 3 }}>{lane.label}</Text>
          ))}
        </View>
      ))}
      {[...at.values()].map(station => (
        <Fragment key={station.id}>
          <View pointerEvents="none" style={{ position: 'absolute', left: station.x - R - 3, top: station.y - R - 3 }}>
            <Dot station={station} colour={colours[station.route % colours.length]} palette={palette} />
          </View>
          <View pointerEvents="none" style={{ position: 'absolute', left: station.x - NAME_W / 2, top: station.y + R + 4, width: NAME_W, alignItems: 'center' }}>
            <Text numberOfLines={3} style={{ color: nameColour(station, palette), fontSize: 13, lineHeight: 19, textAlign: 'center', backgroundColor: ground(station.level), paddingHorizontal: 2 }}>{station.label}</Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

/** A hadith's isnad drawn as a metro line: one plain chain down the right, or its routes and tabaqat as a map. */
export default function Isnad({ isnad, palette }: { isnad: AppIsnad; palette: Palette }) {
  const [room, setRoom] = useState(0);
  const metro = isnadMetro(isnad);
  const plain = metro.cols === 1 && !metro.levels.some(level => level.tabaqa);
  const ranked = metro.levels.some(level => level.tabaqa);
  return (
    <View style={{ gap: 6 }} onLayout={event => setRoom(event.nativeEvent.layout.width)}>
      <View accessible accessibilityLabel={`الإسناد: ${metroOrder(metro).join('، ')}`}>
        {plain ? <Line metro={metro} palette={palette} /> : room > 0 ? <RouteMap metro={metro} width={room} palette={palette} /> : null}
      </View>
      {/* The tabaqat are Ibn Hajar's, in Taqrib al-Tahdhib. */}
      {ranked && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>الطبقات من تقريب التهذيب لابن حجر</Text>}
    </View>
  );
}
