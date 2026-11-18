// A sira story as the phone app shows it (owner, 2026-11-18): an event told whole as the source tells it, in moments,
// written from the catalog by scripts/battles/buildAppBattles.ts into shared/data/events/stories.json.
import type { AppCite, AppPersonLink } from '../battles/battle';

export type AppStoryMoment = { title: string; text: string; people: AppPersonLink[] };

/** One report, whole: its chain, its moments, and the source's words on who has it, with the page. */
export type AppReport = { isnad?: string; moments: AppStoryMoment[]; grading?: string; cite: string; url: string };

/** Ayat the story turns on, with the quotes that say so. */
export type AppStoryAyat = { label: string; from: string; to: string; refs: AppCite[];
  /** The source's other reports on it, each in its words and attributed («وفي رواية …»). */
  others?: { text: string; refs: AppCite[] }[] };

export type AppStory = {
  slug: string;
  name: string;
  /** Where it was, as the source names it, with its quotes. */
  place?: { value: string; refs: AppCite[] };
  tags: string[];
  people: AppPersonLink[];
  /** The first report is the story; the others are the source's other reports of it, shown folded. */
  reports: AppReport[];
  ayat: AppStoryAyat[];
};
