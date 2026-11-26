---
status: accepted
---

# A party's questions are fixed when the host starts it

When the host starts a party, the party's Durable Object
([ADR 0031](0031-a-live-party-runs-in-one-durable-object.md)) calls
`/api/quiz` once with the host's settings, the same call a quiz taken alone
makes. The object, not the host's device, makes the call, because the response
carries the correct answers and the host also plays. Every player then gets the
same questions in the same order, and the object grades the answers. This is
the party's only database read, so Neon wakes once per party, as it does for a
quiz taken alone.

A party grades as a quiz taken alone does, with the same answer check for
shared-openings questions. Such a question earns one point per correct leaf the
player was asked to type, and any other question earns one point. The scoring
now lives in client components (`branchPoints` in
`src/app/quizzes/BranchAnswers.tsx` and the choice check in
`src/app/quizzes/page.tsx`), so it moves to `src/lib/quiz` for both to share.
A party has no speed bonus, because points would then depend on each device's
network delay.

## Amended 2026-11-26: the phone app's host builds the questions

The phone app must work without the website (release 1 is phone only), and a
party whose questions came from `/api/quiz` failed to start whenever the site
was down. So the app's host builds the questions on the phone from the bundled
data (`partyQuiz` in `mobile/src/lib/quiz.ts`, the same shared builders the
website's `assembleQuiz` uses) and sends them with its start action. The
object takes them, and every player still gets the same questions and is graded
by the object. The host's phone holds the answers, which the screen never shows;
the owner does not mind cheating in a party (2026-10-26). A start without
questions, from the website, still makes the object call `/api/quiz`.

## Considered options

- Each device builds its own quiz. Players would get different questions, and
  the leaderboard would compare different quizzes.
- A second quiz builder that reads `data/quiz/` and the Quran files and never
  touches Neon. It saves one database read per party, at the cost of two ways
  to build a quiz that can disagree.

## Consequences

The object sends a choice question's correct answer to devices only at its
reveal. A shared-openings question carries its whole tree from the start, as in
a quiz taken alone, because the answer inputs are drawn on that tree. The lobby
settings are the same settings `/api/quiz` accepts today, so a party can
contain nothing a quiz taken alone cannot.
