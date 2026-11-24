import { expect, onScreen, open, readerPage, reciteBarsHidden, returningUser, stored, test } from './fixtures';
import type { Locator } from '@playwright/test';
import { surahName as S } from '../../shared/quran/surahNames';
import * as adhan from 'adhan';
import { DEFAULT_PRAYER_SETTINGS, prayerDay, type Adhan } from '../../shared/prayer';
import { ABOUT_INTRO, ATTRIBUTIONS_INTRO } from '../../shared/infoPages';

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
    // Every card has one layout (owner, 2026-11-20): its save sits in the row under it, and there is no «…» menu.
    await expect(page.getByRole('button', { name: 'احفظ البطاقة' }).first()).toBeAttached();
    await expect(page.getByRole('button', { name: /^خيارات: / })).toHaveCount(0);
  });

  test('the reading card opens the mushaf where it was left', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null })));
    await open(page, '/');
    await page.getByRole('button', { name: new RegExp(`^افتح المصحف حيث توقفت، سورة ${S(18)}`) }).click();
    await expect(page).toHaveURL(/\/read/);
    expect(await readerPage(page)).toBe(300);
  });

  // Owner, 2026-11-23: a tap on the reading card's page opens the mushaf there too, and «افتح» stays.
  test('a tap on the reading card\'s page opens the mushaf where it was left', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null })));
    await open(page, '/');
    await expect(page.getByRole('button', { name: new RegExp(`^افتح المصحف حيث توقفت، سورة ${S(18)}`) })).toBeVisible();
    await page.getByRole('button', { name: 'الصفحة ٣٠٠ من المصحف', exact: true }).click();
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

  test.describe('with the mutashabih picked', () => {
    test.use({ seed: { interests: '["mutashabih"]', 'interests-surprise': '0' } });

    test('the pair card is the compare card and opens the compare tab', async ({ page }) => {
      await open(page, '/');
      await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeAttached();
      await page.getByRole('button', { name: 'افتحها في المقارنة' }).first().click();
      await expect(page).toHaveURL(/\/compare/);
    });

    // Owner, 2026-11-19: no box inside a feed card, and the buttons sit in the row under the card, not in it.
    test('the tree quiz card holds no box and keeps its buttons under the card, before and after the answer', async ({ page }) => {
      await open(page, '/');
      const head = page.getByRole('heading', { name: 'أكمل المتشابهات', exact: true }).first();
      await expect(head).toBeAttached({ timeout: 20_000 });
      await head.scrollIntoViewIfNeeded();
      const post = head.locator('xpath=ancestor::div[.//*[@data-testid="feed-card"]][1]');
      const card = post.getByTestId('feed-card');
      // The row under the card: where the share button (on every card) sits.
      const row = post.locator('xpath=.//*[@aria-label="شارك البطاقة"]/..');
      const boxes = () => card.evaluate(root => [...root.querySelectorAll('*')].filter(el => {
        if (el.closest('[role="button"], button, input, textarea')) return false;
        const style = getComputedStyle(el);
        const sides = ['Top', 'Right', 'Bottom', 'Left'].every(side => parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0);
        return sides && parseFloat(style.borderTopLeftRadius) >= 10;
      }).length);
      expect(await boxes()).toBe(0);
      // The hint is the card's own button: it waits in the row with the quiz buttons.
      await expect(row.getByRole('button', { name: /^تلميح/ })).toHaveCount(1);
      await expect(card.getByRole('button', { name: /^تلميح/ })).toHaveCount(0);
      // «تحقق» with nothing typed shows the answer (owner, 2026-11-21).
      await row.getByRole('button', { name: 'تحقق', exact: true }).click();
      // Answered, the matrix draws no frame of its own, and its buttons join the same row.
      await expect(row.getByRole('button', { name: 'الآيات المحيطة' })).toHaveCount(1);
      await expect(card.getByRole('button', { name: 'الآيات المحيطة' })).toHaveCount(0);
      expect(await boxes()).toBe(0);
    });

    test.describe('the mutashabih cards', () => {
      test.use({ seed: { interests: '["mutashabih"]', 'interests-surprise': '0' } });

      test('the tree card is the branches tree with one tree, and opens it on the branches tab', async ({ page }) => {
        await open(page, '/');
        // A card the owner keeps as its matrix only (a book's entry whose ayat share no word) has no tree button, so the
        // card asked about is the first that can show its tree.
        const heads = page.getByRole('heading', { name: 'من متشابهات القرآن', exact: true });
        await expect(heads.first()).toBeAttached();
        const postOf = (head: Locator) => head.locator('xpath=ancestor::div[.//*[@aria-label="افتح الشجرة في متشابهات القرآن"]][1]');
        let head: Locator | undefined;
        for (let i = 0; i < await heads.count() && !head; i++) {
          if (await postOf(heads.nth(i)).getByRole('button', { name: 'عرض الشجرة' }).count()) head = heads.nth(i);
        }
        if (!head) throw new Error('no tree card in the feed can show its tree');
        const post = postOf(head);
        await head.scrollIntoViewIfNeeded();
        // The card's head names where the tree's ayat are, surah first; the row's open button (the card's one way there)
        // opens the branches tab on that same tree.
        const places = (await head.locator('xpath=following-sibling::*[1]').textContent())!.trim();
        const surah = places.match(/^[^٠-٩]+/)![0].trim();
        await post.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first().click();
        await expect(page).toHaveURL(/\/branches/);
        await expect(page.getByLabel(/^الشجرة \S+ من /)).toBeAttached();
        // It opens as its matrix there too; its own button shows the tree, whose boxes name the surahs. The pager keeps its
        // neighbours drawn beside the screen, so the button pressed is the one on screen.
        const buttons = page.getByRole('button', { name: 'عرض الشجرة' });
        await expect.poll(async () => (await onScreen(page, buttons)).length).toBeGreaterThan(0);
        await buttons.nth((await onScreen(page, buttons))[0]).click();
        await expect(page.getByRole('button', { name: `سورة ${surah}` }).first()).toBeAttached();
      });

      test('no tree draws tabs: every box names its ayah inside, at the normal size', async ({ page }) => {
        // docs/records/R0042: tabs came back on a path that skipped the rule, and iOS shrank their labels to a speck. Since 2026-11-16
        // (owner) no tree has tabs at all.
        await open(page, '/');
        const tree = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first();
        await expect(tree).toBeAttached();
        // A tree card opens as its matrix; its own button shows the tree, drawn once it comes near the screen.
        await tree.scrollIntoViewIfNeeded();
        const post = tree.locator('xpath=ancestor::div[.//*[@aria-label="عرض الشجرة"]][1]');
        await post.getByRole('button', { name: 'عرض الشجرة' }).first().click();
        await expect(post.getByRole('button', { name: 'عرض المصفوفة' }).first()).toBeVisible();
        await expect(page.getByTestId('node-tab')).toHaveCount(0);
      });
    });

    test('the feed has no tools or «more» button, and loads the next trees as the page nears its end', async ({ page }) => {
      await open(page, '/');
      const trees = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' });
      await expect(trees.first()).toBeAttached();
      for (const name of ['مواقيت الصلاة', 'المزيد للتأمل', 'افتح المحفوظات']) await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
      await page.mouse.move(195, 500);
      const first = await trees.count();
      await expect(async () => {
        await page.mouse.wheel(0, 3000);
        expect(await trees.count()).toBeGreaterThan(first);
      }).toPass({ timeout: 20_000 });
    });
  });

  test('the home buttons open their pages', async ({ page }) => {
    for (const [name, url] of [['مشاهد', /\/lataif/], ['المكتبة', /\/books/], ['مدونتي', /\/library/], ['القبلة', /\/utilities/]] as const) {
      await open(page, '/');
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page).toHaveURL(url);
    }
    await expect(page.getByRole('radio', { name: 'الأدوات' })).toBeChecked();
  });

  test('the reading card names the juz of its own page, and today\'s juz is a card that opens the mushaf', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('reader-place', JSON.stringify({ page: 300, position: null })));
    await open(page, '/');
    // The juz on the head's second line beside the surah, and on the reference line with the page (owner, 2026-11-22).
    await expect(page.getByText(/ · الجزء ١٥ · /).first()).toBeVisible();
    await expect(page.getByText(/^المصحف · .+، الجزء ١٥، الصفحة ٣٠٠$/).first()).toBeVisible();
    const juz = page.getByRole('button', { name: /^اقرأ الجزءا?ن? .*، جزء اليوم$/ });
    await juz.scrollIntoViewIfNeeded();
    await juz.click();
    await expect(page).toHaveURL(/\/read/);
    // The stored place starts at page 300, no juz's first page: wait for the juz's page.
    await expect.poll(() => readerPage(page)).not.toBe(300);
    const opened = await readerPage(page);
    // A tap on the card's page opens the same place as «اقرأ» (owner, 2026-11-23).
    await open(page, '/');
    const card = page.getByRole('button', { name: /^أول الجزءا?ن? .*، الصفحة .* من المصحف$/ });
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(page).toHaveURL(/\/read/);
    await expect.poll(() => readerPage(page)).toBe(opened);
  });

  // Scenes are one of balagha's cards; with every interest on, the feed holds so many kinds that one may come only after
  // many screens, so the user here picks balagha alone. The books card stays outside the interests' rounds.
  test.describe('with tafsir picked', () => {
    test.use({ seed: { interests: '["tafsir"]', 'interests-surprise': '0' } });

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
  });

  test.describe('with the ayah books picked', () => {
    test.use({ seed: { interests: '["tafsir","qiraat","irab","balagha"]', 'interests-surprise': '0' } });

    // Where the ayah is the subject, «افتح» opens the ayah's page at the card's section (owner, 2026-11-22).
    test('the feed has small ayah cards from the tafsir, balagha, i\'rab and readings, each opening the ayah\'s page at its section', async ({ page }) => {
      await open(page, '/');
      await page.mouse.move(380, 500);
      const cards = [
        ['من التفسير', 'التفسير كاملًا', 'التفسير'],
        ['من البلاغة', 'البلاغة كاملة', 'البلاغة'],
        ['من الإعراب', 'إعراب الآية', 'الإعراب'],
        ['من القراءات', 'القراءات كاملة', 'القراءات'],
      ] as const;
      for (const [title, button, section] of cards) {
        const head = page.getByRole('heading', { name: title, exact: true }).first();
        await expect(async () => {
          await page.mouse.move(380, 500);
          await page.mouse.wheel(0, 3000);
          await expect(head).toBeAttached({ timeout: 1000 });
        }).toPass({ timeout: 30_000 });
        // The row's open button is the card's one control for it (owner, 2026-11-20).
        await page.getByRole('button', { name: `افتح صفحة الآية، ${button}`, exact: true }).first().click();
        await expect(page.getByRole('heading', { name: section, exact: true }).filter({ visible: true })).toBeInViewport();
        await page.getByRole('button', { name: 'رجوع' }).filter({ visible: true }).click();
        await expect(head).toBeAttached();
      }
    });
  });

  test.describe('with the tafsir picked', () => {
    test.use({ seed: { interests: '["tafsir","hifz"]', 'interests-surprise': '0' } });

    test('a card\'s buttons sit on the right, open first, the «⋯» of «ليس من اهتماماتي» alone on the left, and its source line opens a sheet', async ({ page }) => {
      // Owner, 2026-11-20 (sketch reference-place/every-card-2-dark.png): like an Instagram post.
      await open(page, '/');
      const head = page.getByRole('heading', { name: 'من التفسير', exact: true }).first();
      await expect(async () => {
        await page.mouse.move(380, 500);
        await page.mouse.wheel(0, 2000);
        await expect(head).toBeAttached({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
      const card = head.locator('xpath=ancestor::div[.//*[starts-with(@aria-label, "المصدر: ")]][1]');
      await card.scrollIntoViewIfNeeded();
      // Cards above may still settle their height (a long one stops at two thirds of the screen), so every button is
      // measured at one moment.
      await expect(async () => {
        const buttons = await card.evaluate(node => [...node.querySelectorAll('[role="button"]')].map(button => {
          const { x, y, width } = button.getBoundingClientRect();
          return { name: button.getAttribute('aria-label'), x, y, width };
        }));
        const named = (name: string) => buttons.find(button => button.name === name)!;
        const opens = named('افتح صفحة الآية، التفسير كاملًا');
        const save = named('احفظ البطاقة');
        const more = named('خيارات البطاقة');
        // The row's buttons, right to left: the open button first, the «⋯» alone at the far left.
        const row = buttons.filter(button => Math.abs(button.y - save.y) < 4).sort((a, b) => b.x - a.x);
        expect(row[0].x).toBe(opens.x);
        expect(row.at(-1)!.x).toBe(more.x);
        expect(save.x).toBeGreaterThan(more.x);
        // Apart from the group: more room before it than a button's width.
        expect(row.at(-2)!.x - more.x).toBeGreaterThan(2 * more.width);
        expect(named('المصدر: تيسير الكريم الرحمن · السعدي').y).toBeGreaterThan(save.y);
      }).toPass({ timeout: 10_000 });
      // The «⋯» opens the menu that holds «ليس من اهتماماتي».
      await card.getByRole('button', { name: 'خيارات البطاقة' }).click();
      await expect(page.getByRole('button', { name: /ليس من اهتماماتي$/ })).toBeVisible();
      await page.mouse.click(195, 60);
      await expect(page.getByRole('button', { name: /ليس من اهتماماتي$/ })).toHaveCount(0);
      const line = card.getByRole('button', { name: 'المصدر: تيسير الكريم الرحمن · السعدي' });
      await line.click();
      await expect(page.getByRole('heading', { name: 'المصدر', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: /^ص [٠-٩]+/ }).last()).toBeVisible();
      // The Quran's own cards have a line too: the mushaf at the ayah.
      await expect(page.getByRole('button', { name: /^المصدر: المصحف · / }).first()).toBeAttached({ timeout: 20_000 });
    });
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
      await expect(page.getByRole('radio', { name: 'الأدوات' })).toBeChecked();
    });

    test('far from a prayer there is no prayer card', async ({ page }) => {
      const asr = prayerDay(adhan as unknown as Adhan, cairo, new Date(), DEFAULT_PRAYER_SETTINGS).asr;
      await page.clock.setFixedTime(new Date(asr.getTime() - 90 * 60_000));
      await open(page, '/');
      await expect(page.getByRole('heading', { name: 'جزء اليوم', exact: true })).toBeAttached();
      await expect(page.getByRole('heading', { name: /^العصر / })).toHaveCount(0);
    });
  });

  test('the feed asks a question of every quiz kind in turn', async ({ page }) => {
    test.setTimeout(180_000);
    // Each round asks about half the interests, each in its own kind in turn by the round and the day.
    const kinds = ['في أي سورة؟', 'أكمل المتشابهات', 'سمّع بقية الآية', 'قارن الموضعين', 'أوائل السور', 'ما معنى؟', 'لأي آية هذا التفسير؟', 'ما الأسلوب؟', 'ما المصطلح؟', 'ما إعرابها؟', 'كيف يقرؤها؟',
      'التحفة: أكمل البيت', 'التحفة: البيت التالي', 'التحفة: حكم الحرف', 'أين يلتقي النسبان؟', 'صاحب المنقبة', 'ما صلته به؟', 'في أي سنة كان؟', 'السيرة والغزوات', 'من راوي الحديث؟', 'أكمل الحديث'];
    const seen = new Set<string>();
    for (const days of [0, 1, 2, 3, 4, 5, 6]) {
      await page.clock.setFixedTime(new Date(Date.now() + days * 86_400_000));
      await open(page, '/');
      await page.mouse.move(195, 500);
      await expect(async () => {
        await page.mouse.wheel(0, 3000);
        // Enough questions drawn: each unanswered one has «تحقق» under it (owner, 2026-11-22).
        expect(await page.getByRole('button', { name: 'تحقق', exact: true }).count()).toBeGreaterThan(24);
      }).toPass({ timeout: 40_000 });
      for (const name of kinds) if (await page.getByRole('heading', { name, exact: true }).count()) seen.add(name);
      if (seen.size === kinds.length) break;
    }
    expect([...seen].sort()).toEqual([...kinds].sort());
  });

  test.describe('with the hifz picked', () => {
    test.use({ seed: { interests: '["hifz"]', 'interests-surprise': '0' } });

    test('a «which surah» card shows the ayah number and marks the surah picked', async ({ page }) => {
      // The hifz questions take turns, so «في أي سورة؟» is among the first three.
      await open(page, '/');
      await expect(page.getByRole('heading', { name: 'في أي سورة؟', exact: true }).first()).toBeAttached({ timeout: 20_000 });
      const card = page.getByRole('heading', { name: 'في أي سورة؟', exact: true }).first().locator('xpath=ancestor::div[.//*[@aria-label="تحقق" or @aria-label="افتح ما يشرح الجواب"]][1]');
      await card.scrollIntoViewIfNeeded();
      await expect(card.getByText(/[٠-٩]+$/).first()).toBeAttached();
      const openAnswer = card.getByRole('button', { name: 'افتح ما يشرح الجواب' });
      // Unanswered, no «افتح»: «تحقق» answers (owner, 2026-11-22).
      const choice = card.getByRole('button').filter({ hasText: /\S/, hasNot: page.getByRole('heading') }).first();
      await expect(openAnswer).toHaveCount(0);
      // A tap selects, and only «تحقق» answers (owner, 2026-11-21).
      await choice.click();
      await expect(choice).toBeEnabled();
      await expect(openAnswer).toHaveCount(0);
      await card.getByRole('button', { name: 'تحقق', exact: true }).click();
      await expect(choice).toBeDisabled();
      // Answered, «افتح» opens the ayah in the reader, never the quizzes page (owner, 2026-11-22).
      await expect(openAnswer).toHaveCount(1);
      await openAnswer.click();
      await expect(page).toHaveURL(/\/read/);
    });
  });

  test.describe('with the laqab picked', () => {
    test.use({ seed: { interests: '["laqab"]', 'interests-surprise': '0' } });

    // Every card shares (owner, 2026-11-22): the question as it stands, answered here, as one picture.
    test('an answered question card shares as a picture', async ({ page }) => {
      await open(page, '/');
      const head = page.getByRole('heading', { name: 'بمَ لُقّب؟', exact: true }).first();
      await expect(head).toBeAttached({ timeout: 20_000 });
      const card = head.locator('xpath=ancestor::div[.//*[@aria-label="تحقق"]][1]');
      await card.getByRole('button').filter({ hasText: /\S/, hasNot: page.getByRole('heading') }).first().click();
      await card.getByRole('button', { name: 'تحقق', exact: true }).click();
      const post = head.locator('xpath=ancestor::div[.//*[@aria-label="شارك البطاقة"]][1]');
      await post.getByRole('button', { name: 'شارك البطاقة' }).first().click();
      await expect(page.getByLabel('الصورة', { exact: true })).toBeVisible({ timeout: 20_000 });
      await expect(page.getByRole('button', { name: 'مشاركة كصورة' })).toBeEnabled();
    });
  });

  test.describe('with the prophets picked', () => {
    test.use({ seed: { interests: '["prophets"]', 'interests-surprise': '0' } });

    test('the prophets card is the story map opened at a group, and a dot opens the story page at its top', async ({ page }) => {
      await open(page, '/');
      await page.mouse.move(380, 500);
      const story = page.getByRole('heading', { name: /^قصة .* في القرآن$/ }).first();
      await expect(async () => {
        await page.mouse.wheel(0, 3000);
        await expect(story).toBeAttached({ timeout: 1000 });
      }).toPass({ timeout: 20_000 });
      const card = story.locator('xpath=ancestor::div[.//*[@aria-label="افتح القصة"] and .//*[contains(@aria-label, " آي")]][1]');
      // A dot is labelled by its event, its surah and its ayat.
      const dots = card.getByRole('button', { name: /، .*، .*آي/ });
      expect(await dots.count()).toBeGreaterThan(1);
      await dots.first().click();
      // A new reader lands on the story's top, not scrolled to an event (owner, 2026-11-14).
      await expect(page).toHaveURL(/\/prophets\/[^/?]+$/);
    });
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
  for (const [label, text] of [['عن نمق', ABOUT_INTRO.ar], ['المصادر والتراخيص', ATTRIBUTIONS_INTRO.ar], ['سياسة الخصوصية', 'ما يحفظه التطبيق']]) {
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

  // A saved ayah is a card with its buttons in the row under it, like every card (owner, 2026-11-20).
  test('a saved ayah opens on its mushaf page from the button under its card', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    await expect(page.getByLabel(/^آية: ٱللَّهُ لَآ إِلَٰهَ/)).toBeVisible();
    await page.getByRole('tab', { name: 'المحفوظات', exact: true }).click();
    await page.getByRole('button', { name: 'في المصحف' }).click();
    await expect.poll(() => readerPage(page)).toBe(42);
  });

  // «مدونتي» in the mushaf's order (owner, 2026-11-24): each surah's name over what was kept in it, a line of what and when
  // above each card, and a strip of the juz whose lit juz takes the list there.
  test('«مدونتي» lists what was kept in the mushaf\'s order under the surahs\' names, and the juz bars go to it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    const heads = page.getByRole('heading', { name: /^سورة / });
    await expect(heads).toHaveText([`سورة ${S(2)}`, `سورة ${S(18)}`]);
    await expect(page.getByText(/^تأملي · كتبته يوم /)).toBeVisible();
    await expect(page.getByText(/^منسيّة · نسيتها يوم /)).toBeAttached();
    // The juz as bars, the first on the right (owner, 2026-11-24: like a histogram): lifting the finger on the fifteenth,
    // where الكهف ١٠ is, takes the list there.
    const strip = await page.getByLabel(/^الأجزاء،/).boundingBox();
    await page.mouse.click(strip!.x + strip!.width * (1 - 14.5 / 30), strip!.y + strip!.height / 2);
    await expect(page.getByRole('heading', { name: `سورة ${S(18)}` })).toBeInViewport();
    await page.getByLabel('ابحث في مدونتي').fill('الكهف');
    await expect(heads).toHaveText([`سورة ${S(18)}`]);
  });

  // Where the ayah is the subject, «افتح» opens its page with everything on it (owner, 2026-11-22).
  test('a saved ayah opens its own page from «افتح», with its tafsir and the mushaf one tap away', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    await page.getByRole('button', { name: 'افتح صفحة الآية' }).first().click();
    await expect(page.getByRole('heading', { name: 'التفسير', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'في المصحف' }).filter({ visible: true }).click();
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

  test('a remembered ayah stays on screen lit, and rests until its review is due', async ({ page }) => {
    await open(page, '/');
    // The recall card, by its title: an openings card further down has the same buttons.
    const recall = page.getByRole('heading', { name: 'هل تذكرها؟', exact: true });
    await expect(recall).toHaveCount(1);
    await page.getByRole('button', { name: 'تذكّرتها' }).first().click();
    // A card never vanishes on a tap (owner, 2026-11-22): it stays until the next visit.
    await expect(recall).toHaveCount(1);
    await expect.poll(async () => (await stored<Record<string, { due?: number }>>(page, 'ayah-forgot'))?.['18:10']?.due).toBeGreaterThan(Date.now());
  });

  test('the recall card has recite mode\'s bar on a line of its own, its buttons on the line under it', async ({ page }) => {
    // Owner, 2026-11-23: the bar at its size in the mushaf, alone, so the rows look even on the narrowest phone we draw for.
    await page.setViewportSize({ width: 360, height: 800 });
    await open(page, '/');
    const bar = page.getByRole('toolbar', { name: 'أدوات التسميع' }).first();
    const remembered = page.getByRole('button', { name: 'تذكّرتها' }).first();
    await expect(bar).toBeVisible();
    const [barBox, buttonBox] = [await bar.boundingBox(), await remembered.boundingBox()];
    expect(buttonBox!.y).toBeGreaterThanOrEqual(barBox!.y + barBox!.height);
    const open_ = await page.getByRole('button', { name: 'افتح صفحة الآية' }).first().boundingBox();
    expect(Math.abs((open_!.y + open_!.height / 2) - (buttonBox!.y + buttonBox!.height / 2))).toBeLessThan(buttonBox!.height / 2);
    expect(open_!.x).toBeGreaterThanOrEqual(0);
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
    await reciteBarsHidden(page);
  });

  test('the notes list in «مدونتي» lists the notes, and a note can be deleted', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    await page.getByRole('tab', { name: 'تأملاتي', exact: true }).click();
    await expect(page.getByLabel('تأمل: تأمل في الحي القيوم')).toBeVisible();
    await page.getByRole('button', { name: 'احذف التأمل' }).click();
    await expect(page.getByLabel(/^تأمل:/)).toHaveCount(0);
    await expect.poll(() => stored(page, 'ayah-notes')).toEqual({});
  });
});

test.describe('the forgotten list', () => {
  test.use({ seed: { 'ayah-forgot': { '2:255:3': { forgot: 2, at: 10 }, '2:255:9': { forgot: 1, at: 11 }, '112:2': { forgot: 1, at: 20 } } } });

  // Owner, 2026-11-23: each forgotten ayah is asked as recite mode asks it, one card per ayah however many of its words were forgotten.
  test('asks each forgotten ayah once, and its tick rests every forgotten word of it until taken back', async ({ page }) => {
    await open(page, '/library?tab=forgotten');
    await expect(page.getByRole('button', { name: 'افتح الآية في المصحف' })).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'أظهر الكلمة التالية' })).toHaveCount(2);
    const tick = page.getByRole('button', { name: 'تذكّرتها', exact: true }).first();
    await tick.click();
    await expect.poll(async () => Object.entries((await stored<Record<string, { due?: number }>>(page, 'ayah-forgot')) ?? {}).filter(([, mark]) => mark.due).map(([key]) => key).sort()).toEqual(['2:255:3', '2:255:9']);
    // The card keeps its place, and a second tap puts both marks back as they were.
    await expect(page.getByRole('button', { name: 'تذكّرتها', exact: true })).toHaveCount(2);
    await tick.click();
    await expect.poll(async () => Object.values((await stored<Record<string, { due?: number }>>(page, 'ayah-forgot')) ?? {}).filter(mark => mark.due)).toEqual([]);
  });
});

