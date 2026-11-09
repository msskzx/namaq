import { useSyncExternalStore } from 'react';
import { EMPTY_LIST, type ListState } from './branchList';
import { readJson, writeJson } from './storage';

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
  return { get, set, use };
}

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/** Tree or matrix: the website's default-view setting. */
export type BranchView = 'tree' | 'matrix';
export const branchView = setting<BranchView>('branches-view', 'tree', (value): value is BranchView => value === 'tree' || value === 'matrix');

/** The surrounding-ayat switch: one setting for every tree and matrix on the branches tab. */
export const around = setting('branches-surround', false, isBoolean);

/** The filters, search and surah narrowing the trees, kept so the tab opens as it was left. */
export const listState = setting<ListState>('branches-list', EMPTY_LIST, (value): value is ListState =>
  !!value && typeof value === 'object' && typeof (value as ListState).query === 'string' && typeof (value as ListState).filters === 'object');
