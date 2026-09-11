# Working on Namaq

Rules for any agent (Claude Code or otherwise) making changes in this repo.

## Writing

- Invoke the `write-comments` skill before writing or editing code comments,
  and `unslop` before writing prose — docs, commit messages, PR descriptions.
  Both apply to every change, not just documentation work.

## Testing

- New functionality must be covered by automated tests. **Search and graph
  features are the highest priority**
- Colocate tests next to the code they cover, named `<file>.test.ts(x)`
  (see `src/lib/subjectSearch.test.ts`, `src/lib/canonicalPeople.test.ts`).
  Run with `npm test` (Vitest).
- Component tests that touch `next/navigation` need a reactive mock —
  `useSearchParams()` must return a stable reference per unique search
  string (memoize it), or dependency-array-based effects will misbehave
  in ways that look like real bugs but aren't. See
  `src/components/graph/GraphSearch.test.tsx` for a working pattern.
- Before considering a change finished: `npm run lint`, `npx tsc --noEmit`,
  and `npm test` should all pass.

## Local verification

- Local dev requires a running PostgreSQL **and** Neo4j instance (see
  README "Local setup"). Real credentials for both live in `.env` at the
  repo root; each git worktree needs its own `.env` symlinked to that
  file (`ln -s <main-checkout>/.env .env`, where `<main-checkout>` is the
  absolute path of the primary clone) — check for this symlink before
  assuming infra is unavailable. Seed/sync commands
  (`npm run seed:*`, `npm run people:sync`, `npm run battles:sync`)
  should work once it's in place. Only say local verification isn't
  possible if the symlink is present and the commands still fail.
- Don't reach for browser computer-use (screenshots, clicking, typing)
  by default. Only use it when the user asks for it, or when it's
  necessary to verify something lint/tsc/tests can't catch — e.g. actual
  rendered layout, force-graph physics, or other visual behavior.

## Git

- Keep worktrees inside the main checkout, under a root named for the agent that
  creates them: Codex uses `.codex/worktrees/<branch-name>` with
  `codex/<branch-name>` branches, Claude Code uses `.claude/worktrees/<branch-name>`
  with `claude/<branch-name>` branches. Any other agent follows the same shape
  under its own dot-directory. Home-directory roots such as `~/.codex/worktrees` are not
  the project default. For desktop-created worktrees, set Settings > Worktrees >
  Worktree root to the matching repository-local path; this file does not change
  the app setting automatically.
- In every new worktree, create and verify the `.env` symlink described under Local verification before running project commands. Reuse the main checkout's file; preserve an existing file instead of overwriting it.
- Branch names should not contain numbers.
- Commit messages follow Conventional Commits: `type(scope): summary`
  (e.g. `fix(graph): ...`, `feat(search): ...`, `test(pipeline): ...`),
  matching existing history.
- PR descriptions must include a summary of what changed and why, not
  just a list of touched files.

## Shared components

- Every action button goes through `src/components/common/Button.tsx` rather
  than repeating Tailwind classes inline. Pick `variant` (`primary` for the
  filled amber call to action, `outline` for everything else), `size`
  (`sm`/`md`/`icon`), and `active` for a control that stays pressed; pass
  `href` to render a `next/link` that looks identical, so a link and a button
  sitting side by side match. Reach for `className` only for layout
  (`shrink-0`, width), never to restyle the button itself.
- This covers controls that read as buttons. Switches (`SlideSwitch`, the
  analytics pill), the icon switchers for theme and language, the cookie
  banner, and the slider's dot indicators are deliberately separate: they are
  different controls with their own semantics and design language, and folding
  them in would change how they look and what they announce.
- Rows in a suggestion or node list are buttons for the keyboard, not controls
  that read as buttons: they stack multiple lines, fill their row, and carry no
  border. Leave them as plain `button` elements.
- Every button carries an icon beside its label, from Font Awesome's free solid
  set. Pick one that names the action rather than decorating it, and reuse the
  icon an action already has elsewhere (Start over and Reset share the rotate
  arrow, View profile shares the person). A horizontal arrow has to be mirrored
  by writing direction, so that back points the way the reader came in Arabic as
  well as English (see `src/components/common/Pagination.tsx`); a vertical arrow
  needs no such care.
- Titles and other short labelled chips use `src/components/common/Badge.tsx`
  (`size="sm"` inside dense panels), so a title looks the same on a profile
  page and in the graph panel.

## Data model

- Person data has two sources of truth: PostgreSQL (profiles, search) and
  Neo4j (graph nodes/relationships), linked by `slug`. Don't edit one
  without the other — go through the canonical people pipeline
  (`scripts/people/syncCanonicalPeople.ts`, `npm run people:sync` /
  `npm run people:validate`) so both stay in sync.
