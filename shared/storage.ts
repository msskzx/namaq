import { reportError } from './errors';
export type KeyStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
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

export function keepingStorage(base: KeyStorage) {
  const unsaved = new Map<string, string>();
  const watchers = new Set<() => void>();
  const changed = (before: number) => { if ((before === 0) !== (unsaved.size === 0)) watchers.forEach(watcher => watcher()); };
  const storage: KeyStorage = {
    getItem: key => (unsaved.has(key) ? unsaved.get(key)! : base.getItem(key)),
    setItem: (key, value) => {
      const before = unsaved.size;
      try { base.setItem(key, value); unsaved.delete(key); } catch (error) { reportError('storage: save', error); unsaved.set(key, value); }
      changed(before);
    },
    subscribe: base.subscribe,
  };
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

export function setKeyStorage(next: KeyStorage) {
  current = next;
  swaps.forEach(swap => swap());
}

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
