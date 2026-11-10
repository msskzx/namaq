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
      try { raw = current.getItem(key); } catch {}
      if (cache && cache.raw === raw) return cache.value;
      cache = { raw, value: parse(raw) };
      return cache.value;
    },
    write(raw: string) {
      try { current.setItem(key, raw); } catch {}
      notify();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const external = current.subscribe?.(listener);
      return () => { listeners.delete(listener); external?.(); };
    },
  };
}
