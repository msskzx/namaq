# It worked on Node 22 and failed on CI's Node 20

Tests passed on Node 22 and failed on CI's Node 20 because of a built-in Node 21 introduced.

Kind: detour · Outcome: solved · Date: 2026-10-08 · Topics: runtime-versions, build-tooling

**Problem:** Code that passes tests and type checks locally fails on CI because it uses a built-in that the CI runtime's Node version lacks.

**Fix:** Map.groupBy, added in Node 21, failed on CI's Node 20 after passing on the laptop's Node 22.5; replacing it with a plain Map and a loop held.

**When it applies:** Laptop on Node 22.5, .github/workflows pins Node 20, TypeScript lib includes Map.groupBy, tsconfig target ES2017, no engines field in package.json.

**Rule it changes:** Before using a newer built-in, check the Node version the workflow pins, and set an engines field or match Node locally.

**Evidence:** CI log (orderingProblems src/lib/catalog/ordering.ts); workflow node-version: 20

## What happened

All 2,184 tests passed on the laptop and CI failed on the first run of PR C with
`TypeError: Map.groupBy is not a function`. The grouping of orderings by source used
`Map.groupBy`, which Node 21 introduced. This machine runs Node 22.5 and
`.github/workflows` pins Node 20. The type checker said nothing, because the TypeScript
`lib` here includes it, and the first reviewer had noted exactly that ("`Map.groupBy` is fine on
Node 22.5.1; tsconfig `target` is ES2017 and package.json has no `engines` pin") and called it
fine. It was the one line of the report that mattered.

**Evidence:** the failing run's log (`orderingProblems src/lib/catalog/ordering.ts`), the
workflow's `node-version: 20`, and the fix: group with a plain `Map` and a loop.

**Implications:** "passes locally" and "type checks" prove less than they seem when the
runtime differs from CI's. Before using a newer built-in (`Map.groupBy`, `Object.groupBy`,
`Set` union methods), check the version the workflow pins, not the one on the machine. A reviewer
that hedges on a runtime detail is telling you which command to run next; a one-line
`engines` field in `package.json`, or the same Node version locally, would have turned this into a
local failure.
