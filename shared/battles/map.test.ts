import { describe, expect, it } from 'vitest';
import land from '../data/battles/land.json';
import { clipRing, frameOf, landPath, pinsOf, placeLabels, projector, type LonLat } from './map';
import { BATTLE_PLACE, PLACES } from './places';

const square: LonLat[] = [[0, 0], [10, 0], [10, 10], [0, 10]];

describe('the battle map', () => {
  it('cuts a ring to the box', () => {
    const cut = clipRing(square, [2, 2, 5, 5]);
    expect(cut.every(([x, y]) => x >= 2 && x <= 5 && y >= 2 && y <= 5)).toBe(true);
    expect(cut.length).toBeGreaterThanOrEqual(4);
  });

  it('drops a ring outside the box', () => expect(clipRing(square, [20, 20, 30, 30])).toEqual([]));

  it('frames every place with room and the asked shape', () => {
    const places = [PLACES.madinah.at, PLACES.makkah.at, PLACES.badr.at];
    const box = frameOf(places, 0.8);
    places.forEach(([lon, lat]) => {
      expect(lon).toBeGreaterThan(box[0]);
      expect(lon).toBeLessThan(box[2]);
      expect(lat).toBeGreaterThan(box[1]);
      expect(lat).toBeLessThan(box[3]);
    });
    expect(projector(box, 300).height / 300).toBeCloseTo(0.8, 5);
  });

  it('puts north up and east right', () => {
    const { at } = projector(frameOf([PLACES.madinah.at, PLACES.makkah.at], 1), 300);
    expect(at(PLACES.madinah.at)[1]).toBeLessThan(at(PLACES.makkah.at)[1]);
    expect(at(PLACES.taif.at)[0]).toBeGreaterThan(at(PLACES.makkah.at)[0]);
  });

  it('draws the land around Arabia', () => {
    const path = landPath(land as unknown as LonLat[][], frameOf([PLACES.madinah.at, PLACES.makkah.at], 1), 300);
    expect(path.startsWith('M')).toBe(true);
    expect(path.length).toBeGreaterThan(200);
  });

  it('pins every place inside the land the app carries', () => {
    Object.values(BATTLE_PLACE).forEach(key => {
      const [lon, lat] = PLACES[key].at;
      expect(lon > 24 && lon < 52 && lat > 12 && lat < 40).toBe(true);
    });
  });

  // Owner, 2026-11-22: a year's battles on one map; places drawn on top of each other share a pin and its name.
  it('joins places too close to tell apart into one pin, each name once, and keeps the others apart', () => {
    const pins = pinsOf([
      { name: 'أحد', x: 100, y: 100 }, { name: 'المدينة', x: 104, y: 101 }, { name: 'المدينة', x: 104, y: 101 }, { name: 'حمراء الأسد', x: 160, y: 140 },
    ], 20);
    expect(pins.map(pin => pin.name)).toEqual(['أحد، المدينة', 'حمراء الأسد']);
  });
});

// Owner, 2026-11-23: where places are close, their names must not cover each other.
describe('the names on a map', () => {
  const overlap = (a: readonly number[], b: readonly number[]) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

  it('never puts two names, or a name and a pin, on top of each other', () => {
    const pins = [
      { x: 200, y: 200, text: 'مكة', size: 16 }, { x: 214, y: 196, text: 'الحديبية', size: 16 },
      { x: 230, y: 206, text: 'حنين', size: 16 }, { x: 205, y: 222, text: 'نخلة', size: 16 }, { x: 260, y: 215, text: 'الطائف', size: 16 },
    ];
    const labels = placeLabels(pins, 400, 400);
    const shown = labels.filter((label): label is NonNullable<typeof label> => !!label);
    shown.forEach((label, i) => shown.slice(i + 1).forEach(other => expect(overlap(label.box, other.box)).toBe(false)));
    shown.forEach(label => pins.forEach(pin => expect(overlap(label.box, [pin.x - 8, pin.y - 8, pin.x + 8, pin.y + 8])).toBe(false)));
  });

  it('keeps every name inside the map, moving it to the other side at the edge', () => {
    const [label] = placeLabels([{ x: 395, y: 100, text: 'نهاوند', size: 16 }], 400, 300);
    expect(label?.anchor).toBe('end');
    expect(label!.box[0]).toBeGreaterThanOrEqual(0);
  });

  it('lets a pin with no name (a quiz\'s choice) take only its own room, so a name beside it still shows', () => {
    // The small pin sits just under where the name goes; a name of its own there would push the name to the other side.
    const [, named] = placeLabels([{ x: 215, y: 112, text: '', size: 16, r: 2 }, { x: 200, y: 100, text: 'دمشق', size: 16 }], 400, 300);
    expect(named?.anchor).toBe('start');
  });

  it('still names a town that sits under another pin\'s halo, a little further out', () => {
    // Makkah under Nakhla's lit pin on the atlas (2026-11-24): every spot beside the town touched the halo, so its name was dropped.
    const [, town] = placeLabels([{ x: 200, y: 100, text: 'نخلة', size: 16, r: 16 }, { x: 196, y: 104, text: 'مكة', size: 14, r: 4 }], 400, 300);
    expect(town).not.toBeNull();
    expect(overlap(town!.box, [184, 84, 216, 116])).toBe(false);
  });

  it('names a lone pin beside it', () => {
    expect(placeLabels([{ x: 100, y: 100, text: 'تبوك', size: 16 }], 400, 300)[0]?.anchor).toBe('start');
  });
});
