# One search across everything

Owner asked on 2026-11-13 for one search box that finds anything in the app. Surah names always come first, since there are few of them.

## Where it lives

- App: a magnifier beside the settings gear in the home top bar opens `(tabs)/search.tsx`. It is a hidden tab page, so the tab bar stays visible and the home button stays lit. The box does not autofocus (#598).
- Website: `/search`, opened by the same magnifier in the homepage's phone top bar and in the desktop rail.

## What it finds

Groups come in this order, and empty groups are hidden: surahs, ayat, words, trees, compare pages, prophets' events, Tuhfa verses, and the reader's notes. Each group shows three results, and its arrow shows the rest, up to 100.

- `shared/quran/searchAll.ts` puts the groups in order and matches the short lists (compare pages, events, Tuhfa, notes). Every typed word must appear in the text. Marks, hamza seats and a typed article are ignored.
- `shared/quran/searchSources.ts` holds the bundled sources. Ayat use the mushaf index's search (`ayahSearch.ts`) and words use the word counts (`words.ts`). Trees use the trees page's search over the default list. When some trees hold the typed words exactly, only those are shown, because the trees search forgives a leading و/ف («فرعون» finds «راعون»).
- The app runs everything on the phone, offline. The website asks `/api/search` and adds the browser's notes itself.

## Where a result opens

| Result | App | Website |
| --- | --- | --- |
| Surah, ayah, note | mushaf at the ayah | `/quran/read/ayah/…` |
| Word | word sheet | `/quran/words?w=` (added to the chart, places open) |
| Tree | trees tab, searched for the tree's phrase, on that tree | `branchesHref(id, …, { query })` |
| Compare page | compare tab on the pair | `/quran/compare?a=&b=` |
| Event | `/prophets/[slug]?event=<index>`, opened and scrolled to | same; the kept story finds it by title |
| Tuhfa verse | Tuhfa tab scrolled to the verse, marked | `#bayt-N` |
