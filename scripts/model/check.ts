import { checkModel } from '../../src/lib/model/check';
import { loadModel } from '../../src/lib/model/load';

const root = process.argv[2] ?? '.';
const folders = loadModel(root);
const issues = checkModel(folders, root);
for (const issue of issues) console.error(`FAIL ${issue}`);
const units = folders.reduce((sum, f) => sum + f.units.length, 0);
console.log(`Checked ${units} unit(s) in ${folders.length} work(s).`);
if (issues.length > 0) process.exit(1);
