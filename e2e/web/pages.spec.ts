import { expect, hasDatabase, noErrorPage, test } from './fixtures';

test.describe('pages without the database', () => {
  test('the Quran hub links to its tools', async ({ page }) => {
    await page.goto('/quran');
    for (const name of ['متشابهات القرآن', 'مقارنة السور', 'قصص الأنبياء', 'تحفة الأطفال']) await expect(page.getByRole('link', { name }).first()).toBeVisible();
    await noErrorPage(page);
  });

  test('the quizzes page lists every quiz', async ({ page }) => {
    await page.goto('/quizzes');
    for (const name of ['اختبار فردي', 'اختبار جماعي', 'تسميع', 'اكتب أول الآية وآخرها']) await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  });

  test('prayer times for a picked city', async ({ page }) => {
    await page.goto('/utilities');
    await page.getByRole('button', { name: 'اختر مدينة' }).click();
    await page.getByLabel('ابحث عن مدينة').fill('القاهرة');
    await page.getByRole('button', { name: 'القاهرة', exact: true }).or(page.getByRole('radio', { name: 'القاهرة' })).first().click();
    await expect(page.getByRole('button', { name: 'المكان: القاهرة' })).toBeVisible();
    await expect(page.getByText('الفجر').first()).toBeVisible();
  });

  test('a prophet story dot shows its ayat', async ({ page }) => {
    await page.goto('/quran/prophets');
    const dot = page.getByRole('button', { name: /^إغراق فرعون وجنوده، البقرة/ });
    await dot.click();
    await expect(dot).toHaveAttribute('aria-current', 'true');
    await expect(page.getByRole('link', { name: 'افتح البقرة في المصحف' }).first()).toBeVisible();
    await noErrorPage(page);
  });

  test('the words page shows a word\'s places', async ({ page }) => {
    await page.goto('/quran/words');
    const word = page.getByRole('button', { name: 'مواضع «ٱللَّه»' });
    await word.click();
    await expect(word).toHaveAttribute('aria-pressed', 'true');
    await noErrorPage(page);
  });
});

test.describe('pages with the database', () => {
  test.skip(!hasDatabase, 'needs DATABASE_URL or .env (see e2e/README.md)');

  test('home shows the shortcuts and the daily card, and opens the mushaf', async ({ page }) => {
    await page.goto('/');
    for (const name of ['ما نسيته', 'المحفوظات', 'تأملاتي', 'الأنبياء']) await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'افتحها في المقارنة' })).toBeVisible();
    await page.getByRole('link', { name: 'افتح المصحف حيث توقفت' }).click();
    await expect(page).toHaveURL(/\/quran\/read/);
    await noErrorPage(page);
  });

  test('branches shows the first tree', async ({ page }) => {
    await page.goto('/quran/branches');
    await expect(page.getByRole('progressbar', { name: 'التقدم بين الأشجار' })).toBeAttached();
    await expect(page.getByRole('region', { name: 'شجرة العبارات المشتركة' }).filter({ visible: true }).first()).toBeVisible();
    await noErrorPage(page);
  });

  test('the reader opens and a long press on an ayah shows its actions', async ({ page }) => {
    await page.goto('/quran/read/1');
    await expect(page.getByLabel('الصفحة ١', { exact: true })).toBeVisible();
    const word = page.getByText('ٱلۡحَمۡدُ', { exact: true }).first();
    // Until the page has hydrated a press does nothing, so the press is tried again until the actions show.
    await expect(async () => {
      const box = (await word.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(700);
      await page.mouse.up();
      await expect(page.getByRole('button', { name: 'أشجار هذه الآية' })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    await noErrorPage(page);
  });

  test('compare shows a surah pair', async ({ page }) => {
    await page.goto('/quran/compare');
    await expect(page.getByRole('button', { name: /^اختر سورتين:/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeVisible();
    await noErrorPage(page);
  });
});
