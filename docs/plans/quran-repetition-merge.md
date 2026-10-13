# Merging `/quran` and `/quran/shifts` into one repetition page

Status: PR 1 and PR 2 built; PR 3 (removal) follows.

## Why merge

Both pages answer one question: where does the same wording occur again?
`/quran` answers it across surahs and `/quran/shifts` inside one surah. The two
use different arc drawings, different engines and different data paths, and a
reader has to know in advance which page holds the answer.

## Decisions

1. **One record for a repeat.** A phrase is `{ len, text, places: [{ surah, ayah, word }] }`
   with any number of places. Within-surah and cross-surah phrases share the
   shape and carry a tag saying which they are.
2. **No arcs.** An arc joins two points, so a phrase with three places needs
   three arcs, and 112 cross-surah passages over 114 surahs would be a tangle.
3. **A 114×114 matrix replaces the arcs and the bar chart.** Rows and columns
   are surahs in mushaf order. Cell (A, B) is the number of repeated words A and
   B share, as one amber ramp with a dark-mode variant. The diagonal cell (A, A)
   is A's own repetition, so within-surah and cross-surah are one picture.
   Marginal bars show each surah's total.
4. **A ranked list beside the matrix.** It lists surah pairs and surahs by
   repeated words. It is the way in on a phone, where a cell is about 3 px, and
   for keyboard and screen-reader users.
5. **Detail below, as two titled sections.** A surah, or a diagonal cell, shows
   its phrases as rows: one row per phrase, one tick per occurrence, sorted by
   count and then length, with about 20 rows visible and a button for the rest.
   An off-diagonal cell shows the pair's shared passages side by side, as
   `/quran` does now. Cross-surah and within-surah evidence differ in kind, so
   they are never merged into one list.
6. **Openers are removed**, with `findOpeners`, the «قال» forms and their tests.
   The panel named no speaker, so it said where speech starts and nothing more.
7. **One endpoint feeds the page.** `GET /api/quran/repetition` returns the
   whole dataset in one response so the client switches surahs with no further
   requests. The page is a client of it, so a phone app can use the same data.
   The response is cached for a long time, since the text never changes.
8. **No generated files.** `data/runs.json`, `data/ayat.json` and the
   `quran:demo` step go away. The finders run against the database.
9. **URL.** `/quran?s=N`, read on the client. `/quran/shifts` redirects there
   with a permanent redirect. An invalid `s` falls back to the overview, which
   needs no default surah.

## Measured

Run against the preview database, read-only.

| Measure | Value |
|---|---|
| `findShifts` over all 114 surahs | 23–45 ms, slowest surah 3 ms |
| `findPassages` over the whole Quran | 107–131 ms, 112 passages |
| Within-surah phrases | 528: 384 seen twice, 144 seen three or more times |
| Surahs with no within-surah phrase | 53 of 114 |
| Within-surah phrases per surah | median 1, 90th percentile 12, maximum 85 (surah 2) |
| Cross-surah phrases after regrouping | 89: 80 in two surahs, 7 in three, 1 in four, 1 in five |
| Text of the involved ayat | about 380 KB raw, about 90 KB gzipped |

Both finders are cheap enough to run on a cache miss, so nothing needs to be
stored. Surah 43, the old default, has exactly one phrase.

## Risks

- The two engines have different rules: 10 fuzzy words across surahs, 4 exact
  words (or 3 seen five or more times) within a surah. The same text can
  appear in both lists. Each row says which it is, and
  [quran-engine-notes.md](quran-engine-notes.md) must be updated, since it
  argues against unifying them.
- Regrouping pairs into N-way phrases is an overlap heuristic. In 6 groups the
  group's surah count differs from the passage's `places`. The pairwise records
  stay as the data, because the fuzzy marks are defined per pair.
- Dropping the arcs removes the picture `/quran` opens with.
- 53 surahs have nothing to show. The page says so plainly.

## Changes

- `src/lib/quran/shifts.ts`: one finder returning phrases with N places; delete
  `findOpeners`, `Opener`, `Form`.
- `src/lib/quran/passages.ts` or a new module: group passages into phrases for
  display.
- `src/lib/quran/curatedShifts.ts`: use the unified phrases; check its test.
- `src/app/api/quran/repetition/route.ts`: the endpoint.
- `src/app/quran/page.tsx` and `QuranDemo.tsx`: the matrix, ranked list and
  detail sections.
- Delete `src/app/quran/shifts/`, `scripts/quran/buildDemo.ts`, and
  `src/app/quran/data/`. Move `Card` out of `ShiftsView` into a shared file;
  `IltifatView` imports it.
- `next.config.ts`: the redirect. It is the first one in the repo.
- Remove the shifts entry from `siteLinks.ts`, `NavBar.tsx`
  (`QURAN_SUBMENU_HREFS`) and `NavBar.test.tsx`; point the iltifat page's link
  at `/quran`.
- Update `README.md`, [quran-within-surah.md](quran-within-surah.md),
  [quran-engine-notes.md](quran-engine-notes.md) and
  [quran-relations-page.md](quran-relations-page.md).

## Tests

Search features come first, so these are required.

- Finder: 43:22-23 is one phrase with two places; surah 55 has one phrase with
  31; surah 77 has the 3-word phrase seen 10 times; a 3-word phrase seen 3 or 4
  times is dropped and kept at 5; a repeat inside one ayah is not counted; a
  longer phrase absorbs its shorter prefix.
