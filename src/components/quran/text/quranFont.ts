/**
 * The Quran font for drawings that name it themselves (the compare video drawn on a canvas), as the app's quranFont.ts:
 * the module's one place handing out its name and its file.
 */
export const QURAN_FAMILY = 'KFGQPC Hafs';

/** The face for a drawing that loads its own fonts, from the site's copy of the file. */
export const quranFontFace = (origin: string) => `@font-face{font-family:"${QURAN_FAMILY}";src:url("${origin}/fonts/UthmanicHafs1Ver18.ttf") format("truetype");}`;
