import { expect, open, tab, test, type Seed } from './fixtures';

// The atlas (owner, 2026-11-23; sketch /mnt/project-files/atlas/sketch2-dark.png): the battles on one map in two layers,
// every pin with its book, a search in the top bar, and the feed's year card opening it at its year.
test('the tarajim tab opens the atlas; a year lights its places and a search opens a place with its book', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: 'الأطلس' }).click();
  await expect(page.getByRole('tab', { name: 'في حياته ﷺ', selected: true })).toBeVisible();
  await page.getByRole('button', { name: /^السنة ٩: / }).click();
  await expect(page.getByRole('img', { name: /^خريطة: .*تبوك/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'افتح غزوة تبوك' })).toBeVisible();

  // The sheet comes up while a search is typed, so its results stay above the keyboard, and goes back down to show the pick.
  await page.getByLabel('ابحث في الأطلس').fill('اليرموك');
  await expect(page.getByRole('button', { name: 'أنزل اللوح' })).toBeVisible();
  await page.getByRole('button', { name: 'معركة اليرموك' }).click();
  await expect(page.getByRole('button', { name: 'ارفع اللوح' })).toBeVisible();
  // The pin's sheet names the book that places it and the GeoNames record of its coordinates.
  await expect(page.getByRole('dialog').getByRole('button', { name: /^معجم البلدان، / }).first()).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: /^GeoNames، رقم / }).first()).toBeVisible();
  await expect(page.getByRole('tab', { name: 'بعده ﷺ', selected: true })).toBeVisible();
});

test.describe('the year card', () => {
  test.use({ seed: { bookmarks: [{ id: 'card:battle-year:5', text: '', href: '', savedAt: Date.now() }] } satisfies Seed });
  test('shows the year on the atlas, its button under the card, and opens the atlas at that year', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByRole('img', { name: /^خريطة: .*المدينة/ })).toBeVisible();
    await page.getByRole('button', { name: 'افتح السنة ٥ في الأطلس' }).click();
    await expect(page).toHaveURL(/\/atlas\?year=5/);
    await expect(page.getByRole('button', { name: 'افتح غزوة الخندق' })).toBeVisible();
  });
});

// «أين كانت؟» (owner, 2026-11-23): the reader taps a place on the map; the pins name no place until answered.
test('«أين كانت؟» asks a battle\'s place on the map and names the places once answered', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'أين كانت؟' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  const pins = page.getByRole('button', { name: /^موضع [٠-٩]+$/ });
  await expect(pins.first()).toBeVisible();
  await pins.first().click();
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByRole('button', { name: /^موضع / })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^GeoNames، رقم / }).or(page.getByText(/GeoNames/)).first()).toBeVisible();
});
