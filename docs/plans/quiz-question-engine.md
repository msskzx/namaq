# Quiz question engine

Status: **implemented**. This is the first plan under
[quizzes.md](quizzes.md): a pure, tested library that turns eligible
historical claims into multiple-choice questions. No API route, UI, party
mode, or accounts — those are separate, later plans that build on this one.

## Agreed behavior and scope

- **Data source:** PostgreSQL only, via `HistoricalClaim` joined with the
  subject's own table (`Person`, `Battle`, `Event`, `Title`). No Neo4j. Every
  question family needs is already present as a claim row, including
  person-to-person relations, even though the materialized graph edge for
  those lives in Neo4j.
- **Answer = canonical stored value**, not the claim's `assertion` text. The
  claim proves eligibility and supplies the evidence link; the value shown is
  read from the subject's own column or relation (`Person.kunya`,
  `Event.hijriYear`, `HistoricalClaim.relatedSubjectSlug`, a `Person.titles`
  or `Ayah` relation).
- **Seven families**, each forward-direction only (subject → value/entity —
  never a bare value as the prompt, since a value doesn't always determine a
  unique subject: `RELATION`, `PARTICIPATION`, `TITLE`, `TITLE_HOLDER`,
  `NAME`, `EVENT`, `QURAN_LINK`. `TITLE_HOLDER` (subject = the title,
  answer = a holder) is new relative to `quizzes.md`'s original six — it
  survives the forward-only rule because a title is a real, enumerable
  catalog subject, unlike a bare value such as a kunya.
- **Eligibility, as an answer:** `reviewStatus` in an explicit caller-supplied
  set (`['REVIEWED']` in production; all three statuses during this
  development phase) **and** `disputed = false`. `disputed` is the schema's
  dedicated conflict flag ("set when accounts conflict... independent of
  review status") — a claim can still be `disputed` after being fully
  reviewed, and that's exactly the case this excludes from being an answer.
- **Eligibility, as a distractor:** the same `reviewStatus` filter, but
  `disputed` claims remain eligible — a disputed value is still historically
  attested, just not confident enough to be "the" answer. The one rule that
  never relaxes: a distractor must never be true for the subject, checked
  against *all* of that subject's claims regardless of status or dispute.
- **`PARTICIPATION` is battle-only:** `relationshipType` is not
  battle-exclusive in the data (it also covers event involvement, e.g. a
  hijra), so the query filters `relatedSubjectKind = 'BATTLE'` explicitly.
  Single-select: one attended (or absent) battle is the answer, distractors
  are battles the person has no claim for at all.
- **`TITLE`/`TITLE_HOLDER` ambiguity guard:** a `field: "titles"` claim names
  no specific title. A person's title assignment is only used when it's
  unambiguous — exactly one eligible `titles` claim **and** exactly one title
  actually held. Otherwise the generator returns `null` rather than guess
  which claim backs which title.
- **`QURAN_LINK` is coarse by design:** a `field: "ayat"` claim backs "this
  person has Qur'an links," not one specific ayah. The answer is drawn from
  the person's linked `Ayah` rows directly once an eligible claim exists.
- **4 choices, fixed.** 1 correct + 3 distractors, order randomized by an
  injected `Random` (`() => number`) so tests are deterministic. Fewer than 3
  valid distractors → the generator returns `null` (skip), never a shorter
  option list.
- **A question's identity is its `claimId`**, not `(subject, family)` — a
  subject can have several eligible claims in one family (e.g. both a
  `FATHER` and a `WIFE` relation claim). `TITLE` and `TITLE_HOLDER` for the
  same (person, title) pair are generated from the *same* claim row, read
  from either side.
- **No phrasing, no AI model.** The engine returns structured data only
  (family, attribute, subject, choices, evidence) — no question text in any
  language. Nothing here calls an external model; every value and distractor
  is a deterministic, already-free database query.

## Acceptance criteria

- Each of the seven `generate*Question` functions returns a `QuizQuestion`
  matching its family's shape when given a subject with a qualifying claim
  and at least 3 valid distractors.
- Each returns `null` when: no eligible claim exists, fewer than 3 valid
  distractors exist, or (for `TITLE`/`TITLE_HOLDER`) the title assignment is
  ambiguous.
- A `disputed` claim is never returned as the backing claim of a question's
  answer, but a `disputed` value can appear among `choices` as a distractor.
- The `reviewStatus` filter passed via `QuizEligibility` is applied to every
  query that selects an answer or a distractor.
- `PARTICIPATION` never surfaces an event-involvement claim as a battle
  question.

## Affected components

New, none proposed elsewhere:

1. `src/lib/quiz/types.ts` — `QuestionFamily`, `QuizEligibility`,
   `QuizQuestion`.
2. `src/lib/quiz/random.ts` — `sampleDistinct`, `placeAnswer`; pure, no
   dependency on order 1.
3. `src/lib/quiz/generate.ts` — the seven `generate*Question` functions;
   depends on 1 and 2, and on `src/lib/prisma.ts` (existing).

No existing file changes. Order: 1 → 2 → 3 (2 can happen alongside 1).

## Validation

- `src/lib/quiz/random.test.ts` (built): deterministic sampling and answer
  placement given an injected random sequence.
- `src/lib/quiz/generate.test.ts` (built): one happy path and one skip case
  per family, mocking `@/lib/prisma` in the pattern
  `src/app/api/graph/suggest/route.test.ts` uses. 17 tests.
- Repository checks: `npm run lint`, `npx tsc --noEmit`, `npm test` — all
  pass (1027 tests total, including the pre-existing suite).
- No visual/browser verification needed: no UI or route in this plan.

## Data and operational consequences

None. Every query is a read; no migration, sync, or layout recompute. The
existing `HistoricalClaim`/`Citation`/`Person`/`Battle`/`Event`/`Title`/`Ayah`
tables are read as-is.

## Open issues

Blockers: none.

Deferred, recorded so they aren't lost:

- **Quiz-assembly dedupe.** When a later plan assembles a set of questions
  for one quiz, it must never use the same `claimId` twice — this is what
  keeps `TITLE` and `TITLE_HOLDER` for the same pair (or any two questions
  sharing one claim) from both appearing and giving each other away. The
  identity choice here already makes this a one-line check for that plan;
  no work needed now.
- **Kunya questions are noted as hard** (kunya strings recur across many
  people) — no action taken in this plan beyond keeping `NAME` forward-only.
- **Reverse-direction families** (value as prompt) beyond `TITLE_HOLDER` are
  out of scope — a bare value (a kunya, a year) doesn't determine a unique
  subject the way a title does.
- **AI-assisted phrasing or distractor scoring** (e.g. Jev) — considered and
  explicitly kept out. Nothing here needs it: every value and distractor is
  a deterministic, already-free query. `quizzes.md`'s existing carve-out
  ("a language model could later write extra phrasings... would need review
  before it shipped") is where this would belong, once there's a UI copy
  layer to review against.
- **API route, UI, party mode, realtime transport, accounts** — all
  untouched, per `quizzes.md`.
