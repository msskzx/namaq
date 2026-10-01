# Unfinished work sitting in agent worktrees

Status: **inventory**, taken 2026-09-30. All of it has since been decided — every
subject below is now a batch on `main` or on an open PR. Nothing here is scheduled,
and nothing is left uncommitted. What follows is the record of what the worktrees
held and where each subject ended up, kept so the decision to resume or drop is
visible rather than assumed.

The two tables that were still outstanding when this was written have since landed:
the seven page-only subjects in #236, #237, #238, #239, #240, #244 and #245, and
the three near-complete batches in #233, #234 and #235.

Sixteen agent worktrees under `.claude/worktrees/` and `.opencode/worktrees/`
hold work that was never committed. **None of it is in git.** It is untracked
files in working directories, so it survives only as long as those directories
do: `git worktree remove --force`, a clone elsewhere, or a wiped machine loses
it with no reflog and no recovery. The branches themselves are almost all
parked at `6878ffc`, contributing nothing.

This file exists so that deciding to drop any of it is a decision rather than an
accident.

## Inventory

### Transcribed source pages, no batch yet

The hard part — reading the entry and transcribing its printed pages with the
editor's footnotes — is done. No `batch.json`, so no claims, no citations,
nothing structured. **86 printed pages across seven subjects**, none of which
has a batch on main.

| Subject | Pages | Worktree |
| --- | --- | --- |
| `abu-dharr-al-ghifari` | 32 | `.claude/worktrees/abu-dharr-al-ghifari` |
| `al-abbas-ibn-abd-al-muttalib` | 25 | `.claude/worktrees/al-abbas-ibn-abd-al-muttalib` |
| `suhaib-ibn-sinan` | 10 | `.claude/worktrees/suhaib-ibn-sinan` |
| `abu-talha-al-ansari` | 8 | `.claude/worktrees/abu-talha-al-ansari` |
| `al-ashath-ibn-qais` | 6 | `.claude/worktrees/al-ashath-ibn-qais` |
| `hatib-ibn-abi-baltaah` | 3 | `.claude/worktrees/hatib-ibn-abi-baltaah` |
| `abu-sufyan-ibn-harb` | 2 | `.claude/worktrees/abu-sufyan-ibn-harb` |

### Batches near completion, never committed

Each has a catalog person on main already, so the catalog expects them.

| Batch | State | Worktree |
| --- | --- | --- |
| `jabr-ibn-atik` | 1 page, 14 claims, **approval recorded in the file**; `data/catalog/people/jabr-ibn-atik.ts` also modified | `.claude/worktrees/jabr-ibn-atik` |
| `umayr-ibn-saad-al-ansari` | 2 pages, 4 claims, **approval recorded** | `.claude/worktrees/umayr-ibn-saad-al-ansari` |
| `abbad-ibn-bishr` | 4 pages, 10 claims, unpublished; also modifies `data/catalog/battles/badr.ts`, `battles/tabuk.ts`, `events/killing-of-kaab-ibn-al-ashraf.ts` and `people/abbad-ibn-bishr.ts` | `.claude/worktrees/ibad-ibn-bishr` |

A recorded approval here means someone published the batch inside a worktree and
the file never reached main. The approval covers a revision no one else can see.

### Started and abandoned early — all four finished

Decided 2026-10-01. **None was dropped.** Each is now a batch on its own branch,
read from Shamela rather than resumed. What changed the call is that three of the
four worktrees held text for a **different subject**, so there was nothing to
resume and nothing to lose — and the real entries turned out to be short.

