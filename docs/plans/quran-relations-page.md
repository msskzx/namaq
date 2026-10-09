# Quran relations demo page

Status: proposal, phase one. Nothing is built.
The owner wants one demo page with visualizations and numbers about the Quran.
Most interesting to them: relations between ayat, and stories about the same
prophet told in different surahs, with their relations and differences.

## 1. What data exists today

| Data | Where | Count |
| --- | --- | --- |
| Surahs | `Surah` in `prisma/schema.prisma`, table `surahs` | 114 (86 Meccan, 28 Medinan, all `HAFS`) |
| Ayat with full vowelled text | `Ayah`, table `ayahs` | 6,236, all `HAFS`, `globalNumber` set on all |
| Ayah position fields | `juz`, `manzil`, `page`, `ruku`, `hizbQuarter`, `sajda` | on every ayah |
| Person-to-ayah links | `_PersonAyahs`, written by `npm run catalog:project` from `ayat:` in `data/catalog/people/*.ts` | 42 rows, 33 distinct ayat, 18 people |
| Quran API | `src/app/api/quran/{surahs,surahs/[slug],ayat,pages/[slug]}` | read-only routes |
| UI | `src/components/quran/{AyahCard,SurahCard}.tsx`, `src/types/quran.ts` | no Quran page exists |
| Chart and graph libs | `package.json`: `chart.js`, `d3-force`, `react-force-graph-2d` | already installed |

Checked against the preview database, read only.

What is missing:

- **No tafsir, no cross-reference set, no thematic tags.** Nothing in the repo
  links one ayah to another.
- **No prophet but one has a person entry.** `data/catalog/people/` holds
  `prophet-muhammad` and companions only. Of the 18 people with ayat links, none
  is a prophet other than the companions' own entries. So the existing links
  cannot say which surahs tell the story of Musa or Nuh.
- `revelationOrder` and `revelationPeriod` are null on the rows I read (Al-Fatiha,
  one ayah). Whether they are empty everywhere is unchecked. `revelationType`
  (Meccan or Medinan) is set on all surahs. It came with the imported dataset,
  not from a source Namaq cites, so the page must label it as imported.
- Ayah text carries tashkeel, annotation marks and a trailing newline, so
  matching needs a normalization step.

## 2. Candidate visualizations

The owner's rules: educational, evidence-backed, no authored groupings, Arabic
only, all qira'at held. "Derived from the text" and "counted from data" pass.
A list I type in by hand does not.

### A. The Quran in numbers

- **Question:** how big is each surah, and how are ayat spread across surahs,
  juz and pages?
- **Data:** `numberOfAyat`, `juz`, `page` on existing rows. Exists.
- **Grouping:** none beyond what the dataset carries. Meccan/Medinan is an
  imported field and shows with that label.
- **Output:** a bar chart of ayat per surah in mushaf order, a few headline
  numbers (114 surahs, 6,236 ayat, longest, shortest), and the word count
  computed from the text.
- **Cost:** small. One server query, chart.js. About half a day.
- **Value for the wish:** low. It sets the scene and proves the data loads.

### B. Verbatim repeated ayat

- **Question:** which ayat appear word for word more than once, and where?
- **Data:** ayah text, normalized (strip tashkeel, annotation marks, tatweel,
  fold alef and yeh variants, trim). Exists. Group by identical normalized
  string, keep groups of two or more.
- **Grouping:** none. Equality of text is the only rule, and it is shown.
- **Output:** a ranked list (the refrain with its count and the surahs holding
  it) and a strip chart of where in each surah the repeats fall.
- **Cost:** small to medium, about one day.
- **Value for the wish:** medium. It is a real relation between ayat, but a
  narrow one, and mostly refrains inside one surah.

### C. Shared wording between surahs

- **Question:** which pairs of ayat in different surahs share a long run of
  words, and which surahs share the most?
- **Data:** normalized ayah text, split into words. Exists. Compute word
  n-grams (say eight or more consecutive words), keep a run that occurs in two
  or more surahs, merge overlapping runs.
- **Grouping:** none, but there are two parameters: the minimum run length and
  the normalization. Both are shown on the page and the minimum is adjustable.
  A run found by the rule is "shared wording", not "related by meaning". The
  page never says more than that.
