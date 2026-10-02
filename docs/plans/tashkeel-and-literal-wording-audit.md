# Tashkeel and literal-wording audit

Status: **not started**. This is a plan only — nothing below is implemented.

User report (sources page for `siyar-alam-al-nubala-risalah`, and the profiles
built from its batches): chapter titles in the volume contents list don't
match al-Dhahabi's own headings, and several profile fields (`fullName`, body
text in `الشواهد`) are missing tashkeel that the source carries. Example:
`سَعِيْدُ بنُ زَيْدِ بنِ عَمْرِو بنِ نُفَيْلٍ العَدَوِيُّ` (shamela.ws/book/10906/1550)
shows as `سعيد بن زيد` in the chapters list; az-Zubayr ibn al-Awwam's profile
shows `fullName` as `الزبير بن العوام بن خويلد بن أسد بن عبد العزى بن قصي بن
كلاب بن مرة بن كعب بن لؤي بن غالب، القرشي الأسدي` with no tashkeel at all.

This splits into two different defects with two different causes. Confirmed
by reading the actual files, not by inference:

## Finding 1: chapter-list titles aren't always the source heading

`SourceContents.tsx` renders each page's title as
`item.headings[0] ?? item.entries[0]?.label`
([volumeChapters.ts:11](../../src/lib/history/volumeChapters.ts)).
`headings` come from `sectionHeadings.ts` scanning the stored page's own
markdown for a bold-paragraph line matching the book's heading format
([sourceAccounts.ts:194-210](../../src/lib/history/sourceAccounts.ts)); when
that scan finds nothing on a page, the row falls back to
`entries[0]?.label`, which is the catalog person's short `name` —
unvocalized, by design (it's the display name, not a transcription).

So an unvocalized, numberless chapter title is not necessarily a bad
transcription. It can mean:
- the page genuinely has no detected heading in the store yet (no batch has
  extracted that printed page, or the batch that did didn't preserve the
  `النَّص - رقم - اسم` heading line as its own paragraph), and the UI is
  silently substituting the catalog name, or
- the heading line was transcribed but normalized/stripped during extraction.

These need different fixes (extract the missing page vs. fix a bad
transcription), so the audit below checks the store, not just the rendered
page.

## Finding 2: `assertion` text is not held to the same fidelity as `excerptArabic`

Every claim has two Arabic text fields: `excerptArabic` (the citation) and
`assertion` (the field value, which is what the profile displays).
`scripts/history/verifyExcerpts.ts` already proves every `excerptArabic` is a
literal substring of its source page — this check passed for az-Zubayr's
batch, and his citation for `fullName` is fully vocalized:
`الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى...`
([batch.json](../../data/history/batches/az-zubayr-ibn-al-awwam/batch.json)).
But the `assertion` next to it — the text that actually reaches the
database and the profile page — reads
`الزبير بن العوام بن خويلد بن أسد بن عبد العزى...` with every diacritic
dropped, despite being nearly a verbatim copy of the citation sitting right
beside it.

Nothing in `history:validate` or the extraction checklist requires
`assertion` to match the source's wording or diacritics. It's written as a
paraphrase and is allowed to be one. For narrative fields (`titles`,
`appearance`, participation `summary`) a paraphrase is reasonable. For fields
that are themselves a name or a direct quotation — `fullName`, `kunya`,
`nasab`-shaped assertions — a paraphrase that drops tashkeel is a quiet
quality regression with no check catching it, because the one tool that
checks fidelity (`verifyExcerpts.ts`) only ever looks at `excerptArabic`.

## Scope question to settle first

Confirm with the user before scripting anything: **which fields should be
verbatim-with-tashkeel, and which stay as editorial paraphrase?** Candidate
split, to confirm or correct:

| Field | Expected to be verbatim | Why |
| --- | --- | --- |
| `fullName`, `nasab` | Yes | It's a name, not a summary of one |
| `kunya`, `titles` (when quoting a title phrase) | Yes | Same — a title is quoted, not described |
| `appearance` | Yes, if it's a quoted description | The source's own wording is the evidence |
| `summary` (battle participation) | No — explicitly "in the source's own wording" per `AGENTS.md`, but that already implies verbatim-ish; confirm whether paraphrase is acceptable here | — |
| `notInSource` notes | No | These are the agent's own notes, not source text |

## Plan

### Step 1 — Inventory, read-only, no code changes yet

1. For every batch under `data/history/batches/`, extract all `claims[].assertion`
   paired with their first citation's `excerptArabic`. A small script
   (`tsx`, read-only) suffices — this doesn't need `--apply` anything.
2. For each pair, check:
   - Does `assertion`, with tashkeel stripped from both sides, appear as a
     substring of `excerptArabic` with tashkeel also stripped? (Confirms the
     wording itself, ignoring diacritics, already matches — i.e. this is a
     tashkeel-only gap, the easy case.)
   - If that fails too, the wording itself diverges (a real paraphrase, or a
     transcription mismatch) — flag separately, don't auto-fix.
3. Cross-reference against the field table above: only flag fields marked
   "expected to be verbatim."
4. Output: one list of `(subject, field, batch file, current assertion,
   source excerpt)` tuples needing a tashkeel restore, and a second list of
   fields where the wording itself differs and needs a human read.

### Step 2 — Inventory the chapter-list gap separately

1. For each volume of `siyar-alam-al-nubala-risalah`, call
   `volumeChapterRows` (or the `/api/sources/<slug>/volumes/<n>` route data)
   and record which rows fall back to `entries[0]?.label` (no store heading
   found) versus which use a store heading.
2. For the fallback rows, check whether the printed page is actually in the
   store at all (`data/history/sources/siyar-alam-al-nubala-risalah/v<n>/<page>.md`
   missing entirely — a coverage gap, batch work) versus present but
   `sectionHeadings.ts` not matching its heading line (a parser gap, code
   work).
3. Separately, grep every page actually in the store across all volumes for
   heading-shaped lines that lack tashkeel while the rest of that same page
   has it — a signal of a bad transcription on that specific page, not a
   coverage gap. (v1–v3, the two Sira volumes and the caliphs volume, appear
   from a spot check to be unvocalized edition-wide — confirm this is a
   property of those volumes' Shamela pages themselves, not an extraction
   defect, before flagging anything there.)

### Step 3 — Decide fixes per bucket, with the user

Do not batch-fix. Each bucket above needs a different action and a human
decision:
- Tashkeel-only `assertion` drift (Step 1, easy case): re-copy the vocalized
  wording from the existing, already-verified `excerptArabic` into
  `assertion`. Mechanical, but still a per-batch edit + `history:validate` +
  re-approval (this changes the batch, so prior publication approval no
  longer covers it — same consequence noted in
  [reextract-from-shamela.md](reextract-from-shamela.md)).
- Wording-diverges cases: needs a person to re-read the source page and
  either fix `assertion` or confirm the paraphrase is intentional.
- Missing store pages (Step 2): extraction work under
  [extraction-checklist.md](../extraction-checklist.md) for that subject —
  not a quick fix, it's a new batch.
- Heading-detection misses on pages already in the store: a `sectionHeadings.ts`
  fix, with a test fixture from the actual page that failed.

### Step 4 — Decide whether to add a lasting check

If Step 1 finds this is systemic (more than a handful of subjects), consider
extending `verifyExcerpts.ts` or adding a sibling script that checks
tashkeel-stripped `assertion` against tashkeel-stripped `excerptArabic` for
the fields marked verbatim in the scope table, and wiring it into the same
place `catalog:checklist` runs. This is a decision to make after Step 1's
numbers are in, not before — don't design the check before knowing the shape
of the problem.

## Acceptance criteria (for the audit phase only — fixes are separate work)

1. A list exists of every `(subject, field)` pair where `assertion` drops
   tashkeel that its own citation's `excerptArabic` already has.
2. A list exists of every `(subject, field)` pair where `assertion` wording
   diverges from the citation beyond tashkeel.
3. A list exists of every volume/page in `siyar-alam-al-nubala-risalah` whose
   chapter-list row falls back to the catalog name, split into "page missing
   from store" vs. "page present, heading not detected."
4. The scope table above is confirmed or corrected by the user before any
   fix work starts.
5. No batch file, source page, or database row is edited in this phase.

## Out of scope

- Fixing anything found. This plan ends at a reviewed inventory.
- Re-extracting v1–v3 to add tashkeel, if the audit confirms those Shamela
  pages are unvocalized in the edition itself rather than in this project's
  transcription.
- Any change to `verifyExcerpts.ts` or a new checking script, beyond the
  read-only inventory scripts needed to produce the lists above.

## Open issues

### Blockers

None — both findings are confirmed by reading existing files; the audit can
start without further investigation.

### Nonblocking

- Whether `summary` (battle participation) belongs in the verbatim set.
  `AGENTS.md`'s "Data model" section already says it carries the source's
  "own wording," which is ambiguous between verbatim and close paraphrase —
  worth settling once, since it affects every participation claim, not just
  this subject's.
- Whether v1–v3 (the Sira and caliphs volumes) are unvocalized in Shamela's
  own edition or only in this project's stored pages. If the former, nothing
  to fix there; if the latter, those three volumes need the same
  re-extraction treatment as
  [reextract-from-shamela.md](reextract-from-shamela.md), at a much larger
  scale.
