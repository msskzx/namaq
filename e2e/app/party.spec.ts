import type { Page } from '@playwright/test';
import { num } from '../../shared/quran/arabicNumber';
import { branchNodes, givenAnswer } from '../../shared/quiz/branchAnswers';
import { expect, firstBoxes, open, test, writeBlank } from './fixtures';
import { PartyServer } from './partyServer';

/** Each asked leaf's first box (recite mode's boxes, owner 2026-11-19). */
const leaves = (page: Page) => firstBoxes(page, 'الطرف \\S+');

test('a party quiz: host and guest join, answer each question and see the final ranking', async ({ page, browser, errors }) => {
  test.setTimeout(90_000);
  const server = new PartyServer();
  await server.attach(page.context());
  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'ar' });
  await guestContext.addInitScript(() => localStorage.setItem('tour-seen', 'true'));
  await server.attach(guestContext);
  const guest = await guestContext.newPage();
  guest.on('pageerror', error => errors.push(`guest pageerror: ${error.message}`));
  guest.on('console', message => { if (message.type() === 'error') errors.push(`guest console: ${message.text()}`); });

  await open(page, '/quiz/party');
  await page.getByLabel('اسمك').fill('المضيف');
  await page.getByRole('button', { name: 'ابدأ', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/quiz/party/${server.code}`));

  await open(guest, '/quiz/party');
  await guest.getByLabel('رقم الاختبار').fill(server.code);
  await guest.getByRole('button', { name: 'انضم', exact: true }).click();
  // The room asks for a name in a box that takes the focus; the start page's own name box stays behind it.
  await expect(guest).toHaveURL(new RegExp(`/quiz/party/${server.code}`));
  await expect(guest.getByLabel('اسمك').last()).toBeFocused();
  await guest.keyboard.type('الضيف');
  await guest.keyboard.press('Enter');
  await guest.getByRole('button', { name: 'أنا مستعد' }).click();
  await expect(page.getByText('الضيف')).toBeVisible();

  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  const total = server.state!.settings.length;
  for (let index = 0; index < total; index++) {
    await expect(leaves(page).first()).toBeVisible();
    await expect.poll(() => server.state?.current).toBe(index);
    const question = server.question!;
    const nodes = branchNodes(question.tree!);
    const right = [...question.asked!].sort((a, b) => a - b).map(node => givenAnswer(nodes[node]));
    for (const [i, answer] of right.entries()) await writeBlank(page, `الطرف ${num(i + 1)}`, answer);
    await page.getByRole('button', { name: 'أرسل', exact: true }).click();
    await writeBlank(guest, 'الطرف ١', 'كلام خطأ');
    await guest.getByRole('button', { name: 'أرسل', exact: true }).click();
    await expect(page.getByText(`${num(right.length)} من ${num(right.length)} أطراف`)).toBeVisible();
    await expect(guest.getByText(new RegExp(`^٠ من ${num(right.length)} أطراف$`))).toBeVisible();
    await page.getByRole('button', { name: index === total - 1 ? 'الترتيب النهائي' : 'السؤال التالي' }).click();
  }
  await expect(page.getByRole('button', { name: 'اختبار آخر بالفريق نفسه' })).toBeVisible();
  const [first] = [...server.state!.players].sort((a, b) => b.score - a.score);
  expect(first.name).toBe('المضيف');
  await guestContext.close();
});

test('a party of recited ayat: each player writes the ayah with the pen, and the party grades the words', async ({ page, browser, errors }) => {
  test.setTimeout(90_000);
  const server = new PartyServer('recite');
  await server.attach(page.context());
  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'ar' });
  await guestContext.addInitScript(() => localStorage.setItem('tour-seen', 'true'));
  await server.attach(guestContext);
  const guest = await guestContext.newPage();
  guest.on('pageerror', error => errors.push(`guest pageerror: ${error.message}`));

  await open(page, '/quiz/party');
  await page.getByLabel('اسمك').fill('المضيف');
  await page.getByRole('button', { name: 'ابدأ', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/quiz/party/${server.code}`));
  await open(guest, `/quiz/party/${server.code}`);
  await expect(guest.getByLabel('اسمك').last()).toBeFocused();
  await guest.keyboard.type('الضيف');
  await guest.keyboard.press('Enter');
  await guest.getByRole('button', { name: 'أنا مستعد' }).click();
  await expect(page.getByText('الضيف')).toBeVisible();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();

  await expect.poll(() => server.question?.write).toBeTruthy();
  for (let index = 0; index < server.state!.questions.length; index++) {
    await expect.poll(() => server.state?.current).toBe(index);
    const { words, asked } = server.question!.write as { words: string[]; asked: number[] };
    const bar = page.getByLabel('أدوات التسميع');
    // The pen is on for all, and the next ayah waits for everyone.
    await expect(bar.getByRole('button', { name: 'أوقف الكتابة' })).toBeDisabled();
    await expect(bar.getByRole('button', { name: 'أظهر الآية التالية' })).toHaveCount(0);
    for (const at of asked) await page.getByLabel('اكتب الكلمة').fill(`${words[at]} `);
    for (const _ of asked) await guest.getByLabel('اكتب الكلمة').fill('كلام ');
    await expect(page.getByText(`${num(asked.length)} من ${num(asked.length)} كلمات`)).toBeVisible();
    await expect(guest.getByText(`٠ من ${num(asked.length)} كلمات`)).toBeVisible();
    await page.getByRole('button', { name: index === server.state!.questions.length - 1 ? 'الترتيب النهائي' : 'السؤال التالي' }).click();
  }
  await expect(page.getByRole('button', { name: 'اختبار آخر بالفريق نفسه' })).toBeVisible();
  await guestContext.close();
});

