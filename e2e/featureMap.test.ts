import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SCREENS, SECTIONS, nameAt, renderDoc, routeFiles, urlNamed, urlOf } from './featureMap.mjs';

const repo = path.resolve(__dirname, '..');
const named = new Map(SCREENS.map(screen => [screen.name, screen]));

function sourceText(dir: string): string {
  return fs.readdirSync(dir, { withFileTypes: true }).map(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceText(file);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? fs.readFileSync(file, 'utf8') : '';
  }).join('\n');
}

describe('the feature map', () => {
  it('has every route file in mobile/src/app, and no screen without one', () => {
    expect(SCREENS.map(screen => screen.file).sort()).toEqual(routeFiles());
  });

  it('gives each screen its own name, in a section of the tab bar or outside it', () => {
    expect(named.size).toBe(SCREENS.length);
    for (const screen of SCREENS) expect(SECTIONS, screen.name).toContain(screen.section);
  });

  it('leads into each screen only from screens on the map', () => {
    for (const screen of SCREENS) for (const [at] of screen.from ?? []) expect(named.has(at), `${screen.name} from ${at}`).toBe(true);
  });

  it('names fixed labels that the app still shows', () => {
    const app = `${sourceText(path.join(repo, 'mobile/src'))}\n${sourceText(path.join(repo, 'shared'))}`;
    const missing = SCREENS.flatMap(screen => [...(screen.tabBar ? [screen.tabBar] : []), ...(screen.from ?? []).flatMap(([, ...taps]) => taps)])
      .filter(label => !label.startsWith('‹') && !app.includes(label));
    expect(missing, 'Labels in e2e/featureMap.mjs that no longer appear in the app: fix the tap there').toEqual([]);
  });

  it('reaches every screen from the tab bar, unless it says why nothing opens it', () => {
    const reached = new Set(SCREENS.filter(screen => screen.tabBar).map(screen => screen.name));
    for (let grew = true; grew;) {
      grew = false;
      for (const screen of SCREENS) {
        if (!reached.has(screen.name) && (screen.from ?? []).some(([at]) => reached.has(at))) { reached.add(screen.name); grew = true; }
      }
    }
    expect(SCREENS.filter(screen => !reached.has(screen.name) && !screen.unlinked).map(screen => screen.name)).toEqual([]);
  });

  it('opens each screen by its name at its own route, and names the screen back from that route', () => {
    for (const screen of SCREENS) {
      const url = new URL(urlNamed(screen.name)!, 'http://phone');
      expect(nameAt(url.pathname), screen.name).toBe(screen.name);
      if (!screen.file.includes('[')) expect(url.pathname).toBe(urlOf(screen.file));
    }
  });

  it('is drawn in docs/feature-map.md as the map now stands (run npm run feature-map)', () => {
    expect(fs.readFileSync(path.join(repo, 'docs/feature-map.md'), 'utf8')).toBe(renderDoc());
  });
});
