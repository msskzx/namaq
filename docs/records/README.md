# Records

Each file records one challenge met while building Namaq: what the problem was,
what fixed it, and when that fix applies. Read the ones that match your task
before you start; they exist so a thread does not repeat a detour another
thread already took.

Agents write these records as they work. They are different from Distillate
lessons (long write-ups the owner asks for when discussing a feature in depth)
and from the historical records under `data/history/`.

## Format

Copy an existing file. Name it `RNNNN-short-title.md` with the next free number
(`R0053` after `R0052`) and add its row to the index below; the test refuses a
number two records share and an index that misses a record. The `R` keeps a
record id apart from ADR and PR numbers (`R0037` is a record, `ADR 0037` and
`#737` are not). Until 2026-11-16 ids were bare numbers (`0037`), and four
numbers were used twice; the second of each pair became R0044 to R0047.
The fields are Distillate's, so `npm run records:export` can copy the records
back into Distillate unchanged. Each frontmatter line is `key: <JSON value>`.

```md
---
title: "Short title that states the finding"
summary: "One sentence summary."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The general problem, in one or two sentences."
approach: "The fix: what worked (for a failed outcome, what was tried and why it failed)."
outcome: "solved"
conditions: "When it applies: what was true when it was tried (versions, data size, constraints)."
evidence: "PR, commit, test or file."
implication: "The rule, check or habit that should change, or none."
date: "YYYY-MM-DD"
topics: ["testing"]
buildsOn: ["namaq/R0019-fixing-the-example-broke-the-ayah-next-door"]
---

A few short paragraphs: what happened, what surprised us, why the fix works.

## Tried

- first attempt → what happened
- second attempt → what happened
```

- `kind`: challenge (the problem the work existed to solve), obstacle (a
  constraint found while building) or detour (something that broke and was
  fixed, which the final code no longer shows).
- `outcome`: solved, failed, partial or open. A failure means "failed under
  these conditions", not a ban.
- `topics` come from this list (Distillate's, also `TOPICS` in
  `scripts/records/format.ts`, which the test checks): agent-review,
  build-tooling, data-sync, evidence-model, graph-layout, graph-ui, migrations,
  mobile, runtime-versions, source-extraction, testing, text-matching, ui-rtl,
  ui-state, video.
- Links between records: `buildsOn` (continues an earlier record) and
  `variantOf` (same problem met elsewhere), as ids like `namaq/R0019-…`.
  `lesson` names a Distillate lesson. All three are optional.
- `## Tried` is optional: one line per attempt and its outcome, dead ends
  included, so nobody tries them again.
- Links to repo files are relative (`../../src/…`); the export turns them into
  Distillate's `RepoLink`. Some paths in older records have since moved.
- Write one when a real challenge was solved in a way the code alone does not
  show. Skip routine work, and update an existing record rather than writing a
  second one about the same finding.

Records R0001 to R0027 came from the Distillate project (2026-09 to 2026-11).

## Copying to Distillate

`npm run records:export` writes every record to
`../distillate/content/records/namaq/` (or `<root>/content/records/namaq/` for
the Distillate root you pass after `--`), skipping records Distillate already
holds with the same fields and text and removing Distillate files whose record
was renamed or removed here. Distillate's loader reads them as they
are, with the links between records.

It also writes `content/usage/namaq.json` there: each merged PR's `Records used:`
line with the records it resolves to, and the PR that added each record file.
Distillate builds its stats page and each record's stats from that file. It
needs the `gh` CLI signed in (or `--prs <file>` holding
`gh pr list --state merged --json number,title,body,mergedAt` output) and the
full git history; `--no-usage` skips it.

## Usage

Every PR description has a `Records used:` line (see the PR template). To count
how often each record was used across merged PRs, run `npm run records:used`
(needs the `gh` CLI signed in). Both commands read the line the same way
(`scripts/records/usage.ts`). Write `Records used: R0019, R0021` or `none`:
only `R` ids count, wherever they stand on the line, so mention new records
elsewhere in the description. Lines written before the `R` ids (no `R` id on
the line) are read the old way: bare numbers before the first full stop,
outside parentheses, not after an ADR item, and a number two records shared
counts for neither.

## Index

