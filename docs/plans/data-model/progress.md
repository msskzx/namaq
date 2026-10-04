# Data-model implementation progress

How to resume: read [plan.md](plan.md) and [owner-goals.md](owner-goals.md), then the list below. Each item is one PR; every code PR is reviewed by a separate agent, its fixes applied, and it is squash-merged once `lint`, `tsc` and the tests pass. Things only the owner may do are marked **owner**. Every PR body ends with a "Next steps" section that names the next PR or points here, so another agent can continue if a usage limit stops the work.

## Done

- ADRs 0021 to 0023 merged, status `proposed` (**owner** accepts them).
- Span module `src/lib/model/span.ts` ([#310](https://github.com/msskzx/namaq/pull/310)); record types, loader and `npm run model:check` ([#312](https://github.com/msskzx/namaq/pull/312)); ingestion is an adapter ([#311](https://github.com/msskzx/namaq/pull/311)).
- The al-Zubayr entry authored under `data/works/siyar-alam-al-nubala/` ([#315](https://github.com/msskzx/namaq/pull/315)), guarded by `src/lib/model/data.test.ts`.

## In review

- `profilesFromModel` (`src/lib/model/profile.ts`): a profile built only from span-rendered assertions, tested on the al-Zubayr entry.

## Next, in order

1. The old-versus-new diff for al-Zubayr: compare the profile above with the catalog's values (`data/catalog/people`) and list each difference for the **owner**.
2. Prisma tables and a projection of the model to PostgreSQL (migration prepared; applying it to the preview database waits for the **owner**).
3. The profile page reading from the model, and the review surface.
4. Scenes, turns, chains and `SharhLink` for the Jibril slice, on hand-checked fixtures.
5. Inference files and the owner-approval check; review records and the prod filter.

## Not now

- Ingestion adapters and real Bukhari, Muslim or tafsir sources. The model reads only files under `data/`; provider choice comes after the engine.
- The `AGENTS.md` rewrite, the preview database snapshot and the `pre-model` tag (phase 0 leftovers; the snapshot and tag need the **owner**).
