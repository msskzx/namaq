import { expect, open, tab, test } from './fixtures';

// The tarajim tab (owner, 2026-11-18; a hub since 2026-11-19, the full list on its own page): only the people whose Siyar
// entry is converted (shared/data/tarajim/people.json), each with a page built from the entry, and the nasab tree where lines meet.
test('the tarajim tab opens the list of converted people, filters by title, and opens a person', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: /كل التراجم بترتيب الكتاب/ }).click();
  await expect(page.getByRole('link', { name: 'الزبير بن العوام', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'العشرة المبشرون بالجنة' }).click();
  await expect(page.getByRole('link', { name: 'طلحة بن عبيد الله', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'حمزة بن عبد المطلب', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'الكل' }).click();
  await page.getByPlaceholder('ابحث في التراجم', { exact: true }).fill('صفية');
  await expect(page.getByRole('link', { name: 'صفية بنت عبد المطلب', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'الزبير بن العوام', exact: true })).toHaveCount(0);

  await page.getByRole('link', { name: 'صفية بنت عبد المطلب', exact: true }).click();
  await expect(page).toHaveURL(/\/person\?slug=safiyyah-bint-abd-al-muttalib/);
  await expect(page.getByRole('heading', { name: /نسبها/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /صلاتها/ })).toBeVisible();
  // Her son has a page too: his node on her ties ring opens it.
  await page.getByRole('link', { name: /^ابنها: الزبير/ }).click();
  await expect(page).toHaveURL(/slug=az-zubayr-ibn-al-awwam/);
  await expect(page.getByRole('heading', { name: /مناقبه/ })).toBeVisible();
});

test('the nasab tree shows where two lines meet', async ({ page }) => {
  await open(page, '/nasab?slug=al-abbas-ibn-abd-al-muttalib');
  await expect(page.getByRole('link', { name: 'العباس' })).toBeVisible();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('button', { name: 'محمد ﷺ' }).click();
  // The drawing first (owner, 2026-11-20); where they meet is the text.
  await expect(page.getByRole('link', { name: 'محمد ﷺ' })).toBeVisible();
  await page.getByRole('tab', { name: 'النص' }).click();
  await expect(page.getByText('يلتقيان في: عبد المطلب')).toBeVisible();
});

// The hub's «النسب» opens the nasab page on its search of people (owner, 2026-11-20).
test('the tarajim hub opens the nasab search, and a pick draws his tree', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: /^النسب/ }).click();
  await page.getByLabel('ابحث في التراجم').fill('أبو بكر');
  await page.getByRole('button', { name: 'أبو بكر الصديق' }).click();
  // A box stands alone, so it names his father in the nominative: «أبو قحافة», never «أبي قحافة».
  await expect(page.getByText(/^أبو قحافة/)).toBeVisible();
});

// The people graph (owner, 2026-11-18; sketch tarajim-app/graph/sketch2-dark.png): one person in the middle with his ties,
// and «بينه وبين…» drawing the nearest chain between the people picked.
test('the ties view draws a person with his ties and walks to a relative', async ({ page }) => {
  await open(page, '/person?slug=az-zubayr-ibn-al-awwam');
  await page.getByRole('button', { name: 'تنقّل في صلاته' }).click();
  await expect(page).toHaveURL(/\/ties\?slug=az-zubayr-ibn-al-awwam/);
  await expect(page.getByRole('heading', { name: 'الزبير بن العوام' })).toBeVisible();
  await page.getByRole('link', { name: /^أمه: صفية/ }).click();
  await expect(page.getByRole('heading', { name: /^صفية/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^ابنها: الزبير/ })).toBeVisible();
});

test('between two people shows the chain that joins them, with its pages', async ({ page }) => {
  await open(page, '/between?slugs=az-zubayr-ibn-al-awwam,hamzah-ibn-abd-al-muttalib');
  // The drawing first; the sentence that says it on «النص» (owner, 2026-11-20).
  await expect(page.getByRole('link', { name: 'حمزة بن عبد المطلب' })).toBeVisible();
  await page.getByRole('tab', { name: 'النص' }).click();
  await expect(page.getByText(/أمُّ الزبير بن العوام/)).toBeVisible();
  await page.getByRole('tab', { name: 'الرسم' }).click();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('button', { name: /^العباس/ }).click();
  await expect(page.getByRole('link', { name: /^العباس/ })).toBeVisible();
});

// The person page draws what we have of him (owner, 2026-11-19): «نسبه» as the tree or as text (the drawing first, 2026-11-20), «حياته» on the timeline
// (sketch timeline-events/sketch-dark.png, screens 1 and 4), «صلاته» as the ring.
test('the person page draws his nasab tree, his life and his ties', async ({ page }) => {
  await open(page, '/person?slug=az-zubayr-ibn-al-awwam');
  // The tree first (owner, 2026-11-20), ending at him; the book's words on «النص».
  await expect(page.getByRole('link', { name: 'الزبير' })).toBeVisible();
  await page.getByRole('tab', { name: 'النص' }).first().click();
  await expect(page.getByRole('button', { name: 'قارن نسبه بغيره' })).toBeVisible();
  // His ties round him: his mother opens her own page.
  await expect(page.getByRole('link', { name: /^أمه: صفية/ })).toBeVisible();
  // His life: a raid filter keeps Badr and drops the battle of the Camel; Badr opens its page.
  await expect(page.getByRole('link', { name: /معركة الجمل/ })).toBeVisible();
  await page.getByRole('button', { name: 'الغزوات' }).click();
  await expect(page.getByRole('link', { name: /معركة الجمل/ })).toHaveCount(0);
  await page.getByRole('link', { name: 'غزوة بدر' }).click();
  await expect(page).toHaveURL(/\/battle\?slug=badr/);
});

test('his life beside another\'s puts what they shared on one row', async ({ page }) => {
  await open(page, '/life?slugs=az-zubayr-ibn-al-awwam,abu-bakr-as-siddiq');
  // Both were at Badr: one box each, side by side; only al-Zubayr at the Camel.
  await expect(page.getByRole('link', { name: 'غزوة بدر' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'معركة الجمل' })).toHaveCount(1);
});
