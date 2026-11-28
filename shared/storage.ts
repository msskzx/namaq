import { reportError } from './errors';
/** Where small per-device state is kept: localStorage on the website, the app's own key-value store on the phone. */
export type KeyStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  /** Changes made elsewhere (another browser tab). */
  subscribe?(listener: () => void): () => void;
};

const browserStorage: KeyStorage = {
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  subscribe: listener => {
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  },
};

/**
 * A store over the device's that keeps a write the device refused (a full or unavailable store) in memory, reads it back from there,
 * and saves it again on `retry`, so an edit is never lost or rolled back on screen because one write failed.
 */
export function keepingStorage(base: KeyStorage) {
  const unsaved = new Map<string, string>();
  const watchers = new Set<() => void>();
  // Watchers hear when something becomes unsaved and when all of it is saved, not every write.
  const changed = (before: number) => { if ((before === 0) !== (unsaved.size === 0)) watchers.forEach(watcher => watcher()); };
  const storage: KeyStorage = {
    getItem: key => (unsaved.has(key) ? unsaved.get(key)! : base.getItem(key)),
    setItem: (key, value) => {
      const before = unsaved.size;
      try { base.setItem(key, value); unsaved.delete(key); } catch { unsaved.set(key, value); }
      changed(before);
    },
    subscribe: base.subscribe,
  };
  /** Saves again what the device refused; true when nothing is left unsaved. */
  const retry = () => {
    const before = unsaved.size;
    for (const [key, value] of [...unsaved]) { try { base.setItem(key, value); unsaved.delete(key); } catch (error) { reportError('storage: retry save', error); } }
    changed(before);
    return unsaved.size === 0;
  };
  const watch = (watcher: () => void) => { watchers.add(watcher); return () => { watchers.delete(watcher); }; };
  return { storage, retry, unsaved: () => unsaved.size, watch };
}

let current = browserStorage;
const swaps = new Set<() => void>();

export const keyStorage = () => current;

/** The app calls this once at launch; stores built on it forget what they cached and tell their listeners. */
export function setKeyStorage(next: KeyStorage) {
  current = next;
  swaps.forEach(swap => swap());
}

/**
 * A JSON value kept under one key, read through a cache so `useSyncExternalStore` gets a stable value,
 * with listeners told of every write here and of changes made elsewhere.
 */
export function keyStore<T>(key: string, parse: (raw: string | null) => T) {
  const listeners = new Set<() => void>();
  let cache: { raw: string | null; value: T } | null = null;
  const notify = () => listeners.forEach(listener => listener());
  swaps.add(() => { cache = null; notify(); });
  return {
    read(): T {
      let raw: string | null = null;
      try { raw = current.getItem(key); } catch (error) { reportError('storage: read', error); }
      if (cache && cache.raw === raw) return cache.value;
      cache = { raw, value: parse(raw) };
      return cache.value;
    },
    write(raw: string) {
      try { current.setItem(key, raw); } catch (error) { reportError('storage: save', error); }
      notify();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const external = current.subscribe?.(listener);
      return () => { listeners.delete(listener); external?.(); };
    },
  };
}
