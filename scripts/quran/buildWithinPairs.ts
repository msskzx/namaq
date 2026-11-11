import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BranchAyah } from '../../shared/quran/branches';
import { similarWithin } from '../../src/lib/quran/mutashabih/similar';
import source from '../../shared/data/quran/trees.json';

const pairs = similarWithin(source.ayat as BranchAyah[]);
writeFileSync(join(__dirname, '../../src/app/quran/compare/withinPairs.json'), `${JSON.stringify({ pairs })}\n`);
console.log('within-surah pairs', pairs.length);
