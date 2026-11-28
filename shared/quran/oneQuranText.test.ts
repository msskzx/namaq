import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..', '..');
const BASELINE = join(__dirname, 'oneQuranText.baseline.json');

const SOURCE = ['shared/data/quran/mushaf/'];
const MODULE = ['shared/quran/quranText/', 'src/components/quran/text/', 'mobile/src/components/quran/text/'];
const FONT_HOME = ['src/app/globals.css', 'mobile/src/lib/fonts.ts', 'mobile/src/app/_layout.tsx', 'shared/sources.ts',
  'mobile/src/lib/theme.ts'];
const PAGE = ['src/app/quran/read/Mushaf.module.css',
  'mobile/src/components/MushafPageView.tsx'];
const DRAWN = ['mobile/src/lib/treeVideo.ts', 'mobile/src/lib/compareVideo.ts', 'mobile/src/lib/shareVideo.ts', 'mobile/src/lib/shareVideo.web.ts',
  'src/app/quran/compare/CompareVideo.tsx'];
const BOOKS = ['tafsirSadi', 'kashshaf', 'irab', 'irabUkbari', 'itqanBalagha', 'bookPages'].map(name => `shared/data/quran/${name}.`);
const NOT_HAFS = ['shared/data/quran/qiraat.json', 'shared/data/quran/words.json', 'src/app/quran/words/lemmas.json', 'src/app/quran/words/places.json', 'src/app/quran/compare/similar.json'];

const inside = (path: string, places: string[]) => places.some(place => path.startsWith(place));

function walk(dir: string, keep: (name: string) => boolean): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path, keep);
    return keep(name) ? [path] : [];
  });
}

const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1');

const code = ['src', 'mobile/src', 'shared']
  .flatMap(dir => walk(dir, name => /\.(tsx?|jsx?|mjs|s?css)$/.test(name) && !/\.test\.tsx?$/.test(name)))
  .map(path => ({ path, text: withoutComments(readFileSync(join(ROOT, path), 'utf8')) }));

const WASLA = /ٱ/g;
const data = ['src', 'mobile/src', 'shared']
  .flatMap(dir => walk(dir, name => /\.(json|jsx?|mjs|tsx?)$/.test(name) && !/\.(fixture\.json|test\.tsx?)$/.test(name)))
  .filter(path => !inside(path, SOURCE) && !inside(path, BOOKS) && !NOT_HAFS.includes(path))
  .filter(path => (readFileSync(join(ROOT, path), 'utf8').match(WASLA)?.length ?? 0) >= 20);

const SIZE = String.raw`(fontSize|lineHeight|\b(text-(xs|sm|base|lg|\d*xl|\[\d)|leading-))`;
const QURAN_SIZED = new RegExp(String.raw`<(QuranWords|AyahWords)\b[^>]*${SIZE}`);
const WRAP_SIZED = new RegExp(String.raw`${SIZE}[^<>]*>\s*<QuranWords\b`);

