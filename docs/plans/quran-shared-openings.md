# Shared ayah openings

A page at `/quran/branches` that draws, as a word tree read right to left, the ayat that open with the same words and where their wording parts. إِنَّ ٱلۡمُتَّقِینَ is the example the owner gave: six ayat open with it, all continue with فِي, then three go on to جنات and split again.

## Data

- `npm run quran:branches` reads the 604 reader pages under `src/app/quran/read/data/`, the same text `/quran/read` shows, and writes every ayah that shares its opening with another ayah to `src/app/quran/branches/ayat.json`. It needs no database. Each entry holds the ayah key, its mushaf page and its words.
- The reader sets pause marks and the hizb sign ۞ beside a word, separated by a space. The build drops them, so the page shows words only. A word is compared after `normalizeWord`, so diacritics and the alif and ya spellings do not separate two words.
- Two ayat share an opening when their first two words match. Every ayah has one opening, so the openings split the ayat into groups, and a group needs two ayat or more. The list is sorted by how many ayat a group holds.
- A و or ف joined to an ayah's first word does not separate its opening from the same opening without it, so يَطُوفُ عَلَيْهِمْ (56:17) and وَيَطُوفُ عَلَيْهِمْ (52:24, 76:19) form one group. The Quranic Arabic Corpus morphology (`data/quran/quranic-corpus-morphology-0.4.txt`) decides which letter is a prefix: the build marks an ayah `conj` when the corpus splits a `w:` or `f:` prefix off its first word, and stops if the reader's word does not start with that letter. The و of an oath (`w:P`, as in وَٱلْفَجْرِ) stays part of the word, and so does a letter that belongs to the word, as in وُجُوهٌ.
- Openings only. A shared phrase that starts inside an ayah is out of scope for now.

## Tree (`branch` in `src/lib/quran/branches.ts`)

- A node holds the words that every ayah under it shares from where its parent stopped. It stops at the first word where the ayat differ or where one of them ends.
- An ayah that ends at a node is listed on that node. Two identical ayat, such as 15:45 and 51:15, end at the same leaf and share it.
- Children keep mushaf order.
- In a group whose ayat differ in that joined letter, the tree is built from the words without it. The page draws each first word (يَطُوفُ, وَيَطُوفُ) as its own node before the shared words, joined into them, and every ayah carries a tag with its first word in that node's colour, since one branch can hold ayat of both kinds. A first word two ayat share links to the tree of those ayat alone, and so does a branch whose ayat all carry the letter (واذ قال موسى لقومه inside the إذ قال tree). A group whose ayat all have the letter, or all lack it, is drawn as before.

## Page

- A phrase is an opening, or the words two or more ayat share up to a node where they part (`listPhrases`). Both the merged phrase (يطوف عليهم) and each spelling two ayat share (ويطوف عليهم) are phrases. `?o=<normalized phrase>` draws the tree of the ayat that start with it, such as `?o=الم تر كيف`. An unknown or missing value shows إن المتقين.
- Buttons for the eight largest openings. The one the shown phrase starts with is pressed.
- A search box over every phrase by normalized words, listing phrases that start with the search before those that only contain it. Enter opens the first.
- A branch in the tree links to its own phrase. Leaves and the root do not. Above a deeper tree, a button for each wider phrase it sits under leads back out.
- Every ayah carries its surah name and number, linking to the reader page that holds it. Surah names come from the database, as on the reader.
- The page says a match is shared wording only.

## Juz' range and list

- `?juzFrom=&juzTo=` limits the page to the ayat inside those juz'. The groups, phrases, buttons, search and tree are rebuilt from those ayat alone, so an opening shared only with an ayah outside the range is not offered: with juz' 29 to 30, فلا أقسم opens four ayat and leaves out al-Waqi'ah 75. `src/lib/quran/juz.ts` places an ayah in its juz' by the juz' starting ayat, since four juz' start inside a page. The quiz on these openings uses the same file and the same parameters.
- `?v=list` shows every shared opening in the range as a list, largest first, thirty to a page, each with its ayat and a link to its tree.
