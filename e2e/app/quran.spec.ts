import { expect, open, readerPage, tab, test } from './fixtures';

test('the Quran hub links to every tool', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'القرآن').click();
  for (const name of ['متشابهات القرآن', 'مقارنة السور', 'قصص الأنبياء', 'تحفة الأطفال', 'ألفاظ القرآن']) {
    await expect(page.getByRole('link', { name })).toBeVisible();
  }
  await page.getByRole('link', { name: 'تحفة الأطفال' }).click();
  await expect(page.getByRole('button', { name: /^اختر بابًا:/ })).toBeVisible();
  await page.getByRole('button', { name: 'رجوع' }).click();
  await expect(page.getByRole('link', { name: 'متشابهات القرآن' })).toBeVisible();
});

test.describe('branches', () => {
  test('the tree switches to the matrix and back', async ({ page }) => {
    await open(page, '/branches');
    await expect(page.getByLabel(/^الشجرة ١ من /)).toBeAttached();
    await page.getByRole('button', { name: 'عرض المصفوفة' }).click();
    await expect(page.getByRole('button', { name: 'قراءة الآية' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'عرض الشجرة' }).click();
    await expect(page.getByRole('button', { name: 'حفظ الشجرة' }).first()).toBeVisible();
  });

  test('a tree is saved and shows on the home shelf', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'حفظ الشجرة' }).first().click();
    await tab(page, 'الرئيسية').click();
    await expect(page.getByRole('button', { name: 'افتح المحفوظات' })).toBeVisible();
  });

  test('the search narrows the trees to a phrase', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين');
    await box.press('Enter');
    await expect(page.getByText('«إن المتقين»')).toBeVisible();
    await expect(page.getByRole('button', { name: 'سورة الدخان' })).toBeVisible();
  });
});

test('compare shows a pair and its card actions', async ({ page }) => {
  await open(page, '/compare');
  await expect(page.getByRole('button', { name: /^اختر سورتين:/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeVisible();
  await page.getByRole('button', { name: /^اختر سورتين:/ }).click();
  await page.getByLabel(/^ابحث عن سورة/).fill('الطور');
  await expect(page.getByText('الطور').first()).toBeVisible();
});

test('a prophet story dot shows its ayat, which open in the mushaf', async ({ page }) => {
  await open(page, '/prophets');
  await expect(page.getByRole('button', { name: /^اختر نبيًّا:/ })).toBeVisible();
  await page.getByRole('button', { name: /^إغراق فرعون وجنوده، البقرة/ }).click();
  const read = page.getByRole('button', { name: /^افتح البقرة/ }).first();
  await expect(read).toBeVisible();
  await read.click();
  await expect.poll(() => readerPage(page)).toBe(8);
});

test('the words page finds a word and lists its places', async ({ page }) => {
  await open(page, '/words');
  await page.getByLabel('ابحث عن كلمة في القرآن').fill('رحم');
  const word = page.getByRole('button', { name: /، .* مرة$/ }).first();
  await expect(word).toBeVisible();
  await word.click();
  await expect(page.getByRole('button', { name: /^افتح .* في المصحف$/ }).first()).toBeVisible();
});
