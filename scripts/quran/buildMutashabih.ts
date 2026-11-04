import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BranchAyah, WordFeatures } from '../../src/lib/quran/branches';
import { buildGroups, KINDS, TAGS } from '../../src/lib/quran/mutashabih/engine';
import source from '../../src/app/quran/branches/trees.json';

const features = new Map<string, WordFeatures[]>();
const corpus = readFileSync(join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt'), 'utf8');
for (const line of corpus.split('\n')) {
  const match = /^\((\d+):(\d+):(\d+):\d+\)\t[^\t]+\t[^\t]+\t(.+)/.exec(line);
  if (!match || !match[4].startsWith('STEM|')) continue;
  const [, surah, ayah, word, raw] = match;
  const parts = raw.trim().split('|');
  const agreement = parts.find(part => /^(?:[123])?[MF]?[SDP]$/.test(part));
  const value: WordFeatures = {
    gender: agreement?.match(/[MF]/)?.[0] ?? parts.find(part => /^(M|F)$/.test(part)),
    number: agreement?.match(/[SDP]$/)?.[0],
    case: parts.find(part => /^(NOM|ACC|GEN)$/.test(part)),
    pos: parts.find(part => part.startsWith('POS:'))?.slice(4),
  };
  const key = `${surah}:${ayah}`;
  const words = features.get(key) ?? [];
  words[Number(word) - 1] = value;
  features.set(key, words);
}
const ayat: BranchAyah[] = source.ayat.map(ayah => ({ ...ayah, features: features.get(ayah.key) }));
const groups = buildGroups(ayat);
const out = join(__dirname, '../../src/app/quran/branches/mutashabih.json');
writeFileSync(out, `${JSON.stringify(groups)}\n`);
for (const kind of Object.keys(KINDS)) console.log(kind, groups.filter(group => group.kind === kind).length);
for (const tag of Object.keys(TAGS)) console.log(tag, groups.filter(group => group.tags.some(value => value === tag)).length);
console.log('book citations', groups.reduce((count, group) => count + group.citations.length, 0));
