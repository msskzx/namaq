import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * One tree everywhere (owner, 2026-11-16: «we have only one kind of trees»; docs/records/R0042): every tree is built by the
 * shared builders in shared/quran and drawn by the one BranchTree of each platform. A compare tree differs from a branches
 * tree only in size. These checks fail when a page builds tree nodes or draws tree lines of its own.
 */
const ROOT = join(__dirname, '..', '..');
const DIRS = ['src', 'mobile/src'];
/** The one tree component of each platform, and the website's pieces of it (its lines, fans and boxes). */
const DRAWERS = new Set(['src/app/quran/branches/BranchTree.tsx', 'src/app/quran/branches/Paths.tsx', 'src/app/quran/branches/TreeLinks.tsx', 'mobile/src/components/BranchTree.tsx']);
/** Quizzes draw a tree's question as the matrix only, never as a tree (owner, 2026-11-17). */
const QUIZ_MATRIX = new Set(['mobile/src/components/QuizTree.tsx', 'mobile/src/components/QuizExplainer.tsx']);

function sources(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = join(dir, name);
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : sources(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const files = DIRS.flatMap(sources).map(path => ({ path: relative(ROOT, join(ROOT, path)), text: readFileSync(join(ROOT, path), 'utf8') }));

describe('one tree', () => {
  it('builds tree nodes only in shared/quran (phraseTrees, foldForms, braid)', () => {
    // A Branch written out as an object: its words and the ayat it ends.
    const built = files.filter(file => /\bwords:\s*[^,\n]{1,80},\s*ayat:\s*\[/.test(file.text) && /\bchildren:\s*\[/.test(file.text));
    expect(built.map(file => file.path)).toEqual([]);
  });

  it('draws tree lines only in the one BranchTree of each platform', () => {
    const lines = files.filter(file => !DRAWERS.has(file.path) && (
      /\bfunction (Fan|Elbow|Spine|Stub|Join|BackFan|BraidEdge)\b/.test(file.text)
      || /import\s*\{[^}]*\b(Fan|Stub|Stem|elbow)\b[^}]*\}\s*from\s*'[^']*(Paths|TreeLinks)'/.test(file.text)
      || /from\s*'[^']*\/TreeLinks'/.test(file.text)));
    expect(lines.map(file => file.path)).toEqual([]);
  });

  it('draws every tree through BranchTree: a component that takes tree nodes hands them to it', () => {
    const takes = files.filter(file => file.path.endsWith('.tsx') && !DRAWERS.has(file.path) && !QUIZ_MATRIX.has(file.path) && /import\s+(type\s+)?\{[^}]*\bBranch\b[^}]*\}\s*from\s*'@shared\/quran\/branches'/.test(file.text));
    expect(takes.length).toBeGreaterThan(0);
    expect(takes.filter(file => !/import BranchTree\b/.test(file.text)).map(file => file.path)).toEqual([]);
  });

  it('builds a compare tree with the branches rules: words grouped as branches groups them, written differences folded', () => {
    const braid = readFileSync(join(ROOT, 'shared/quran/braid.ts'), 'utf8');
    expect(braid).toMatch(/import \{[^}]*\bletters\b[^}]*\bsharedDisplay\b[^}]*\} from '\.\/phraseTrees'/);
    expect(braid).toMatch(/return foldStrands\(braid\(/);
  });

  // Quizzes (owner, 2026-11-17: «the same bug we had in trees is still in quizzes»): the quiz built its trees with the bare
  // trie (createPhrasePresenter) and drew every box itself, so the branches rules never reached it.
  it('builds every shown tree with createTreePresenter: the bare trie only gives ids and sizes', () => {
    const bare = [...files, ...sources('shared').map(path => ({ path, text: readFileSync(join(ROOT, path), 'utf8') }))].filter(file => /\bcreatePhrasePresenter\b/.test(file.text) && !['shared/quran/phraseTrees.ts', 'shared/quran/subtrees.ts'].includes(file.path));
    expect(bare.map(file => file.path)).toEqual([]);
    expect(readFileSync(join(ROOT, 'shared/quiz/branchQuestions.ts'), 'utf8')).toMatch(/createTreePresenter\(/);
  });

  it('draws no tree in a quiz: its questions are the matrix', () => {
    const quiz = files.filter(file => QUIZ_MATRIX.has(file.path) || file.path.startsWith('src/app/quizzes/'));
    expect(quiz.filter(file => /import BranchTree\b/.test(file.text)).map(file => file.path)).toEqual([]);
  });

  it('lets the quiz draw only its own boxes (to type in, or graded): every given box is drawn by BranchTree', () => {
    const quiz = files.filter(file => /quiz/i.test(file.path) || file.path.endsWith('BranchAnswers.tsx'));
    // A given node's words written out by a quiz is a box of its own, past the branches rules (signs, written forms).
    expect(quiz.filter(file => /givenAnswer\(node\)/.test(file.text)).map(file => file.path)).toEqual([]);
    // Each quiz renderNode hands every node it does not ask back to BranchTree (returns undefined for it).
    const drawsAll = quiz.filter(file => [...file.text.matchAll(/renderNode(?::\s*RenderNode)?\s*=\s*\{?\(/g)]
      .some(match => !/undefined/.test(file.text.slice(match.index, match.index + 700))));
    expect(drawsAll.map(file => file.path)).toEqual([]);
  });
});
