// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 23): the tree, the matrix and the compare cards colour
// alike words by one rule (shared/quran/wordMatch.ts, through ayahContext's `sharedByAll` and mobile/src/lib/marks.ts). A
// screen that strips marks or letters itself to compare words would colour them by a rule of its own.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../..');
const SCREENS = ['mobile/src', 'src', 'shared'];
/** shared/quran holds the one rule; the built data files are not code. */
const RULE = /^shared\/(quran|data)\//;
/**
 * Files outside shared/quran with letter code of their own when the guard came, each with why. The list only shrinks:
 * a file that comes to compare Quran words moves its code into shared/quran.
 */
const ALLOWED: Record<string, string> = {
  'shared/tarajimGroups.ts': 'people\'s names in the tarajim lists, not Quran words',
  'src/lib/graphIntegrity.ts': 'people\'s names in the graph checks',
  'src/lib/model/hadithView.ts': 'a hadith\'s «قال» lead, not Quran words',
  'src/lib/model/name.ts': '«ابن» in people\'s names',
  'src/lib/model/span.ts': 'marks in book text spans, not Quran words',
  'src/lib/model/tabaqa.ts': 'people\'s names',
  'src/lib/quiz/generate.ts': 'people\'s names in the catalog quiz',
  'src/lib/subjectSearch.ts': 'the website search over subjects',
  'shared/bookReader.ts': 'finding a quote in a book\'s text',
  'shared/events/lifeTimeline.ts': 'event text in the life timeline',
  'shared/hadith.ts': 'hadith text',
  'shared/party/rules.ts': 'players\' names in a party',
  'shared/quiz/integrity.ts': 'the quiz checks compare a typed ayah with the corpus; should move into shared/quran',
  'shared/quiz/branchQuestions.ts': 'the tree quiz\'s next-word class; should move into shared/quran',
  'src/lib/quran/lemmas.ts': 'turns the corpus\'s Buckwalter letters into Arabic when building lemmas',
  'src/lib/quran/mutashabih/engine.ts': 'the website\'s mutashabih engine compares words itself; should use shared/quran/wordMatch',
  'src/app/people/[slug]/life/LifePage.tsx': 'people\'s names',
  'src/app/people/[slug]/nasab/NasabPage.tsx': 'people\'s names',
  'src/lib/model/appPeople.ts': 'people\'s names',
  'src/lib/tarajim.ts': 'people\'s names',
  'shared/tarajim.ts': 'people\'s names',
  'shared/tarajimLine.ts': 'people\'s names',
  'shared/quiz/tarajim.ts': 'people\'s names in the tarajim quizzes',
  'shared/quiz/sira.ts': 'names in the sira quiz',
  'shared/quiz/hadith.ts': 'hadith text',
  'shared/quiz/balaghaTermQuiz.ts': 'balagha term names',
  'shared/prayer.ts': 'city names in the prayer-times search',
  'shared/quiz/hints.ts': 'the letters a quiz hint shows; strips marks of its own and should move into shared/quran',
  'shared/tajwid/questions.ts': 'the tajwid quiz strips marks of its own; should move into shared/quran',
};

function walk(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

/** Own letter code: a range of Arabic marks or letters by code point, a class of two or more marks, or a Unicode normalize. */
export const ownLetterCode = (source: string) =>
  /\\u06[4-6][0-9A-Fa-f]|\\u061[0-9A]|\\u0670|\\p\{M|\.normalize\(|\[[^\]\n]*[\u0610-\u061A\u064B-\u065F\u0670]-|\[[\u0610-\u061A\u064B-\u065F\u0670]{2,}|\[[\u0610-\u061A\u064B-\u065F\u0670]\]/u.test(source);

describe('one word-match rule for tree, matrix and compare', () => {
  it('no screen compares words with letter code of its own', () => {
    const files = SCREENS.flatMap(walk).filter(path => !RULE.test(path));
    expect(files).toContain('mobile/src/lib/marks.ts');
    expect(files.some(path => path.startsWith('shared/quran/'))).toBe(false);
    expect(files.filter(path => !(path in ALLOWED) && ownLetterCode(readFileSync(join(ROOT, path), 'utf8')))).toEqual([]);
  });

  it('keeps no exception that no longer needs it', () => {
    for (const path of Object.keys(ALLOWED)) expect(ownLetterCode(readFileSync(join(ROOT, path), 'utf8')), path).toBe(true);
  });

  it('sees letter code', () => {
    expect(ownLetterCode("word.replace(/[\\u064B-\\u0652]/g, '')")).toBe(true);
    expect(ownLetterCode('word.normalize(\'NFC\')')).toBe(true);
    expect(ownLetterCode("word.replace(/[ًٌٍَُِّْ]/g, '')")).toBe(true);
    expect(ownLetterCode("word.replace(/[ً-ْ]/g, '')")).toBe(true);
    expect(ownLetterCode("word.replace(/[\\u0610-\\u061A]/g, '')")).toBe(true);
    expect(ownLetterCode("word.replace(/\\p{M}/gu, '')")).toBe(true);
    expect(ownLetterCode("word.replace(/ٰ/g, 'ا')")).toBe(false);
    expect(ownLetterCode("word.replace(/[ٰ]/g, 'ا')")).toBe(true);
    expect(ownLetterCode("import { bare } from '@shared/quran/quranText/ayahWords';")).toBe(false);
  });
});
