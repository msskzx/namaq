// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
import { legacyUnreviewed, type Catalog } from '../../src/lib/catalog/types';

export interface OrderingRow {
  readonly earlier: string;
  readonly later: string;
  readonly source: string;
  readonly claims: readonly string[] | typeof legacyUnreviewed;
}

const key = (row: { earlier: string; later: string; source: string }) => `${row.earlier}/${row.later}/${row.source}`;
const sameClaims = (a: OrderingRow['claims'], b: OrderingRow['claims']) => JSON.stringify(a) === JSON.stringify(b);

export function orderingRows(catalog: Pick<Catalog, 'orderings'>): OrderingRow[] {
  return (catalog.orderings ?? []).map(({ earlier, later, source, claims }) => ({ earlier, later, source, claims }));
}

export function planOrderings(rows: readonly OrderingRow[], live: readonly OrderingRow[]) {
  const held = new Map(live.map((row) => [key(row), row]));
  return {
    set: rows.filter((row) => {
      const was = held.get(key(row));
      return !was || !sameClaims(was.claims, row.claims);
    }),
    remove: live.filter((row) => !rows.some((wanted) => key(wanted) === key(row))),
  };
}
