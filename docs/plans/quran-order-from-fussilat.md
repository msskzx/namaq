# /quran/order and /quran/oaths from juz' 25

Follows [quran-oaths-and-order-juz-26.md](quran-oaths-and-order-juz-26.md).

- `/quran/order` starts at Fussilat (41), where juz' 25 begins at 41:47. The
  list holds whole surahs, so Fussilat appears whole and the header says where
  the juz' starts. Surahs 41 to 45 get topics and five steps (41->42 through
  45->46), unsourced, with no focus, as for 46 to 77.
- `/quran/oaths` adds 43:2 and 44:2 (والكتاب المبين). Their word «الكتاب» joins
  the line of «كتاب» in 52:1-6.
- Tests and README move from 46 to 41.

Acceptance: `npm run lint`, `npx tsc --noEmit`, `npm test`; `npm run
quran:order` and `npm run quran:oaths` leave the JSON files unchanged.
