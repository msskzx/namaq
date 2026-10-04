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

const sameSet = (a: string[], b: string[]) => {
  const left = new Set(a.map(matchForm));
  const right = new Set(b.map(matchForm));
  return left.size === right.size && [...left].every((value) => right.has(value));
};

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
          : sameSet(catalogValues, modelValues)
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

  const isParent = (r: { type: string; inverse?: string }) =>
    (r.type === 'SON' || r.type === 'DAUGHTER') &&
    (r.inverse === 'FATHER' || r.inverse === 'MOTHER');
  const relations = catalog.relations ?? [];
  line(
    'parents',
    relations.filter(isParent).map((r) => r.to),
    take('CHILD_OF').map((e) => e.object ?? `(${e.objectMention})`),
  );

  for (const entry of entries.filter((e) => !used.has(e))) {
    lines.push({
      field: entry.predicate,
      status: 'model-only',
      model: entry.parsed !== undefined ? String(entry.parsed) : entry.parts.join(' '),
    });
  }
  const others = relations.filter((r) => !isParent(r));
  for (const type of new Set(others.map((r) => r.type))) {
    const targets = others.filter((r) => r.type === type).map((r) => r.to);
    lines.push({ field: `relation ${type}`, status: 'catalog-only', catalog: targets.join(' | ') });
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
