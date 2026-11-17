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
const FONT_HOME = ['src/app/globals.css', 'mobile/src/lib/fonts.ts', 'mobile/src/app/_layout.tsx', 'shared/sources.ts'];
/** Books quote the Quran in their own words and spelling (the exception): tafsir, i'rab, balagha, printed pages. */
const BOOKS = ['tafsirSadi', 'kashshaf', 'irab', 'irabUkbari', 'itqanBalagha', 'bookPages'].map(name => `shared/data/quran/${name}.`);
/**
 * Not the Hafs text, so the pages cannot hold it (owner, 2026-11-17): the other readers' readings (qiraat) and the Quranic Arabic
 * Corpus's dictionary forms of a word (lemmas, on the words page and in similar ayat). Also the old-spelling table that
 * shows those quotes and forms in the Madina spelling (mushafWords.json, owner 2026-11-17: kept for quoted Quran only;
 * page text never goes through it).
 */
const NOT_HAFS = ['shared/data/quran/mushafWords.json', 'shared/data/quran/qiraat.json', 'shared/data/quran/words.json', 'src/app/quran/words/lemmas.json', 'src/app/quran/words/places.json', 'src/app/quran/compare/similar.json'];

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

const breaks = {
  /** Sets the Quran font itself (app QURAN_FONT, website font-quran / --font-quran or the face's name) instead of going through the module. */
  font: code.filter(file => !inside(file.path, [...MODULE, ...FONT_HOME]) && /\bQURAN_FONT\b|--font-quran|\bfont-quran\b|KFGQPC[\s_]*Hafs|UthmanicHafs/i.test(file.text)).map(file => file.path).sort(),
  /** Turns the old text into page-looking text word by word (mushafText and its aliases), dropping every waqf, sajda and hizb sign. */
  convert: code.filter(file => !inside(file.path, MODULE) && file.path !== 'shared/quran/mushafText.ts' && /\b(mushafText|MushafText)\b|lib\/quranText'/.test(file.text)).map(file => file.path).sort(),
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
