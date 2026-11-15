# Al-Sa'di's tafsir in the reader

Owner decision 2026-11-13: al-Sa'di's *Taysir al-Karim al-Rahman* in the ayah long press, in the app (offline) and on the website. Every word shown is al-Sa'di's; nothing is written by us.

## Data

`npm run quran:tafsir` reads Quranpedia's dump `tafsir-book-3.json.gz` (version 2026-08-10) and writes `shared/data/quran/tafsirSadi.json`: 1,793 passages, each `[surah, from, to, firstPage, lastPage, text]`. Quran quotes keep their ﴿…﴾ marks, which is how the readers set them in the Quran font. `shared/quran/tafsirSadi.ts` holds what draws a passage; `tafsirSadiData.ts` holds the book, so the website's client code never loads it.

The dump gives each ayah the page pieces of the 2000 al-Risala edition (ed. al-Luwayhiq) that its passage touches. Up to about surah 9 a piece is a whole page, so an ayah's pieces also hold the end of the passage before and the start of the one after; later a page is cut at the passages. So the build lays all pieces end to end in page order and cuts the text again at the book's own range markers (`{١ - ٧}`, `﴿١٣، ١٤﴾`). A marker whose range starts lower than the one before, or starts at 1 with the basmala, opens the next surah. Where al-Sa'di takes ayat inside a passage without a marker ("ثم قال: ﴿…﴾"), the passage runs on to the ayah before the next marker. A marker that starts inside a wider range cuts that passage there (al-Qasas: «{١ - ٥١}» then «{٣٠ - ٥١}»). Where he splits an ayah, the ayah gets both passages: 2:219 has «{٢١٩}» and then «{٢١٩ - ٢٢٠}», whose quote ends on the opening words of 2:220 («في الدنيا والآخرة»), so that second passage is kept on 2:220 too, before 2:220's own. A passage keeps its marker's last ayah only when the next marker starts on it and the passage quotes that ayah's opening words again in its explanation; a wider overlap is cut as above. Three passages share an ayah this way (2:219–220, 4:77–78, 30:11–16). Twelve more markers end on the next marker's first ayah but only quote it up front (4:29–30, 72:1–2, …); those keep to the ayah before.

What the build removes:

- The heading of the next surah ("تفسير سورة الفيل / وهي مكية"). The author's own closing ("تم تفسير سورة …") stays.
- The range markers themselves; the sheet names the range.
- The title page of each manuscript volume ("المجلد الثاني من تيسير الكريم …"), which falls after the last passage of the volume before.
- The editor's footnotes and every inline mark pointing to them (`(١)`), and the printed page markers (`-[٤٠]-`).
- Pages outside 39–937. The dump hangs the book's introductions (pages 5–38), the author's appendix of principles (941–949) and the editor's appendix of variant passages (950 onward) on 114:1.
- Al-Humaza's pieces, which have no page and repeat, ayah by ayah, the passage page 934 already holds.

The dump has no piece numbered for 42 pages of the book (117, 125, 139–140, 167, 169, 201, 220, 223, 247, 266, 304, 408–411, 483–484, 505, 555, 564, 588, 601, 603, 619, 661, 694, 713, 718, 772, 796–798, 844, 849, 855, 861, 873, 902, 913, 925, 927). Most of them are not lost: the piece before runs on over them. But seven passages break off where a piece ends: 3:96–97 (mid-word in a poem), 4:11–12, 12:110–111 (most of the lessons of Yusuf's story, pages 408–411), 18:60–82, 24:11–26, 48:29 (the Hudaybiya account) and the last words of 61:10–14. The build fills them from Shamela's copy of the same edition (book 42, "ترقيم الكتاب موافق للمطبوع"), read from turath.io's export and pinned by its sha256 (`scripts/quran/sadiShamela.ts`): it finds the last 40 letters before the break in Shamela, letters only, and takes what follows up to the text after the break or the next range marker. The passage's last page comes from Shamela's page numbers. Nothing else is taken from Shamela. The copyist's colophon after al-Fath («بقلم الفقير إلى ربه سليمان بن حمد البسام») is not al-Sa'di's and stays out.

The build then walks every passage against Shamela in 60-letter steps and prints any run of Shamela text the passages lack, past the volume title pages it removes on purpose. On 2026-11-15 it printed none.

Left as the dump has them: three quotes with broken marks (10:37 opens a quote with a brace and never closes it, 23:72 has a quote and its prose swapped, 76:28 doubles a brace), and a few lines starting with a number that look like the author's own notes.

## Display

A book icon named «التفسير» in the long-press buttons opens the preview sheet: the surah and the run of ayat the passage explains, the passage (prose in Amiri, quotes in Hafs and the accent colour), and one link under it with the book, the page, Quranpedia and the dump version, opening the page on quranpedia.net.

The app bundles the data (6.9 MB, about 1.8 MB gzipped). The website keeps it on the server and fetches one passage at a time from `/api/quran/tafsir?k=2:255`.
