import type { PersonBase } from './person';

/** POETRY or SAYING; the vocabulary lives in src/lib/catalog/types.ts. */
export type UtteranceKind = 'POETRY' | 'SAYING';

type Named = { slug: string; name: string; nameTransliterated: string | null };

/**
 * Something someone said, in verse or in prose. `speaker` is set when the app
 * has a subject for them and `speakerName` when it does not, never both --
 * see docs/adr/0015-one-record-for-what-someone-said.md.
 */
export interface Utterance {
  id: string;
  slug: string;
  kind: UtteranceKind;
  textArabic: string;
  speaker: PersonBase | null;
  speakerName: string | null;
  subject: PersonBase | null;
  /** The source's own words about its own report, never the app's. */
  grading: string | null;
  occasion: string | null;
  event: Named | null;
  battle: Named | null;
}
