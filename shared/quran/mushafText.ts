/**
 * The text as the mushaf font (KFGQPC Hafs) shows it. The font turns an ayah number into its own medallion,
 * so the ﴿﴾ the data puts around a number would draw a second frame around it.
 *
 * Every word is already stored as the Madina page prints it: the page text itself, and the lemmas and readings that
 * words.json, lemmas.json and qiraat.json keep in the page's spelling (scripts/quran/madinaSpelling.ts). Nothing here
 * changes a word.
 */
export const mushafText = (text: string) => text.replace(/﴿([٠-٩]+)﴾/g, '$1');
