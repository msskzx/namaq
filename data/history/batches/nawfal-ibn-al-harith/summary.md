# Batch: Nawfal ibn al-Harith, Siyar entry 27

This batch reads نوفل بن الحارث بن عبد المطلب الهاشمي from al-Dhahabi's
Siyar entry on him, entry 27 in the book's own order, immediately after
البراء بن مالك (entry 26, `data/history/batches/al-baraa-ibn-malik`). It
follows [docs/data-pipelines.md](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/nawfal-ibn-al-harith/](accounts/nawfal-ibn-al-harith/)

## Ordering

The last-extracted companion-index batch is entry 26 (al-Baraa ibn Malik,
Shamela 1621–1624, printed 195–198). The companion index
(`islamweb.net/ar/library`, book 60, `idfrom=35`) and Shamela's own table of
contents both place entry 27, نوفل بن الحارث بن عبد المطلب الهاشمي, directly
after it. No batch exists for it under `data/history/batches/`, so it is new;
`data/catalog/people/nawfal-ibn-al-harith.ts` already exists as a
legacy-unreviewed stub, which this batch visits (see below) rather than
re-extracting. Shamela-page range 1625 sits inside the in-scope block of the
Companion-scope table (section opening at Shamela 1431), far from either
out-of-scope run (3084, 3263).

## No contested صحبة

This is not a contested case. The entry has him present at Badr with the
mushrikun and captured, then Muslim, emigrating in the year of Khandaq,
present at Bay'at al-Ridwan, and steadfast with the Prophet at Hunayn
(`199-p4`, `199-p6`). Nothing in the entry disputes his companionship, so
there is no contest to record; the companion title on his catalog entry stays
`legacy-unreviewed` the way recent batches leave it (no Siyar entry states a
title in words, and none of the entry-17–26 batches authors one either).

## Source account

Entry 27 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The whole entry fits
on one printed page: 199 (Shamela 1625), ten paragraphs (`199-p1`–`199-p10`),
opening cleanly at the top of the page — the al-baraa batch confirms entry 26
closes at the foot of page 198, so no start trimming was needed.

The page is shared at its foot with the next entry: `199-p10` ("وَابْنُهُ:")
is this entry's bridge line, while `199-p11` opens entry 28 (الحارث بن نوفل).
Extraction ends at `--end-anchor p10`, so entry 28's paragraphs stay for its
own batch. The footnotes run together in one block, so they are cut by marker:
`--notes-end-marker "(* *)"` keeps entry 27's own `(*)` bibliography and the
`(١)` correction ("سقطت لفظة أبي من المطبوع", on `199-p2`'s "أخو أبي
سفيان") and drops entry 28's `(**)` bibliography. The account carries
`volumeNumber: 4`.

## What this entry supports

Eleven claims on the single page.

His name, from the heading (`199-p1`): "نوفل بن الحارث بن عبد المطلب
الهاشمي" backs `fullName` and the `SON` relation to the existing catalog
person `al-harith-ibn-abd-al-muttalib`. Note the chain is shorter than the
legacy seed value it replaces ("...بن هاشم القرشي الهاشمي"): the extra links
were uncited seed text, and this entry states only up to عبد المطلب, so the
catalog value follows the entry.

His kunya "أبو الحارث" (`199-p2`); his brother "أخو أبي سفيان بن الحارث"
(`199-p2`) — the shared father is read from the nasab, no mother is stated,
so the tie is `HALF_BROTHER` to `abu-sufyan-ibn-al-harith`, per the
checklist's full-sibling rule; and the reported مؤاخاة with al-Abbas
(`199-p5`, a bare وقيل with no counter-report, hence `LIKELY`) as
`PACT_BROTHER` to `al-abbas-ibn-abd-al-muttalib`.

His standing, carried as `virtues`: older than his uncle al-Abbas, the eldest
of Banu Hashim in his time, and at Hunayn aiding the Prophet with three
thousand spears and standing firm with him (`199-p3`, `199-p6`, `199-p9`).

Three battle placements: Badr on the mushrik side, captured (`199-p4`) —
modelled as `PARTICIPATED_IN` Badr following the suhail-ibn-amr precedent
(attendance, not side; `isMuslim: false`, `WAS_CAPTURED`); Bay'at al-Ridwan
(`199-p6`) as Hudaybiyyah; Hunayn with the three thousand spears (`199-p6`).

His death comes as two bare قيل reports with no preference between them:
سنة عشرين (`199-p7`) and سنة خمس عشرة (`199-p8`). Both are kept as separate
attributed claims; the عشرين report is the carried catalog value (entry
order), the خمس عشرة report is `DISPUTED`, following the suhail-ibn-amr
death-place pattern.

## What the entry does not carry into the model

No physical description anywhere on the page — "أسن" is seniority in age,
not appearance — and no marriage wording (`تزوج`/`امرأة`/`زوج` all miss), so
`appearance` and `wives` are marked `notInSource`. His ransom by al-Abbas, his
migration in the year of Khandaq, and al-Dhahabi's closing "ما علمت له رواية
ولا ذكرا بأكثر مما أوردت" stay in the source page, unclaimed: the model holds
no value they back. The "وابنه:" bridge (`199-p10`) names no son by itself —
the son's name opens entry 28, outside these pages — so no father-side claim
is authored here; entry 28's own batch will cite "أسلم مع أبيه" from its own
text.

## Leaving the legacy

Of the four legacy values on `nawfal-ibn-al-harith.ts`, two are promoted
(`fullName`, the `SON` relation) and two stay legacy with reason: `sex`
(MALE is evident but never stated in words) and the `companion` title (shown
by section placement and deeds, never stated in words — the same call every
entry-17–26 batch made). Newly found values (`kunya`, `virtues`,
`deathYearHijri`, `HALF_BROTHER`, `PACT_BROTHER`) are authored into the
catalog entry with this batch's claim keys. His three participations are
registered on `data/catalog/battles/badr.ts`, `hudaybiyyah.ts` and
`hunayn.ts` in the shape the suhail and baraa batches established. The scoped
`catalog:ledger` still lists legacy on the related subjects (al-Abbas,
Abu Sufyan, the three battles' older rows) — those belong to their own
subjects' batches, not this one.

## Verification

- `npm run catalog:checklist -- nawfal-ibn-al-harith`: five ✅
  (fullName, kunya, manaqeb, nasab, siblings), two ⚪ confirmed absent
  (appearance, wives) — nothing unchecked.
- `npm run history:validate -- data/history/batches/nawfal-ibn-al-harith`:
  11 claims, no issues.

## Review

Nothing is reviewed and nothing is approved. Every claim is Not reviewed —
nobody has compared them against the stored page — and `batch.json` carries
no approval block; approval for publication is a separate step the user takes
explicitly, later.
