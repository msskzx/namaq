# Batch: Qutaylah bint Qais al-Kindiyyah, Siyar entry 37 (زوجاته)

This batch preserves al-Dhahabi's complete entry on Qutaylah and supports the
canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/qutaylah-bint-qais-al-kindiyyah/](accounts/qutaylah-bint-qais-al-kindiyyah/)

## Source account

Entry 37 of the زوجاته صلى الله عليه وسلم (the Prophet's wives) section of
*Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), Siyar volume 2
(`volumeNumber` 5 in this batch's `volumes` list), printed page 260. The
entry shares its page with the tail of Asma bint al-Nu'man's entry before it
and the opening of Khawlah bint Hakim's entry after it, so the account is
trimmed to her own four paragraphs (`p5`-`p8`) and her own `(*)`/`(٣)`
footnotes.

`qutaylah-bint-qais-al-kindiyyah` already had a catalog module before this
batch, carried from the retired `neo4j/graphSeedData*.ts` with every field on
`legacyUnreviewed`: `sex`, `fullName`, the `companion` title, and a `DAUGHTER`
edge to `qais-ibn-muadikarib-al-kindi`. No prior batch cited her.

## What the entry supports

Two claims, three citations, one relation on each of three modules
(`qutaylah-bint-qais-al-kindiyyah.ts`, `al-ashath-ibn-qais.ts`,
`prophet-muhammad.ts`).

**Sister of al-Ashath ibn Qais.** The entry opens "يُقَالُ: هِيَ أُخْتُ
الأَشْعَثِ بنِ قَيْسٍ" (`5/260-p6`) - itself hedged with "يقال" (it is said), not
a flat assertion. This promotes the `SISTER`/`BROTHER` edge that
`al-ashath-ibn-qais.ts` already carried on `legacyUnreviewed` to a cited claim
(`qutaylah-siyar10/sister-ashath`), kept at `LIKELY` confidence rather than
`ESTABLISHED` to preserve the source's own hedge.

**Companion status, contested.** Abu Ubaydah's report, "تَزَوَّجَهَا النَّبِيُّ
-صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- حِيْنَ قَدِمَ عَلَيْهِ وَفْدُ كِنْدَةَ، سَنَةَ عَشْرٍ، فَتُوُفِّيَ
قَبْلَ أَنْ يَقْدَمَ عَلَيْهِ" (`5/260-p7`), is immediately followed by "وَيُقَالُ:
إِنَّهَا ارْتَدَّتْ، - فَاللهُ أَعْلَمُ -" (`5/260-p8`) - al-Dhahabi's own entry reports
both that the Prophet married her but died before she reached him, and the
competing report that she apostatized instead, and defers ("فَاللهُ أَعْلَمُ")
rather than choosing between them. Both citations sit under one claim
(`qutaylah-siyar10/companion-of-prophet`, confidence `DISPUTED`), since both
are evidence toward the single question the model records: whether she holds
the `companion` title. Per
[docs/data-pipelines.md](../../../../docs/data-pipelines.md#companion-scope)'s
"a contested صحبة is taken in rather than left out," she keeps the
`companion` title and a `COMPANION_OF` edge to `prophet-muhammad`, now cited
to this claim instead of `legacyUnreviewed`, with the contest stated plainly
here rather than resolved. A nikah is contracted at the marriage agreement,
not at consummation, so the same claim also backs a `WIFE`/`HUSBAND` edge
between her and `prophet-muhammad` — the marriage was concluded when the
Kindah delegation arrived even though he died before she reached him, and
the apostasy report contests her Companion status, not whether the marriage
was contracted. `qutaylah-bint-qais-al-kindiyyah.ts` cites the claim on its
side of that edge; `prophet-muhammad.ts`'s own side stays `legacyUnreviewed`,
since `prophet-muhammad.test.ts` requires every claim his module cites to
come from `prophet-muhammad-sira`, the batch that reads his own account —
this batch reads hers instead.

## Scope call: a contested marriage still gets a WIFE edge

`asma-bint-al-numan-al-kindiyyah` (entry 36, right before Qutaylah on this
same page) has no `HUSBAND`/`WIFE` edge to `prophet-muhammad` in either
module, and neither does `prophet-muhammad.ts` list her, because her own
report has the marriage ended (divorced) before consummation — a different
situation from Qutaylah's, where nothing ended the contract; the Prophet's
death simply preceded her arrival. This batch does not touch Asma's module:
her entry is out of this batch's scope and her situation is not identical to
Qutaylah's, so no precedent is set for her case here.

## What the model has no shape for yet

Nothing else: the entry is four short paragraphs, and the remaining checklist
items it could have answered (nasab beyond the brother tie, kunya,
appearance, manaqeb) are silent, marked `notInSource` on the account.

## Corroboration and disputes

No other batch cites Qutaylah, so there is nothing here to corroborate
against. The internal dispute over her companion status is recorded above
and is the entry's own framing, not a disagreement between sources.

## Leaving the seed

There is no seed left to leave: `prisma/personSeedData*.ts` no longer exists
(migrated per [docs/data-pipelines.md](../../../../docs/data-pipelines.md)).
`fullName`, `sex` and the `DAUGHTER` edge to `qais-ibn-muadikarib-al-kindi`
stay on `legacyUnreviewed`: this entry never restates her father's name or
her own nasab chain, only her brother.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
