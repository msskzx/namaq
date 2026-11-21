import fs from 'node:fs';
import path from 'node:path';
import { test } from './fixtures';
import { run } from '../phone/steps.mjs';

// Every walk an agent saved with `npm run phone -- save <name>` is walked again here: a step that can no longer be done,
// or an error on the page, fails it (e2e/README.md, "Using the app").
const dir = path.join(__dirname, '../journeys');
for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.json'))) {
  const { steps } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as { steps: [string, string][] };
  test(`journey ${file.replace(/\.json$/, '')}`, async ({ page }) => {
    for (const step of steps) await test.step(step.join(' '), () => run(page, step));
  });
}
