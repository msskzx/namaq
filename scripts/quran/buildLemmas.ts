import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countLemmas } from '../../src/lib/quran/lemmas';

const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/lemmas.json');

const text = readFileSync(MORPHOLOGY, 'utf8');
const notice = text.split(/\r?\n/).filter(line => line.startsWith('#')).join('\n');
const counts = countLemmas(text);
writeFileSync(OUT, `${JSON.stringify({ notice, ...counts })}\n`);
console.log(`lemmas ${counts.lemmas.length}, unlemmatized words ${counts.unlemmatized}`);
