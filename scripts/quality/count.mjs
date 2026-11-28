import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const root = join(import.meta.dirname, '..', '..');
const AREAS = { app: 'mobile/src', shared: 'shared', website: 'src', scripts: 'scripts' };
const SKIP = new Set(['node_modules', 'generated', '.next', '.expo']);

const filesUnder = dir => readdirSync(dir).flatMap(name => {
  if (SKIP.has(name)) return [];
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return filesUnder(path);
  return /\.(ts|tsx|mjs|js)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name) ? [path] : [];
});

const commentsOf = (file, text) => {
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const seen = new Map();
  const collect = ranges => { for (const range of ranges ?? []) seen.set(range.pos, range); };
  const walk = node => {
    if (node.kind === ts.SyntaxKind.JsxText) return;
    collect(ts.getLeadingCommentRanges(text, node.pos));
    collect(ts.getTrailingCommentRanges(text, node.end));
    for (const child of node.getChildren(source)) walk(child);
  };
  walk(source);
  let comments = 0;
  let lines = 0;
  let directives = 0;
  for (const range of seen.values()) {
    const comment = text.slice(range.pos, range.end);
    if (/^\/[/*]\s*(eslint-|@ts-|prettier-ignore)/.test(comment)) { directives += 1; continue; }
    comments += 1;
    lines += comment.split('\n').length;
  }
  return { comments, lines, directives };
};

const count = (text, pattern) => (text.match(pattern) ?? []).length;

const rows = Object.entries(AREAS).map(([area, dir]) => {
  const files = filesUnder(join(root, dir));
  const total = { area, files: files.length, commentLines: 0, comments: 0, lintDirectives: 0, useEffect: 0, setTimeout: 0, emptyCatch: 0 };
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const found = commentsOf(file, text);
    total.comments += found.comments;
    total.commentLines += found.lines;
    total.lintDirectives += found.directives;
    total.useEffect += count(text, /\buse(Layout)?Effect\(/g);
    total.setTimeout += count(text, /\bset(Timeout|Interval)\(|\brequestAnimationFrame\(/g);
    total.emptyCatch += count(text, /catch\s*(\([^)]*\))?\s*\{\s*\}/g);
  }
  return total;
});

console.table(rows);

if (process.argv.includes('--lint')) {
  const run = (cwd, args) => {
    try { return execFileSync('npx', ['eslint', ...args, '-f', 'json'], { cwd, maxBuffer: 1 << 28 }).toString(); }
    catch (error) { if (error.stdout?.length) return error.stdout.toString(); throw error; }
  };
  const tally = json => JSON.parse(json).reduce((sum, file) => {
    for (const message of file.messages) {
      sum[message.severity === 2 ? 'errors' : 'warnings'] += 1;
      sum.byRule[message.ruleId] = (sum.byRule[message.ruleId] ?? 0) + 1;
    }
    return sum;
  }, { errors: 0, warnings: 0, byRule: {} });
  const app = tally(run(join(root, 'mobile'), ['src', 'scripts']));
  console.log(`app lint: ${app.errors} errors, ${app.warnings} warnings`);
  console.table(Object.entries(app.byRule).sort((a, b) => b[1] - a[1]).map(([rule, n]) => ({ rule, n })));
}
