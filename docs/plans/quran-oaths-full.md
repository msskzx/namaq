# Oaths page for the whole Quran (app and website)

Owner, 2026-11-13: rework /quran/oaths, which covered juz' 25 to 30 on the website only with metro lines
(docs/plans/quran-oaths-and-order-juz-26.md), to cover every oath in the Quran, in the app and on the website.

## What counts as an oath

An oath formula in the text: و / ت / ب before what is sworn by, «لا أقسم» / «فلا أقسم», «فلا وربك», «لعمرك»,
«فوربك» / «فورب», «قل إي وربي» / «قل بلى وربي». Found by scanning the whole text for these forms, then reading each hit.

Left out: reported oaths without the formula («وأقسموا بالله جهد أيمانهم», «يحلفون بالله», «تقاسموا بالله»,
«وقاسمهما», 68:17, 5:106-107), and the lam of oath alone («لنبلونكم»).

## Two lists (shared/quran/oaths.ts)

- Allah's oaths, 41: the 30 of juz' 25 to 30, plus 4:65, 15:72, 15:92, 16:56, 16:63, 19:68, 36:2, 37:1-3, 38:1,
  and the Prophet ﷺ told to swear («قل ... وربي») in 10:53 and 34:3 (64:7 was already listed). Those three carry the
  label «النبي ﷺ بأمر ربه».
- Oaths of others the Quran quotes, 12, each with its speaker from the ayah or the ayat before it: 6:23, 6:30,
  12:73, 12:85, 12:91, 12:95, 21:57, 26:44, 26:97, 37:56, 38:82, 46:34.

`by` names what is sworn by; a test finds each in its range. A word sworn by more than once in an oath is listed as
often, and only that many first occurrences are coloured (86:2 repeats «الطارق» in a question; it stays plain).

## Page (website /quran/oaths, app Quran hub tile «الأقسام»)

- A two-way switch: «أقسم الله» / «أقسم غيره».
- A row of word chips: words sworn by in two oaths or more of that list, the most frequent first, after «الكل».
  A chip only hides cards. The switch clears the chip.
- One card per oath in mushaf order, in the app's card style: place (and speaker), the ayat in the Hafs font with the
  words sworn by in the accent colour, then mushaf and share buttons on the right.
- The explanation sits in the help (question mark), the same text on both (`OATHS_HELP`).

The metro lines are gone: at 41 oaths they could not be read on a phone.

## Data

`npm run quran:oaths` reads each oath's ayat from the bundled mushaf pages (shared/data/quran/mushaf) into
shared/data/quran/oaths.json; no database. The app and the website read the same file.
