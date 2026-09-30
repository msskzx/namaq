# Unresolved page-store anchors

Status: **tracked, not fixed**. Surfaced while migrating import to
[source-page-store.md](source-page-store.md); not caused by that migration.

## What this is

The old schema paired a page's declared `passages` array with its Markdown's
paragraphs by *array position*, regardless of what number the anchor itself
claimed — `history:validate` never checked that `"324-p10"` was really the
tenth paragraph of anything. `history:validate` now derives anchors from the
store page's own paragraph order, which is a real position, and 11 batches'
anchors don't land where their number says: the excerpt they cite isn't the
paragraph at that position, and isn't anywhere else on the page either.

The most legible case: `talhah-ibn-ubaydullah`'s full-name claim cites anchor
`4/23-p17` — paragraph *seventeen* of printed page 23 — but the store's
`v4/23.md` holds only 10 paragraphs. Whoever extracted the page wrote down
where the entry falls on the shared printed page (something else,
untranscribed, occupies paragraphs the extracted text never reached), but
nobody has extracted that content, so the store page stops short of the
number the anchor names.

## Affected batches

`abu-al-as-ibn-ar-rabia`, `abu-ubaydah-pilot`, `fatimah-bint-muhammad`,
`maan-ibn-adi`, `qutaylah-bint-qais-al-kindiyyah`, `saad-ibn-abi-waqqas`,
`safiyyah-bint-huyayy`, `talhah-ibn-ubaydullah`, `umm-shareek` —
`npm run history:validate` on each names the exact anchors.

`arwa-bint-abd-al-muttalib-siyar175` also fails validation, but that one is
already tracked separately in
[reextract-from-shamela.md](reextract-from-shamela.md): it cites the
now-dropped islamweb source and awaits re-extraction from Shamela, unrelated
to the anchor-position issue above.

## What fixing one needs

For each flagged citation: open the page at the entry's own `extractionUrl`
on Shamela, find whether the missing leading (or trailing) content belongs to
an untaken neighboring entry — extract it and add it to the store, which
gives the page its true paragraph count and makes the existing anchor number
correct — or the anchor was simply mislabeled and should be renumbered to
match the store page's real position. Either way this is a per-page read
against Shamela, not something to batch-fix mechanically: `docs/extraction-checklist.md`'s
caution about not inventing content applies here too.

## Consequence for this migration

These batches fail `npm run history:validate` and cannot be imported until
fixed. They were never actually verified against printed-page position
before — `npm run history:verify-excerpts` on the old schema would have
caught the same gap by excerpt-matching, but it silently normalized away
tashkeel-only mismatches without ever running clean across the corpus, so
nobody had reason to look here until validation started deriving anchors
from real position.
