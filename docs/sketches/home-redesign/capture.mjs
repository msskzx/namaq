import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, extname } from 'node:path';
import { chromium } from '@playwright/test';

const output = dirname(fileURLToPath(import.meta.url));
const root = resolve(output, '../../..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.ttf':'font/ttf', '.svg':'image/svg+xml' };
const server = createServer(async (request, response) => {
  const path = resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
  if (!path.startsWith(root + '/')) { response.writeHead(403).end(); return; }
  try { response.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream'); response.end(await readFile(path)); }
  catch { response.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox'] });
  const page = await browser.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
  const errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(base)) external.push(request.url()); });
  const source = JSON.parse(await readFile(resolve(root, 'shared/data/quran/mushaf/1.json'), 'utf8'));
  const ayat = {}; let number = 1;
  for (const item of source.items) for (const token of item.line || []) {
    if (typeof token === 'number') number = token + 1;
    else (ayat['1:' + number] ||= []).push(token);
  }
  const check = async () => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, 'No horizontal overflow');
    assert(await page.evaluate(() => document.fonts.check('18px Amiri') && document.fonts.check('26px Hafs')), 'Bundled fonts load');
    const passages = await page.locator('[data-ayah]').evaluateAll(elements => elements.map(element => ({ key:element.dataset.ayah, text:element.textContent, font:getComputedStyle(element).fontFamily })));
    for (const passage of passages) { assert.equal(passage.text, ayat[passage.key].join(' ')); assert.equal(passage.font, 'Hafs'); }
    assert.equal(await page.locator('.card .card').count(), 0, 'No nested cards');
  };
  const shot = async name => { await page.evaluate(() => window.scrollTo(0,0)); await page.screenshot({path:resolve(output,name+'.png')}); };
  for (const name of ['starting-idea','study-desk']) {
    await page.goto(`${base}/docs/sketches/home-redesign/${name}.html`);
    await page.evaluate(() => document.fonts.ready);
    await page.setViewportSize({width:390,height:844});
    await check();
    await shot(name);
    assert.deepEqual(await page.locator('.tab').allTextContents(), ['القرآن','الحديث','الرئيسية','التراجم','الاختبارات']);
    const logo = await page.locator('.logo').boundingBox(), tools = await page.locator('.tools').boundingBox();
    assert(logo.x < tools.x, 'Logo is left of icon actions');
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({width:390,height});
    await shot(name+'-full');
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(() => window.scrollTo(0,0));
    for (const key of ['quran','hadith','tarajim','quizzes']) {
      await page.locator(`#tabs [data-action="tab:${key}"]`).click();
      assert.equal(await page.locator('#tabs [aria-current="page"]').count(), 1);
      if(key==='quran') { assert.equal(await page.locator('.hub-list .sheet-row').count(),15); await shot('quran-hub'); }
      await page.locator('#tabs [data-action="tab:home"]').click();
    }
    await page.locator('#tools [data-action="all"]').click();
    await page.locator('#sheet [data-action="tab:books"]').click();
    assert.equal(await page.locator('h1').textContent(),'الكتب');
    await page.locator('#tabs [data-action="tab:home"]').click();
    if(name==='starting-idea') assert.equal(await page.locator('.stories .story').count(),4);
  }
  for(const intent of ['review','explore']) {
    await page.locator(`[data-action="intent:${intent}"]`).click();
    assert.equal(await page.locator(`[data-action="intent:${intent}"]`).getAttribute('aria-pressed'),'true');
    await check(); await shot('study-desk-'+intent);
  }
  await page.locator('[data-action="intent:read"]').click();
  const compass = page.locator('#tools [data-action="all"]');
  await compass.click(); await shot('all-tools-sheet');
  await page.locator('.search').fill('البلاغة');
  assert.equal(await page.locator('#directory .sheet-row:visible').count(),1);
  await shot('tool-search');
  await page.locator('.search').fill('xyz-no-result');
  assert(await page.locator('#no-results').isVisible());
  await page.keyboard.press('Escape');
  assert(await compass.evaluate(element => element === document.activeElement), 'Sheet restores focus');
  for (const [label,section] of [['مقارنة السور','القرآن'],['القراءات','القرآن'],['الاستماع','القرآن'],['اختبار فردي','الاختبارات'],['اختبار جماعي','الاختبارات'],['الأعلام','التراجم'],['الرسوم والعلاقات','التراجم']]) {
    await compass.click();
    await page.locator('#directory .sheet-row').filter({hasText:label}).click();
    await page.locator('#sheet .link').click();
    assert.equal(await page.locator('h1').textContent(),section, 'Destination retains its owning section');
    await page.locator('#tabs [data-action="tab:home"]').click();
  }
  await compass.click();
  await page.locator('#directory .sheet-row').filter({hasText:'القراءات'}).click();
  await page.keyboard.press('Escape');
  assert(await compass.evaluate(element => element === document.activeElement), 'Replacement sheet restores original opener');
  await page.locator('[data-action="menu"]').click();
  assert(await page.locator('.frost-menu').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('#tools [data-action="settings"]').click();
  assert.equal(await page.locator('#sheet-title').textContent(),'الإعدادات');
  await page.keyboard.press('Escape');
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log('Sketch checks passed. PNGs captured at 390 CSS pixels, with bundled fonts and Quran source text verified.');
} finally {
  await browser?.close();
  await new Promise(done => server.close(done));
}