test.describe('balagha terms in the feed', () => {
  test.use({ seed: { interests: '["balagha"]', 'interests-surprise': '0' } });

  test('a «ما الأسلوب؟» card, once answered, opens each choice\'s definition in a sheet with a way to its page', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('heading', { name: 'ما الأسلوب؟', exact: true }).first()).toBeAttached({ timeout: 20_000 });
    const card = page.getByRole('heading', { name: 'ما الأسلوب؟', exact: true }).first().locator('xpath=ancestor::div[.//*[@aria-label="تحقق"]][1]');
    await card.scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: /^تعريف / })).toHaveCount(0);
    await card.getByRole('button').filter({ hasText: /\S/, hasNot: page.getByRole('heading') }).first().click();
    await card.getByRole('button', { name: 'تحقق', exact: true }).click();
    const chips = page.getByRole('button', { name: /^تعريف / });
    await expect(chips.first()).toBeVisible();
    const name = (await chips.first().textContent())!.replace(/^تعريف /, '');
    await chips.first().click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'أمثلته في مصطلحات البلاغة' }).click();
    await expect(page.getByRole('heading', { name: /^أمثلته في الإتقان/ })).toBeVisible();
  });

  test('the feed\'s term card opens the term\'s page', async ({ page }) => {
    await open(page, '/');
    await page.mouse.move(195, 500);
    await expect(async () => {
      await page.mouse.wheel(0, 3000);
      expect(await page.getByText('من مصطلحات البلاغة', { exact: true }).count()).toBeGreaterThan(0);
    }).toPass({ timeout: 30_000 });
    await page.getByText('من مصطلحات البلاغة', { exact: true }).first().scrollIntoViewIfNeeded();
    const action = page.getByRole('button', { name: /: تعريفه وأمثلته$/ }).first();
    const name = (await action.getAttribute('aria-label'))!.replace(/: تعريفه وأمثلته$/, '');
    await action.click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  });
});
