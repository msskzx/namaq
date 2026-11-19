import land from '@shared/data/battles/land.json';
import { frameOf, landPath, projector, type LonLat } from '@shared/battles/map';
import { LANDMARKS, PLACES } from '@shared/battles/places';

const ASPECT = 0.85;
/** How far from a battle (in degrees) a well-known city still shows beside it. */
const NEAR = 7;
/** The drawing's width in its own units; the SVG scales to the card's width. */
const WIDTH = 400;

/**
 * A battle's place on a still map in the site's colours (the app's BattleMap, owner 2026-11-18: no map service). The
 * well-known cities near it stay on the map, so the reader can tell where it was.
 */
export default function BattleMap({ place }: { place: { name: string; at: LonLat } }) {
  const near = (city: { at: LonLat }) => Math.hypot(place.at[0] - city.at[0], place.at[1] - city.at[1]) < NEAR;
  const cities = LANDMARKS.map(key => PLACES[key]).filter(city => city.name !== place.name && near(city));
  const box = frameOf([place.at, ...cities.map(city => city.at)], ASPECT);
  const { height, at } = projector(box, WIDTH);
  const label = (x: number, y: number, text: string, size: number) => {
    const left = x > WIDTH * 0.6;
    const where = { x: left ? x - 12 : x + 12, y: y + size / 3, fontSize: size, textAnchor: left ? 'end' as const : 'start' as const, fontFamily: 'var(--font-amiri), Amiri, serif' };
    // The paper-coloured outline first, under the letters, so a name stays readable over a coast.
    return <g>
      <text {...where} fill="var(--home-paper)" stroke="var(--home-paper)" strokeWidth={4}>{text}</text>
      <text {...where} fill="var(--home-ink)">{text}</text>
    </g>;
  };
  const [x, y] = at(place.at);
  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`خريطة: ${place.name}`} className="block h-auto w-full" style={{ direction: 'ltr' }}>
      <rect width={WIDTH} height={height} fill="var(--home-paper)" />
      <path d={landPath(land as unknown as LonLat[][], box, WIDTH)} fill="var(--home-card)" stroke="var(--home-rule)" strokeOpacity={0.6} strokeWidth={0.8} fillRule="evenodd" />
      {cities.map(city => {
        const [cx, cy] = at(city.at);
        return <g key={city.name}><rect x={cx - 3.5} y={cy - 3.5} width={7} height={7} fill="var(--home-ink)" />{label(cx, cy, city.name, 14)}</g>;
      })}
      <circle cx={x} cy={y} r={16} fill="var(--home-accent)" fillOpacity={0.2} />
      <circle cx={x} cy={y} r={7.5} fill="var(--home-accent)" stroke="var(--home-paper)" strokeWidth={2} />
      {label(x, y, place.name, 16)}
    </svg>
  );
}
