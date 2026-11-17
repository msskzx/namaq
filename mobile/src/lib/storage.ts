import { setBookmarkStorage } from '@shared/bookmarks';
import { keepingStorage, setKeyStorage } from '@shared/storage';
import { deviceStorage } from './deviceStorage';

/** Every write on the phone goes through one store that keeps what the device refused and saves it again (shared/storage.ts). */
const kept = keepingStorage(deviceStorage);
const device = kept.storage;

const leaving = new Set<() => void>();
/** Runs `flush` when the app goes to the background, so an edit still waiting on a typing pause is saved before the phone may close the app. */
export function onLeave(flush: () => void) { leaving.add(flush); return () => { leaving.delete(flush); }; }
/** The app went to the background (AppShell): pending edits are written, and writes the device refused are tried again. */
export function leave() { leaving.forEach(flush => flush()); kept.retry(); }

/** What a value read back from the phone must be before a screen uses it: valid JSON of another shape counts as nothing saved. */
export type Check<T> = (value: unknown) => value is T;
export const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumberIn = (min: number, max: number) => (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
export const arrayOf = <T>(check: Check<T>) => (value: unknown): value is T[] => Array.isArray(value) && value.every(check);

export function readJson<T>(key: string, check: Check<T>): T | undefined {
  try {
    const raw = device.getItem(key);
    const value: unknown = raw ? JSON.parse(raw) : undefined;
    return check(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function writeJson(key: string, value: unknown) {
  device.setItem(key, JSON.stringify(value));
}

setBookmarkStorage(device);
setKeyStorage(device);
