import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mapData } from './featureMapPages.mjs';
import { brokenRules } from './featureRules.mjs';

const BASELINE = path.join(__dirname, 'featureRules.baseline.json');
const rules: Record<string, string[]> = brokenRules(mapData());
const broken = Object.fromEntries(Object.entries(rules).map(([rule, list]) => [rule, [...new Set(list)].sort()]));
const known: Record<string, string[]> = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
if (process.env.UPDATE_BASELINE) {
  const shrunk = Object.fromEntries(Object.entries(broken).map(([rule, list]) => [rule, list.filter(item => (known[rule] ?? []).includes(item))]));
  fs.writeFileSync(BASELINE, `${JSON.stringify(shrunk, null, 1)}\n`);
}

describe('the rules of the feature map', () => {
  for (const [rule, list] of Object.entries(broken)) {
    it(rule, () => {
      const allowed = new Set(known[rule] ?? []);
      expect(list.filter(item => !allowed.has(item)), 'Broken here and not in e2e/featureRules.baseline.json: fix the link').toEqual([]);
      expect([...allowed].filter(item => !list.includes(item)), 'Fixed: remove from e2e/featureRules.baseline.json (UPDATE_BASELINE=1 npx vitest run featureRules)').toEqual([]);
    });
  }
});
