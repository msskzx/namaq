import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findHadith, type SahihText } from './sahih';

const ROOT = join(__dirname, '..');
type TextFix = { book: string; n: number; route?: string; wrong: string; right: string; witness: string };
const fixes = JSON.parse(readFileSync(join(ROOT, 'data/hadith/sahih-text-fixes.json'), 'utf8')) as TextFix[];

describe('fixes to the Sahih text', () => {
  it('each names the printed page it comes from', () => {
    expect(fixes.length).toBeGreaterThan(0);
    for (const fix of fixes) expect(fix.witness, `${fix.book} ${fix.n}`).toMatch(/[٠-٩]+\/[٠-٩]+/);
  });

  it('holds in the built text', () => {
    for (const fix of fixes) {
      const text = JSON.parse(readFileSync(join(ROOT, `data/hadith/sahih/${fix.book}.json`), 'utf8')) as SahihText;
      const routes = findHadith(text, fix.n)?.hadith.routes.filter(route => !fix.route || route.route === fix.route) ?? [];
      const words = routes.map(route => route.text).join(' ');
      expect(words, `${fix.book} ${fix.n}`).toContain(fix.right);
      expect(words, `${fix.book} ${fix.n}`).not.toContain(fix.wrong);
    }
  });
});
