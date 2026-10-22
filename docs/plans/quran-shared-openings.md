# Shared ayah openings

## PR 422 follow-up handoff

Status: the owner accepted the context overlay design and authorized
implementation. The accepted prototype is preserved on
`codex/context-overlay-prototype`, commit `8a8ca193`. Terms are defined in
[CONTEXT.md](../../CONTEXT.md#shared-quran-wording).

### Behavior and acceptance criteria

- Keep the shared display rule. At each aligned letter, retain marks common to
  every original and remove differing marks, including several differences in
  one word or node. أَرَءَيْتُمْ and أَرَءَيْتُم display as أَرَءَيْتُم;
  مِنْ and مِّنْ display as مِنْ. Significant vowels, letters, grouping, and
  ayah membership keep their existing meaning.
- Each leaf combines its references and a Lucide TextSearch icon into one
  borderless context button. The icon is on the right; references are plain
  text inside the button, with no separate reader links. Differing original
  marks give the leaf icon an amber background. Inner nodes and first-word
  boxes with differing marks use a filled amber icon button. Both treatments
  have translated accessible names and titles.
- The button opens a native modal dialog. It replaces the repeated inline
  variant list, while the compact node retains its shared phrase and combined reference control.
  The dialog has one card per represented ayah, ordered numerically by surah
  and ayah. An original matching the shared display is included like every other
  original. A display absent from the source creates no additional card.
- Each card uses the comparison page's PageSpread presentation. It shows the
  preceding ayah, the target ayah, and the following ayah from the same surah.
  At a surah boundary, omit the unavailable neighbor. Context can extend outside
  the selected juz' range. Original reader text and marks stay intact.
- Emphasize the target ayah and highlight words whose marks differ in this node.
  Word offsets must account for the first-word boxes and for leaves continuing
  after an ayah marker. Each card links to its target ayah in the reader.
- Use two columns on wide screens and stacked cards on narrow screens. Keep
  the dialog scrollable. Lock background scrolling while it is open and restore
  previous scroll settings on closing or unmounting. Native dialog focus,
  Escape, the close button, and backdrop dismissal must work.
- Load context only on opening. Show loading and failure states with a retry
  action. Apply the same behavior in tree view, list view, and quiz feedback.
  Keep all context buttons hidden while answering a quiz.

### Affected components and dependencies

- `src/lib/quran/branches.ts` retains complete original node phrases and their
  ayah membership separately from the shared display.
- `src/lib/quran/ayahContext.ts` loads and caches the 604 source reader pages
  and selects immediate same-surah neighbors. `/api/quran/context` validates
  requested keys and returns the context, independently of database text.
- `src/app/quran/branches/BranchTree.tsx` computes node offsets and button
  variants. `AyahContext.tsx` replaces the previous Spellings disclosure, loads
  on demand, and presents the dialog. `AyahContext.module.css` styles its cards.
- `src/app/quizzes/BranchAnswers.tsx` preserves the correct offsets when feedback
  pairs an answer with a different subtree. Input trees suppress context.
- `src/components/quran/PageSpread.tsx` supports an optional current-ayah row.
  The shared Button `highlight` variant and paper palette supply amber styling.
  The existing Lucide dependency supplies the icons.

### Validation

- Keep unit coverage for shared marks, several differing marks and words,
  canonical combining-mark order, tatweel, more than two originals, and a
  display matching none of the originals. Verify unchanged grouping across the
  corpus, following Distillate record `namaq/0019-fixing-the-example-broke-the-ayah-next-door`.
- Independent source/API tests cover all 6,236 ayat, exact annotation marks,
  missing ayat, invalid keys, numeric ordering and deduplication, page boundaries,
  and both ends of surahs. Context loading must not query PostgreSQL or Neo4j.
- Component tests cover ordinary leaves, differing inner/opening/leaf nodes,
  all represented ayat, word offsets, next-ayah continuations, quiz input and
  feedback, translated labels, lazy loading, failures/retry, and scroll locking.
- Verify RTL layout, two-column and stacked cards, both themes, keyboard and
  backdrop dismissal, focus restoration, and background scroll lock in a browser.
- Run lint, TypeScript checking, the full Vitest suite, and the Next.js build.
  Complete the independent review cycle before updating PR 422.

### Data and scope

No database migration, store synchronization, source-text change, or graph
layout recomputation is required. Rebuilding `ayat.json` must remain identical.
The source is cached on the server, and the browser fetches only requested
context. The wider Lucide migration and opening-search hamza normalization remain
separate. No design blockers remain.

A page at `/quran/branches` that draws, as a word tree read right to left, the ayat that open with the same words and where their wording parts. إِنَّ ٱلۡمُتَّقِینَ is the example the owner gave: six ayat open with it, all continue with فِي, then three go on to جنات and split again.

## Data

- `npm run quran:branches` reads the 604 reader pages under `src/app/quran/read/data/`, the same text `/quran/read` shows, and writes every ayah that shares its opening with another ayah to `src/app/quran/branches/ayat.json`. It needs no database. Each entry holds the ayah key, its mushaf page and its words.
- The reader sets pause marks and the hizb sign ۞ beside a word, separated by a space. The build drops them, so the page shows words only. Openings and phrases compare words after `normalizeWord`, so diacritics and the alif and ya spellings do not separate two openings. The tree compares them with every mark, as the next section says.
- Two ayat share an opening when their first two words match. Every ayah has one opening, so the openings split the ayat into groups, and a group needs two ayat or more. The list is sorted by how many ayat a group holds.
- A و or ف joined to an ayah's first word does not separate its opening from the same opening without it, so يَطُوفُ عَلَيْهِمْ (56:17) and وَيَطُوفُ عَلَيْهِمْ (52:24, 76:19) form one group. The Quranic Arabic Corpus morphology (`data/quran/quranic-corpus-morphology-0.4.txt`) decides which letter is a prefix: the build marks an ayah `conj` when the corpus splits a `w:` or `f:` prefix off its first word, and stops if the reader's word does not start with that letter. The و of an oath (`w:P`, as in وَٱلْفَجْرِ) stays part of the word, and so does a letter that belongs to the word, as in وُجُوهٌ.
- Openings only. A shared phrase that starts inside an ayah is out of scope for now.

## Tree (`branch` in `src/lib/quran/branches.ts`)

- A node holds the words that every ayah under it shares from where its parent stopped. It stops at the first word where the ayat differ or where one of them ends.
- Two words are the same in the tree only when they carry the same marks. A word that differs in a mark starts its own node, such as لَهُمْ and لَهُمُ, or تَتَّخِذُوا۟ and تَتَّخِذُوٓا۟. The Quranic annotation signs U+06D6 to U+06ED (small high and low letters and pause signs, such as the low meem of iqlab in يُسْرًۭا, 94:6) are not marks for this purpose: Neither is a shadda on a word's first letter, which a word only carries over from the word or ayah before it, as مَّتَـٰعًۭا (80:32) after وَأَبًّۭا. Nor is a sukun on a word's last letter, which the text leaves out only where the next word assimilates it, as أَرَءَيْتُم before مَّا (46:4) and إِن before كَانَ, so لَهُمْ and لَهُم share a node while لَهُمُ keeps its own. يُسْرًا and يُسْرًۭا share a node. The shared display keeps marks common to every spelling at each letter and omits differing marks. Each leaf combines a TextSearch icon on the right with its references in one borderless context button. Its reference labels have no separate reader links. Nodes with multiple original spellings, including opening boxes, use amber on the context icon. Inner nodes use a filled amber button. The modal shows each represented ayah with its preceding and following ayat from the same surah. It preserves original marks, highlights differing words, orders cards by surah and ayah, and locks background scrolling. Quiz feedback uses the same overlay; quiz inputs keep it hidden. The phrases, their ids and the pieces still use normalized words, so `listPhrases` and `pieces` group on `phraseTree`, which splits only where the letters differ.
- An ayah that ends where another ayah of the group goes on continues into the next ayah of its surah, after a ﴿n﴾ marker, so it ends at a leaf. 56:17 ends after ولدان مخلدون while 76:19 goes on, so its leaf reads ﴿١٧﴾ بأكواب وأباريق وكأس من معين. The build writes the next ayah's words as `next` on the ayat that need it.
- An ayah that ends at a node is listed on that node. Two identical ayat, such as 15:45 and 51:15, end at the same leaf and share it.
- When the first-word variants use all the root’s words and the root holds no ayah references, omit its empty box and keep the connecting lines.
- Children keep mushaf order. First-word variants are ordered by the earliest ayah each contains, comparing surah number and then ayah number. Sorting the variants leaves the tree, leaf order and ayah membership unchanged.
- In a group whose first words are spelled differently, by a joined و or ف or only in their marks, the tree is built from the words after the first. The page draws each first word (يَطُوفُ, وَيَطُوفُ; أَن, وَإِن, فَإِن before كان) as its own node before the shared words, joined into them, and every ayah carries its first word as plain text in that node's colour, since one branch can hold ayat of both kinds. Each first word links to the tree of its own ayat (`?w=<first word>`), with a button back to the merged phrase. A branch whose ayat all carry the joined letter links to that spelling's phrase (واذ قال موسى لقومه inside the إذ قال tree). A group with one spelling of its first word is drawn as before.

## Page

- Applying the juz’ filter keeps an available phrase or chooses a default within the range, then redirects to a URL naming the displayed phrase. Explicit URLs requesting an unavailable phrase show a no-matches message and opening choices instead of a different tree.
- A phrase is an opening, or the words two or more ayat share up to a node where they part (`listPhrases`). Both the merged phrase (يطوف عليهم) and each spelling two ayat share (ويطوف عليهم) are phrases. `?o=<normalized phrase>` draws the tree of the ayat that start with it, such as `?o=الم تر كيف`. An unknown or missing value shows إن المتقين.
- Buttons for the eight largest openings. The one the shown phrase starts with is pressed.
- A search box over every phrase by normalized words, listing phrases that start with the search before those that only contain it. Enter opens the first.
- A branch in the tree links to its own phrase. A branch that exists only because its children differ in marks, such as اتقوا above رَبَّكُمُ and رَبَّكُمْ in the يا أيها الناس tree, is listed as a phrase for that link, and so is each branch of a first word's own tree. Leaves and the root do not link. The juz' range and the tree button keep a `?w=` spelling. Above a deeper tree, a button for each wider phrase it sits under leads back out.
- Leaf references use plain text links, with a visible dot between references when a leaf holds several ayat.
- Every ayah carries its surah name and number, linking to the reader page that holds it. Surah names come from the database, as on the reader.
- The page says a match is shared wording only.

## Juz' range and list

- `?juzFrom=&juzTo=` limits the page to the ayat inside those juz'. The groups, phrases, buttons, search and tree are rebuilt from those ayat alone, so an opening shared only with an ayah outside the range is not offered: with juz' 29 to 30, فلا أقسم opens four ayat and leaves out al-Waqi'ah 75. `src/lib/quran/juz.ts` places an ayah in its juz' by the juz' starting ayat, since four juz' start inside a page. The quiz on these openings uses the same file and the same parameters.
- `?v=list` lists pieces (`pieces` in `src/lib/quran/branches.ts`). A large tree is hard to ask about but its small branches are not, so each opening's tree is cut at the first node that holds six ayat or fewer (`PIECE_MAX`), and that node with everything under it is one piece. A node with more ayat is still one piece when no two of its ayat go on together past it (ويل يومئذ للمكذبين, eleven identical ayat). If those ayat differ in a joined و or ف, each spelling two ayat share is a piece of its own instead: فلا أقسم (five ayat) and لا أقسم (75:1, 90:1), leaving ولا أقسم (75:2) alone. A piece's `keys` are its ayat; its `id` is the phrase whose tree holds them, which for the bare spelling also takes in the others. Each ayah lands in at most one piece; an ayah that parts alone from a larger node is left to its opening's tree.
- Pieces are ordered by how many words their ayat share before they part, longest first, then by fewer ayat, then mushaf order. Each piece is drawn as its tree, and a piece cut from a larger opening names that opening and links to its whole tree. Twenty pieces to a page (`?p=`). Pagination scrolls to the page start after the page number changes, so the next or previous page opens at the beginning rather than retaining the old bottom scroll position.
- `?g=opening` folds the pieces under their openings instead, largest opening first, each with a link to its whole tree.
