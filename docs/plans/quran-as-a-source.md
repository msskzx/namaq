# The Qur'an as a source: future plan

Status: not built as a source. The text exists in the database, but it is not
readable in the app as a source, and it has not been checked for correctness.

## Where it stands

- `Surah` and `Ayah` tables, seeded by `prisma/ayahSeed.ts` from
  `api.alquran.cloud` (edition `ar.hafs`). Each ayah has its text, global number,
  page, juz, manzil, ruku, hizb quarter and sajda flags.
- API routes under `src/app/api/quran`: surahs, ayat, and pages by mushaf page
  number (1 to 604).
- `AyahCard` shows an ayah in a profile, and people carry links to ayat revealed
  about them.
- There is no Qur'an page, and the Qur'an is not among the sources on `/sources`.

## What has to be true before it is a source

The Qur'an is the one text where a wrong letter is unacceptable, and the current
data came from a third-party API scrape. Treat it as unverified until checked.

### 1. Verify the text

- Choose the reference text and record it: which edition, who prepared it, and
  its licence. Candidates include the Tanzil Uthmani text and the King Fahd
  Complex data. Decide before comparing.
- Compare every ayah against it, letter by letter, including diacritics and small
  Qur'anic marks. Report differences, do not correct by hand.
- Structural checks: 114 surahs, 6236 ayat, each surah's ayah count, each page
  from 1 to 604 present and continuous, juz, hizb and ruku values consistent.
- Unicode checks: one normalisation form throughout, no presentation forms,
  the order of stacked marks, alef wasla and the small-mark set. Check that Amiri
  renders each mark, since a font that drops one changes what the reader sees.
- Check how the basmala is stored. Some sources put it in the text of the first
  ayah of a surah and some carry it separately; the ayah counts differ by it.

### 2. Author it as files, like everything else

[ADR 0010](../adr/0010-author-historical-data-under-data.md) makes files under
`data/` the source of truth and the database a copy. The Qur'an should follow:
verified text in files, an import script, and no live scrape at seed time. Record
the source as an edition, as [data-pipelines.md](../data-pipelines.md) does for
any source, so an ayah can be cited like a page of a book.

### 3. Decide how it is paged

The book reader reads one printed page at a time, from `SourceAccountPage` rows
whose paragraphs carry anchors, with editorial notes beside them
([book-reader-design.md](../book-reader-design.md)). The Qur'an does not fit
that shape directly:

- **Unit.** The natural page is the mushaf page (604), but an ayah can run across
  a page turn, and the current data gives each ayah one page. The text shown on a
  page would then miss the start of a continuing ayah. Decide whether a page is
  defined by ayat or by lines, and whether that needs line data the API did not
  give.
- **Contents.** Surah, juz and hizb quarter replace an entry list and sections.
- **Anchors and citations.** A citation points at an ayah (`s2-a255`) instead of a
  paragraph anchor.
- **Recitation.** `RecitationType` already has Hafs and Warsh. Paging differs by
  riwaya, so a page belongs to a recitation.

Two ways forward, to decide after the checks above: map mushaf pages onto the
existing reader by giving each page rows of ayat, or build a dedicated reader
that reuses its shell, fullscreen mode and font, size and background settings.
Pagination has to be tested against the 604-page reference either way.

## Open questions

- Whether translation or tafsir ever joins, and under which licence. Neither is
  in scope here.
- Whether the Qur'an links on a profile should cite the ayah as a claim with a
  source, so they carry evidence the way other values do.
- Audio, if ever, is a separate plan.

## Tests when built

Cover the structural checks as a validation script (counts, page continuity,
normalisation), the paging of an ayah that crosses a page, and the citation
anchor round trip. See `src/lib/history` for how the other sources validate.
