import { writeFileSync } from 'node:fs';
import treeData from '../../shared/data/quran/trees.json';
import type { BranchAyah } from '../../shared/quran/branches';
import { listedPairs, pairCards } from '../../src/app/quran/compare/pairCards';
import { rootGaps, rootTable, rootTableMarkdown } from '../../src/lib/quran/missingRoots';
import { rootWeights, withAliases } from '../../src/lib/quran/mutashabih/similar';

const ayat = (treeData.ayat as BranchAyah[]).map(withAliases);
const info = new Map(ayat.map(ayah => [ayah.key, ayah]));
const gaps = listedPairs.flatMap(({ a, b }) => pairCards(a, b).flatMap(card => rootGaps(card, info, [a, b])));
const markdown = rootTableMarkdown(rootTable(gaps, rootWeights(ayat)));
const out = process.argv[2];
if (out) writeFileSync(out, markdown);
else process.stdout.write(markdown);
console.error(`missing roots: ${gaps.length} gaps`);
