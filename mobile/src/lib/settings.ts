import { useSyncExternalStore } from 'react';
import { EMPTY_LIST, type ListState } from './listState';
import { readJson, writeJson } from './storage';
import { parseCardTint, type CardMode } from '@shared/cardTint';
import { isPenRule, type PenRule } from '@shared/quran/writeAyah';
import { isMarkMode, type MarkMode } from '@shared/quran/wordMatch';
import { HINT_IDS, HINTS_SEEN, type HintId } from '@shared/tabHints';
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
export type { HintId };
export const hintsSeen = setting<HintId[]>(HINTS_SEEN, [], (value): value is HintId[] => Array.isArray(value) && value.every(item => HINT_IDS.includes(item)));

/** A light tap from the phone when a card's or an ayah's icon menu opens. */
export const haptics = setting('haptics', true, isBoolean);

/**
 * A recite or which-surah question's mushaf page (owner, 2026-11-17): every other word an empty box by default, with no
 * surah name or juz; on, the ayat before the asked one are written as in recite mode.
 */
export const quizPageBefore = setting('quiz-page-before', false, isBoolean);

/** What recite mode's pen writes everywhere (owner, 2026-11-17): an ayah's first and last words, or all of it. */
export const penRule = setting<PenRule>('pen-rule', 'ends', isPenRule);
/** The quizzes' own pen rule, or `same` to follow the one for everything (owner, 2026-11-17: global, and per quiz). */
export const quizPen = setting<PenRule | 'same'>('quiz-pen', 'same', (value): value is PenRule | 'same' => value === 'same' || isPenRule(value));
/** The pen rule a quiz writes with. */
export function useQuizPen(): PenRule {
  const [rule] = penRule.use();
  const [quiz] = quizPen.use();
  return quiz === 'same' ? rule : quiz;
}

/** Tree or matrix: the default view of every tree, matrix unless the reader picks the tree (owner, 2026-11-17). */
export type BranchView = 'tree' | 'matrix';
export const branchView = setting<BranchView>('branches-view', 'matrix', (value): value is BranchView => value === 'tree' || value === 'matrix');

/** How words the ayat share are coloured: by how alike they are, one colour, or none (owner, 2026-11-14). */
export const markMode = setting<MarkMode>('word-marks', 'kinds', isMarkMode);

/** The website's «ربط الكلمات المتشابهة بخطوط تلقائيًا»: a matrix of a book group opens with its word connections drawn. */
export const connectors = setting('branches-connectors', false, isBoolean);

/** Compare cards in the matrix: the two surahs one under the other, or side by side; each card's own button switches it there. */
export const besideLayout = setting('compare-beside', false, isBoolean);

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