- **Output:** (1) a 114 by 114 matrix, cell darkness is the number of shared
  runs; (2) click a cell to see the runs side by side with the differing words
  marked. The side-by-side view is how it speaks to "relations and differences".
- **Cost:** medium. Precompute at build or in a script into a JSON file, since
  the n-gram pass over 6,236 ayat is cheap but should not run per request.
  Needs a diff of two word sequences (a small LCS, no dependency). Tests for the
  normalizer, the run finder and the diff. About two to three days.
- **Value for the wish:** high. It is the only idea here that finds relations
  between ayat with no outside knowledge.

### D. A prophet's story across surahs (updated: web sources allowed)

- **Question:** in which surahs is a prophet's story told, and how do the
  tellings differ?
- **Data:** ayah text exists. The surah and ayah ranges of each story do not.
  The owner now allows web search for them, on two conditions: the data lives in
  a static file under the page's folder (no table, no migration), and every
  relation carries a source URL shown on the page. Two ways to fill it:
  - (i) **Sourced ranges.** For a small set of prophets (say Musa, Ibrahim, Nuh,
    Yusuf), an agent searches the web for a page that lists the passages of
    that story, and records each as `{ prophet, surah, from, to, sourceUrl }`.
    Each row is one cited statement by that page, not our grouping. We choose
    which prophets to include, which is a selection, and the page says so.
  - (ii) **Text-computed cross-check.** For each recorded range, the build
    pulls the ayat from the database or a text dump and runs C's shared-wording
    finder between the tellings, so the differences shown are computed, not
    claimed. The name occurrence (the prophet's name in the range) is counted
    as a check on the source.
- **Cost:** medium, dominated by research. Finding and checking sources for four
  prophets is about one to two days, and the quality varies: web pages disagree
  on where a story starts and ends, and some list the whole surah. Rule: keep a
  row only if the page gives explicit ayah numbers, record disagreeing pages as
  separate rows, and pick none. Adding the diff view on top of C is small.
- **Value for the wish:** high. It is the owner's second interest. Its
  weakness is that the strength of each relation is only as good as its web
  source, and no scholar has reviewed any of it.

### E. A person's ayat, from existing links

Dropped: 33 ayat for 18 companions answers neither of the owner's interests.

### F. Shared-wording neighbors of one ayah

- **Question:** pick an ayah. What other ayat share wording with it, and how do
  they differ?
- **Data:** the output of C. Exists once C does.
- **Output:** an ayah picker (surah and number), then the shared-wording
  neighbors listed with diffs. A local view of the same data as C's matrix.
- **Cost:** small on top of C, about one day.
- **Value for the wish:** high for the teaching case. Pick the ayah and the
  neighbors show where one account is told again with other words.

## 3. Recommended set

Build **A (header numbers), C with F, and D** on one page. Skip B as a separate
section: its results are the exact-match end of C, so C tags them "verbatim".
Skip E.

Rationale:

- C and F answer "relations between ayat" from the text alone, with nothing
  authored.
- D answers the owner's second interest. With web sources allowed it is
  buildable, as long as each range cites a page and the page is labelled a demo.
- A gives real numbers for almost nothing.
- D reuses C's finder for the differences, so the two sections share code.

### What the static file holds

One folder, `src/app/quran/data/`, with no database table and no migration:

- `stories.ts` (typed): rows `{ prophet, surah, fromAyah, toAyah, sourceUrl,
  sourceTitle, note? }`. Every row is from the web, never from memory. A row
  without a URL fails a test. Disagreeing sources are separate rows.
- `sharedRuns.json`: computed from the Quran text by a script, no URL needed
  because the rule is the evidence. It records the rule and its parameters in
  the file header.
- `ayat.json`: the normalized ayah text the two scripts read, so the build and
  the tests need no database. Source: a dump of the `ayahs` table by a read-only
  script. The page may show the vowelled text from the same dump. Size is about
  1 MB, to be measured.

The page shows a "Demo" badge, the source URL of every story row, and a line
that the data is unreviewed.

### Route and layout

- Route: `/quran`. Server component reading the static files only, so the page
  is static and needs no database at request time.
- Arabic only, per the owner's latest word: headings, labels, notes and the
  demo badge are written in Arabic, right to left, with no `translations.ts`
  entries and no English. Surah names come from the `name` field. Source titles
  are shown as found, with their URL.
- Top to bottom on a phone: headline numbers (four tiles), ayat-per-surah bar
  chart, shared-wording matrix, ayah picker with neighbor list and diff view.
  The 114 by 114 matrix scrolls inside its own box on a phone, with a tap to
  open the pair's runs below it, not a hover.
- Light and dark through the existing Tailwind `dark:` variants. The diff marks
  differing words with underline plus color, so color is not the only signal.
- Buttons go through `src/components/common/Button.tsx` with an icon.
- A line under the page says the text is Hafs, that the sharing rule is only
  consecutive identical words after the normalization shown, and that no scholar
  has reviewed it.

### Files the build would add

- `src/lib/quran/normalize.ts`, `sharedRuns.ts`, `wordDiff.ts`, each with a
  colocated `.test.ts`. Search and graph features are the highest test priority
  in `AGENTS.md`, and this is the nearest thing, so the run finder gets the most
  cases.
- `scripts/quran/buildQuranDemo.ts` writing `src/app/quran/data/ayat.json` and
  `sharedRuns.json`, run by `npm run quran:demo`.
- `src/app/quran/data/stories.ts`, hand-filled from web sources, and its test.
- `src/app/quran/page.tsx` with its components beside it.
- A README line under "What is implemented".

### Out of scope

- Any story, theme, topic or prophet grouping. Any claim that two ayat are
  "about the same thing".
- Tafsir, translation, English ayah names, audio, other qira'at (the data is
  Hafs only, and Warsh stays held).
