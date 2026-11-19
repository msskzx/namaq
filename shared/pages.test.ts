// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 22, R0018): every phone feature ships on the website
// in the same build. shared/pages.ts lists each page with its app route and its website page.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAGES } from './pages';
import { NAV_SECTIONS } from '../src/lib/navigation';

const ROOT = join(__dirname, '..');
const BASELINE = join(__dirname, 'pages.baseline.json');

function walk(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    return statSync(join(ROOT, path)).isDirectory() ? walk(path) : [path];
  });
}

/** The app's route files: every screen under mobile/src/app but layouts and expo-router's own (+not-found…). */
const appRoutes = () => walk('mobile/src/app').filter(path => /\.tsx$/.test(path) && !/\/(_layout|\+[^/]*)\.tsx$/.test(path)).map(path => path.slice('mobile/src/app/'.length));
/** The website's pages, as folders under src/app ('' is the home page); route groups in brackets stay in the path. */
const webPages = () => walk('src/app').filter(path => path.endsWith('/page.tsx')).map(path => path.slice('src/app/'.length, -'/page.tsx'.length).replace(/^page\.tsx$/, ''));

describe('one page list for app and website', () => {
  it('lists every app route and every website page', () => {
    const app = new Set(PAGES.flatMap(page => page.app ?? []));
    const web = new Set(PAGES.flatMap(page => page.web ?? []));
    expect(appRoutes().filter(route => !app.has(route))).toEqual([]);
    expect(webPages().filter(page => !web.has(page))).toEqual([]);
  });

  it('lists nothing that is gone', () => {
    for (const page of PAGES) {
      for (const route of page.app ?? []) expect(existsSync(join(ROOT, 'mobile/src/app', route)), `${page.id}: ${route}`).toBe(true);
      for (const folder of page.web ?? []) expect(existsSync(join(ROOT, 'src/app', folder, 'page.tsx')), `${page.id}: ${folder}`).toBe(true);
    }
    expect(new Set(PAGES.map(page => page.id)).size).toBe(PAGES.length);
  });

  it('gives every page both sides, unless it says why, or waits on the list from before the guard', () => {
    const missing = PAGES.filter(page => !(page.app?.length && page.web?.length) && !page.only).map(page => `${page.id}: no ${page.app?.length ? 'website page' : 'app route'}`);
    const known: string[] = JSON.parse(readFileSync(BASELINE, 'utf8'));
    // Rewriting the list only drops pages that now have both sides.
    if (process.env.UPDATE_BASELINE) writeFileSync(BASELINE, `${JSON.stringify(known.filter(line => missing.includes(line)), null, 2)}\n`);
    expect(missing.filter(line => !known.includes(line)), 'build the other side, or say why with `only`').toEqual([]);
    expect(known.filter(line => !missing.includes(line)), 'done: run with UPDATE_BASELINE=1').toEqual([]);
    for (const page of PAGES.filter(each => each.only)) expect(page[page.only!.side === 'app' ? 'web' : 'app'] ?? [], page.id).toEqual([]);
  });

  it('the website\'s menu has the app bar\'s five sections, in its order', () => {
    const bar = readFileSync(join(ROOT, 'mobile/src/ui/TabBar.tsx'), 'utf8');
    const buttons = [...bar.slice(bar.indexOf('const BUTTONS'), bar.indexOf('];', bar.indexOf('const BUTTONS'))).matchAll(/label: '([^']+)'/g)].map(match => match[1]);
    expect(buttons.length).toBeGreaterThan(0);
    expect(NAV_SECTIONS.map(section => section.label.ar)).toEqual(buttons);
  });
});
