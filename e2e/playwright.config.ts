import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';

// How to run, and what each file covers: e2e/README.md.
const APP = 'http://127.0.0.1:8082';
const WEB = 'http://127.0.0.1:3100';
/** `app` or `web` runs one half, and starts only its server. */
const only = process.env.E2E_ONLY;

type Server = Exclude<NonNullable<PlaywrightTestConfig['webServer']>, unknown[]>;

const halves: { name: string; projects: NonNullable<PlaywrightTestConfig['projects']>; server: Server }[] = [
  {
    name: 'app',
    projects: [{ name: 'app', testDir: './app', use: { baseURL: APP } }],
    server: {
      // A fresh web export each run, so the tests see the current code. The party URL points at a host the party test mocks.
      command: 'cd mobile && EXPO_PUBLIC_PARTY_URL=http://127.0.0.1:8787 npx expo export --platform web --output-dir dist-e2e && cd .. && node e2e/serve.mjs mobile/dist-e2e 8082',
      cwd: '..',
      url: APP,
      timeout: 240_000,
      reuseExistingServer: Boolean(process.env.E2E_REUSE),
    },
  },
  {
    name: 'web',
    projects: [
      { name: 'web-warmup', testDir: './web', testMatch: /warmup\.setup\.ts/, use: { baseURL: WEB } },
      { name: 'web', testDir: './web', dependencies: ['web-warmup'], use: { baseURL: WEB } },
    ],
    server: { command: 'npx next dev --turbopack -p 3100 -H 127.0.0.1', cwd: '..', url: WEB, timeout: 120_000, reuseExistingServer: Boolean(process.env.E2E_REUSE) },
  },
].filter(half => !only || half.name === only);
if (!halves.length) throw new Error(`E2E_ONLY is "${only}"; use app or web.`);

export default defineConfig({
  testDir: '.',
  outputDir: './test-results',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    trace: 'off',
    screenshot: 'only-on-failure',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: 'ar',
    timezoneId: 'Africa/Cairo',
  },
  projects: halves.flatMap(half => half.projects),
  webServer: halves.map(half => half.server),
});
