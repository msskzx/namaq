import { describe, expect, it } from 'vitest';
import data from '../data/battles/battles.json';
import type { AppBattle } from './battle';
import { atlasPins, NARROWEST_MAP, battlesAt, layerBox, layerOf, lifeYears, lonePlaces, screenBox } from './atlas';
import { searchBattles } from './battle';
import { MADINAH_YEARS } from './timeline';
import { PIN_JOIN, projector } from './map';
import land from '../data/battles/land.json';

const BATTLES = data as AppBattle[];
const placeOf = (slug: string) => BATTLES.find(battle => battle.slug === slug)!.place!;

describe('the atlas', () => {
  it('puts a battle on «في حياته ﷺ» only when its cited year is in his years in Madinah', () => {
    BATTLES.forEach(battle => {
      const year = battle.year?.value;
      expect(layerOf(battle)).toBe(typeof year === 'number' && year >= 1 && year <= MADINAH_YEARS ? 'life' : 'after');
    });
  });

  it('pins only places a book gives: every pin is some battle\'s sourced place', () => {
    const sourced = new Map(BATTLES.flatMap(battle => (battle.place?.refs.some(ref => ref.text) ? [[battle.place.name, battle.place.at] as const] : [])));
    for (const layer of ['life', 'after'] as const) {
      for (const year of lifeYears(BATTLES)) atlasPins(BATTLES, layer, year).forEach(pin => expect(sourced.get(pin.name)).toEqual(pin.at));
    }
  });

  it('lights the chosen year, quiets the years before it, and hides the years after it', () => {
    const year = 5;
    const pins = atlasPins(BATTLES, 'life', year);
    const lit = new Set(BATTLES.filter(battle => battle.year?.value === year && battle.place).map(battle => battle.place!.name));
    const before = new Set(BATTLES.filter(battle => (battle.year?.value ?? 99) < year && battle.place).map(battle => battle.place!.name));
    expect(new Set(pins.filter(pin => pin.look === 'lit').map(pin => pin.name))).toEqual(lit);
    expect(new Set(pins.filter(pin => pin.look === 'quiet').map(pin => pin.name))).toEqual(new Set([...before].filter(name => !lit.has(name))));
    expect(pins.some(pin => pin.name === placeOf('tabuk').name)).toBe(false);
  });

  it('frames every pinned place of a layer on its still map', () => {
    for (const layer of ['life', 'after'] as const) {
      const [west, south, east, north] = layerBox(BATTLES, layer);
      atlasPins(BATTLES, layer, MADINAH_YEARS + 1).forEach(({ at: [lon, lat] }) => {
        expect(lon > west && lon < east && lat > south && lat < north).toBe(true);
      });
    }
  });

  it('draws each layer inside the land the app carries, so no edge of the map is empty', () => {
    const points = (land as number[][][]).flat();
    const [west, south, east, north] = [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])), Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))];
    for (const layer of ['life', 'after'] as const) {
      const box = layerBox(BATTLES, layer);
      expect(box[0] >= west && box[1] >= south && box[2] <= east && box[3] <= north, layer).toBe(true);
    }
  });

  it('lists the battles a pin holds, the chosen year first', () => {
    const here = battlesAt(BATTLES, 'life', [placeOf('khandaq').name], 5);
    expect(here.length).toBeGreaterThan(1);
    expect(here[0].year?.value).toBe(5);
    expect(battlesAt(BATTLES, 'life', [placeOf('khandaq').name], 3).every(battle => battle.year!.value <= 3)).toBe(true);
  });

  it('finds a battle by its name or its place, whatever the article or hamza', () => {
    expect(searchBattles(BATTLES, 'تبوك').map(battle => battle.slug)).toEqual(['tabuk']);
    expect(searchBattles(BATTLES, 'اليرموك').map(battle => battle.slug)).toContain('yarmuk');
    expect(searchBattles(BATTLES, 'احد').map(battle => battle.slug)).toContain('uhud');
    expect(searchBattles(BATTLES, '  ')).toEqual([]);
  });

  it('asks «أين كانت؟» only about places whose pin stands alone on the narrowest map, so a tap means one place', () => {
    for (const layer of ['life', 'after'] as const) {
      const { at } = projector(layerBox(BATTLES, layer), NARROWEST_MAP);
      const places = new Map(BATTLES.filter(battle => layerOf(battle) === layer && battle.place).map(battle => [battle.place!.name, at(battle.place!.at)]));
      const lone = lonePlaces(BATTLES, layer);
      expect(lone.length).toBeGreaterThan(0);
      lone.forEach(name => places.forEach(([x, y], other) => {
        if (other !== name) expect(Math.hypot(x - places.get(name)![0], y - places.get(name)![1])).toBeGreaterThanOrEqual(PIN_JOIN);
      }));
    }
    expect(lonePlaces(BATTLES, 'life')).not.toContain(placeOf('hudaybiyyah').name);
  });
});

describe('screenBox', () => {
  it('puts every pinned place of each layer inside the open band of the screen', () => {
    const screen = { width: 440, height: 956, top: 150, bottom: 500 };
    for (const layer of ['life', 'after'] as const) {
      const placed = BATTLES.filter(battle => layerOf(battle) === layer && battle.place);
      expect(placed.length).toBeGreaterThan(0);
      const { at, height } = projector(screenBox(BATTLES, layer, screen), screen.width);
      expect(height).toBeGreaterThanOrEqual(screen.bottom);
      for (const battle of placed) {
        const [x, y] = at(battle.place!.at);
        expect(x, battle.slug).toBeGreaterThanOrEqual(0);
        expect(x, battle.slug).toBeLessThanOrEqual(screen.width);
        expect(y, battle.slug).toBeGreaterThanOrEqual(screen.top);
        expect(y, battle.slug).toBeLessThanOrEqual(screen.bottom);
      }
    }
  });
});
