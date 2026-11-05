# Branch studio and video export

The studio should follow the rendered tree from its roots, completing each subtree before moving to its sibling. Playback and export share the same traversal and path highlighting.

Acceptance criteria:

- Traverse depth first, including ayat ending at internal nodes and an empty root joining several starts.
- Draw the connector leaving a parent before the connector entering its child and then reveal the child. Pause freezes drawing and the answer timer.
- Keep the current path lit during playback, then restore the user's pinned paths.
- Put Reset beside Play. Replay retains a Play icon after completion so only Reset carries the rotate arrow. Reset stops playback, clears timer and drawing state, and leaves the studio open with its preferences intact.
- Offer a one-second answer timer alongside the existing durations and unlimited wait. Enabled timer controls use accent color.
- Display an animated hourglass with draining sand and a small localized seconds countdown below it inside a solid waiting node. Unlimited waits remain tappable, and timed waits can also be revealed with a tap or keyboard.
- Give the server-supplied navigation header a stable key and verify that the hydrated page emits no React key warning.
- Export the same animation and hourglass without a tree title or app URL. Use "اكمل الايات" for the Arabic prompt and "Complete the ayat" for the English studio control.

The affected paths are `src/app/quran/branches/{BranchTree,Filters,Grow,GrowVideo}` and `src/lib/quran/{growth,hourglass}`. Tests cover traversal, connector order, controls, pause/reset, and canvas output. Verify the rendered waiting node and run lint, TypeScript, the full Vitest suite, and a production build before opening the PR.
