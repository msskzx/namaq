// How many tree questions each juz range holds, for the solo setup (`npm run quiz:app-counts`, about 20 minutes).
// Building every question of a range takes seconds on a phone, so the counts are worked out here once.
import { writeFileSync } from 'node:fs';
import corpus from '../../shared/data/quran/trees.json';
import type { BranchAyah } from '../../shared/quran/branches';
import type { TreeGroup } from '../../shared/quran/phraseTrees';
import { branchQuestions } from '../../shared/quiz/branchQuestions';

const ayat = corpus.ayat as BranchAyah[];
const counts: Record<string, number> = {};
for (let from = 1; from <= 30; from++) {
  for (let to = from; to <= 30; to++) {
    const whole = from === 1 && to === 30;
    counts[`${from}-${to}`] = branchQuestions(ayat, whole ? null : { from, to }, corpus.trees as TreeGroup[]).length;
  }
  console.log(`juz ${from} done`);
}
writeFileSync(new URL('../../mobile/src/lib/quizCounts.json', import.meta.url), `${JSON.stringify(counts)}\n`);
