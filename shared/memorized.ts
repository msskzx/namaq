import { keyStore } from './storage';
import { juzOf } from './quran/juz';
import surahRows from './data/quran/surahs.json';
import { dailyIndex } from './dailyPick';
import type { CompareScope } from './quran/compareScope';
import { reportError } from './errors';

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
  } catch (error) { reportError('memorized: read', error); }
  return null;
}

const store = keyStore('memorized', parse);
export const readMemorized = store.read;
export const subscribeMemorized = store.subscribe;
export const serverMemorized = () => null;
export const writeMemorized = (value: Memorized | null) => store.write(value ? JSON.stringify(value) : '');

const asked = keyStore('memorized-asked', raw => raw === '1');
export const readMemorizedAsked = asked.read;
export const subscribeMemorizedAsked = asked.subscribe;
export const serverMemorizedAsked = () => true;
export const setMemorizedAsked = () => asked.write('1');

export function isMemorized(key: string, memorized: Memorized | null): boolean {
  if (!memorized || 'all' in memorized) return true;
  return memorized.picked.includes(memorized.unit === 'juz' ? juzOf(key) : Number(key.split(':')[0]));
}

export const touchesMemorized = (keys: string[], memorized: Memorized | null) => !!memorized && !('all' in memorized) && keys.some(key => isMemorized(key, memorized));

const counts = surahRows.map(row => row.numberOfAyat);
let every: string[] | undefined;
const allKeys = () => (every ??= counts.flatMap((count, at) => Array.from({ length: count }, (_, i) => `${at + 1}:${i + 1}`)));

export function memorizedKeys(memorized: Memorized | null): string[] {
  if (!memorized) return [];
  return 'all' in memorized ? allKeys() : allKeys().filter(key => isMemorized(key, memorized));
}

export function recallOfDay(memorized: Memorized | null, day: number): string | undefined {
  const keys = memorizedKeys(memorized);
  return keys[dailyIndex(day, keys.length)];
}

export function memorizedFilters(memorized: Memorized | null): { juz?: string; surahs?: string } {
  if (!memorized || 'all' in memorized) return {};
  return memorized.unit === 'juz' ? { juz: memorized.picked.join(',') } : { surahs: memorized.picked.join(',') };
}

const flag = (key: string) => keyStore(key, raw => raw !== '0');
const questions = flag('memorized-questions');
const prefer = flag('memorized-prefer');
export const memorizedQuestions = { read: questions.read, subscribe: questions.subscribe, server: () => true, write: (on: boolean) => questions.write(on ? '1' : '0') };
export const memorizedPrefer = { read: prefer.read, subscribe: prefer.subscribe, server: () => true, write: (on: boolean) => prefer.write(on ? '1' : '0') };

const SCOPE = ['surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo'] as const;
export function withMemorizedScope<T extends Record<string, string | undefined>>(filters: T, memorized: Memorized | null): T {
  const next: Record<string, string | undefined> = { ...filters };
  SCOPE.forEach(key => delete next[key]);
  return { ...next, ...memorizedFilters(memorized) } as T;
}

export function memorizedScope(memorized: Memorized | null): CompareScope | undefined {
  if (!memorized || 'all' in memorized) return undefined;
  return { unit: memorized.unit === 'juz' ? 'juzs' : 'surahs', list: memorized.picked };
}

export function isMemorizedScope(scope: CompareScope | undefined, memorized: Memorized | null): boolean {
  const mine = memorizedScope(memorized);
  return !!scope && !!mine && 'list' in scope && scope.unit === mine.unit && [...scope.list].sort((a, b) => a - b).join() === mine.list.join();
}
