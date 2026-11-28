import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCompareCards, tanasubTrees } from '../../src/app/quran/compare/buildCards';

const file = join(__dirname, '../../shared/data/quran/compareCards.js');
const write = (cards: object) => writeFileSync(file, `export default JSON.parse(${JSON.stringify(JSON.stringify(cards))});\n`);

async function main() {
  const cards = buildCompareCards();
  write(cards);
  writeFileSync(join(__dirname, '../../shared/data/quran/tanasubTrees.json'), `${JSON.stringify({ trees: tanasubTrees() }, null, 1)}\n`);
  const { storyCards } = await import('../../src/app/quran/compare/pairCards');
  const stories = storyCards();
  write({ ...cards, stories });
  const { buildTwinVerdicts } = await import('../../src/app/quran/compare/twins');
  const twins = buildTwinVerdicts();
  writeFileSync(join(__dirname, '../../shared/data/quran/twinVerdicts.json'), `${JSON.stringify({ twins }, null, 1)}\n`);
  console.log('twins', Object.keys(twins).length);
  console.log('compare cards', Object.values(cards.cards).flat().length, 'on', Object.keys(cards.cards).length, 'surah pairs;', Object.keys(stories).length, 'pages with a story');
}

main();
