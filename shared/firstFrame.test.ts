// see docs/plans/guard-proposals.md, R0038
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tapOnOpen } from '../mobile/src/lib/tabGroups';

const ROOT = join(__dirname, '..');
const FIRST_FRAME = ['mobile/src/app/_layout.tsx', 'mobile/src/lib/theme.ts', 'mobile/src/lib/settings.ts'];

export const importsOf = (source: string) => [
  ...[...source.matchAll(/^\s*(?:import|export)\b(?!\s+type\b)[^'";(]*?(?:from\s*)?['"]([^'"]+)['"]/gm)].map(match => match[1]),
  ...[...source.matchAll(/^(?!\s)(?:(?!=>)[^\n])*?\brequire\(\s*['"]([^'"]+)['"]\s*\)/gm)].map(match => match[1]),
];
const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

function resolve(from: string, spec: string): string | undefined {
  const base = spec.startsWith('@/') ? `mobile/src/${spec.slice(2)}`
    : spec.startsWith('@shared/') ? `shared/${spec.slice(8)}`
    : spec.startsWith('.') ? normalize(join(dirname(from), spec)) : undefined;
  if (!base) return undefined;
  return ['', '.ts', '.tsx', '.json', '/index.ts', '/index.tsx'].map(end => base + end)
    .find(path => existsSync(join(ROOT, path)) && statSync(join(ROOT, path)).isFile());
}

function reach(entries: string[]) {
  const seen = new Map<string, string[]>(entries.map(entry => [entry, [entry]]));
  const queue = [...entries];
  while (queue.length) {
    const file = queue.shift()!;
    if (file.endsWith('.json')) continue;
    const source = readFileSync(join(ROOT, file), 'utf8');
    for (const spec of importsOf(source)) {
      const next = resolve(file, spec);
      if (next && !seen.has(next)) { seen.set(next, [...seen.get(file)!, next]); queue.push(next); }
    }
  }
  return seen;
}

const heavy = (path: string) => path.startsWith('shared/data/') || path.endsWith('.json');

describe('the first frame stays light', () => {
  it('nothing the loading screen loads reaches the books\' data', () => {
    const reached = reach(FIRST_FRAME);
    expect(reached.has('mobile/src/ui/LoadingScreen.tsx')).toBe(true);
    expect([...reached].filter(([path]) => heavy(path)).map(([, chain]) => chain.join(' → '))).toEqual([]);
  });

  it('sees every way of loading a module', () => {
    expect(importsOf([
      "import a from 'a';",
      "import type { B } from 'b';",
      "import { type B2, b3 } from 'b3';",
      "export type { B4 } from 'b4';",
      "import 'c';",
      "export { d } from 'd';",
      "export * from 'e';",
      "import {\n  f,\n  g,\n} from 'f';",
      "const h = require('h');",
      "export default lazyScreen(() => require('i'));",
      "function j() {\n  return require('j');\n}",
    ].join('\n'))).toEqual(['a', 'b3', 'c', 'd', 'e', 'f', 'h']);
  });
});

describe('every tab page fits the tab bar', () => {
  const routes = (dir: string): string[] => readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return routes(path);
    return /\.tsx$/.test(name) && name !== '_layout.tsx' ? [path] : [];
  });
  const pages = routes('mobile/src/app/(tabs)').map(route => {
    const name = route.split('/').at(-1)!.replace(/\.tsx$/, '');
    const source = readFileSync(join(ROOT, route), 'utf8');
    const screen = /require\(\s*['"]([^'"]+)['"]\s*\)/.exec(source)?.[1];
    const drawn = [route, ...(screen ? [resolve(route, screen)!] : [])];
    const own = drawn.flatMap(file => importsOf(readFileSync(join(ROOT, file), 'utf8')).map(spec => resolve(file, spec)))
      .filter((file): file is string => !!file && file.startsWith('mobile/src/components/'));
    return { page: name, text: [...drawn, ...own].map(file => withoutComments(readFileSync(join(ROOT, file), 'utf8'))).join('\n') };
  });
  const MUSHAF = 'read';

  it('finds the tab pages', () => {
    expect(pages.map(page => page.page)).toContain('index');
    expect(pages.map(page => page.page)).toContain('quran');
  });

  it('every page leaves room for the floating bar', () => {
    expect(pages.filter(page => page.page !== MUSHAF && !/\buseTabBarSpace\(/.test(page.text)).map(page => page.page)).toEqual([]);
  });

  it('every page a tap on its open button scrolls to the top listens for that tap', () => {
    const deaf = pages.filter(page => page.page !== MUSHAF && tapOnOpen(page.page) === 'retap'
      && !new RegExp(`useTabRetap\\(\\s*['"]${page.page}['"]`).test(page.text));
    expect(deaf.map(page => page.page)).toEqual([]);
  });
});
