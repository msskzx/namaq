import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// An in-memory file system standing in for expo-file-system, and a network the test scripts per address.
const disk = new Map<string, string>();
const dirs = new Set<string>();
let net: (url: string, path: string) => Promise<void>;
let downloads = 0;
const store = new Map<string, string>();
let syncReply: () => unknown;

vi.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
vi.mock('react', () => ({ useSyncExternalStore: () => 0 }));
vi.mock('./branches', () => ({ WEBSITE: 'https://site' }));
vi.mock('./storage', () => ({
  readJson: (key: string) => (store.has(key) ? JSON.parse(store.get(key)!) : undefined),
  writeJson: (key: string, value: unknown) => { store.set(key, JSON.stringify(value)); },
}));
vi.mock('expo-file-system', () => {
  class Directory {
    uri: string;
    constructor(...parts: (string | Directory)[]) { this.uri = parts.map(part => (typeof part === 'string' ? part : part.uri)).join('/'); }
    get name() { return this.uri.split('/').pop()!; }
    get exists() { return dirs.has(this.uri); }
    get size() { return [...disk].filter(([path]) => path.startsWith(`${this.uri}/`)).reduce((sum, [, data]) => sum + data.length, 0); }
    create() { dirs.add(this.uri); }
    list() {
      return [...disk.keys()].filter(path => path.slice(0, path.lastIndexOf('/')) === this.uri).map(path => new File(this, path.split('/').pop()!));
    }
  }
  class File {
    uri: string;
    constructor(dir: Directory, name: string) { this.uri = `${dir.uri}/${name}`; }
    get name() { return this.uri.split('/').pop()!; }
    get exists() { return disk.has(this.uri); }
    get size() { return disk.get(this.uri)?.length ?? 0; }
    delete() { disk.delete(this.uri); }
    moveSync(to: File) { disk.set(to.uri, disk.get(this.uri)!); disk.delete(this.uri); this.uri = to.uri; }
    static async downloadFileAsync(url: string, file: File) { downloads++; await net(url, file.uri); return file; }
  }
  return { Directory, File, Paths: { document: 'doc' } };
});

const row = (key: string, url = `https://cdn/${key}`) => ({ id: Number(key.replace(':', '')), key, url });
const KEYS = ['1:1', '1:2', '1:3'];
const path = (key: string) => `doc/listen/7/001${key.split(':')[1].padStart(3, '0')}.mp3`;

async function load() {
  vi.resetModules();
  return import('./listenFiles');
}

beforeEach(() => {
  disk.clear(); dirs.clear(); store.clear(); downloads = 0;
  syncReply = () => ({ token: 't1', full: KEYS.map(key => row(key)), upsert: [], remove: [] });
  net = async (url, at) => { disk.set(at, `bytes of ${url}`); };
  vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => syncReply() }));
});

afterEach(() => { vi.restoreAllMocks(); });

