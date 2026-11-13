import { test as base, expect, type Locator, type Page } from '@playwright/test';

/** What the app keeps in localStorage on the web (mobile/src/lib/deviceStorage.ts), set before the first script runs. */
export type Seed = Record<string, unknown>;

const DAY = 86_400_000;

/** A returning user: one saved ayah, one forgotten ayah and one reflection note. */
export const returningUser = (now = Date.now()): Seed => ({
  bookmarks: [{ id: 'ayah:2:255', text: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ', href: '/quran/read/ayah/2/255', savedAt: now - 1000 }],
  'ayah-forgot': { '18:10': { forgot: 1, at: now - DAY } },
  'ayah-notes': { '2:255': { text: 'تأمل في الحي القيوم', at: now } },
});

type Fixtures = {
  /** Keys to put in localStorage before the page loads. The tour is marked seen unless `tour-seen` is set to null. */
  seed: Seed;
  /** Uncaught errors and console errors; each test fails if any are left at the end. */
  errors: string[];
};

const IGNORED = /Download the React DevTools|favicon/;

export const test = base.extend<Fixtures>({
  seed: [{}, { option: true }],
  errors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error' && !IGNORED.test(message.text())) errors.push(`console: ${message.text()}`);
    });
    await use(errors);
    expect(errors, 'errors on the page').toEqual([]);
  }, { auto: true }],
  page: async ({ page, seed }, use) => {
    const values = { 'tour-seen': true, ...seed };
    await page.addInitScript(entries => {
      if (sessionStorage.getItem('e2e-seeded')) return;
      sessionStorage.setItem('e2e-seeded', '1');
      for (const [key, value] of Object.entries(entries)) {
        if (value === null) continue;
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    }, values);
    await use(page);
  },
});

export { expect };

/** Opens a route and waits until the app has drawn it. */
export async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('#root')).not.toBeEmpty();
}

/** A long press: hold the pointer down on the element's centre. */
export async function longPress(page: Page, target: Locator, ms = 900) {
  // The mushaf page measures its lines and draws again once, so the target is looked up afresh for the press.
  const box = await expect.poll(() => target.boundingBox()).not.toBeNull().then(() => target.boundingBox());
  if (!box) throw new Error('long press target is not on screen');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

/** The tab bar at the bottom (mobile/src/components/TabBar.tsx). */
export const tab = (page: Page, name: 'القرآن' | 'المصحف' | 'الرئيسية' | 'الاختبارات' | 'الأدوات') => page.getByRole('tab', { name, exact: true });

/** What the app keeps under a localStorage key, parsed. */
export const stored = <T = unknown>(page: Page, key: string) =>
  page.evaluate(k => { const value = localStorage.getItem(k); return value === null ? null : JSON.parse(value); }, key) as Promise<T | null>;

/** The mushaf page the reader is on (mobile/src/components/Reader.tsx keeps it in `reader-place`). */
export const readerPage = async (page: Page) => (await stored<{ page: number }>(page, 'reader-place'))?.page ?? null;
