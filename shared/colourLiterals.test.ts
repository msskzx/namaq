// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 17): colour values live only in the theme files,
// src/app/theme.css on the website and mobile/src/lib/theme.ts in the app (AGENTS.md "Documentation", docs/palette.md),
// so a theme change reaches every screen. colourLiterals.baseline.json lists today's other files with their counts; a
// file may never hold more, and one that holds fewer has its count lowered
// (`UPDATE_BASELINE=1 npx vitest run colourLiterals`), so the list only shrinks.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const BASELINE = join(__dirname, 'colourLiterals.baseline.json');
const THEMES = ['src/app/theme.css', 'mobile/src/lib/theme.ts'];
const COLOUR = /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\b(?:rgba?|hsla?)\(/g;

function walk(dir: string): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return ['node_modules', 'data'].includes(name) || name.startsWith('.') ? [] : walk(path);
    return /\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
export const colours = (text: string) => withoutComments(text).match(COLOUR)?.length ?? 0;

const counts = () => Object.fromEntries(['src', 'mobile/src', 'shared'].flatMap(walk)
  .filter(path => !THEMES.includes(path))
  .map(path => [path, colours(readFileSync(join(ROOT, path), 'utf8'))] as const)
  .filter(([, n]) => n > 0)
  .sort(([a], [b]) => a.localeCompare(b)));

describe('colour values live only in the theme files', () => {
  it('no file holds more colour values than the baseline lists, and the list only shrinks', () => {
    const now = counts();
    const baseline: Record<string, number> = JSON.parse(readFileSync(BASELINE, 'utf8'));
    // Rewriting the list only lowers it: a file over its count still fails below.
    if (process.env.UPDATE_BASELINE) {
      const lowered = Object.fromEntries(Object.entries(baseline).filter(([path]) => now[path]).map(([path, n]) => [path, Math.min(n, now[path])]));
      writeFileSync(BASELINE, `${JSON.stringify(lowered, null, 2)}\n`);
      Object.keys(baseline).forEach(path => delete baseline[path]);
      Object.assign(baseline, lowered);
    }
    expect(Object.entries(now).filter(([path, n]) => n > (baseline[path] ?? 0)).map(([path, n]) => `${path}: ${n} > ${baseline[path] ?? 0}`)).toEqual([]);
    expect(Object.entries(baseline).filter(([path, n]) => (now[path] ?? 0) < n).map(([path]) => `${path}: lower its count`)).toEqual([]);
  });

  it('the theme files hold the palette', () => {
    for (const path of THEMES) expect(colours(readFileSync(join(ROOT, path), 'utf8')), path).toBeGreaterThan(0);
  });

  it('counts hex, rgb and hsl values, not anchors or entities', () => {
    expect(colours("color: '#C2603E', background: rgba(0, 0, 0, 0.4), border: hsl(20 50% 50%)")).toBe(3);
    expect(colours("href='#about' &#1234; // #fff in a comment")).toBe(0);
  });
});
