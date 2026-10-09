// docs/plans/siyar-parsing.md
import { coverageOf } from '../../src/lib/model/coverage';
import { loadModel } from '../../src/lib/model/load';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const unitId = args.find((a) => !a.startsWith('--'));
const rootIndex = args.indexOf('--root');
const root = rootIndex === -1 ? '.' : args[rootIndex + 1];

const folders = loadModel(root);
const targets = folders.flatMap((folder) =>
  folder.units
    .filter((file) => (unitId ? file.unit.id === unitId : file.unit.numbers.printed))
    .map((file) => ({ folder, file })),
);
if (targets.length === 0) {
  console.error(unitId ? `no unit "${unitId}"` : 'no unit with a printed number');
  process.exit(1);
}

let failed = false;
for (const { folder, file } of targets) {
  const c = coverageOf(folder, file, root);
  console.log(`${c.unit}: pages ${c.pages.length > 0 ? `${c.pages[0]}-${c.pages[c.pages.length - 1]}` : 'none'}, ${c.sentences} sentence(s), ${c.covered} covered, ${c.notModeled.length} not modeled, ${c.unresolvedPeople.length} unresolved name(s), ${c.unresolvedEvents.length} unresolved event(s)`);
  if (unitId) {
    c.notModeled.forEach((s) => console.log(`  p${s.page}${s.tag ? ` [${s.tag}]` : ''}: ${s.text}`));
    c.unresolvedPeople.forEach((name) => console.log(`  unresolved: ${name}`));
    c.unresolvedEvents.forEach((name) => console.log(`  unresolved event: ${name}`));
  }
  if (!c.bounded) {
    failed = true;
    console.error('  FAIL the entry has no next heading and does not reach the last page of its volume');
  }
  if (c.outside.length > 0) {
    failed = true;
    console.error(`  FAIL spans outside the entry: ${c.outside.join(', ')}`);
  }
  if (strict && (c.notModeled.length > 0 || c.unresolvedPeople.length > 0 || c.unresolvedEvents.length > 0)) failed = true;
}
if (failed) process.exit(1);
