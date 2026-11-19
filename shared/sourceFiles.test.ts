// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 24): every data file and bundled font is named by a
// source in shared/sources.ts, and no source's licence forbids commercial use. Files older than the list wait on
// sourceFiles.baseline.json, which only shrinks: a new file names its source, and a file named in sources leaves the list.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SOURCES } from './sources';

const ROOT = join(__dirname, '..');
const BASELINE = join(__dirname, 'sourceFiles.baseline.json');
const FONT = /\.(ttf|otf|woff2?)$/;

function walk(dir: string): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    return statSync(join(ROOT, path)).isDirectory() ? walk(path) : [path];
  });
}

const files = () => [
  ...walk('shared/data').filter(path => !/\.test\.ts$/.test(path)),
  ...['mobile/assets', 'public'].flatMap(walk).filter(path => FONT.test(path)),
].sort();
const named = (path: string) => SOURCES.some(source => source.files?.some(file => (file.endsWith('/') ? path.startsWith(file) : path === file)));

/** A licence that forbids commercial use (CC BY-NC and the like). */
export const nonCommercial = (licence: string) => /\bNC\b|-NC\b|non-?commercial/i.test(licence);

describe('every data file and font names its source', () => {
  it('each file is named by a source, or waits on the list from before the guard', () => {
    const all = files();
    expect(all.some(path => path.startsWith('shared/data/'))).toBe(true);
    expect(all.some(path => FONT.test(path))).toBe(true);
    const unnamed = all.filter(path => !named(path));
    const known: string[] = JSON.parse(readFileSync(BASELINE, 'utf8'));
    // Rewriting the list only drops files that now name a source or are gone.
    if (process.env.UPDATE_BASELINE) writeFileSync(BASELINE, `${JSON.stringify(known.filter(path => unnamed.includes(path)), null, 2)}\n`);
    expect(unnamed.filter(path => !known.includes(path)), 'name the source in shared/sources.ts').toEqual([]);
    expect(known.filter(path => !unnamed.includes(path)), 'named or gone: run with UPDATE_BASELINE=1').toEqual([]);
  });

  it('every file a source names exists', () => {
    for (const source of SOURCES) for (const file of source.files ?? []) expect(existsSync(join(ROOT, file)), `${source.id}: ${file}`).toBe(true);
  });

  it('no source forbids commercial use', () => {
    expect(SOURCES.filter(source => nonCommercial(source.licence.en)).map(source => source.id)).toEqual([]);
    expect(nonCommercial('CC BY-NC 4.0')).toBe(true);
    expect(nonCommercial('Non-commercial use only')).toBe(true);
    expect(nonCommercial('Icons CC BY 4.0, code MIT.')).toBe(false);
  });
});
