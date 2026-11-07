import React from 'react';
import words from '@/lib/quran/mushafWords.json';

const display: Record<string, string> = words;
const spaced = Object.keys(display).filter(word => /\s/.test(word)).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const tokens = new RegExp(`(${spaced.join('|')}|\\s+)`);
const marks: Record<string, string> = { 'ًۭ': 'ٗ', 'ٌۭ': 'ٞ', 'ٍۢ': 'ٖ', 'ْ': 'ۡ', '۟': 'ْ', 'ی': 'ي', 'ک': 'ك', 'ࣰ': 'ٗ', 'ࣱ': 'ٞ', 'ࣲ': 'ٖ', 'ۤ': 'ٓ' };

export default function MushafText({ children }: { children: string }) {
  const parts = children.split(tokens);
  return <>{parts.map(word => display[word] ?? word.replace(/ًۭ|ٌۭ|ٍۢ|[ْ۟یکࣰࣱࣲۤ]/g, mark => marks[mark]).replace(/[\u06D6-\u06DC\u06DE\u06E9]/g, '')).join('')}</>;
}
