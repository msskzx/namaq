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

### Context on every node (2026-10-24)

The owner chose these rules after PR 427.

- Every node and every first-word box has a context button. An inner node opens
  every ayah under it. A leaf opens its own ayat first, then a section with every
  other ayah under the same parent.
- The dialog uses the compare page's marks and no other style. Words of the
  opened node take the accent mark in each of its own cards. Words that differ
  only in their marks take the purple root mark, since they are the same word
  in another form.
- When the originals of a node differ in their marks, the dialog lists each
  version at the top with its ayah count, before any card, with the differing
  words in the purple root mark.
- In a leaf dialog each sibling ayah is compared with the leaf's first ayah by
  the compare page's rule (`pairOf` with `wordKeys.json`). Words the leaf ayah
  lacks take the accent mark and same-root words the purple mark, with the
  compare legend. Sibling cards carry no node marks. `/api/quran/context?vs=<key>`
  adds this comparison. `vs` must be one of the requested keys, and a request
  holds at most 200 keys. The leaf's own ayat are never compared. Inner-node
  dialogs skip the comparison, since a root node can hold dozens of ayat.
- Each context button is named after its node's words.
- قَالَ رَبِّى stays out of the قال رب tree. The ي is a written letter, so it
  fails the same-letters rule.

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
- The reader sets pause marks and the hizb sign ۞ beside a word, separated by a space. The build drops them, so the page shows words only. Openings and phrases compare words after `normalizeWord`, so diacritics and the alif and ya spellings do not separate two openings. The tree adds the lemma, as the next section says.
- Two ayat share an opening when their first two words match. Every ayah has one opening, so the openings split the ayat into groups, and a group needs two ayat or more. The list is sorted by how many ayat a group holds.
- A و or ف joined to an ayah's first word does not separate its opening from the same opening without it, so يَطُوفُ عَلَيْهِمْ (56:17) and وَيَطُوفُ عَلَيْهِمْ (52:24, 76:19) form one group. The Quranic Arabic Corpus morphology (`data/quran/quranic-corpus-morphology-0.4.txt`) decides which letter is a prefix: the build marks an ayah `conj` when the corpus splits a `w:` or `f:` prefix off its first word, and stops if the reader's word does not start with that letter. The و of an oath (`w:P`, as in وَٱلْفَجْرِ) stays part of the word, and so does a letter that belongs to the word, as in وُجُوهٌ.
- Openings only. A shared phrase that starts inside an ayah is out of scope for now.

## Tree (`branch` in `src/lib/quran/branches.ts`)

- A node holds the words that every ayah under it shares from where its parent stopped. It stops at the first word where the ayat differ or where one of them ends.
- Two words are the same word, and share a node, when they have the same letters after `normalizeWord`, the same root, and either the same corpus lemma (`LEM`) or the same spelling. Their marks do not decide it: رَبِّ and رَبُّ, ٱللَّهُ and ٱللَّهَ, لَهُم and لَهُمُ, إِنِّى and إِنِّىٓ, مُوسَى and مُوسَىٰ, مَا and مَآ, كَذَٰلِكَ and كَذَٰلِكِ, and تَتَّخِذُوا۟ and تَتَّخِذُوٓا۟ each share a node. Words with the same letters and root but different lemmas stay apart: إِن and إِنَّ, أَن and إِن, مَن and مِن, خَلَقَ and خَـٰلِقُ, صَدَّقَ and صَدَقَ. Identical spellings never split, even where the corpus gives them different lemmas (إِذَا and إِذَا الفجائية). The aim is memorisation: a reader never types the same letters into two sibling branches unless the words differ. The build stores each word's lemma in `ayat.json` beside its root. The shared display keeps marks common to every spelling at each letter and omits differing marks, so قَالَ رَبِّ and قَالَ رَبُّ show as قَالَ رَبّ. Each leaf combines a TextSearch icon on the right with its references in one borderless context button. Its reference labels have no separate reader links. Nodes with multiple original spellings, including opening boxes, use amber on the context icon. Inner nodes use a filled amber button. The modal shows each represented ayah with its preceding and following ayat from the same surah. It preserves original marks, highlights differing words, orders cards by surah and ayah, and locks background scrolling. Quiz feedback uses the same overlay; quiz inputs keep it hidden. The tree, the phrases, the pieces and the quiz all use this rule, so a piece is cut where the page draws a split. A phrase id is letters only, so two pieces that part by lemma at their last word, such as يا أيها الذين آمنوا إِن and إِنَّ, share one id and its link opens both; the quiz keeps their keys apart by adding the first ayah.
- An ayah that ends where another ayah of the group goes on continues into the next ayah of its surah, after a ﴿n﴾ marker, so it ends at a leaf. 56:17 ends after ولدان مخلدون while 76:19 goes on, so its leaf reads ﴿١٧﴾ بأكواب وأباريق وكأس من معين. The build writes the next ayah's words as `next` on the ayat that need it.
- An ayah that ends at a node is listed on that node. Two identical ayat, such as 15:45 and 51:15, end at the same leaf and share it.
- When the first-word variants use all the root’s words and the root holds no ayah references, omit its empty box and keep the connecting lines.
- Children keep mushaf order. First-word variants are ordered by the earliest ayah each contains, comparing surah number and then ayah number. Sorting the variants leaves the tree, leaf order and ayah membership unchanged.
- In a group whose first words are different words, by a joined و or ف or by their lemma, the tree is built from the words after the first. The page draws each first word (يَطُوفُ, وَيَطُوفُ; أَن, وَإِن, فَإِن before كان) as its own node before the shared words, joined into them, and every ayah carries its first word as plain text in that node's colour, since one branch can hold ayat of both kinds. Each first word links to the tree of its own ayat (`?w=<first word>`), with a button back to the merged phrase. A branch whose ayat all carry the joined letter links to that spelling's phrase (واذ قال موسى لقومه inside the إذ قال tree). A group with one spelling of its first word is drawn as before.

## Browse and search journey

The [journey handoff](quran-branches-journey.md) records the agreed design and acceptance criteria.

- `/quran/branches` opens ten expanded entries per page, longest shared phrase first. A segmented control switches to grouping by opening, still ten entries per page. Opening headings repeat when their entries continue onto another page.
- Typing updates up to ten phrase suggestions without filtering the browsing list or writing draft text to the URL. Prefix matches come before substring matches. Arrow keys choose a suggestion and Enter opens it. Search tolerates hamza spelling differences on both query and candidates; displayed text and phrase IDs retain the source spelling.
- `?o=<normalized phrase>` opens a complete phrase tree, with search and juz controls available. Return restores the previous ordering, page, and range. Unknown or unavailable phrases show a message instead of silently opening another phrase.
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
