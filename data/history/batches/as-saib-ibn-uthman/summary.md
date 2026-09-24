# Batch: as-Saib ibn Uthman, Siyar entry 12

This batch preserves al-Dhahabi's complete entry on as-Saib ibn Uthman ibn
Maz'un al-Jumahi and supports the canonical records selected from it. It
follows the [data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/as-saib-ibn-uthman/](accounts/as-saib-ibn-uthman/)

## Source account

Entry 12 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on printed
page 163, right after his uncle Abdullah ibn Maz'un's entry closes, and runs
onto page 164, where it closes right before entry 13, Abu Hudhayfah ibn
Utbah, opens.

Page 163 carries the four paragraphs of Abdullah ibn Maz'un's entry first,
then as-Saib's own heading, marked "**", and his source list, marked
"(* *)", in the page's notes. Page 164 carries the rest of his entry, then
Abu Hudhayfah's own heading and his "(*)" source list. The extraction keeps
only as-Saib's own paragraphs and trims the notes at each entry boundary.

`as-saib-ibn-uthman` had no catalog file before this batch. He was only a
name in `prisma/personSeedData3.ts`, carrying the `companion` title and
nothing else, and a `SON` edge to `uthman-ibn-mazun` in
`neo4j/graphSeedData3.ts` with no citation. Uthman's own batch had already
recorded that edge as `legacyUnreviewed`, noting that Uthman's entry never
states his son's name outright. This entry does: it opens with as-Saib's
full nasab back to Uthman, so this batch promotes that edge to a cited
claim from as-Saib's own account.

## What the entry supports

Four claims and four citations.

His nasab. The heading gives it directly: "السَّائِبُ بنُ عُثْمَانَ بنِ مَظْعُوْنٍ
الجُمَحِيُّ" (`163-p5`). This cites the `SON` relation to `uthman-ibn-mazun`,
replacing its legacy marker.

His skill as an archer. "وَكَانَ مِنَ الرُّمَاةِ المَذْكُوْرِيْنَ" (`163-p8`) holds
`virtues`.

Badr. Ibn Sa'd names three narrators for it: "وَشَهِدَ السَّائِبُ بنُ عُثْمَانَ بَدْراً
فِي رِوَايَةِ ابْنِ إِسْحَاقَ، وَأَبِي مَعْشَرٍ، وَالوَاقِدِيِّ" (`164-p1`). This adds him as
a plain participant to `badr`, alongside his father and his uncles.

Death year. He was hit by an arrow at Yamamah in year 12 AH and died of the
wound: "وَأَصَابَهُ سَهْمٌ يَوْمَ اليَمَامَةِ سَنَةَ اثْنَتَيْ عَشْرَةَ" (`164-p5`), followed by
"وَمَاتَ مِنْهُ" (`164-p6`). `deathYearHijri` holds "12" from the first passage;
the second adds no new value, just the wound's outcome.

## What the entry disputes, and how it resolves

The entry records two challenges to the Badr claim, both raised and settled
within itself. Ibn Uqbah's own account of Badr does not mention as-Saib at
all (`164-p2`). And Hisham ibn al-Kalbi held that the man who attended Badr
was a different person, "السَّائِبُ بنُ مَظْعُوْنٍ", Uthman's full brother rather
than his son (`164-p3`). Ibn Sa'd calls this second claim a mistake outright:
"هَذَا وَهْمٌ" (`164-p4`). No catalog subject holds al-Kalbi's alternate
identity, so there is no competing value here to record as `DISPUTED`; the
`badr` claim rests on Ibn Ishaq, Abu Ma'shar, and al-Waqidi, with Ibn Sa'd's
own rejection of the rival account left in the source text, and a pointer
comment in `data/catalog/battles/badr.ts` at as-Saib's participant entry.

## What the model has no shape for yet

His mother and maternal grandmother, named in the entry's second and third
lines (`163-p6`, `163-p7`): Khawlah bint Hakim al-Sulamiyyah, whose own
mother was Da'ifah bint al-As ibn Umayyah. `CatalogPersonFields` has no
field for a named parent's identity beyond the graph's own `MOTHER`/`FATHER`
relations, and neither woman is a catalog subject, so both names stay in the
source text.

A hijra to Abyssinia, stated without saying which of the two: "هَاجَرَ إِلَى
الحَبَشَةِ" (`163-p8`). His uncle Abdullah's own entry specifies "الهِجْرَةَ
الثَّانِيَةَ" for the same trip; this entry does not, and nothing here says
whether as-Saib travelled with the first group or the second. Assigning him
to either `first-hijra-to-abyssinia` or `second-hijra-to-abyssinia` would
read a choice into the text that the text does not make, so this stays
unclaimed.

The brotherhood pairing with Haritha ibn Suraqah, from the Prophet's
mu'akhat at Medina (`163-p8`). The catalog has no relation type for this
pairing, matching the same gap noted in Abdullah ibn Maz'un's entry for his
own pairing with Sahl ibn Ubayd.

## Corroboration and disputes

`prophet-muhammad-sira` does not cite as-Saib ibn Uthman at all, so there is
nothing there to corroborate or dispute against. Within `badr.ts`, the new
participant entry sits beside `harithah-ibn-suraqah`, the man this same
entry names as as-Saib's mu'akhat partner and whom the `sira/badr` roster
already records as martyred there; the two accounts do not conflict, since
this entry does not say the pairing itself took place at Badr.

## Leaving the seed

`prisma/personSeedData3.ts` still carries `as-saib-ibn-uthman` with only a
name and the `companion` title. This batch does not retire that entry: the
new `data/catalog/people/as-saib-ibn-uthman.ts` carries `companion` forward
on its legacy marker, since this entry never calls him صحابي outright,
matching the pattern in his father's and uncle's own entries.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
