import { test } from '@playwright/test';
import { hasDatabase } from './fixtures';

// The dev server compiles a page on its first visit; a test that loads a page mid-compile can see a passing hydration
// error. Every page is fetched once here before the tests run.
const PAGES = ['/quran', '/quizzes', '/utilities', '/quran/prophets', '/quran/words'];
const DATABASE_PAGES = ['/', '/quran/branches', '/quran/read/1', '/quran/compare'];

test('compile the pages', async ({ request }) => {
  test.setTimeout(240_000);
  for (const path of [...PAGES, ...(hasDatabase ? DATABASE_PAGES : [])]) await request.get(path, { timeout: 120_000 });
});
