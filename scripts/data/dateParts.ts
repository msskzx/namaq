// docs/plans/time-layer.md
import type { Catalog } from '../../src/lib/catalog/types';

export interface DatePartRow {
  readonly kind: 'EVENT' | 'BATTLE';
  readonly slug: string;
  readonly month: number | null;
  readonly day: number | null;
}

const inRange = (value: number, max: number) => Number.isInteger(value) && value >= 1 && value <= max;

export function dateRows(catalog: Pick<Catalog, 'battles' | 'events'>) {
  const rows: DatePartRow[] = [];
  const invalid: string[] = [];
  const skipped = new Set<string>();
  const subjects = [
    ...catalog.battles.map((s) => ({ kind: 'BATTLE' as const, slug: s.slug, parts: s.dateParts })),
    ...catalog.events.map((s) => ({ kind: 'EVENT' as const, slug: s.slug, parts: s.dateParts })),
  ];
  for (const { kind, slug, parts } of subjects) {
    const month = parts?.hijriMonth?.value ?? null;
    const day = parts?.hijriDay?.value ?? null;
    if (month === null && day === null) continue;
    const at = `${kind.toLowerCase()}s/${slug}.dateParts`;
    const problem =
      month !== null && !inRange(month, 12)
        ? `month ${month} is not 1 to 12`
        : day !== null && month === null
          ? 'a day needs a month'
          : day !== null && !inRange(day, 30)
            ? `day ${day} is not 1 to 30`
            : undefined;
    if (problem) {
      invalid.push(`${at}: ${problem}`);
      skipped.add(`${kind}/${slug}`);
    } else rows.push({ kind, slug, month, day });
  }
  return { rows, invalid, skipped };
}

const key = (row: { kind: string; slug: string }) => `${row.kind}/${row.slug}`;

export function planDateParts(
  rows: readonly DatePartRow[],
  live: readonly DatePartRow[],
  skipped: ReadonlySet<string> = new Set(),
) {
  const held = new Map(live.map((row) => [key(row), row]));
  return {
    set: rows.filter((row) => {
      const was = held.get(key(row));
      return was?.month !== row.month || was?.day !== row.day;
    }),
    remove: live.filter((row) => !skipped.has(key(row)) && !rows.some((wanted) => key(wanted) === key(row))),
  };
}
