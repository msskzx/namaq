# Shared ayah openings

> Superseded by [ADR 0034](../adr/0034-one-inventory-defines-quran-branch-trees.md). Openings and inside-ayah phrases now belong to one tree inventory.

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

### Context on every node (2026-10-24)

The owner chose these rules after PR 427.

- Every node and every first-word box has a context button. An inner node opens
  every ayah under it. A leaf opens its own ayat first, then every other ayah
  under the same parent, all in one grid. A first-word box does the same with
  the ayat of the other first words, since they share its child. The cards of
  the opened branch say so in their subtitle. Cards side by side share their
  rows like the compare page's facing pages, so the target ayat line up. A
  missing neighbour keeps its empty row.
- The dialog uses the compare page's marks and no other style. Words that
  differ only in their marks take the purple root mark, since they are the
  same word in another form.
- When the originals of a node differ in their marks, the dialog lists each
  version at the top with its ayah count, before any card, with the differing
  words in the purple root mark.
- Every dialog with two or more ayat marks the intersection: only words found
  in every ayah it shows (2026-10-24, owner's rule). Words are matched by the
  compare page's keys (`wordKeys.json`), wherever they fall. A word repeated in
  one ayah counts as many times as the ayah that has it least. A shared word
  with the same spelling (`spell`) in every ayah takes the accent mark. A word
  found in all of them, but in at least one only by root or with other marks
  (رَبِّ and رَبُّ), takes the purple mark. A word missing from any ayah
  stays plain. Only the target ayah is marked, so the rows before and after
  stay unmarked.
  `/api/quran/context` adds this to every request with two or more keys. A
  request holds at most 200 keys (the largest opening group has 90 ayat).
- Each context button is named after its node's words.
- قَالَ رَبِّى stays out of the قال رب tree. The ي is a written letter, so it
  fails the same-letters rule.

### Surrounding ayat (2026-10-24)

The owner chose these rules from a sketch.

- Each tree on `/quran/branches` has a switch, «الآيات المحيطة», off by
  default. On the single tree page it is kept in the address as `c=1`, and tree
  links keep it. Trees in the list keep their own switch and leave the address
  alone. The quiz has no switch yet; it may come later as a hint.
- With the switch on, every ayah of the tree gets the ayah before it, in a box
  before the first-word boxes (or before the root when there are none), and the
  ayah after it, in a box after the node where the ayah ends. The whole ayah is
  shown, with its own reference and nothing else.
- When a leaf already runs into the next ayah (56:17 into 56:18), the next box
  shows the ayah after that one (56:19).
- The boxes cross into the neighbouring surah. Hafs is the reading, so the
  basmala sits between the two surahs in the same box: after the previous
  surah's last ayah, or before the next surah's first ayah. At-Tawbah has no
  basmala. Nothing comes before 1:1 or after 114:6.
- A neighbour that is itself an ayah of the tree carries «في هذه الشجرة», a
  link to its node. The tree is not redrawn as a chain.
- The boxes are dashed and muted. Their path button lights the path in
  the accent colour: its first-word box, the nodes down to its ayah, the lines
  between them, and its other box. Paths light only from the button, never on
  hover or focus (hover lit paths by accident on phones).
- `/api/quran/surrounding?before=<keys>&after=<keys>` returns the neighbours
  from the reader corpus, at most 400 keys per request.

### Chapter opening families (2026-10-25)

Known chapter letter openings can form a shared opening even when they are
one word. The حم group includes الشورى, one of the seven الحواميم.
Standalone letter ayat continue into the next ayah in the tree, retaining
both references. Ordinary أَلَمْ verses keep the usual two-word rule.

Named families are available through navigation, search suggestions, search
results and the opening list. Their membership is explicit in
`src/lib/quran/chapterFamilies.ts`: الحواميم، الطواسين، الميمات، الراءات،
الحامدات and المسبحات. A separate broader الم prefix group includes الأعراف
and الرعد; it does not redefine membership of الميمات or الراءات.
الحامدات starts الفاتحة at 1:2, after its basmala. Membership is filtered
by the selected juz range, and at least two members are required.

المسبحات uses the seven-surah definition, including الإسراء and الأعلى.
[The six- and seven-surah definitions are discussed here](https://www.shuwaier.com/storage/contents/books/nSOSjbOdz5SyhIVN9zb5fTeoueGmPKg2b5ojks4r.pdf).
The [الطواسين family](https://audio.islamweb.net/audio/Fulltxt.php?audioid=182170)
includes النمل's طس alongside طسم. The names الميمات and الراءات are used
[in tafsir discussions](https://dohaini.com/?tag=فواتح-السور), with الرعد
included in الراءات despite its المر opening.

Family names label navigation and entries, never Quran tree nodes. Family
trees retain their actual first words and significant vowels, so سَبَّحَ
and سَبِّحِ form separate branches even when their morphology shares a lemma.
A family with no common first word begins directly with its Quran branches.
The generated corpus includes each family's opening ayat once, even when
families overlap. Ordinary shared wording and quiz selection retain their
existing matching rules.

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

- `npm run quran:branches` reads the 604 reader pages under `src/app/quran/read/data/`, the same text `/quran/read` shows, and writes every ayah that shares its opening with another ayah to `src/app/quran/branches/ayat.json`. It needs no database. Each entry holds the ayah key, its page in the 1441 mushaf under `src/app/quran/read/mushaf/` (the one `/quran/read` shows) and its words.
- The reader sets pause marks and the hizb sign ۞ beside a word, separated by a space. The build drops them, so the page shows words only. Openings and phrases compare words after `normalizeWord`, so diacritics and the alif and ya spellings do not separate two openings. The tree adds the lemma, as the next section says.
- Two ayat share an opening when their first two words match. Every ayah has one opening, so the openings split the ayat into groups, and a group needs two ayat or more. The list is sorted by how many ayat a group holds.
- A و or ف joined to an ayah's first word does not separate its opening from the same opening without it, so يَطُوفُ عَلَيْهِمْ (56:17) and وَيَطُوفُ عَلَيْهِمْ (52:24, 76:19) form one group. The Quranic Arabic Corpus morphology (`data/quran/quranic-corpus-morphology-0.4.txt`) decides which letter is a prefix: the build marks an ayah `conj` when the corpus splits a `w:` or `f:` prefix off its first word, and stops if the reader's word does not start with that letter. The و of an oath (`w:P`, as in وَٱلْفَجْرِ) stays part of the word, and so does a letter that belongs to the word, as in وُجُوهٌ.
- Openings only. A shared phrase that starts inside an ayah is out of scope for now.

## Tree (`branch` in `src/lib/quran/branches.ts`)

- A node holds the words that every ayah under it shares from where its parent stopped. It stops at the first word where the ayat differ or where one of them ends.
- Two words are the same word, and share a node, when they have the same letters after `normalizeWord`, the same root, and either the same corpus lemma (`LEM`) or the same spelling. Their marks do not decide it: رَبِّ and رَبُّ, ٱللَّهُ and ٱللَّهَ, لَهُم and لَهُمُ, إِنِّى and إِنِّىٓ, مُوسَى and مُوسَىٰ, مَا and مَآ, كَذَٰلِكَ and كَذَٰلِكِ, and تَتَّخِذُوا۟ and تَتَّخِذُوٓا۟ each share a node. Words with the same letters and root but different lemmas stay apart: إِن and إِنَّ, أَن and إِن, مَن and مِن, خَلَقَ and خَـٰلِقُ, صَدَّقَ and صَدَقَ. Identical spellings never split, even where the corpus gives them different lemmas (إِذَا and إِذَا الفجائية). The aim is memorisation: a reader never types the same letters into two sibling branches unless the words differ. The build stores each word's lemma in `ayat.json` beside its root. The shared display keeps marks common to every spelling at each letter and omits differing marks, so قَالَ رَبِّ and قَالَ رَبُّ show as قَالَ رَبّ. Each leaf combines a TextSearch icon on the right with its references in one borderless context button. Its reference labels have no separate reader links. Nodes with multiple original spellings, including opening boxes, use amber on the context icon. Inner nodes use a filled amber button. The modal shows each represented ayah with its preceding and following ayat from the same surah. It preserves original marks, highlights differing words, orders cards by surah and ayah, and locks background scrolling. Quiz feedback uses the same overlay; quiz inputs keep it hidden. The tree, the phrases, the pieces and the quiz all use this rule, so a piece is cut where the page draws a split. A phrase id is letters only, so two pieces that part by lemma at their last word, such as يا أيها الذين آمنوا إِن and إِنَّ, share one id and its link opens both; the quiz keeps their keys apart by adding the first ayah.
- An ayah that ends where another ayah of the group goes on continues into the next ayah of its surah, after a ﴿n﴾ marker, so it ends at a leaf. 56:17 ends after ولدان مخلدون while 76:19 goes on, so its leaf reads ﴿١٧﴾ بأكواب وأباريق وكأس من معين. The build writes the next ayah's words as `next` on the ayat that need it.
- Identical ayat (same words by the rule above) each run on into the ayat after them, ayah by ayah, until their runs part, with no limit on how many ayat that takes. The question a reader faces with an identical ayah is what comes after it here. فسبح باسم ربك العظيم (56:74, 56:96, 69:52) splits into فلا أقسم, سبح لله and سأل سائل; 23:5 and 70:29 run four ayat before they part. Runs cross surahs: after a surah's last ayah comes the next surah's first ayah, never the basmala. 96 groups (276 ayat) do this. The build writes the whole run as `next`, with a ﴿n﴾ marker between its ayat, and the last ayah of the run as `through`. Where runs end on different ayah numbers, their shared node shows a plain ۝ instead of ﴿n﴾. A node past an ayah end links through its matching inside-ayah phrase and scopes that tree to the node's exact occurrences. The surrounding-ayat box after such a leaf shows the ayah after `through`.
- The long refrains of one surah (فبأي آلاء ربكما تكذبان 31 times in ar-Rahman, ويل يومئذ للمكذبين in al-Mursalat) grow on the page, leaves in ayah order, but are never quiz questions: their pieces are larger than `PIECE_MAX`.
- An ayah that ends at a node is listed on that node.
- When the first-word variants use all the root’s words and the root holds no ayah references, omit its empty box and keep the connecting lines.
- Children keep mushaf order. First-word variants are ordered by the earliest ayah each contains, comparing surah number and then ayah number. Sorting the variants leaves the tree, leaf order and ayah membership unchanged.
- In a group whose first words are different words, by a joined و or ف or by their lemma, the tree is built from the words after the first. The page draws each first word (يَطُوفُ, وَيَطُوفُ; أَن, وَإِن, فَإِن before كان) as its own node before the shared words, joined into them, and every ayah carries its first word as plain text in that node's colour, since one branch can hold ayat of both kinds. Each first word links to the tree of its own ayat (`?w=<first word>`), with a button back to the merged phrase. A branch whose ayat all carry the joined letter links to that spelling's phrase (واذ قال موسى لقومه inside the إذ قال tree). A group with one spelling of its first word is drawn as before.

## Browse and search journey

The [journey handoff](quran-branches-journey.md) records the agreed design and acceptance criteria.

- `/quran/branches` opens ten expanded entries per page, longest shared phrase first. A segmented control switches to grouping by opening, still ten entries per page. Opening headings repeat when their entries continue onto another page.
- Typing updates up to ten phrase suggestions without filtering the browsing list or writing draft text to the URL. Prefix matches come before substring matches. Arrow keys choose a suggestion and Enter opens it. Search tolerates hamza spelling differences on both query and candidates; displayed text and phrase IDs retain the source spelling.
- `?o=<normalized phrase>` opens a complete phrase tree, with search and juz controls available. Return restores the previous ordering, page, and range. Unknown or unavailable phrases show a message instead of silently opening another phrase.
- Every tree initially fits within its available viewport, including browse cards and quiz trees. Its toolbar can restore the fitted view, zoom in or out, or return to actual size; overflow remains scrollable after zooming.
- The eight popular-opening shortcuts and links through deeper or broader phrases remain available. `?w=` retains first-word spelling selection. Leaf context buttons retain PR 422's cards and exact reader destinations.
- An ambiguous phrase URL offers vocalized choices with ayah counts. Generated links use `r` to identify the root-compatible group when needed. In particular, `قال رب اني` distinguishes أَنَّىٰ from إِنِّي.
- `?juzFrom=&juzTo=` limits the dataset by actual juz boundaries, including boundaries inside reader pages. The range applies automatically after a short typing pause when both values are integers from 1 to 30 and From is no greater than To. Invalid drafts keep the last applied results with an inline explanation. Range and ordering changes reset pagination.
- New links omit `v=list`. Legacy list URLs redirect to browsing with their ordering, page, and juz range, dropping their formerly unused phrase. Browser navigation restores committed state.

## Root guard

A wording match additionally requires corresponding words to have the same roots, or both have no root. One rooted word and one rootless word do not match. Particle identity and grammatical role impose no extra restrictions. A common root alone never joins different normalized words.

This separates فَمَنَّ ٱللَّهُ at 52:27 from مِّنَ ٱللَّهِ at 70:3. It preserves قل أرأيتم إن كان من عند الله in 41:52 and 46:10. The guard applies to longer shared phrases as well as openings. Display continues to follow the shared-mark rules above; search uses its more tolerant comparison without changing group membership.

The build reads word roots from STEM annotations in `data/quran/quranic-corpus-morphology-0.4.txt`, verifies annotation coverage, and includes the root metadata in `ayat.json`. Missing annotation is an error; an annotated STEM without a ROOT is rootless. The same metadata drives runtime grouping, pieces, and generated quiz questions. Reader text remains the source of displayed words.

## Pieces and pagination

Each opening's tree is cut at the first node holding six ayat or fewer. A larger node stays one piece when none of its children contains two ayat. A larger group with multiple joined-first-word spellings is split into spellings that each hold at least two ayat. A singleton branch stays visible in its full opening tree.

Pieces sort by longest shared phrase, then fewer ayat, then mushaf order. Grouped ordering places pieces under their opening before pagination. Each page contains ten expanded pieces. Pagination scrolls to the page start after a page change. A piece cut from a larger opening offers a link to that opening's full tree.

## Phrases inside ayat

The phrase-tree extension uses the existing multiple-start presentation. Whole
prefixes on the right join a shared phrase; its continuations branch left.
An occurrence with no prefix shows its preceding ayah instead. With surrounding
ayat enabled, that branch adds one more preceding ayah before it. At a surah
boundary, omit unavailable context and identify the start of the surah.
The original opening artifact and the Shared openings quiz keep their membership.

`npm run quran:branches` also generates `phrases.json` from every reader ayah,
with corpus roots and lemmas. A two-word run requires a root on both words;
a longer run may include rootless words. At least two distinct ayat must share
the run, and at least one occurrence must be inside its ayah. Phrase-only
comparison folds hamza seats and otherwise follows the existing normalized
letters, root, and spelling-or-lemma word classes. A longer containing run with
the same ayah membership replaces its shorter run. Unrelated phrases in the
same ayat remain distinct.

Occurrences retain their original word offsets. When a phrase occurs more than
once in one ayah, presentation anchors at the earliest occurrence and preserves
the complete ayah in its prefix and continuation; matching retains all occurrences.
Original spellings remain available in context. Large groups are cut into
entries of at most six ayat. The scope switch selects all entries, openings,
or inside phrases; phrase selections carry their kind in the URL.

See [the implementation plan](quran-phrase-trees.md) for acceptance criteria.

Before al-Fatiha, tree context wraps to an-Nas 6. For الحمد لله at 1:2,
the preceding box includes an-Nas 6 followed by the basmala. Before 1:1,
the preceding box contains an-Nas 6 without repeating the basmala. An extra
backward step follows the actual preceding reference, including this wrap.
