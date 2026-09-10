import type { RelationType } from '@/lib/relationship/types';

/**
 * The marker for a value migrated before evidence was recorded. Only the
 * one-time migration may write it; nothing else in the catalog may.
 */
export const legacyUnreviewed = 'legacy-unreviewed';

/**
 * What stands behind a historical value: claim keys from an approved batch, or
 * the baseline marker. There is no third option, so a value cannot enter the
 * catalog with nothing behind it
 * (docs/authoritative-data-workflow-plan.md).
 */
export type Provenance = readonly [string, ...string[]] | typeof legacyUnreviewed;

/** A historical value together with what supports it. */
export interface Cited<T> {
  readonly value: T;
  readonly claims: Provenance;
}

/**
 * The person fields that state something about history, mirroring the
 * historical columns of Prisma's `Person`. Identity (slug, name,
 * transliteration) and derived graph properties are not here: they carry
 * migration metadata rather than citations.
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

/** A title this person holds, named by the title's own slug. */
export interface CatalogTitleAssignment {
  readonly title: string;
  readonly claims: Provenance;
}

/**
 * A relationship written from this person's side. The projector normalizes it
 * through RECIPROCAL_INVERSES, so declaring it from either end describes the
 * same edge pair.
 */
export interface CatalogRelation {
  readonly type: RelationType;
  readonly to: string;
  readonly claims: Provenance;
}

/**
 * One person, profile-backed or graph-only. Both share this type and differ
 * only in `hasProfile`, so promoting a graph-only person keeps their slug and
 * relationships intact.
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
