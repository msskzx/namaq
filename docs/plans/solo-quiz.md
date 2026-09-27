# Solo quiz

Status: **implemented; quality redesign planned** in
[reviewed-quiz-bank.md](reviewed-quiz-bank.md). The second plan under [quizzes.md](quizzes.md):
assembles the [quiz question engine](quiz-question-engine.md)'s questions into
a solo quiz, serves them over one API route, and lets a reader take one at
`/quizzes`. Party mode is unaffected and still blocked on the realtime
transport decision in `quizzes.md`.

## Agreed behavior and scope

- **No timer.** Solo is self-paced; nothing here is scored by speed.
- **Free navigation.** A question palette lets the reader jump to any
  question, in any order, skip one and return to it later. Answering order
  is independent of feedback timing (below).
- **Batch feedback, not per-question.** Unlike the party game (whose
  `Question → Reveal` cycle is the mechanic that makes it a shared, live
  moment — see `quizzes.md`), a solo quiz reveals nothing until the whole
  quiz is submitted. This is a deliberate difference between the two modes,
  not an oversight: solo has no live moment to protect or create, so batch
  review at the end fits a self-paced study session better than an
  instant-per-question interruption.
- **Why `correctAnswer`, not `correctIndex`.** The engine originally shipped
  `correctIndex: number`. Revised here to `correctAnswer: string` because an
  index is only meaningful for one specific ordering of `choices`, and a
  future party mode may reshuffle choices per player/screen — a value
  survives that; a position computed once does not.
- **One shared assembly function for both modes.** `assembleQuiz()`
  (`src/lib/quiz/assemble.ts`) takes a topic, length, eligibility and a
  `Random`, and returns `QuizQuestion[]` — nothing in its signature assumes
  a single player. Party mode, when built, calls the same function to build
  a room's question set; only the *delivery* (one-shot for solo, round-by-
  round reveal for a room) differs, and that lives in the route/session
  layer, not here.
- **Topic → family mapping.** A topic selects *which families* run, except
  "a person's own circle," which fixes one subject instead:

  | Topic | Families | Subject scope |
  | --- | --- | --- |
  | People | `RELATION`, `TITLE`, `NAME`, `QURAN_LINK`, `PARTICIPATION` | any person |
  | Battles | `PARTICIPATION` | any person |
  | Titles | `TITLE_HOLDER` | any title |
  | Events | `EVENT` | any event |
  | A person's own circle | `RELATION`, `TITLE`, `NAME`, `QURAN_LINK`, `PARTICIPATION` | one fixed person |

  A person's own circle therefore caps out at 5 questions (one attempt per
  family) regardless of the requested length, since it never widens to a
  second subject. Not solved here — noted under Open issues.
- **Length is a fixed choice: 5, 10, or 15.** Not a free integer.
- **Candidate pools are loose, not pre-verified.** `assembleQuiz` fetches a
  rough candidate list per family (matching its shape, e.g. any claim with
  `relationshipType` set for `RELATION`) and lets each `generate*Question`
  call do the precise eligibility check, returning `null` for a candidate
  that doesn't pan out. Simpler than duplicating each generator's exact
  eligibility query twice.
- **A question's identity is still its `claimId`** (from the engine plan).
  `assembleQuiz` tracks used claim ids and skips a candidate whose claim is
  already in the quiz — this is the one-line dedupe the engine plan
  deferred, and it's what stops `TITLE` and `TITLE_HOLDER` for the same pair
  from both appearing.
- **Fully stateless.** No new database model. A quiz is generated fresh per
  request and lives only in the browser; nothing is saved. History/progress
  is explicitly deferred to [user-accounts.md](user-accounts.md).
- **One route, whole quiz.** `GET /api/quiz?topic=&length=&person=` returns
  every question up front, `correctAnswer` and evidence links included —
  there is no opponent to protect an answer key from in solo mode, and
  free navigation needs every question in hand anyway.
- **URL carries topic/length/person, not progress.** A quiz link is
  shareable and Back/Forward makes sense before starting. Current question
  index and answers-so-far are not in the URL — refreshing mid-quiz loses
  progress, which is an acceptable, low-cost tradeoff for something instant
  and free to regenerate.
