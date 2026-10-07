import { describe, expect, it } from 'vitest';
import { type CatalogBattle, type CatalogEvent } from '../../src/lib/catalog/types';
import { dateRows, planDateParts, type DatePartRow } from './dateParts';

describe('dateRows', () => {
  it('returns no rows for subjects with no dateParts', () => {
    const catalog = { battles: [], events: [] };
    expect(dateRows(catalog)).toMatchObject({ rows: [], invalid: [] });
  });

  it('returns an EVENT row with valid month', () => {
    const event = {
      kind: 'EVENT',
      slug: 'some-event',
      name: 'event',
      type: 'OTHER',
      fields: {},
      dateParts: { hijriMonth: { value: 3 } },
      people: [],
    } as unknown as CatalogEvent;

    const catalog = { battles: [], events: [event] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [{ kind: 'EVENT', slug: 'some-event', month: 3, day: null }],
      invalid: [],
    });
  });

  it('returns a BATTLE row with month and day', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 3 }, hijriDay: { value: 12 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }],
      invalid: [],
    });
  });

  it('produces an invalid message for month 13', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 13 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [],
      invalid: ['battles/badr.dateParts: month 13 is not 1 to 12'],
    });
  });

  it('produces an invalid message for month 0', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 0 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [],
      invalid: ['battles/badr.dateParts: month 0 is not 1 to 12'],
    });
  });

  it('produces an invalid message for non-integer month 2.5', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 2.5 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [],
      invalid: ['battles/badr.dateParts: month 2.5 is not 1 to 12'],
    });
  });

  it('produces an invalid message for day 31', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 3 }, hijriDay: { value: 31 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [],
      invalid: ['battles/badr.dateParts: day 31 is not 1 to 30'],
    });
  });

  it('produces an invalid message for day 0', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 3 }, hijriDay: { value: 0 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [],
      invalid: ['battles/badr.dateParts: day 0 is not 1 to 30'],
    });
  });

  it('produces an invalid message "a day needs a month" when day has no month', () => {
    const event = {
      kind: 'EVENT',
      slug: 'some-event',
      name: 'event',
      type: 'OTHER',
      fields: {},
      dateParts: { hijriDay: { value: 15 } },
      people: [],
    } as unknown as CatalogEvent;

    const catalog = { battles: [], events: [event] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [],
      invalid: ['events/some-event.dateParts: a day needs a month'],
    });
  });

  it('keeps a valid row alongside an invalid one', () => {
    const battle1 = {
      kind: 'BATTLE',
      slug: 'badr',
      name: 'battle',
      dateParts: { hijriMonth: { value: 3 }, hijriDay: { value: 12 } },
      participants: [],
    } as unknown as CatalogBattle;

    const battle2 = {
      kind: 'BATTLE',
      slug: 'uhud',
      name: 'battle',
      dateParts: { hijriMonth: { value: 13 } },
      participants: [],
    } as unknown as CatalogBattle;

    const catalog = { battles: [battle1, battle2], events: [] };
    expect(dateRows(catalog)).toMatchObject({
      rows: [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }],
      invalid: ['battles/uhud.dateParts: month 13 is not 1 to 12'],
    });
  });
});

describe('planDateParts', () => {
  it('says nothing when live equals rows', () => {
    const rows: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }];
    const live: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }];
    expect(planDateParts(rows, live)).toEqual({ set: [], remove: [] });
  });

  it('moves a new row to set', () => {
    const rows: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }];
    const live: DatePartRow[] = [];
    expect(planDateParts(rows, live)).toEqual({ set: rows, remove: [] });
  });

  it('moves a changed day to set', () => {
    const rows: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 15 }];
    const live: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }];
    expect(planDateParts(rows, live)).toEqual({ set: rows, remove: [] });
  });

  it('moves a live row whose subject lost its dateParts to remove', () => {
    const rows: DatePartRow[] = [];
    const live: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }];
    expect(planDateParts(rows, live)).toEqual({ set: [], remove: live });
  });

  it('treats the same slug as EVENT and as BATTLE as different rows', () => {
    const rows: DatePartRow[] = [
      { kind: 'EVENT', slug: 'badr', month: 3, day: null },
      { kind: 'BATTLE', slug: 'badr', month: 5, day: 12 },
    ];
    const live: DatePartRow[] = [{ kind: 'BATTLE', slug: 'badr', month: 3, day: 12 }];
    expect(planDateParts(rows, live)).toEqual({
      set: [
        { kind: 'EVENT', slug: 'badr', month: 3, day: null },
        { kind: 'BATTLE', slug: 'badr', month: 5, day: 12 },
      ],
      remove: [],
    });
  });
});

describe('planDateParts and the rows an invalid subject leaves behind', () => {
  const row = (month: number | null, day: number | null) => ({ kind: 'EVENT' as const, slug: 'a', month, day });

  it('does not remove the live row of a subject that is invalid now', () => {
    expect(planDateParts([], [row(3, null)], new Set(['EVENT/a'])).remove).toEqual([]);
  });

  it('removes a live row whose subject is simply gone', () => {
    expect(planDateParts([], [row(3, null)]).remove).toEqual([row(3, null)]);
  });

  it('sets a row whose day was dropped', () => {
    expect(planDateParts([row(3, null)], [row(3, 12)]).set).toEqual([row(3, null)]);
  });

  it('leaves an unchanged month and day pair alone', () => {
    expect(planDateParts([row(3, 12)], [row(3, 12)]).set).toEqual([]);
    expect(planDateParts([row(3, null)], [row(3, null)]).set).toEqual([]);
  });

  it('reports a bad month and keeps its slug in skipped', () => {
    const catalog = { battles: [], events: [{ slug: 'a', dateParts: { hijriMonth: { value: 13, claims: [] } } }] } as unknown as Parameters<typeof dateRows>[0];
    const result = dateRows(catalog);
    expect(result.rows).toEqual([]);
    expect([...result.skipped]).toEqual(['EVENT/a']);
  });
});

