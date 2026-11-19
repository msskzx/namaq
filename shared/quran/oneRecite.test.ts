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

/** A file that grades typed answers against Quran words (the written quizzes' grading and answer modules). */
const GRADES_TYPED = /from\s*['"]@shared\/quiz\/(feedback|compareAnswers|branchAnswers|writeBlanks)['"]|\b(gradedTree|compareCorrections|matchTreeAnswers)\b/;
/** Text fields in files that grade typed Quran, that take no Quran (listed with why; the list only shrinks). */
const FIELDS_ALLOWED: Record<string, string> = {
  'mobile/src/screens/quiz/party/code.tsx': 'the player\'s name field',
  'src/app/quizzes/party/PartyRoom.tsx': 'the player\'s name field',
};

/**
 * Each text field's own tag (TextInput, input but a checkbox, textarea, Field, SearchField), up to the /> that closes it,
 * past props that hold arrows or elements of their own (=>, icon={<X />}).
 */
function textFields(text: string): string[] {
  const tags: string[] = [];
  for (const match of text.matchAll(/<(TextInput|input|textarea|Field|SearchField)\b/g)) {
    let depth = 0;
    let at = match.index! + match[0].length;
    for (; at < text.length; at++) {
      const char = text[at];
      if (char === '{') depth++;
      else if (char === '}') depth--;
      else if (depth === 0 && char === '>') break;
    }
    const tag = text.slice(match.index, at + 1);
    if (!/type=["']checkbox["']/.test(tag)) tags.push(tag);
  }
  return tags;
}

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

  // Writing Quran is recite mode's boxes everywhere (owner, 2026-11-19): the متشابهات and compare quizzes had their own
  // free-text fields in the Quran font, which none of the checks above saw.
  it('has no text field where a quiz grades typed Quran: its blanks are write boxes (useWriteBlanks)', () => {
    const grading = all.filter(file => GRADES_TYPED.test(file.text) && !ALLOWED[file.path]);
    expect(grading.filter(file => textFields(file.text).length && !FIELDS_ALLOWED[file.path]).map(file => file.path)).toEqual([]);
    // Every file that draws a quiz's blanks to type draws them through the recite piece.
    const inputs = grading.filter(file => /\b(QuizInputs|CompareInputs|BranchInputs)\b\s*\(/.test(file.text));
    expect(inputs.length).toBeGreaterThan(0);
    expect(inputs.filter(file => !/\buseWriteBlanks\(/.test(file.text) || !/<BlankBoxes\b/.test(file.text)).map(file => file.path)).toEqual([]);
  });

  it('never sets a text field in the Quran font, however the font reaches it', () => {
    const quranFont = /QURAN_FONT|font-quran|KFGQPC|UthmanicHafs/;
    const quranish = (text: string) => {
      // Names this file gives the font (a style helper, a class string): `const quran = (...) => ({ fontFamily: QURAN_FONT`.
      const names = [...text.matchAll(/(?:const|let|function)\s+(\w+)\b[^\n]*?(?:QURAN_FONT|font-quran)/g)].map(match => match[1]);
      const named = names.length ? new RegExp(`\\b(${names.join('|')})\\b`) : null;
      return (tag: string) => quranFont.test(tag) || !!named?.test(tag);
    };
    expect(all.filter(file => textFields(file.text).some(quranish(file.text))).map(file => file.path)).toEqual([]);
  });

  it('draws the recite bar\'s buttons only in RecitePill', () => {
    expect(outside.filter(file => LABELS.some(label => file.text.includes(label))).map(file => file.path)).toEqual([]);
  });
});
