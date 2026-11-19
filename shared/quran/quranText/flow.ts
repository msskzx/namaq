// The size the Quran text takes when it is not a printed page (owner, 2026-11-19: every ayah view keeps the mushaf's line
// size and height): the reader's flowing text (its bigger text size), at size 1. The reader, every copied ayah and every
// quiz set it from these, so an ayah reads the same size and line height wherever it shows.

/** The font size of flowing Quran text, per unit of the width it flows in (about the printed page's size). */
export const FLOW_SIZE = 0.063;

/** The height of one flowing line, for the font size: the Hafs font's marks sit far above and below its letters. */
export const FLOW_LINE = 1.7;

/** The font size for a width (and a reader's zoom). */
export const flowFontSize = (width: number, zoom = 1) => width * FLOW_SIZE * zoom;
