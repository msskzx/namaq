import { keyStore } from './storage';
import { juzOf } from './quran/juz';
import surahRows from './data/quran/surahs.json';
import { dailyIndex } from './dailyPick';

/**
 * What the reader says they have memorized (owner, 2026-11-13), kept on this device only and never shown or counted:
 * whole juz or whole surahs, or the whole Quran. Questions (the home recall card, the quizzes' default range) come only
 * from it; pondering (pairs and trees) still uses every surah but puts what is memorized first. Null: not said yet.
 */
export type Memorized = { unit: 'juz' | 'surah'; picked: number[] } | { all: true };

function parse(raw: string | null): Memorized | null {
  try {
    const value = raw ? JSON.parse(raw) : null;
    if (value?.all === true) return { all: true };
    if ((value?.unit === 'juz' || value?.unit === 'surah') && Array.isArray(value.picked)) {
      const max = value.unit === 'juz' ? 30 : 114;
      const picked = [...new Set((value.picked as unknown[]).map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= max))].sort((a, b) => a - b);
      return picked.length ? { unit: value.unit, picked } : null;
    }
  } catch {}
  return null;
}

const store = keyStore('memorized', parse);
export const readMemorized = store.read;
export const subscribeMemorized = store.subscribe;
export const serverMemorized = () => null;
export const writeMemorized = (value: Memorized | null) => store.write(value ? JSON.stringify(value) : '');

/** The home card asking what is memorized: closed with × or answered, it does not come back (settings keep the choice). */
const asked = keyStore('memorized-asked', raw => raw === '1');
export const readMemorizedAsked = asked.read;
export const subscribeMemorizedAsked = asked.subscribe;
export const serverMemorizedAsked = () => true;
export const setMemorizedAsked = () => asked.write('1');

/** Whether an ayah (`surah:ayah`) is in what is memorized; with nothing said, every ayah counts. */
export function isMemorized(key: string, memorized: Memorized | null): boolean {
  if (!memorized || 'all' in memorized) return true;
  return memorized.picked.includes(memorized.unit === 'juz' ? juzOf(key) : Number(key.split(':')[0]));
}

/** Whether something to ponder (a pair's or a tree's ayat) touches what is memorized, so the feed puts it first; it is still drawn whole. */
export const touchesMemorized = (keys: string[], memorized: Memorized | null) => !!memorized && !('all' in memorized) && keys.some(key => isMemorized(key, memorized));

const counts = surahRows.map(row => row.numberOfAyat);
/** Every ayah key in mushaf order, built once. */
let every: string[] | undefined;
const allKeys = () => (every ??= counts.flatMap((count, at) => Array.from({ length: count }, (_, i) => `${at + 1}:${i + 1}`)));

/** The ayat memorized, in mushaf order; empty while nothing is said (the recall card then only asks about forgotten ayat). */
export function memorizedKeys(memorized: Memorized | null): string[] {
  if (!memorized) return [];
  return 'all' in memorized ? allKeys() : allKeys().filter(key => isMemorized(key, memorized));
}

/** The day's ayah to recall from what is memorized, the same all day. */
export function recallOfDay(memorized: Memorized | null, day: number): string | undefined {
  const keys = memorizedKeys(memorized);
  return keys[dailyIndex(day, keys.length)];
}

/** The quiz filter keys for what is memorized (the branches filters' `juz` or `surahs` lists), or none for the whole Quran. */
export function memorizedFilters(memorized: Memorized | null): { juz?: string; surahs?: string } {
  if (!memorized || 'all' in memorized) return {};
  return memorized.unit === 'juz' ? { juz: memorized.picked.join(',') } : { surahs: memorized.picked.join(',') };
}

/** The two settings under «ما أحفظه» (owner, 2026-11-13), both on until switched off. */
const flag = (key: string) => keyStore(key, raw => raw !== '0');
const questions = flag('memorized-questions');
const prefer = flag('memorized-prefer');
/** «الأسئلة مما أحفظ فقط»: the recall card and the quizzes' default range come only from what is memorized. */
export const memorizedQuestions = { read: questions.read, subscribe: questions.subscribe, server: () => true, write: (on: boolean) => questions.write(on ? '1' : '0') };
/** «قدّم ما أحفظه في التأمل»: pairs and trees touching what is memorized come first in the feed. */
export const memorizedPrefer = { read: prefer.read, subscribe: prefer.subscribe, server: () => true, write: (on: boolean) => prefer.write(on ? '1' : '0') };

const SCOPE = ['surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo'] as const;
/** A solo quiz's filters with their range swapped for what is memorized (the quizzes' default range); other filters stay. */
export function withMemorizedScope<T extends Record<string, string | undefined>>(filters: T, memorized: Memorized | null): T {
  const next: Record<string, string | undefined> = { ...filters };
  SCOPE.forEach(key => delete next[key]);
  return { ...next, ...memorizedFilters(memorized) } as T;
}
