# Shared-opening quiz questions

The quiz topic "Shared openings" (`BRANCHES`, فواتح الآيات) asks about the word tree on `/quran/branches`. A question shows a phrase that several ayat start with and asks what follows it in each branch the ayat split into. The reader types one free-text answer per branch.

## Questions (`branchQuestions` in `src/lib/quiz/branchQuestions.ts`)

- The questions come from `src/app/quran/branches/ayat.json` through `sharedOpenings` and `pieces` in `src/lib/quran/branches.ts`, so they follow the pieces the branches page lists. Nothing is stored: the server builds them once per process and stores no phrase or opening id, so a change to how openings are grouped changes the questions with it.
- Each piece is one question: a big opening is cut into pieces of at most `PIECE_MAX` (6) ayat, as on the page. The prompt is the words the piece's ayat share, in the Uthmani text, and says how many branches to give. The branches are the first split under those words. A piece is left out when an ayah ends where the words stop, or when it does not split. A piece of more than six ayat, which the page keeps when every ayah parts at once, is asked once per spelling with a leading و, ف or none that has two to six ayat. In juz' 29 to 30 that turns لا أقسم into «فَلَآ أُقْسِمُ» with four branches and «لَآ أُقْسِمُ» with two.
- Where an opening merges ayat with and without a leading و or ف, the prompt names each spelling, such as «يَطُوفُ عَلَيْهِمْ» أو «وَيَطُوفُ عَلَيْهِمْ».
- The setup takes a juz' range (`juzFrom` and `juzTo`, 1 to 30, default all). The ayat outside it are dropped before the tree is built, so the reader answers only the branches inside the range. In juz' 29 to 30, فلا أقسم has four branches (69:38, 70:40, 81:15, 84:16), and 56:75 in juz' 27 is not asked for. The range applies to this topic only.
- `juzOf` in `src/lib/quran/juz.ts` places an ayah by the 30 ayat each juz' starts at. A page lookup would be wrong for juz' 4, 7, 11 and 26, whose first ayah (3:93, 5:82, 9:93, 46:1) falls mid-page.
- These questions skip the reviewed bank under `data/quiz/`. The answer is the Quran text itself, and there is no distractor to check.
- The topic can be combined with the bank topics in one quiz. A person's circle leaves it out, and the setup then hides the juz' range.

## Grading (`matchBranches` in `src/lib/quiz/branchAnswers.ts`)

- The answers can be typed in any order, and each must match a different branch, so typing one word in every box earns one branch at most. A question counts as correct when every branch is matched.
- An answer matches when its words, read from the start, equal the branch's first word or first few words. Part of a word does not match.
- The reader writes ordinary Arabic spelling, not the mushaf rasm. Each rasm word is turned into a pattern of the spellings a reader may use, and a typed answer must match it letter for letter after `normalizeWord`:
  - A dagger alif may be written or left out, so السماوات and الكتاب match, and so do هذا, ذلك and إله.
  - A waw or ya that only carries a dagger alif may be written as that alif, so الصلاة, الحياة and التوراة match.
  - A hamza may be written on any seat, alif included, or left out, so شيئا, آمنوا, امنوا and أرأيتم match.
  - A small waw or ya in the rasm may be written as a full letter, so النبيين, إبراهيم and يستوون match.
  - An alif the rasm writes may not be dropped, and nothing else is loosened, so قل does not match قَالَ and لا does not match إِلَىٰ.
- An answer may run past the next fork. It is matched against each whole ayah under its branch, from the end of the phrase, and must stop at the end of a word. Spaces are ignored, so يا أيها matches يَـٰٓأَيُّهَا.
- A node is skipped when two of its branches start with words a reader would spell the same, such as بِظَلَّامٍ and بِظَلَّـٰمٍ.
- Answers typed but not checked are graded when the quiz is submitted.
- After checking, each matched answer is shown in the mushaf text with the matched words in bold, followed by each ayah's surah name and number, linking to its reader page. A branch nobody matched is shown under "Correct". A link opens the phrase's tree on `/quran/branches`.
