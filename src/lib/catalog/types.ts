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

export type ParticipationStatus = 'DIED' | 'INJURED' | 'CAPTURED' | 'WAS_CAPTURED' | 'ABSENT_EXCUSED' | 'MARTYRED';

export interface CatalogParticipation {
  readonly person: string;
  readonly isMuslim: boolean;
  readonly status?: readonly ParticipationStatus[];
  readonly claims: Provenance;
}

/**
 * Carries only the participants a batch's focal subject brought with it, so a
 * module here names far fewer people than fought. Projection upserts and never
 * prunes, matching the existing syncs, so a partial roster adds rather than
 * replaces.
 */
export interface CatalogBattle {
  readonly kind: 'BATTLE';
  readonly slug: string;
  readonly participants: readonly CatalogParticipation[];
}

export type EventType =
  | 'BIRTH' | 'DEATH' | 'MARRIAGE' | 'BATTLE' | 'GAVE_BIRTH'
  | 'LIBERATED' | 'MET' | 'TRAVEL' | 'HIJRA' | 'HIJRA_HABASHA' | 'OTHER';

/**
 * Fields are optional because the entry that occasions an event rarely states
 * all of them, and the version-one policy leaves an unknown value unset rather
 * than filling it from elsewhere (docs/authoritative-data-workflow-plan.md).
 */
export interface CatalogEvent {
  readonly kind: 'EVENT';
  readonly slug: string;
  readonly name: string;
  readonly nameTransliterated?: string;
  readonly type: EventType;
  readonly fields: {
    readonly hijriYear?: Cited<number>;
    readonly location?: Cited<string>;
    readonly description?: Cited<string>;
  };
  readonly people: readonly { readonly person: string; readonly claims: Provenance }[];
  readonly battle?: string;
}
