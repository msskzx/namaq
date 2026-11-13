// Writes docs/records as Distillate MDX files.
// Usage: npm run records:export [-- <distillate>/content/records/namaq]
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseRecord, toDistillateMdx } from './format';

const recordsDir = path.join(__dirname, '../../docs/records');
const out = path.resolve(process.argv[2] ?? path.join(__dirname, '../../../distillate/content/records/namaq'));
mkdirSync(out, { recursive: true });

const files = readdirSync(recordsDir).filter((f) => /^\d{4}-.*\.md$/.test(f)).sort();
for (const f of files) {
  const record = parseRecord(f.slice(0, -3), readFileSync(path.join(recordsDir, f), 'utf8'));
  writeFileSync(path.join(out, `${record.slug}.mdx`), toDistillateMdx(record));
}
console.log(`${files.length} records written to ${out}`);
