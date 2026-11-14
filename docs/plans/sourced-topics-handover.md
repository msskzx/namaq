# Sourced surah topics handover

Incomplete source-gathering draft, preserved at the owner's request on 2026-11-14. It does not replace production topics. No AI topic text has been removed and no UI has changed.

## Requested result

Replace every AI-written topic with sections from جامعة الشارقة's التفسير الموضوعي لسور القرآن الكريم. Each section needs its title, ayah range and verified volume/page reference. The requested source scope is 112 surahs; establish the source's actual coverage rather than assuming every surah has a list. The approved layout is a right-aligned list of titles and ranges. Tapping opens the passage, and the help icon reveals the book reference and source link. The app supplies the web style. Use Amiri for labels, Hafs for Quran text and no statistics.

## Saved evidence

`data/quran/topics/sharjah-source.json` is intermediate research data. It holds surahs 41–114 with `surah`, `sourceUrl`, `volume`, `surahStartPage` and verbatim `headings` display lines. These are not structured application sections. The page field is Quranpedia's citation for the surah's starting page, **not each section's exact page**.

There are nonempty lists for 63 of these surahs. Gaps remain at 42, 44, 56, 62, 69, 88, 96, 98, 99, 101 and 104. Surahs 1–40 have not been saved. Empty host pages do not establish absence from the book.

[Quranpedia's Fussilat list](https://quranpedia.net/surah-info/fussilat/mawdoaat) cites volume 7, page 5. [Its al-Naba list](https://quranpedia.net/surah-info/an-naba/mawdoaat) cites volume 9, page 4. These text pages provide candidate titles and ranges; verify the exact source selections before publication.

## Source access

[Volume 7 scan](https://d1.islamhouse.com/data/ar/ih_books/chain_01/Tfseer_Mudu3i/ar_07_Tfseer_Mudu3i.pdf) is cached at `/private/tmp/namaq-tafsir-volume-seven.pdf`. `/private/tmp/namaq-vseven-page-ten.png` shows printed page 5, PDF page 10, with the first Fussilat section and 41:1–8. Temporary files may disappear. An early visual reading of الانهزامي as الاستهزائي was corrected; retain the verified text.

The PDF has no text layer. Ghostscript rendering worked. macOS Vision OCR failed, Tesseract installation was interrupted, and direct Aljam3 HTML requests returned 403. [An Aljam3 OCR page](https://aljam3.com/ar/18618/40512/1) opened through web tools. Check installed tools before retrying setup.

## Resume

1. Read `AGENTS.md` and relevant `docs/records`. Fetch and integrate `origin/main`, preserving this draft. It was updated through `6432a38d` at handover.
2. Extract missing lists and verify exact section titles, boundaries and printed-page references against the book. Preserve the distinction between a surah-start citation and a section citation.
3. Resolve cross-review anomalies against the source: surah 84 leaves verse 6 outside the listed ranges; surah 47 lists 29–30 in two sections. Do not silently repair either range. These are unverified anomalies, not established transcription errors.
4. Replace all AI topic text with validated structured sections, then implement the approved app/web display and help citation. Audit existing theme taxonomy against the source rather than carrying AI labels forward.
5. Add meaningful data and UI tests. Run lint, TypeScript, `npm test`, build, mobile typecheck for app changes and `npm run test:ui`. No checks have run for this draft. A handover Node probe also failed because `libicui18n.74.dylib` was missing.
6. Resolve review findings and satisfy the required review/check gates before marking ready.

Task 1 is `codex/sadi-tafsir`. There is no file overlap in these saved changes. If subsequent UI work overlaps, rebase task 2 onto task 1, preserving only task 2's commits if task 1 has been squash-merged.

Records used: namaq/0026-a-citation-does-not-authorize-every-chip
