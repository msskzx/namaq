import { beforeEach, describe, expect, it, vi } from 'vitest';

const saved = new Map<string, string>();
vi.mock('./deviceStorage', () => ({
  deviceStorage: { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => { saved.set(key, value); }, removeItem: (key: string) => { saved.delete(key); } },
}));

vi.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
vi.mock('expo-file-system', () => ({ Directory: class {}, File: class {}, Paths: {} }));
vi.mock('./branches', () => ({ WEBSITE: '' }));

beforeEach(() => { saved.clear(); vi.resetModules(); });

describe('values read back from the phone', () => {
  it('counts valid JSON of another shape as nothing saved', async () => {
    const { isBoolean, readJson } = await import('./storage');
    saved.set('a', 'true');
    saved.set('b', '"yes"');
    saved.set('c', '{not json');
    expect(readJson('a', isBoolean)).toBe(true);
    expect(readJson('b', isBoolean)).toBeUndefined();
    expect(readJson('c', isBoolean)).toBeUndefined();
    expect(readJson('missing', isBoolean)).toBeUndefined();
  });

  it('opens the books with a hidden list that is not a list', async () => {
    saved.set('books-hidden', '{}');
    await expect(import('./books')).resolves.toBeDefined();
  });

  it('opens the trees tab empty when its saved list has no filters', async () => {
    saved.set('branches-list', JSON.stringify({ query: '', filters: null }));
    const { listState } = await import('./settings');
    const { EMPTY_LIST } = await import('./listState');
    expect(listState.get()).toBe(EMPTY_LIST);
    saved.set('branches-list', JSON.stringify({ ...EMPTY_LIST, query: 'موسى' }));
    vi.resetModules();
    expect((await import('./settings')).listState.get().query).toBe('موسى');
  });

  it('keeps only whole downloads of a reciter', async () => {
    saved.set('listen-packs', JSON.stringify([{ reciter: 7, kind: 'all', label: 'all', keys: ['1:1'] }, { reciter: 'x' }, null]));
    saved.set('listen-sync', JSON.stringify({ 7: { token: 't', rows: {}, syncedAt: 1 }, 8: { token: 1 } }));
    const { packsOf } = await import('./listenFiles');
    expect(packsOf(7)).toHaveLength(1);
  });
});
