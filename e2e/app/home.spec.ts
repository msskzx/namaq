import { expect, open, readerPage, returningUser, stored, test } from './fixtures';
import { surahName as S } from '../../shared/quran/surahNames';
import * as adhan from 'adhan';
import { DEFAULT_PRAYER_SETTINGS, prayerDay, type Adhan } from '../../shared/prayer';

const menu = (page: import('@playwright/test').Page) => page.getByRole('toolbar');

test.describe('a new user', () => {
  test('home shows the few buttons, the reading card with the date, and the feed', async ({ page }) => {
    await open(page, '/');
    for (const name of ['القبلة', 'الأذكار', 'المكتبة', 'مشاهد', 'مدونتي']) await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
    // No story circles (owner, 2026-11-18): today's juz is a card in the feed.
    for (const name of ['جزء اليوم', 'الأنبياء']) await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'جزء اليوم', exact: true })).toBeAttached();
    // The reading card's head: where the page is and today's Hijri date.
    await expect(page.getByText(/ · .*[٠-٩]{4}$/).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^افتح المصحف حيث توقفت/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'افتحها في المقارنة' }).first()).toBeAttached();
  });

  test('the reading card opens the mushaf where it was left', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null })));
    await open(page, '/');
    await page.getByRole('button', { name: new RegExp(`^افتح المصحف حيث توقفت، سورة ${S(18)}`) }).click();
    await expect(page).toHaveURL(/\/read/);
    expect(await readerPage(page)).toBe(300);
  });

  // The فاصلة wins over the page last open (owner, 2026-11-17).
  test('the reading card opens the mushaf at the فاصلة when one is set', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null }));
      localStorage.setItem('reading-fasila', JSON.stringify({ quran: { key: '2:6', page: 3 } }));
    });
    await open(page, '/');
    await page.getByRole('button', { name: new RegExp(`^افتح المصحف عند فاصلتك، سورة ${S(2)}`) }).click();
    await expect(page).toHaveURL(/\/read/);
    await expect.poll(() => readerPage(page)).toBe(3);
  });

  test('the pair card is the compare card and opens the compare tab', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeAttached();
    await page.getByRole('button', { name: 'افتحها في المقارنة' }).first().click();
    await expect(page).toHaveURL(/\/compare/);
  });

  test.describe('with the tree picked in settings', () => {
    test.use({ seed: { 'branches-view': '"tree"' } });

    test('the tree card is the branches tree with one tree, and opens it on the branches tab', async ({ page }) => {
      await open(page, '/');
      const button = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first();
      await button.scrollIntoViewIfNeeded();
      // The card's head names where the tree's ayat are, surah first; the branches tab opens on that same tree.
      const places = (await button.getByText(/[٠-٩]/).textContent())!.trim();
      const surah = places.match(/^[^٠-٩]+/)![0].trim();
      await button.click();
      await expect(page).toHaveURL(/\/branches/);
      await expect(page.getByLabel(/^الشجرة \S+ من /)).toBeAttached();
      await expect(page.getByRole('button', { name: `سورة ${surah}` }).first()).toBeAttached();
    });

    test('no tree draws tabs: every box names its ayah inside, at the normal size', async ({ page }) => {
      // docs/records/R0042: tabs came back on a path that skipped the rule, and iOS shrank their labels to a speck. Since 2026-11-16
      // (owner) no tree has tabs at all.
      await open(page, '/');
      const tree = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first();
      await expect(tree).toBeAttached();
      // A tree card draws its tree once it comes near the screen.
      await tree.scrollIntoViewIfNeeded();
      await expect(page.locator('[aria-label$="شجرةً"]').first()).toBeAttached();
      await expect(page.getByTestId('node-tab')).toHaveCount(0);
    });
  });

  test('the home buttons open their pages', async ({ page }) => {
    for (const [name, url] of [['مشاهد', /\/lataif/], ['المكتبة', /\/books/], ['مدونتي', /\/library/], ['القبلة', /\/utilities/]] as const) {
      await open(page, '/');
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page).toHaveURL(url);
    }
    await expect(page.getByRole('radio', { name: 'القبلة' })).toBeChecked();
  });

  test('the reading card names the juz of its own page, and today\'s juz is a card that opens the mushaf', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null })));
    await open(page, '/');
    await expect(page.getByText('الجزء ١٥', { exact: true }).first()).toBeVisible();
    const juz = page.getByRole('button', { name: /^اقرأ الجزءا?ن? .*، جزء اليوم$/ });
    await juz.scrollIntoViewIfNeeded();
    await juz.click();
    await expect(page).toHaveURL(/\/read/);
  });

  test('a scene from «مشاهد» and a few books with their authors come up in the feed', async ({ page }) => {
    await open(page, '/');
    await page.mouse.move(380, 500);
    const scene = page.getByRole('button', { name: 'افتح المشاهد' }).first();
    const books = page.getByRole('button', { name: 'افتح المكتبة' }).first();
    await expect(async () => {
      await page.mouse.wheel(0, 3000);
      await expect(scene).toBeAttached({ timeout: 1000 });
      await expect(books).toBeAttached({ timeout: 1000 });
    }).toPass({ timeout: 30_000 });
    await expect(page.getByText('السعدي (ت ١٣٧٦هـ)').first()).toBeAttached();
    await page.getByRole('link', { name: 'تيسير الكريم الرحمن' }).first().click();
    await expect(page).toHaveURL(/\/book/);
  });

  test('the feed has small ayah cards from the tafsir, balagha, i\'rab and readings, each opening the reader\'s own sheet', async ({ page }) => {
    await open(page, '/');
    await page.mouse.move(380, 500);
    const cards = [
      ['من التفسير', 'التفسير كاملًا', page.getByText(/^تيسير الكريم الرحمن للسعدي، ص/)],
      ['من البلاغة', 'البلاغة كاملة', page.getByRole('heading', { name: /^[^ ]+ [٠-٩]+$/ })],
      ['من الإعراب', 'إعراب الآية', page.getByRole('tablist', { name: 'كلمات الآية' })],
      ['من القراءات', 'القراءات كاملة', page.getByText(/^المصدر: /)],
    ] as const;
    for (const [title, button, inSheet] of cards) {
      const head = page.getByRole('heading', { name: title, exact: true }).first();
      await expect(async () => {
        await page.mouse.wheel(0, 3000);
        await expect(head).toBeAttached({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
      await page.getByRole('button', { name: new RegExp(`^${button}، `) }).first().click();
      await expect(inSheet.last()).toBeVisible();
      // A tap above the sheet closes it, as on a phone.
      await expect(async () => {
        await page.mouse.click(195, 40);
        await expect(inSheet).toHaveCount(0, { timeout: 1500 });
      }).toPass({ timeout: 10_000 });
    }
  });

  test.describe('with a prayer near', () => {
    const cairo = { name: 'القاهرة', lat: 30.0444, lng: 31.2357 };
    test.use({ seed: { 'prayer-place': JSON.stringify(cairo) } });

    test('the prayer card comes into the feed with the time left, the five times and the qibla', async ({ page }) => {
      // Ten minutes before today's asr in Cairo, worked out as the app works it out.
      const asr = prayerDay(adhan as unknown as Adhan, cairo, new Date(), DEFAULT_PRAYER_SETTINGS).asr;
      await page.clock.setFixedTime(new Date(asr.getTime() - 10 * 60_000));
      await open(page, '/');
      await expect(page.getByRole('heading', { name: 'العصر بعد ١٠ دقائق', exact: true })).toBeAttached();
      for (const prayer of ['الفجر', 'الظهر', 'المغرب', 'العشاء']) await expect(page.getByLabel(new RegExp(`^${prayer} `)).first()).toBeAttached();
      await page.getByRole('button', { name: 'القبلة' }).last().click();
      await expect(page.getByRole('radio', { name: 'القبلة' })).toBeChecked();
    });

    test('far from a prayer there is no prayer card', async ({ page }) => {
      const asr = prayerDay(adhan as unknown as Adhan, cairo, new Date(), DEFAULT_PRAYER_SETTINGS).asr;
      await page.clock.setFixedTime(new Date(asr.getTime() - 90 * 60_000));
      await open(page, '/');
      await expect(page.getByRole('heading', { name: 'جزء اليوم', exact: true })).toBeAttached();
      await expect(page.getByRole('heading', { name: /^العصر / })).toHaveCount(0);
    });
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

  test('the feed asks a question of every quiz kind in turn, each card with the quiz buttons', async ({ page }) => {
    // Three batches a day take three kinds in turn; three days apart, the sixteen kinds all come up in six days.
    const kinds = ['في أي سورة؟', 'أكمل المتشابهات', 'سمّع بقية الآية', 'قارن الموضعين', 'أوائل السور', 'ما معنى؟', 'لأي آية هذا التفسير؟', 'ما الأسلوب؟', 'ما إعرابها؟', 'كيف يقرؤها؟',
      'التحفة: أكمل البيت', 'التحفة: البيت التالي', 'التحفة: حكم الحرف', 'أين يلتقي النسبان؟', 'صاحب المنقبة', 'السيرة والغزوات'];
    const seen = new Set<string>();
    for (const days of [0, 3, 6, 9, 12, 15]) {
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
    expect(await page.getByRole('button', { name: 'اختبار فردي' }).count()).toBeGreaterThanOrEqual(2);
  });

  test('a «which surah» card shows the ayah number and marks the surah picked', async ({ page }) => {
    // Fourteen kinds take turns, so the «which surah» card may be days away.
    test.setTimeout(120_000);
    for (const days of [0, 3, 6, 9, 12, 15]) {
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
    await expect(card.getByRole('button', { name: 'في المصحف' })).toHaveCount(0);
    await choice.click();
    await expect(choice).toBeDisabled();
    // Answered, the mushaf button joins the row under the card, right before the quiz buttons, and opens the reader.
    const row = card.locator('xpath=.//*[@aria-label="اختبار فردي"]/..');
    await expect(row.getByRole('button', { name: 'في المصحف' })).toHaveCount(1);
    await expect(card.getByRole('button', { name: 'في المصحف' })).toHaveCount(1);
    await row.getByRole('button', { name: 'في المصحف' }).click();
    await expect(page).toHaveURL(/\/read/);
  });

  test('the prophets card is the story map opened at a group, and a dot opens the story page at its top', async ({ page }) => {
    await open(page, '/');
    await page.mouse.move(380, 500);
    const story = page.getByRole('heading', { name: /^قصة .* في القرآن$/ }).first();
    await expect(async () => {
      await page.mouse.wheel(0, 3000);
      await expect(story).toBeAttached({ timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    const card = story.locator('xpath=ancestor::div[.//*[@aria-label="افتح القصة"]][1]');
    // A dot is labelled by its event, its surah and its ayat.
    const dots = card.getByRole('button', { name: /، .*، .*آي/ });
    expect(await dots.count()).toBeGreaterThan(1);
    await dots.first().click();
    // A new reader lands on the story's top, not scrolled to an event (owner, 2026-11-14).
    await expect(page).toHaveURL(/\/prophets\/[^/?]+$/);
  });

  test('the search finds a surah and opens it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'البحث' }).click();
    await page.getByLabel('ابحث في كل شيء').fill('الكهف');
    await page.getByRole('link', { name: `١٨ ${S(18)}` }).click();
    await expect.poll(() => readerPage(page)).toBe(293);
  });

  test('the settings sheet opens from home', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'الإعدادات' }).click();
    await expect(page.getByRole('button', { name: 'الجولة التعريفية' })).toBeVisible();
  });

  // About, privacy and the sources are pages of the app, offline (owner, 2026-11-18), not links to the website.
  for (const [label, text] of [['عن نمق', 'نَمَق تطبيق تعليمي'], ['المصادر والتراخيص', 'الأعمال والبيانات التي اعتمد عليها نمق'], ['سياسة الخصوصية', 'ما يحفظه التطبيق']]) {
    test(`the settings sheet opens «${label}» in the app`, async ({ page }) => {
      await open(page, '/');
      await page.getByRole('button', { name: 'الإعدادات' }).click();
      await page.getByRole('link', { name: label }).click();
      await expect(page.getByText(text).first()).toBeVisible();
      expect(new URL(page.url()).host).not.toBe('namaq.vercel.app');
    });
  }
});

test.describe('a returning user', () => {
  test.use({ seed: returningUser() });

  test('a saved ayah opens on its mushaf page from the card menu', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    await page.getByRole('button', { name: /^آية: ٱللَّهُ لَآ إِلَٰهَ/ }).click();
    await menu(page).getByRole('button', { name: 'في المصحف' }).click();
    await expect.poll(() => readerPage(page)).toBe(42);
  });

  test('a saved ayah comes up in the feed as its mushaf lines', async ({ page }) => {
    await open(page, '/');
    await page.mouse.move(380, 500);
    const saved = page.getByRole('heading', { name: 'من المحفوظات', exact: true });
    await expect(async () => {
      await page.mouse.wheel(0, 3000);
      await expect(saved).toBeAttached({ timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    await expect(page.getByText(`${S(2)} ٢٥٥`, { exact: true }).first()).toBeAttached();
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

  test('the recall card small recite bar shares one row with the card buttons', async ({ page }) => {
    // The narrowest phone we draw for: the whole row still fits.
    await page.setViewportSize({ width: 360, height: 800 });
    await open(page, '/');
    const bar = page.getByRole('toolbar', { name: 'أدوات التسميع' }).first();
    const remembered = page.getByRole('button', { name: 'تذكّرتها' }).first();
    await expect(bar).toBeVisible();
    const [barBox, buttonBox] = [await bar.boundingBox(), await remembered.boundingBox()];
    expect(barBox!.height).toBeLessThanOrEqual(40);
    // Same row: the button's middle lies within the bar's height, and the bar on the right of it.
    const middle = buttonBox!.y + buttonBox!.height / 2;
    expect(middle).toBeGreaterThan(barBox!.y);
    expect(middle).toBeLessThan(barBox!.y + barBox!.height);
    expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(barBox!.x);
    const last = await page.getByRole('button', { name: 'في المصحف' }).first().boundingBox();
    expect(last!.x).toBeGreaterThanOrEqual(0);
  });

  test('the recall card reveals a word at a time, and with the pen takes what the pen setting asks in write boxes and grades it', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'أظهر الكلمة التالية' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'اكتب كل آية كاملة' }).first().click();
    const boxes = page.getByRole('button', { name: 'اكتب هذه الكلمة' });
    await expect(boxes.first()).toBeVisible();
    const count = await boxes.count();
    expect(count).toBeGreaterThan(0);
    await boxes.first().click();
    for (let i = 0; i < count; i++) await page.keyboard.type('خطا ');
    await expect(page.getByLabel('كتبت: خطا').first()).toBeVisible();
    await expect.poll(async () => (await stored<Record<string, { forgot: number }>>(page, 'ayah-forgot'))?.['18:10']?.forgot).toBe(2);
  });

  test('a tap on the recall card does what a tap does in recite mode, and undo hides the ayah again', async ({ page }) => {
    await open(page, '/');
    const head = page.getByRole('heading', { name: 'هل تذكرها؟', exact: true });
    const whole = page.getByRole('button', { name: 'أظهر الآية التالية' }).first();
    const undo = page.getByRole('button', { name: 'ارجع خطوة' }).first();
    await expect(undo).toBeDisabled();
    await whole.scrollIntoViewIfNeeded();
    const lines = async () => {
      const top = (await head.boundingBox())!;
      const bottom = (await whole.boundingBox())!;
      return { x: 195, y: (top.y + top.height + bottom.y) / 2 };
    };
    // Recite mode's tap shows the whole ayah (its default), and undo hides it again.
    const at = await lines();
    await page.mouse.click(at.x, at.y);
    await expect(whole).toBeDisabled();
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(whole).toBeEnabled();
    await expect(undo).toBeDisabled();
    // Recite mode's double tap shows the next word (its default), so the ayah is not whole yet.
    await page.mouse.dblclick(at.x, at.y);
    await expect(undo).toBeEnabled();
    await expect(whole).toBeEnabled();
  });

  test('the forgotten review opens the mushaf in recite mode', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'راجع ما نسيت' }).click();
    await expect.poll(() => readerPage(page)).toBe(294);
    await expect(page.getByRole('button', { name: 'أظهر الآية التالية' })).toBeVisible();
  });

  test('the notes list in «مدونتي» lists the notes, and a note can be deleted', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    await page.getByRole('button', { name: /^اختر القائمة:/ }).click();
    await page.getByRole('button', { name: 'تأملاتي', exact: true }).click();
    await page.getByRole('button', { name: 'تأمل: تأمل في الحي القيوم' }).click();
    await menu(page).getByRole('button', { name: 'احذف التأمل' }).click();
    await expect(page.getByRole('button', { name: /^تأمل:/ })).toHaveCount(0);
    await expect.poll(() => stored(page, 'ayah-notes')).toEqual({});
  });
});
