import type { Page } from '@playwright/test';
import { num } from '../../shared/quran/arabicNumber';
import { branchNodes, givenAnswer } from '../../shared/quiz/branchAnswers';
import { expect, open, test } from './fixtures';
import { PartyServer } from './partyServer';

const leaves = (page: Page) => page.getByLabel(/^الطرف /);

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
    const right = question.asked!.map(node => givenAnswer(nodes[node]));
    for (const [i, answer] of right.entries()) await leaves(page).nth(i).fill(answer);
    await page.getByRole('button', { name: 'أرسل', exact: true }).click();
    await leaves(guest).first().fill('كلام خطأ');
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
