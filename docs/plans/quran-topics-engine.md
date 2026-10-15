# Per-ayah-range Quran topics: engine, order badges, themes comparison

## Context

`/quran/order` (surahs 41-114, [surahOrder.ts](src/lib/quran/surahOrder.ts)) tags each surah
with 1-6 topics as `[themeId, phrase]` — no ayah anchor, so a badge can't point at the ayah
it came from, and clicking does nothing (`Badge` isn't even wrapped in a link in
[OrderView.tsx:132-138](src/app/quran/order/OrderView.tsx)).

`/quran/themes` compares two surahs by topic, but only for one hardcoded pair
(An-Nahl↔Az-Zukhruf, [16-43.json](src/app/quran/themes/data/16-43.json)) — a free-text
`theme` label linking one ayah range in each surah. The pairing logic is generic
(`page.tsx` looks up `"a-b"` in a map), but the *data* only exists for that one pair, and
nothing computes it from a shared taxonomy.

No shared topic engine exists. The two features use two incompatible, hand-authored shapes.
The owner wants: (1) badges that show the ayah text and jump to a topic with our own
wording, (2) one ayah can carry several topics, (3) topics re-annotated per-ayah-range for
surahs 41-114 by two independent agents who reconcile differences, (4) the result stored in
Postgres (files remain the source of truth per repo convention, DB is a projection), (5) a
shared engine powering both pages, and (6) `/quran/themes` generalized to compute any
surah-pair comparison from that engine, with the old hardcoded Nahl↔Zukhruf result kept on
its own page to diff against the new engine's output for the same pair.

## Data model

New Prisma models (migration via `expand-contract-migration` skill, additive only):

```prisma
model QuranTopic {
  id            String   @id @default(cuid())
  slug          String   @unique      // our own short id, e.g. "wahy-malaika"
  labelAr       String                // "القرآن والوحي والملائكة"
  themeId       String?               // optional umbrella: one of the 12 existing THEMES ids
  surah         Int                   // surah this topic instance belongs to
  ayahFrom      Int
  ayahTo        Int
  excerptAr     String                // verbatim substring of Ayah.text for ayahFrom..ayahTo
  alternativeOf String?               // slug of the canonical topic this is a competing reading of
  createdAt     DateTime @default(now())

  @@index([surah])
}
```

One row per (surah, ayah-range, topic) — this is how one ayah ends up under several topics:
just author multiple rows with overlapping ranges. No separate join table needed since a
topic instance is already scoped to one surah's range; cross-surah linking (for themes) is
done by slug equality, not a foreign key. `themeId` is nullable and unenforced (a topic can
sit outside all 12 if it genuinely doesn't fit). `alternativeOf` is null for the canonical
reading; set only when the two annotation agents reach a genuine structural disagreement
(different topic boundaries, not just wording) that both readings are worth keeping as data
— resolved in favor of this over a summary.md-only record, per the two review agents'
debate (Agent B's position). Engine queries and the UI ignore rows with `alternativeOf` set
until a future phase wants to expose them.

Source-of-truth files: `data/quran/topics/<surah>.json`, one file per surah 41-114, array of
`{ slug, labelAr, ayahFrom, ayahTo, excerptAr }`. A new script
`scripts/quran/syncTopics.ts` (`npm run quran:topics:sync`, dry-run by default, `--apply` to
write) reads these files and projects into `QuranTopic`, following the same
files-are-authority pattern as `syncCanonicalPeople.ts`.

## Annotation workflow (surahs 41-114)

1. Two agents, each working independently from the Arabic text (Prisma `Ayah` rows) and the
   existing `SURAH_TOPICS`/`THEMES` taxonomy as an optional umbrella (free to add/split
   topics where a surah needs finer granularity, `themeId` left null where none of the 12
   fit), produce a full draft of `data/quran/topics/<surah>.json` for every surah 41-114.
   Each ayah may get >1 topic row. `excerptAr` must be a verbatim substring of the ayah
   range's actual text.
2. Use the `grill-with-docs` skill between the two agents' drafts: surface every surah where
   their topic slugs, ranges, or counts disagree. Wording or boundary-by-a-couple-of-ayat
   differences get merged to one reading. A genuine structural disagreement (different
   topic boundaries over the same ayat) ships as two rows: the merge keeps one as canonical
   and adds the other with `alternativeOf` pointing at it, and both are noted in
   `summary.md` under `data/quran/topics/`.
3. Merge into the final per-surah JSON files. `syncTopics.ts --apply` rejects any file whose
   `excerptAr` isn't a real substring of the surah's ayah text, and warns (without blocking)
   when a single range exceeds ~15 ayat or more than ~4 topics stack on one ayah. Run dry-run
   first, inspect the diff and warnings, then `--apply`.

## Shared engine

New module `src/lib/quran/topicEngine.ts`:
- `getSurahTopics(surah): TopicInstance[]` — reads from `QuranTopic` (Prisma), replacing the
  hardcoded `SURAH_TOPICS` table for 41-114.
- `getSharedTopics(surahA, surahB): { slug, labelAr, a: Range, b: Range }[]` — joins
  `QuranTopic` rows from both surahs on `slug`, producing exactly the shape
  `themes/data/16-43.json` already uses, generically for any pair.

## `/quran/order` changes

- [OrderView.tsx](src/app/quran/order/OrderView.tsx): badge label becomes the ayah excerpt
  (`excerptAr`), badge is now a button; clicking opens a small popover/panel showing the
  topic's `labelAr` (our own wording) plus the full ayah range it covers.
- [surahOrder.ts](src/lib/quran/surahOrder.ts): `buildOrder` sources topics via
  `getSurahTopics` instead of the inline `SURAH_TOPICS` table for surahs 41-114 (1-40 stay as
  they are — out of scope, confirmed with owner).

## `/quran/themes` changes

- New generic route e.g. `/quran/themes/compare?a=&b=` (or extend existing `page.tsx`) calls
  `getSharedTopics(a, b)` instead of the static `themes/data` map, for any two surahs that
  have topic data (41-114 only, since that's what's annotated). Query-param only this
  phase; no surah-picker UI — deferred until more of the book is annotated, so the picker
  isn't offering pairs with no data behind them.
- Move the existing hardcoded `16-43.json` view to `/quran/themes/legacy` (static, unchanged)
  so the owner can open both pages side by side for An-Nahl↔Az-Zukhruf and compare the
  engine's output against the hand-authored one.
- If the engine's result for that pair diverges from the legacy one, call it out explicitly
  in the PR description rather than silently reconciling.

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm test`.
- `npm run quran:topics:sync` (dry run, inspect diff, then `--apply`) against the preview DB.
- Component tests for the new badge click behavior and for `getSharedTopics` (colocated
  `.test.ts(x)` next to the engine and `OrderView`).
- Manual check via the built-in browser: `/quran/order` badge click shows ayah text + topic;
  `/quran/themes/compare?a=16&b=43` vs `/quran/themes/legacy` for the diff call-out.

## Delivery

Three PRs via `pr-cycle` (each gets its own review cycle, per AGENTS.md):
1. Schema + sync script + shared engine (no visible UI change yet).
2. Two-agent annotation of surahs 41-114 + `grill-with-docs` reconciliation + data apply.
3. `/quran/order` badge UX + `/quran/themes` generalization + legacy page split.

README "What is implemented" updated in PR 3 for both features.
