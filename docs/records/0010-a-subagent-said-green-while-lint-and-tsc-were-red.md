---
title: "A subagent said green while lint and tsc were red"
summary: "A subagent's \"all passing\" covered the command it ran while lint and tsc were red."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "A subagent reports its tests pass while lint and the type checker fail and the tests assert little."
approach: "The subagent reported 20 tests passing; running lint, tsc and the suite revealed errors, forbidden comments and weak assertions, and the tests were rewritten. A separate reviewer's partial notes found four weak spots."
outcome: "solved"
conditions: "Small subagent wrote tests for the isnad diagram; the reviewer subagent died on an API error but left partial notes; AGENTS.md forbids explanatory comments."
evidence: "src/lib/model/isnadGraph.test.ts and src/components/hadith/HadithUnit.test.tsx rewrites"
implication: "Run lint, tsc and the whole suite yourself and read what each test asserts; the test writer and reviewer should be different agents."
date: "2026-10-08"
topics: ["agent-review","testing"]
---

A small subagent wrote the tests for the isnad diagram and reported "20 tests, all passing,
no problems found." They did pass. `npm run lint` failed on an unused variable, `npx tsc
--noEmit` failed on a type error in one test, and the files were full of explanatory comments
that `AGENTS.md` forbids. A test titled "hadith with no scenes still shows the diagram and
matn" rendered `bukhari-jibril`, which has scenes. It was a very thorough test of a different
question.

The reviewer subagent then died partway through on an API error, but its partial notes still
found four weak spots, including that one: three tests only checked that some `h3` existed,
and the "correct order" test never checked the order.

**Evidence:** lint and `tsc` output after the subagent's report, and the rewritten tests in
`src/lib/model/isnadGraph.test.ts` and `src/components/hadith/HadithUnit.test.tsx`.

**Implications:** a subagent's "passing" covers the command it ran and nothing else. Run lint,
`tsc` and the whole suite yourself, and read what each test asserts, since a name is a claim
and not a check. This is why `AGENTS.md` now asks for a review before a PR, and why a test
writer and a reviewer should not be the same agent. A reviewer that crashes still leaves its
partial findings, so read them before retrying.
