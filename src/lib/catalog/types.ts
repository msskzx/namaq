import type { EventType, ParticipationRelation, ParticipationStatus } from '@/generated/prisma';
import type { RelationType } from '@/lib/relationship/types';

/** Writable only by the one-time migration, never by an authored module. */
export const legacyUnreviewed = 'legacy-unreviewed';

/** Claim keys from an approved batch, or the marker for data that predates evidence. */
export type Provenance = readonly [string, ...string[]] | typeof legacyUnreviewed;

export interface Cited<T> {
  readonly value: T;
  readonly claims: Provenance;
}

/** Keys are Prisma `Person` column names; scripts/data/projectCatalog.ts writes them by key. */
export interface CatalogPersonFields {
  readonly fullName?: Cited<string>;
  readonly kunya?: Cited<string>;
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
  readonly title: string;
  readonly claims: Provenance;
}

/**
 * Declared from one side only. The graph stores both, so the projector adds the
 * reciprocal: RECIPROCAL_INVERSES names it, and `inverse` picks which when that
 * list offers more than one, since SON's reciprocal is FATHER or MOTHER
 * depending on a parent's sex, which nothing here records.
 */
export interface CatalogRelation {
  readonly type: RelationType;
  readonly to: string;
  readonly inverse?: RelationType;
  readonly claims: Provenance;
}

/** A Qur'an verse the source ties to this person, by surah and ayah number. */
export interface CatalogAyah {
  readonly surah: number;
  readonly ayah: number;
  readonly claims: Provenance;
}

export interface CatalogPerson {
  readonly kind: 'PERSON';
  readonly slug: string;
  readonly name: string;
  readonly nameTransliterated?: string;
  /** False for a graph-only person, who is otherwise identical. */
  readonly hasProfile: boolean;
  readonly fields: CatalogPersonFields;
  readonly titles: readonly CatalogTitleAssignment[];
  readonly relations: readonly CatalogRelation[];
  readonly ayat?: readonly CatalogAyah[];
}

/**
 * Statuses a relation may carry. Attendance is the relation's job and outcome
 * the status's, so the two sets are disjoint and validateCatalog rejects a
 * crossing -- see docs/adr/0013-separate-attendance-from-outcome.md.
 */
export const STATUSES_BY_RELATION: Record<ParticipationRelation, readonly ParticipationStatus[]> = {
  PARTICIPATED_IN: ['MARTYRED', 'DIED', 'INJURED', 'CAPTURED', 'WAS_CAPTURED'],
  ABSENT_FROM: ['ABSENT_EXCUSED'],
};

export interface CatalogParticipation {
  readonly person: string;
  readonly isMuslim: boolean;
  /** Omitted means PARTICIPATED_IN: an absence is always stated outright. */
  readonly relation?: ParticipationRelation;
  readonly status?: readonly ParticipationStatus[];
  /** What the person did there, in the source's own wording. */
  readonly summary?: Cited<string>;
  readonly claims: Provenance;
}

/** Keys are Prisma `Battle` column names. */
export interface CatalogBattleFields {
  readonly hijriYear?: Cited<number>;
  readonly location?: Cited<string>;
}

/** Names only the participants its batch's focal subject brought, never the full roster. */
export interface CatalogBattle {
  readonly kind: 'BATTLE';
  readonly slug: string;
  readonly fields?: CatalogBattleFields;
  readonly participants: readonly CatalogParticipation[];
}

/** Keys of `fields` are Prisma `Event` column names. */
export interface CatalogEventFields {
  readonly hijriYear?: Cited<number>;
  readonly location?: Cited<string>;
  readonly description?: Cited<string>;
}

export interface CatalogEvent {
  readonly kind: 'EVENT';
  readonly slug: string;
  readonly name: string;
  readonly nameTransliterated?: string;
  readonly type: EventType;
  readonly fields: CatalogEventFields;
  readonly people: readonly { readonly person: string; readonly claims: Provenance }[];
}

export interface Catalog {
  readonly people: readonly CatalogPerson[];
  readonly battles: readonly CatalogBattle[];
  readonly events: readonly CatalogEvent[];
}
