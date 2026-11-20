// The size the Quran text takes when it is not a printed page (owner, 2026-11-19: every ayah view keeps the mushaf's line
// size and height): the reader's flowing text (its bigger text size), at size 1. The reader, every copied ayah and every
// quiz set it from these, so an ayah reads the same size and line height wherever it shows.

/** The font size of flowing Quran text, per unit of the width it flows in (about the printed page's size). */
export const FLOW_SIZE = 0.063;

/** The height of one flowing line, for the font size: the Hafs font's marks sit far above and below its letters. */
export const FLOW_LINE = 1.7;

/** The font size for a width (and a reader's zoom). */
export const flowFontSize = (width: number, zoom = 1) => width * FLOW_SIZE * zoom;

/**
 * The widest phone screen in common use (CSS px / points). A word on its own (a word list's row, a picked word, a reading)
 * takes the size an ayah has in a card on a phone: on a wider screen (a tablet, the website on a computer) it stops there,
 * so a list of words stays a list and does not grow with the window.
 */
export const PHONE_WIDTH = 430;

/** A card's margins on a phone, both sides together: an ayah in a card flows in the screen less these. */
export const CARD_MARGINS = 64;

/** The font size of a Quran word on its own, for the screen's width. */
export const wordFontSize = (screen: number) => flowFontSize(Math.min(screen, PHONE_WIDTH) - CARD_MARGINS);
