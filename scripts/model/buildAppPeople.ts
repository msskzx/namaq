import { writeFileSync } from 'node:fs';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { appPeople } from '../../src/lib/model/appPeople';
import { tieItem } from '../../shared/feedItems';
import { inAppOrder } from '../../shared/tarajim';
import { linkedPairs, peopleGraph } from '../../shared/tarajimGraph';

loadCatalog().then((catalog) => {
  const people = appPeople(catalog);
  writeFileSync('shared/data/tarajim/people.json', `${JSON.stringify(people)}\n`);
  writeFileSync('shared/tarajimTiePairs.json', `${JSON.stringify(linkedPairs(peopleGraph(inAppOrder(people))).map((pair) => tieItem(pair.a, pair.b)))}\n`);
});
