import { expect, open, readerPage, returningUser, stored, test } from './fixtures';

const menu = (page: import('@playwright/test').Page) => page.getByRole('toolbar');

test.describe('a new user', () => {
  test('home shows the story circles, the reading card with the date, and the feed', async ({ page }) => {
    await open(page, '/');
    for (const name of ['ما نسيته', 'المحفوظات', 'تأملاتي', 'الأنبياء']) await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
    await expect(page.getByLabel(/^اليوم .*هـ$/)).toBeVisible();
    await expect(page.getByRole('button', { name: /^افتح المصحف حيث توقفت/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'افتحها في المقارنة' }).first()).toBeAttached();
  });

  test('the reading card opens the mushaf where it was left', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null })));
    await open(page, '/');
    await page.getByRole('button', { name: /^افتح المصحف حيث توقفت، سورة الكهف/ }).click();
    await expect(page).toHaveURL(/\/read/);
    expect(await readerPage(page)).toBe(300);
  });

  test('the tree card is the branches tree with one tree, and opens it on the branches tab', async ({ page }) => {
    await open(page, '/');
    const button = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first();
    await button.scrollIntoViewIfNeeded();
    // The card's head names the tree; the branches tab opens on that same tree.
    const title = (await page.getByText('من متشابهات القرآن').first().locator('xpath=preceding-sibling::*[1]').textContent())!.trim();
    await button.click();
    await expect(page).toHaveURL(/\/branches/);
    await expect(page.getByLabel(/^الشجرة \S+ من /)).toBeAttached();
    await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
  });

  test('the pair card is the compare card and opens the compare tab', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeAttached();
    await page.getByRole('button', { name: 'افتحها في المقارنة' }).first().click();
    await expect(page).toHaveURL(/\/compare/);
  });

  test('the story circles open their pages', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'الأنبياء', exact: true }).click();
    await expect(page).toHaveURL(/\/prophets/);
  });

  test('the feed has no tools or «more» button, and loads the next trees as the page nears its end', async ({ page }) => {
    await open(page, '/');
    const trees = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' });
    await expect(trees.first()).toBeAttached();
    for (const name of ['مواقيت الصلاة', 'المزيد للتأمل', 'افتح المحفوظات']) await expect(page.getByRole('button', { name })).toHaveCount(0);
    await page.mouse.move(195, 500);
    await expect(async () => {
      await page.mouse.wheel(0, 3000);
      expect(await trees.count()).toBeGreaterThan(2);
    }).toPass({ timeout: 20_000 });
  });

  test('the feed asks a question of every Quran quiz kind in turn, each card with the quiz buttons', async ({ page }) => {
    // Three batches a day take three kinds in turn; three days apart, the seven kinds all come up.
    const kinds = ['في أي سورة؟', 'أكمل الشجرة', 'سمّع بقية الآية', 'أوائل السور', 'التحفة: أكمل البيت', 'التحفة: البيت التالي', 'التحفة: حكم الحرف'];
    const seen = new Set<string>();
    for (const days of [0, 3, 6]) {
      await page.clock.setFixedTime(new Date(Date.now() + days * 86_400_000));
      await open(page, '/');
      await page.mouse.move(195, 500);
      await expect(async () => {
        await page.mouse.wheel(0, 3000);
        expect(await page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).count()).toBeGreaterThan(3);
      }).toPass({ timeout: 20_000 });
      // The day's three question cards, each a kind of its own; a card draws once its question is worked out.
      const here = new Set<string>();
      await expect.poll(async () => {
        for (const name of kinds) if (await page.getByRole('heading', { name, exact: true }).count()) here.add(name);
        return here.size;
      }, { timeout: 20_000 }).toBeGreaterThanOrEqual(3);
      here.forEach(name => seen.add(name));
    }
    expect([...seen].sort()).toEqual([...kinds].sort());
    expect(await page.getByRole('button', { name: 'اختبار فردي' }).count()).toBeGreaterThan(2);
  });

  test('a «which surah» card shows the ayah number and marks the surah picked', async ({ page }) => {
    for (const days of [0, 3, 6]) {
      await page.clock.setFixedTime(new Date(Date.now() + days * 86_400_000));
      await open(page, '/');
      await page.mouse.move(195, 500);
      await expect(async () => {
        await page.mouse.wheel(0, 3000);
        expect(await page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).count()).toBeGreaterThan(3);
      }).toPass({ timeout: 20_000 });
      if (await page.getByRole('heading', { name: 'في أي سورة؟', exact: true }).first().waitFor({ timeout: 10_000 }).then(() => true, () => false)) break;
    }
    const card = page.getByRole('heading', { name: 'في أي سورة؟', exact: true }).first().locator('xpath=ancestor::div[.//*[@aria-label="اختبار فردي"]][1]');
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByText(/[٠-٩]+$/).first()).toBeAttached();
    // The choices are the card's buttons with words; the quiz buttons are icons.
    const choice = card.getByRole('button').filter({ hasText: /\S/ }).first();
    await choice.click();
    await expect(choice).toBeDisabled();
  });

  test('the prophets card is one group of a story map, and a dot opens the story there', async ({ page }) => {
    await open(page, '/');
    await page.mouse.move(380, 500);
    const story = page.getByRole('heading', { name: /^قصة .* في القرآن$/ }).first();
    await expect(async () => {
      await page.mouse.wheel(0, 3000);
      await expect(story).toBeAttached({ timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    const card = story.locator('xpath=ancestor::div[.//*[@aria-label="افتح القصة"]][1]');
    // A dot is labelled by its event, its surah and its ayat; the card draws one group, so every dot is on screen sideways.
    const dots = card.getByRole('button', { name: /، .*، .*آي/ });
    expect(await dots.count()).toBeGreaterThan(1);
    const label = (await dots.first().getAttribute('aria-label'))!;
    await dots.first().click();
    await expect(page).toHaveURL(/\/prophets\/[^/?]+\?.*event=\d+.*surah=\d+/);
    await expect(page.getByRole('button', { name: label }).first()).toBeAttached();
  });

  test('the search finds a surah and opens it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'البحث' }).click();
    await page.getByLabel('ابحث في كل شيء').fill('الكهف');
    await page.getByRole('link', { name: '١٨ الكهف' }).click();
    await expect.poll(() => readerPage(page)).toBe(293);
  });

  test('the settings sheet opens from home', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'الإعدادات' }).click();
    await expect(page.getByRole('button', { name: 'الجولة التعريفية' })).toBeVisible();
  });
});

