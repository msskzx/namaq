import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countLemmas, countPairs } from '../../src/lib/quran/lemmas';
import { OPPOSITES } from '../../src/lib/quran/opposites';

const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/lemmas.json');

const text = readFileSync(MORPHOLOGY, 'utf8');
const notice = text.split(/\r?\n/).filter(line => line.startsWith('#')).join('\n');
const counts = countLemmas(text);
const opposites = countPairs(text, OPPOSITES);
writeFileSync(OUT, `${JSON.stringify({ notice, ...counts, opposites })}\n`);
console.log(`lemmas ${counts.lemmas.length}, unlemmatized words ${counts.unlemmatized}`);
for (const [a, b] of opposites) console.log(`${a.label} ${a.count} / ${b.label} ${b.count}`);
