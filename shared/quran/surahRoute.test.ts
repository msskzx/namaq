import { describe, expect, it } from 'vitest';
import surahRows from './../data/quran/surahs.json';
import { surahRoute } from './surahRoute';
import { surahTopicsOf } from './surahTopics';

const divided = surahRows.filter(row => surahTopicsOf(row.number));
const routes = divided.flatMap(({ number, numberOfAyat }) =>
  Array.from({ length: numberOfAyat }, (_, i) => ({ key: `${number}:${i + 1}`, ayah: i + 1, route: surahRoute(number, i + 1, numberOfAyat) })));

describe("an ayah's place on its surah's route («مسار السورة»)", () => {
  it('names a stretch inside the section it is counted in, and that stretch holds the ayah', () => {
    const named = routes.filter(each => each.route?.here);
    expect(named.length).toBeGreaterThan(0);
    for (const { key, ayah, route } of named) {
      const section = route!.stops[route!.section]!;
      expect(section, key).toBeTruthy();
      expect(route!.here!.from, key).toBeGreaterThanOrEqual(section.from);
      expect(route!.here!.to, key).toBeLessThanOrEqual(section.to);
      expect(ayah, key).toBeGreaterThanOrEqual(route!.here!.from);
      expect(ayah, key).toBeLessThanOrEqual(route!.here!.to);
    }
  });

  it('names no stretch for an ayah the book leaves between two sections (al-An\'am 21), yet keeps its place', () => {
    const route = routes.find(each => each.key === '6:21')!.route!;
    expect(route.here).toBeNull();
    expect(route.section).toBeGreaterThanOrEqual(0);
  });
});
