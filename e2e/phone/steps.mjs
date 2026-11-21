// The steps a person takes on the phone app's web build. `npm run phone` runs them one at a time for an agent, and a
// saved journey (e2e/journeys/*.json) runs the same steps again. How to use them: e2e/README.md, "Using the app".
import { chromium } from '@playwright/test';

/** What each step does; `arg` is the step's one argument. */
export const HELP = {
  open: 'open <route>        go to a route, e.g. / or /read or /quiz/solo',
  tap: 'tap <name>          tap the button, link or tab with this name, or else the text',
  press: 'press <name>        long-press it (the reader\'s menu, for one)',
  type: 'type <text>         type into the focused field (tap the field first)',
  swipe: 'swipe <up|down|left|right>  up and down scroll the screen; left and right drag a finger across it',
  back: 'back                the browser\'s back',
  wait: 'wait <name>         wait until it shows',
  look: 'look                a screenshot and the list of what can be tapped, nothing else',
};

/** A browser the size of an iPhone 17 Pro Max (440×956 points), dark, Arabic and Cairo time, as the owner uses the app. */
export async function launch(baseURL) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 440, height: 956 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    colorScheme: 'dark', locale: 'ar', timezoneId: 'Africa/Cairo', baseURL,
  });
  // A returning user: the tour and the interests question are done (keys from mobile/src/lib/deviceStorage.ts).
  await context.addInitScript(() => {
    if (sessionStorage.getItem('phone-seeded')) return;
    sessionStorage.setItem('phone-seeded', '1');
    localStorage.setItem('tour-seen', 'true');
    localStorage.setItem('interests-asked', '1');
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !/Download the React DevTools|favicon/.test(message.text())) errors.push(`console: ${message.text()}`);
  });
  return { browser, page, errors };
}

/** Outside the screens the app keeps behind the one on top (hidden from screen readers, as from the finger). */
const SHOWN = ':not([aria-hidden="true"], [aria-hidden="true"] *)';

/** What a person would call `name`, in this order: a button, link or tab by its label, or else text on the screen. */
async function find(page, name) {
  const kinds = [
    page.getByRole('button', { name, exact: true }),
    page.getByRole('link', { name, exact: true }),
    page.getByRole('tab', { name, exact: true }),
    page.getByText(name, { exact: true }).and(page.locator(SHOWN)),
  ].map(found => found.filter({ visible: true }).first());
  for (let tries = 0; tries < 25; tries++) {
    for (const found of kinds) if (await found.count()) return found;
    await page.waitForTimeout(200);
  }
  return null;
}

const settle = async page => {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
};

const stuck = message => { throw new Error(message); };

/** Runs one step. Throws a plain message when the step cannot be done, as a person would be stuck. */
export async function run(page, [command, arg]) {
  switch (command) {
    case 'open':
      await page.goto(arg);
      await page.locator('#root > *').first().waitFor();
      break;
    case 'tap': {
      const target = await find(page, arg);
      if (!target) stuck(`Nothing called "${arg}" to tap.`);
      await target.click({ timeout: 5000 });
      break;
    }
    case 'press': {
      const box = await (await find(page, arg))?.boundingBox({ timeout: 5000 });
      if (!box) throw new Error(`Nothing called "${arg}" to press.`);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(900);
      await page.mouse.up();
      break;
    }
    case 'type':
      await page.keyboard.type(arg);
      break;
    case 'swipe': {
      const { width, height } = page.viewportSize();
      const [dx, dy] = { up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0] }[arg] ?? [];
      if (dx === undefined) throw new Error('swipe takes up, down, left or right.');
      await page.mouse.move(width / 2, height / 2);
      // A finger pushed up scrolls the screen on; a drag does not scroll on the web, the wheel does.
      if (dy) { await page.mouse.wheel(0, dy * height * 0.6); break; }
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(width / 2 + dx * width * 0.06 * i, height / 2);
      await page.mouse.up();
      break;
    }
    case 'back':
      await page.goBack();
      break;
    case 'wait':
      if (!(await find(page, arg))) stuck(`"${arg}" did not show.`);
      break;
    case 'look':
      break;
    default:
      throw new Error(`No step "${command}". Steps:\n  ${Object.values(HELP).join('\n  ')}`);
  }
  await settle(page);
}

/** The names of the buttons, links, tabs and fields on screen now: what the next step can tap. */
export const controls = page => page.evaluate(() => {
  const seen = new Set();
  for (const element of document.querySelectorAll('button, a[href], [role="button"], [role="link"], [role="tab"], input, textarea')) {
    const box = element.getBoundingClientRect();
    if (element.closest('[aria-hidden="true"]')) continue;
    if (!box.width || !box.height || box.bottom < 0 || box.top > innerHeight) continue;
    const name = (element.getAttribute('aria-label') ?? element.getAttribute('placeholder') ?? element.innerText ?? '').trim().replace(/\s+/g, ' ');
    const kind = element.matches('input, textarea') ? 'field' : element.getAttribute('role') ?? (element.tagName === 'A' ? 'link' : 'button');
    if (name) seen.add(`${kind}: ${name.slice(0, 80)}`);
  }
  return [...seen];
});
