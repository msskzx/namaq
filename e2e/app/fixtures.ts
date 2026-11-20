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
  /** Keys to put in localStorage before the page loads. The tour is marked seen unless `tour-seen` is set to null, and the interests asked unless `interests-asked` is. */
  seed: Seed;
  /** Uncaught errors and console errors; each test fails if any are left at the end. */
  errors: string[];
  /** Whether the end-of-test check for a button inside a button runs (on by default). */
  nested: boolean;
  noNestedButtons: void;
};

const IGNORED = /Download the React DevTools|favicon/;
const BUTTON = ':is(button, [role="button"])';
/** A button that sits inside another; exported for its own test. */
export const NESTED = `${BUTTON} ${BUTTON}`;

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
  /**
   * No button inside another button on the page a test ends on (guard proposal 20, R0055): a pressable card that holds a
   * button disables it on the web and hides it from screen readers on phones. Set `nested` to false where a test ends on
   * a page closed or gone.
   */
  nested: [true, { option: true }],
  noNestedButtons: [async ({ page, nested }, use) => {
    await use();
    if (!nested || page.isClosed()) return;
    const inner = await page.locator(NESTED).evaluateAll(found => found.map(element => element.getAttribute('aria-label') ?? element.textContent?.slice(0, 40) ?? ''));
    expect(inner, 'buttons inside another button').toEqual([]);
  }, { auto: true }],
  page: async ({ page, seed }, use) => {
    const values = { 'tour-seen': true, 'interests-asked': '1', ...seed };
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

/** The tab bar at the bottom (mobile/src/ui/TabBar.tsx). */
export const tab = (page: Page, name: 'القرآن' | 'الحديث' | 'الرئيسية' | 'التراجم' | 'الاختبارات') => page.getByRole('tab', { name, exact: true });

/**
 * Reciting hides the mushaf's top bar and the tab bar, whichever way it began (guard proposal 18; Reader.tsx hides them in
 * one place). A hidden bar slides off the screen, so its buttons leave the viewport.
 */
export async function reciteBarsHidden(page: Page) {
  await expect(page.getByRole('button', { name: 'أظهر الآية التالية' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'فهرس السور والبحث' })).not.toBeInViewport();
  await expect(tab(page, 'القرآن')).not.toBeInViewport();
}

/** What the app keeps under a localStorage key, parsed. */
export const stored = <T = unknown>(page: Page, key: string) =>
  page.evaluate(k => { const value = localStorage.getItem(k); return value === null ? null : JSON.parse(value); }, key) as Promise<T | null>;

/** The mushaf page the reader is on (mobile/src/components/Reader.tsx keeps it in `reader-place`). */
export const readerPage = async (page: Page) => (await stored<{ page: number }>(page, 'reader-place'))?.page ?? null;

/** The first box of every quiz blank whose name matches (a regex source): recite mode's boxes (owner, 2026-11-19). */
export const firstBoxes = (page: Page, name: string) => page.getByRole('button', { name: new RegExp(`^${name}، الكلمة ١(:|$)`) });

/**
 * Writes a quiz blank in its recite-mode boxes: a tap on its first box, then one word a box into the hidden field, as many
 * words as the blank has boxes. Tashkeel is left out, as people type.
 */
export async function writeBlank(page: Page, name: string, text: string, nth = 0) {
  const first = firstBoxes(page, name).nth(nth);
  const label = (await first.getAttribute('aria-label'))!.split('،')[0];
  const boxes = await page.getByRole('button', { name: new RegExp(`^${label}، `) }).count() / await firstBoxes(page, label).count();
  await first.click();
  const field = page.getByLabel('اكتب الكلمة', { exact: true });
  for (const word of text.split(' ').slice(0, boxes)) await field.fill(`${word.replace(/[ً-ٰٟۖ-ۭ]/g, '').replace(/ٱ/g, 'ا')} `);
}
