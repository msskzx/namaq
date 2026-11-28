import { useSyncExternalStore } from 'react';
import { EMPTY_LIST, type ListState } from './listState';
import { isBoolean, isRecord, isString, readJson, writeJson } from './storage';
import { parseCardTint, type CardMode } from '@shared/cardTint';
import { isPenRule, type PenRule } from '@shared/quran/writeAyah';
import { isMarkMode, type MarkMode } from '@shared/quran/wordMatch';
import { HINT_IDS, HINTS_SEEN, type HintId } from '@shared/tabHints';
import { isAdhanAlerts, isAdhkarAlerts, NO_ADHKAR_ALERTS, NO_ALERTS, type AdhanAlerts, type AdhkarAlerts } from '@shared/adhanAlerts';
import { isSaidToday, type SaidToday } from '@shared/adhkarCount';
import { DEFAULT_PRAYER_SETTINGS, isPlace, isPrayerSettings, type Place, type PrayerSettings } from '@shared/prayer';

function setting<T>(key: string, fallback: T, valid: (value: unknown) => value is T) {
  const listeners = new Set<() => void>();
  let value: T | undefined;
  const get = () => {
    if (value === undefined) {
      value = readJson(key, valid) ?? fallback;
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


export const tourSeen = setting('tour-seen', false, isBoolean);

export type { HintId };
export const hintsSeen = setting<HintId[]>(HINTS_SEEN, [], (value): value is HintId[] => Array.isArray(value) && value.every(item => HINT_IDS.includes(item)));

export const mushafSpread = setting('mushaf-spread', true, isBoolean);

export const haptics = setting('haptics', true, isBoolean);

export const quizPageBefore = setting('quiz-page-before', false, isBoolean);

export const penRule = setting<PenRule>('pen-rule', 'whole', isPenRule);
export const quizPen = setting<PenRule | 'same'>('quiz-pen', 'same', (value): value is PenRule | 'same' => value === 'same' || isPenRule(value));
export function useQuizPen(): PenRule {
  const [rule] = penRule.use();
  const [quiz] = quizPen.use();
  return quiz === 'same' ? rule : quiz;
}

export type BranchView = 'tree' | 'matrix';

export const markMode = setting<MarkMode>('word-marks', 'kinds', isMarkMode);

export const connectors = setting('branches-connectors', false, isBoolean);

export const besideLayout = setting('compare-beside', false, isBoolean);

export const around = setting('branches-surround', false, isBoolean);

export const listState = setting<ListState>('branches-list', EMPTY_LIST, (value): value is ListState =>
  isRecord(value) && isString(value.query) && isRecord(value.filters) && (value.range == null || isRecord(value.range)) && (value.saved === undefined || isBoolean(value.saved)));

export type ThemeChoice = 'light' | 'dark' | 'system';
export const themeChoice = setting<ThemeChoice>('theme', 'system', (value): value is ThemeChoice => value === 'light' || value === 'dark' || value === 'system');

export type CardTints = Record<CardMode, string>;
export const cardTints = setting<CardTints>('card-tints', { light: 'paper', dark: 'dim' }, (value): value is CardTints =>
  !!value && typeof value === 'object' && parseCardTint('light', (value as CardTints).light) === (value as CardTints).light && parseCardTint('dark', (value as CardTints).dark) === (value as CardTints).dark);

export const prayerPlace = setting<Place | null>('prayer-place', null, (value): value is Place | null => value === null || isPlace(value));
export const prayerSettings = setting<PrayerSettings>('prayer-settings', DEFAULT_PRAYER_SETTINGS, isPrayerSettings);
export const adhanAlerts = setting<AdhanAlerts>('adhan-alerts', NO_ALERTS, isAdhanAlerts);
export const adhkarAlerts = setting<AdhkarAlerts>('adhkar-alerts', NO_ADHKAR_ALERTS, isAdhkarAlerts);
export type PrayerView = 'dial' | 'line';
export const prayerView = setting<PrayerView>('prayer-view', 'dial', (value): value is PrayerView => value === 'dial' || value === 'line');
export type UtilityView = 'tools' | 'adhkar';
export const utilityView = setting<UtilityView>('utilities-view', 'tools', (value): value is UtilityView => value === 'tools' || value === 'adhkar');


export const adhkarSaid = setting<SaidToday | null>('adhkar-said', null, (value): value is SaidToday | null => value === null || isSaidToday(value));
