import type { RelationType } from '@/lib/relationship/types';

/** Writable only by the one-time migration, never by an authored module. */
export const legacyUnreviewed = 'legacy-unreviewed';

/** Claim keys from an approved batch (docs/authoritative-data-workflow-plan.md). */
export type Provenance = readonly [string, ...string[]] | typeof legacyUnreviewed;

export interface Cited<T> {
  readonly value: T;
  readonly claims: Provenance;
}

/**
 * Mirrors the historical columns of Prisma's `Person`. Identity and computed
 * graph properties are absent because a citation cannot speak to them.
 */
export interface CatalogPersonFields {
  readonly fullName?: Cited<string>;
  readonly appearance?: Cited<string>;
  readonly virtues?: Cited<string>;
  readonly birthYearHijri?: Cited<string>;
  readonly birthYearGregorian?: Cited<string>;
  readonly deathYearHijri?: Cited<string>;
  readonly deathYearGregorian?: Cited<string>;
  readonly placeOfBirthArabic?: Cited<string>;
  readonly placeOfBirthTransliterated?: Cited<string>;
  readonly placeOfDeathArabic?: Cited<string>;
  readonly placeOfDeathTransliterated?: Cited<string>;
}

export interface CatalogTitleAssignment {
  /** The title's slug, not its display name. */
  readonly title: string;
  readonly claims: Provenance;
}

/**
 * Written from this person's side. Both directed edges are derived through
 * RECIPROCAL_INVERSES in src/lib/relationship/categories.ts, so declaring the
 * inverse from the other endpoint would duplicate this, not add to it.
 */
export interface CatalogRelation {
  readonly type: RelationType;
  readonly to: string;
  readonly claims: Provenance;
}

/**
 * Profile-backed and graph-only people differ only in `hasProfile`, so
 * promotion changes that flag and leaves slug and relationships untouched.
 */
export interface CatalogPerson {
  readonly kind: 'PERSON';
  readonly slug: string;
  readonly name: string;
  readonly nameTransliterated?: string;
  readonly hasProfile: boolean;
  readonly fields: CatalogPersonFields;
  readonly titles: readonly CatalogTitleAssignment[];
  readonly relations: readonly CatalogRelation[];
}
