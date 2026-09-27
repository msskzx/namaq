# Reviewed quiz bank and quiz-quality pass

Status: **implemented**.

This plan replaces runtime-only question generation with a reviewed question
bank and fixes the topic, wording, supply, performance and quiz-interface
problems found while taking the first solo quizzes. It supersedes the topic
mapping, historical-review eligibility and request-time assembly described in
[quiz-question-engine.md](quiz-question-engine.md) and
[solo-quiz.md](solo-quiz.md). Party mode remains out of scope.

The domain terms are defined in [CONTEXT.md](../../CONTEXT.md). The file-backed
authority and PostgreSQL projection are recorded in
[ADR 0017](../adr/0017-project-reviewed-quiz-questions-from-files.md).

## Agreed behavior and scope

### Reviewed question lifecycle

- Generate complete Arabic question candidates from cited, non-disputed claims.
  Historical claim review status is not an eligibility gate: `NOT_REVIEWED`,
  `IN_REVIEW` and `REVIEWED` claims may all produce candidates. Values with no
  cited claim remain ineligible.
- Each candidate has a stable key derived from its family, subject, direction
  and answer identity. Supporting claim authoring keys belong to the
  fingerprint rather than the identity, so evidence changes trigger review
  without creating a duplicate question. `HistoricalClaim.id` is never used
  because database ids are not file-owned identities.
- The generated fingerprint covers the exact generated Arabic prompt, fixed
  choice identities and labels, correct answer and evidence identities. The
  distractor set is deterministic for a stable key; only display order is
  shuffled when a quiz is assembled.
- `data/quiz/` is the source of truth for the complete bank. Generation merges
  rather than overwrites: a new candidate starts `PENDING`; an unchanged
  fingerprint preserves its review decision and prompt override; a changed
  fingerprint returns it to `PENDING`; a missing candidate becomes `RETIRED`.
  Rejected questions are never deleted and carry a reason.
- An agent may approve or reject a candidate and may supply a separate Arabic
  prompt override. It may not edit the generated answer or choice set. A bad
  answer or distractor set is rejected and fixed in the source data or shared
  generator before regeneration.
- Validation fails while candidates are pending or stale and when an approved
  question lacks exactly four distinct choices, one correct answer, cited
  evidence, a valid Arabic prompt, or a complete review decision.
- A projection command copies the whole file-authored bank into PostgreSQL.
  The application reads the projection and samples only `APPROVED` rows.
  Pending, rejected and retired rows remain available to the review surface.
- Question generation and historical review remain separate. Approving a quiz
  question never changes a claim's `reviewStatus`.

### Agent review rubric

A proposed `docs/quiz-question-review.md` will require the reviewing agent to
inspect the complete prompt, choices, correct answer and evidence together. The
agent rejects or rewrites a prompt when:

- the prompt contains or mechanically reveals the answer, including a father's
  name already exposed by the subject's displayed name;
- it asks the generally trivial “Who was X's father/mother?” direction;
- Arabic gender agreement is wrong for the named person;
- the text is not a grammatical question, is malformed or uses raw slugs or
  internal family names;
- more than one displayed choice is true, a distractor is ambiguous, or the
  claimed answer is not supported by the cited evidence;
- a virtue description names its subject, bundles too much unrelated material,
  or is too vague to distinguish the answer;
- the question tests roster membership rather than the intended historical
  fact.

`AGENTS.md` will require this rubric whenever an agent generates or changes the
bank. Stored sex (`MALE`/`FEMALE`) informs generated Arabic templates, but the
reviewed wording is the final guard when sex is missing or the grammar needs a
more specific form. This is an editorial review, not a string-leak heuristic
run at quiz time.

### Topics and question families

The learner-facing topics become:

| Topic | Included question families |
| --- | --- |
| People | Kunya, person to title, title to holder, virtue to person |
| Battles | Battle Hijri year, reason a named person was excused from a named battle |
| Relationships | Reviewed person-to-person relationship questions |
| Ayat | Person to linked ayah |
| Events | Event Hijri year |
| Person circle | Every approved question materially involving the selected person, whether the person appears in the prompt or is the answer |

- The separate Titles topic is removed and both title directions join People.
  A person may hold several titles and a title may have several holders; the
  current exactly-one-title and exactly-one-claim guards are removed. Other
  true assignments are excluded from the displayed distractors.
- People no longer includes battle participation, relationships or ayat.
  Virtue questions use “Who is described as …?” with people as choices. The
  reviewing agent may shorten or clarify the Arabic prompt through its override
  without changing the answer or evidence.
- Battles excludes generic participation, generic absence and “Which battle did
  X join?” questions. It asks evidenced Hijri dates and evidenced reasons for
  an excused absence. The latter uses the cited absence summary as the answer.
- Relationships may retain separate single-answer candidates that share a
  prompt but have different correct answers, such as several children of one
  famous person. A quiz does not impose a one-question-per-prompt limit. Every
  displayed set must still contain only one true choice. Multiple-correct-answer
  questions are deferred.
