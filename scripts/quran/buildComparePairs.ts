import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BranchAyah } from '../../src/lib/quran/branches';
import { similarAyat } from '../../src/lib/quran/mutashabih/similar';
import source from '../../src/app/quran/branches/trees.json';

const pairs = similarAyat(source.ayat as BranchAyah[]);
writeFileSync(join(__dirname, '../../src/app/quran/compare/pairs.json'), `${JSON.stringify({ pairs })}\n`);
console.log('compare pairs', pairs.length);
