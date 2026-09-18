import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import { legacyUnreviewed, STATUSES_BY_RELATION, type Catalog, type Provenance } from './types';

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

/** Reports every problem in one pass; an empty result means the catalog is projectable. */
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
    (subject.ayat ?? []).forEach((ayah) => {
      const at_ = `${at}.ayat.${ayah.surah}:${ayah.ayah}`;
      checkProvenance(ayah.claims, known, at_, issues);
      if (ayah.surah < 1 || ayah.surah > 114) issues.push({ path: at_, message: `no surah ${ayah.surah}` });
      if (ayah.ayah < 1) issues.push({ path: at_, message: `no ayah ${ayah.ayah}` });
    });
    subject.relations.forEach((relation) => {
      const to = `${at}.relations.${relation.type}`;
      checkProvenance(relation.claims, known, to, issues);
      if (!person(relation.to)) issues.push({ path: to, message: `unknown person ${relation.to}` });
      const reciprocals = RECIPROCAL_INVERSES[relation.type];
      if (!reciprocals) {
        issues.push({ path: to, message: `${relation.type} has no reciprocal` });
      } else if (relation.inverse && !reciprocals.includes(relation.inverse)) {
        issues.push({ path: to, message: `${relation.inverse} is not a reciprocal of ${relation.type}` });
      } else if (!relation.inverse && reciprocals.length > 1) {
        // The projector writes both directions, so an ambiguous reciprocal has
        // to be chosen by whoever read the source, not guessed here.
        issues.push({ path: to, message: `${relation.type} needs inverse: one of ${reciprocals.join(', ')}` });
      }
    });
  });

  catalog.battles.forEach((battle) => {
    const at = `battles/${battle.slug}`;
    if (!known.battles.has(battle.slug)) issues.push({ path: at, message: 'unknown battle' });
    battle.participants.forEach((entry) => {
      const where = `${at}.${entry.person}`;
      checkProvenance(entry.claims, known, where, issues);
      if (entry.summary) checkProvenance(entry.summary.claims, known, `${where}.summary`, issues);
      if (!person(entry.person)) issues.push({ path: at, message: `unknown person ${entry.person}` });

      // A row claiming both attendance and absence is what this model exists to
      // prevent, and Postgres cannot reject it: status is an array.
      const relation = entry.relation ?? 'PARTICIPATED_IN';
      const allowed = STATUSES_BY_RELATION[relation];
      (entry.status ?? [])
        .filter((status) => !allowed.includes(status))
        .forEach((status) => issues.push({ path: where, message: `${relation} cannot carry status ${status}` }));
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
  });

  return issues;
}
