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

/**
 * How the cited source ties an ayah to a person (docs/quiz-ayah-revealed.md):
 * REVEALED_ABOUT «نزلت فيه», the source says it was revealed about him or her;
 * DESCRIBES «ذُكر فيمن تصفهم», he or she is among those the ayah describes;
 * ACTED_ON «عمل بها», he or she read it and acted on it;
 * READ_AS_ABOUT «قرأها فيه فلان», someone the source quotes reads it as about him or her;
 * IN_STORY «في خبره», it came down during an event of his or her life.
 * Only REVEALED_ABOUT may carry `revealedAbout` or become an «فيمن نزلت» question.
 */
export type AyahLinkKind = 'REVEALED_ABOUT' | 'DESCRIBES' | 'ACTED_ON' | 'READ_AS_ABOUT' | 'IN_STORY';

/** A Qur'an verse the source ties to this person, by surah and ayah number. */
// docs/quiz-ayah-revealed.md
export interface CatalogAyah {
  readonly surah: number;
  readonly ayah: number;
  readonly kind: AyahLinkKind;
  readonly claims: Provenance;
  readonly revealedAbout?: {
    readonly with?: readonly string[];
    readonly alsoUnnamed?: true;
    /** The question's own wording, when «فيمن نزلت هذه الآية؟» would say more than the source does. */
    readonly prompt?: string;
  };
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

/**
 * A moment in a battle, told in the source's own words (owner, 2026-11-18: the battle page's key moments). Only a report
 * the source itself places in al-Bukhari or Muslim becomes one (AGENTS.md, "Established claims only"), and only a point
 * the reports agree on: where they differ, as over who duelled whom at Badr, the moment keeps what they share.
 */
export interface CatalogMoment {
  /** A few words naming the moment. Ours, not the source's. */
  readonly title: string;
  /** Who the source has the report from, its words as printed, just before the quote (none when the report has no chain). */
  readonly isnad?: string;
  /**
   * The whole report after its chain, exactly as the pages print it, up to its grading (owner, 2026-11-18: nothing is
   * cut). A report that runs across a page break joins the pages' text with one space.
   */
  readonly quote: string;
  /**
   * `volume` is the source's folder (v1, v2…); `volumeLabel` is the volume as the book prints it, e.g. «السيرة 1».
   * `endPage` is the last page the report runs onto, when it is not `page`.
   */
  readonly source: { readonly slug: string; readonly volume: number; readonly volumeLabel: string; readonly page: number; readonly endPage?: number; readonly url: string };
  /** The source's own words placing the report, such as أخرجه البخاري, printed on the same page. */
  readonly grading: string;
  /** Who the moment is about, by catalog slug. */
  readonly people: readonly string[];
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
  /** In the order they happened. */
  readonly moments?: readonly CatalogMoment[];
}

/** Keys of `fields` are Prisma `Event` column names. */
export interface CatalogEventFields {
  readonly hijriYear?: Cited<number>;
  readonly location?: Cited<string>;
  readonly description?: Cited<string>;
}

/**
 * One report of a story, whole (owner, 2026-11-18: nothing is cut), told as its moments: the moments' texts, joined with
 * a space, are the report after its chain exactly as the pages print it. Across a page break the pages' text joins with
 * one space too.
 */
/** A book's pages, or one hadith of a hadith book by its number (data/history/sources/<slug>/hadith/<number>.md). */
export type CatalogReportSource =
  | { readonly slug: string; readonly volume: number; readonly volumeLabel: string; readonly page: number; readonly endPage?: number; readonly url: string }
  | { readonly slug: string; readonly hadith: number; readonly url: string };

export const isHadithSource = (source: CatalogReportSource): source is Extract<CatalogReportSource, { hadith: number }> => 'hadith' in source;

export interface CatalogReport {
  /** Who the source has the report from, as printed, just before the first moment. */
  readonly isnad?: string;
  readonly source: CatalogReportSource;
  /** The source's own words placing the report, such as أخرجه مسلم, printed right after it. None when the source gives none. */
  readonly grading?: string;
  readonly moments: readonly {
    /** A few words naming the moment. Ours. */
    readonly title: string;
    readonly text: string;
    readonly people: readonly string[];
    /**
     * The moment split where its speaker changes (owner, 2026-11-21), for the story drawn as a conversation («الرسم»).
     * Joined with one space they are `text`. A story draws its bubbles only when every moment of its first report has them.
     */
    readonly turns?: readonly CatalogTurn[];
  }[];
}

/**
 * One speaker's words in a story, or the narrator's between them. The bubble holds the words after `lead`; the speaker
 * is taken only from the source: the lead-in names him («فقال رسول الله ﷺ:»), or `witness` quotes a book that does
 * (owner, 2026-11-21: a bare «فقال» is never our reading).
 */
export interface CatalogTurn {
  readonly text: string;
  /** Who speaks; none for the narrator's own words, which are drawn outside any bubble. */
  readonly speaker?: {
    /** By catalog slug, when the catalog has him; then he keeps one colour in the story. */
    readonly person?: string;
    /** As the lead-in or the witness calls him; what a tap on his icon shows. */
    readonly name: string;
  };
  /** The source's words that bring the speech in, the start of `text` («قَالَ فَقَالَ:»). */
  readonly lead?: string;
  /** A book that says who speaks, when the lead-in does not name him: its words, as printed on the page. */
  readonly witness?: { readonly source: string; readonly volume: number; readonly volumeLabel: string; readonly page: number; readonly quote: string; readonly url: string };
}

/** Our tags for gathering stories (owner, 2026-11-18). */
export const STORY_TAGS = { ISLAM: 'إسلامهم', HEARD_QURAN: 'سمعوا القرآن', HIS_WORDS: 'من كلامه ﷺ', REVEALED_ABOUT: 'فيمن نزلت' } as const;
export type StoryTag = keyof typeof STORY_TAGS;

/** Ayat a story turns on: the ones recited in it, or revealed about it, with the quotes that say so. */
/** A book's page (`page`), or a hadith book's hadith (`hadith`, its number). */
export type CatalogStoryEvidence =
  | { readonly source: string; readonly page: number; readonly volume?: number; readonly volumeLabel?: string; readonly quote: string; readonly url?: string }
  | { readonly source: string; readonly hadith: number; readonly quote: string; readonly url: string };

export interface CatalogStoryAyat {
  readonly kind: 'RECITED' | 'REVEALED_ABOUT';
  /** REVEALED_ABOUT: the person the evidence names (a person's slug). */
  readonly about?: string;
  /** Whose report the range is, when the source's reports differ on it («في رواية جابر»). */
  readonly report?: string;
  /** surah:ayah, first and last. */
  readonly from: string;
  readonly to: string;
  readonly evidence: readonly CatalogStoryEvidence[];
  /** The other reports' words on it, each attributed (owner, 2026-11-18: disputed points shown attributed, not dropped). */
  readonly others?: readonly { readonly label: string; readonly evidence: readonly CatalogStoryEvidence[] }[];
}

export interface CatalogEvent {
  readonly kind: 'EVENT';
  readonly slug: string;
  readonly name: string;
  readonly nameTransliterated?: string;
  readonly type: EventType;
  readonly fields: CatalogEventFields;
  readonly dateParts?: CatalogDateParts;
  /** A story's person may stand on its reports instead of a claim: then a moment of the reports must name them. */
  readonly people: readonly { readonly person: string; readonly claims?: Provenance }[];
  /** The story as the source tells it: the first report is the story, the others are the source's other reports of it. */
  readonly reports?: readonly CatalogReport[];
  readonly tags?: readonly StoryTag[];
  readonly ayat?: readonly CatalogStoryAyat[];
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

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
export interface CatalogOrdering {
  readonly kind: 'ORDERING';
  readonly earlier: string;
  readonly later: string;
  readonly source: string;
  readonly claims: Provenance;
}

export interface Catalog {
  readonly orderings?: readonly CatalogOrdering[];
  readonly people: readonly CatalogPerson[];
  readonly battles: readonly CatalogBattle[];
  readonly events: readonly CatalogEvent[];
  readonly utterances: readonly CatalogUtterance[];
}
