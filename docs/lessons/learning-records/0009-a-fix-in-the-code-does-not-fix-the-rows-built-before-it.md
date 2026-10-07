# A fix in the code does not fix the rows built before it

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
[0007-a-page-that-reads-the-repo-at-request-time](0007-a-page-that-reads-the-repo-at-request-time.md).
