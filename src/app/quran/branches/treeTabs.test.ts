import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../../../..');
const sources = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : sources(path);
  return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
});

describe('tree tabs', () => {
  // docs/records/0042: on iOS, adjustsFontSizeToFit in a tab sized by its own text shrank the tree tabs to a speck, which the
  // web export (where the tests run) never shows. Labels keep their size; one too long is clipped.
  it('the app never shrinks text to fit', () => {
    const offenders = sources(join(ROOT, 'mobile/src')).filter(path => /adjustsFontSizeToFit/.test(readFileSync(path, 'utf8').replace(/\/\/.*|\{\/\*[\s\S]*?\*\/\}/g, '')));
    expect(offenders.map(path => relative(ROOT, path))).toEqual([]);
  });
});