test('a party question looked up: the look opens the graph, a right answer after it earns half, and who looked shows at the reveal', async ({ page, browser, errors }) => {
  test.setTimeout(90_000);
  const server = new PartyServer('ties');
  await server.attach(page.context());
  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'ar' });
  await guestContext.addInitScript(() => localStorage.setItem('tour-seen', 'true'));
  await server.attach(guestContext);
  const guest = await guestContext.newPage();
  guest.on('pageerror', error => errors.push(`guest pageerror: ${error.message}`));

  await open(page, '/quiz/party');
  await page.getByLabel('اسمك').fill('المضيف');
  await page.getByRole('button', { name: 'ابدأ', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/quiz/party/${server.code}`));
  await open(guest, `/quiz/party/${server.code}`);
  await expect(guest.getByLabel('اسمك').last()).toBeFocused();
  await guest.keyboard.type('الضيف');
  await guest.keyboard.press('Enter');
  await guest.getByRole('button', { name: 'أنا مستعد' }).click();
  await expect(page.getByText('الضيف')).toBeVisible();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();

  // The host looks it up: al-Zubayr's ties round him, his mother among them, and the look is counted at once.
  await page.getByRole('button', { name: 'ابحث عن الجواب' }).click();
  await expect(page.getByRole('heading', { name: 'الزبير بن العوام' })).toBeVisible();
  await expect.poll(() => server.state?.looked).toEqual({ [server.state!.hostId]: true });
  await page.getByRole('button', { name: 'رجوع إلى السؤال' }).click();
  await expect(page.getByText(/^بحثتَ عنه/)).toBeVisible();
  await page.getByRole('button', { name: 'أمه', exact: true }).click();
  await guest.getByRole('button', { name: 'أمه', exact: true }).click();

  // Both right: the guest who knew gets ten, the host who looked five, and the host's magnifier shows now.
  await expect(page.getByText('+٥')).toBeVisible();
  await expect(page.getByText('+١٠')).toBeVisible();
  await expect(guest.getByLabel('بحث عن الجواب')).toHaveCount(1);
  // Under the answer, the same graph for everyone to learn from.
  await expect(guest.getByRole('heading', { name: 'الزبير بن العوام' })).toBeVisible();
  expect(server.state!.players.map(player => player.score)).toEqual([5, 10]);
  await guestContext.close();
});
