// A person's «حياته» (owner, 2026-11-18): the timeline on every person page is the events, battles and sira stories the
// person is in, each with the quotes that place the person there, by year. Written from the catalog by
// scripts/battles/buildAppBattles.ts into shared/data/events/life.json; the person page (Tarajim) draws it. A person's own
// birth and death are the person's fields, not rows here.
import type { AppCite, AppCited } from '../battles/battle';

export type AppLifeEntry = {
  kind: 'event' | 'battle' | 'story';
  slug: string;
  name: string;
  /** The cited hijri year (negative: before the hijra), with every reading where the sources differ; none for an undated story. */
  year?: AppCited<number>;
  /** Battles: what the source says of the person there. */
  role?: 'شهدها' | 'استشهد فيها';
  /** The quotes that place the person in it. */
  refs: AppCite[];
};

/** Each person's entries (by slug), dated ones first by year, then the undated in the source's order. */
export type AppLife = Record<string, AppLifeEntry[]>;
