// Writes the phone app's people (src/lib/model/appPeople.ts). Run after a converted entry changes: npm run model:app-people
import { writeFileSync } from 'node:fs';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { appPeople } from '../../src/lib/model/appPeople';

loadCatalog().then((catalog) => {
  writeFileSync('shared/data/tarajim/people.json', `${JSON.stringify(appPeople(catalog))}\n`);
});
