# Al-Sa'di's tafsir in the reader

Owner decision 2026-11-13: al-Sa'di's *Taysir al-Karim al-Rahman* in the ayah long press, in the app (offline) and on the website. Every word shown is al-Sa'di's; nothing is written by us.

## Data

`npm run quran:tafsir` reads Quranpedia's dump `tafsir-book-3.json.gz` (version 2026-08-10) and writes `shared/data/quran/tafsirSadi.json`: 2,006 passages, each `[surah, from, to, firstPage, lastPage, text]`. Consecutive ayat the dump gives the same text form one passage. Quran quotes keep their ﴿…﴾ marks, which is how the readers set them in the Quran font.

The dump gives each ayah a list of page pieces of the 2000 al-Risala edition (ed. al-Luwayhiq). What the build removes from them:

- The heading of the next surah ("تفسير سورة الفيل / وهي مكية"), which the dump appends to the last passage of the surah before (al-Fatiha carried al-Baqara's heading, al-Fil carried Quraysh's). The author's own closing ("تم تفسير سورة …") stays.
- A surah's own heading before its first range marker, and the range marker that opens a passage (`{١ - ٧}`); the sheet names the range.
- The editor's footnotes and every inline mark pointing to them (`(١)`), and the printed page markers (`-[٤٠]-`).
- Pages outside 39–937. The dump hangs the book's introductions (pages 5–38), the author's appendix of principles (941–949) and the editor's appendix of variant passages (950 onward) on 114:1.

Al-Humaza (104) has no page in the dump; its heading closes page 934, so the build gives it 934.

Left as the dump has them: three quotes with broken marks (10:37 opens a quote and never closes it, 23:72 has a quote and its prose swapped, 76:28 doubles a brace), and three lines starting with a number that look like the author's own notes.

## Display

A book icon named «التفسير» in the long-press buttons opens the preview sheet: the surah and the run of ayat the passage explains, the passage (prose in Amiri, quotes in Hafs and the accent colour), and one link under it with the book, the page, Quranpedia and the dump version, opening the page on quranpedia.net.

The app bundles the data (6.9 MB, about 1.8 MB gzipped). The website keeps it on the server and fetches one passage at a time from `/api/quran/tafsir?k=2:255`.
