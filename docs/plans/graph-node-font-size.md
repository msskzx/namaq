# Node label size in the graph: future plan

Status: not built. Node labels are drawn at a fixed base size of 12 in
`src/components/graph/GraphSurface.tsx` (`NODE_BASE_FONT_SIZE`), shrunk further
as the reader zooms out (`Math.min(12 / globalScale, NODE_BASE_FONT_SIZE)` in
`nodeBox`). On a large graph the labels are too small to read, and nothing lets
the reader change that.

## Proposal

Give the graph the same size control the book reader has
([book-reader-design.md](../book-reader-design.md), "Settings"): four discrete
steps, S / M / L / XL, saved per device in `localStorage`, independent of the
site theme.

- The steps scale `NODE_BASE_FONT_SIZE`. Both the visible pass and the
  hit-area pass read the same value through `nodeBox`, so a node's click target
  grows with its label.
- The control lives in the fullscreen pane, beside the other view controls, as a
  `Button` with an icon and an accessible name, following the button rules in
  `AGENTS.md`.
- The saved choice loads on mount and falls back to M, as the reader does
  (`namaq-reader-settings` in `SourceAccountReader.tsx`). Use its own storage
  key, since the two settings are unrelated.
- The inline graph on a profile and the homepage preview keep M, since they have
  no controls.

## Open questions

- Whether larger labels should also widen the node boxes so labels overlap less,
  given every node has a precomputed position
  ([ADR 0005](../adr/0005-use-a-precomputed-global-graph-map.md)) that does not
  move with the label size.
- Whether the size should scale with zoom differently once it is user-set, since
  today the label shrinks as the reader zooms out.
- Whether an Arabic-capable font choice belongs here too. The canvas draws
  labels in `Sans-Serif`, not Amiri.

## Tests when built

Cover the four steps, the saved value and its fallback, and that `nodeBox`
returns a larger box for a larger step. See `GraphSurface` and the existing
graph tests for the mocks.
