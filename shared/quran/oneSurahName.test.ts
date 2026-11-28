import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..', '..');
const HOME = 'shared/quran/surahNames.ts';

function walk(dir: string): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name === 'generated' || name.startsWith('.') ? [] : walk(path);
    return /\.(tsx?|jsx?|mjs)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, match => match.replace(/[^\n]/g, '')).replace(/(^|[^:'"])\/\/.*$/gm, '$1');

const files = ['shared', 'src', 'mobile/src', 'party/src'].flatMap(walk).filter(path => path !== HOME)
  .map(path => ({ path, lines: withoutComments(readFileSync(join(ROOT, path), 'utf8')).split('\n') }));

const surahRowsName = (lines: string[]) => lines.map(line => line.match(/^import (\w+) from '[^']*surahs\.json'/)?.[1]).find(Boolean);

const MUSHAF_HEADERS = [
  'src/app/quran/read/[page]/page.tsx',
  'src/lib/homepageData.ts',
  'src/components/homepage/AyahLines.tsx',
  'src/components/stories/StoryAyatLines.tsx',
  'src/app/quizzes/QuizPage.tsx',
  'mobile/src/components/AyahLines.tsx',
  'mobile/src/components/QuizPage.tsx',
  'mobile/src/components/Reader.tsx',
  'mobile/src/components/Tour.tsx',
];

const MATCHING: { path: string; line: RegExp }[] = [
  { path: 'shared/quran/surahSearch.ts', line: /keysOf\(surah\.name\)/ },
  { path: 'mobile/src/lib/compare.ts', line: /const surahMatches = .*plainName\(surahName\(n\)\)/ },
  { path: 'src/app/quran/compare/PairCompare.tsx', line: /matchesSurah\(\{ number: n, name: names\[n\]\?\.ar/ },
];
const matching = (path: string, line: string) => MATCHING.some(entry => entry.path === path && entry.line.test(line));

type Hit = `${string}:${number}: ${string}`;
const hits = (test: (line: string, rows: string | undefined, path: string) => boolean, skip: (path: string) => boolean = () => false): Hit[] =>
  files.filter(file => !skip(file.path)).flatMap(({ path, lines }) => {
    const rows = surahRowsName(lines);
    return lines.flatMap((line, i) => test(line, rows, path) && !matching(path, line) ? [`${path}:${i + 1}: ${line.trim().slice(0, 120)}` as Hit] : []);
  });

describe('one surah-name list', () => {
  it('reads no plain name off the rows of surahs.json', () => {
    expect(hits((line, rows) => !!rows && (
      new RegExp(`\\b${rows}\\.(map|find|filter|findLast|flatMap)\\(.*=>.*\\b(\\w+)\\.name\\b`).test(line) ||
      new RegExp(`\\b${rows}\\.(find|findLast)\\(.*\\)\\??\\.name\\b`).test(line)
    ))).toEqual([]);
  });

  it('pairs no number with a plain name, and copies no plain name onto another row', () => {
    expect(hits(line => /\[\s*(\w+)\.number\s*,\s*\1\.name\s*\]/.test(line) || /\bname:\s*(row|surah|entry)\.name\b/.test(line))).toEqual([]);
  });

  it('shows no surah name from a database row', () => {
    expect(hits(line => /\b(surah|ayah\.surah|row\.surah)\??\.name\b/.test(line))).toEqual([]);
  });

  it('strips no tashkeel or «سورة» off a surah name or title', () => {
    expect(hits(line => /plainName\(\s*(surahName\(|SURAH_NAMES\[|SURAH_TITLES\[|names?\[|\w+\.ar\b|\w*[Tt]itle|row\.)/.test(line) || /\.replace\(\/\^سورة/.test(line))).toEqual([]);
  });

  it('shows the mushaf title only in the surah headers of a mushaf page', () => {
    expect(hits(
      (line, rows) => /\bSURAH_TITLES\b/.test(line) || (!!rows && new RegExp(`\\b${rows}\\b.*\\.title\\b`).test(line)),
      path => MUSHAF_HEADERS.includes(path),
    )).toEqual([]);
  });
});
