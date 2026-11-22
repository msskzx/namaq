import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * One Quran text (owner, 2026-11-17): every Quran text in the app and on the website is drawn through one pipeline, in
 * this order: the whole Madina page, a slice of the page, the ayah as the page sets it, or the ayah copied off the page
 * (its own line, same text, tashkeel, ayah number and every waqf, sajda and hizb sign). Only the Quran module sets the
 * Quran font or turns data into Quran text, and the only Quran text in the repo is the page text. Quran quoted inside a
 * book is the one exception.
 *
 * Step 1 lists what breaks the rule today in oneQuranText.baseline.json. The checks fail on any NEW break, and on a listed
 * break that is gone (take it off the list), so the list only shrinks. `UPDATE_BASELINE=1 npx vitest run oneQuranText`
 * rewrites it; only do that when a break is fixed, never to let a new one in.
 */
const ROOT = join(__dirname, '..', '..');
const BASELINE = join(__dirname, 'oneQuranText.baseline.json');

/** The one Quran text: the Madina (KFGQPC Hafs) pages. Nothing else stores it, not even regrouped (owner, 2026-11-17). */
const SOURCE = ['shared/data/quran/mushaf/'];
/** Where the Quran module lives, once built: the only code that may set the Quran font or shape Quran text. */
const MODULE = ['shared/quran/quranText/', 'src/components/quran/text/', 'mobile/src/components/quran/text/'];
/** Where the font is declared, loaded or credited (not used): its @font-face, its name, the app's font loading, the sources list. */
const FONT_HOME = ['src/app/globals.css', 'mobile/src/lib/fonts.ts', 'mobile/src/app/_layout.tsx', 'shared/sources.ts',
  // The app's theme hands the font's name on from fonts.ts.
  'mobile/src/lib/theme.ts'];
/** The mushaf page itself (level 1, the pipeline's first level): the reader's page styles set the page's own font and size. */
const PAGE = ['src/app/quran/read/Mushaf.module.css',
  // The app's mushaf page draws its own lines, titles and basmala at the page's size (its zoom too); its write boxes live in the module (WriteBoxes).
  'mobile/src/components/MushafPageView.tsx'];
/**
 * Videos drawn on a canvas, which name the font themselves, not through a Text: they take its name and file from the module
 * (quranFont.ts), and only these may.
 */
const DRAWN = ['mobile/src/lib/treeVideo.ts', 'mobile/src/lib/compareVideo.ts', 'mobile/src/lib/shareVideo.ts', 'mobile/src/lib/shareVideo.web.ts',
  'src/app/quran/compare/CompareVideo.tsx'];
/** Books quote the Quran in their own words and spelling (the exception): tafsir, i'rab, balagha, printed pages. */
const BOOKS = ['tafsirSadi', 'kashshaf', 'irab', 'irabUkbari', 'itqanBalagha', 'bookPages'].map(name => `shared/data/quran/${name}.`);
/**
 * Not the Hafs text, so the pages cannot hold it (owner, 2026-11-17): the other readers' readings (qiraat) and the Quranic Arabic
 * Corpus's dictionary forms of a word (lemmas, on the words page and in similar ayat). The build stores the readings and
 * lemmas in the Madina page's spelling (scripts/quran/madinaSpelling.ts, owner 2026-11-17), so no screen converts a word.
 */
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

/** Comments name the rule without breaking it. */
const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1');

const code = ['src', 'mobile/src', 'shared']
  .flatMap(dir => walk(dir, name => /\.(tsx?|jsx?|mjs|s?css)$/.test(name) && !/\.test\.tsx?$/.test(name)))
  .map(path => ({ path, text: withoutComments(readFileSync(join(ROOT, path), 'utf8')) }));

/** A data file is a Quran text when it holds many words with alif wasla (ٱ), a letter only the Quran's script writes. */
const WASLA = /ٱ/g;
const data = ['src', 'mobile/src', 'shared']
  .flatMap(dir => walk(dir, name => /\.(json|jsx?|mjs|tsx?)$/.test(name) && !/\.(fixture\.json|test\.tsx?)$/.test(name)))
  .filter(path => !inside(path, SOURCE) && !inside(path, BOOKS) && !NOT_HAFS.includes(path))
  .filter(path => (readFileSync(join(ROOT, path), 'utf8').match(WASLA)?.length ?? 0) >= 20);

/** A size: the app's fontSize or lineHeight, the website's text-size or leading class. Colour classes (text-[var(…)]) are not one. */
const SIZE = String.raw`(fontSize|lineHeight|\b(text-(xs|sm|base|lg|\d*xl|\[\d)|leading-))`;
/** The size on the Quran words themselves (QuranWords, or a website AyahWords, whose class may set anything). */
const QURAN_SIZED = new RegExp(String.raw`<(QuranWords|AyahWords)\b[^>]*${SIZE}`);
/** The size on the tag right around them (`<Text style={{ fontSize: 21 }}><QuranWords>`); a book's sized text with runs in between is the exception. */
const WRAP_SIZED = new RegExp(String.raw`${SIZE}[^<>]*>\s*<QuranWords\b`);

