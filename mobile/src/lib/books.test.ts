import { beforeEach, describe, expect, it, vi } from 'vitest';

const disk = new Map<string, string>();
const store = new Map<string, string>();
let serve: () => string;

vi.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
vi.mock('./deviceStorage', () => ({ deviceStorage: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { store.set(key, value); } } }));
vi.mock('expo-file-system', () => {
  class Directory {
    uri: string;
    constructor(...parts: (string | Directory)[]) { this.uri = parts.map(part => (typeof part === 'string' ? part : part.uri)).join('/'); }
    get exists() { return true; }
    create() {}
  }
  class File {
    uri: string;
    constructor(dir: Directory, name: string) { this.uri = `${dir.uri}/${name}`; }
    get exists() { return disk.has(this.uri); }
    async text() { return disk.get(this.uri)!; }
    delete() { disk.delete(this.uri); }
    moveSync(to: File) { disk.set(to.uri, disk.get(this.uri)!); disk.delete(this.uri); this.uri = to.uri; }
    static async downloadFileAsync(_url: string, file: File) { disk.set(file.uri, serve()); return file; }
  }
  return { Directory, File, Paths: { document: 'doc' } };
});

// Shaped as the served books are: KashshafEntry = [surah, from, to, part, first, last, text, lit].
const book = (text: string) => JSON.stringify({ source: { version: '1', book: 346 }, entries: [[1, 1, 1, 1, 1, 8, text, []]] });

beforeEach(() => { disk.clear(); store.clear(); vi.resetModules(); });

describe('downloaded books', () => {
  it('keeps the book on the phone when a new download is not a book', async () => {
    const books = await import('./books');
    serve = () => book('first');
    await books.addBook('kashshaf');
    expect(books.bookState('kashshaf')).toBe('on');
    serve = () => '{"entries": [1, 2';
    await books.addBook('kashshaf');
    expect(books.bookState('kashshaf')).toBe('failed');
    expect(JSON.parse(disk.get('doc/books/kashshaf.json')!).entries[0][6]).toBe('first');
    expect([...disk.keys()].some(key => key.endsWith('.part'))).toBe(false);
  });

  it('refuses a file whose passages have no text', async () => {
    const books = await import('./books');
    serve = () => JSON.stringify({ source: {}, entries: [[1, 1, 1, 1, 1, 8]] });
    await books.addBook('kashshaf');
    expect(books.bookState('kashshaf')).toBe('failed');
  });

  it('counts a new revision when a book is removed or installed again', async () => {
    const books = await import('./books');
    serve = () => book('first');
    await books.addBook('kashshaf');
    const first = books.bookRevision('kashshaf');
    books.removeBook('kashshaf');
    serve = () => book('second');
    await books.addBook('kashshaf');
    expect(books.bookRevision('kashshaf')).toBeGreaterThan(first + 1);
    expect((await books.readBook<{ entries: unknown[][] }>('kashshaf'))!.entries[0][6]).toBe('second');
  });

  it('installs the real Kashshaf and Ukbari files', async () => {
    const { default: kashshaf } = await import('@shared/data/quran/kashshaf.js');
    const { default: ukbari } = await import('@shared/data/quran/irabUkbari.js');
    const books = await import('./books');
    serve = () => JSON.stringify(kashshaf);
    await books.addBook('kashshaf');
    serve = () => JSON.stringify(ukbari);
    await books.addBook('ukbari');
    expect(books.bookState('kashshaf')).toBe('on');
    expect(books.bookState('ukbari')).toBe('on');
  });
});
