import { describe, expect, it } from 'vitest';
import units from './data/hadith/units.json';
import forty from './data/hadith/forty.json';
import type { AppIsnad } from './hadith';
import { chainIsnad, isnadMetro, chainLinks, metroOrder } from './isnadMetro';

const jibril = (units as unknown as { units: { id: string; isnad: Record<string, AppIsnad> }[] }).units.find(unit => unit.id === 'muslim-jibril')!;
const isnad = Object.values(jibril.isnad)[0];
const metro = isnadMetro(isnad);
const station = (label: string) => metro.stations.find(each => each.label.includes(label))!;

describe('isnad metro', () => {
  it("draws Muslim's two routes of the Jibril hadith apart, then one line from Kahmas", () => {
    expect(metro.routes).toBe(2);
    expect(station('وَكِيعٌ').route).not.toBe(station('أَبِي').route);
    expect(station('كَهْمَسٍ').route).toBe(0);
    expect(station('أَبُو خَيْثَمَةَ').level).toBe(station('عُبَيْدُ اللَّهِ').level);
    expect(metro.levels[station('عُبَيْدُ اللَّهِ').level].tabaqa).toBe(10);
  });

  it('writes a word both routes say once, «عَنْ» and «عَنِ» being one word', () => {
    const leg = metro.legs.find(each => each.from === station('كَهْمَسٍ').id && each.to === station('بُرَيْدَةَ').id)!;
    expect(leg.words.map(word => word.label)).toEqual(['عَنْ']);
  });

  it('keeps each word with the route that says it where the routes differ', () => {
    const twice = { ...isnad, edges: isnad.edges.map((edge, i) => (i === isnad.edges.length - 3 ? { ...edge, label: 'حَدَّثَنَا' } : edge)) };
    const leg = isnadMetro(twice).legs.find(each => each.words.length > 1)!;
    expect(leg.words).toEqual([{ route: 0, label: 'عن' }, { route: 1, label: 'حَدَّثَنَا' }]);
  });

  it('marks the Companions by their tabaqa and the collector apart', () => {
    expect(station('عمر بن الخطاب').kind).toBe('companion');
    expect(station('عبد الله بن عمر').kind).toBe('companion');
    expect(station('كَهْمَسٍ').kind).toBe('narrator');
    expect(station('مسلم').kind).toBe('collector');
  });

  it('reads right to left, the one the narrator heard from to his left on his own level', () => {
    expect(station('يحيى بن يعمر').col).toBeGreaterThan(station('بُرَيْدَةَ').col);
    expect(metroOrder(metro)[0]).toBe('مسلم');
  });

  it("draws a Forty chain and a Sahih chain as one line, a level for each narrator", () => {
    const record = (forty as unknown as { entries: { records: { isnad?: AppIsnad }[] }[] }).entries[0].records[0];
    const line = isnadMetro(record.isnad!);
    expect(line.cols).toBe(1);
    expect(chainLinks(record.isnad!).at(-1)).toEqual({ name: 'عُمَرَ', mode: 'عَنْ' });
    expect(new Set(line.stations.map(each => each.level)).size).toBe(line.stations.length);
    const chain = isnadMetro(chainIsnad('البخاري', [{ name: 'سُفْيَانُ', mode: 'حَدَّثَنَا' }, { name: 'الزُّهْرِيُّ', mode: 'عَنِ' }]));
    expect(metroOrder(chain)).toEqual(['البخاري', 'سُفْيَانُ', 'الزُّهْرِيُّ']);
    expect(chain.legs.map(leg => leg.words[0].label)).toEqual(['حَدَّثَنَا', 'عَنِ']);
  });
});
