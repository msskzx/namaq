import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import fixes from './madinaSpelling.json';
import type { MushafPage } from '../../shared/quran/readerPage';

const SIGNS = /[ۖ-ۜ۞۩]/g;
const display: Record<string, string> = fixes;
const spaced = Object.keys(display).filter(word => /\s/.test(word)).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const tokens = new RegExp(`(${[...spaced, '\\s+'].join('|')})`);
const marks: Record<string, string> = { 'ًۭ': 'ٗ', 'ٌۭ': 'ٞ', 'ٍۢ': 'ٖ', 'ْ': 'ۡ', '۟': 'ْ', 'ی': 'ي', 'ک': 'ك', 'ࣰ': 'ٗ', 'ࣱ': 'ٞ', 'ࣲ': 'ٖ', 'ۤ': 'ٓ' };

let pageWords: Set<string> | undefined;
const printed = (word: string) => {
  pageWords ??= new Set(Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(__dirname, '../../shared/data/quran/mushaf', `${i + 1}.json`), 'utf8')) as MushafPage)
    .flatMap(page => page.items.flatMap(item => 'line' in item ? item.line.filter((token): token is string => typeof token === 'string') : []))
    .flatMap(word => [word.normalize('NFC'), word.replace(SIGNS, '').normalize('NFC')]));
  return pageWords.has(word.normalize('NFC')) || pageWords.has(word.replace(SIGNS, '').normalize('NFC'));
};

export const madinaSpelling = (text: string) => text.split(tokens).map(word =>
  printed(word) ? word : display[word] ?? word.replace(/ًۭ|ٌۭ|ٍۢ|[ْ۟یکࣰࣱࣲۤ]/g, mark => marks[mark]).replace(SIGNS, '')).join('');