- Ayat enumerates each evidenced person-ayah link instead of choosing one
  randomly from a coarse `field: "ayat"` claim.
- Question content is Arabic only for now. Quiz controls may continue to follow
  the selected interface language, but prompts and historical choice labels
  remain Arabic even under the English interface. English question fields and
  translations are deferred.

### Quiz assembly and interface

- A quiz request queries the approved PostgreSQL projection rather than running
  candidate and distractor queries serially. The requested quiz remains random;
  the bank is not a cache of whole quizzes.
- Available question counts are computed before starting. The picker offers
  only lengths the selected topic or person circle can satisfy and states the
  exact available count when fewer than five questions exist. It never promises
  5, 10 or 15 and silently returns fewer.
- The learner keeps the current one-question-at-a-time view, numbered palette,
  Previous/Next navigation and batch feedback. The only Submit button replaces
  Next on the final question. It may submit with unanswered questions, which
  count as incorrect.
- The UI renders the reviewed Arabic prompt and Arabic choice labels, never a
  raw family name, slug or unphrased subject. Results repeat the question,
  selected answer, correct answer and evidence link.
- `/quizzes/questions` is a public, read-only, unlinked and `noindex` review
  page. It uses server-side pagination with 50 rows per page and filters for
  status, topic, family, Arabic-prompt completeness and free-text search. Each row
  shows the generated and overridden prompt, four choices, marked answer,
  evidence links or excerpts, status, rejection reason and fingerprint. Access
  control and editing move to a future admin surface.

## Acceptance criteria

1. Generating the bank enumerates every eligible supported claim/link rather
   than one arbitrary question per subject or family, and creates stable keys
   for multiple relations, titles and ayat backed by one claim.
2. Generation accepts cited, non-disputed claims of every historical review
   status in every environment. No `NODE_ENV` branch enables a production-only
   historical-review gate.
3. Regeneration preserves decisions for unchanged fingerprints, resets changed
   candidates to pending and marks disappeared candidates retired. Rejected and
   retired records remain in the authored bank and PostgreSQL projection.
4. Only approved questions can appear in a learner quiz. The exact approved
   distractor set is preserved, while its display order may be shuffled.
5. The People, Battles, Relationships, Ayat, Events and Person-circle topics
   contain only the agreed families. There is no separate Titles topic and no
   generic participation question.
6. People title questions work for people with multiple titles and titles with
   multiple holders. Kunya and virtue questions render as grammatical Arabic
   questions rather than raw data labels.
7. Battle questions cover only evidenced Hijri dates and evidenced excused-
   absence reasons. Legacy seed dates without a cited claim do not enter the
   bank.
8. Relationship review rejects parent-of-subject questions and any question
   whose prompt reveals its answer. Child, spouse, sibling and other useful
   directions remain eligible for review.
9. Every approved person-subject prompt has correct Arabic gender agreement.
   This includes feminine battle wording such as `شاركت` rather than `شارك`.
10. A person circle includes approved questions where the person is either the
    prompt subject or an answer and can contain multiple questions from one
    family.
11. The quiz picker never offers an unsatisfiable length. The learner sees one
    question at a time and exactly one Submit button, on the final question.
12. `/quizzes/questions` provides the agreed public paginated and filtered
    inspection of all bank states and is not linked or indexed.
13. A warm 15-question API request performs no per-candidate historical-data
    queries and completes with one bounded question-bank read plus evidence
    resolution; the preview database is used to record a baseline and guard
    against the current serial-query regression.

## Affected components

Existing paths:

1. `CONTEXT.md` — quiz language updated during planning.
2. `docs/adr/0017-project-reviewed-quiz-questions-from-files.md` — authority and
   projection decision, proposed during planning.
3. `prisma/schema.prisma` and a new Prisma migration — question-bank projection,
   lifecycle, review fields, stable key, fingerprint, Arabic generated/override
   prompt, choices, answer, evidence and person associations.
4. `src/lib/quiz/types.ts` — revised topics, families, Arabic reviewed-question
   shape and lifecycle types; remove the environment-specific eligibility split.
5. `src/lib/quiz/generate.ts` — enumerate candidate records, add virtue, battle-
   date and excused-absence families, enumerate title/ayah assignments, and
   remove the single-title restriction.
6. `src/lib/quiz/assemble.ts` — sample approved projected rows instead of
   querying historical candidates serially; support availability and person-
   circle association in either direction.
7. `src/app/api/quiz/route.ts` — serve approved assembled questions and their
   evidence without an environment review-status gate.
8. `src/app/quizzes/page.tsx` — revised topic picker and availability, reviewed
   Arabic prompt/choice rendering, results wording and one final Submit button.
9. `src/components/language/translations.ts` — Arabic and English interface
   labels for the revised topics and review-page controls; question content
   itself remains Arabic.
10. `README.md` — update “What is implemented” after the feature ships.
11. `AGENTS.md` — short requirement to follow the question-review rubric when
    generating or changing the bank.

Proposed new paths:

1. `data/quiz/questions.json` — initial file-backed question bank. If it becomes
   unwieldy, shard it by topic without changing the domain model.
