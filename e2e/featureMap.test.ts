import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SCREENS, SECTIONS, nameAt, routeFiles, urlNamed, urlOf } from './featureMap.mjs';
import { REPO, mapData, renderPages } from './featureMapPages.mjs';

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
      .filter(label => !label.startsWith('‹') && ![`'${label}'`, `"${label}"`, `>${label}<`, `\`${label}\``].some(literal => app.includes(literal)));
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
      expect(url.pathname, `${screen.name} needs a sample`).not.toContain('[');
      if (!screen.file.includes('[')) expect(url.pathname).toBe(urlOf(screen.file));
    }
  });

  it('sends every link in the code to a screen on the map', () => {
    const { links } = mapData();
    expect(links.length).toBeGreaterThan(0);
    expect(links.filter(link => !link.target).map(link => `${link.route} at ${link.file}:${link.line}`)).toEqual([]);
  });

  it('finds in the code a way into every screen the tab bar does not open', () => {
    const opened = new Set(mapData().links.map(link => link.target?.name));
    expect(SCREENS.filter(screen => !screen.tabBar && !screen.unlinked && !opened.has(screen.name)).map(screen => screen.name)).toEqual([]);
  });

  it('is written in docs/feature-map.md and docs/feature-map/ as the code now stands (run npm run feature-map)', () => {
    const pages = renderPages();
    const onDisk = fs.readdirSync(path.join(REPO, 'docs/feature-map')).map(file => `docs/feature-map/${file}`);
    expect(onDisk.sort()).toEqual([...pages.keys()].filter(file => file.startsWith('docs/feature-map/')).sort());
    for (const [file, text] of pages) expect(fs.readFileSync(path.join(REPO, file), 'utf8'), file).toBe(text);
  });
});
