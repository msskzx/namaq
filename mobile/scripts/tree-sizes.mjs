// Draws every tree both ways in the web build and writes their sizes to src/lib/treeSizes.json.
// Run with `npm run tree-sizes` after changing how trees are drawn or which trees exist. Needs Playwright.
import { createServer } from 'node:http';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';

// Playwright is not an app dependency: use the one installed on the machine.
const { chromium } = createRequire(import.meta.url)('playwright');

const dist = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.json': 'application/json', '.png': 'image/png' };
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://x').pathname);
  const file = [join(dist, path), join(dist, `${path}.html`), join(dist, path, 'index.html'), join(dist, 'index.html')]
    .find(candidate => existsSync(candidate) && !candidate.endsWith('/'));
  response.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
  response.end(readFileSync(file));
}).listen(0);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 800 } });
await page.goto(`http://localhost:${server.address().port}/tree-sizes`);
await page.waitForFunction(() => globalThis.treeSizes, null, { timeout: 30 * 60 * 1000, polling: 1000 });
const sizes = await page.evaluate(() => globalThis.treeSizes);
await browser.close();
server.close();

const sorted = Object.fromEntries(Object.keys(sizes).sort().map(key => [key, sizes[key]]));
writeFileSync(new URL('../src/lib/treeSizes.json', import.meta.url), `${JSON.stringify(sorted)}\n`);
console.log(`${Object.keys(sorted).length} tree sizes written`);
