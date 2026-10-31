import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadReaderAyat } from './ayahContext';

let load: typeof import('./quranText');

beforeEach(async () => {
  vi.resetModules();
  load = await import('./quranText');
});
afterEach(() => vi.unstubAllGlobals());

const serve = async () => {
  const ayat = await loadReaderAyat();
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ayat }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('searchQuran', () => {
  it('finds the matching ayat and their count in the text it fetched once', async () => {
    const fetchMock = await serve();
    const result = await load.searchQuran('الحي القيوم');
    expect(result.total).toBe(3);
    expect(result.hits.map(hit => hit.key)).toEqual(['2:255', '3:2', '20:111']);
    await load.searchQuran('صراط');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/quran/text');
  });

  it('gives each hit its page in the 1441 mushaf the reader shows', async () => {
    await serve();
    expect((await load.searchQuran('لا تغلوا في دينكم غير الحق')).hits.find(hit => hit.key === '5:77')).toMatchObject({ page: 120 });
  });

  it('answers an empty result to a query too short to search', async () => {
    await serve();
    expect(await load.searchQuran('ق')).toEqual({ total: 0, hits: [] });
  });

  it('fetches again after a failed load', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503 })));
    await expect(load.searchQuran('الحي القيوم')).rejects.toThrow('503');
    await serve();
    expect((await load.searchQuran('الحي القيوم')).total).toBe(3);
  });
});
