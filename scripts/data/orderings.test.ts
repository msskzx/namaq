import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Catalog } from '../../src/lib/catalog/types';
import { orderingRows, planOrderings, type OrderingRow } from './orderings';

describe('orderingRows', () => {
  it('returns no rows for a catalog with no orderings', () => {
    const catalog: Pick<Catalog, 'orderings'> = {};
    expect(orderingRows(catalog)).toEqual([]);
  });

  it('returns no rows for a catalog with empty orderings array', () => {
    const catalog: Pick<Catalog, 'orderings'> = { orderings: [] };
    expect(orderingRows(catalog)).toEqual([]);
  });

  it('returns one row for a catalog with one ordering', () => {
    const catalog: Pick<Catalog, 'orderings'> = {
      orderings: [
        {
          kind: 'ORDERING',
          earlier: 'event-a',
          later: 'event-b',
          source: 'source-one',
          claims: ['claim/one'],
        },
      ],
    };

    const rows = orderingRows(catalog);
    expect(rows).toEqual([
      {
        earlier: 'event-a',
        later: 'event-b',
        source: 'source-one',
        claims: ['claim/one'],
      },
    ]);
  });

  it('returns multiple rows for multiple orderings', () => {
    const catalog: Pick<Catalog, 'orderings'> = {
      orderings: [
        {
          kind: 'ORDERING',
          earlier: 'event-a',
          later: 'event-b',
          source: 'source-one',
          claims: ['claim/one'],
        },
        {
          kind: 'ORDERING',
          earlier: 'event-b',
          later: 'event-c',
          source: 'source-two',
          claims: ['claim/two'],
        },
      ],
    };

    const rows = orderingRows(catalog);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    });
    expect(rows[1]).toEqual({
      earlier: 'event-b',
      later: 'event-c',
      source: 'source-two',
      claims: ['claim/two'],
    });
  });

  it('handles legacyUnreviewed claims', () => {
    const catalog: Pick<Catalog, 'orderings'> = {
      orderings: [
        {
          kind: 'ORDERING',
          earlier: 'event-a',
          later: 'event-b',
          source: 'source-one',
          claims: legacyUnreviewed,
        },
      ],
    };

    const rows = orderingRows(catalog);
    expect(rows).toEqual([
      {
        earlier: 'event-a',
        later: 'event-b',
        source: 'source-one',
        claims: legacyUnreviewed,
      },
    ]);
  });
});

describe('planOrderings', () => {
  it('returns empty set and remove when no rows and no live orderings', () => {
    const result = planOrderings([], []);
    expect(result.set).toEqual([]);
    expect(result.remove).toEqual([]);
  });

  it('marks a new row for set when it is not in live', () => {
    const newRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    };

    const result = planOrderings([newRow], []);
    expect(result.set).toEqual([newRow]);
    expect(result.remove).toEqual([]);
  });

  it('marks a live row for remove when it is not in rows', () => {
    const liveRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    };

    const result = planOrderings([], [liveRow]);
    expect(result.set).toEqual([]);
    expect(result.remove).toEqual([liveRow]);
  });

  it('marks no change when row is identical and in live', () => {
    const row: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    };

    const result = planOrderings([row], [row]);
    expect(result.set).toEqual([]);
    expect(result.remove).toEqual([]);
  });

  it('marks a row for set when claims differ', () => {
    const oldRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/old'],
    };
    const newRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/new'],
    };

    const result = planOrderings([newRow], [oldRow]);
    expect(result.set).toEqual([newRow]);
    expect(result.remove).toEqual([]);
  });

  it('marks a row for set when claims change from array to legacyUnreviewed', () => {
    const oldRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    };
    const newRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: legacyUnreviewed,
    };

    const result = planOrderings([newRow], [oldRow]);
    expect(result.set).toEqual([newRow]);
    expect(result.remove).toEqual([]);
  });

  it('treats same earlier/later from two sources as two separate rows', () => {
    const row1: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    };
    const row2: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-two',
      claims: ['claim/two'],
    };

    const result = planOrderings([row1, row2], [row1]);
    expect(result.set).toContainEqual(row2);
    expect(result.set).not.toContainEqual(row1);
    expect(result.remove).toEqual([]);
  });

  it('handles multiple rows with mix of adds, removes, and unchanged', () => {
    const row1: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one'],
    };
    const row2: OrderingRow = {
      earlier: 'event-b',
      later: 'event-c',
      source: 'source-one',
      claims: ['claim/two'],
    };
    const row3: OrderingRow = {
      earlier: 'event-c',
      later: 'event-d',
      source: 'source-one',
      claims: ['claim/three'],
    };
    const row4: OrderingRow = {
      earlier: 'event-d',
      later: 'event-e',
      source: 'source-one',
      claims: ['claim/four'],
    };

    const newRows = [row1, row2, row3];
    const liveRows = [row1, row2, row4];

    const result = planOrderings(newRows, liveRows);
    expect(result.set).toEqual([row3]);
    expect(result.remove).toEqual([row4]);
  });

  it('compares claims correctly with array containing multiple items', () => {
    const oldRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one', 'claim/two'],
    };
    const newRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one', 'claim/two'],
    };

    const result = planOrderings([newRow], [oldRow]);
    expect(result.set).toEqual([]);
    expect(result.remove).toEqual([]);
  });

  it('marks for set when claims array order differs', () => {
    const oldRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/one', 'claim/two'],
    };
    const newRow: OrderingRow = {
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: ['claim/two', 'claim/one'],
    };

    const result = planOrderings([newRow], [oldRow]);
    expect(result.set).toContainEqual(newRow);
  });
});
