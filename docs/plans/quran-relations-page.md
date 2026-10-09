# Quran relations demo page

Status: first version built at `/quran`. The prophet-story section is the next PR.

The owner wants one demo page with visualizations and numbers about the Quran,
above all relations between ayat and stories about one prophet told in several
surahs. This first version covers the first interest from the text alone. The
second needs sourced data and is planned below.

## What data exists

| Data | Where | Count |
| --- | --- | --- |
| Surahs | `surahs` (`Surah`) | 114, all `HAFS` |
| Ayat, vowelled text | `ayahs` (`Ayah`) | 6,236, all `HAFS` |
| Person-to-ayah links | `_PersonAyahs`, from `ayat:` in `data/catalog/people/*.ts` | 42 links, 33 ayat, 18 people |

Nothing links one ayah to another, and no prophet other than Muhammad has a
person entry, so the existing links cannot say where a prophet's story is told.
`chart.js` is in `package.json` but nothing imports it, so the page draws SVG.

The stored text is Uthmani script in the Tanzil style, with the basmala prepended
to the first ayah of every surah except Al-Fatiha and At-Tawbah. It has Quranic
annotation marks, a Persian yeh, and a split superscript alef in a few words.
It has not been compared with a reference mushaf: Tanzil is not in the repo and
the build runs offline, so that check is still owed.

## What the page shows

- **Numbers.** Four tiles (surahs, ayat, shared passages, surahs involved) and a
  bar for the ayat count of each surah. Meccan and Medinan are not shown: the
  field is imported and uncited.
- **Shared passages.** An arc diagram over the 114 surahs in mushaf order, one
  arc per passage. Tapping an arc, or choosing one in the list, shows the two
  passages side by side as `AyahCard`s with the words they share colored.
- **Where a surah shares.** A strip of one box per ayah of a surah, coloured
  where a shared passage sits. Tapping a box selects that passage.

A shared passage is a run of at least ten words that appears in two different
surahs after normalizing, crossing ayah boundaries, with small gaps allowed.
The page says it shows shared wording and never says "same story" or "same
meaning". Each passage carries the number of places its opening words occur,
as a count and nothing else.

## How it is computed

`npm run quran:demo` (`scripts/quran/buildDemo.ts`) reads the ayat once and
writes `src/app/quran/data/runs.json` and `ayat.json`. The page reads those
files only, so it needs no database and there is no migration.

1. `src/lib/quran/normalize.ts` drops tashkeel and Quranic marks, folds
   alef forms to alef, alef maqsura and Persian yeh to yeh, teh marbuta to heh,
   drops standalone waqf marks, joins a split superscript alef, and strips the
   prepended basmala. Matching uses the normalized word, display keeps the
   vowelled word, and both share one index.
2. `src/lib/quran/passages.ts` joins the words of each surah into one sequence,
   so a run crosses ayah boundaries and never a surah boundary. Every ten-word
   window is a seed. A seed seen in two surahs is extended both ways. At a
   mismatch the extension resumes if three words match within four words on
   either side. A seed already inside a passage found for the same two places
   is skipped.
3. `src/lib/quran/wordDiff.ts` aligns the two passages (longest common
   subsequence) and returns the words that differ on each side.

The ten-word minimum is the first thing a reviewer should challenge. Per-ayah
runs of four words are formulas (`يا أيها الذين آمنوا` appears 89 times) and
relate nothing. Ten words gave 112 passages. The length in words and the
differing-word count are shown, so a reader can judge each one.

Known cases the tests pin: 7:106-109 with 26:31-34, 15:29-31 with 38:72-74,
and 20:71 with 26:49.

## Out of scope

- Any story, theme or prophet grouping, and any claim of shared meaning.
- Surah-by-surah matrix, Meccan/Medinan split, exact-duplicate-ayah list
  (those are the shortest passages, already inside the diagram).
- Tafsir, translation, English, other qira'at, root or lemma analysis.
- Any database table, migration or catalog change.

## Next PR: prophet stories

Rows `{ prophet, surah, fromAyah, toAyah, sourceUrl, sourceTitle }` in a typed
file beside the data, each from a web page that gives explicit ayah numbers,
with the URL shown on the page. A row without a URL fails a test. Pages that
disagree give separate rows, and none is picked. The differences between two
tellings come from the same `findPassages` and `wordDiff`, run only on aligned
passages, never on a whole story range. The page keeps its demo label and says
the ranges are unreviewed.

## Assumptions still open

1. Shared wording is a fair first answer to "relations between ayat". It misses
   retelling in other words.
2. The normalization folds letters a reader sees as different. With one
   qira'a the cost is small, but it is a choice.
3. The stored text is correct. See the owed Tanzil comparison above.
4. Committed derived JSON (about 110 KB) is acceptable. Rebuilding it needs the
   database, and it goes stale if the text is ever corrected.
