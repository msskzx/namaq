import { useSyncExternalStore } from 'react';
import { EMPTY_LIST, type ListState } from './branchList';
import { readJson, writeJson } from './storage';
import { parseCardTint, type CardMode } from '@shared/cardTint';
import { isAdhanAlerts, NO_ALERTS, type AdhanAlerts } from '@shared/adhanAlerts';
import { DEFAULT_PRAYER_SETTINGS, isPlace, isPrayerSettings, type Place, type PrayerSettings } from '@shared/prayer';

/** A value kept on the phone that every screen reading it follows. */
function setting<T>(key: string, fallback: T, valid: (value: unknown) => value is T) {
  const listeners = new Set<() => void>();
  let value: T | undefined;
  const get = () => {
    if (value === undefined) {
      const stored = readJson<unknown>(key);
      value = valid(stored) ? stored : fallback;
    }
    return value;
  };
  const set = (next: T) => {
    value = next;
    writeJson(key, next);
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
  const use = () => [useSyncExternalStore(subscribe, get, get), set] as const;
  return { get, set, use, subscribe };
}

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/** The first-launch tour ran or was skipped; the settings sheet clears it to play the tour again. */
export const tourSeen = setting('tour-seen', false, isBoolean);

/** The first-visit hints already shown (TabHint.tsx), by page; replaying the tour clears them too. */
export type HintId = 'read' | 'branches' | 'compare' | 'prophets' | 'utilities';
export const hintsSeen = setting<HintId[]>('hints-seen', [], (value): value is HintId[] => Array.isArray(value) && value.every(item => typeof item === 'string'));

/** A light tap from the phone when a card's or an ayah's icon menu opens. */
export const haptics = setting('haptics', true, isBoolean);

/** Tree or matrix: the website's default-view setting. */
export type BranchView = 'tree' | 'matrix';
export const branchView = setting<BranchView>('branches-view', 'tree', (value): value is BranchView => value === 'tree' || value === 'matrix');

/** The website's «ربط الكلمات المتشابهة بخطوط تلقائيًا»: a matrix of a book group opens with its word connections drawn. */
export const connectors = setting('branches-connectors', false, isBoolean);

/** The surrounding-ayat switch: one setting for every tree and matrix on the branches tab. */
export const around = setting('branches-surround', false, isBoolean);

/** The filters, search and surah narrowing the trees, kept so the tab opens as it was left. */
export const listState = setting<ListState>('branches-list', EMPTY_LIST, (value): value is ListState =>
  !!value && typeof value === 'object' && typeof (value as ListState).query === 'string' && typeof (value as ListState).filters === 'object');

/** The settings sheet's look: light, dark, or as the phone is set. */
export type ThemeChoice = 'light' | 'dark' | 'system';
export const themeChoice = setting<ThemeChoice>('theme', 'system', (value): value is ThemeChoice => value === 'light' || value === 'dark' || value === 'system');

/** The card colour chosen for each mode on the theme tiles (shared/cardTint.ts). */
export type CardTints = Record<CardMode, string>;
export const cardTints = setting<CardTints>('card-tints', { light: 'paper', dark: 'dim' }, (value): value is CardTints =>
  !!value && typeof value === 'object' && parseCardTint('light', (value as CardTints).light) === (value as CardTints).light && parseCardTint('dark', (value as CardTints).dark) === (value as CardTints).dark);

/** The utilities tab: where the prayer times are for (null until the person picks), the method and Asr school, and the view last open. */
export const prayerPlace = setting<Place | null>('prayer-place', null, (value): value is Place | null => value === null || isPlace(value));
export const prayerSettings = setting<PrayerSettings>('prayer-settings', DEFAULT_PRAYER_SETTINGS, isPrayerSettings);
/** Which of the five prayers ring a notification at their time; all off until the person turns one on. */
export const adhanAlerts = setting<AdhanAlerts>('adhan-alerts', NO_ALERTS, isAdhanAlerts);
export type UtilityView = 'times' | 'qibla' | 'calendar';
export const utilityView = setting<UtilityView>('utilities-view', 'times', (value): value is UtilityView => value === 'times' || value === 'qibla' || value === 'calendar');
