# Working on Namaq

Rules for any agent (Claude Code or otherwise) making changes in this repo.

## Release plan

- [docs/release-plan.md](docs/release-plan.md) holds everything the owner agreed for release 1,
  release 2 and later, and his answers to open questions. Read it before starting work, decide
  which release the work belongs to, and add new agreements there.

## Writing

- Invoke the `unslop` skill before writing prose: docs, commit messages, PR
  descriptions. It lives in `.claude/skills/unslop/`, so it is in the repo and
  needs no install, and it applies to every change rather than to documentation
  work alone.
- Leave clear code uncommented. When unclear code needs context, add only a
  reference to the relevant doc or ADR. Keep functional annotations.
- Invoke the `ponytail` skill before writing or reviewing code: reuse what the
  codebase already has, reach for stdlib and native platform features before a
  dependency, and stop at the shortest diff that works. It is not vendored
  here (https://github.com/dietrichgebert/ponytail); fetch it if a session
  doesn't already have it loaded. Its `ponytail:` shortcut-marker comments
  don't apply here — this repo's no-comment rule above still governs.

## Website, phone app and shared code

- The website is in `src/`. The phone app (Expo) is in `mobile/`; see `mobile/README.md`.
- Pure logic and data that both use live in `shared/` and are imported as `@shared/...`.
  Code in `shared/` imports no packages, no React and no database, and uses relative
  imports, so the app's bundler can read it.
- Move code into `shared/` when the app needs it, and keep the website's tests passing.
- No page lives on the website alone (owner, 2026-11-18), except the owner's review tools
  (`/quizzes/questions`, `/quran/cards-review`). About, privacy and attributions are app pages too
  (`mobile/src/screens/info.tsx`), reading their text from `shared/infoPages.ts`.

## Testing

- Only meaningful tests (owner, 2026-11-19). Every agent building a feature
  cleans up that feature's tests: each test protects an owner rule or a past
  bug, and you can say which in one sentence. No filler tests (render-only,
  class names, constants repeated) and no magic numbers: a hard-coded count
  becomes a rule that holds for every item plus "there is at least one". A
  guard's shrink-only baseline is not a magic number.
  [docs/ship-checklist.md](docs/ship-checklist.md) section 9 has examples.
- Catalog data (people, battles, events, sira stories) has no per-person,
  per-chapter or per-story test files (owner, 2026-11-22): they froze what one
  batch decided, so a correct fix from a source broke them. A new rule is
  written once over the whole catalog in `data/catalog/catalogRules.test.ts`
  (which runs the catalog validator), beside `claimProvenance.test.ts` and
  `events/stories.test.ts`. After a catalog change, run `npm run battles:app`
  and `npm run model:app-people`: the phone reads those files, and a test
  fails when they lag the catalog.
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
  `npm test` and `npm run build` should all pass. `npm run build` catches
  what the other three don't — Next.js's own page-export-shape checks (a
  `page.tsx` may only export `default`, `metadata`, and the other names
  Next recognizes; anything else, like a helper function, fails only here)
  — run it before every PR, not just when something feels risky.
- [docs/feature-map.md](docs/feature-map.md) names every screen of the phone app and the tap that opens it. Use those
  names when writing about the app; a new screen gets an entry in `e2e/featureMap.mjs` (its test fails until it does).
- A change to the phone app is used before it merges (owner, 2026-11-21): run
  `npm run phone -- start` and tap through the feature you changed step by step,
  looking at each dark, iPhone-size screenshot as a person would, then save the
  walk with `npm run phone -- save <name>` when the flow is worth keeping. Post
  the screenshots with the result. The web build does not show native gestures,
  haptics, the native fonts' shaping, audio, notifications or the share sheet;
  name those in the PR for the owner's Expo Go check. See
  [e2e/README.md](e2e/README.md), "Using the app".
- A change to the phone app, or to a website page the UI tests visit, also runs
  `npm run test:ui` (Playwright, about 2.5 minutes; see [e2e/README.md](e2e/README.md)).
  It is a local check, not a CI job. In a cloud container run `./e2e/cloud-db.sh`
  first and export the two URLs it prints, or the database pages skip. A flow you add or change gets a test there.

## Review before a PR

- Run [docs/ship-checklist.md](docs/ship-checklist.md) before opening any PR:
  tick the sections your change touches and paste them under `## Checks` in
  the PR body. It holds the owner's standing feedback; rules a test could
  check are proposed in [docs/plans/guard-proposals.md](docs/plans/guard-proposals.md).
- A subagent reviews the diff before any PR is opened, and it is not the agent
  that wrote the code or the tests under review. Run one review cycle: the
  reviewer reads the diff and reports defects, and you fix or answer each one.
  Run a second cycle only when the first reported a defect that needed a code or
  test change. A docs-only change, a rename or a typo fix needs the one cycle.
  Never run a third.
- Opening the PR means the work is finished: `npm run lint`, `npx tsc --noEmit`,
  `npm test` and `npm run build` pass (the same checks as "Before considering a
  change finished"), the review findings are fixed or answered in the PR body, and the
  PR can merge once those checks pass (plus `npm run lint` and `npm run typecheck` in `mobile/` for
  app changes) unless the owner comments on it. GitHub CI is off for now (manual
  run only), so the local run is the gate. A migration the
  owner applies is not a reason to hold the merge: write the change so the app
  works before the migration is applied. Do not open a PR to ask whether the
  work is right; ask before, in the plan.
- The skills `pr-cycle`, `blind-test-brief`, `review-brief` and
  `expand-contract-migration` (kept in the distillate repo under `skill/`) carry the
  steps and the subagent briefs for this cycle.
- Records of past challenges live in [docs/records](docs/records/README.md).
  Records carry judgment a test cannot check (how to read a source, what a
  citation allows). A mistake that can happen again is not fixed by a record:
  see "One entry for each shared thing" below.
  Before starting a task, and again after a first fix fails, search them (`rg`
  over `docs/records`) and read the ones that match. When you solve a real
  challenge in a way the code alone does not show, add a record in the same PR,
  in the format the README there gives: `docs/records/RNNNN-short-title.md`
  with the next free number, and a row in the README index. Every PR description
  ends with a `Records used:` line naming the records that changed a decision by
  their `R` id (for example `Records used: R0019, R0021`) or `none`. Every `R` id
  on that line counts, so mention a record you wrote elsewhere in the
  description. `npm run records:used` counts them; `npm run records:export` copies
  the records and those counts into Distillate, whose /records/stats page and
  record pages show them.
  Distillate lessons are long write-ups written only when the owner asks.

## Sources and attributions

- Every book, text, data set, font and library Namaq draws on is listed once in
  `shared/sources.ts`, with its licence and the pages that use it. The website's
  `/sources` (books) and `/attributions` (everything) render that list, and so
  does the app's own attributions page (opened from its settings). **A PR that adds a data source or book adds it
  there in the same PR**, with the licence as the source states it; one that
  stops using a source removes it.
- A book may ship whole, built in or as a download, when it is an old author's own text
  in the public domain: show only the author's words, without the modern editor's
  footnotes or additions, with the page number and a link to the edition. Modern works
  (for example al-Muyassar, Hisn al-Muslim, al-Albani's annotated books) need the
  publisher's or author's written permission before any of their text ships; until then
  quote a short attributed line and link out.

## Established claims only

Owner, 2026-11-18: Namaq shows average readers correct, established information.
It does not enter scholarly discussions, show doubtful claims, or present a point
the sources disagree on as settled.

- A quiz never asks about a disputed point, unless its right answer holds every
  valid opinion with its references (a raid in year 4 or 5: «٤ أو ٥ هـ»), and the
  wrong choices are clearly wrong (١٠ هـ, ١٢ هـ).
- Poems, sayings and reports in the feed and in quizzes start with the most
  authentic: a report in al-Bukhari or Muslim, or one a named scholar graded
  sahih. Those whose wording, line order or speaker differ between reports wait.
- A disputed point is not dropped (owner, 2026-11-18). It shows, or is asked,
  attributed: «قيل فيه كذا، عند فلان», each opinion with its reference, as one
  answer. A question can ask who said it («من قال: فيّ نزلت؟») when that is
  exactly what the source holds.
- When more than one source states the same fact and we have found them, cite
  them all.
- When a generator or a reviewer cannot tell whether a point is disputed, it
  words it attributed and lists it for the owner.

## Feed card and quiz

- A new app feature ships with its card in the home feed. The card uses the feed's post
  shape (`PostHead`, and `Post` around the feature's own component, in
  `mobile/src/components/HomeFeed.tsx`).
- When the feature has something to ask, it also ships a quiz kind that comes into the
  feed (a new entry in `FEED_QUIZ_NAMES` in `shared/quiz/feedQuiz.ts`).
- The sketch the owner sees before the build shows the card and the quiz.
- Each new card kind and quiz kind belongs to exactly one interest in
  `shared/interests.ts` (its `cards` or `quizzes`), and the card's item list goes in
  `LIST_OF` in `HomeFeed.tsx`; `shared/interests.test.ts` fails on a kind left out.
- A feature without a card is named in the PR with the reason.
  [docs/feed-cards.md](docs/feed-cards.md) lists the cards, the quiz kinds and the
  named exceptions; the PR updates it.
- No box in a feed card and no button in it (owner, 2026-11-19): the post's card is
  the only box, and the feature's own buttons (hint, check, save, share, look up,
  recite bar) sit in the row under it. The shared pieces do it for you: a `Card`
  inside a card draws flat (app `ui/Card`, website `common/Card` with `Card.css`), and a
  button row wrapped in `UnderCard` joins the row under the card (app `ui/Card`,
  website `common/UnderCard`). A piece that frames itself asks `useInsideCard()` (app).
  `e2e/app/home.spec.ts` checks the tree quiz card.
- This is a workflow rule checked in review, not a guard test.

## Quiz questions

- **No question gives its answer away** (owner, 2026-11-17 and again 2026-11-19). This holds for every
  quiz kind, the ones built in code in `shared/quiz/` (`CHOICE_KINDS`) as much as the reviewed bank
  below. Judge each kind by the reader's eye, not by a number: the answer must not be written in the
  question (a raid asked "where" when its name is the place, «سرية أبي سلمة إلى قطن»; an ayah that says
  its own surah's name), told by the names (a father and son «X بن Y» asked how they are related; «أم
  سلمة» and «أبو سلمة»), already on the page (how 'Asim reads a word on a Hafs page), said beside the
  asked word (a meaning the ayah states next to it), or picked out by the choices' look (the only long
  choice, the only one with a second reading). `shared/quiz/giveaway.test.ts` runs every registered kind
  through `givesAway` (`shared/quiz/giveaway.ts`); what only the subject shows (names, a page's reading)
  is checked in the kind's own builder and test. Before a PR that adds or changes a kind, its author and
  its reviewer each read twenty of its questions as a reader would, and the PR says so.
- **Wrong choices come from the part of the Quran the quiz is set to** (owner, 2026-11-19): a juz 30
  quiz offers no surah or ayah of juz 29. A kind whose choices are places checks them against the scope,
  as `whichSurah`, `tafsirQuiz`, `meaningQuiz` and `compareQuiz` do; `giveaway.test.ts` checks it.
- **A question about a man offers men, one about a woman offers women** (owner, 2026-11-19; it was in
  `docs/quiz-question-review.md` only, so the code-built kinds missed it): every person or name a choice
  holds is of the asked person's sex («أم المساكين» is never offered for al-Zubayr). The Prophet's ﷺ
  names are never a wrong choice; they are asked about on their own. Each kind's test checks both.
- **Each thing about a person is its own kind and its own interest** (owner, 2026-11-19): kunya, laqab,
  virtue, ties… so a reader who does not want kunyas turns them off alone (`shared/interests.ts`).
- **Mutashabih quizzes ask only what the mutashabih books set side by side** («في كتب المتشابهات»,
  category `mutashabeh`), never our own «تدبّر» pairs (owner, 2026-11-19): `quizFilters` fixes the kind.
- **Every question says where its answer comes from** (owner, 2026-11-19): each kind fills `sources`
  (`shared/quiz/sources.ts`), every book a fact stands on, each with where in it; the screens draw them
  after the answer with `QuizSources` (app `mobile/src/components/QuizSources.tsx`, website
  `src/components/quiz/QuizSources.tsx`), one collapsed line per book. A kind adds no «المصدر» note of
  its own. `shared/quiz/sources.test.ts` runs every registered kind and the trees.

- Quiz candidates and review decisions are authored under `data/quiz/` and
  projected into PostgreSQL. Whenever an agent generates or changes the bank,
  it must follow [docs/quiz-question-review.md](docs/quiz-question-review.md),
  resolve every pending question, run `npm run quiz:validate`, dry-run
  `npm run quiz:project`, inspect the diff, and only then apply it.

## Local verification

- For local dev, follow [docs/local-setup.md](docs/local-setup.md). It requires
  running PostgreSQL **and** Neo4j instances. Real credentials for both live in
  `.env` at the repo root; each git worktree needs its own `.env` symlinked to that
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
- For the phone app, use `npm run phone` (see Testing), not a browser tool.
  On the website, use browser computer-use (screenshots, clicking, typing) only
  when the user asks for it or to check what lint, tsc and the tests can't,
  such as rendered layout or force-graph physics.

## Git

- Before planning or editing in a new or reused worktree, run `git fetch origin main`
  and integrate the fetched `origin/main`, preserving existing work. Verify with
  `git merge-base --is-ancestor origin/main HEAD` before editing. Fetch again
  before opening a PR and integrate any new commits, then rerun the required checks.

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
  drop out, re-run `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build`, and push with
  `--force-with-lease`. Stop and report when two PRs changed the same lines, when
  the work's `summary.md` coverage counts disagree after the rebase, or when the
  resolution changes any line outside the conflicted hunks. That last case goes
  back through a review cycle, counted under the two-cycle cap above.
- After a PR merges, delete its branch on both remote and local, and remove
  its worktree if it has one (`git worktree remove <path>` before
  `git branch -D`, since a worktree checkout blocks the branch delete).

## Shared first

Owner, 2026-11-17: the same control kept being built again (three recite bars,
two top bars and five hand-drawn copies, 74 icon buttons in 11 sizes), so
features drifted. Screens arrange shared pieces; they never draw their own
controls or boxes. The shared folders are `mobile/src/ui/` (app) and
`src/components/common/` (website); `mobile/src/ui/README.md` lists the app's
pieces. Plan and inventory: `docs/plans/shared-first.md`.

- Before building any button, bar, sheet, menu, card, tab row, chip, field,
  list row, empty message or loader, look in the shared folder. If the piece is
  there, use it.
- If it is there but lacks what you need, add an option (a prop) to it and
  check every current caller still looks the same. Never copy it.
- If it is not there, build it in the shared folder first, list it in the
  README, then use it. A look used by one screen is still a shared piece.
- Feature pieces shared by several screens (the recite controls in
  `components/recite/`, the tree, the Quran text module) are built from the
  pieces in the shared folder too.
- One view per feature (owner, 2026-11-19): a feature's view is one shared
  component that its page, its feed card and its quiz all draw, never a copy
  per place. Build it as a component from the start, since every feature gets
  a feed card and a quiz. Example: `mobile/src/components/TiesChain.tsx` draws
  a chain of ties in «بينه وبين…» and in the «صلة» feed card.
- No icon draws a Latin letter or a Western digit (owner, 2026-11-19): this is
  an Arabic app, so «A», «Aa», «AZ», «01» or «H1» in an icon reads as foreign.
  `shared/noLatinIcons.test.ts` fails on any such lucide icon in the app or the
  website; add an icon to its list when a new one draws a letter.
- Every PR that touches UI has a line before `Records used:`:
  `Shared pieces: used Button, Sheet; added Chip` (or `none`).
- `shared/sharedFirst.test.ts` counts, per file, what is drawn outside the
  shared folders: controls (raw `Pressable`, `Modal`, `TextInput`, `Switch`,
  loaders, `BlurView`, tappable `Text`/`View`, tap gestures; on the website raw
  `<button>`, `<input>`, dialogs, popovers, portals, fixed overlays, clickable
  `div`s) and boxes (rounded corners with a border or the card colour, literal
  radii; `rounded-*` and `border-radius` on the website). Today's counts are in
  `sharedFirst.baseline.json`. A file may never draw more than its count; a file
  that draws less has its count lowered (`UPDATE_BASELINE=1 npx vitest run
  sharedFirst`). Never raise a count to let a new copy in. Tree drawings, the
  mushaf page, videos and theme swatches are exempt from the box count.

## Shared components

- Every action button goes through `src/components/common/Button.tsx` rather
  than repeating Tailwind classes inline. Pick `variant` (`primary` for the
  filled terracotta call to action, `outline` for everything else), `size`
  (`sm`/`md`/`icon`), and `active` for a control that stays pressed; pass
  `href` to render a `next/link` that looks identical, so a link and a button
  sitting side by side match. Reach for `className` only for layout
  (`shrink-0`, width), never to restyle the button itself.
- This covers controls that read as buttons. Switches (`Toggle`, `SlideSwitch`, the
  analytics pill), the icon switchers for theme and language, the cookie
  banner, and the slider's dot indicators are deliberately separate: they are
  different controls with their own semantics and design language, and folding
  them in would change how they look and what they announce.
- Rows in a suggestion or node list are buttons for the keyboard, not controls
  that read as buttons: they stack multiple lines, fill their row, and carry no
  border. The existing ones stay plain `button` elements, counted in the
  guard's baseline; a new list gets a shared row piece (see "Shared first").
- Every button carries an icon beside its label, from `lucide-react`. Pick one that names the action rather than decorating it, and reuse the
  icon an action already has elsewhere (Start over and Reset share the rotate
  arrow, View profile shares the person). A horizontal arrow has to be mirrored
  by writing direction, so that back points the way the reader came in Arabic as
  well as English (see `src/components/common/Pagination.tsx`); a vertical arrow
  needs no such care.
  A picker whose buttons are short codes, such as the ayah references on the qira'at
  page (`36:35`), carries no icon: the code is the label.
- Every link that leaves Namaq (a Shamela citation, a source on /sources or
  /attributions, Quranpedia, archive.org) goes through `ExternalLink`:
  `src/components/common/ExternalLink.tsx` on the website,
  `mobile/src/ui/ExternalLink.tsx` in the app (or its `openExternal`
  for a settings row that draws the same mark itself). It ends the text with a
  small out-of-site mark (lucide `SquareArrowOutUpLeft`, mirrored in English) in
  the link's own colour, so a reader knows before tapping that the link leaves
  the app. Internal links stay plain `next/link` or app navigation, with no mark.
  `ExternalLink.test.tsx` fails on a raw `target="_blank"`, `href="http…"` or
  `Linking.openURL` anywhere else.
- Titles and other short labelled chips use `src/components/common/Badge.tsx`
  (`size="sm"` inside dense panels), so a title looks the same on a profile
  page and in the graph panel.

## One entry for each shared thing

Features drift when a new place draws an existing thing its own way: the tree
was rebuilt three times (#776, #811, #825), and Quran text lost its signs and
room in every feature that shaped it itself. Each shared thing has ONE entry
point and a guard test that fails on any other path. Before building, find the
thing here and use its entry; give it a prop for the new place rather than a
copy. A guard checks every caller of the lower-level code it replaces, not
only the feature that was reported (docs/records/R0054).

When a bug comes back, or a fix would have to be repeated in another feature,
do not add a guard on your own. A guard written alone tends to fence the
symptom and leave the second path open (the tree bug returned after R0031,
R0042 and R0051, each cited by the next fix, until the owner agreed one
builder for every tree). Stop and bring the owner a short proposal first:
the one pipeline every feature should go through (entry, levels, what each
feature passes in), the callers that leave it today, and the guard that
would fail on any other path. Before it reaches the owner, a second agent
votes on it: give a fresh subagent the bug, the code and the proposed guard
(not your reasoning), and ask it to find a caller the pipeline misses and to
show the guard fails when the old path is put back. The proposal goes to the
owner with both votes, and the second agent's objections are written in it
if the two disagree. Build the pipeline and the guard, and add the row here,
only after the owner agrees. A new row in this table is always the owner's
decision.

| Thing | Entry | Guard |
| --- | --- | --- |
| Quran text | the Quran module (being built: `shared/quran/quranText/`, `src/components/quran/text/`, `mobile/src/components/quran/text/`) | `shared/quran/oneQuranText.test.ts` |
| Tree | builders in `shared/quran` (`createTreePresenter`, `compareTree`), drawn by each platform's `BranchTree` | `shared/quran/oneTree.test.ts` |
| Link out of Namaq | `ExternalLink` (web and app) | `src/components/common/ExternalLink.test.tsx` |
| Recite mode (تسميع) | `useRecite` (state) + `RecitePill` (bar) in `src/components/recite/` and `mobile/src/components/recite/`; the pen rule is a setting (`PenSetting`) | `shared/quran/oneRecite.test.ts` |
| Button | `src/components/common/Button.tsx` (website), `mobile/src/ui/Button.tsx` (app) | `shared/sharedFirst.test.ts` counts raw buttons per file (no new ones) |
| Controls and boxes | `mobile/src/ui/` (app), `src/components/common/` (website) | `shared/sharedFirst.test.ts` |
| Icon without Latin letters | lucide icons, minus those that draw a letter or a Western digit (owner, 2026-11-19) | `shared/noLatinIcons.test.ts` |
| Surah name | `surahName` / `SURAH_NAMES` in `shared/quran/surahNames.ts` (pause form with tashkeel, «البَقَرَةْ»); `SURAH_TITLES` only for a mushaf page's surah headers; the plain `name` only for matching | `shared/quran/oneSurahName.test.ts` |
| Tap size (44 × 44 pt at least, owner 2026-11-19) | app: `Tap` in `mobile/src/ui/Tap.tsx` widens its hit slop to `MIN_TAP` (`mobile/src/ui/tapSize.ts`); website: `Button`'s `TAP_FLOOR` | `shared/tapSize.test.ts` |
| Bar floating over a page | `FloatingBar` (`mobile/src/ui/FloatingBar.tsx`, `src/components/common/FloatingBar.tsx`), places in `shared/barPlaces.ts` | `e2e/app/mushaf.spec.ts` (the recite bar floats) |
| Words of a Sahih hadith in a catalog file (owner, 2026-11-24: one hadith text) | `sahih('bukhari', n, from, to)` in `src/lib/catalog/sahihText.ts`, read from `data/hadith/sahih`; `npm run catalog:story -- <slug>` prints a story with its words | `data/catalog/catalogRules.test.ts` ("copies no words of a Sahih hadith it cites") |
| Link between two things (owner, 2026-11-24: everything links both ways, from one source) | written once on the catalog record that cites it (`data/catalog`); `appLinks` (`src/lib/catalog/appLinks.ts`, run by `npm run battles:app`) adds the other direction and writes `shared/data/links.json`, never edited by hand | `src/lib/catalog/appLinks.test.ts` (stale file, an end with no record, no source, a link missing its other end) |

### Quran text

Every Quran text goes through the module, at the first level the feature has
room for: the whole Madina page, a slice of the page, the ayah as the page sets
it, or the ayah copied off the page. "As in the mushaf" holds at every level:
the KFGQPC Hafs page text with its tashkeel, ayah number medallion and every
waqf, sajda and hizb sign. The copied level drops only the position on the
page (two ayat stacked in compare or the matrix, words in a tree box); it keeps
everything else. Features store places (surah:ayah:word), never copies of the
text. The pages are the only stored Quran text: a feature that needs an ayah's
words reads them from the pages (`ayahWordsOf` in
`shared/quran/quranText/ayahWords.ts`), never from a regrouped copy. Built
data keeps positions only: trees.json holds keys, pages, roots and word
ranges, and `shared/quran/quranText/corpus.ts` puts the page words back (import
it, never trees.json). The same ayahWords file maps the corpus's word split onto
the page words. Only the module sets the Quran font. The exceptions are Quran quoted
inside a book, the other readers' readings (qiraat.json), and the Quranic
Arabic Corpus's dictionary forms of a word (words, lemmas, similar ayat): none
of them is the Hafs page text. The readings and dictionary forms are stored
in the Madina page's spelling (`scripts/quran/madinaSpelling.ts` at build
time), so no screen converts a word; book quotes keep the book's own spelling,
except where a feature puts a quote back on the page words it quotes (the surah
order page, owner 2026-11-21: `quoteRuns` in `shared/quran/surahOrder.ts`).
An ayah drawn off the page (a quiz's ayah, a choice that is an ayah) goes in
the module's `AyahFlow` with `AyahWords`, which size it from its width as the
reader's flowing text is (`shared/quran/quranText/flow.ts`); the place sets
colour and marks, never a size (owner, 2026-11-19). The guard's `sized` rule
fails a size given to Quran words outside the module.
`oneQuranText.test.ts` lists today's breaks in
`oneQuranText.baseline.json`; the list only shrinks.

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
  (al-Dhahabi) in the مؤسسة الرسالة edition on Shamela. It carries the editor's
  footnotes, which other hosts drop, and its printed page numbers are the ones
  every citation records.
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
- Everything tappable gives the finger at least 44 × 44 points (owner,
  2026-11-19), counting its box and hit slop, never by making the icon bigger.
  Build presses from `Tap`/`Button`, which reach the floor on their own. Hit
  slop cannot reach past a parent that clips (`overflow: hidden`) or, on
  Android, past the parent's bounds: there, give the box itself 44 points.
- A bar over the reader's page floats (`FloatingBar`): the page never shrinks
  for it, it goes wherever it is dragged and stays there, and it folds into a
  circle (owner, 2026-11-19).

## Documentation

- Code owns implementation details. Keep ADRs and decisions, provenance, and
  necessary operational instructions. Give each rule one authoritative home
  and link to it. Remove stale or duplicated narration when changing an area.
- Read [docs/palette.md](docs/palette.md) before changing the theme or UI.
  Palette values belong only in `src/app/theme.css`.
- Put records of engineering challenges in [docs/records](docs/records/README.md). Keep Namaq
  decisions needed by contributors in ADRs and docs in this repository.
- Audit affected frontend tests as keep, rewrite or remove. Protect important
  behavior against plausible regressions, including navigation, input, error
  recovery and accessibility. Remove incidental styling assertions and
  redundant tests only after identifying the coverage they provided.
- Update `README.md` when project purpose or documentation links change.
  Keep setup instructions in `docs/local-setup.md`.
