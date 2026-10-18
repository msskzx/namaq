import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findSimilar, readAyat, wordKey } from '../../src/lib/quran/similar';

const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/compare/similar.json');
const KEYS = join(__dirname, '../../src/app/quran/compare/wordKeys.json');

const ayat = readAyat(readFileSync(MORPHOLOGY, 'utf8'));
const pairs = findSimilar(ayat);
writeFileSync(OUT, `${JSON.stringify({ pairs })}\n`);
const surahs: string[][] = [];
for (const a of ayat) (surahs[a.surah - 1] ??= [])[a.ayah - 1] = a.words.map((_, word) => wordKey(a, word) ?? '').join(' ');
writeFileSync(KEYS, `${JSON.stringify({ surahs })}\n`);
console.log(`similar pairs ${pairs.length}`);
