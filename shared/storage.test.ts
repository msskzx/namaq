import { describe, expect, it } from 'vitest';
import { keepingStorage, keyStore, setKeyStorage, type KeyStorage } from './storage';

const device = () => {
  const saved = new Map<string, string>();
  let full = false;
  const base: KeyStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => { if (full) throw new Error('full'); saved.set(key, value); },
  };
  return { saved, base, fill: (on: boolean) => { full = on; } };
};

describe('a write the device refuses', () => {
  it('is read back from memory and saved when the device takes it again', () => {
    const phone = device();
    const kept = keepingStorage(phone.base);
    phone.fill(true);
    kept.storage.setItem('note', 'new');
    expect(kept.storage.getItem('note')).toBe('new');
    expect(phone.saved.has('note')).toBe(false);
    expect(kept.retry()).toBe(false);
    phone.fill(false);
    expect(kept.retry()).toBe(true);
    expect(phone.saved.get('note')).toBe('new');
    expect(kept.unsaved()).toBe(0);
  });

  it('keeps a keyStore edit on screen instead of rolling it back', () => {
    const phone = device();
    const kept = keepingStorage(phone.base);
    setKeyStorage(kept.storage);
    const store = keyStore('marks', raw => raw ?? '');
    phone.fill(true);
    store.write('edited');
    expect(store.read()).toBe('edited');
  });

  it('saves a later successful write over the refused one', () => {
    const phone = device();
    const kept = keepingStorage(phone.base);
    phone.fill(true);
    kept.storage.setItem('k', 'one');
    phone.fill(false);
    kept.storage.setItem('k', 'two');
    expect(kept.unsaved()).toBe(0);
    expect(kept.storage.getItem('k')).toBe('two');
  });
});

describe('what is left unsaved', () => {
  it('tells its watchers when something is left unsaved and when all of it is saved', () => {
    const phone = device();
    const kept = keepingStorage(phone.base);
    let told = 0;
    kept.watch(() => { told++; });
    kept.storage.setItem('a', '1');
    expect(told).toBe(0);
    phone.fill(true);
    kept.storage.setItem('a', '2');
    kept.storage.setItem('b', '3');
    expect(told).toBe(1);
    phone.fill(false);
    kept.retry();
    expect(told).toBe(2);
    expect(kept.unsaved()).toBe(0);
  });
});
