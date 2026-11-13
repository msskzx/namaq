# A fix in the code does not fix the rows built before it

A fix in the code did not change the stored rows built before it, and the page kept serving them.

Kind: detour · Outcome: solved · Date: 2026-10-08 · Topics: data-sync, testing

**Problem:** A code fix has no effect on a page because it reads stored rows built by the old code.

**Fix:** After fixing sceneLines, the page still showed the repeat; the page reads model_units first. Re-running the projection from the checkout holding the change fixed it, after a first run from the main checkout rebuilt the old output.

**When it applies:** Page reads model_units and falls back to files only when the row is missing; the projection command was run against the preview environment.

**Rule it changes:** After changing code that builds a stored view, run the projection from the checkout that holds the change and say so in the PR; consider storing a builder version in each row.

**Evidence:** npm run model:project -- --units --root src/lib/model/fixtures/jibril --apply --env preview; src/lib/model/hadithView.ts

**Same problem as:** [0007](0007-a-page-that-reads-the-repo-at-request-time.md)

## What happened

Scene 1 of both hadith began by repeating the last narrator of the isnad: `عَنْ أَبِي هُرَيْرَةَ،`
right under a bubble already labelled `أَبِي هُرَيْرَةَ`. The cause was one line in
`sceneLines` (`src/lib/model/hadithView.ts`) that started the scene at the last isnad link
instead of after it. The fix was small, the new test passed, and the page on localhost still
showed the repeat.

The page reads `model_units` first and only falls back to the files when the row is missing,
so it was faithfully serving a view built before the fix. The owner then ran the projection
to rebuild the rows. Nothing changed. That command ran in the main checkout, which did not
have the branch, so it rebuilt the rows from the old code with great care. Running the same
command from the worktree finished the job.

**Evidence:** the same text on screen after the fix, then the correct text after the second
projection (`npm run model:project -- --units --root src/lib/model/fixtures/jibril --apply
--env preview`, run from the checkout that holds the change). The unit test never saw the
problem, because `hadithView` builds from the files and the page does not.

**Implications:** a green test says the builder is right, not that the page is. Any change to
the code that builds a stored view needs a projection run from the checkout that holds the
change, and the PR should say so. An improvement axis: store a builder version or a hash in
each `model_units` row, and let the page rebuild from the files when it does not match, so a
stale row cannot outlive the code that made it. Same family as
[0007-a-page-that-reads-the-repo-at-request-time](/records/namaq/0007-a-page-that-reads-the-repo-at-request-time).