| Batch | Worktree held | PR | Real entry |
| --- | --- | --- | --- |
| `ikrimah-ibn-abi-jahl` | its own entry, 5 claims already authored | [#247](https://github.com/msskzx/namaq/pull/247) | vol. 4 pp. 323-324, 5 claims |
| `yazid-ibn-abi-sufyan` | an empty `batch.json`, no pages | [#248](https://github.com/msskzx/namaq/pull/248) | vol. 4 pp. 328-330, 10 claims |
| `zaynab-bint-muhammad` | **حمزة بن عبد المطلب** (Shamela 1610-1615) | [#249](https://github.com/msskzx/namaq/pull/249) | vols. 4 and 5, pp. 334 and 246-249, 6 claims |
| `abdullah-ibn-abdullah-ibn-ubayy` | **عُثْمَان بن حُنَيْف** (entry 61), and the wrong slug | [#250](https://github.com/msskzx/namaq/pull/250) | vol. 4 pp. 321-323, 7 claims |

Two findings worth keeping:

- **`yazid-ibn-abi-sufyan` was in scope**, which the open issue below doubted. He
  is entry 68 in the middle of the in-scope run, not a `كبار التابعين` overrun.
- **Zaynab's fuller entry is in volume 5, not where the editor's cross-reference
  says.** Printed 334's footnote (٢) points at "الجزء الثاني برقم (١٢١)", but
  volume 5's numbering restarts and her entry is 28 of that run at printed
  246-249. Printed 121 of vol. 5 is فاطمة. Reading only what the note names
  would have found nothing.

**Seven more printed pages in the store were incomplete**, each holding one
entry's half where the printed page carries both. Completed here: `v4/320`,
`v4/321`, `v4/324`, `v4/330`, `v4/334`. Absent entirely: `v4/322`, `v4/323`.
All were left by the store being seeded out of each batch's own account pages.
**A sweep of the whole store for pages that are a strict prefix of Shamela's is
still owed** — this is five of an unknown number.

### Tooling

- `scripts/searchShamela.ts` and `scripts/searchNeighbors.ts` in
  `.claude/worktrees/abu-zaid`. Worth reading before anything else here: the
  project now extracts only from Shamela, and a search over it is exactly what
  locating an entry costs today — this session located four entries by fetching
  pages one at a time.
- `add_claims.py` in `.claude/worktrees/ibad-ibn-bishr`, an ad-hoc helper.
  Probably disposable; read before deleting.

### Superseded, or nearly

Both `.opencode` worktrees checked and removed on 2026-10-01. Branches
`opencode/abdullah-ibn-rawahah` and `opencode/abu-sufyan-ibn-al-harith`
deleted locally and on origin.

- **`.opencode/worktrees/abdullah-ibn-rawahah`** — retired, nothing kept. Its
  single commit (`3c5e496b`, one ahead of a merge-base of `57838021`) holds a
  batch main already has. Same 8 claims, same `notInSource`, same
  `volumeNumber: 4`, and `summary.md` byte-identical; the only claim-level
  difference is the anchor format, the commit carrying pre-migration `230-p9`
  against main's `4/230-p9`. Main also has the approval block the commit
  lacks, and the pages are in the page store (`v4/230.md`–`240.md`) as whole
  printed pages rather than entry-trimmed slices, which is what ADR 0018 asks
  for. The commit's `data/catalog/battles/mutah.ts` change is a regression: it
  drops Ja'far, Aqil and Zayd's `MARTYRED` status. The untracked `src/generated`
  was Prisma build output.
- **`.opencode/worktrees/abu-sufyan-ibn-al-harith`** — retired, main's version
  kept, two claims rescued. The worktree's batch was pre-migration (inline
  `sources` block, `accounts/` pages, anchors without a volume prefix, no
  approval) against a merge-base of `ad4e5da5`. Main's is the later revision
  and better on shape: volume-prefixed anchors, an approval block, reciprocal
  `HALF_BROTHER` edges on نوفل and ربيعة, a Hunayn participant row, `sex` and
  `companion` promoted off the legacy marker, and `deathYearHijri` marked
  `LIKELY` where the entry hedges with `يُقَالُ`. The worktree folded "cousin of
  the Prophet" into the `fullName` string instead of a `PATERNAL_COUSIN`
  relation, and left `sex`/`companion` legacy-unreviewed. Its `accounts/`
  directory holds no text main lacks: pages 203 and 204 are byte-identical to
  the store, and 202 and 205 are entry-trimmed slices of the store's whole
  printed pages.

  Two claims the entry supports were missing from main and came from the
  worktree, verified against the stored pages before it was removed:
  `full-name-alt` (DISPUTED, `4/203-p7`, `وَقَالَ طَائِفَةٌ: اسْمُهُ كُنْيَتُهُ`)
  and `death-place` (`placeOfDeathArabic` = `المدينة`, from `4/204-p3` and
  `4/205-p12`). Both are in [#242](../..//tree/opencode/abu-sufyan-missing-claims),
  which leaves main's batch otherwise untouched. Main's summary had reasoned
  the haircut-wound account stays unclaimed because the model holds no
  cause-of-death field — true, but the passage also names a place.

## What makes this urgent rather than merely untidy

**The authored file layout is about to change.** Every batch above uses
`accounts/<subject>/NNN.md`, which
[source-page-store.md](source-page-store.md) replaces with a per-source page
store keyed by volume and printed page ([ADR 0018](../adr/0018-a-page-belongs-to-the-edition.md)).
Work landed before that migration is converted with everything else; work landed
after has to be converted by hand.

**All of it predates what was learned about volume numbers.** Shamela's `الجزء`
labels the Siyar's own parts and does not count the two sira volumes and the
caliph volume bound before them, so its `الجزء ٢` is this edition's volume 5.
Three batches on main had this wrong and were only caught by checking every page
against its own extraction id. **Every batch resumed from here must be checked
the same way before it is trusted**, and the seven page-only subjects have no
declared volume yet at all, which is the moment to get it right.

## Suggested order

1. **Read `scripts/searchShamela.ts` first.** If it works, everything else here
   gets cheaper.
2. **Commit the three near-complete batches**, each as its own PR, after
   verifying volumes against extraction ids and running
   `npm run history:validate`, `npm run catalog:checklist -- <slug>` and
   `npm run catalog:ledger -- --batch <dir>`. Treat the recorded approvals as
   void: they cover revisions nobody reviewed on main.
3. **Preserve the 86 transcribed pages** even if no one structures them soon.
   They are the expensive part and they are one command from being lost.
4. ~~**Decide on the four early-stage batches.**~~ Done, 2026-10-01: all four
   finished rather than dropped, in #247–#250. See
   [Started and abandoned early](#started-and-abandoned-early--all-four-finished).
5. ~~**Check the two superseded worktrees** and remove them.~~ Done, 2026-10-01;
   see [Superseded, or nearly](#superseded-or-nearly). One of the two yielded a
   PR before removal.

## Acceptance criteria

1. Nothing in the inventory above exists only as an untracked file: each item is
   either committed to a branch pushed to origin, or deleted by an explicit
   decision recorded here.
2. Every batch that lands has its declared volume checked against its pages'
   extraction ids, and `npm run history:validate` passes.
3. Approvals recorded inside a worktree are not carried over; a batch that lands
   is published again, by the user, on main.
4. `git worktree list` holds only worktrees with live work, and every branch left
   behind is either unmerged with a reason or deleted.

## Open issues

### Blockers

None. Everything here is readable where it stands.

### Nonblocking

- ~~**Are the seven page-only subjects in scope?**~~ Settled: all seven landed,
  and `al-ashath-ibn-qais` (#239) was taken in. `yazid-ibn-abi-sufyan` is in
  scope too — entry 68, mid-run, not a `كبار التابعين` overrun (#248).
- **`docs/companion-extraction-checklist.md` may disagree with this list.** It
  tracks which entries have a batch, and these batches are invisible to it. Any
  subject landed from here needs checking off in the same PR. Done for the four in
  #247–#250; `al-ashath-ibn-qais` and the other six landed with theirs.
- ~~**Whether the transcriptions are complete entries** is unverified.~~ Where it
  mattered, the store settled it: every one of the four was checked against
  Shamela directly, and three were found to hold a different subject entirely.
- **The store may hold more partial pages than the seven found here.** Five of
  them surfaced only because these four entries happened to touch them. A page
  whose file is a strict prefix of its Shamela original is a printed page missing
  its second entry, and nothing in the pipeline detects it.
