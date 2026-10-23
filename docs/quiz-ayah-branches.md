# Shared-opening quiz questions

The quiz topic "Shared openings" (`BRANCHES`, فواتح الآيات) asks about the word tree on `/quran/branches`. A question shows a phrase that several ayat start with and asks what follows it in each branch the ayat split into. The quiz uses the same connected tree as the explorer. The opening is supplied, and the reader completes every node after it, including the terminal leaves.

## Questions (`branchQuestions` in `src/lib/quiz/branchQuestions.ts`)

- The questions come from `src/app/quran/branches/ayat.json` through `sharedOpenings` and `pieces` in `src/lib/quran/branches.ts`, so they follow the pieces the branches page lists. Nothing is stored: the server builds them once per process and stores no phrase or opening id, so a change to how openings are grouped changes the questions with it.
- Each piece is one question: a big opening is cut into pieces of at most `PIECE_MAX` (6) ayat, as on the page. The prompt is the words the piece's ayat share, in the Uthmani text, and identifies the first split. The question also carries the complete tree under those words. A piece is left out when an ayah ends where the words stop, or when it does not split. A piece of more than six ayat, which the page keeps when every ayah parts at once, is left out. Where such a node mixes a leading و or ف, the page already splits it by spelling, so in juz' 29 to 30 فلا أقسم is its own piece with four branches.
- Where the ayat of a piece open with different first words, with or without a leading و or ف or with a different lemma, the prompt names each spelling, such as «يَطُوفُ عَلَيْهِمْ» أو «وَيَطُوفُ عَلَيْهِمْ» or «وَإِنَّ» أو «وَإِن», and the tree draws each spelling as its own node before the shared words, as `/quran/branches` does. In the quiz these nodes carry no link, since the spelling's own tree would show the answers. After checking, each ayah carries its spelling beside its reference.
- The setup takes a juz' range (`juzFrom` and `juzTo`, 1 to 30, default all). The ayat outside it are dropped before the tree is built, so the reader answers only the branches inside the range. In juz' 29 to 30, فلا أقسم has four branches (69:38, 70:40, 81:15, 84:16), and 56:75 in juz' 27 is not asked for. The range applies to this topic only.
- `juzOf` in `src/lib/quran/juz.ts` places an ayah by the 30 ayat each juz' starts at. A page lookup would be wrong for juz' 4, 7, 11 and 26, whose first ayah (3:93, 5:82, 9:93, 46:1) falls mid-page.
- These questions skip the reviewed bank under `data/quiz/`. The answer is the Quran text itself, and there is no distractor to check.
- The topic can be combined with the bank topics in one quiz. A person's circle leaves it out, and the setup then hides the juz' range.

## Grading (`matchTreeAnswers` in `src/lib/quiz/branchAnswers.ts`)

- Each non-root node has one field, in the tree's depth-first order. Checking is available after typing in any field and shows corrections for blank nodes. A question counts as correct only when every field is correct. A node that splits again needs all its words. A leaf needs at least its first two words, or all of them if it has fewer, because siblings always differ at their first word and the full ayah is a typing test on a phone. Every word typed must still be right and in order, so a skipped or misspelled word fails the leaf wherever it falls (جاهد الكفار واغلظ skips والمنافقين). Filling only the first split or leaving a leaf blank does not complete the tree.
- Sibling branches with the same shape can be entered in either order. Grading pairs whole subtrees, so a leaf must remain under its parent. Each expected subtree is used once. Feedback uses the pairing with the most correct nodes and, among those, the one whose answers get the most words right from the start, so a wrong answer is shown beside the leaf it starts like. It displays the correct text at every node, and links terminal ayat to their reader pages.
- After checking, every leaf offers an ayah-context overlay. A filled amber button also identifies nodes with differing marks. Context controls stay hidden while answering. See [Shared ayah openings](plans/quran-shared-openings.md).
- Inputs show only the supplied opening and the tree's shape. Answer words, surah labels and reader links appear after checking.
- The reader writes ordinary Arabic spelling, not the mushaf rasm. Each rasm word is turned into a pattern of the spellings a reader may use, and a typed answer must match it letter for letter after `normalizeWord`:
  - A dagger alif may be written or left out, so السماوات and الكتاب match, and so do هذا, ذلك and إله.
  - A waw or ya that only carries a dagger alif may be written as that alif, so الصلاة, الحياة and التوراة match.
  - A hamza may be written on any seat, alif included, or left out, so شيئا, آمنوا, امنوا and أرأيتم match. A hamza on ya or waw may use the bare keyboard letter, so يوميذ and يومئذ match, and يومنون matches يؤمنون. شي matches شَىْءٍ.
  - A small waw or ya in the rasm may be written as a full letter, so النبيين, إبراهيم and يستوون match.
  - An alif the rasm writes may not be dropped, and nothing else is loosened, so قل does not match قَالَ and لا does not match إِلَىٰ.
- An answer is read from its start and must stop at the end of a word. Spaces are ignored, so يا أيها matches يَـٰٓأَيُّهَا. There is no general edit-distance matching, so changing an unrelated consonant still fails.
- Words with the same letters, root and lemma share one node, as on the page, so the reader never types تتخذوا into two sibling fields for تَتَّخِذُوا۟ and تَتَّخِذُوٓا۟. Sibling fields with the same letters remain only where the lemmas differ, such as إِن and إِنَّ, and grading pairs them by what follows.
- A ﴿n﴾ marker that carries an ayah into the next one is shown but not typed.
- Answers typed but not checked are graded when the quiz is submitted.
- After checking, the complete tree shows each typed answer and its result beside the correct mushaf text. Terminal nodes link each ayah to its reader page. A link opens the phrase's tree on `/quran/branches`.
