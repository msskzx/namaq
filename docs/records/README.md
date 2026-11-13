# Records

Each file records one challenge met while building Namaq: what the problem was,
what fixed it, and when that fix applies. Read the ones that match your task
before you start; they exist so a thread does not repeat a detour another
thread already took.

Agents write these records as they work. They are different from Distillate
lessons (long write-ups the owner asks for when discussing a feature in depth)
and from the historical records under `data/history/`.

## Format

Copy an existing file. Name it `NNNN-short-title.md` with the next free number.
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
buildsOn: ["namaq/0019-fixing-the-example-broke-the-ayah-next-door"]
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
- `topics` come from this list: agent-review, build-tooling, data-sync,
  evidence-model, graph-layout, graph-ui, migrations, runtime-versions,
  source-extraction, testing, text-matching, ui-rtl, ui-state.
- Links between records: `buildsOn` (continues an earlier record) and
  `variantOf` (same problem met elsewhere), as ids like `namaq/0019-…`.
  `lesson` names a Distillate lesson. All three are optional.
- `## Tried` is optional: one line per attempt and its outcome, dead ends
  included, so nobody tries them again.
- Links to repo files are relative (`../../src/…`); the export turns them into
  Distillate's `RepoLink`. Some paths in older records have since moved.
- Write one when a real challenge was solved in a way the code alone does not
  show. Skip routine work, and update an existing record rather than writing a
  second one about the same finding.

Records 0001 to 0027 came from the Distillate project (2026-09 to 2026-11).

## Copying to Distillate

`npm run records:export` writes every record to
`../distillate/content/records/namaq/` (or the folder you pass after `--`).
Distillate's loader reads them as they are, with the links between records.

## Usage

Every PR description has a `Records used:` line (see the PR template). To count
how often each record was used across merged PRs, run `npm run records:used`
(needs the `gh` CLI signed in).

## Index

| # | Record | Kind | Outcome |
| --- | --- | --- | --- |
| [0001](0001-eligibility-is-not-extractability.md) | Group headings: an eligibility question, not an extraction one | challenge | solved |
| [0002](0002-mission-set-to-design-evolution.md) | Mission set: evolve the design, not author or review batches | challenge | solved |
| [0003](0003-page-keyed-by-reader-not-book.md) | The page was keyed by who read it, not by where it sits in the book | challenge | solved |
| [0004](0004-no-legacy-during-dev.md) | No back-compatibility layers while the app is unreleased | challenge | solved |
| [0005](0005-checks-that-dont-rederive-pass-the-wrong-inputs.md) | Checks that don't re-derive pass exactly the inputs that should fail them | obstacle | solved |
| [0006](0006-a-rule-that-stops-a-clear-reading.md) | A rule that guards the unclear must not stop a reading that is clear | obstacle | solved |
| [0007](0007-a-page-that-reads-the-repo-at-request-time.md) | A page that reads repo files at request time works on a laptop and breaks on a deploy | detour | solved |
| [0008](0008-prove-a-split-by-putting-it-back-together.md) | A split of a text is proved by recombining it, not by checking it | detour | solved |
| [0009](0009-a-fix-in-the-code-does-not-fix-the-rows-built-before-it.md) | A fix in the code does not fix the rows built before it | detour | solved |
| [0010](0010-a-subagent-said-green-while-lint-and-tsc-were-red.md) | A subagent said green while lint and tsc were red | detour | solved |
| [0011](0011-physics-on-two-chains-became-one.md) | With physics on, two chains became one | detour | solved |
| [0012](0012-a-new-column-breaks-every-query-until-the-migration.md) | A new column breaks every query until someone applies the migration | obstacle | solved |
| [0013](0013-a-reader-that-reads-must-also-refuse.md) | A reader that reads must also refuse | detour | solved |
| [0014](0014-completely-migrated-does-not-mean-every-sentence-is-modeled.md) | "Completely migrated" does not mean every sentence is modeled | challenge | solved |
| [0015](0015-two-sources-that-disagree-are-not-an-error.md) | Two sources that disagree are not an error | challenge | solved |
| [0016](0016-works-on-node-twenty-two-fails-on-node-twenty.md) | It worked on Node 22 and failed on CI's Node 20 | detour | solved |
| [0017](0017-a-name-heuristic-counts-battles-as-unresolved-people.md) | The unresolved-name count includes battles, and no edit can clear them | obstacle | open |
| [0018](0018-a-test-against-the-shared-list-misses-a-menu-that-keeps-its-own.md) | A test against the shared link list misses a menu that keeps its own | detour | solved |
| [0019](0019-fixing-the-example-broke-the-ayah-next-door.md) | Fixing the highlight the owner pointed at broke the one next to it | detour | solved |
| [0020](0020-a-tree-answer-must-preserve-the-path.md) | A tree answer must preserve the path, including where a text ends | challenge | solved |
| [0021](0021-absorbing-a-phrase-must-preserve-its-entry-points.md) | Absorbing a phrase must preserve its entry points | challenge | solved |
| [0022](0022-shared-forms-do-not-pair-word-occurrences.md) | Shared forms do not pair repeated word occurrences | challenge | solved |
| [0023](0023-a-pairwise-match-can-change-after-cropping.md) | A pairwise match can change after cropping | challenge | solved |
| [0024](0024-a-filter-draft-must-outlive-its-pending-url.md) | A filter draft must outlive its pending URL | detour | solved |
| [0025](0025-filtered-identities-need-the-original-selection.md) | Filtered identities need the original selection | challenge | solved |
| [0026](0026-a-citation-does-not-authorize-every-chip.md) | A citation does not authorize every chip | obstacle | solved |
| [0027](0027-rendered-context-needs-coverage-checks.md) | Rendered context needs coverage checks | challenge | solved |
