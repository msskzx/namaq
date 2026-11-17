import { setBookmarkStorage } from '@shared/bookmarks';
import { setKeyStorage } from '@shared/storage';
import { deviceStorage } from './deviceStorage';

/** What a value read back from the phone must be before a screen uses it: valid JSON of another shape counts as nothing saved. */
export type Check<T> = (value: unknown) => value is T;
export const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumberIn = (min: number, max: number) => (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
export const arrayOf = <T>(check: Check<T>) => (value: unknown): value is T[] => Array.isArray(value) && value.every(check);

export function readJson<T>(key: string, check: Check<T>): T | undefined {
  try {
    const raw = deviceStorage.getItem(key);
    const value: unknown = raw ? JSON.parse(raw) : undefined;
    return check(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function writeJson(key: string, value: unknown) {
  try { deviceStorage.setItem(key, JSON.stringify(value)); } catch {}
}

setBookmarkStorage(deviceStorage);
setKeyStorage(deviceStorage);
