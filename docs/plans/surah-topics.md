# Surah topics in the reader

Owner decisions, 2026-11-13 and 2026-11-14: each surah's topics come from named books, and nothing is written by us. The topics show inside the reader's own page. No ayah moves for them.

## Data

- **Sections:** *al-Tafsir al-Mawdu'i li-Suwar al-Quran al-Karim* (University of Sharjah, 2010, ed. Mustafa Muslim). We take only its headings and ayah ranges, with volume and page; it is a contemporary book, so none of its explanation is shown.
  - `npm run quran:topics` reads Quranpedia's `surahs.json.gz` (version 2026-11-14), whose note per surah cites the book. It writes `shared/data/quran/surahTopics.json` and prints the places where the book's own ranges leave an ayah out or count it twice. Those are kept as printed and listed in `/mnt/project-files/compare-refine/open-questions.md`.
  - The dump has no list for al-Fatiha, al-Shura or al-Dukhan. Those three were read by hand from the scanned print (archive.org `20260607_20260607_1233`), and the build holds them as `PRINTED`:
    - **Al-Shura and al-Dukhan:** volume 7, from pages 61 and 140. Each heading is the book's own, and each range is the running head printed over that heading's pages.
    - **Al-Fatiha:** volume 1, pages 12 to 14, the book's list of al-Fatiha's topics. Each topic ends with the words of the ayah it comes from. So ayat 5 and 7 hold two topics each, and the basmala holds none.
- **Aim:** al-Biqa'i's «مقصودها», one sentence per surah.
  - Fussilat to al-Nas reuse the surah order page's quotes (`ORDER_AIMS`, [quran-order-sources.md](quran-order-sources.md)).
  - Al-Fatiha to Ghafir are in `shared/quran/surahAims.ts`, under the same rules: copied from the cited page of *Nazm al-Durar* (Shamela 9098), «…» marks a cut, and obvious typos of the digital text are corrected. Where the digital *Nazm* has no aim line (al-Fatiha, Al Imran, al-Anfal), the quote comes from his *Masa'id al-Nazar* (Shamela 1404).
  - Every quote was matched against the turath.io text of its page; a fuzzy match was accepted only for the corrected typos.

## Display (app and website)

- **Page header:** a chip between the juz and the surah name names the section the page opens in (its number in the accent colour).
- **Section tabs:** a small numbered tab sits over the first word of each section's first ayah, in the gap above the line. It is drawn on top of the page, so the words keep their places.
- **Topic sheet:** a tap on either opens the surah's topics:
  - al-Biqa'i's aim with its book, volume and page (a link to Shamela);
  - then the numbered sections with their ranges, the tapped one in the accent colour and smaller sections indented;
  - then one line crediting the Sharjah book with volume and page.

  A row opens its first ayah.
- **Recite mode:** both the header chip and the tabs hide, so they give nothing away.

Code: `shared/quran/surahTopics.ts`, `shared/quran/surahAims.ts`; app `MushafPageView.tsx` (the `onTopic` prop) and `TopicSheet.tsx`; website `MushafPage.tsx`, `TopicSheet.tsx`, `Mushaf.module.css`.

## Later

Per-ayah topics from «تفصيل آيات القرآن الحكيم» (La Beaume, tr. Abd al-Baqi; public domain). The owner asked for it on 2026-11-14 as a later iteration. It exists only as scans, so OCR comes first.
