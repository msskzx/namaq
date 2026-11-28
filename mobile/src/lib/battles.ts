import data from '@shared/data/battles/battles.json';
import type { AppBattle } from '@shared/battles/battle';

export const BATTLES = data as AppBattle[];

export const battleOf = (slug: string): AppBattle | undefined => BATTLES.find(battle => battle.slug === slug);