test.describe('a returning user', () => {
  test.use({ seed: returningUser() });

  test('a saved ayah opens on its mushaf page from the card menu', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'المحفوظات', exact: true }).click();
    await page.getByRole('button', { name: /^آية: ٱللَّهُ لَآ إِلَٰهَ/ }).click();
    await menu(page).getByRole('button', { name: 'في المصحف' }).click();
    await expect.poll(() => readerPage(page)).toBe(42);
  });

  test('a remembered ayah leaves the feed until its review is due', async ({ page }) => {
    await open(page, '/');
    // The recall card, by its title: an openings card further down has the same buttons.
    const recall = page.getByRole('heading', { name: 'هل تذكرها؟', exact: true });
    await expect(recall).toHaveCount(1);
    await page.getByRole('button', { name: 'تذكّرتها' }).first().click();
    await expect(recall).toHaveCount(0);
    await expect.poll(async () => (await stored<Record<string, { due?: number }>>(page, 'ayah-forgot'))?.['18:10']?.due).toBeGreaterThan(Date.now());
  });

  test('the recall card takes typed words in the write boxes and grades them', async ({ page }) => {
    await open(page, '/');
    const boxes = page.getByRole('button', { name: 'اكتب هذه الكلمة' });
    await expect(boxes.first()).toBeVisible();
    const count = await boxes.count();
    expect(count).toBeGreaterThan(0);
    await boxes.first().click();
    for (let i = 0; i < count; i++) await page.keyboard.type('خطا ');
    await expect(page.getByLabel('كتبت: خطا').first()).toBeVisible();
    await expect.poll(async () => (await stored<Record<string, { forgot: number }>>(page, 'ayah-forgot'))?.['18:10']?.forgot).toBe(2);
  });

  test('the forgotten review opens the mushaf in recite mode', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'راجع ما نسيت' }).click();
    await expect.poll(() => readerPage(page)).toBe(294);
    await expect(page.getByRole('button', { name: 'أظهر الآية التالية' })).toBeVisible();
  });

  test('the notes circle lists the notes, and a note can be deleted', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'تأملاتي', exact: true }).click();
    await page.getByRole('button', { name: 'تأمل: تأمل في الحي القيوم' }).click();
    await menu(page).getByRole('button', { name: 'احذف التأمل' }).click();
    await expect(page.getByRole('button', { name: /^تأمل:/ })).toHaveCount(0);
    await expect.poll(() => stored(page, 'ayah-notes')).toEqual({});
  });
});
