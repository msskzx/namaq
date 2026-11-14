# Al-Sa'di's tafsir in the reader

Owner decision 2026-11-13: al-Sa'di's *Taysir al-Karim al-Rahman* in the ayah long press, in the app (offline) and on the website. Every word shown is al-Sa'di's; nothing is written by us.

## Data

`npm run quran:tafsir` reads Quranpedia's dump `tafsir-book-3.json.gz` (version 2026-08-10) and writes `shared/data/quran/tafsirSadi.json`: 1,793 passages, each `[surah, from, to, firstPage, lastPage, text]`. Quran quotes keep their ﴿…﴾ marks, which is how the readers set them in the Quran font. `shared/quran/tafsirSadi.ts` holds what draws a passage; `tafsirSadiData.ts` holds the book, so the website's client code never loads it.

The dump gives each ayah the page pieces of the 2000 al-Risala edition (ed. al-Luwayhiq) that its passage touches. Up to about surah 9 a piece is a whole page, so an ayah's pieces also hold the end of the passage before and the start of the one after; later a page is cut at the passages. So the build lays all pieces end to end in page order and cuts the text again at the book's own range markers (`{١ - ٧}`, `﴿١٣، ١٤﴾`). A marker whose range starts lower than the one before, or starts at 1 with the basmala, opens the next surah. Where al-Sa'di takes ayat inside a passage without a marker ("ثم قال: ﴿…﴾"), the passage runs on to the ayah before the next marker. A marker that starts inside a wider range cuts that passage there (al-Qasas: «{١ - ٥١}» then «{٣٠ - ٥١}»). Where he splits an ayah (2:219 closes one passage and opens the next), the ayah gets both passages.

What the build removes:

- The heading of the next surah ("تفسير سورة الفيل / وهي مكية"). The author's own closing ("تم تفسير سورة …") stays.
- The range markers themselves; the sheet names the range.
- The title page of each manuscript volume ("المجلد الثاني من تيسير الكريم …"), which falls after the last passage of the volume before.
- The editor's footnotes and every inline mark pointing to them (`(١)`), and the printed page markers (`-[٤٠]-`).
- Pages outside 39–937. The dump hangs the book's introductions (pages 5–38), the author's appendix of principles (941–949) and the editor's appendix of variant passages (950 onward) on 114:1.
- Al-Humaza's pieces, which have no page and repeat, ayah by ayah, the passage page 934 already holds.

The dump lacks 42 pages of the book (117, 125, 139–140, 167, 169, 201, 220, 223, 247, 266, 304, 408–411, 483–484, 505, 555, 564, 588, 601, 603, 619, 661, 694, 713, 718, 772, 796–798, 844, 849, 855, 861, 873, 902, 913, 925, 927; Quranpedia's site shows them empty too). Where the text breaks off at one, the passage shows `[…]`, so a cut sentence reads as cut.

Left as the dump has them: three quotes with broken marks (10:37 opens a quote with a brace and never closes it, 23:72 has a quote and its prose swapped, 76:28 doubles a brace), and a few lines starting with a number that look like the author's own notes.

## Display

A book icon named «التفسير» in the long-press buttons opens the preview sheet: the surah and the run of ayat the passage explains, the passage (prose in Amiri, quotes in Hafs and the accent colour), and one link under it with the book, the page, Quranpedia and the dump version, opening the page on quranpedia.net.

The app bundles the data (6.9 MB, about 1.8 MB gzipped). The website keeps it on the server and fetches one passage at a time from `/api/quran/tafsir?k=2:255`.
