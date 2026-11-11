import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';
import groups from '../data/quran/mutashabih.json';
import surahs from '../data/quran/surahs.json';
import { mushafText } from './mushafText';
import { ayahWords } from './normalize';
import { plainWord, sourceAyat, wordPairs } from './quranSource';
import type { MushafPage } from './readerPage';

const root = join(__dirname, '../..');
const json = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const source = sourceAyat(Array.from({ length: 604 }, (_, at): MushafPage => json(`shared/data/quran/mushaf/${at + 1}.json`)));
const stored = corpus.ayat as { key: string; words: string[] }[];
const storedWords = new Map(stored.map(ayah => [ayah.key, ayah.words]));
const order = (a: string, b: string) => Number(a.split(':')[0]) - Number(b.split(':')[0]) || Number(a.split(':')[1]) - Number(b.split(':')[1]);

describe('the Quran text source', () => {
  it('is the King Fahd Complex Hafs text, unchanged', () => {
    const text = [...source].sort(([a], [b]) => order(a, b)).map(([key, words]) => `${key} ${words.join(' ')}`).join('\n');
    expect(source.size).toBe(6236);
    expect([...source.values()].reduce((total, words) => total + words.length, 0)).toBe(77426);
    expect(createHash('sha256').update(text).digest('hex')).toBe('PIN');
  });

  it('holds every ayah of every surah, and no other', () => {
    expect([...source.keys()].sort(order)).toEqual(surahs.flatMap(surah => Array.from({ length: surah.numberOfAyat }, (_, at) => `${surah.number}:${at + 1}`)));
  });
});

describe('the stored words of the trees', () => {
  it('cover the same ayat as the source', () => {
    expect(stored.map(ayah => ayah.key)).toEqual([...source.keys()].sort(order));
  });

  it('stand for the source word at the same position, and show as that word', () => {
    const wrong = stored.flatMap(({ key, words }) => {
      const pairs = wordPairs(words, source.get(key)!);
      if (!pairs) return [`${key}: word counts differ`];
      return pairs.filter(([word, written]) => mushafText(word) !== written).map(([word, written]) => `${key}: ${word} shows as ${mushafText(word)}, the source writes ${written}`);
    });
    expect(wrong).toEqual([]);
  });

  it('show each whole ayah as the source writes it, apart from three words the source joins', () => {
    const differing = stored.filter(({ key, words }) => mushafText(words.join(' ')) !== source.get(key)!.map(plainWord).join(' ')).map(ayah => ayah.key);
    expect(differing).toEqual(['15:7', '27:20', '36:22']);
  });

  it('split words where the source does, apart from seven ayat', () => {
    expect(stored.filter(({ key, words }) => words.length !== source.get(key)!.length).map(ayah => ayah.key)).toEqual(['2:181', '8:6', '13:37', '15:7', '27:20', '36:22', '37:130']);
  });
});

describe('references into the text', () => {
  type Place = { key: string; start: number; end: number };
  const outside = (places: Place[]) =>
    places.filter(({ key, start, end }) => !(Number.isInteger(start) && Number.isInteger(end) && start >= 0 && start < end && end <= (storedWords.get(key)?.length ?? -1))).map(place => JSON.stringify(place));

  it('name whole words of real ayat in every tree', () => {
    expect(outside((corpus.trees as { occurrences: Place[] }[]).flatMap(tree => tree.occurrences))).toEqual([]);
    expect((corpus.subtrees as { keys: string[] }[]).flatMap(tree => tree.keys).filter(key => !source.has(key))).toEqual([]);
  });

  it('name whole words of real ayat in every comparison group', () => {
    expect(outside((groups as { places: Place[]; tree: { occurrences: Place[] } }[]).flatMap(group => [...group.places, ...group.tree.occurrences]))).toEqual([]);
  });
});

describe('copies of ayat outside the source', () => {
  // The copies come from the database in another encoding of the same Hafs text, so compare letters only.
  const letters = (text: string) => ayahWords(text.replace(/[۩‏]/g, ''), false).norm.join('').replace(/[ئى]/g, 'ي').replace(/ء/g, '');
  const pages = ['openings', 'oaths', 'order', 'iltifat'];

  it.each(pages)('match the source letter for letter on the %s page', page => {
    const copies: Record<string, string> = json(`src/app/quran/${page}/ayat.json`).ayat;
    expect(Object.keys(copies).length).toBeGreaterThan(0);
    expect(Object.entries(copies).filter(([key, text]) => letters(text) !== letters((source.get(key) ?? []).join(' '))).map(([key]) => key)).toEqual([]);
  });

  it('are only the files checked here', () => {
    const vocalised = /[ء-ي][ً-ْٰ]/g;
    const found: string[] = [];
    const walk = (folder: string) => {
      for (const name of readdirSync(join(root, folder))) {
        const path = `${folder}/${name}`;
        if (statSync(join(root, path)).isDirectory()) walk(path);
        else if (name.endsWith('.json') && !name.includes('fixture') && (readFileSync(join(root, path), 'utf8').match(vocalised)?.length ?? 0) > 1500) found.push(path);
      }
    };
    ['shared/data/quran', 'shared/quran', 'src/app/quran', 'src/lib/quran', 'mobile/src'].forEach(walk);
    expect(found.filter(path => !path.startsWith('shared/data/quran/mushaf/')).sort()).toEqual([
      'shared/data/quran/branchVerdicts.json',
      'shared/data/quran/mushafWords.json',
      'shared/data/quran/mutashabih.json',
      'shared/data/quran/trees.json',
      'src/app/quran/compare/similar.json',
      'src/app/quran/order/ayat.json',
      'src/app/quran/words/lemmas.json',
      'src/app/quran/words/places.json',
    ]);
  });
});