- **Evidence resolves to Namaq's own reader**, not the raw citation. The
  route batches a `Citation` lookup and turns a person-subject citation into
  `/people/<slug>?book=<accountId>&page=<sequence>`, matching
  `ClaimEvidence.tsx`'s existing link shape. A non-person citation (there are
  none in the data yet) gets no link rather than a guessed one.

## Acceptance criteria

- `assembleQuiz` returns up to `length` questions, spanning every family a
  topic maps to, with no two questions sharing a `claimId`.
- A person's-own-circle quiz only ever uses the given `personSlug` as the
  subject and returns at most 5 questions.
- `GET /api/quiz` rejects an unknown topic, an unknown length, and a
  `PERSON_CIRCLE` request with no `person`, each with 400.
- A successful response's questions carry resolved `evidence.readerUrls`
  for every citation that has one.
- The `/quizzes` page: picks topic/length (and a person for that topic) via
  the URL; lets the reader jump to any question and skip/return; reveals
  nothing until Submit; shows a score and, per question, the reader's
  answer, whether it was correct, and evidence links, only after
  submission.

## Affected components

1. `src/lib/quiz/types.ts` (revised) — `correctIndex` → `correctAnswer`;
   added `PRODUCTION_ELIGIBILITY`/`DEVELOPMENT_ELIGIBILITY`, `QuizTopic`,
   `QuizLength`.
2. `src/lib/quiz/random.ts` (revised) — `placeAnswer` replaced by a generic
   `shuffle` plus `shuffleChoices` built on it.
3. `src/lib/quiz/generate.ts` (revised) — all seven generators updated to
   the new `correctAnswer` shape.
4. `src/lib/quiz/assemble.ts` (built) — `assembleQuiz`, the shared
   mode-agnostic assembly function.
5. `src/app/api/quiz/route.ts` (built) — the solo route, plus citation →
   reader-URL resolution.
6. `src/app/quizzes/page.tsx` (built) — the picker, question, and results
   views.
7. `src/lib/siteLinks.ts`, `src/components/language/translations.ts`
   (revised) — nav entry and the `quizzes` label, `en`/`ar`.

Order: 1 → 2 → 3 → 4 → 5 → 6, with 7 alongside 6.

## Validation

- `src/lib/quiz/random.test.ts`, `generate.test.ts` (revised for
  `correctAnswer`), `assemble.test.ts` (built): family coverage, claim-id
  dedupe, a declined candidate being skipped, person-circle fixing its
  subject, and an empty result when person-circle has no person.
- `src/app/api/quiz/route.test.ts` (built): the three 400 cases and a
  success case asserting resolved `readerUrls`.
- Repository checks: `npm run lint`, `npx tsc --noEmit`, `npm test` — pass
  (1037/1038; the one failure, `graphIntegrity.live.test.ts`, is a
  pre-existing live-database drift check unrelated to this change, per
  `docs/plans/backend-issues.md`).
- No component test for `/quizzes` itself in this pass — it composes
  already-tested pieces (`assembleQuiz`, the route, `Button`) with fairly
  thin client state; a dedicated test is straightforward to add if this
  page grows logic of its own.

## Data and operational consequences

None. Every new query is a read; no migration, sync, or layout recompute.

## Open issues

Blockers: none.

Deferred:

- **A person's-own-circle quiz can't reach a requested length past 5** — it
  never widens past the one fixed subject. Extending each generator to
  return more than one eligible claim per family (not just the first
  `findFirst` match) would let it produce several questions from one person;
  out of scope here.
- **The person-circle topic's person picker is a plain slug text input**,
  not the existing search-and-select components (`GraphSearch`,
  `PeopleSearch`) — reusing one of those is a natural follow-up, not a
  blocker for this pass.
- **No visual/browser verification performed** — a text-only review; run
  the dev server and check RTL, dark mode, and phone width before
  considering this fully done end to end.
- Party mode itself: still fully out of scope, per `quizzes.md`.
