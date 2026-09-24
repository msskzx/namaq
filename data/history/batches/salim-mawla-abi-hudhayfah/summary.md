# Batch: Salim mawla Abi Hudhayfah, Siyar entry 14

This batch preserves al-Dhahabi's complete entry on Salim, the mawla of Abu
Hudhayfah, and supports the canonical records selected from it. It follows
the [data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/salim-mawla-abi-hudhayfah/](accounts/salim-mawla-abi-hudhayfah/)

## Source account

Entry 14 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on printed
page 167, right after Abu Hudhayfah's own entry closes, and runs to page
171, where it closes right before entry 15, Hamzah ibn Abd al-Muttalib,
opens.

Page 167 opens with the last two lines of Abu Hudhayfah's entry, already
kept by the batch before this one, then Salim's heading, marked `*`, and
his own source list in the page's notes. Pages 168 through 170 are his in
full. Page 171 carries a roster of the Muslim and Quraysh dead at Badr that
runs on from page 170 with no heading of its own naming Salim, then
Hamzah's heading and his own footnotes, which belong to the next batch. The
extraction keeps this roster: nothing on page 171 marks where it stops
being Salim's entry and starts being the book's own appendix to the
chapter, so trimming it would cut material the book places inside this
entry's bounds. It backs no claim of its own; abu-hudhayfah's batch and
this one already cite the roster's earlier lines for the two Companions the
model already holds who appear in it.

`salim-mawla-abi-hudhayfah` had no catalog file before this batch. He was
only a name in `prisma/personSeedData3.ts`, carrying the `companion` title
and nothing else.

## What the entry supports

Five claims and seven citations.

His full name. Musa ibn Uqbah gives it directly: "هُوَ سَالِمُ بنُ مَعْقِلٍ"
(`167-p5`).

His standing. The entry opens with "مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ، البَدْرِيِّيْنَ،
المُقَرَّبِيْنَ، العَالِمِيْنَ" (`167-p4`), which backs `virtues` together with
two more lines: Ibn Umar's report that he led the Muhajirun in prayer
"لأَنَّهُ كَانَ أَقْرَأَهُم" (`168-p2`), and the Prophet's own praise for his
recitation, "الحَمْدُ لِلِّهِ الَّذِي جَعَلَ فِي أُمَّتِي مِثْلَكَ" (`168-p9`).

Badr. The same opening line calls him "البَدْرِيِّيْنَ" (`167-p4`). This adds
him as a plain participant to `badr`, next to Abu Hudhayfah, the entry
right before his.

His mawla relation to Abu Hudhayfah. Musa ibn Uqbah's account states it in
the same breath as his full name: "وَالَى أَبَا حُذَيْفَةَ" (`167-p5`). This is
the piece the batch before this one flagged as unmodeled; `MAWLA` and
`PATRON` now exist, so `salim-mawla-abi-hudhayfah` carries `MAWLA` to
`abu-hudhayfah`, and the projector adds the reciprocal `PATRON` edge.

A pact-brother pairing with Abu Ubaydah ibn al-Jarrah. Muhammad ibn Ibrahim
al-Taymi's report states the Prophet paired them at the brotherhood between
the Muhajirun and the Ansar: "وَآخَى النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَيْنَ
سَالِمٍ مَوْلَى أَبِي حُذَيْفَةَ، وَبَيْنَ أَبِي عُبَيْدَةَ بنِ الجَرَّاحِ" (`169-p5`). The very
next line marks this chain "هَذَا مُنْقَطِعٌ", so the claim carries `UNASSESSED`
confidence rather than `ESTABLISHED` and a note explaining why. `PACT_BROTHER`
already exists (see `abdur-rahman-ibn-awf.ts`), so this adds a second pairing
to it from the freedman's own side.

## What the model has no shape for yet

Sahlah bint Suhayl's milk-kinship ruling for Salim (`167-p6` through
`167-p11`): she asked the Prophet how to let a grown Salim, who had been
raised among her household, continue to visit her freely once he reached a
man's age, and the Prophet told her to nurse him so the same mahram rules
that apply to a blood relative by breastfeeding would apply to him. `MILK_BROTHER`
and `MILK_SISTER` exist, but both are sibling relations between two people
nursed by the same woman, not a relation between a nursing woman and the man
she nursed, so this ruling still has no relation to carry it. Sahlah is not
a catalog subject either. This is the second of the two items the batch
before this one flagged as unmodeled; it is still open.

Musa ibn Uqbah's own account also names the freedwoman, Thubaytah bint
Ya'ar, as the one who manumitted Salim, against Abu Hudhayfah adopting him,
"وَتَبَنَّاهُ أَبُو حُذَيْفَةَ، كَذَا قَالَ" (`167-p5`). Al-Dhahabi's "كَذَا قَالَ" marks
this detail as Musa ibn Uqbah's alone rather than settled. Neither Thubaytah
nor an adoption relation is a catalog subject or relation type, so only the
`MAWLA` side to Abu Hudhayfah, which the account states without the same
qualifier, is claimed here.

Umar ibn al-Khattab naming Salim and Abu Ubaydah as the two men he would
have trusted with the caliphate had they outlived him (`170-p6`), on a chain
Ali ibn Zayd carries and al-Dhahabi notes as "لَيِّن" if it survives at all.
No field holds a remark like this about someone else's opinion of a person,
so it stays in the page text.

His death at Yamamah, digging himself a trench and fighting until he was
killed rather than let the Muhajirun's banner fall (`169-p8`, `169-p9`).
Unlike Abu Hudhayfah's own entry, which states the year outright, this
entry gives no year for Salim's death, so `deathYearHijri` stays unclaimed.
No `yamamah` battle exists in the catalog yet either, matching Abu
Hudhayfah's and as-Saib ibn Uthman's own entries.

His sale price, an inheritance share of two hundred dirhams `Umar` gave to
Salim's mother (`169-p11`), and the report that Salim and Abu Hudhayfah
were found dead together at Yamamah, one man's head at the other's feet
(`169-p12`). Neither backs a field or relation the model holds.

## Corroboration and disputes

`prophet-muhammad-sira` does not name Salim anywhere, so nothing in this
entry corroborates or conflicts with it. Nothing in this entry conflicts
with Abu Hudhayfah's own entry, the one immediately before it; both agree
he was Abu Hudhayfah's mawla and was killed at Yamamah.

## Leaving the seed

`prisma/personSeedData3.ts` still carries `salim-mawla-abi-hudhayfah` with
only a name and the `companion` title. This batch does not retire that
entry: the new `data/catalog/people/salim-mawla-abi-hudhayfah.ts` carries
`companion` forward on its legacy marker, since this entry never calls him
صحابي outright, matching the pattern in Abu Hudhayfah's own entry.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
