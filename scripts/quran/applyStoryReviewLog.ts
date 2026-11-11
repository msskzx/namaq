import { applyStoryReviewLog } from '../../src/lib/quran/curation/storyReviewLog';

// docs/plans/quran-prophet-timelines.md
const presses = applyStoryReviewLog();
for (const { key, action } of presses) console.log(`${key} ${action}`);
console.log(`applied ${presses.length} presses`);
