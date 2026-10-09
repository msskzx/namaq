# Quran compare page

Status: built at `/quran/compare`. Builds on [the relations page](quran-relations-page.md).

The page sets two surahs side by side, Al-Waqi'ah and Al-Haqqah by default, and
`?a=7&b=26` picks any pair. It reads the stored `Ayah` rows on each request, so
it needs no table, migration or generated file.

## How the pairs are found

`src/lib/quran/compare.ts` works on normalized words (see `normalize.ts`).

1. Each pair of ayat scores the square of its longest run of shared words, and
   only runs of two words or more score.
2. An order-preserving dynamic program picks the highest-scoring set of pairs
   that never crosses itself. These are the anchors.
3. Consecutive anchors join one block when both surahs step the same number of
   ayat between them and that number is five or fewer. A block stays if it has
   two anchors, or one anchor whose run is four words or more.
4. Every ayah between a block's first and last anchor is paired in step with its
   partner. A pair that shares no word says so.
5. The last five ayat of each surah form a separate block aligned by count. It
   claims nothing from the text, and each pair in it shows what it shares. Anchors
   that fall in those ayat belong to it, and the rest of their block stays.
6. Ayat between blocks collapse into one row with both counts.

Words the two ayat share are colored, one color per word, from the same word alignment the
relations page uses. A pair with no shared word colors nothing.

## Known limits

- A repeated formula pairs arbitrarily with any of its occurrences.
- The thresholds (two words, five ayat, four-word run) are per pair of ayat and
  are printed on the page.
- A single shared word is shown but never anchors a pair.

## Pinned results

On the stored text: 56:75-80 with 69:38-43 (56:80 and 69:43 share
«تنزيل من رب العالمين»), and the count block 56:92-96 with 69:48-52, where only
56:96 and 69:52 share a phrase («فسبح باسم ربك العظيم»). A fixture of surahs 56,
69, 15 and 38 sits beside the tests; 15:28-40 with 38:71-83 comes out as a block.
