# A tree answer must preserve the path, including where a text ends

Completing every branch node requires whole-subtree matching and citations on internal nodes as well as leaves.

Kind: challenge · Outcome: solved · Date: 2026-10-19 · Topics: text-matching, ui-state, testing

**Problem:** A free-text quiz must ask for every node of a compressed text tree while accepting reordered answers without detaching children from their parents.

**Fix:** Reused the explorer tree with custom non-root fields, required every node's complete words, paired whole subtrees by shape, and retained each node's ending-text references in feedback.

**When it applies:** Shared-opening questions derived from Quran ayat; pieces contain at most six ayat; one ayah may end at a node that also has children.

**Rule it changes:** Test completion and feedback against a real tree containing an internal terminal node, not only synthetic trees whose texts all end at leaves.

**Evidence:** src/lib/quiz/branchAnswers.ts; src/app/quizzes/BranchAnswers.tsx; src/lib/quiz/branchQuestions.test.ts

## What happened

The shared-opening quiz previously asked for the first split. Asking for the
whole tree changes what an answer means: every non-root node needs all its words,
and sibling reordering must move a parent together with its descendants.
The implementation reuses the explorer's renderer and pairs subtrees only when
their shapes agree, choosing the pairing with the most correct nodes.

The real يطوف عليهم tree exposes a quieter constraint. Of its three non-root
nodes, ولدان مخلدون ends 56:17 and also has a child continuing 76:19. A leaf-only
citation pass would lose 56:17 even though the tree still looked complete.
Feedback keeps the references held by every node.

**Evidence:** `src/lib/quran/branches.ts` (since moved)
keeps ending ayat separately from children;
`src/lib/quiz/branchAnswers.ts` (since moved) pairs subtrees;
[`src/app/quizzes/BranchAnswers.tsx`](../../src/app/quizzes/BranchAnswers.tsx) renders each
matched node's references. The real-tree assertion lives in
`src/lib/quiz/branchQuestions.test.ts` (since moved).

**Implications:** test a real tree whose internal node also ends a text. Checking
only leaf count or a flat bag of answer strings cannot prove that paths and
references survived.
