import { eventSlugs } from '../../src/lib/catalog/loadCatalog';
import { checkModel } from '../../src/lib/model/check';
import { checkInferences, loadInferences } from '../../src/lib/model/inference';
import { loadModel } from '../../src/lib/model/load';
import { lapsedReviews, loadReviews } from '../../src/lib/model/review';

async function main() {
  const root = process.argv[2] ?? '.';
  const folders = loadModel(root);
  const inferences = loadInferences(root);
  const events = await eventSlugs(`${root}/data/catalog`);
  const issues = [...checkModel(folders, root, events), ...checkInferences(folders, inferences)];
  for (const issue of issues) console.error(`FAIL ${issue}`);
  if (issues.length === 0) {
    for (const review of lapsedReviews(folders, loadReviews(root), root, inferences)) {
      console.warn(
        `LAPSED review of ${review.record} by ${review.reviewer}: it changed since, or is gone`,
      );
    }
  }
  const units = folders.reduce((sum, f) => sum + f.units.length, 0);
  console.log(`Checked ${units} unit(s) in ${folders.length} work(s).`);
  if (issues.length > 0) process.exit(1);
}

void main();