2. `docs/quiz-question-review.md` — agent review rubric.
3. `scripts/quiz/generateQuestions.ts` — merge regenerated candidates into the
   authored bank with stable keys, fingerprints and lifecycle transitions.
4. `scripts/quiz/projectQuestions.ts` — dry-run by default; `--apply` projects
   the bank into PostgreSQL.
5. `scripts/quiz/validateQuestions.ts` — structural, lifecycle, evidence and
   pending/stale checks.
6. `scripts/quiz/reviewQuestion.ts` — apply an agent decision, reason or Arabic
   prompt override to one stable key without editing generated answer data.
7. `src/app/quizzes/questions/page.tsx` — public paginated review page.
8. An API or server query module for paginated question-bank inspection; choose
   the shortest pattern already used by existing paginated pages during
   implementation.

Dependencies and order:

1. Add lifecycle/types and the reviewed-question database projection.
2. Build deterministic candidate generation, merge, review and validation
   scripts; generate the initial pending bank.
3. Run the agent review to completion, then project the reviewed bank.
4. Replace request-time assembly and revise the quiz API.
5. Update the learner UI and add the public review page.
6. Update repository instructions and implementation documentation.

The exact Prisma column decomposition and whether the file is initially one
JSON document or topic shards are implementation details. They must preserve
the stable-key, fingerprint, lifecycle, projection and Arabic-only behavior
above.

## Implementation result

The initial review produced 300 retained records: 262 approved, 34 rejected and
4 retired. The validated file projects to PostgreSQL with no drift. A direct
preview-database measurement of a 15-question People request took 716.6 ms on
the first run and 292.9 ms warm on 2026-09-27. The request performs one
availability count, one bounded question-bank read and one batched evidence
lookup; it performs no per-candidate query.

## Validation

Automated scenarios tied to the acceptance criteria:

- Extend `src/lib/quiz/generate.test.ts` for every new family; all historical
  review statuses; disputed and uncited exclusions; multiple titles, holders,
  relations and ayat; true-answer distractor exclusion; deterministic sets;
  stable keys; feminine and masculine template output.
- Extend or replace `src/lib/quiz/assemble.test.ts` for approved-only sampling,
  topic boundaries, person involvement in either direction, multiple questions
  per family, unsatisfiable lengths and choice-order shuffling.
- Add colocated tests for generation merge lifecycle: unchanged approval,
  changed fingerprint to pending, rejected preservation and retirement.
- Extend `src/app/api/quiz/route.test.ts` for revised topics, exact requested
  length, approved-only rows, Arabic prompt/labels, availability and removal of
  environment-specific claim-review eligibility.
- Add a colocated component test for `src/app/quizzes/page.tsx`. Its
  `next/navigation` mock must memoize `useSearchParams()` by search string, as
  required by `AGENTS.md`. Cover one final Submit button, unanswered submission,
  reviewed prompt rendering and insufficient availability.
- Add route/page tests for `/quizzes/questions`: pagination boundaries, filters,
  all lifecycle states, correct-answer display and `noindex` metadata.
- Run the generator, have an agent apply the documented rubric to every pending
  candidate, run validation clean, dry-run projection, inspect its diff, then
  apply it against the database configured by `.env`.
- Record query count and warm response time for a 15-question request on that
  database. The implementation must remove the current per-candidate serial
  query pattern; no browser timing threshold is inferred from network latency.
- Run `npm run lint`, `npx tsc --noEmit` and `npm test`.
- Perform browser verification only for behavior automated tests cannot settle:
  Arabic RTL layout, feminine phrasing, long virtue prompts, choice separation,
  dark/light themes, phone width, the sole final Submit control, and review-page
  pagination/filter usability.

## Data and operational consequences

- Add a PostgreSQL migration and a file-to-database projection. No historical
  catalog migration, Neo4j synchronization or graph-layout recomputation is
  required because questions add no historical subjects or relationships.
- Generation reads the existing cited historical data and writes only the
  question-bank file. Projection writes the database configured by `.env`,
  using dry-run and `--apply` behavior consistent with catalog scripts.
- The initial generation creates a potentially large pending review queue.
  Implementation is not complete until the agent has reviewed every candidate
  and validation passes. Previously approved unchanged rows may continue to be
  served while later candidates await review.
- File authority means direct edits to projected question rows are not durable.
  A future admin editor must write through to the authored bank or introduce a
  reviewed export workflow before database-first editing is enabled.

## Open issues

Implementation blockers: none.

Nonblocking assumptions:

- One JSON bank is adequate initially; sharding is a mechanical follow-up if
  diffs become unwieldy.
- A deterministic generated distractor set is reviewable even though its order
  is shuffled in each quiz.
- The public review page may expose answers and rejection reasons because the
  current solo API already sends answers to the client and the owner explicitly
  chose public access. It remains unlinked and `noindex`.

Deferred work:

- English question prompts and translated historical choice labels.
- Multiple-correct-answer question types.
- Authenticated admin access and browser-based editing.
- Party mode, timers, accounts, saved quiz history and progress.
- Difficulty scoring and adaptive question selection.
