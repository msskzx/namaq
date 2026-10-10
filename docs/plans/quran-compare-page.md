# Quran compare page

Status: built at `/quran/compare`. Builds on [the relations page](quran-relations-page.md).

The page sets two surahs side by side, Al-Waqi'ah and Al-Haqqah by default, and
`?a=7&b=26` picks any pair. `af`, `at`, `bf` and `bt` pick the first and last
ayah of each side (the whole surah by default, clamped to the surah and with
from at or below to), so one surah can be compared with itself, as in
`?a=55&af=46&at=61&b=55&bf=62&bt=77`. Alignment runs on the two slices and every
card keeps its real ayah number. It reads the stored `Ayah` rows on each request, so
it needs no table, migration or generated file.

## How the pairs are found

`src/lib/quran/compare.ts` works on normalized words (see `normalize.ts`).

1. Each pair of ayat scores the square of its longest run of shared words, and
   only runs of two words or more score.
2. An order-preserving dynamic program picks the highest-scoring set of pairs
   that never crosses itself. These are the anchors. An anchor with a run of
   four words or more that sits within five ayat of an earlier anchor on the
   same diagonal (same offset between the two surahs) scores 32 extra, so a
   refrain repeated at a fixed offset keeps its parallel alignment instead of
   shifting to chase one longer shared phrase. Al-Rahman 46-61 against 62-77
   comes out as sixteen pairs in step; without the bonus it shifted by two.
   Afterwards, a pair with a run of four or more that is next to an anchor on
   one side (the same ayah on one side, the neighbouring ayah on the other) and
   keeps the order is added as a second link, so 57:1 and 57:2 both pair with
   64:1.
3. Consecutive anchors join one block when both surahs step the same number of
   ayat between them and that number is five or fewer. A block stays if it has
   two anchors, or one anchor whose run is four words or more.
4. Every ayah between a block's first and last anchor is paired in step with its
   partner. A pair that shares no word says so. A block also takes the ayah
   just before its first anchor when it shares a word with its partner (55:46
   with 55:62 share «جنتان»), unless an earlier block already holds it.
5. The last five ayat of each surah form a separate block aligned by count. It
   claims nothing from the text, and each pair in it shows what it shares. Anchors
   that fall in those ayat belong to it, and the rest of their block stays. When
   either side is a range the count block is left out.
6. Ayat between blocks collapse into one row with both counts.

Words the two ayat share are colored, from the same word alignment the
relations page uses. A pair with no shared word colors nothing.

An ayah is shown once. When it has several counterparts, the pairs that share
an ayah form a group: one card on that side, the counterparts stacked on the
other (side by side on a wide screen, one after the other on a phone). Each link
gets a text color (amber, sky, emerald, rose, violet), used for the shared words
on both the single card and the counterpart; a word shared with two links takes
the first link's color. A group of one link is amber, as before.

## Known limits

- A repeated formula pairs with one of its occurrences. The diagonal bonus keeps a
  steady offset but the constant 32 was set by hand on three pairs of surahs.
- Aligning 2 with 3 (286 by 200 ayat) takes about 140 ms, almost all of it the
  run table, which the extra links and the bonus barely touch.
- The thresholds (two words, five ayat, four-word run) are per pair of ayat and
  are printed on the page.
- A single shared word is shown but never anchors a pair.

## Pinned results

On the stored text: 56:75-80 with 69:38-43 (56:80 and 69:43 share
«تنزيل من رب العالمين»), and the count block 56:92-96 with 69:48-52, where only
56:96 and 69:52 share a phrase («فسبح باسم ربك العظيم»). A fixture of surahs 56,
69, 15 and 38 sits beside the tests; 15:28-40 with 38:71-83 comes out as a block.

Also pinned: 57:1 and 57:2 both pair with 64:1 and 64:1 is shown once; 7 with 26
gains only 7:123 and 7:124 against 26:49; 15 with 38 gains nothing; 55:46-61 with
55:62-77 gives sixteen pairs in step, 46 with 62 through 61 with 77. The fixture
also holds surahs 7, 26, 55, 57 and 64.
