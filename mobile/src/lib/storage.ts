import { useSyncExternalStore } from 'react';
import { setBookmarkStorage } from '@shared/bookmarks';
import { keepingStorage, setKeyStorage } from '@shared/storage';
import { deviceStorage } from './deviceStorage';

const kept = keepingStorage(deviceStorage);
export const device = kept.storage;

const leaving = new Set<() => void>();
export function onLeave(flush: () => void) { leaving.add(flush); return () => { leaving.delete(flush); }; }
export function leave() { leaving.forEach(flush => flush()); kept.retry(); }

const RETRY_EVERY = 30_000;
let retrying: ReturnType<typeof setInterval> | null = null;
kept.watch(() => {
  if (kept.unsaved() > 0 && !retrying) retrying = setInterval(() => { if (kept.retry() && retrying) { clearInterval(retrying); retrying = null; } }, RETRY_EVERY);
  if (kept.unsaved() === 0 && retrying) { clearInterval(retrying); retrying = null; }
});
const unsavedNow = () => kept.unsaved() > 0;
export const useUnsaved = () => useSyncExternalStore(kept.watch, unsavedNow, () => false);

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
