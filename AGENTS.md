# Working on Namaq

Rules for any agent (Claude Code or otherwise) making changes in this repo.

## Testing

- New functionality must be covered by automated tests. **Search and graph
  features are the highest priority**
- Colocate tests next to the code they cover, named `<file>.test.ts(x)`
  (see `src/lib/personSearch.test.ts`, `src/lib/canonicalPeople.test.ts`).
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
  file (`ln -s /Users/msskzx/Projects/namaq/.env .env`) — check for this
  symlink before assuming infra is unavailable. Seed/sync commands
  (`npm run seed:*`, `npm run people:sync`, `npm run battles:sync`)
  should work once it's in place. Only say local verification isn't
  possible if the symlink is present and the commands still fail.
- Don't reach for browser computer-use (screenshots, clicking, typing)
  by default. Only use it when the user asks for it, or when it's
  necessary to verify something lint/tsc/tests can't catch — e.g. actual
  rendered layout, force-graph physics, or other visual behavior.

## Git

- Branch names should not contain numbers.
- Commit messages follow Conventional Commits: `type(scope): summary`
  (e.g. `fix(graph): ...`, `feat(search): ...`, `test(pipeline): ...`),
  matching existing history.
- PR descriptions must include a summary of what changed and why, not
  just a list of touched files.

## Data model

- Person data has two sources of truth: PostgreSQL (profiles, search) and
  Neo4j (graph nodes/relationships), linked by `slug`. Don't edit one
  without the other — go through the canonical people pipeline
  (`scripts/people/syncCanonicalPeople.ts`, `npm run people:sync` /
  `npm run people:validate`) so both stay in sync.
- `npm run people:rank -- --apply` (nasabRank) and `npm run graph:layout
  -- --apply` (graphRank/clusterId/layoutX/layoutY) both compute centrality
  over **every** Person-Person / unified-graph edge, regardless of
  relationship type (`src/lib/nasabRank.ts`'s `buildFamilyGraph`,
  `src/lib/fetchUnifiedGraph.ts`'s `MATCH (a)-[r]->(b)`, both untyped). Any
  change to graph structure — new people, new relations, or especially a
  new relation *type* connecting many nodes (e.g. the COMPANION_OF edges
  added 2026-08-23) — shifts these ranks and the unified layout. Re-run both
  (dry run first, review the diff, then `--apply`) after seeding any such
  change; skipping this leaves ranks/layout stale relative to the graph
  they're supposed to describe.

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

## Documentation

- New features get a line in `README.md` under "What is implemented",
  in the relevant existing subsection (or a new one if it doesn't fit).
