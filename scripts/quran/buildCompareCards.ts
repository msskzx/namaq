import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCompareCards } from '../../src/app/quran/compare/buildCards';

const cards = buildCompareCards();
writeFileSync(join(__dirname, '../../src/app/quran/compare/compareCards.js'), `export default JSON.parse(${JSON.stringify(JSON.stringify(cards))});\n`);
console.log('compare cards', Object.values(cards.cards).flat().length, 'on', Object.keys(cards.cards).length, 'surah pairs');
