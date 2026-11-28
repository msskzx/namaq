
export const PIN_JOIN = 24;

export type LonLat = readonly [number, number];
export type Box = readonly [number, number, number, number];

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

export function projector([west, south, east, north]: Box, width: number) {
  const squeeze = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const scale = width / ((east - west) * squeeze);
  return {
    height: (north - south) * scale,
    at: ([lon, lat]: LonLat): [number, number] => [(lon - west) * squeeze * scale, (north - lat) * scale],
  };
}

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

export function pinsOf<P extends { name: string }>(places: readonly (P & { x: number; y: number })[], near: number) {
  const pins: { x: number; y: number; names: string[] }[] = [];
  for (const place of places) {
    const pin = pins.find(each => Math.hypot(each.x - place.x, each.y - place.y) < near);
    if (!pin) pins.push({ x: place.x, y: place.y, names: [place.name] });
    else if (!pin.names.includes(place.name)) pin.names.push(place.name);
  }
  return pins.map(pin => ({ x: pin.x, y: pin.y, name: pin.names.join('، ') }));
}

export type PlacedLabel = { x: number; y: number; anchor: 'start' | 'middle' | 'end'; box: [number, number, number, number] };

const LETTER = 0.5;

const overlaps = (a: readonly number[], b: readonly number[]) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

export function placeLabels(pins: readonly { x: number; y: number; text: string; size: number; r?: number }[], width: number, height: number): (PlacedLabel | null)[] {
  const taken: number[][] = pins.map(({ x, y, r = 8 }) => [x - r, y - r, x + r, y + r]);
  return pins.map(({ x, y, text, size, r = 8 }, own) => {
    if (!text) return null;
    const wide = text.length * size * LETTER;
    const spots: PlacedLabel[] = [r + 4, r + 4 + size].flatMap((gap): PlacedLabel[] => [
      { x: x + gap, y: y + size / 3, anchor: 'start', box: [x + gap, y - size / 2, x + gap + wide, y + size / 2] },
      { x: x - gap, y: y + size / 3, anchor: 'end', box: [x - gap - wide, y - size / 2, x - gap, y + size / 2] },
      { x, y: y - gap - size / 6, anchor: 'middle', box: [x - wide / 2, y - gap - size, x + wide / 2, y - gap] },
      { x, y: y + gap + size * 0.8, anchor: 'middle', box: [x - wide / 2, y + gap, x + wide / 2, y + gap + size] },
    ]);
    const spot = spots.find(({ box }) => box[0] >= 0 && box[2] <= width && box[1] >= 0 && box[3] <= height
      && taken.every((other, i) => i === own || !overlaps(box, other)));
    if (spot) taken.push(spot.box);
    return spot ?? null;
  });
}
