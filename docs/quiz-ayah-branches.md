# Shared-opening quiz questions

The quiz topic "Shared openings" (`BRANCHES`, فواتح الآيات) asks about the word tree on `/quran/branches`. A question shows a phrase that several ayat start with and asks what follows it in each branch the ayat split into. The reader types one free-text answer per branch.

## Questions (`branchQuestions` in `src/lib/quiz/branchQuestions.ts`)

- The questions come from `src/app/quran/branches/ayat.json` through `sharedOpenings` and `branch` in `src/lib/quran/branches.ts`, so they follow whatever grouping that page draws. Nothing is stored: the server builds them once per process and stores no phrase or opening id, so a change to how openings are grouped changes the questions with it.
- A node of the tree becomes a question when it has two to five children and no ayah ends on it. The prompt is every word from the start of the ayah to that node, in the Uthmani text, and says how many branches to give. A node with more than five children, or one where an ayah stops, is left out.
- The setup takes a juz' range (`juzFrom` and `juzTo`, 1 to 30, default all). The ayat outside it are dropped before the tree is built, so the reader answers only the branches inside the range. In juz' 29 to 30, فلا أقسم has four branches (69:38, 70:40, 81:15, 84:16), and 56:75 in juz' 27 is not asked for. The range applies to this topic only.
- `juzOf` in `src/lib/quran/juz.ts` places an ayah by the 30 ayat each juz' starts at. A page lookup would be wrong for juz' 4, 7, 11 and 26, whose first ayah (3:93, 5:82, 9:93, 46:1) falls mid-page.
- These questions skip the reviewed bank under `data/quiz/`. The answer is the Quran text itself, and there is no distractor to check.
- The topic can be combined with the bank topics in one quiz. A person's circle leaves it out.

## Grading (`matchBranches` in `src/lib/quiz/branchAnswers.ts`)

- The answers can be typed in any order, and each must match a different branch. A question counts as correct when every branch is matched.
- An answer matches when its words, read from the start, equal the branch's first word or first few words. Part of a word does not match.
- The reader writes ordinary Arabic spelling, not the mushaf rasm, so both sides are compared at three levels, strictest first:
  1. after `normalizeWord`, which drops diacritics and pause marks and folds the alif, ya and ta marbuta forms;
  2. with every alif removed as well, so السماوات matches ٱلسَّمَـٰوَٰتِ;
  3. with alif, waw, ya and hamza removed as well, so الصلاة matches ٱلصَّلَوٰةَ and آمنوا matches ءَامَنُوا۟.
- Spaces are ignored inside an answer, so يا أيها matches يَـٰٓأَيُّهَا.
- When an answer fits both branches at the loose level, it goes to the branch it matches at a stricter one. قيل goes to قِيلَ rather than قَالَ.
- After checking, each matched answer is shown in the mushaf text with the matched words in bold, followed by each ayah's surah name and number, linking to its reader page. A branch nobody matched is shown under "Correct". A link opens the phrase's tree on `/quran/branches`.