| Id | Record | Kind | Outcome |
| --- | --- | --- | --- |
| [R0001](R0001-eligibility-is-not-extractability.md) | Group headings: an eligibility question, not an extraction one | challenge | solved |
| [R0002](R0002-mission-set-to-design-evolution.md) | Mission set: evolve the design, not author or review batches | challenge | solved |
| [R0003](R0003-page-keyed-by-reader-not-book.md) | The page was keyed by who read it, not by where it sits in the book | challenge | solved |
| [R0004](R0004-no-legacy-during-dev.md) | No back-compatibility layers while the app is unreleased | challenge | solved |
| [R0005](R0005-checks-that-dont-rederive-pass-the-wrong-inputs.md) | Checks that don't re-derive pass exactly the inputs that should fail them | obstacle | solved |
| [R0006](R0006-a-rule-that-stops-a-clear-reading.md) | A rule that guards the unclear must not stop a reading that is clear | obstacle | solved |
| [R0007](R0007-a-page-that-reads-the-repo-at-request-time.md) | A page that reads repo files at request time works on a laptop and breaks on a deploy | detour | solved |
| [R0008](R0008-prove-a-split-by-putting-it-back-together.md) | A split of a text is proved by recombining it, not by checking it | detour | solved |
| [R0009](R0009-a-fix-in-the-code-does-not-fix-the-rows-built-before-it.md) | A fix in the code does not fix the rows built before it | detour | solved |
| [R0010](R0010-a-subagent-said-green-while-lint-and-tsc-were-red.md) | A subagent said green while lint and tsc were red | detour | solved |
| [R0011](R0011-physics-on-two-chains-became-one.md) | With physics on, two chains became one | detour | solved |
| [R0012](R0012-a-new-column-breaks-every-query-until-the-migration.md) | A new column breaks every query until someone applies the migration | obstacle | solved |
| [R0013](R0013-a-reader-that-reads-must-also-refuse.md) | A reader that reads must also refuse | detour | solved |
| [R0014](R0014-completely-migrated-does-not-mean-every-sentence-is-modeled.md) | "Completely migrated" does not mean every sentence is modeled | challenge | solved |
| [R0015](R0015-two-sources-that-disagree-are-not-an-error.md) | Two sources that disagree are not an error | challenge | solved |
| [R0016](R0016-works-on-node-twenty-two-fails-on-node-twenty.md) | It worked on Node 22 and failed on CI's Node 20 | detour | solved |
| [R0017](R0017-a-name-heuristic-counts-battles-as-unresolved-people.md) | The unresolved-name count includes battles, and no edit can clear them | obstacle | open |
| [R0018](R0018-a-test-against-the-shared-list-misses-a-menu-that-keeps-its-own.md) | A test against the shared link list misses a menu that keeps its own | detour | solved |
| [R0019](R0019-fixing-the-example-broke-the-ayah-next-door.md) | Fixing the highlight the owner pointed at broke the one next to it | detour | solved |
| [R0020](R0020-a-tree-answer-must-preserve-the-path.md) | A tree answer must preserve the path, including where a text ends | challenge | solved |
| [R0021](R0021-absorbing-a-phrase-must-preserve-its-entry-points.md) | Absorbing a phrase must preserve its entry points | challenge | solved |
| [R0022](R0022-shared-forms-do-not-pair-word-occurrences.md) | Shared forms do not pair repeated word occurrences | challenge | solved |
| [R0023](R0023-a-pairwise-match-can-change-after-cropping.md) | A pairwise match can change after cropping | challenge | solved |
| [R0024](R0024-a-filter-draft-must-outlive-its-pending-url.md) | A filter draft must outlive its pending URL | detour | solved |
| [R0025](R0025-filtered-identities-need-the-original-selection.md) | Filtered identities need the original selection | challenge | solved |
| [R0026](R0026-a-citation-does-not-authorize-every-chip.md) | A citation does not authorize every chip | obstacle | solved |
| [R0027](R0027-rendered-context-needs-coverage-checks.md) | Rendered context needs coverage checks | challenge | solved |
| [R0028](R0028-a-second-text-may-only-correct-what-it-can-see.md) | A second text may only correct what it can see | challenge | solved |
| [R0029](R0029-questions-in-one-quiz-can-answer-each-other.md) | Questions mixed into one quiz can answer each other | detour | solved |
| [R0030](R0030-a-fixed-height-box-clips-ios-text-mid-word.md) | A fixed-height box makes iOS cram the rest of a text onto its last line | challenge | solved |
| [R0031](R0031-a-card-that-redraws-a-feature-loses-its-behaviour.md) | A card that redraws a feature loses everything the feature does | challenge | solved |
| [R0032](R0032-a-branch-key-names-where-it-starts-not-what-its-leaf-shows.md) | A branch key names where it starts, not what its leaf shows | challenge | solved |
| [R0033](R0033-a-reader-book-has-more-routes-than-the-dataset.md) | A reader book has more routes than the dataset | obstacle | solved |
| [R0034](R0034-a-dump-keyed-by-ayah-can-hold-pages-not-passages.md) | A tafsir dump keyed by ayah can hold book pages, not the passages that explain the ayah | challenge | solved |
| [R0035](R0035-letting-go-of-a-shared-studio-closes-it.md) | Letting go of a shared studio to swap its target closes the studio | challenge | solved |
| [R0036](R0036-a-video-that-copies-the-app-drifts-from-it.md) | A video that redraws the app from its own constants drifts from the app | challenge | solved |
| [R0037](R0037-a-video-that-redraws-a-screen-drifts-from-it.md) | A video that redraws a screen drifts from it | challenge | solved |
| [R0038](R0038-a-light-import-pulled-all-tree-data-into-the-first-frame.md) | A type import through settings pulled all tree data into the first frame | obstacle | solved |
| [R0039](R0039-one-to-many-compare-cards-reuse-link-ids.md) | One-to-many compare cards reuse link ids | challenge | solved |
| [R0040](R0040-a-dump-page-gap-is-not-always-lost-text.md) | A dump's missing page numbers are not always lost text | challenge | solved |
| [R0041](R0041-an-off-screen-sr-only-label-widens-the-page.md) | An off-screen page's sr-only labels widen the whole document | detour | solved |
| [R0042](R0042-a-rule-kept-in-one-branch-of-a-component-misses-its-other-paths.md) | A rule kept in one branch of a component misses its other paths; a shrink-to-fit label that only iOS shrinks | detour | solved |
| [R0043](R0043-a-book-quoting-the-quran-in-its-own-spelling-meets-the-mushaf-by-consonants.md) | A grammar book quoting the Quran in its own spelling meets the mushaf by consonants | challenge | solved |
| [R0044](R0044-a-pair-must-be-named-in-the-quoted-sentence.md) | A pair must be named in the quoted sentence, not the one next to it | challenge | solved |
| [R0045](R0045-a-scaled-page-is-a-picture-not-bigger-text.md) | Zooming a page with a scale transform enlarges a picture, not the text | challenge | solved |
| [R0046](R0046-a-hidden-box-still-holds-its-place.md) | A box hidden by opacity still holds its place, and lines drawn from layout reach it | challenge | solved |
| [R0047](R0047-a-tab-page-cannot-swipe-back.md) | A tab page cannot swipe back | challenge | solved |
| [R0048](R0048-extending-order-needs-the-next-boundary.md) | Extending surah order needs the boundary into the old range | challenge | solved |
| [R0049](R0049-a-tafsir-that-vocalizes-only-the-quran-marks-its-quotes.md) | A tafsir that vocalizes only the Quran marks its own quotes | challenge | solved |
| [R0050](R0050-a-book-export-writes-marks-out-of-canonical-order.md) | A book export writes marks out of canonical order | challenge | solved |
| [R0051](R0051-one-tree-means-one-builder-not-one-drawer.md) | One tree means one builder and one set of rules, not only one drawing component | detour | solved |
| [R0052](R0052-a-printed-page-is-found-again-by-its-letters.md) | A printed page is found again in a built book by its letters | challenge | solved |
| [R0053](R0053-a-word-filed-under-the-next-ayah-needs-a-move.md) | A word filed under the next ayah needs a move, not a replacement | challenge | solved |
| [R0054](R0054-a-guard-on-one-feature-misses-the-copies-in-another.md) | A guard written for one feature misses the same bypass in another | detour | solved |
| [R0055](R0055-a-card-that-holds-a-button-must-not-be-a-pressable.md) | A card that holds a button must not be a pressable | challenge | solved |
| [R0056](R0056-a-reader-drawn-anew-per-page-forgets-what-it-holds.md) | A reader drawn anew for every page forgets what it holds | challenge | solved |
| [R0057](R0057-a-sign-on-a-word-is-not-a-way-of-writing-it.md) | A sign on a word is not a way of writing it | challenge | solved |
