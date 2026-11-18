import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCompareCards } from '../../src/app/quran/compare/buildCards';

const file = join(__dirname, '../../shared/data/quran/compareCards.js');
const write = (cards: object) => writeFileSync(file, `export default JSON.parse(${JSON.stringify(JSON.stringify(cards))});\n`);

async function main() {
  const cards = buildCompareCards();
  write(cards);
  // Story parts are built from the engine cards just written, so the compare page is loaded only after them.
  const { storyCards } = await import('../../src/app/quran/compare/pairCards');
  const stories = storyCards();
  write({ ...cards, stories });
  // Twins are written last: a branches card of two ayat takes its compare pair's verdict.
  const { buildTwinVerdicts } = await import('../../src/app/quran/compare/twins');
  const twins = buildTwinVerdicts();
  writeFileSync(join(__dirname, '../../shared/data/quran/twinVerdicts.json'), `${JSON.stringify({ twins }, null, 1)}\n`);
  console.log('twins', Object.keys(twins).length);
  console.log('compare cards', Object.values(cards.cards).flat().length, 'on', Object.keys(cards.cards).length, 'surah pairs;', Object.keys(stories).length, 'pages with a story');
}

main();
