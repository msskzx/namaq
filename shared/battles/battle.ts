// A battle as the phone app shows it (owner, 2026-11-18), written from the catalog by scripts/battles/buildAppBattles.ts
// into shared/data/battles/battles.json, since the app is offline.
import type { LonLat } from './map';

/** One quote a value stands on, with the page it cites. */
export type AppCite = { text: string; cite: string; url?: string };
/** A value with the quotes it stands on; none while its evidence is still owed. */
export type AppCited<T> = { value: T; refs: AppCite[] };

export type AppPersonLink = { slug: string; name: string };

export type AppMoment = {
  title: string;
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
