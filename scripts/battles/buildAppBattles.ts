// Writes the phone app's places, battles, sira stories, each person's «حياته» and every link both ways (src/lib/catalog/appBattles.ts,
// appStories.ts, appLinks.ts). Run after any catalog change: npm run battles:app
import { writeFileSync } from 'node:fs';
import { appBattles, appMoments } from '../../src/lib/catalog/appBattles';
import { appStories } from '../../src/lib/catalog/appStories';
import { appLife } from '../../src/lib/catalog/appLife';
import { appLinks, linksFile } from '../../src/lib/catalog/appLinks';
import { appPlaces } from '../../src/lib/catalog/appPlaces';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';

void loadCatalog().then(catalog => {
  // A link that names no record, has no type or no source is refused: fix the record it is written on.
  const { links, problems } = appLinks(catalog);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`${problem.at}: ${problem.message}`);
    process.exit(1);
  }
  writeFileSync('shared/data/places.json', `${JSON.stringify(appPlaces(catalog))}\n`);
  const battles = appBattles(catalog);
  writeFileSync('shared/data/battles/battles.json', `${JSON.stringify(battles)}\n`);
  writeFileSync('shared/data/battles/moments.json', `${JSON.stringify(appMoments(battles))}\n`);
  writeFileSync('shared/data/events/stories.json', `${JSON.stringify(appStories(catalog))}\n`);
  writeFileSync('shared/data/events/life.json', `${JSON.stringify(appLife(catalog))}\n`);
  writeFileSync('shared/data/links.json', linksFile(links));
});
