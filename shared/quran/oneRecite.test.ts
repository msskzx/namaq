// Recite mode has one entry on each side (owner, 2026-11-17): its state (useRecite) and its bar (RecitePill). Any other
// file that moves a recitation, makes write boxes, or draws the bar's buttons fails here. AGENTS.md "One entry for each shared thing".
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../..');
const SIDES = ['src', 'mobile/src'];
/** The one recite piece on each side. */
const ENTRY = ['src', 'mobile/src'].flatMap(side => ['useRecite.ts', 'RecitePill.tsx', 'PenSetting.tsx'].map(name => `${side}/components/recite/${name}`));
/** The write boxes themselves (the recite piece's parts). */
const PARTS = ['src/app/quran/read/useWriteBoxes.tsx', 'mobile/src/lib/useWriteBoxes.tsx'];
/** Known exceptions, listed with why; the list only shrinks. */
const ALLOWED: Record<string, string> = {
  'src/components/homepage/Tour.tsx': 'the first-launch tour plays a recitation by itself, no controls',
  'mobile/src/components/Tour.tsx': 'the first-launch tour plays a recitation by itself, no controls',
};

/** What only the recite piece may do. */
const MOVES = [
  /import\s*\{[^}]*\buseWriteBoxes\b/, // write boxes
  /import\s*\{[^}]*\b(revealAyah|revealWord|stepBack)\b[^}]*\}\s*from\s*'@shared\/quran\/recite'/, // moving a recitation by hand
  /import\s*\{[^}]*\b(freshBoxes|typeInBox|gradeWritten|nextBox|previousBox)\b[^}]*\}\s*from\s*'@shared\/quran\/writeAyah'/, // boxes made by hand
];
/** Stepping a reciteView by hand: a file that makes one and calls its next step. */
const stepsView = (text: string) => /\breciteView\b/.test(text) && /\.(nextAyah|nextWord)\(\)/.test(text);
/** The bar's own buttons, by their labels. */
const LABELS = ['ارجع خطوة', 'أظهر الكلمة التالية', 'أظهر الآية التالية', 'أوقف الكتابة', 'اكتب أول كل آية وآخرها', 'اكتب كل آية كاملة'];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === 'node_modules' ? [] : files(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe('one recite piece', () => {
  const all = SIDES.flatMap(side => files(join(ROOT, side))).map(path => ({ path: relative(ROOT, path), text: readFileSync(path, 'utf8') }));
  const outside = all.filter(file => !ENTRY.includes(file.path) && !PARTS.includes(file.path) && !ALLOWED[file.path]);

  it('moves a recitation and holds write boxes only in useRecite', () => {
    expect(outside.filter(file => MOVES.some(move => move.test(file.text)) || stepsView(file.text)).map(file => file.path)).toEqual([]);
  });

  it('draws the recite bar\'s buttons only in RecitePill', () => {
    expect(outside.filter(file => LABELS.some(label => file.text.includes(label))).map(file => file.path)).toEqual([]);
  });
});
