import data from '@shared/data/battles/battles.json';
import type { AppBattle } from '@shared/battles/battle';

/** The battles in the app, earliest first: written from the catalog by scripts/battles/buildAppBattles.ts. */
export const BATTLES = data as AppBattle[];

export const battleOf = (slug: string): AppBattle | undefined => BATTLES.find(battle => battle.slug === slug);
