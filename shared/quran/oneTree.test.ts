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
    const takes = files.filter(file => file.path.endsWith('.tsx') && !DRAWERS.has(file.path) && /import\s+(type\s+)?\{[^}]*\bBranch\b[^}]*\}\s*from\s*'@shared\/quran\/branches'/.test(file.text));
    expect(takes.length).toBeGreaterThan(0);
    expect(takes.filter(file => !/import BranchTree\b/.test(file.text)).map(file => file.path)).toEqual([]);
  });

  it('builds a compare tree with the branches rules: words grouped as branches groups them, written differences folded', () => {
    const braid = readFileSync(join(ROOT, 'shared/quran/braid.ts'), 'utf8');
    expect(braid).toMatch(/import \{[^}]*\bletters\b[^}]*\bsharedDisplay\b[^}]*\} from '\.\/phraseTrees'/);
    expect(braid).toMatch(/return foldStrands\(braid\(/);
  });
});