- Grouping: 112 passages give 89 groups, and the five-surah group is one phrase.
- Endpoint: shape of the response, and that the matrix diagonal equals the
  within-surah totals.
- View: overview with no `s`; a picked surah renders its rows, the cap and the
  expand button; a tick shows the coloured ayah; a cell or bar selects; an
  invalid `s` falls back. Uses the memoized `useSearchParams` mock from
  `GraphSearch.test.tsx`.
- Redirect configuration; iltifat colouring still works.

## Delivery

Three PRs, each through `pr-cycle`, each merged before the next starts.

1. The unified finder, the grouping of cross-surah passages, the
   `/api/quran/repetition` endpoint, and their tests. Pure logic with clear
   acceptance criteria, so the tests are written from this plan without reading
   the code. The old pages keep working beside it.
2. The matrix page: matrix, ranked list, phrase rows, detail sections and the
   `?s=` handling, reading the endpoint. The owner tunes the visuals with the
   author, so this one is not delegated.
3. Removal: `findOpeners` and its tests, `/quran/shifts`, `data/`,
   `buildDemo.ts`, the nav entries, the redirect and the doc updates.

## PR 1 specification

Nothing in PR 1 changes an existing page. `findShifts`, `findOpeners`,
`findPassages` and their callers keep their signatures and behaviour.

### `findPhrases` in `src/lib/quran/shifts.ts`

```ts
export type Phrase = { text: string; len: number; at: Occ[] };
export function findPhrases(ayat: AyahWords[]): Phrase[];
```

- Returns every repeat `findShifts` reports, arcs and refrains, as one list. An
  arc becomes a phrase with two places. `text` is the normalized words joined by
  a space, the same form a refrain's `text` has today.
- `at` is sorted by ayah, then word. The list is sorted by `at.length`
  descending, then `len` descending, then the first place.
- The thresholds and the filters stay those of `findShifts`: a repeat inside one
  ayah is not counted as a two-place phrase, a run that a refrain already
  covers is not listed again, a 3-word run needs five places.
- `findShifts` may be rebuilt on the same internals, but its output for every
  input must not change.

### `groupPassages` in `src/lib/quran/passageGroups.ts`

```ts
export type PassageGroup = {
  passages: number[];
  places: { surah: number; from: Pos; to: Pos }[];
  surahs: number[];
  matched: number;
};
export function groupPassages(passages: Passage[]): PassageGroup[];
```

- Each passage has two sides. Two sides overlap when they are in the same surah
  and their `[from, to]` ranges, ordered by ayah and then word, share at least
  one position. Passages whose sides overlap, directly or through a chain, are
  one group.
- `passages` holds the indexes of the input passages, ascending. `places` holds
  the group's sides with overlapping sides merged into one range, ordered by
  surah and position. `surahs` holds the distinct surah numbers, ascending.
  `matched` is the largest `matched` among the group's passages.
- Groups are ordered by `matched` descending, then by the first place.
- With the real 112 passages the result has 89 groups: 80 in two surahs, 7 in
  three, 1 in four and 1 in five.

### `buildRepetition` in `src/lib/quran/repetition.ts`

```ts
export type RepetitionInput = { number: number; name: string; ayat: string[] }[];
export function buildRepetition(surahs: RepetitionInput): Repetition;
```

`ayat[i]` is the text of ayah `i + 1`. The first ayah drops the basmala for
every surah except 1 and 9, as `ayahWords` is called today. The result is JSON
and holds:

- `surahs`: `{ number, name, ayat, words }` for every input surah, in input
  order. `ayat` is the ayah count. `words` is the diagonal value below.
- `cells`: `{ a, b, words, phrases }` with `a <= b`, only where `words > 0`,
  sorted by `a`, then `b`. For `a === b`, `words` is the sum of
  `len * (at.length - 1)` over that surah's phrases and `phrases` is their
  count. For `a < b`, `words` is the sum of `matched` over the passages joining
  the two surahs and `phrases` is the number of such passages.
- `within`: `{ surah, text, len, at }` for every phrase of every surah, in
  surah order and then `findPhrases` order.
- `across`: the `PassageGroup` list from `groupPassages`.
- `passages`: the `findPassages` result, unchanged.
- `ayat`: display text of every ayah that holds a `within` place or lies in a
  `passages` side, keyed `"<surah>:<ayah>"`, words joined by a space.

### `GET /api/quran/repetition`

`src/app/api/quran/repetition/route.ts` makes one call,
`prisma.surah.findMany`, selecting `number`, `name` and `ayat` (`number` and
`text`, ordered by `number`) with surahs ordered by `number`, maps each row to
a `RepetitionInput` entry (`ayat` becomes the texts in order), calls `buildRepetition` and returns the result with
`Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`. A
database error returns status 500 and `{ error: 'Failed to fetch repetition' }`
as the sibling routes do.

### Validation

`npm run lint`, `npx tsc --noEmit` and `npm test` pass. A throwaway script run
against the preview database confirms 528 within phrases, 89 groups, and that
the response is under 600 KB.

## Next steps

PR 1 (the endpoint) is merged. PR 2 puts the matrix page on `/quran`, reading the
endpoint, and moves `Card` to `src/app/quran/Card.tsx`. PR 3 removes
`/quran/shifts`, `findOpeners`, the generated data and the nav entries, and adds
the redirect. Before PR 3 deletes `src/app/quran/data/runs.json`, the three test
files that import it (`passages.test.ts`, `cards.test.ts`, `passageGroups.test.ts`)
need another source for the 112 passages.
