# Timelines of the prophets

`/quran/prophets/[slug]` is a horizontal timeline of one prophet's story, with
the ayat of every surah that tells each part of it. Musa is the only prophet
with a story so far; the rest of this document describes his.

## Adding a prophet

1. Write the story in `src/lib/quran/prophets/<slug>.ts`: an intro, the phases
   and the events, in the shape of `musa.ts`.
2. Add the prophet's slug and names to `PROPHETS` in
   `src/lib/quran/prophets/index.ts`, and the story to `STORIES` in
   `stories.ts`. The nav reads `PROPHETS` alone, so the stories stay out of
   every page's bundle.
3. Run `npm run quran:prophets` and add the new JSON file to `AYAT` in
   `src/app/quran/prophets/ayat/index.ts`.

`npm test` fails until all three agree on the slugs, and until the JSON holds
exactly the ayat the story's ranges name. The page cycles five phase colors, so
a story with more than five phases repeats them.

## Shape

- One station per event, left to right in reading order (the page is RTL, so the
  line starts at the right edge). Each station is a card hanging from the line,
  colored by one of five phases: upbringing, the mission, the exodus, his people
  Bani Israil, his knowledge and book. Every station is in a phase, with none
  left ungrouped. An index above the line lists every station by topic under its
  phase; a click scrolls the line into view and centers the station.
- A station holds segments, each one surah and one ayah range, so an event told
  in several surahs lists them together. Each segment is an `AyatDisclosure`,
  closed until opened.
- The first station is the mother of Musa. Pharaoh's killing of the sons
  (28:3-6) opens it, since the Qur'an gives it as the reason she cast him in the
  river; 40:25 is a later killing and sits with the believer of Pharaoh's house.
- Stations follow the order the story is told in. The cow, Qarun
  (of Musa's people, 28:76) and the harm done to him follow as part of his
  people, though no ayah fixes their place; the righteous servant, his name among
  the prophets and the book he was given close the line. The order of those six
  is ours and the page says so.

## Rules

- Every ayah that names Musa, or tells an event of his story without naming him
  (the believer of Pharaoh's household, the mother's inspiration), is in exactly
  one station. A test fails when an ayah sits in two.
- The grouping is ours and unreviewed. Ayat that tell one event twice (7:103-108
  and 26:18-33) sit in the station they open.
- Pages hold no database call: `npm run quran:prophets` reads the ranges in
  `src/lib/quran/prophets/` and writes `src/app/quran/prophets/ayat/<slug>.json`.

## Not done

- Coverage was checked against the full text: a search of the Qur'an text from
  api.alquran.cloud finds the name «موسى» 136 times in 131 ayat, and every one is
  in a station (2:246 and 22:44 only as a name in passing, which is why they sit
  in the station for his name among the prophets and peoples). The same search
  for «فرعون» and «هامان» finds 67 ayat, all in a station; the seven that name
  Pharaoh only in a list of denying peoples (3:11, 8:52, 8:54, 38:12, 50:13,
  85:17-18, 89:10) sit in their own station in the exodus phase.
  Stations about Bani Israil after Musa (the Sabbath, Talut, the two
  corruptions, Dawud and Isa, the Qur'an) were built and cut at the owner's
  word: the page is his timeline. They are a page of their own, not made yet.
- Four stations lean on tafsir for who the unnamed messenger is (54:41-42,
  69:9-10, 73:15-16, and 66:11 for Pharaoh's household). 5:12, 5:44-45 and
  45:16-17 tell of Bani Israil without naming him and are in, by the owner's
  request.
- No link from an ayah to a reader page, since none exists.