describe('audio downloads', () => {
  it('never takes a part left by a failed download for the whole file, and fetches it again on retry', async () => {
    const files = await load();
    net = async (url, at) => { disk.set(at, 'part'); if (url.endsWith('1:2')) throw new Error('cut'); disk.set(at, `bytes of ${url}`); };
    await files.downloadPack(7, 'all', 'all', KEYS);
    expect(files.progressOf(7, 'all')?.failed).toBe(true);
    expect(files.packsOf(7)).toEqual([]);
    expect(disk.has(path('1:2'))).toBe(false);
    expect([...disk.keys()].some(key => key.endsWith('.part'))).toBe(false);
    net = async (url, at) => { disk.set(at, `bytes of ${url}`); };
    downloads = 0;
    await files.downloadPack(7, 'all', 'all', KEYS);
    expect(downloads).toBe(1);
    expect(files.packsOf(7).map(pack => pack.kind)).toEqual(['all']);
    expect(disk.get(path('1:2'))).toBe('bytes of https://cdn/1:2');
    expect(files.localAyah(7, '1:2')).toBe(path('1:2'));
  });

  it('does not count a pack holding an ayah Content Sync has no file for', async () => {
    syncReply = () => ({ token: 't1', full: [row('1:1'), row('1:2')], upsert: [], remove: [] });
    const files = await load();
    await files.downloadPack(7, 'all', 'all', KEYS);
    expect(files.progressOf(7, 'all')?.failed).toBe(true);
    expect(files.packsOf(7)).toEqual([]);
  });

  it('marks the download failed, not stuck, when the reciter\'s folder cannot be made', async () => {
    const files = await load();
    const { Directory } = await import('expo-file-system');
    vi.spyOn(Directory.prototype, 'create').mockImplementation(() => { throw new Error('disk full'); });
    await files.downloadPack(7, 'all', 'all', KEYS).catch(() => undefined);
    expect(files.progressOf(7, 'all')?.failed).toBe(true);
  });

  it('keeps the old file when a changed one fails to arrive, and fetches it at the next app start', async () => {
    const files = await load();
    await files.downloadPack(7, 'all', 'all', KEYS);
    expect(files.packsOf(7)).toHaveLength(1);
    // A day on, the source changed 1:1's file and the new one cannot be fetched.
    syncReply = () => ({ token: 't2', upsert: [row('1:1', 'https://cdn/new')], remove: [] });
    net = async () => { throw new Error('offline'); };
    await files.syncPacks(Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(disk.get(path('1:1'))).toBe('bytes of https://cdn/1:1');
    expect(files.localAyah(7, '1:1')).toBe(path('1:1'));
    // The next start is not a day later, yet the file is fetched again.
    net = async (url, at) => { disk.set(at, `bytes of ${url}`); };
    downloads = 0;
    const again = await load();
    await again.syncPacks(Date.now());
    expect(downloads).toBe(1);
    expect(disk.get(path('1:1'))).toBe('bytes of https://cdn/new');
    downloads = 0;
    await (await load()).syncPacks(Date.now());
    expect(downloads).toBe(0);
  });

  it('deletes a removed file at once', async () => {
    const files = await load();
    await files.downloadPack(7, 'all', 'all', KEYS);
    syncReply = () => ({ token: 't2', upsert: [], remove: ['1:3'] });
    await files.syncPacks(Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(disk.has(path('1:3'))).toBe(false);
  });

  it('syncs once when two downloads of a reciter start together', async () => {
    const files = await load();
    const calls = vi.fn(async () => ({ ok: true, json: async () => syncReply() }));
    vi.stubGlobal('fetch', calls);
    await Promise.all([files.downloadPack(7, 'surah:1', 'one', KEYS), files.downloadPack(7, 'memorized', 'mine', KEYS.slice(0, 2))]);
    expect(calls).toHaveBeenCalledTimes(1);
    expect(files.packsOf(7).map(pack => pack.kind).sort()).toEqual(['memorized', 'surah:1']);
  });

  it('removing a reciter\'s downloads stops the one running, so it does not come back', async () => {
    const files = await load();
    await files.downloadPack(7, 'surah:1', 'one', KEYS.slice(0, 1));
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    net = async (url, at) => { await gate; disk.set(at, `bytes of ${url}`); };
    const running = files.downloadPack(7, 'all', 'all', KEYS);
    await new Promise(resolve => setTimeout(resolve, 0));
    files.removeReciter(7);
    release();
    await running;
    expect(files.packsOf(7)).toEqual([]);
    expect(files.progressOf(7, 'all')).toBeUndefined();
  });
  it('fetches again an ayah whose file is empty', async () => {
    const files = await load();
    await files.downloadPack(7, 'all', 'all', KEYS);
    disk.set(path('1:2'), '');
    expect(files.localAyah(7, '1:2')).toBeUndefined();
    downloads = 0;
    await files.downloadPack(7, 'all', 'all', KEYS);
    expect(downloads).toBe(1);
  });

  it('stops repairing a reciter whose downloads were removed, and a sweep meanwhile spares the file being fetched', async () => {
    const files = await load();
    await files.downloadPack(7, 'all', 'all', KEYS);
    syncReply = () => ({ token: 't2', full: KEYS.map(key => row(key, `https://cdn/new/${key}`)), upsert: [], remove: [] });
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    downloads = 0;
    net = async (url, at) => { disk.set(at, 'part'); await gate; disk.set(at, `bytes of ${url}`); };
    const start = files.syncPacks(Date.now() + 2 * 24 * 60 * 60 * 1000);
    await new Promise(resolve => setTimeout(resolve, 0));
    // A stopped download sweeps the folder while the first repaired ayah is still arriving.
    files.stopDownload(7, 'all');
    expect([...disk.keys()].some(key => key.endsWith('.part'))).toBe(true);
    await files.syncPacks(Date.now());
    expect([...disk.keys()].some(key => key.endsWith('.part'))).toBe(true);
    files.removeReciter(7);
    release();
    await start;
    expect(downloads).toBe(1);
    expect([...disk.keys()].filter(key => key.endsWith('.mp3'))).toEqual([]);
  });
});
