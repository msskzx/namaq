// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 16): a search goes in the top bar only through
// the bar's own `search` prop in the app (mobile/src/ui/TopBar.tsx) and NavSearch on the website (through NavActions or
// NavButtons), so every bar's
// search keeps one size and place (a full-width search box once pushed the bar's buttons away).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
/** A field, or a search of the page's own (BranchSearch, PeopleSearch…); the bar's own NavSearch is not one. */
const FIELDS = /<(SearchField|SearchOpener|Field|TextInput|input|SearchBox|(?!Nav)[A-Z]\w*Search)\b/;
const topBars = (source: string) => elements(source, 'TopBar');

function walk(dir: string): string[] {
  if (!statSync(join(ROOT, dir), { throwIfNoEntry: false })) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path);
    return /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name) ? [path] : [];
  });
}

/** Each `<Name …>` element in a file, through its closing tag (or the end of a self-closing one): props and children. */
export function elements(source: string, name: string): string[] {
  const bars: string[] = [];
  const start = new RegExp(`<${name}\\b`, 'g');
  for (let match = start.exec(source); match; match = start.exec(source)) {
    let depth = 0;
    let end = match.index + 1;
    for (; end < source.length; end++) {
      const ch = source[end];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (ch === '>' && depth === 0 && source[end - 1] !== '=') break;
    }
    const selfClosing = source[end - 1] === '/';
    const close = selfClosing ? end : source.indexOf(`</${name}>`, end);
    bars.push(source.slice(match.index, close === -1 ? end : close));
  }
  return bars;
}

describe('a search in the top bar goes through the bar\'s own search', () => {
  it('no app screen puts a field of its own inside a TopBar', () => {
    const files = walk('mobile/src').filter(path => path !== 'mobile/src/ui/TopBar.tsx');
    const bars = files.flatMap(path => topBars(readFileSync(join(ROOT, path), 'utf8')).map(bar => ({ path, bar })));
    expect(bars.length).toBeGreaterThan(0);
    expect(bars.filter(({ bar }) => FIELDS.test(bar)).map(({ path }) => path)).toEqual([]);
  });

  it('no website page puts a field into the bar except inside NavSearch', () => {
    const slots = walk('src').flatMap(path => {
      const source = readFileSync(join(ROOT, path), 'utf8');
      return [...elements(source, 'NavActions'), ...elements(source, 'NavButtons')].map(slot => ({ path, slot }));
    });
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.filter(({ slot }) => FIELDS.test(slot) && !/<NavSearch(Shown)?\b/.test(slot)).map(({ path }) => path)).toEqual([]);
  });

  it('finds a field in the props or the children', () => {
    expect(topBars('<TopBar back middle={<SearchField value={q} />} />').some(bar => FIELDS.test(bar))).toBe(true);
    expect(topBars('<TopBar back>\n  <Field value={q} />\n</TopBar>').some(bar => FIELDS.test(bar))).toBe(true);
    expect(topBars('<TopBar search={{ value: q, onChangeText: setQ }} />\n<SearchField />').some(bar => FIELDS.test(bar))).toBe(false);
    expect(elements('<NavActions><NavSearch><input /></NavSearch></NavActions>', 'NavActions')[0]).toMatch(/<NavSearch/);
    expect(FIELDS.test('<NavActions><PeopleSearch /></NavActions>')).toBe(true);
    expect(FIELDS.test('<NavActions><NavSearch /></NavActions>')).toBe(false);
  });
});
