import { describe, expect, it } from 'vitest';
import land from '../data/battles/land.json';
import { clipRing, frameOf, landPath, projector, type LonLat } from './map';
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
});
