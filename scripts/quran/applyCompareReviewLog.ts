import { execFileSync } from 'node:child_process';
import { applyReviewLog } from '../../src/lib/quran/curation/reviewLog';

const presses = applyReviewLog(() => execFileSync('npx', ['tsx', 'scripts/quran/buildCompareCards.ts'], { stdio: 'inherit' }));
for (const { page, action } of presses) console.log(`${page} ${action}`);
console.log(`applied ${presses.length} presses`);
