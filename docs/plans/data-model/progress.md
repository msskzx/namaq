# Data-model implementation progress

How to resume: read [plan.md](plan.md) and [owner-goals.md](owner-goals.md), then the list below. Each item is one PR; every code PR is reviewed by a separate agent, its fixes applied, and it is squash-merged once `lint`, `tsc` and the tests pass. Things only the owner may do are marked **owner**. Every PR body ends with a "Next steps" section that names the next PR or points here, so another agent can continue if a usage limit stops the work.

## Done

- ADRs 0021 to 0023 merged and accepted by the owner ([#328](https://github.com/msskzx/namaq/pull/328)).
- Span module `src/lib/model/span.ts` ([#310](https://github.com/msskzx/namaq/pull/310)); record types, loader and `npm run model:check` ([#312](https://github.com/msskzx/namaq/pull/312)); ingestion is an adapter ([#311](https://github.com/msskzx/namaq/pull/311)).
- The al-Zubayr entry authored under `data/works/siyar-alam-al-nubala/` ([#315](https://github.com/msskzx/namaq/pull/315)), guarded by `src/lib/model/data.test.ts`.
- `profilesFromModel` (`src/lib/model/profile.ts`, [#316](https://github.com/msskzx/namaq/pull/316)): a profile built only from span-rendered assertions.
- Scenes and turns with `model:check` rules ([#317](https://github.com/msskzx/namaq/pull/317)), and the hadith of Jibril in Bukhari and Muslim as hand-checked test fixtures under `src/lib/model/fixtures/jibril/` (test data, not a source).
- Review records, revisions and the reviewed-only set for prod (`src/lib/model/review.ts`, [#318](https://github.com/msskzx/namaq/pull/318)): a revision hashes an assertion's closure (including the work, unit, edition, witness and any approved inference) and the rendered text of its spans; an edit lapses the review; `selectForProd` keeps only reviewed assertions with their closure; `npm run model:check` reports lapsed reviews.
- Inference records (`src/lib/model/inference.ts`, [#319](https://github.com/msskzx/namaq/pull/319)): `data/inferences/<id>.json`; `model:check` validates them; `applyApprovedInferences` sets a turn speaker only from an APPROVED inference and marks it `derivedBy`.
- `npm run model:diff -- <slug>` ([#320](https://github.com/msskzx/namaq/pull/320)): the old-versus-new report against `data/catalog/people`.

- The pilot data (most of al-Zubayr's entry, [#323](https://github.com/msskzx/namaq/pull/323)), `conversationOf` ([#324](https://github.com/msskzx/namaq/pull/324): scenes, turns, rendered text, every competing speaker identification, the unit and origin) and `highlightsOnPage` ([#325](https://github.com/msskzx/namaq/pull/325): a page's body, its non-overlapping marks, and the assertions resting on each; the data a review surface reads).
- The Messenger of Allah and the Prophet are `prophet-muhammad` by a standing rule ([#327](https://github.com/msskzx/namaq/pull/327)); a recorded identification of any status overrides it.
- `SharhLink` with Fath al-Bari on the hadith of Jibril as a fixture ([#329](https://github.com/msskzx/namaq/pull/329)): Shamela book 1673, printed pages 114 and 115, linked to Bukhari 50 by the number printed in the commentary's own heading.
- Isnad chains ([#330](https://github.com/msskzx/namaq/pull/330)): links with the printed formula and a derived mode key, gaps, and a tahwil as two complete routes; checks for reading order, the isnad span and a tahwil mark; Bukhari 50 and Muslim's hadith as fixtures.
- Read-model tables and the projection ([#333](https://github.com/msskzx/namaq/pull/333)): `model_spans` and `model_profile_entries`. On 2026-10-05 the owner approved applying them: only migration `20261005020000_model_read_tables` was applied to the preview database (by `prisma db execute`, then `migrate resolve --applied`), and `npm run model:project -- --env preview --apply` wrote 37 spans and 21 profile entries (nothing reviewed). `20261003065747_person_virtue_entries` drops `persons.virtues` and is still unapplied: do not apply it unless the owner asks.

## Pilot coverage: al-Zubayr (`data/works/siyar-alam-al-nubala/units/siyar-v4-3-az-zubayr.json`)

Authored from the batch's exact citations, all `PROPOSED`: full name, sex (read from `بنُ` in the heading), kunya, three titles, both parents, the wife, the author's first-to-draw-the-sword virtue, both appearance reports (the author's, and Urwa's), the death year (as Bukhari and others say it), both ages at Islam, five battles stated in the text (Badr twice, Yarmuk, the Trench, the conquest of Makkah, each with who reports it), and the cousin relation in the Prophet's own words (a `PATERNAL_COUSIN` predicate, added for it). `npm run model:diff -- az-zubayr-ibn-al-awwam` lists the rest.

Measured on the pilot (one companion, volume 4 pages 41 to 64): 38 spans, 10 reports, 13 statements, 25 mentions, 13 identifications and 21 assertions; 20 KB of JSON; about 131 bytes of rendered text per span (4,966 in all); `model:check` takes about 10 ms and loading under 1 ms. Owner minutes per decision are not measured yet; they need the owner's review of the diff and of the voice, origin and identification choices.

Open points, each for the **owner**:

- The Messenger of Allah and the Prophet are identified as `prophet-muhammad` by a standing rule (`src/lib/model/referents.ts`, decided by the owner): the name has one referent, so no per-mention basis is needed.
- The five battles and the Prophet's own mentions elsewhere are not identified as Agents: events and the Prophet need a basis span the entry does not give, so the diff lists the battles as model-only.
- Place of death: the page says he was buried at Wadi al-Siba', not that he died there.
- Companion of the Prophet: the text has his own words, "I did not leave him since I became Muslim"; the tie follows from them.
- Uhud and Jamal, and Banu Qurayzah: the excerpts do not state his participation outright (the first is about the aftermath, the second about his withdrawing, the third names him only as "my father").
- The migrations to Abyssinia and Madinah, the Egypt campaign, the verse in Al Imran: no predicate for them yet.
- A participation has no status in the model yet (the battle's outcome for him, ADR 0013).
- Virtues taken from the Prophet's or a narrator's quoted words, and the catalog's other titles: the owner's rule is that a virtue is the author's narration only.

## Held by the owner (2026-10-05)

No prod database yet. No further Siyar conversion, no wording-owned-by-one-route work and no real mu'allaq chain until the owner has read and tested what exists. `CODEOWNERS` and the screens wait for the owner's decision.

## Next, in order

1. The **owner** reads `npm run model:diff -- az-zubayr-ibn-al-awwam` and decides what the pilot must still cover: the catalog holds kunya, appearance, death, virtues, titles and verses that the model does not yet, and its joined full name drops `ابْنِ` where the book prints it.
2. Prisma tables and a projection of the model to PostgreSQL and Neo4j (migration prepared; applying it to the preview database waits for the **owner**).
3. The profile page, the conversation view and the review surface (page with highlighted spans, accept, reject, dispute) reading `profilesFromModel`, `conversationOf` and `highlightsOnPage`. The data functions exist; the UI does not, and it needs the existing reader and profile components looked at first.
4. CI and `CODEOWNERS` rules so only a scholar changes `data/reviews/` and only the owner changes `data/inferences/` (a review file is authored, so without this an agent could forge one). Needs the **owner** to set up on GitHub.
5. A cross-unit span reference, so Ibn Hajar's note on page 115 can be the `COMMENTATOR_NOTE` basis for identifying `إسماعيل بن إبراهيم` (Ibn Ulayyah) in the Bukhari fixture; wording owned by one route (`وَهَذَا حَدِيثُهُ`); a real mu'allaq chain with a Gap.

## Not now

- Ingestion adapters and real Bukhari, Muslim or tafsir sources. The model reads only files under `data/`; provider choice comes after the engine.
- The `AGENTS.md` rewrite, the preview database snapshot and the `pre-model` tag (phase 0 leftovers; the snapshot and tag need the **owner**).
