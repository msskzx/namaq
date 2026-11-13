// Draws the app icon, Android adaptive-icon layers, splash images and web favicon from the logo (src/lib/logo.ts).
// Run with `npm run app-icons` after changing the logo or the palette. Needs Playwright.
import { createRequire } from 'node:module';
import { BERRIES, BOWL, BRANCHES } from '../src/lib/logo.ts';

// Playwright is not an app dependency: use the one installed on the machine.
const { chromium } = createRequire(import.meta.url)('playwright');

const LIGHT = { paper: '#f8f6f0', ink: '#202c35', accent: '#783d49' };
const DARK = { paper: '#15191b', ink: '#edeae2', accent: '#d9a6b0' };

const emblem = (ink, accent, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="12 24.7 76 76">`
  + `<path fill="${ink}" d="${BOWL}"/><g transform="translate(-3.06 13.49) scale(0.085)">`
  + `<g fill="${ink}">${BRANCHES.map(d => `<path d="${d}"/>`).join('')}</g>`
  + `<g fill="${accent}">${BERRIES.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="30"/>`).join('')}</g></g></svg>`;

/** `share` is the emblem's width as a part of the canvas; no `background` leaves the canvas see-through. */
const images = [
  { file: 'icon.png', size: 1024, share: 0.66, colours: LIGHT, background: LIGHT.paper },
  { file: 'favicon.png', size: 48, share: 0.8, colours: LIGHT, background: LIGHT.paper },
  // Android shows the middle 72 of the layer's 108 units, cropped to the phone's mask (a circle at most).
  { file: 'android-icon-foreground.png', size: 1024, share: 0.46, colours: LIGHT },
  { file: 'android-icon-monochrome.png', size: 1024, share: 0.46, colours: { ink: '#000000', accent: '#000000' } },
  { file: 'splash-icon.png', size: 1024, share: 1, colours: LIGHT },
  { file: 'splash-icon-dark.png', size: 1024, share: 1, colours: DARK },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const { file, size, share, colours, background } of images) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${background ?? 'transparent'}">${emblem(colours.ink, colours.accent, Math.round(size * share))}</body>`);
  await page.screenshot({ path: new URL(`../assets/${file}`, import.meta.url).pathname, omitBackground: !background });
}
await browser.close();
