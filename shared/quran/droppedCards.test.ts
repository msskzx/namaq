// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 25): a card the owner dropped is hidden everywhere.
// Compare cards reach browse, search, quizzes, saved items and the feed only through shared/quran/compareCards.ts
// (`shownCards`, `decodeCards`), which leave dropped cards out; a file that reads the stored cards itself could show them.
// (Trees are the other filter, `droppedBranch`, applied once in branchInventory; the two judge different things.)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../..');
const ENTRY = 'shared/quran/compareCards.ts';
/** Files that read the stored cards themselves, each with why. Remove a line when its file goes through the entry. */
const KNOWN: Record<string, string> = {
  'src/app/quran/compare/pairCards.ts': 'the owner\'s review page, which must see dropped cards to judge them',
  'mobile/src/lib/compare.ts': 'a tree\'s links into compare (hitsOf) skip dropped cards with their own `!item.x`; it should share the website\'s compareLinksFor rule',
};

function walk(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

/** Whether a file takes the stored compare cards and reads their lists itself. */
export const readsStoredCards = (source: string) =>
  /['"][^'"]*data\/quran\/compareCards['"]/.test(source) && /\.(cards|stories)\b|\{[^}]*\b(cards|stories)\b[^}]*\}\s*=/.test(source);

describe('dropped compare cards are hidden everywhere', () => {
  it('only compareCards.ts reads the stored cards', () => {
    const files = ['shared', 'src', 'mobile/src'].flatMap(walk).filter(path => !path.startsWith('shared/data/'));
    expect(files).toContain(ENTRY);
    expect(files.filter(path => path !== ENTRY && !(path in KNOWN) && readsStoredCards(readFileSync(join(ROOT, path), 'utf8')))).toEqual([]);
  });

  it('keeps no exception that no longer reads them', () => {
    for (const path of Object.keys(KNOWN)) expect(readsStoredCards(readFileSync(join(ROOT, path), 'utf8')), path).toBe(true);
  });

  it('sees a file reading the stored cards', () => {
    expect(readsStoredCards("import generated from '@shared/data/quran/compareCards';\nconst list = stored.cards[`${a}:${b}`];")).toBe(true);
    expect(readsStoredCards("import generated from '../data/quran/compareCards';\nconst story = stored.stories?.[page];")).toBe(true);
    expect(readsStoredCards("import generated from '../data/quran/compareCards';\nObject.values(stored.cards);")).toBe(true);
    expect(readsStoredCards("import generated from '../data/quran/compareCards';\nconst { cards } = stored;")).toBe(true);
    expect(readsStoredCards("import generated from '../data/quran/compareCards';\nshownCards(stored, words, a, b);")).toBe(false);
  });
});
