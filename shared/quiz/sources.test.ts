// The guard on owner's rule (2026-11-19, "every quiz shows its references"): every question of every kind, and every
// tree, says where its answer comes from. Every kind in CHOICE_KINDS is run whole, so a new kind is checked the day it is
// registered.
import { describe, expect, it } from 'vitest';
import { CHOICE_KINDS } from './kinds';
import { seededRandom } from './feedQuiz';
import { branchQuestions } from './branchQuestions';
import { quizTrees } from './treeScope';
import { ayahPlace, citeSource, mushafSource, MUSHAF_BOOK, referenceGroups, sourceEntries, type QuizSource } from './sources';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';

const ALL = { range: null, filters: {} };
/** A source a reader can find: a book, and where in it. */
const findable = (source: QuizSource) => !!source.book.trim() && !!source.at?.trim();

describe('every quiz question cites where its answer comes from', () => {
  for (const kind of CHOICE_KINDS) {
    it(kind.name, () => {
      const unsourced = kind.questions(ALL, 'medium', seededRandom(5)).filter(question => !question.sources.length || !question.sources.every(findable));
      expect(unsourced.map(question => question.key)).toEqual([]);
    });
  }

  it('cites, for every tree, the mushaf at each of its ayat and the mutashabih book that sets them side by side', () => {
    const trees = branchQuestions(corpus.ayat as BranchAyah[], null, quizTrees());
    expect(trees.length).toBeGreaterThan(0);
    for (const tree of trees) {
      const [mushaf, ...books] = tree.sources;
      expect(mushaf.book).toBe(MUSHAF_BOOK);
      for (const branch of tree.branches) for (const ayah of branch.ayat) expect(mushaf.at).toContain(ayahPlace(ayah.key));
      // Quiz trees are the books' pairs only (owner, 2026-11-19), so each has a book's entry.
      expect(books.length, tree.key).toBeGreaterThan(0);
      expect(books.every(findable), tree.key).toBe(true);
    }
  });
});

describe('how a reference is written', () => {
  it('names the mushaf by its ayat on a card\'s line, and a book by its name and author (owner, 2026-11-20)', () => {
    const groups = referenceGroups([{ book: 'تيسير الكريم الرحمن', author: 'السعدي', at: 'ص ٩٣٧' }, mushafSource('112:3', 604)]);
    expect(groups.map(group => group.title)).toEqual([`المصحف · ${ayahPlace('112:3')}`, 'تيسير الكريم الرحمن · السعدي']);
    // Opened, the mushaf names its printing and the page.
    expect(groups[0].lines.map(line => line.text)).toEqual([MUSHAF_BOOK, `${ayahPlace('112:3')}، ص ٦٠٤`]);
  });

  it('names who says the words before them (owner, 2026-11-20)', () => {
    const [group] = referenceGroups([{ book: 'سير أعلام النبلاء', at: '١/٤١', quote: 'إن لكل نبي حواريًا', by: 'قال النبي ﷺ:' }]);
    expect(group.lines.map(line => line.text)).toEqual(['قال النبي ﷺ:', '«إن لكل نبي حواريًا»، ١/٤١']);
  });

  it('writes out where in each book and its printing, each once, for a share picture that cannot be opened', () => {
    const [group] = sourceEntries([
      { book: 'صحيح البخاري', author: 'البخاري', at: 'كتاب الإيمان، رقم ٥٠', edition: 'الطبعة السلطانية' },
      { book: 'صحيح البخاري', author: 'البخاري', at: 'كتاب الإيمان، رقم ٥٠', quote: 'ما الإيمان', edition: 'الطبعة السلطانية' },
    ]);
    expect(group.places).toEqual(['كتاب الإيمان، رقم ٥٠']);
    expect(group.editions).toEqual(['الطبعة السلطانية']);
    const [mushaf] = sourceEntries([mushafSource('112:3', 604)]);
    expect(mushaf.places).toEqual([MUSHAF_BOOK, 'ص ٦٠٤']);
  });

  it('reads the book apart from the place in a sira reference, so the collapsed line shows the book alone', () => {
    expect(citeSource({ text: 'خرج رسول الله', cite: 'سير أعلام النبلاء، السيرة ١، ص ٢٩٧', url: 'https://shamela.ws/book/10906/1' }))
      .toEqual({ book: 'سير أعلام النبلاء', at: 'السيرة ١، ص ٢٩٧', quote: 'خرج رسول الله', url: 'https://shamela.ws/book/10906/1' });
  });
});
