import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findSimilar, readAyat } from '../../src/lib/quran/similar';

const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/compare/similar.json');

const pairs = findSimilar(readAyat(readFileSync(MORPHOLOGY, 'utf8')));
writeFileSync(OUT, `${JSON.stringify({ pairs })}\n`);
console.log(`similar pairs ${pairs.length}`);
