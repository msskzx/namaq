import { readFileSync, writeFileSync } from 'node:fs';
import { clipRing, type Box, type LonLat } from '../../shared/battles/map';

export const LAND_BOX: Box = [24, 12, 52, 40];

type Geometry = { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] };

const file = process.argv[2];
if (!file) throw new Error('Give the path of ne_50m_land.geojson');
const { features } = JSON.parse(readFileSync(file, 'utf8')) as { features: { geometry: Geometry }[] };
const rings = features
  .flatMap(({ geometry }) => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates))
  .flatMap(polygon => polygon)
  .map(ring => clipRing(ring.map(([lon, lat]) => [lon, lat] as LonLat), LAND_BOX))
  .filter(ring => ring.length > 2)
  .map(ring => ring.map(([lon, lat]) => [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]));
writeFileSync('shared/data/battles/land.json', `${JSON.stringify(rings)}\n`);
