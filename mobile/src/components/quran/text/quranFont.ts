import { QURAN_FONT } from '@/lib/fonts';

/**
 * The Quran font for drawings that name it themselves, not through a Text (the tree, compare and share videos drawn on a
 * canvas, the theme tiles' small previews): the module's one place handing out its name and its file.
 */
export const QURAN_FAMILY = QURAN_FONT;

/** The font's file, for a video recorded in a web view, which embeds the face itself. */
 
export const QURAN_FONT_FILE: number = require('../../../../assets/fonts/UthmanicHafs1Ver18.ttf');
