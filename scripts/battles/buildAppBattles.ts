// Writes the phone app's battles (src/lib/catalog/appBattles.ts). Run after the catalog's battles change: npm run battles:app
import { writeFileSync } from 'node:fs';
import { appBattles, appMoments } from '../../src/lib/catalog/appBattles';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';

void loadCatalog().then(catalog => {
  const battles = appBattles(catalog);
  writeFileSync('shared/data/battles/battles.json', `${JSON.stringify(battles)}\n`);
  writeFileSync('shared/data/battles/moments.json', `${JSON.stringify(appMoments(battles))}\n`);
});
