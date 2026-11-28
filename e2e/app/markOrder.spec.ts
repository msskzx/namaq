import { SCREENS, urlNamed } from '../featureMap.mjs';
import { expect, open, test } from './fixtures';

const VOWEL_BEFORE_SHADDA_OR_HAMZA = /[\u064B-\u0650\u0652\u0670][\u0651\u0654\u0655]/;

test.describe('every text on every screen keeps the mushaf order of marks, which the Hafs font needs on iOS', () => {
  for (const { name } of SCREENS) {
    test(name, async ({ page }) => {
      await open(page, urlNamed(name)!);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      const found = await page.evaluate(source => {
        const order = new RegExp(source);
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const out: string[] = [];
        for (let node = walker.nextNode(); node; node = walker.nextNode()) if (order.test(node.textContent ?? '')) out.push((node.textContent ?? '').slice(0, 40));
        return out;
      }, VOWEL_BEFORE_SHADDA_OR_HAMZA.source);
      expect(found).toEqual([]);
    });
  }
});
