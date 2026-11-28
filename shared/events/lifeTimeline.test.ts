import { describe, expect, it } from 'vitest';
import type { AppLifeEntry } from './life';
import { lifeColumns, lifeFilters, lifeItems, lifeRail, lifeStrip, stripLabels } from './lifeTimeline';
import data from '../data/events/life.json';

const entry = (slug: string, kind: AppLifeEntry['kind'], year?: number): AppLifeEntry =>
  ({ kind, slug, name: slug, year: year === undefined ? undefined : { value: year, refs: [] }, refs: [] });
const kinds: Record<string, string> = { badr: 'غزوة', hamzah: 'سرية', jamal: 'معركة' };

describe('a life on the timeline', () => {
  const items = lifeItems([entry('isra', 'event', -1), entry('badr', 'battle', 2), entry('hamzah', 'battle', 2), entry('jamal', 'battle', 36), entry('abu-dharr', 'story')],
    slug => kinds[slug], { year: 36, label: 'وفاته', refs: [], others: [] });

  it('reads each battle\'s kind from its page and opens battles and stories, not events', () => {
    expect(items.map(item => item.kind)).toEqual(['event', 'ghazwah', 'sariyyah', 'battle', 'story', 'own']);
    expect(items.map(item => item.open?.to)).toEqual([undefined, 'battle', 'battle', 'battle', 'story', undefined]);
  });

  it('lays the rail out before the hijra, then by year, the undated last, the death after the year\'s rows', () => {
    expect(lifeRail(items).map(place => [place.key, place.items.map(item => item.key)])).toEqual([
      ['before', ['event:isra']], ['2', ['battle:badr', 'battle:hamzah']], ['36', ['battle:jamal', 'own:death']], ['undated', ['story:abu-dharr']],
    ]);
  });

  it('gives the strip every year from the first to the last, empty ones too, and no undated column', () => {
    const strip = lifeStrip(items);
    const years = strip.slice(1).map(column => column.year!);
    expect(strip[0].key).toBe('before');
    expect(years[0]).toBe(2);
    expect(years[years.length - 1]).toBe(36);
    expect(years.every((year, i) => i === 0 || year === years[i - 1] + 1)).toBe(true);
    expect(strip.find(column => column.year === 3)!.items).toEqual([]);
  });

  it('names a strip column only where its label does not touch the last one named', () => {
    const strip = lifeStrip(lifeItems([entry('a', 'event', 1), entry('b', 'event', 2), entry('c', 'event', 3), entry('d', 'event', 9)], () => undefined));
    expect([...stripLabels(strip, 40, 22)]).toEqual(['1', '2', '3', '9']);
    expect([...stripLabels(strip, 12, 22)]).toEqual(['1', '3', '9']);
  });

  it('offers only the kinds the person has, and no chips when all are one kind', () => {
    expect(lifeFilters(items).map(filter => filter.label)).toEqual(['الغزوات', 'السرايا', 'المعارك', 'الأحداث', 'القصص']);
    expect(lifeFilters(lifeItems([entry('badr', 'battle', 2)], slug => kinds[slug]))).toEqual([]);
  });

  it('puts what two people share on one row, joined, and keeps each death apart', () => {
    const other = lifeItems([entry('badr', 'battle', 2)], slug => kinds[slug], { year: 2, label: 'وفاته', refs: [], others: [] });
    const year2 = lifeColumns([items, other]).find(place => place.key === '2')!;
    expect(year2.rows.map(row => [row.key, row.shared, row.cells.map(Boolean)])).toEqual([
      ['battle:badr', true, [true, true]], ['battle:hamzah', false, [true, false]], ['own:death', false, [false, true]],
    ]);
  });

  it('draws each thing in the catalog once per person, keeping the sentences of an entry listed twice', () => {
    for (const entries of Object.values(data as Record<string, AppLifeEntry[]>)) {
      const keys = lifeRail(lifeItems(entries, () => undefined)).flatMap(place => place.items.map(item => item.key));
      expect(new Set(keys).size).toBe(keys.length);
      expect(new Set(keys)).toEqual(new Set(entries.map(e => `${e.kind}:${e.slug}`)));
    }
    const twice = lifeItems([{ ...entry('uhud', 'battle', 3), refs: [{ text: 'أ', cite: '١' }] }, { ...entry('uhud', 'battle', 3), refs: [{ text: 'ب', cite: '٢' }] }], slug => kinds[slug]);
    expect(twice).toHaveLength(1);
    expect(twice[0].refs.map(ref => ref.text)).toEqual(['أ', 'ب']);
  });
});
