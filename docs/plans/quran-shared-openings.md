# Shared ayah openings

A page at `/quran/branches` that draws, as a word tree read right to left, the ayat that open with the same words and where their wording parts. إِنَّ ٱلۡمُتَّقِینَ is the example the owner gave: six ayat open with it, all continue with فِي, then three go on to جنات and split again.

## Data

- `npm run quran:branches` reads the 604 reader pages under `src/app/quran/read/data/`, the same text `/quran/read` shows, and writes every ayah that shares its opening with another ayah to `src/app/quran/branches/ayat.json`. It needs no database. Each entry holds the ayah key, its mushaf page and its words.
- The reader sets pause marks and the hizb sign ۞ beside a word, separated by a space. The build drops them, so the page shows words only. Openings and phrases compare words after `normalizeWord`, so diacritics and the alif and ya spellings do not separate two openings. The tree compares them with every mark, as the next section says.
- Two ayat share an opening when their first two words match. Every ayah has one opening, so the openings split the ayat into groups, and a group needs two ayat or more. The list is sorted by how many ayat a group holds.
- A و or ف joined to an ayah's first word does not separate its opening from the same opening without it, so يَطُوفُ عَلَيْهِمْ (56:17) and وَيَطُوفُ عَلَيْهِمْ (52:24, 76:19) form one group. The Quranic Arabic Corpus morphology (`data/quran/quranic-corpus-morphology-0.4.txt`) decides which letter is a prefix: the build marks an ayah `conj` when the corpus splits a `w:` or `f:` prefix off its first word, and stops if the reader's word does not start with that letter. The و of an oath (`w:P`, as in وَٱلْفَجْرِ) stays part of the word, and so does a letter that belongs to the word, as in وُجُوهٌ.
- Openings only. A shared phrase that starts inside an ayah is out of scope for now.

## Tree (`branch` in `src/lib/quran/branches.ts`)

- A node holds the words that every ayah under it shares from where its parent stopped. It stops at the first word where the ayat differ or where one of them ends.
- Two words are the same in the tree only when they carry the same marks. A word that differs in any mark starts its own node, even a mark that changes with the next word, such as لَهُمْ, لَهُمُ and لَهُم, or تَتَّخِذُوا۟ and تَتَّخِذُوٓا۟. The phrases, their ids and the pieces still use normalized words, so `listPhrases` and `pieces` group on `phraseTree`, which splits only where the letters differ.
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
