// docs/plans/data-model/plan.md, section 6.2 (the pilot's old-versus-new diff)
import { matchForm } from './span';
import type { ProfileEntry } from './profile';

export interface CatalogLike {
  fields?: Partial<
    Record<
      'fullName' | 'kunya' | 'appearance' | 'deathYearHijri' | 'placeOfDeathArabic',
      { value: string }
    >
  >;
  virtues?: { value: string }[];
  titles?: unknown[];
  ayat?: unknown[];
  relations?: { type: string; inverse?: string; to: string }[];
}

export interface DiffLine {
  field: string;
  status: 'same' | 'different' | 'catalog-only' | 'model-only';
  catalog?: string;
  model?: string;
}

const textFields = [
  ['fullName', 'name.full'],
  ['kunya', 'name.kunya'],
  ['appearance', 'appearance'],
  ['deathYearHijri', 'died.year'],
  ['placeOfDeathArabic', 'died.place'],
] as const;

const same = (a: string, b: string) => matchForm(a) === matchForm(b);

export function diffAgainstCatalog(entries: ProfileEntry[], catalog: CatalogLike) {
  const lines: DiffLine[] = [];
  const used = new Set<ProfileEntry>();
  const take = (predicate: string) => {
    const found = entries.filter((e) => e.predicate === predicate);
    found.forEach((e) => used.add(e));
    return found;
  };
  const line = (field: string, catalogValues: string[], modelValues: string[]) => {
    if (catalogValues.length === 0 && modelValues.length === 0) return;
    const catalogText = catalogValues.join(' | ');
    const modelText = modelValues.join(' | ');
    const status =
      modelValues.length === 0
        ? 'catalog-only'
        : catalogValues.length === 0
          ? 'model-only'
          : same(catalogText, modelText)
            ? 'same'
            : 'different';
    lines.push({ field, status, catalog: catalogText || undefined, model: modelText || undefined });
  };

  for (const [field, predicate] of textFields) {
    const value = catalog.fields?.[field]?.value;
    line(
      field,
      value ? [value] : [],
      take(predicate).map((e) => e.parts.join(' ')),
    );
  }
  line(
    'virtues',
    (catalog.virtues ?? []).map((v) => v.value),
    take('virtue').map((e) => e.parts.join(' ')),
  );

  const fathers = (catalog.relations ?? []).filter(
    (r) => r.type === 'SON' && r.inverse === 'FATHER',
  );
  line(
    'father',
    fathers.map((r) => r.to),
    take('CHILD_OF').map((e) => e.object ?? `(${e.objectMention})`),
  );

  for (const entry of entries.filter((e) => !used.has(e))) {
    lines.push({
      field: entry.predicate,
      status: 'model-only',
      model: entry.parsed !== undefined ? String(entry.parsed) : entry.parts.join(' '),
    });
  }
  for (const [field, list] of [
    ['titles', catalog.titles],
    ['ayat', catalog.ayat],
  ] as const) {
    if (list?.length)
      lines.push({ field, status: 'catalog-only', catalog: `${list.length} in the catalog` });
  }
  return lines;
}
