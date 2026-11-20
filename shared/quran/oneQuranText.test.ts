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
const PAGE = ['src/app/quran/read/Mushaf.module.css'];
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
  font: code.filter(file => !inside(file.path, [...MODULE, ...FONT_HOME, ...PAGE]) && /\bQURAN_FONT\b|--font-quran|\bfont-quran\b|KFGQPC[\s_]*Hafs|UthmanicHafs/i.test(file.text)).map(file => file.path).sort(),
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
