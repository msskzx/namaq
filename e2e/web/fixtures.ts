import fs from 'node:fs';
import path from 'node:path';
import { test as base, expect } from '@playwright/test';

/** Pages that read surahs or ayat need a database: `.env` on the Mac, or e2e/cloud-db.sh in a cloud container. */
export const hasDatabase = Boolean(process.env.DATABASE_URL) || fs.existsSync(path.resolve(__dirname, '../../.env'));

const IGNORED = /Download the React DevTools|favicon|\[HMR\]|\[Fast Refresh\]/;

export const test = base.extend<{ errors: string[] }>({
  errors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error' && !IGNORED.test(message.text())) errors.push(`console: ${message.text()}`);
    });
    await use(errors);
    expect(errors, 'errors on the page').toEqual([]);
  }, { auto: true }],
  page: async ({ page }, use) => {
    // The homepage tour and the cookie banner are marked as seen.
    await page.addInitScript(() => {
      if (sessionStorage.getItem('e2e-seeded')) return;
      sessionStorage.setItem('e2e-seeded', '1');
      localStorage.setItem('tour-seen', '1');
      localStorage.setItem('cookie-consent', 'declined');
    });
    await use(page);
  },
});

export { expect };

/** The error page (src/app/error.tsx) never shows. */
export const noErrorPage = (page: import('@playwright/test').Page) => expect(page.getByText('حدث خطأ ما')).toHaveCount(0);
