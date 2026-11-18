// A battle as the phone app shows it (owner, 2026-11-18), written from the catalog by scripts/battles/buildAppBattles.ts
// into shared/data/battles/battles.json, since the app is offline.
import type { LonLat } from './map';

/** One quote a value stands on, with the page it cites. */
export type AppCite = { text: string; cite: string; url?: string };
/** Another reading of a value, as the source words it («وقيل …»), with its own quotes. */
export type AppReading = { text: string; refs: AppCite[] };
/**
 * A value with the quotes it stands on, and the other readings where the sources differ (owner, 2026-11-18: a disputed
 * point is shown with every reading, each attributed and referenced).
 */
export type AppCited<T> = { value: T; refs: AppCite[]; others?: AppReading[] };

export type AppPersonLink = { slug: string; name: string };

export type AppMoment = {
  title: string;
  /** Who the source has the report from, shown with its reference. */
  isnad?: string;
  /** The whole report, as the source prints it. */
  quote: string;
  grading: string;
  cite: string;
  url: string;
  people: AppPersonLink[];
};

export type AppBattle = {
  slug: string;
  name: string;
  /** غزوة, سرية or معركة. */
  kind?: AppCited<string>;
  year?: AppCited<number>;
  /** The source's own name for the place. */
  location?: AppCited<string>;
  /** Where we pin it on the map (shared/battles/places.ts). */
  place?: { name: string; at: LonLat };
  counts: { muslims?: AppCited<number>; others?: AppCited<number>; muslimsKilled?: AppCited<number>; othersKilled?: AppCited<number> };
  moments: AppMoment[];
  martyrs: AppPersonLink[];
  present: AppPersonLink[];
};

export const KIND_NAMES: Record<string, string> = { GHAZWAH: 'غزوة', SARIYYAH: 'سرية', BATTLE: 'معركة' };

/** A battle with moments, as the home feed's moment card needs it. */
export type AppMomentBattle = Pick<AppBattle, 'slug' | 'name' | 'kind' | 'year' | 'moments'>;
