# Timelines of the prophets

`/quran/prophets/[slug]` maps one prophet's story: its events, and the surahs
that tell each of them. Most of this document
describes Musa's, the first one built.

## Adding a prophet

1. Write the story in `shared/quran/prophets/<slug>.ts`: an intro, the phases
   and the events, in the shape of `musa.ts`.
2. Add the prophet's slug and names to `PROPHETS` in
   `shared/quran/prophets/index.ts`, and the story to `STORIES` in
   `stories.ts`. The nav reads `PROPHETS` alone, so the stories stay out of
   every page's bundle.
3. Run `npm run quran:prophets` and add the new JSON file to `AYAT` in
   `src/app/quran/prophets/ayat/index.ts`.

`npm test` fails until all three agree on the slugs, and until the JSON holds
exactly the ayat the story's ranges name. The page has five group colours, so a
story with more than five groups repeats them.

## Shape

The events have no dates. Their order only says what came before what, and the page is about how each event is
told across the surahs (owner, 2026-11-11). So the page is a map, not a line:

- A column for each event, under its group's colour (upbringing, the mission, the exodus, his people Bani
  Israil, his knowledge and book), and a row for each surah that tells part of the story, in mushaf order. The
  dot's size is how many ayat that surah gives the event. The surah names stay put while the columns scroll.
- Tapping a dot opens a small card (a sheet on the phone): read the event's places, open the ayat in the
  reader, or compare the surah with the one that gives the event the most ayat. Tapping an event title opens
  its places too.
- The places of an event are cards one under another, one per surah. A word sits in colour when it is in a run of
  two or more words that another surah's place in the same event also has.
- The page carries little text. The intro and the legend are behind the help icon by the title (the help sheet
  in the app). The word «روايات» is not used for the tellings; the page says «مواضع».
- The group colours are `--story-0..4` in `src/app/theme.css` and `phases` in the app's `theme.ts`.
- A station holds segments, each one surah and one ayah range. The map gathers an event's segments by surah
  (`placesOf` in `shared/quran/prophets/story.ts`).
- The first event is the mother of Musa. Pharaoh's killing of the sons
  (28:3-6) opens it, since the Qur'an gives it as the reason she cast him in the
  river; 40:25 is a later killing and sits with the believer of Pharaoh's house.

## Rules

- Every ayah that names Musa, or tells an event of his story without naming him
  (the believer of Pharaoh's household, the mother's inspiration), is in exactly
  one station. A test fails when an ayah sits in two.
- The grouping is ours and unreviewed. Ayat that tell one event twice (7:103-108
  and 26:18-33) sit in the station they open.
- Pages hold no database call: `npm run quran:prophets` reads the ranges in
  `shared/quran/prophets/` and writes `src/app/quran/prophets/ayat/<slug>.json`.

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
- Hud: every ayah that names Hud (7) or Aad (22, from the corpus morphology
  file) is in an event, except 7:74, where Salih reminds Thamud they came after
  Aad: it belongs to Salih's story. 23:31-41 (a messenger to a generation after
  Nuh, taken by «الصيحة») is left out, since the mufassirun differ on Aad or
  Thamud. 7:69 sits with 26:132-135 in «التذكير بنعم الله» although in al-A'raf
  it comes after his people's first answer.
- No link from an ayah to a reader page, since none exists.
