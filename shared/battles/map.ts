// The static map behind a battle (owner, 2026-11-18): land drawn from Natural Earth in the app's own colours, no map
// service, so it works offline. The land rings are written by scripts/battles/buildLand.ts.

/** [longitude, latitude] */
export type LonLat = readonly [number, number];
/** West, south, east, north, in degrees. */
export type Box = readonly [number, number, number, number];

/** Cuts a closed ring to a box (Sutherland-Hodgman), so a coast that runs off the map ends at its edge. */
export function clipRing(ring: readonly LonLat[], [west, south, east, north]: Box): LonLat[] {
  const edges: [(p: LonLat) => boolean, (a: LonLat, b: LonLat) => LonLat][] = [
    [p => p[0] >= west, (a, b) => [west, a[1] + ((b[1] - a[1]) * (west - a[0])) / (b[0] - a[0])]],
    [p => p[0] <= east, (a, b) => [east, a[1] + ((b[1] - a[1]) * (east - a[0])) / (b[0] - a[0])]],
    [p => p[1] >= south, (a, b) => [a[0] + ((b[0] - a[0]) * (south - a[1])) / (b[1] - a[1]), south]],
    [p => p[1] <= north, (a, b) => [a[0] + ((b[0] - a[0]) * (north - a[1])) / (b[1] - a[1]), north]],
  ];
  let points: LonLat[] = [...ring];
  for (const [inside, cross] of edges) {
    if (!points.length) break;
    const kept: LonLat[] = [];
    points.forEach((point, i) => {
      const before = points[(i + points.length - 1) % points.length];
      if (inside(point)) {
        if (!inside(before)) kept.push(cross(before, point));
        kept.push(point);
      } else if (inside(before)) kept.push(cross(before, point));
    });
    points = kept;
  }
  return points;
}

/**
 * The box a map shows around its places: every place with a margin, at least `least` degrees across, widened on the short
 * side to the map's `aspect` (height over width) so nothing is stretched.
 */
export function frameOf(places: readonly LonLat[], aspect: number, least = 3): Box {
  const lons = places.map(p => p[0]);
  const lats = places.map(p => p[1]);
  const middleLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const squeeze = Math.cos((middleLat * Math.PI) / 180);
  let wide = Math.max(least, (Math.max(...lons) - Math.min(...lons)) * 1.35) * squeeze;
  let tall = Math.max(least, (Math.max(...lats) - Math.min(...lats)) * 1.35);
  if (tall / wide < aspect) tall = wide * aspect;
  else wide = tall / aspect;
  const lon = (Math.min(...lons) + Math.max(...lons)) / 2;
  const lat = middleLat;
  return [lon - wide / squeeze / 2, lat - tall / 2, lon + wide / squeeze / 2, lat + tall / 2];
}

/** Where a place falls on a map `width` wide showing `box`, and how tall that map is. */
export function projector([west, south, east, north]: Box, width: number) {
  const squeeze = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const scale = width / ((east - west) * squeeze);
  return {
    height: (north - south) * scale,
    at: ([lon, lat]: LonLat): [number, number] => [(lon - west) * squeeze * scale, (north - lat) * scale],
  };
}

/** The land inside `box` as one SVG path, `width` wide. */
export function landPath(land: readonly (readonly LonLat[])[], box: Box, width: number): string {
  const { at } = projector(box, width);
  const margin = 0.2;
  const outer: Box = [box[0] - margin, box[1] - margin, box[2] + margin, box[3] + margin];
  return land
    .map(ring => clipRing(ring, outer))
    .filter(ring => ring.length > 2)
    .map(ring => `M${ring.map(point => at(point).map(n => n.toFixed(1)).join(',')).join('L')}Z`)
    .join('');
}

/**
 * The pins of a map holding several places (owner, 2026-11-22: a year's battles on one map), in drawn points: places
 * closer than `near` points share one pin, named by all of them («أحد، المدينة»), so no two pins or names sit on each other.
 */
export function pinsOf<P extends { name: string }>(places: readonly (P & { x: number; y: number })[], near: number) {
  const pins: { x: number; y: number; names: string[] }[] = [];
  for (const place of places) {
    const pin = pins.find(each => Math.hypot(each.x - place.x, each.y - place.y) < near);
    if (!pin) pins.push({ x: place.x, y: place.y, names: [place.name] });
    else if (!pin.names.includes(place.name)) pin.names.push(place.name);
  }
  return pins.map(pin => ({ x: pin.x, y: pin.y, name: pin.names.join('، ') }));
}
