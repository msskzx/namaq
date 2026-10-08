import { describe, expect, it } from 'vitest';
import { battleKind, filterTimeline, parseKinds, timelineYear, type TimelineItem } from './timeline';

function item(overrides: Partial<TimelineItem>): TimelineItem {
  return {
    id: 'id', slug: 'slug', kind: 'event', name: 'حدث', nameTransliterated: null,
    hijriYear: 1, hijriPeriod: null, location: null, locationTransliterated: null, ...overrides,
  };
}

const items = [
  item({ id: '1', kind: 'event', name: 'الهجرة إلى المدينة', nameTransliterated: 'Hijra to Medina', location: 'المدينة' }),
  item({ id: '2', kind: 'ghazwah', name: 'غَزْوَةُ بَدْرٍ', nameTransliterated: 'Battle of Badr', location: 'بدر' }),
  item({ id: '3', kind: 'sariyyah', name: 'سرية عبد الله بن جحش', nameTransliterated: 'Expedition of Abdullah ibn Jahsh', locationTransliterated: 'Nakhla' }),
  item({ id: '4', kind: 'battle', name: 'معركة اليمامة', nameTransliterated: 'Battle of Yamamah' }),
];
const ids = (list: TimelineItem[]) => list.map((entry) => entry.id);

describe('battleKind', () => {
  it('maps an engagement to its kind and reads an unset one as a battle', () => {
    expect(battleKind('GHAZWAH')).toBe('ghazwah');
    expect(battleKind('SARIYYAH')).toBe('sariyyah');
    expect(battleKind('BATTLE')).toBe('battle');
    expect(battleKind(null)).toBe('battle');
  });
});

describe('parseKinds', () => {
  it('keeps known kinds and drops the rest', () => {
    expect(parseKinds('sariyyah,nonsense,ghazwah')).toEqual(['ghazwah', 'sariyyah']);
    expect(parseKinds(null)).toEqual([]);
  });
});

describe('filterTimeline', () => {
  it('shows everything when nothing is selected', () => {
    expect(ids(filterTimeline(items, [], ''))).toEqual(['1', '2', '3', '4']);
  });

  it('takes the union of the selected kinds', () => {
    expect(ids(filterTimeline(items, ['ghazwah'], ''))).toEqual(['2']);
    expect(ids(filterTimeline(items, ['ghazwah', 'event'], ''))).toEqual(['1', '2']);
  });

  it('matches Arabic names with or without diacritics', () => {
    expect(ids(filterTimeline(items, [], 'بدر'))).toEqual(['2']);
    expect(ids(filterTimeline(items, [], 'غَزْوَةُ'))).toEqual(['2']);
  });

  it('matches transliterated names and either location', () => {
    expect(ids(filterTimeline(items, [], 'yamamah'))).toEqual(['4']);
    expect(ids(filterTimeline(items, [], 'nakhla'))).toEqual(['3']);
    expect(ids(filterTimeline(items, [], 'المدينة'))).toEqual(['1']);
  });

  it('applies the kind and the query together', () => {
    expect(ids(filterTimeline(items, ['sariyyah'], 'badr'))).toEqual([]);
  });
});

describe('timelineYear', () => {
  it('returns hijriYear when item is dated', () => {
    expect(timelineYear(item({ hijriYear: 5 }))).toBe(5);
    expect(timelineYear(item({ hijriYear: 50 }))).toBe(50);
  });

  it('returns null for null hijriYear when no interval', () => {
    expect(timelineYear(item({ hijriYear: null }))).toBeNull();
  });

  it('sorts after the from bound when interval has only from bound', () => {
    const year = timelineYear(item({ hijriYear: null, interval: { from: { slug: 'a', kind: 'event', name: 'a', nameTransliterated: null, year: 10 } } }));
    expect(year).toBe(10.25);
  });

  it('sorts before the to bound when interval has only to bound', () => {
    const year = timelineYear(item({ hijriYear: null, interval: { to: { slug: 'b', kind: 'event', name: 'b', nameTransliterated: null, year: 20 } } }));
    expect(year).toBe(19.75);
  });

  it('sorts after from when both bounds exist', () => {
    const year = timelineYear(item({
      hijriYear: null,
      interval: {
        from: { slug: 'a', kind: 'event', name: 'a', nameTransliterated: null, year: 10 },
        to: { slug: 'b', kind: 'event', name: 'b', nameTransliterated: null, year: 20 },
      },
    }));
    expect(year).toBe(10.25);
  });

  it('returns null when no interval', () => {
    expect(timelineYear(item({ hijriYear: null, interval: undefined }))).toBeNull();
    expect(timelineYear(item({ hijriYear: null, interval: {} }))).toBeNull();
  });
});
