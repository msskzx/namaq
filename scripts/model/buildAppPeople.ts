// Writes the phone app's people (src/lib/model/appPeople.ts). Run after a converted entry changes: npm run model:app-people
import { writeFileSync } from 'node:fs';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { appPeople } from '../../src/lib/model/appPeople';
import { tieItem } from '../../shared/feedItems';
import { inAppOrder } from '../../shared/tarajim';
import { linkedPairs, peopleGraph } from '../../shared/tarajimGraph';

loadCatalog().then((catalog) => {
  const people = appPeople(catalog);
  writeFileSync('shared/data/tarajim/people.json', `${JSON.stringify(people)}\n`);
  // The «صلة» card's pairs, worked out from the people above (no source of their own) in the app's order, found here once: searching every pair took seconds on the phone's home feed.
  writeFileSync('shared/tarajimTiePairs.json', `${JSON.stringify(linkedPairs(peopleGraph(inAppOrder(people))).map((pair) => tieItem(pair.a, pair.b)))}\n`);
});
