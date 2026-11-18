import { expect, open, tab, test } from './fixtures';

// The tarajim tab (owner, 2026-11-18): only the people whose Siyar entry is converted (shared/data/tarajim/people.json),
// each with a page built from the entry, and the nasab tree where lines meet.
test('the tarajim tab lists the converted people, filters by title, and opens a person', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await expect(page.getByRole('link', { name: 'الزبير بن العوام' })).toBeVisible();
  // Someone whose entry is not converted is not listed.
  await expect(page.getByRole('link', { name: 'أبو بكر الصديق' })).toHaveCount(0);
  await page.getByRole('button', { name: 'العشرة المبشرون بالجنة' }).click();
  await expect(page.getByRole('link', { name: 'طلحة بن عبيد الله' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'حمزة بن عبد المطلب' })).toHaveCount(0);
  await page.getByRole('button', { name: 'الكل' }).click();
  await page.getByLabel('ابحث في التراجم').fill('صفية');
  await expect(page.getByRole('link', { name: /^صفية/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'الزبير بن العوام' })).toHaveCount(0);

  await page.getByRole('link', { name: /^صفية/ }).click();
  await expect(page).toHaveURL(/\/person\?slug=safiyyah-bint-abd-al-muttalib/);
  await expect(page.getByRole('heading', { name: /نسبها/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /صلاتها/ })).toBeVisible();
  // Her son has a page too: his name opens it.
  await page.getByRole('button', { name: 'الزبير بن العوام' }).click();
  await expect(page).toHaveURL(/slug=az-zubayr-ibn-al-awwam/);
  await expect(page.getByRole('heading', { name: /مناقبه/ })).toBeVisible();
});

test('the nasab tree shows where two lines meet', async ({ page }) => {
  await open(page, '/nasab?slug=al-abbas-ibn-abd-al-muttalib');
  await expect(page.getByRole('link', { name: 'العباس' })).toBeVisible();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('button', { name: 'محمد ﷺ' }).click();
  await expect(page.getByText('يلتقيان في: عبد المطلب')).toBeVisible();
  await expect(page.getByRole('link', { name: 'محمد ﷺ' })).toBeVisible();
});

// The people graph (owner, 2026-11-18; sketch tarajim-app/graph/sketch2-dark.png): one person in the middle with his ties,
// and «بينه وبين…» drawing the nearest chain between the people picked.
test('the ties view draws a person with his ties and walks to a relative', async ({ page }) => {
  await open(page, '/person?slug=az-zubayr-ibn-al-awwam');
  await page.getByRole('button', { name: 'ارسم صلاته' }).click();
  await expect(page).toHaveURL(/\/ties\?slug=az-zubayr-ibn-al-awwam/);
  await expect(page.getByRole('heading', { name: 'الزبير بن العوام' })).toBeVisible();
  await page.getByRole('link', { name: /^أمه: صفية/ }).click();
  await expect(page.getByRole('heading', { name: /^صفية/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^ابنها: الزبير/ })).toBeVisible();
});

test('between two people shows the chain that joins them, with its pages', async ({ page }) => {
  await open(page, '/between?slugs=az-zubayr-ibn-al-awwam,hamzah-ibn-abd-al-muttalib');
  await expect(page.getByText(/أمُّ الزبير بن العوام/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'حمزة بن عبد المطلب' })).toBeVisible();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('button', { name: /^العباس/ }).click();
  await expect(page.getByRole('link', { name: /^العباس/ })).toBeVisible();
});
