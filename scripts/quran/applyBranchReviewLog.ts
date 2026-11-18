import { applyBranchReviewLog } from '../../src/lib/quran/curation/branchReview';

/** Folds the owner's branches presses into branchVerdicts.json. Twin presses went to the compare log: run npm run quran:compare-apply for those. */
const presses = applyBranchReviewLog();
for (const { id, action } of presses) console.log(`${id} ${action}`);
console.log(`applied ${presses.length} presses`);
