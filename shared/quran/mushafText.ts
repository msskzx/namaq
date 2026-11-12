import words from '../data/quran/mushafWords.json';

const display: Record<string, string> = words;
const spaced = Object.keys(display).filter(word => /\s/.test(word)).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const tokens = new RegExp(`(${spaced.join('|')}|\\s+)`);
const marks: Record<string, string> = { 'ًۭ': 'ٗ', 'ٌۭ': 'ٞ', 'ٍۢ': 'ٖ', 'ْ': 'ۡ', '۟': 'ْ', 'ی': 'ي', 'ک': 'ك', 'ࣰ': 'ٗ', 'ࣱ': 'ٞ', 'ࣲ': 'ٖ', 'ۤ': 'ٓ' };

/**
 * The text as the mushaf font (KFGQPC Hafs) shows it. The font turns an ayah number into its own medallion,
 * so the ﴿﴾ the data puts around a number would draw a second frame around it.
 */
export const mushafText = (text: string) => text.replace(/﴿([٠-٩]+)﴾/g, '$1').split(tokens).map(word => display[word] ?? word.replace(/ًۭ|ٌۭ|ٍۢ|[ْ۟یکࣰࣱࣲۤ]/g, mark => marks[mark]).replace(/[ۖ-ۜ۞۩]/g, '')).join('');