const breaks = {
  font: code.filter(file => !inside(file.path, [...MODULE, ...FONT_HOME, ...PAGE]) && (/\bQURAN_FONT\b|--font-quran|\bfont-quran\b|KFGQPC[\s_]*Hafs|UthmanicHafs/i.test(file.text)
    || (!inside(file.path, DRAWN) && /\bQURAN_(FAMILY|FONT_FILE)\b|\bquranFontFace\b/.test(file.text)))).map(file => file.path).sort(),
  convert: code.filter(file => !inside(file.path, MODULE) && file.path !== 'shared/quran/mushafText.ts' && /\b(mushafText|MushafText)\b|lib\/quranText'/.test(file.text)).map(file => file.path).sort(),
  sized: code.filter(file => !inside(file.path, MODULE) && (QURAN_SIZED.test(file.text) || WRAP_SIZED.test(file.text))).map(file => file.path).sort(),
  copies: data.sort(),
  justified: code.filter(file => file.path.startsWith('mobile/src/') && /['"`]justify['"`]/.test(file.text)).map(file => file.path).sort(),
};

describe('one Quran text', () => {
  it.runIf(process.env.UPDATE_BASELINE)('rewrites the list of breaks', () => {
    writeFileSync(BASELINE, `${JSON.stringify(breaks, null, 2)}\n`);
  });
  const known = JSON.parse(readFileSync(BASELINE, 'utf8')) as typeof breaks;

  for (const rule of Object.keys(breaks) as (keyof typeof breaks)[]) {
    it(`${rule}: no new break of the rule`, () => {
      expect(breaks[rule].filter(path => !known[rule].includes(path))).toEqual([]);
    });
    it(`${rule}: a fixed break comes off the list`, () => {
      expect(known[rule].filter(path => !breaks[rule].includes(path))).toEqual([]);
    });
  }
});

const MENU_PRESS = 'mobile/src/ui/AyahMenuPress.tsx';
const MENU_VIEWS: Record<string, RegExp[]> = {
  'mobile/src/components/quran/text/AyahFlow.tsx': [/\bmenu: AyahMenuKeys;/, /<AyahMenuPress menu=\{menu\}>/],
  'mobile/src/components/quran/text/LitAyat.tsx': [/\bmenu: AyahMenuKeys;/, /<AyahFlow\b[^>]*\bmenu=\{menu\}/],
  'mobile/src/components/AyahLines.tsx': [/\bmenu: AyahMenuKeys;/, /<AyahMenuPress menu=\{menu\}>/, /<AyahMenuPress menu=\{keys\}>/],
  'mobile/src/ui/Sheet.tsx': [/<AyahMenuContext\.Provider value=\{null\}>/],
};
const MENU_OFF: Record<string, string> = {
  'mobile/src/components/QuizChoice.tsx': 'a question and its choices before the answer',
  'mobile/src/components/QuizCompare.tsx': 'a compare question',
  'mobile/src/components/QuizLook.tsx': 'a hint\'s ayat, which must not name their surah before the answer',
  'mobile/src/components/QuizTree.tsx': 'a tree',
  'mobile/src/components/MatrixCard.tsx': 'the matrix, a tree view',
  'mobile/src/components/HomeFeed.tsx': 'the recall card in recite mode, and its share picture',
  'mobile/src/components/AyahShare.tsx': 'a share picture',
  'mobile/src/components/AyahPreviewSheet.tsx': 'a sheet',
  'mobile/src/components/BalaghaSheet.tsx': 'a sheet',
  'mobile/src/components/GharibSheet.tsx': 'a sheet',
  'mobile/src/components/NoteSheet.tsx': 'a sheet',
  'mobile/src/components/ReaderSheets.tsx': 'a sheet',
  'mobile/src/components/WordSheet.tsx': 'a sheet',
  'mobile/src/components/QiraatPlace.tsx': 'the readings card\'s lines picture',
};

function menuValues(text: string): string[] {
  const values: string[] = [];
  for (const match of text.matchAll(/\bmenu=\{/g)) {
    let depth = 1;
    let at = match.index + match[0].length;
    const start = at;
    while (depth > 0 && at < text.length) { if (text[at] === '{') depth++; else if (text[at] === '}') depth--; at++; }
    values.push(text.slice(start, at - 1));
  }
  return values;
}

describe("the reader's menu on every ayah view (owner, 2026-11-22)", () => {
  it('every ayah view takes the ayah its long press opens the menu on, and opens it; a sheet turns it off', () => {
    const press = withoutComments(readFileSync(join(ROOT, MENU_PRESS), 'utf8'));
    expect(press).toMatch(/Gesture\.LongPress\(\)/);
    expect(press).toMatch(/<GestureDetector gesture=\{press\}>/);
    for (const [path, rules] of Object.entries(MENU_VIEWS)) {
      const text = withoutComments(readFileSync(join(ROOT, path), 'utf8'));
      for (const rule of rules) expect(text, path).toMatch(rule);
    }
  });

  it('turns the menu off only in the agreed exceptions, and only with false itself', () => {
    const passes = code.filter(file => file.path.startsWith('mobile/src/')).map(file => ({ path: file.path, values: menuValues(file.text) })).filter(file => file.values.length);
    expect(passes.length).toBeGreaterThan(0);
    expect(passes.flatMap(file => file.values.filter(value => /^[^?]*&&[^?]*$|(['"`])\1/.test(value)).map(value => `${file.path}: ${value}`))).toEqual([]);
    const off = passes.filter(file => file.values.some(value => /\bfalse\b/.test(value))).map(file => file.path);
    expect(off.filter(path => !(path in MENU_OFF))).toEqual([]);
    expect(Object.keys(MENU_OFF).filter(path => !off.includes(path)), 'an exception no longer used comes off the list').toEqual([]);
  });
});
