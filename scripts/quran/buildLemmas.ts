import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { lemmaFiles } from './lemmaFiles';

const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/words/lemmas.json');
const PLACES = join(__dirname, '../../src/app/quran/words/places.json');
const APP = join(__dirname, '../../shared/data/quran/words.json');

const { lemmas, places, words } = lemmaFiles(readFileSync(MORPHOLOGY, 'utf8'));
writeFileSync(OUT, `${JSON.stringify(lemmas)}\n`);
writeFileSync(PLACES, `${JSON.stringify(places)}\n`);
writeFileSync(APP, `${JSON.stringify(words)}\n`);
console.log(`lemmas ${lemmas.lemmas.length}, unlemmatized words ${lemmas.unlemmatized}`);
for (const [a, b] of lemmas.opposites) console.log(`${a.label} ${a.count} / ${b.label} ${b.count}`);
