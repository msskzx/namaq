# Shared ayah openings

A page at `/quran/branches` that draws, as a word tree read right to left, the ayat that open with the same words and where their wording parts. إِنَّ ٱلۡمُتَّقِینَ is the example the owner gave: six ayat open with it, all continue with فِي, then three go on to جنات and split again.

## Data

- `npm run quran:branches` reads the 604 reader pages under `src/app/quran/read/data/`, the same text `/quran/read` shows, and writes every ayah that shares its opening with another ayah to `src/app/quran/branches/ayat.json`. It needs no database. Each entry holds the ayah key, its mushaf page and its words.
- The reader sets pause marks and the hizb sign ۞ beside a word, separated by a space. The build drops them, so the page shows words only. A word is compared after `normalizeWord`, so diacritics and the alif and ya spellings do not separate two words.
- Two ayat share an opening when their first two words match. Every ayah has one opening, so the openings split the ayat into groups, and a group needs two ayat or more. The list is sorted by how many ayat a group holds.
- Openings only. A shared phrase that starts inside an ayah is out of scope for now.

## Tree (`branch` in `src/lib/quran/branches.ts`)

- A node holds the words that every ayah under it shares from where its parent stopped. It stops at the first word where the ayat differ or where one of them ends.
- An ayah that ends at a node is listed on that node. Two identical ayat, such as 15:45 and 51:15, end at the same leaf and share it.
- Children keep mushaf order.

## Page

- A phrase is an opening, or the words two or more ayat share up to a node where they part (`listPhrases`). `?o=<normalized phrase>` draws the tree of the ayat that start with it, such as `?o=الم تر كيف`. An unknown or missing value shows إن المتقين.
- Buttons for the eight largest openings. The one the shown phrase starts with is pressed.
- A search box over every phrase by normalized words, listing phrases that start with the search before those that only contain it. Enter opens the first.
- A branch in the tree links to its own phrase. Leaves and the root do not. Above a deeper tree, a button for each wider phrase it sits under leads back out.
- Every ayah carries its surah name and number, linking to the reader page that holds it. Surah names come from the database, as on the reader.
- The page says a match is shared wording only.
