import { expect, longPress, open, readerPage, stored, test } from './fixtures';

// Words are matched as the mushaf data writes them (shared/data/quran/mushaf/1.json).
const HAMD = 'ٱلۡحَمۡدُ';
const IHDINA = 'ٱهۡدِنَا';

const pressWord = async (page: import('@playwright/test').Page, word: string) => {
  const target = page.getByText(word, { exact: true }).first();
  await expect(target).toBeVisible();
  // A press that lands while the page draws itself again is lost, so it is pressed again until the menu shows.
  await expect(async () => {
    await longPress(page, target);
    await expect(page.getByRole('toolbar')).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
};

test('a tap on an ayah shows the bars, the index finds a surah', async ({ page }) => {
  await open(page, '/read');
  await page.getByText(HAMD, { exact: true }).first().click();
  await page.getByRole('button', { name: 'فهرس السور والبحث' }).click();
  await page.getByLabel('ابحث عن سورة أو آية').fill('يس');
  await page.getByRole('link').filter({ hasText: 'يس' }).first().click();
  await expect.poll(() => readerPage(page)).toBe(440);
});

test('a long press saves an ayah and marks it forgotten', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await expect(page.getByRole('toolbar', { name: 'الآية ٢ من السورة ١' })).toBeVisible();
  await page.getByRole('button', { name: 'احفظ الآية' }).click();
  await expect.poll(async () => (await stored<{ id: string }[]>(page, 'bookmarks'))?.map(b => b.id)).toContain('ayah:1:2');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'نسيتها' }).click();
  await expect.poll(async () => Object.keys((await stored<object>(page, 'ayah-forgot')) ?? {})).toContain('1:2');
});

test('a reflection note is written from the long-press menu', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'اكتب تأملًا' }).click();
  await page.getByLabel('تأملك في هذه الآية').fill('الحمد كله لله');
  await expect.poll(async () => (await stored<Record<string, { text: string }>>(page, 'ayah-notes'))?.['1:2']?.text).toBe('الحمد كله لله');
});

test('the trees preview sheet lists trees and opens one', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'الأشجار التي فيها الآية' }).click();
  await expect(page.getByRole('button', { name: 'افتح هذه الشجرة' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'افتح هذه الشجرة' }).first().click();
  await expect(page).toHaveURL(/\/branches/);
  // The ayah's tree (الفاتحة ٢ with الصافات ١٨٢) opens in the full list, not in the saved trees.
  await expect(page.getByRole('button', { name: 'سورة الصافات' }).first()).toBeVisible();
  expect((await stored<{ saved: boolean }>(page, 'branches-list'))?.saved).toBe(false);
});

test('the compare preview sheet opens the compare card', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, IHDINA);
  await page.getByRole('button', { name: /المقارن/ }).first().click();
  await expect(page.getByRole('button', { name: /^الفاتحة مع / }).first()).toBeVisible();
  await page.getByRole('button', { name: /^الفاتحة مع / }).first().click();
  await expect(page).toHaveURL(/\/compare/);
});

test('the tafsir sheet shows al-Sa\'di\'s passage for the ayah\'s run, with its page', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'تفسير السعدي' }).click();
  await expect(page.getByRole('heading', { name: 'الفاتحة ١–٧' })).toBeVisible();
  await expect(page.getByText('هو المألوه المعبود', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: /تيسير الكريم الرحمن للسعدي، ص ٣٩/ })).toBeVisible();
});

test.describe('surah topics', () => {
  test.use({ seed: { 'reader-place': { page: 582 } } });

  test('the header names the page\'s section; its list opens with al-Biqa\'i\'s aim and jumps to a section', async ({ page }) => {
    await open(page, '/read');
    await page.getByRole('button', { name: 'موضوعات السورة: تساؤل المشركين عن النبأ' }).click();
    await expect(page.getByRole('heading', { name: 'موضوعات سورة النبأ' })).toBeVisible();
    await expect(page.getByText(/^مقصودها الدلالة على أن يوم القيامة/)).toBeVisible();
    await expect(page.getByText('التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ٩ ص ٤')).toBeVisible();
    await page.getByRole('button', { name: /^٤\. جزاء المتقين/ }).click();
    await expect.poll(() => readerPage(page)).toBe(583);
  });
});

test('a word long press shows where else it comes', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: /^مواضع «/ }).click();
  await expect(page.getByRole('button', { name: /^افتح .* في المصحف$/ }).first()).toBeVisible();
});

test.describe('the write quiz', () => {
  test.use({ seed: { 'reader-write': true, 'reader-place': { page: 1, position: { start: '1:1', shown: null, words: 0 } } } });

  test('typed words fill the boxes of the ayah in place', async ({ page }) => {
    await open(page, '/read');
    const written = page.getByRole('button', { name: /^كلمة مكتوبة:/ });
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toBeVisible();
    await page.getByLabel('اكتب الكلمة').focus();
    // A box takes as many letters as its word has, then the next box takes the typing.
    await page.keyboard.type('بسم', { delay: 20 });
    await expect(written).toHaveCount(1);
    await page.keyboard.type('اللهالرحمنالرحيم', { delay: 20 });
    await expect(written).toHaveCount(4);
    await expect(written.first()).toHaveAccessibleName('كلمة مكتوبة: بسم');
  });

  test('a wrong word keeps what was typed above it and puts the ayah on the forgotten shelf', async ({ page }) => {
    await open(page, '/read');
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toBeVisible();
    await page.getByLabel('اكتب الكلمة').focus();
    // A space ends a word whose box takes more letters than were typed.
    await page.keyboard.type('بساالله', { delay: 20 });
    await page.keyboard.type('الرحمن الرحيم', { delay: 20 });
    await expect(page.getByLabel('كتبت: بسا')).toBeVisible();
    await expect.poll(async () => Object.keys((await stored<object>(page, 'ayah-forgot')) ?? {})).toContain('1:1');
  });
});
