# /quran/order from the books on surah order

Replaces the earlier order page ([quran-order-from-fussilat.md](quran-order-from-fussilat.md),
[quran-oaths-and-order-juz-26.md](quran-oaths-and-order-juz-26.md)). The owner found its topics and links generic
(2026-11-13), so every sentence we had written is gone. The page now quotes the books that discuss why each surah
follows the one before it.

## What a surah shows

- Its opening: whole ayat from the first until ten words or four ayat, read from the bundled mushaf pages.
- Its aim («مقصودها»): al-Biqa'i, *Nazm al-Durar* (Shamela 9098, Hyderabad edition, 22 volumes). For Fussilat,
  al-Zukhruf and al-Taghabun the digital Nazm has no «مقصودها» line, so the aim comes from his *Masa'id al-Nazar*
  (Shamela 1404).
- Between a surah and the one before: al-Suyuti, *Tanasuq al-Durar* (Shamela 9992, Dar al-Fadila 2002). He gives
  the Hawamim one shared reason (their openings), so for the links into al-Shura, al-Zukhruf and al-Jathiya, and into
  Qaf, which he skips, the link comes from Ibn al-Zubayr, *al-Burhan fi Tanasub Suwar al-Quran* (Shamela 1388).
- A pair of ayat under a link only where the quote itself names both ayat. Words the two ayat share are coloured.

## Rules for the quotes

- Copied from the book, never paraphrased. A cut is «…». Footnote markers and the editor's brackets are dropped.
- Obvious typos of the digital text are corrected (for example «الإنسلنت» to «الإنسان», «الحدسيد» to «الحديد»).
- Each quote carries the printed volume and page and the Shamela page number. Before publishing, every quote was
  matched against the turath.io text of its page (a fuzzy match only for the corrected typos).

## Scope

Juz 25 to 30, as before (Fussilat to al-Nas). The three books cover all 114 surahs, so the rest of the Quran is a
data-only extension.

Files: `shared/quran/surahOrder.ts` (quotes, cites, builder), `shared/data/quran/surahOrder.json` (`npm run
quran:order`), `src/app/quran/order`, `mobile/src/app/(tabs)/order.tsx`.
