import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import { parseRecord, toDistillateMdx } from './format';
import { buildUsage, createdIn, mergedPrs } from './usage';

const args = process.argv.slice(2);
const recordsDir = path.join(__dirname, '../../docs/records');
const root = path.resolve(args.find((a, i) => !a.startsWith('--') && !['--prs', '--limit'].includes(args[i - 1])) ?? path.join(__dirname, '../../../distillate'));
const out = path.join(root, 'content/records/namaq');
mkdirSync(out, { recursive: true });

function readMdx(text: string) {
  const block = /^export const meta = (\{[\s\S]*?\n\});?[ \t]*(?:\n|$)/m.exec(text);
  if (!block) return null;
  const meta = Object.fromEntries(Object.entries(new Function(`return ${block[1]}`)()).filter(([, v]) => !(Array.isArray(v) && !v.length)));
  return { meta, body: (text.slice(0, block.index) + text.slice(block.index + block[0].length)).trim() };
}

const files = readdirSync(recordsDir).filter((f) => /^R\d{4}-.*\.md$/.test(f)).sort();
let written = 0;
for (const f of files) {
  const record = parseRecord(f.slice(0, -3), readFileSync(path.join(recordsDir, f), 'utf8'));
  const mdx = toDistillateMdx(record);
  const target = path.join(out, `${record.slug}.mdx`);
  if (existsSync(target) && isDeepStrictEqual(readMdx(readFileSync(target, 'utf8')), readMdx(mdx))) continue;
  writeFileSync(target, mdx);
  written++;
}
const kept = new Set(files.map((f) => `${f.slice(0, -3)}.mdx`));
const removed = readdirSync(out).filter((f) => f.endsWith('.mdx') && !kept.has(f));
for (const f of removed) rmSync(path.join(out, f));
console.log(`${written} records written to ${out}, ${files.length - written} already there, ${removed.length} removed`);

if (!args.includes('--no-usage')) {
  const slugs = files.map((f) => f.slice(0, -3));
  const usage = buildUsage(mergedPrs(args), slugs, (s) => createdIn(`${s}.md`, recordsDir));
  const file = path.join(root, 'content/usage/namaq.json');
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(usage, null, 2)}\n`);
  console.log(`${usage.prs.length} PRs with a Records used line written to ${file}`);
}
