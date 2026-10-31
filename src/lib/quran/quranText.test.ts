import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadReaderAyat } from './readerAyat';

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

describe('quranContexts and quranSurrounding', () => {
  it('ask the server for the few ayat shown until the page loads the whole text', async () => {
    const fetchMock = vi.fn(async (url: string) => ({ ok: true, json: async () => ({ url }) }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await load.quranContexts(['94:5', '94:6'])).toEqual({ url: '/api/quran/context?q=94%3A5%2C94%3A6' });
    expect(await load.quranSurrounding(['94:5'], ['94:6'])).toEqual({ url: '/api/quran/surrounding?before=94%3A5&after=94%3A6' });
  });

  it('work in the browser once the text is loaded, fetching nothing more', async () => {
    const fetchMock = await serve();
    await load.loadQuranText();
    const [first, second] = await load.quranContexts(['94:5', '94:6']);
    expect([first.ayah.key, first.before?.key, second.after?.key]).toEqual(['94:5', '94:4', '94:7']);
    expect(first.match?.exact.length).toBeGreaterThan(0);
    const around = await load.quranSurrounding(['2:1'], ['1:7']);
    expect(around.before['2:1']).toMatchObject({ key: '1:7', basmala: expect.any(Array) });
    expect(around.after['1:7']).toMatchObject({ key: '2:1' });
    await expect(load.quranContexts(['999:1'])).rejects.toThrow('Ayah not found');
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
