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

test('the surah order narrows to a juz and cites its books', async ({ page }) => {
  await open(page, '/order');
  await expect(page.getByRole('heading', { name: 'فصلت' })).toBeVisible();
  await page.getByRole('button', { name: '٣٠', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'النبأ' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^البقاعي، نظم الدرر/ }).first()).toBeVisible();
});

test.describe('branches', () => {
  test('the tree switches to the matrix and back', async ({ page }) => {
    await open(page, '/branches');
    await expect(page.getByLabel(/^الشجرة ١ من /)).toBeAttached();
    // Each card has its own switch, under it.
    await page.getByRole('button', { name: 'عرض المصفوفة' }).first().click();
    await expect(page.getByRole('button', { name: /^قراءة / }).first()).toBeVisible();
    await page.getByRole('button', { name: 'عرض الشجرة' }).first().click();
    await expect(page.getByRole('button', { name: 'حفظ الشجرة' }).first()).toBeVisible();
  });

  test('every matrix has one studio: the read-along, and on a book matrix a switch to its connections', async ({ page }) => {
    // The cards either side are drawn off screen, ready for a swipe: only the open card's buttons count.
    const onScreen = async (name: string) => {
      const buttons = page.getByRole('button', { name, exact: true });
      const found = [];
      for (let i = 0; i < await buttons.count(); i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box && box.x >= 0 && box.x + box.width <= 390) found.push(buttons.nth(i));
      }
      return found;
    };
    const swipe = async () => {
      await page.mouse.move(80, 400);
      await page.mouse.down();
      await page.mouse.move(330, 400, { steps: 8 });
      await page.mouse.up();
    };
    await open(page, '/branches');
    await expect(page.getByLabel(/^الشجرة ١ من /)).toBeAttached();
    await (await onScreen('عرض المصفوفة'))[0].click();
    await expect.poll(async () => (await onScreen('استوديو القراءة')).length).toBe(1);
    expect(await onScreen('استوديو الروابط')).toHaveLength(0);
    await (await onScreen('استوديو القراءة'))[0].click();
    await page.getByRole('button', { name: 'اقرأ مع التظليل' }).click();
    await expect(page.getByRole('button', { name: 'إيقاف مؤقت' })).toBeVisible();
    await page.getByRole('button', { name: 'إغلاق الاستوديو' }).click();
    // The seventh tree (al-Baqarah 6–7 with Ya Sin 10–11) has book connections.
    for (let i = 0; i < 6; i++) {
      await swipe();
      await expect(page.getByLabel(`الشجرة ${['٢', '٣', '٤', '٥', '٦', '٧'][i]} من`, { exact: false })).toBeAttached();
    }
    // A card opens on the default view: this one is switched to its matrix by its own button.
    await expect.poll(async () => (await onScreen('عرض المصفوفة')).length).toBe(1);
    await (await onScreen('عرض المصفوفة'))[0].click();
    await expect.poll(async () => (await onScreen('استوديو الروابط')).length).toBe(1);
    expect(await onScreen('استوديو القراءة')).toHaveLength(0);
    await (await onScreen('استوديو الروابط'))[0].click();
    await page.getByRole('button', { name: 'الروابط', exact: true }).click();
    await expect(page.getByRole('button', { name: 'اقرأ مع التظليل' })).toBeVisible();
    await page.getByRole('button', { name: 'الروابط', exact: true }).click();
    await expect(page.getByRole('button', { name: 'شاهد الروابط' })).toBeVisible();
  });

  test('a tree is saved and shows behind the saved circle on home', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'حفظ الشجرة' }).first().click();
    await tab(page, 'الرئيسية').click();
    await page.getByRole('button', { name: 'المحفوظات', exact: true }).click();
    await expect(page.getByRole('button', { name: /^شجرة: / }).first()).toBeVisible();
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

  test('the studio grows a tree to its end', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين في');
    await box.press('Enter');
    await page.getByRole('button', { name: 'استوديو النمو' }).first().click();
    await page.getByRole('button', { name: 'السرعة 1×' }).click();
    await page.getByRole('button', { name: 'شاهد الشجرة تنمو' }).click();
    await expect(page.getByRole('button', { name: 'إيقاف مؤقت' })).toBeVisible();
    // Once grown, each ayah's path is lit in turn and the ayah is read in full under the tree.
    await expect(page.getByRole('button', { name: 'قارن الحجر ٤٥' })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'إعادة', exact: true })).toBeVisible({ timeout: 30_000 });
  });

  test('the tree video draws each box from where the app laid out its labels and words', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين في');
    await box.press('Enter');
    await page.getByRole('button', { name: 'استوديو النمو' }).first().click();
    await page.getByRole('button', { name: 'مشاركة كفيديو' }).click();
    await expect.poll(() => page.frames().length).toBeGreaterThan(1);
    const recorder = page.frames().find(frame => frame !== page.mainFrame())!;
    await expect.poll(() => recorder.evaluate(() => typeof (window as unknown as { INPUT?: unknown }).INPUT)).toBe('object');
    const scene = await recorder.evaluate(() => (window as unknown as { INPUT: { scene: { boxes: { bare?: boolean; parts?: { label?: string; tab?: boolean; words?: unknown[]; size: number }[] }[] }; look: { ui: string } } }).INPUT);
    const boxes = scene.scene.boxes.filter(item => !item.bare);
    expect(boxes.length).toBeGreaterThan(5);
    // Every box carries its words and references at the places the app drew them, the references in the app's font size.
    for (const item of boxes) {
      expect(item.parts?.some(part => part.words?.length)).toBe(true);
      for (const part of item.parts!.filter(part => part.label)) expect(part.size).toBe(part.tab ? 11 : 13);
    }
    expect(boxes.some(item => item.parts!.some(part => part.tab))).toBe(true);
    // Every box ending an ayah closes with the sign: its number, which the Quran font draws as the sign.
    for (const item of boxes.filter(item => item.parts!.some(part => part.tab))) {
      const words = item.parts!.flatMap(part => (part.words ?? []) as { text: string }[]);
      expect(words.at(-1)?.text).toMatch(/^[٠-٩]+$/);
    }
    expect(scene.look.ui).toContain('Amiri');
  });

  test('the tree card keeps its buttons in place when a path is lit', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين في');
    await box.press('Enter');
    const save = page.getByRole('button', { name: 'حفظ الشجرة' }).first();
    await expect(save).toBeVisible();
    const before = await save.boundingBox();
    await page.getByRole('button', { name: 'سورة الحجر' }).click();
    await expect(page.getByRole('button', { name: 'قارن الحجر ٤٥' })).toBeVisible();
    expect(await save.boundingBox()).toEqual(before);
    // The surah's name comes first, on the right, then «الآيات …».
    const label = page.getByText('الآيات ٤٥–٤٦', { exact: true });
    const name = label.locator('xpath=preceding-sibling::*[1]');
    await expect(name).toHaveText('الحجر');
    expect((await name.boundingBox())!.x).toBeGreaterThan((await label.boundingBox())!.x);
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
