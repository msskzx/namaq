import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import { legacyUnreviewed, type Catalog, type Provenance } from './index';

export interface CatalogIssue {
  readonly path: string;
  readonly message: string;
}

/** Slugs a catalog module may point at that this repository does not author. */
export interface KnownSlugs {
  readonly people: ReadonlySet<string>;
  readonly titles: ReadonlySet<string>;
  readonly battles: ReadonlySet<string>;
  /** Claim keys from every approved batch. */
  readonly claims: ReadonlySet<string>;
}

function checkProvenance(claims: Provenance, known: KnownSlugs, path: string, issues: CatalogIssue[]) {
  if (claims === legacyUnreviewed) return;
  if (claims.length === 0) issues.push({ path, message: 'no claim behind this value' });
  claims
    .filter((key) => !known.claims.has(key))
    .forEach((key) => issues.push({ path, message: `no batch declares claim ${key}` }));
}

/**
 * Reports every problem rather than throwing on the first, so one run tells an
 * author everything to fix. An empty result means the catalog is projectable.
 */
export function validateCatalog(catalog: Catalog, known: KnownSlugs): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const authored = new Set(catalog.people.map((person) => person.slug));
  const person = (slug: string) => authored.has(slug) || known.people.has(slug);

  catalog.people.forEach((subject) => {
    const at = `people/${subject.slug}`;
    Object.entries(subject.fields).forEach(([field, cited]) => {
      if (cited) checkProvenance(cited.claims, known, `${at}.${field}`, issues);
    });
    subject.titles.forEach((title) => {
      checkProvenance(title.claims, known, `${at}.titles.${title.title}`, issues);
      if (!known.titles.has(title.title)) issues.push({ path: at, message: `unknown title ${title.title}` });
    });
    subject.relations.forEach((relation) => {
      const to = `${at}.relations.${relation.type}`;
      checkProvenance(relation.claims, known, to, issues);
      if (!person(relation.to)) issues.push({ path: to, message: `unknown person ${relation.to}` });
      // The opposite edge is derived, so a type with no inverse would reach the
      // graph one-directional (src/lib/relationship/categories.ts).
      if (!(relation.type in RECIPROCAL_INVERSES)) {
        issues.push({ path: to, message: `${relation.type} has no reciprocal` });
      }
    });
  });

  catalog.battles.forEach((battle) => {
    const at = `battles/${battle.slug}`;
    if (!known.battles.has(battle.slug)) issues.push({ path: at, message: 'unknown battle' });
    battle.participants.forEach((entry) => {
      checkProvenance(entry.claims, known, `${at}.${entry.person}`, issues);
      if (!person(entry.person)) issues.push({ path: at, message: `unknown person ${entry.person}` });
    });
  });

  catalog.events.forEach((event) => {
    const at = `events/${event.slug}`;
    Object.entries(event.fields).forEach(([field, cited]) => {
      if (cited) checkProvenance(cited.claims, known, `${at}.${field}`, issues);
    });
    event.people.forEach((entry) => {
      checkProvenance(entry.claims, known, `${at}.${entry.person}`, issues);
      if (!person(entry.person)) issues.push({ path: at, message: `unknown person ${entry.person}` });
    });
    if (event.battle && !known.battles.has(event.battle)) {
      issues.push({ path: at, message: `unknown battle ${event.battle}` });
    }
  });

  return issues;
}
