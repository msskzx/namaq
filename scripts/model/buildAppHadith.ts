import { writeFileSync } from 'node:fs';
import { appHadith } from '../../src/lib/model/appHadith';

writeFileSync('shared/data/hadith/units.json', `${JSON.stringify(appHadith())}\n`);
