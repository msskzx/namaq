# Working on Namaq

Rules for any agent (Claude Code or otherwise) making changes in this repo.

## Writing

- Invoke the `unslop` skill before writing prose: docs, commit messages, PR
  descriptions. It lives in `.claude/skills/unslop/`, so it is in the repo and
  needs no install, and it applies to every change rather than to documentation
  work alone.
- Code carries no comments except a reference to the document that holds the
  rule: name the ADR or the file under `docs/` and stop there. Explanation
  belongs in the document, since a comment that explains goes stale the moment
  the document changes, and nothing catches it. When you touch a comment that
  explains, replace it with the reference, or delete it if the code says enough.
- Invoke the `ponytail` skill before writing or reviewing code: reuse what the
  codebase already has, reach for stdlib and native platform features before a
  dependency, and stop at the shortest diff that works. It is not vendored
  here (https://github.com/dietrichgebert/ponytail); fetch it if a session
  doesn't already have it loaded. Its `ponytail:` shortcut-marker comments
  don't apply here — this repo's no-comment rule above still governs.

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

## Review before a PR

- A subagent reviews the diff before any PR is opened, and it is not the agent
  that wrote the code or the tests under review. Run one review cycle: the
  reviewer reads the diff and reports defects, and you fix or answer each one.
  Run a second cycle only when the first reported a defect that needed a code or
  test change. A docs-only change, a rename or a typo fix needs the one cycle.
  Never run a third.
- Opening the PR means the work is finished: `npm run lint`, `npx tsc --noEmit`
  and `npm test` pass (the same checks as "Before considering a change
  finished"), the review findings are fixed or answered in the PR body, and the
  PR can merge once CI is green unless the owner comments on it. A migration the
  owner applies is not a reason to hold the merge: write the change so the app
  works before the migration is applied. Do not open a PR to ask whether the
  work is right; ask before, in the plan.
- The skills `pr-cycle`, `blind-test-brief`, `review-brief`, `capture-lesson` and
  `expand-contract-migration` (kept in the distillate repo under `skill/`) carry the
  steps and the subagent briefs for this cycle.

## Quiz questions

- Quiz candidates and review decisions are authored under `data/quiz/` and
  projected into PostgreSQL. Whenever an agent generates or changes the bank,
  it must follow [docs/quiz-question-review.md](docs/quiz-question-review.md),
  resolve every pending question, run `npm run quiz:validate`, dry-run
  `npm run quiz:project`, inspect the diff, and only then apply it.

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
- The PostgreSQL and Neo4j databases behind `.env` are **preview databases**,
  not production. Writes, deletes and re-imports against them are fine when the
  user asks for them. Still go through the sync scripts where one exists (see
  Data model), and do not print or read credentials out of `.env` to do it:
  run the project's own scripts, which load it themselves.
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
- A worktree is a separate working directory sharing only the main checkout's
  git history, not its `node_modules` -- gitignored files live on disk per
  checkout, so Next.js/Node have nothing to resolve `import`s against until
  something is there. Symlink it to the main checkout's
  (`ln -s <main-checkout>/node_modules node_modules`) rather than running a
  fresh `npm install`, as long as the branch hasn't changed `package.json` or
  the lockfile; if it has, install instead so the worktree gets its own,
  correct set of packages.
- Branch names should not contain numbers.
- Commit messages follow Conventional Commits: `type(scope): summary`
  (e.g. `fix(graph): ...`, `feat(search): ...`, `test(pipeline): ...`),
  matching existing history.
- PR descriptions must include a summary of what changed and why, not
  just a list of touched files.
- Target `main` from the start. Stack a PR on another branch only when it needs
  that branch's unmerged commits, and expect it to conflict once the base is
  squash-merged, because the squash rewrites the base's history.
- An agent that is merging a conflicting PR rebases it without waiting for the
  author. For a stacked PR whose base was squash-merged, run
  `git rebase --onto main <old-base-branch>` so the commits the squash already took
  drop out, re-run `npm run lint`, `npx tsc --noEmit` and `npm test`, and push with
  `--force-with-lease`. Stop and report when two PRs changed the same lines, when
  the work's `summary.md` coverage counts disagree after the rebase, or when the
  resolution changes any line outside the conflicted hunks. That last case goes
  back through a review cycle, counted under the two-cycle cap above.
- After a PR merges, delete its branch on both remote and local, and remove
  its worktree if it has one (`git worktree remove <path>` before
  `git branch -D`, since a worktree checkout blocks the branch delete).

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
  A picker whose buttons are short codes, such as the ayah references on the qira'at
  page (`36:35`), carries no icon: the code is the label.
- Titles and other short labelled chips use `src/components/common/Badge.tsx`
  (`size="sm"` inside dense panels), so a title looks the same on a profile
  page and in the graph panel.

## Data model

- Person data has two sources of truth: PostgreSQL (profiles, search) and
  Neo4j (graph nodes/relationships), linked by `slug`. Don't edit one
  without the other — go through the canonical people pipeline
  (`scripts/people/syncCanonicalPeople.ts`, `npm run people:sync` /
  `npm run people:validate`) so both stay in sync.
- A battle participation splits two questions. Whether the person was there is
  the relation (`PARTICIPATED_IN` or `ABSENT_FROM`); what happened to them there
  is the status, and each relation admits only its own statuses, which
  `npm run catalog:validate` enforces. Record an absence only where a source
  remarks on it. A participation's `summary` carries what the person did in the
  source's own wording, cited like any other value
  ([ADR 0013](docs/adr/0013-separate-attendance-from-outcome.md)).
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

- **[docs/extraction-checklist.md](docs/extraction-checklist.md) is required
  reading before authoring or extending any batch, and every batch must run
  `npm run catalog:checklist -- <person-slug>` clean before approval is
  requested.** It walks the reading order for what a source entry typically
  states (nasab, kunya, appearance, manaqeb, wives, siblings, source-text
  detail), where each thing is recorded, and how to mark an item confirmed
  absent (`notInSource`) versus simply unchecked. Two real gaps shipped
  before this existed — a `volumeNumber` silently missing on ten batches,
  and Hamzah ibn Abd al-Muttalib's nasab edge never carried into the catalog
  — both were schema-valid and both were wrong; this is what closes that
  class of gap going forward. Existing batches published before this
  checklist are not swept retroactively without being told to.
- [docs/companion-extraction-checklist.md](docs/companion-extraction-checklist.md)
  tracks, in the companion index's own order, which entries already have a
  batch. **Check the next entry off in the same PR that extracts it** —
  otherwise the next agent has to reconstruct extraction order from PR
  history to find where to resume, which is what this file exists to avoid.
- Curated historical records live in `data/history/batches/<batch>/`, separate
  from application code: `batch.json` holds source editions, source accounts and
  claims with their citations; `accounts/<subject>/NNN.md` holds one printed page
  of the work's text, with `NNN.notes.md` beside it for that page's editorial
  footnotes. `summary.md` is the review summary.
- **Read the text; stop only where it is unclear.** Rules guard what is unclear
  or contradictory ([ADR 0024](docs/adr/0024-read-the-text-and-stop-where-it-is-unclear.md)).
  Where the text, a chapter heading, the question a turn answers or the sharh
  make a reading clear, record it directly with its basis spans, for example the
  speaker of a bare `قَالَ` in a question and answer. Do not park it as an
  inference, and do not leave a gap a reader would not see. An Inference file is
  for what the text does not present. Where sources contradict each other or the
  text stays open, record each reading as an attributed claim and pick none.
  Stop and ask only for an open or contradictory text, a schema change, or an
  irreversible or outward action. For anything else, record your reading and list
  it in the batch's `summary.md`.
- **An extraction covers the whole entry.** The pieces must rebuild the entry's
  text word for word, so trim nothing to make a reading fit. Check that they do
  before saying a fixture or batch is checked.
- **Do not read a whole account to answer a question.** Open `batch.json` for the
  structure and the claims, then only the pages a citation names. Each page's
  paragraphs carry anchors like `9-p7` that citations point at.
- Before saying a Siyar unit is parsed, run `npm run model:coverage -- <unit>` and put its
  counts (sentences, covered, not modeled, unresolved names) in the work's `summary.md`.
  Every sentence is either covered by a span or listed as not modeled; none is silently
  dropped.
- Files are the source of truth; the database holds a copy. Change the files and
  re-import, never edit the database directly. `npm run history:validate --
  <batch dir>` before proposing a batch, and `npm run history:import -- <batch
  dir>` for a dry run. Import applies only the revision recorded as approved in
  `batch.json`, so any edit after approval needs approving again.
- Abu Ubaydah, Talhah and al-Zubayr have no seed entries at all: the catalog holds their
  fields, titles, participations, Qur'an links and their one cited relation, and
  `npm run catalog:project` / `catalog:project-graph` write them. Everyone else
  still comes from the seeds, so both paths are live at once.
- The catalog wins over a database row, always. `data/` is the authority and a
  row is a copy of it (ADR 0010), so nothing a store holds is evidence of
  anything. For a person no seed file declares, `catalog:project` and
  `catalog:project-graph` make the stores match the files outright: values are
  overwritten, and a title, Qur'an link, participation or person relation the
  store holds and the catalog does not is removed. While a seed file still
  describes someone, the catalog only adds to them and reports the difference,
  since the seed is that subject's author until its entry is deleted. Every
  change is printed, and `--apply` is what writes.
- **Seed files are a checklist, never a source.** The people, battle and event
  seeds under `prisma/` and `neo4j/` were extracted from Siyar A'lam al-Nubala'
  by an earlier agent without citations, so their values are mostly right and
  stand on nothing. Read them to learn which subjects exist and which fields a
  subject is claimed to have, then look for each in the source. Never carry a
  value into the catalog because a seed file has it.
- **A multi-volume source needs `volumeNumber` on the account (or `volumeNumber`
  on a page, if the entry itself crosses a binding), or the entry is imported
  with no volume at all.** `importBatch.ts` only links a page to a volume
  through that declared number; it never infers one from where the printed
  page falls inside a volume's range. An account missing the field still
  imports cleanly — `history:validate` raises no issue — but the reader then
  files it under "entries with no assigned volume" instead of the book's own
  contents, which is easy to miss on a long source page. Check the new
  entry's `extractionUrl`/printed page against the source's declared volumes
  in `batch.json` and set the field before approving.
- A carried value that no batch supports yet is marked `legacy-unreviewed`.
  That is a real state, not a failure: it says the value is in use and its
  evidence is still owed. Where the source is silent, leave the marker rather
  than dropping the value or inventing a citation.
- **A batch covering a subject must visit every legacy value on it** and do one
  of three things with each: promote it to a cited claim, leave it legacy
  because the entry says nothing, or flag a contradiction in the batch's
  `summary.md`. Two extractions from one book disagreeing means one misread, so
  do not silently overwrite.
- `npm run catalog:ledger` lists every value whose evidence is owed;
  `-- --batch <dir>` narrows it to the subjects that batch speaks about,
  including the ones its claims point at. Run the scoped form before approving,
  since what it prints is what the batch walked past.
- Two separate actions gate a batch, and neither implies the other.
  **Approving for publication** records the current revision in `batch.json`'s
  approval block, which is what lets `npm run history:import -- --apply` write.
  It says the batch may be published and says nothing about anyone having read
  it. **Marking reviewed** sets every claim's `reviewStatus` after someone
  compares the batch against its source. Only the user's explicit instruction
  to “mark this batch as reviewed” authorizes `npm run history:review -- <batch
  dir> --apply`; saying it was read or discussing corrections does not. A batch
  approved for publication whose claims are all Not reviewed is a normal and
  honest state, and the approval note should say so.
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
- One citation record holds one meaningful selection from one source account.
  Page turns, extracted paragraph boundaries, and footnote placement do not
  create citations: join fragments that belong to the same selection and use a
  page range when it crosses printed pages. Mark omitted intervening text with
  an ellipsis. Keep separate records only for genuinely distinct evidence, such
  as competing reports; omit fragments that repeat support without adding
  information. Prefer the shortest complete sentence or self-contained clause
  that proves the value; never stop mid-word or mid-phrase. Include enough text
  to make the support intelligible, but no material unrelated to the value.
- Profile citations link to Namaq's source reader. Do not repeat a digital-host
  link beside every citation; each reader page links to its corresponding host
  page after the editor's footnotes.
- Competing accounts are kept as separate attributed claims **only where the
  model holds the value they compete over**, such as two death years. A
  disagreement about something the app does not record stays in the source
  pages, where it already is.
- Transmission chains stay in the source text. A person mentioned only as a
  narrator does not become a graph node or an edge.

## Content sources

- Companion (صحابي) names/biographies are sourced from *سير أعلام النبلاء*
  (al-Dhahabi) in the مؤسسة الرسالة edition on **Shamela, which is the only
  digital host this project extracts from**. It carries the editor's footnotes,
  which other hosts drop, and its printed page numbers are the ones every
  citation records.
  - Book, with its فهرس الموضوعات for enumerating entries without paging
    through the text: https://shamela.ws/book/10906. `npm run history:search
    -- <term> [<term> ...]` searches a partial, hand-discovered subset of
    that فهرس tree rather than fetching pages one at a time; a miss there
    doesn't mean the subject is absent from the book, only that their index
    page isn't in the known set yet.
  - A page is `https://shamela.ws/book/10906/<id>`, and the id runs
    monotonically through the whole edition. That makes it the check on a
    declared volume or printed page, never a fact about the source itself
    ([ADR 0011](docs/adr/0011-classify-the-role-of-cited-evidence.md)).
  - **Shamela's `الجزء` labels the Siyar's own parts and does not count the two
    sira volumes and the caliph volume bound before them, so its `الجزء ٢` is
    this edition's volume 5.** Three batches recorded the label as the volume
    before this was written down.
  - Extraction proceeds in batches (currently batches of 10), following
    the book's own ordering, and checks each name against existing
    `prisma/personSeedData*.ts` slugs before treating it as new.
- الصحابة are the only subjects in scope. The Siyar's الطبقة الأولى is a death
  cohort rather than a category, so following the book's ordering runs past them
  into كبار التابعين twice. Skip those two runs, except a subject whose صحبة
  another work holds: a contested Companion is taken in and the contest recorded,
  never dropped for being contested. The table in
  [docs/data-pipelines.md](docs/data-pipelines.md) gives the
  pages and says what waits on what.

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
