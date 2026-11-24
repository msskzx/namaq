import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import files from '@shared/appDataFiles.json';

// Metro turns every file in the list into an asset (metro.config.js); one the loader does not read stays unread, and the
// first screen that reads it fails on the phone only.
describe('the data files that ship beside the code', () => {
  it('are all read by the loader before the app starts', () => {
    const loader = readFileSync('mobile/src/lib/appData.ts', 'utf8');
    expect([...loader.matchAll(/require\('@shared\/data\/(.+)\.json'\)/g)].map(match => match[1])).toEqual(files);
  });

  // On the phone the import is an asset reference, not the data: a module that reads it without dataOf breaks there alone.
  it('are read through dataOf by every module the phone runs', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
        entry.isDirectory() ? (entry.name === 'node_modules' || entry.name === 'data' ? [] : walk(join(dir, entry.name))) : [join(dir, entry.name)]);
    const code = [...walk('shared'), ...walk('mobile/src')].filter(path => /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path));
    const listed = new RegExp(`^import (\\w+) from '[^']*data/(${files.join('|')})\\.json';$`, 'gm');
    const unread = code.flatMap(path => {
      const text = readFileSync(path, 'utf8');
      return [...text.matchAll(listed)].filter(([, name]) => text.split(name).length - 1 !== 2 || !text.includes(`dataOf(${name})`)).map(([line]) => `${path}: ${line}`);
    });
    expect(unread).toEqual([]);
  });
});