- Root or lemma analysis. It needs a morphology source we do not have.
- Any database table, migration or catalog change. The page reads static files.
- English text anywhere on the page.
- Prophet profiles, new person entries, new `ABOUT_AYAH` links.
- Per-ayah search, bookmarks, a Quran reader. The page is a demo.

## 4. Assumptions for the SKEPTIC to attack

1. **A run of consecutive identical words is a fair meaning of "related".** It
   finds refrains and retold phrases. It misses retelling in other words and
   flags formulas (`قل`, `يا أيها الذين آمنوا`) that relate nothing. Is it a
   relation or only a coincidence of text? Does the label "shared wording"
   stay honest next to the word "relations" in the owner's request?
2. **The minimum run length is a parameter, not an authored grouping.** I treat
   a visible, adjustable number as acceptable. Is any threshold an editorial
   choice in disguise?
3. **Normalization is neutral.** Folding alef and yeh forms and dropping marks
   could merge two ayat a reader sees as different, or hide a qira'at
   difference. The data is Hafs only, so the second risk is zero today. Is the
   first acceptable?
4. **The text in the database is correct.** I have not compared it with a
   reference mushaf. The dataset uses the Persian yeh (`ی`) in places. If the
   text is wrong, every number on the page is wrong.
5. **`revelationType` is safe to display.** It is imported, uncited, and the
   owner wants evidence behind every shown fact. Should the Meccan/Medinan
   split be dropped from the demo?
6. **The owner will accept shared wording in place of stories of the same
   prophet.** It is a different question. Would a page that cannot show the
   second interest still count as the demo they asked for?
7. **A web page that lists a story's ayah ranges counts as evidence.** Are the
   ranges "our grouping" because we pick the prophets and the pages? Which
   pages count as trusted, and what do we do when two disagree? Is a scholar-less
   demo label enough?
8. **Committed derived JSON in the page folder is fine.** ADR 0023 says files
   are the authority and databases derived. A demo outside `data/` and the
   database seems to avoid that, but a 1 MB generated file in the repo may rot.
   Should it be built in CI instead?
9. **The matrix reads on a phone.** 114 by 114 cells at 375 px is under four
   pixels each. A scrolling box with a tap target may still be unusable.
   Would a ranked list of surah pairs serve better and cost less?
10. **Costs.** The estimates assume the n-gram pass is fast and the diff view is
    simple. A real pass over 77,000 words may yield thousands of mostly
    formulaic runs, and cutting them to a readable set may need a rule we have
    not thought of.
11. **One page is enough scope.** A and C and F together may be two pages of
    work squeezed into one PR. Which of the three should go first if the PR is
    cut?
12. **No new dependency.** I assume `chart.js` plus plain SVG covers every
    chart. Is that true for the matrix?
