# Quality examples

Real cases found while improving the code: what was wrong, what it caused, which check found it, and the fix.
New checks add their cases here, so later work can learn from them.

## A hook after an early return (step 1, lint)

- **Where:** `mobile/src/components/MatrixCard.tsx`, `Cell`.
- **Wrong:** `if (!cell) return …` came before `useContext` and `useState`.
- **Effect:** React needs the same hooks in the same order on every draw. A cell that goes from empty to
  filled draws with two more hooks than before, and the app crashes with "Rendered more hooks than during the
  previous render".
- **Found by:** `react-hooks/rules-of-hooks`.
- **Fix:** the two hooks moved above the early return.

## A comment that justified skipping a check (step 1, lint)

- **Where:** `mobile/src/components/SearchResults.tsx`, the search effect.
- **Wrong:** the effect leaves `keep` out of its dependency list, and a comment explained why ("a fixed rule
  of the page that calls this").
- **Effect:** nothing stops a later page from passing a `keep` that changes. Search would then keep filtering
  by the old rule. The comment can't be enforced, which is exactly what a comment shouldn't be doing.
- **Found by:** `react-hooks/exhaustive-deps`.
- **Fix for now:** the comment is gone and a lint directive marks the exception. Step 7 replaces the effect with
  a shared debounce helper.

## A lint autofix that broke the types (step 1, tooling)

- **Where:** `mobile/src/components/BranchTree.tsx`.
- **Wrong:** `import/no-duplicates --fix` merged `import type { … }` with a value import into one
  `import type`, so five values became types only.
- **Effect:** `tsc` failed. Lint and the type check have to run together, and an autofix is not trusted
  until `tsc` passes.
- **Fix:** one import with inline `type` markers.
