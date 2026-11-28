import { writeFileSync } from 'node:fs';
import { OUT, buildRahmanHadith } from './rahmanScene';

writeFileSync(OUT, `${JSON.stringify(buildRahmanHadith(), null, 1)}\n`);
console.log(`wrote ${OUT}`);
