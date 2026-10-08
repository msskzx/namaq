# It worked on Node 22 and failed on CI's Node 20

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
