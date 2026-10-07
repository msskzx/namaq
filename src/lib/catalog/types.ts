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
/**
 * A person's sex, which the sources state plainly (رجل, امرأة, a martyr roster
 * counted as أربعة عشر رجلا) and which the graph needs: SON pairs with FATHER
 * or MOTHER and FATHER with SON or DAUGHTER, and nothing in a relation's text
 * says which. See src/lib/catalog/relations.ts.
 */
export const SEXES = ['MALE', 'FEMALE'] as const;
export type Sex = (typeof SEXES)[number];

export interface CatalogPersonFields {
  readonly sex: Cited<Sex>;
  readonly fullName?: Cited<string>;
  readonly kunya?: Cited<string>;
  /**
   * How the source places the person among the clans, in its own words:
   * النمري, الفهري, حليف بني زهرة. A name rather than a relationship, so the
   * graph grows no Tribe node -- see README, "What is implemented".
   */
  readonly tribalAffiliation?: Cited<string>;
  readonly appearance?: Cited<string>;
  readonly birthYearHijri?: Cited<string>;
  readonly birthYearGregorian?: Cited<string>;
  readonly deathYearHijri?: Cited<string>;
  readonly deathYearGregorian?: Cited<string>;
  readonly placeOfBirthArabic?: Cited<string>;
  readonly placeOfBirthTransliterated?: Cited<string>;
  readonly placeOfDeathArabic?: Cited<string>;
  readonly placeOfDeathTransliterated?: Cited<string>;
}

/**
 * A title has no existence apart from the people who hold it, so its display
 * name travels with every assignment rather than living in a separate list
 * -- the projector upserts the Title row from whichever assignment it sees,
 * the same operation whether the row exists yet or not.
 */
export interface CatalogTitleAssignment {
  readonly title: string;
  readonly name: string;
  readonly nameTransliterated: string;
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

/** One virtue, in one speaker's exact words -- see docs/adr/0020-a-virtue-is-one-entry-with-one-speaker.md. */
export interface CatalogVirtue {
  readonly value: string;
  /** Absent means al-Dhahabi narrating or reporting a verdict in his own sentence. */
  readonly speaker?: { readonly name: string; readonly slug?: string };
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
  readonly virtues?: readonly CatalogVirtue[];
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

/**
 * What kind of engagement a Battle row records. GHAZWAH and SARIYYAH are the
 * sira's own two words: al-Dhahabi writes غزوة when the Prophet went out
 * himself and بعث or سرية when he sent a detachment without going, so the value
 * is cited from the heading rather than assigned. BATTLE is everything outside
 * his campaigns, which the book calls معركة or فتح.
 */
export const ENGAGEMENTS = ['GHAZWAH', 'SARIYYAH', 'BATTLE'] as const;
export type Engagement = (typeof ENGAGEMENTS)[number];

/** Keys are Prisma `Battle` column names. */
export interface CatalogBattleFields {
  readonly hijriYear?: Cited<number>;
  readonly location?: Cited<string>;
  readonly engagement?: Cited<Engagement>;
  /**
   * One figure each, and only where a source states it. The sources count the
   * two sides separately and disagree often enough that a single combined
   * number would be a choice nobody made; where they compete, the module takes
   * one reading and the others stay as DISPUTED claims in the batch.
   */
  readonly muslimForceCount?: Cited<number>;
  readonly nonMuslimForceCount?: Cited<number>;
  readonly muslimDeathCount?: Cited<number>;
  readonly nonMuslimDeathCount?: Cited<number>;
}

// docs/plans/time-layer.md
export interface CatalogDateParts {
  readonly hijriMonth?: Cited<number>;
  readonly hijriDay?: Cited<number>;
}

/** Names only the participants its batch's focal subject brought, never the full roster. */
export interface CatalogBattle {
  readonly kind: 'BATTLE';
  readonly slug: string;
  /** Required because the projector creates the row when none exists. */
  readonly name: string;
  readonly nameTransliterated?: string;
  readonly fields?: CatalogBattleFields;
  readonly dateParts?: CatalogDateParts;
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
  readonly dateParts?: CatalogDateParts;
  readonly people: readonly { readonly person: string; readonly claims: Provenance }[];
}

/**
 * Verse or prose. The sira quotes both and treats them the same way, as
 * somebody's words reported with an isnad, so one record holds both and the
 * kind says which. See docs/adr/0015-one-record-for-what-someone-said.md.
 */
export const UTTERANCE_KINDS = ['POETRY', 'SAYING'] as const;
export type UtteranceKind = (typeof UTTERANCE_KINDS)[number];

/** Keys are Prisma `Utterance` column names, apart from the two slug links. */
export interface CatalogUtteranceFields {
  /**
   * The poet or speaker the app has no subject for, which is the common case
   * in the sira's verse. Naming him here does not make him a node.
   */
  readonly speakerName?: Cited<string>;
  /** What the source says about how sound the report is, in its own words. */
  readonly grading?: Cited<string>;
  /** What the source says the occasion was, in its own wording. */
  readonly occasion?: Cited<string>;
}

export interface CatalogUtterance {
  readonly kind: 'UTTERANCE';
  readonly slug: string;
  readonly utteranceKind: UtteranceKind;
  /** The words as the source prints them; verse keeps its line breaks. */
  readonly textArabic: Cited<string>;
  /** Whose words these are, when the app has a subject for them. */
  readonly speaker?: string;
  /** Who they are about, where the source says so and the app has them. */
  readonly subject?: string;
  readonly event?: string;
  readonly battle?: string;
  readonly fields: CatalogUtteranceFields;
}

export interface Catalog {
  readonly people: readonly CatalogPerson[];
  readonly battles: readonly CatalogBattle[];
  readonly events: readonly CatalogEvent[];
  readonly utterances: readonly CatalogUtterance[];
}
