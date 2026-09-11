import { legacyUnreviewed, type Catalog, type Provenance } from './types';

export interface ValueProvenance {
  /** Subject the value belongs to, as `<kind>/<slug>`. */
  readonly subject: string;
  /** Path to the value within its module, such as `fields.deathYearHijri`. */
  readonly path: string;
  readonly claims: Provenance;
}

/** Every `claims` array in a module, however deeply nested. */
function walk(node: unknown, where: string): [string, Provenance][] {
  if (Array.isArray(node)) return node.flatMap((item, i) => walk(item, `${where}[${i}]`));
  if (node === null || typeof node !== 'object') return [];

  return Object.entries(node).flatMap(([key, value]) =>
    key === 'claims' ? [[where, value as Provenance]] : walk(value, where ? `${where}.${key}` : key),
  );
}

export function catalogProvenance(catalog: Catalog): ValueProvenance[] {
  const modules = [
    ...catalog.people.map((subject) => [`people/${subject.slug}`, subject] as const),
    ...catalog.battles.map((subject) => [`battles/${subject.slug}`, subject] as const),
    ...catalog.events.map((subject) => [`events/${subject.slug}`, subject] as const),
  ];

  return modules.flatMap(([subject, module]) =>
    walk(module, '').map(([path, claims]) => ({ subject, path, claims })),
  );
}

/** Values in use whose evidence is still owed. */
export function awaitingEvidence(catalog: Catalog): ValueProvenance[] {
  return catalogProvenance(catalog).filter((value) => value.claims === legacyUnreviewed);
}
