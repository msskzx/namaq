import type { EventType, ParticipationStatus } from '@/generated/prisma';
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

/** Declared from one side only; the inverse is RECIPROCAL_INVERSES' job, not an author's. */
export interface CatalogRelation {
  readonly type: RelationType;
  readonly to: string;
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
}

export interface CatalogParticipation {
  readonly person: string;
  readonly isMuslim: boolean;
  readonly status?: readonly ParticipationStatus[];
  readonly claims: Provenance;
}

/** Names only the participants its batch's focal subject brought, never the full roster. */
export interface CatalogBattle {
  readonly kind: 'BATTLE';
  readonly slug: string;
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
  readonly battle?: string;
}

export interface Catalog {
  readonly people: readonly CatalogPerson[];
  readonly battles: readonly CatalogBattle[];
  readonly events: readonly CatalogEvent[];
}
