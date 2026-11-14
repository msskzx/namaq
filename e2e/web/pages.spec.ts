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
    // The first test to load home also builds the feed's API in the dev server, which can take longer than a check's usual wait.
    await expect(page.getByRole('link', { name: 'افتحها في المقارنة' }).first()).toBeVisible({ timeout: 30_000 });
    await page.getByRole('link', { name: 'افتح المصحف حيث توقفت' }).click();
    await expect(page).toHaveURL(/\/quran\/read/);
    await noErrorPage(page);
  });

  test('the home feed has no tools or «more» button, and loads more as the page nears its end', async ({ page }) => {
    await page.goto('/');
    const posts = page.getByRole('region', { name: 'للتأمل اليوم' }).locator('article');
    await expect(posts.first()).toBeVisible();
    for (const name of ['مواقيت الصلاة', 'بمفردك']) await expect(page.getByRole('link', { name })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'المزيد للتأمل' })).toHaveCount(0);
    const first = await posts.count();
    await expect(async () => {
      await page.mouse.wheel(0, 4000);
      expect(await posts.count()).toBeGreaterThan(first);
    }).toPass({ timeout: 30_000 });
  });

  test('the home tree card is the branches tree and opens it', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('article').filter({ hasText: 'من متشابهات القرآن' }).first();
    await expect(card.getByRole('region', { name: 'شجرة العبارات المشتركة' }).filter({ visible: true }).first()).toBeVisible();
    await card.getByRole('link', { name: 'افتح الشجرة في متشابهات القرآن' }).click();
    await expect(page).toHaveURL(/\/quran\/branches/);
    await noErrorPage(page);
  });

  test('the home recall card takes typed words in the write boxes and grades them', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ayah-forgot', JSON.stringify({ '18:10': { forgot: 1, at: Date.now() - 86_400_000 } })));
    await page.goto('/');
    const boxes = page.getByRole('button', { name: 'اكتب هذه الكلمة' });
    await expect(boxes.first()).toBeVisible();
    const count = await boxes.count();
    await expect(async () => {
      await boxes.first().click();
      await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toHaveAttribute('aria-pressed', 'true', { timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    for (let i = 0; i < count; i++) await page.keyboard.type('خطا ');
    await expect(page.getByRole('note', { name: 'كتبت: خطا' }).first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ayah-forgot') ?? '{}')['18:10']?.forgot)).toBe(2);
    await noErrorPage(page);
  });

  test('the home feed asks a question of every Quran quiz kind in turn, each card with the quiz buttons', async ({ page }) => {
    test.setTimeout(120_000);
    // Batches take the kinds in turn, one a batch; five batches on the days either side of today hold all seven, well inside
    // the server's two days.
    const kinds = ['في أي سورة؟', 'أكمل الشجرة', 'سمّع بقية الآية', 'أوائل السور', 'التحفة: أكمل البيت', 'التحفة: البيت التالي', 'التحفة: حكم الحرف'];
    const seen = new Set<string>();
    for (const days of [-1, 1]) {
      await page.clock.setFixedTime(new Date(Date.now() + days * 86_400_000));
      await page.goto('/');
      await expect(async () => {
        await page.evaluate(() => window.scrollBy(0, 3000));
        expect(await page.getByRole('link', { name: 'افتح الشجرة في متشابهات القرآن' }).count()).toBeGreaterThan(5);
      }).toPass({ timeout: 40_000 });
      // The first five question cards, each a kind of its own.
      const here = new Set<string>();
      await expect.poll(async () => {
        for (const name of kinds) if (await page.getByRole('heading', { name, exact: true }).count()) here.add(name);
        return here.size;
      }, { timeout: 30_000 }).toBeGreaterThanOrEqual(5);
      here.forEach(name => seen.add(name));
    }
    expect([...seen].sort()).toEqual([...kinds].sort());
    expect(await page.getByRole('link', { name: 'اختبار فردي' }).count()).toBeGreaterThan(2);
    await noErrorPage(page);
  });

  test('a home «which surah» card shows the ayah number and marks the surah picked', async ({ page }) => {
    test.setTimeout(120_000);
    const heading = page.getByRole('heading', { name: 'في أي سورة؟', exact: true });
    for (const days of [-1, 1]) {
      await page.clock.setFixedTime(new Date(Date.now() + days * 86_400_000));
      await page.goto('/');
      await expect(async () => {
        await page.evaluate(() => window.scrollBy(0, 3000));
        expect(await page.getByRole('link', { name: 'افتح الشجرة في متشابهات القرآن' }).count()).toBeGreaterThan(5);
      }).toPass({ timeout: 40_000 });
      if (await heading.count() || await heading.first().waitFor({ timeout: 10_000 }).then(() => true, () => false)) break;
    }
    const card = page.locator('article').filter({ has: heading }).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByText(/[٠-٩]+$/).first()).toBeAttached();
    await card.locator('button').filter({ hasText: /\S/ }).first().click();
    await expect(card.getByText(/^(صحيح|خطأ)$/).first()).toBeVisible();
    await noErrorPage(page);
  });

  test('the home prophets card is one group of a story map, and a dot opens the story there', async ({ page }) => {
    await page.goto('/');
    const story = page.getByRole('heading', { name: /^قصة .* في القرآن$/ }).first();
    await expect(async () => {
      await page.evaluate(() => window.scrollBy(0, 3000));
      await expect(story).toBeAttached({ timeout: 1000 });
    }).toPass({ timeout: 40_000 });
    const card = page.locator('article').filter({ has: story }).first();
    // One group only: its table fits the card, so nothing scrolls sideways.
    expect(await card.locator('table').evaluate(table => table.scrollWidth <= table.parentElement!.clientWidth + 1)).toBe(true);
    const dot = card.locator('[data-dot]').first();
    const label = (await dot.getAttribute('aria-label'))!;
    await dot.click();
    await expect(page).toHaveURL(/\/quran\/prophets\/[^/?]+\?event=\d+&surah=\d+/);
    await expect(page.locator('[data-dot][aria-current="true"]', { hasText: '' }).first()).toHaveAttribute('aria-label', label);
    await noErrorPage(page);
  });

  test('a saved ayah comes up in the home feed as its mushaf lines', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('bookmarks', JSON.stringify([{ id: 'ayah:2:255', text: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ', href: '/quran/read/ayah/2/255', savedAt: Date.now() }])));
    await page.goto('/');
    const saved = page.getByRole('heading', { name: 'البقرة ٢٥٥', exact: true });
    await expect(async () => {
      await page.evaluate(() => window.scrollBy(0, 3000));
      await expect(saved).toBeAttached({ timeout: 1000 });
    }).toPass({ timeout: 40_000 });
    const card = page.locator('article').filter({ has: saved }).first();
    await expect(card.getByText('من المحفوظات')).toBeVisible();
    await expect(card.locator('[data-line]').first()).toBeAttached();
    await noErrorPage(page);
  });

  test('the home pair card is the compare card and opens the compare page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeVisible();
    await page.getByRole('link', { name: 'افتحها في المقارنة' }).first().click();
    await expect(page).toHaveURL(/\/quran\/compare/);
    await noErrorPage(page);
  });

  test('branches shows the first tree', async ({ page }) => {
    await page.goto('/quran/branches');
    await expect(page.getByRole('progressbar', { name: 'التقدم بين الأشجار' })).toBeAttached();
    await expect(page.getByRole('region', { name: 'شجرة العبارات المشتركة' }).filter({ visible: true }).first()).toBeVisible();
    await noErrorPage(page);
  });

  test('the matrix has the read-along studio', async ({ page }) => {
    await page.goto('/quran/branches?m=cards');
    const studio = page.getByRole('button', { name: 'استوديو القراءة' });
    await expect(studio).toHaveCount(1);
    await expect(async () => {
      await studio.click();
      await expect(page.getByRole('button', { name: 'اقرأ مع التظليل' })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    await page.getByRole('button', { name: 'اقرأ مع التظليل' }).click();
    await expect(page.locator('[data-reading]').first()).toBeVisible();
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
    await page.getByRole('button', { name: 'تفسير السعدي' }).click();
    const sheet = page.getByRole('dialog', { name: 'تفسير السعدي' });
    await expect(sheet.getByRole('heading', { name: 'الفاتحة ١–٧' })).toBeVisible();
    await expect(sheet.getByText('هو المألوه المعبود', { exact: false })).toBeVisible();
    await expect(sheet.getByRole('link', { name: /تيسير الكريم الرحمن للسعدي، ص ٣٩/ })).toBeVisible();
    await noErrorPage(page);
  });

  test('the reader names the page\'s section and opens the surah\'s topics', async ({ page }) => {
    await page.goto('/quran/read/582');
    await page.getByRole('button', { name: 'موضوعات السورة: تساؤل المشركين عن النبأ' }).first().click();
    const sheet = page.getByRole('dialog', { name: 'موضوعات سورة النبأ' });
    await expect(sheet.getByText(/^مقصودها الدلالة على أن يوم القيامة/)).toBeVisible();
    await expect(sheet.getByRole('link', { name: /البقاعي، نظم الدرر/ })).toBeVisible();
    await sheet.getByRole('link', { name: /جزاء المتقين/ }).click();
    await expect(page).toHaveURL(/\/quran\/read\/ayah\/78\/31$/);
    await noErrorPage(page);
  });

  test('compare shows a surah pair', async ({ page }) => {
    await page.goto('/quran/compare');
    await expect(page.getByRole('button', { name: /^اختر سورتين:/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeVisible();
    await noErrorPage(page);
  });
});
