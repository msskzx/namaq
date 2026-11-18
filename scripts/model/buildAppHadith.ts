// Writes the phone app's hadith (src/lib/model/appHadith.ts). Run after the hadith fixtures change: npm run model:app-hadith
import { writeFileSync } from 'node:fs';
import { appHadith } from '../../src/lib/model/appHadith';

writeFileSync('shared/data/hadith/units.json', `${JSON.stringify(appHadith())}\n`);