const breaks = {
  /** Sets the Quran font itself (app QURAN_FONT, website font-quran / --font-quran or the face's name) instead of going through the module. */
  font: code.filter(file => !inside(file.path, [...MODULE, ...FONT_HOME, ...PAGE]) && (/\bQURAN_FONT\b|--font-quran|\bfont-quran\b|KFGQPC[\s_]*Hafs|UthmanicHafs/i.test(file.text)
    || (!inside(file.path, DRAWN) && /\bQURAN_(FAMILY|FONT_FILE)\b|\bquranFontFace\b/.test(file.text)))).map(file => file.path).sort(),
  /** Turns the old text into page-looking text word by word (mushafText and its aliases), dropping every waqf, sajda and hizb sign. */
  convert: code.filter(file => !inside(file.path, MODULE) && file.path !== 'shared/quran/mushafText.ts' && /\b(mushafText|MushafText)\b|lib\/quranText'/.test(file.text)).map(file => file.path).sort(),
  /**
   * Gives Quran words a size of its own (owner, 2026-11-19: every ayah view keeps the mushaf's line size and height). Ayah
   * text off the page goes in the module's AyahFlow, which sizes it from its width as the reader does and takes no size.
   */
  sized: code.filter(file => !inside(file.path, MODULE) && (QURAN_SIZED.test(file.text) || WRAP_SIZED.test(file.text))).map(file => file.path).sort(),
  /** Holds a copy of Quran text other than the Madina pages. */
  copies: data.sort(),
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

/**
 * The reader's long-press menu on every ayah view (owner, 2026-11-22; /mnt/project-files/ayah-page/agreed.md part 4): the
 * app's ayah views (the module's AyahFlow and LitAyat, and AyahLines and AyatRange, the mushaf's lines) each open the menu
 * through AyahMenuPress, on the ayah or ayat they name. A place may turn it off only for an agreed exception, named here
 * with its reason; a sheet turns it off for all it holds (its modal would cover the menu).
 */
const MENU_PRESS = 'mobile/src/ui/AyahMenuPress.tsx';
const MENU_VIEWS: Record<string, RegExp[]> = {
  'mobile/src/components/quran/text/AyahFlow.tsx': [/\bmenu: AyahMenuKeys;/, /<AyahMenuPress menu=\{menu\}>/],
  'mobile/src/components/quran/text/LitAyat.tsx': [/\bmenu: AyahMenuKeys;/, /<AyahFlow\b[^>]*\bmenu=\{menu\}/],
  'mobile/src/components/AyahLines.tsx': [/\bmenu: AyahMenuKeys;/, /<AyahMenuPress menu=\{menu\}>/, /<AyahMenuPress menu=\{keys\}>/],
  'mobile/src/ui/Sheet.tsx': [/<AyahMenuContext\.Provider value=\{null\}>/],
};
const MENU_OFF: Record<string, string> = {
  // A question before it is answered: the menu would name the answer.
  'mobile/src/components/QuizChoice.tsx': 'a question and its choices before the answer',
  'mobile/src/components/QuizCompare.tsx': 'a compare question',
  // Trees and the matrix have their own taps on each word.
  'mobile/src/components/QuizTree.tsx': 'a tree',
  'mobile/src/components/MatrixCard.tsx': 'the matrix, a tree view',
  // Recite and write boxes: their long press is recite mode's own. A share image is a picture, not a view.
  'mobile/src/components/HomeFeed.tsx': 'the recall card in recite mode, and its share picture',
  'mobile/src/components/AyahShare.tsx': 'a share picture',
  // Sheets turn it off themselves; these say so where the ayah is drawn.
  'mobile/src/components/AyahPreviewSheet.tsx': 'a sheet',
  'mobile/src/components/BalaghaSheet.tsx': 'a sheet',
  'mobile/src/components/GharibSheet.tsx': 'a sheet',
  'mobile/src/components/NoteSheet.tsx': 'a sheet',
  'mobile/src/components/ReaderSheets.tsx': 'a sheet',
  'mobile/src/components/WordSheet.tsx': 'a sheet',
  // The feed's readings card draws the ayah's lines as a picture under the readings (pointerEvents none).
  'mobile/src/components/QiraatPlace.tsx': 'the readings card\'s lines picture',
};

/** Each `menu={…}` a file passes, its braces balanced (a key may be a template, `${surah}:${ayah}`). */
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
    // The menu is off only with false written out (alone, or as one side of a condition), never `cond && key` or an empty key.
    expect(passes.flatMap(file => file.values.filter(value => /^[^?]*&&[^?]*$|(['"`])\1/.test(value)).map(value => `${file.path}: ${value}`))).toEqual([]);
    const off = passes.filter(file => file.values.some(value => /\bfalse\b/.test(value))).map(file => file.path);
    expect(off.filter(path => !(path in MENU_OFF))).toEqual([]);
    expect(Object.keys(MENU_OFF).filter(path => !off.includes(path)), 'an exception no longer used comes off the list').toEqual([]);
  });
});
