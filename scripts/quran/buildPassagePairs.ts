// docs/plans/curated-passage-comparisons.md
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BranchAyah } from '../../src/lib/quran/branches';
import { inJuzRange } from '../../src/lib/quran/juz';
import { normalizeWord } from '../../src/lib/quran/normalize';
import { SAME_WORD, type SimilarPair } from '../../src/lib/quran/similar';
import type { CompactColumn, SimilarAyahPair } from '../../src/lib/quran/mutashabih/similar';
import source from '../../src/app/quran/branches/trees.json';
import engine from '../../src/app/quran/compare/pairs.json';
import similar from '../../src/app/quran/compare/similar.json';

const JUZ = { from: 25, to: 30 };
const words = new Map((source.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.words]));
const found = new Set((engine.pairs as SimilarAyahPair[]).flatMap(pair => [`${pair.a}|${pair.b}`, `${pair.b}|${pair.a}`]));
const inRange = (span: SimilarPair['a']) => inJuzRange(`${span[0]}:${span[1]}`, JUZ);

function touchesEngine(pair: SimilarPair) {
  for (let i = pair.a[1]; i <= pair.a[2]; i++) for (let j = pair.b[1]; j <= pair.b[2]; j++) if (found.has(`${pair.a[0]}:${i}|${pair.b[0]}:${j}`)) return true;
  return false;
}

const collected = new Map<string, Map<string, CompactColumn>>();
for (const pair of similar.pairs as SimilarPair[]) {
  if (pair.a[0] === pair.b[0] || !inRange(pair.a) || !inRange(pair.b) || touchesEngine(pair)) continue;
  for (const key of new Set(pair.marksA.map(mark => mark[3]))) {
    const [marksA, marksB] = [pair.marksA, pair.marksB].map(marks => marks.filter(mark => mark[3] === key));
    marksA.slice(0, marksB.length).forEach((markA, n) => {
      const markB = marksB[n];
      const [a, b] = [`${pair.a[0]}:${markA[0]}`, `${pair.b[0]}:${markB[0]}`];
      const [wordA, wordB] = [words.get(a)?.[markA[1]], words.get(b)?.[markB[1]]];
      if (!wordA || !wordB) throw new Error(`no word for ${a}:${markA[1]} or ${b}:${markB[1]}`);
      const level = normalizeWord(wordA) === normalizeWord(wordB) ? 'exact' : markA[2] === SAME_WORD && markB[2] === SAME_WORD ? 'lemma' : 'root';
      const id = `${a}|${b}`;
      if (!collected.has(id)) collected.set(id, new Map());
      collected.get(id)!.set(`${markA[1]}:${markB[1]}`, [markA[1], markB[1], level]);
    });
  }
}

const pairs: SimilarAyahPair[] = [...collected].map(([id, columns]) => {
  const [a, b] = id.split('|');
  return { a, b, columns: [...columns.values()] };
});
writeFileSync(join(__dirname, '../../src/app/quran/compare/passagePairs.json'), `${JSON.stringify({ pairs })}\n`);
console.log('passage pairs', pairs.length);
