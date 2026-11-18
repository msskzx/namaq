import data from '@shared/data/events/life.json';
import type { AppLife, AppLifeEntry } from '@shared/events/life';

/** Each person's «حياته» (shared/events/life.ts): written from the catalog by scripts/battles/buildAppBattles.ts. */
const LIFE = data as AppLife;

/** The events, battles and sira stories a person is in, dated by year first, then the undated stories. */
export const lifeOf = (slug: string): AppLifeEntry[] => LIFE[slug] ?? [];
