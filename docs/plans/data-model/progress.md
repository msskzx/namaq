# Data-model implementation progress

How to resume: read [plan.md](plan.md) and [owner-goals.md](owner-goals.md), then the list below. Each item is one PR; every code PR is reviewed by a separate agent, its fixes applied, and it is squash-merged once `lint`, `tsc` and the tests pass. Things only the owner may do are marked **owner**. Every PR body ends with a "Next steps" section that names the next PR or points here, so another agent can continue if a usage limit stops the work.

## Done

- ADRs 0021 to 0023 merged, status `proposed` (**owner** accepts them).
- Span module `src/lib/model/span.ts` ([#310](https://github.com/msskzx/namaq/pull/310)); record types, loader and `npm run model:check` ([#312](https://github.com/msskzx/namaq/pull/312)); ingestion is an adapter ([#311](https://github.com/msskzx/namaq/pull/311)).
- The al-Zubayr entry authored under `data/works/siyar-alam-al-nubala/` ([#315](https://github.com/msskzx/namaq/pull/315)), guarded by `src/lib/model/data.test.ts`.
- `profilesFromModel` (`src/lib/model/profile.ts`, [#316](https://github.com/msskzx/namaq/pull/316)): a profile built only from span-rendered assertions.
- Scenes and turns with `model:check` rules ([#317](https://github.com/msskzx/namaq/pull/317)), and the hadith of Jibril in Bukhari and Muslim as hand-checked test fixtures under `src/lib/model/fixtures/jibril/` (test data, not a source).
- Review records, revisions and the reviewed-only set for prod (`src/lib/model/review.ts`, [#318](https://github.com/msskzx/namaq/pull/318)): a revision hashes an assertion's closure (including the work, unit, edition, witness and any approved inference) and the rendered text of its spans; an edit lapses the review; `selectForProd` keeps only reviewed assertions with their closure; `npm run model:check` reports lapsed reviews.
- Inference records (`src/lib/model/inference.ts`, [#319](https://github.com/msskzx/namaq/pull/319)): `data/inferences/<id>.json`; `model:check` validates them; `applyApprovedInferences` sets a turn speaker only from an APPROVED inference and marks it `derivedBy`.
- `npm run model:diff -- <slug>` ([#320](https://github.com/msskzx/namaq/pull/320)): the old-versus-new report against `data/catalog/people`.

## Next, in order

1. The **owner** reads `npm run model:diff -- az-zubayr-ibn-al-awwam` and decides what the pilot must still cover: the catalog holds kunya, appearance, death, virtues, titles and verses that the model does not yet, and its joined full name drops `ابْنِ` where the book prints it.
2. Prisma tables and a projection of the model to PostgreSQL and Neo4j (migration prepared; applying it to the preview database waits for the **owner**).
3. The profile page and a conversation view reading the model, and the review surface.
4. CI and `CODEOWNERS` rules so only a scholar changes `data/reviews/` and only the owner changes `data/inferences/` (a review file is authored, so without this an agent could forge one). Needs the **owner** to set up on GitHub.
5. Chains (links, gaps, mode keys) and `SharhLink`; `SharhLink` needs a real commentary fixture first, which waits on a source (no Arabic is invented).

## Not now

- Ingestion adapters and real Bukhari, Muslim or tafsir sources. The model reads only files under `data/`; provider choice comes after the engine.
- The `AGENTS.md` rewrite, the preview database snapshot and the `pre-model` tag (phase 0 leftovers; the snapshot and tag need the **owner**).