- `npm run graph:layout -- --apply` (graphRank/clusterId/layoutX/layoutY)
  computes centrality over **every** unified-graph edge, regardless of
  relationship type (`src/lib/fetchUnifiedGraph.ts`'s `MATCH (a)-[r]->(b)`,
  untyped). Any
  change to graph structure — new people, new relations, or especially a
  new relation *type* connecting many nodes (e.g. the COMPANION_OF edges
  added 2026-08-23) — shifts the ranks and the unified layout. Re-run it
  (dry run first, review the diff, then `--apply`) after seeding any such
  change; skipping this leaves ranks/layout stale relative to the graph
  they're supposed to describe.

## Data pipelines

- [docs/data-pipelines.md](docs/data-pipelines.md) describes how data reaches
  the app: the three hand-authored paths (seed files under `prisma/`, history
  batches under `data/history/`, graph seeds under `neo4j/`), which of them
  write to PostgreSQL and which write straight to Neo4j, and which syncs are
  one-way. Read it before authoring or applying a canonical change. Two of the
  seed paths look live and are not: `prisma/personSeedData.ts` is no longer
  imported, and battle participations are not seeded at all.

## Historical evidence data

- Curated historical records live in `data/history/batches/<batch>/`, separate
  from application code: `batch.json` holds source editions, source accounts and
  claims with their citations; `accounts/<subject>/NNN.md` holds one printed page
  of the work's text, with `NNN.notes.md` beside it for that page's editorial
  footnotes. `summary.md` is the review summary.
- **Do not read a whole account to answer a question.** Open `batch.json` for the
  structure and the claims, then only the pages a citation names. Each page's
  paragraphs carry anchors like `9-p7` that citations point at.
- Files are the source of truth; the database holds a copy. Change the files and
  re-import, never edit the database directly. `npm run history:validate --
  <batch dir>` before proposing a batch, and `npm run history:import -- <batch
  dir>` for a dry run. Import applies only the revision recorded as approved in
  `batch.json`, so any edit after approval needs approving again.
- Two separate actions gate a batch, and neither implies the other.
  **Approving for publication** records the current revision in `batch.json`'s
  approval block, which is what lets `npm run history:import -- --apply` write.
  It says the batch may be published and says nothing about anyone having read
  it. **Marking reviewed** sets a claim's `reviewStatus`, one claim at a time,
  after someone compares the assertion against the passage. A batch approved
  for publication whose claims are all Not reviewed is a normal and honest
  state, and the approval note should say so.
- Record data at whatever review status is honest and let it be visible; review
  status never hides data (`docs/adr/0008-separate-review-from-visibility.md`).
  Leave an unknown structured value unset rather than inventing one.
- **The source text is the book; the app structures a selection from it.** The
  account pages are authoritative and are never edited or removed to reflect a
  change in what the app models. Removing a claim removes a selection, never the
  passage it selected from.
- **Author a claim only when it backs a value the model holds today**: a profile
  field, a title assignment, a participation, an event link, or a person
  relation. A claim that names neither a field nor a relationship is rejected by
  `npm run history:validate`. The entry is already preserved page by page, so
  such a claim is a second copy of text rather than evidence.
- Competing accounts are kept as separate attributed claims **only where the
  model holds the value they compete over**, such as two death years. A
  disagreement about something the app does not record stays in the source
  pages, where it already is.
- Transmission chains stay in the source text. A person mentioned only as a
  narrator does not become a graph node or an edge.

## Content sources

- Companion (صحابي) names/biographies are being sourced from *سير أعلام
  النبلاء* (al-Dhahabi) on islamweb:
  - Full book text: https://www.islamweb.net/ar/library/content/60/1/سير-أعلام-النبلاء?idfrom=1&idto=6537
  - Book's companion index/tree (list of entries, useful for enumerating
    names without paging through the full text): https://www.islamweb.net/ar/library/maktaba/nindex.php?id=2&treeLevel=1&bookid=60&page=bookssubtree&searchtext=&showexact=
  - Extraction proceeds in batches (currently batches of 10), following
    the book's own ordering, and checks each name against existing
    `prisma/personSeedData*.ts` slugs before treating it as new.

## UI

- This app is Arabic-first and bilingual. New user-facing text needs both
  `en` and `ar` variants — either add both to
  `src/components/language/translations.ts` or follow the existing
  `language === 'ar' ? ... : ...` pattern used inline.
- New UI should support both light and dark themes (Tailwind `dark:`
  variants), matching the rest of the app.
- Use a shared button component with optional icon support; extend the existing
  component, or add one if none exists. Add recognizable icons when they clarify
  an action at a glance. Keep text labels for clarity, give icon-only buttons
  accessible names, and follow the app's existing icon style and RTL direction.

## Documentation

- New features get a line in `README.md` under "What is implemented",
  in the relevant existing subsection (or a new one if it doesn't fit).
