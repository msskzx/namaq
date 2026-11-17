import words from '../data/quran/mushafWords.json';

const display: Record<string, string> = words;
const spaced = Object.keys(display).filter(word => /\s/.test(word)).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const tokens = new RegExp(`(${spaced.join('|')}|\\s+)`);
/** The page's own words (signs left out): a word already as the page prints it is left as it is, signs and all. */
const pageForms = new Set(Object.values(display));
const SIGNS = /[ۖ-ۜ۞۩]/g;
/** The page's words in a sajda that carry its line (ۤ, U+06E4). The older copies write ۤ for a madda instead, so only these keep it. */
const SAJDA_LINED = new Set('أَلَّاۤ خَرُّواْۤ رَاكِعٗاۤ سُجَّدٗاۤ فَٱسۡجُدُواْۤ لَهُۥۤ لِلَّهِۤ لِلۡأَذۡقَانِۤ وَخَرَّۤ وَلِلَّهِۤ وَٱسۡجُدُواْۤ وَٱسۡجُدۡۤ يَخِرُّونَۤ يَسۡجُدُواْۤ يَسۡجُدُونَۤ يَسۡجُدُۤ ٱسۡجُدُواْۤ'.split(' ').map(word => word.normalize('NFC')));
const marks: Record<string, string> = { 'ًۭ': 'ٗ', 'ٌۭ': 'ٞ', 'ٍۢ': 'ٖ', 'ْ': 'ۡ', '۟': 'ْ', 'ی': 'ي', 'ک': 'ك', 'ࣰ': 'ٗ', 'ࣱ': 'ٞ', 'ࣲ': 'ٖ', 'ۤ': 'ٓ' };

/**
 * The text as the mushaf font (KFGQPC Hafs) shows it. The font turns an ayah number into its own medallion,
 * so the ﴿﴾ the data puts around a number would draw a second frame around it.
 */
export const mushafText = (text: string) => text.replace(/﴿([٠-٩]+)﴾/g, '$1').split(tokens).map(word => (pageForms.has(word.replace(SIGNS, '')) || SAJDA_LINED.has(word.replace(SIGNS, '').normalize('NFC')) ? word : display[word] ?? word.replace(/ًۭ|ٌۭ|ٍۢ|[ْ۟یکࣰࣱࣲۤ]/g, mark => marks[mark]).replace(SIGNS, ''))).join('');
