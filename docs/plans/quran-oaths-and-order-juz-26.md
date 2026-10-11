# Oaths page and /quran/order from juz' 26

Two features on one branch, for the owner's request after the first look at
`/quran/order`: the page joined 79:1 (والنازعات غرقًا) to 81:15 (بالخنس الجوار
الكنس) in one color only because both carried the theme «الأقسام».

## 1. Oaths stop being a theme on /order

Done on the branch: `oaths` draws in neutral gray and is off by default, so a
shared gray no longer reads as a link. The `oaths` entries stay in `TOPICS` so
the badge still names the oath.

## 2. /quran/oaths

A page of every oath in juz' 26 to 30 (surahs 46 to 114), in mushaf order, with
metro lines that split the oaths by the word sworn by. The first plan drew the
lines from categories we made up (sky, time, place); the review found that
breaks the rule against authoring groupings, and that some assignments rested on
tafsir. A line is now a sworn-by word that the text repeats.

- One row (a station) per oath: surah name, ayah range, the ayat text read from
  the stored Quran text, and the words sworn by. The oath only, never its answer.
- `by` lists the words sworn by, each written as it appears in the oath's text;
  a test checks that every `by` word occurs in the stored text of its range.
- A line exists for each `by` word carried by two or more oaths: dot at every
  carrier, a line from the first to the last, an arrow at the end. A chip row
  turns lines on and off. Colors cycle through the twelve /order colors.
- Oaths by participles with no noun (والذاريات, والمرسلات, والنازعات,
  والعاديات, الخنس الجوار الكنس) carry their own words and join no line. What
  they are is a tafsir question the page does not answer.
- An oath by the Lord (فورب, وربي) carries the word «رب»; the nouns after it
  are what he is Lord of, not sworn by.
- The page says the grouping by repeated word is a display of the text, that it
  is unreviewed, and that 75:1 has a reading «لأقسم» (qira'at are held).

Oaths (surah:ayat, words): 50:1 القرآن; 51:1-4 الذاريات...; 51:7 السماء;
51:23 رب; 52:1-6 الطور، كتاب، البيت، السقف، البحر; 53:1 النجم; 56:75 النجوم; 64:7 رب;
68:1 القلم، ما; 69:38-39 ما; 70:40 رب; 74:32-34 القمر، الليل، الصبح; 75:1-2 يوم
القيامة، النفس; 77:1-6; 79:1-5; 81:15-18 الليل، الصبح; 84:16-18 الشفق، الليل،
القمر، ما; 85:1-3 السماء، اليوم; 86:1-3 السماء; 86:11-12 السماء، الأرض; 89:1-4
الفجر، الليل; 90:1-3 البلد، ما; 91:1-7 الشمس، القمر، النهار، الليل، السماء،
الأرض، ما; 92:1-3 الليل، النهار، ما; 93:1-2 الضحى، الليل; 95:1-3 التين، البلد;
100:1-5; 103:1 العصر. Not oaths: 77:7, 84:19, 89:5 (answers or questions); 68:17
and 46:34 (people's oaths, not part of this page).

Files: `src/lib/quran/oaths.ts` (data and builder), `oaths.test.ts`,
`src/app/quran/oaths/{page,OathsView,ayat.json,OathsView.test}`,
`scripts/quran/buildOaths.ts` (`npm run quran:oaths`), the shared rail pulled
out of `OrderView.tsx` into `src/components/quran/Rail.tsx`, a link in
`src/lib/siteLinks.ts` and the nav, a README line.

## 3. /quran/order from juz' 26

Extend the page to start at 46 (Al-Ahqaf), the first surah of juz' 26, and run
to 114. That adds topics for surahs 46 to 77 and hops 46->47 to 77->78.

- `TOPICS`: 1 to 6 topics per surah written from the text with the existing
  twelve themes. The محور (focus) comes from Tafsir Fayd al-Rahman and covers
  juz' 30 only, so surahs 46 to 77 have no focus: `focus` becomes optional and the page shows
  none. Notes say only what the two texts show or share; none cites tafsir.
- `HOPS`: each with ayah ranges, `topicLink` and `note` written from the two
  texts, `src: []` so the step reads «بلا مصدر». No sources are invented.
- Ayat for the new ranges are read from the stored text by `npm run
  quran:order`, never typed.
- Titles, the header text and README change from "juz' 30" to "juz' 26 to 30".
  The juz' dividers are not drawn.
- Tests: every surah 46 to 114 has topics with known themes; every hop's ranges
  exist; the focus is optional.

## Acceptance

`npm run lint`, `npx tsc --noEmit` (the generated Prisma client may be missing
in a worktree: run `npx prisma generate` first), `npm test` pass. The pages are
static and read the JSON files; no database writes.

## Out of scope

Tafsir for the unnamed oaths, the answer of each oath (جواب القسم), qira'at.
