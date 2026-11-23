import { describe, expect, it } from 'vitest';
import data from '../data/battles/battles.json';
import type { AppBattle } from './battle';
import { APART, atlasPins, battlesAt, layerBox, layerOf, lifeYears, lonePlaces, searchAtlas } from './atlas';
import { MADINAH_YEARS } from './timeline';

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

  it('lists the battles a pin holds, the chosen year first', () => {
    const here = battlesAt(BATTLES, 'life', [placeOf('khandaq').name], 5);
    expect(here.length).toBeGreaterThan(1);
    expect(here[0].year?.value).toBe(5);
  });

  it('finds a battle by its name or its place, whatever the article or hamza', () => {
    expect(searchAtlas(BATTLES, 'تبوك').map(battle => battle.slug)).toEqual(['tabuk']);
    expect(searchAtlas(BATTLES, 'اليرموك').map(battle => battle.slug)).toContain('yarmuk');
    expect(searchAtlas(BATTLES, 'احد').map(battle => battle.slug)).toContain('uhud');
    expect(searchAtlas(BATTLES, '  ')).toEqual([]);
  });

  it('asks «أين كانت؟» only about places that stand apart from every other on their layer', () => {
    for (const layer of ['life', 'after'] as const) {
      const lone = lonePlaces(BATTLES, layer);
      const places = new Map(BATTLES.filter(battle => layerOf(battle) === layer && battle.place).map(battle => [battle.place!.name, battle.place!.at]));
      lone.forEach(name => places.forEach((at, other) => {
        if (other !== name) expect(Math.hypot(at[0] - places.get(name)![0], at[1] - places.get(name)![1])).toBeGreaterThanOrEqual(APART);
      }));
    }
    expect(lonePlaces(BATTLES, 'life')).not.toContain(placeOf('hudaybiyyah').name);
  });
});
