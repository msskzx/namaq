# Batch: Iyas ibn Abi al-Bukayr, Siyar entry 18

This batch gives إياس بن أبي البكير الليثي his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/iyas-ibn-al-bukayr/](accounts/iyas-ibn-al-bukayr/)

## Source account

Entry 18 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on the same
printed page (186) where Khalid ibn al-Bukayr's entry closes, right after
"أَخُوْهُمَا" introduces him as the third of the al-Bukayr brothers, and it
closes on the same page: entry 19, their brother Amir, opens on the next page
with its own numbered heading. The whole entry is four paragraphs on one
page, so this batch's account has a single page rather than a range.

## What this entry supports

Five claims, all citing the same page. Iyas had no catalog file before this
batch; the seed row only gave his name, an inferred full ancestor chain, and
a bare "companion" title, so this batch is his first author.

His full name, from the entry's own heading: "إِيَاسُ بنُ أَبِي البُكَيْرِ
بنِ عَبْدِ يَا لَيْلَ اللَّيْثِيُّ" (`186-p10`). The entry gives no fuller
ancestor chain than this; the seed's longer form back to Sa'd ibn Layth was
inferred from book placement, not read from his own page, so this batch does
not carry it forward as a cited value. It does not repeat the al-Bukayr
father-name dispute either, told once already in Aqil's entry.

The Prophet paired him with al-Harith ibn Khazamah under the pact of
brotherhood (`186-p11`), which gives Iyas his first `PACT_BROTHER` relation.
Al-Harith had no catalog subject anywhere in the app, so this batch creates a
bare one for him, the same way Khalid's batch created Zayd ibn al-Dathinah's,
and reads the same pairing as evidence of his `sex`.

The same paragraph adds that he attended Badr, "وَشَهِدَ بَدْراً", giving him
a `PARTICIPATED_IN` relation to `data/catalog/battles/badr.ts` with no
`status`; he survived it, like Khalid.

He died in year 34 AH: "تُوُفِّيَ سَنَةَ أَرْبَعٍ وَثَلاَثِيْنَ" (`186-p13`),
a `deathYearHijri` field claim.

## What the model has no shape for yet

"وَالمَشَاهِدَ كُلَّهَا" (all the [major] battles) and "شَهِدَ فَتْحَ
مِصْرَ" (the conquest of Egypt) name no specific engagement this app's
`Battle` catalog holds, so neither backs a claim. Al-Raji' left the same kind
of gap in Khalid's entry.

## Corroboration

`prophet-muhammad-sira`'s roster of the Prophet's confederates names "خالد،
وعامر، وعاقل، وإياس بنو البكير" together as allies of Banu Adi (claims
`ammar/hilf` and `suhayb/hilf`, which cite the same sentence for other
people in it but not for the al-Bukayr brothers themselves). That batch adds
no `tribalAffiliation` claim for any of the four brothers, matching how
Khalid's and Aqil's batches left the same gap. This batch does not close it
either; that gap belongs to `prophet-muhammad-sira`.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `iyas-ibn-al-bukayr` as an
active entry. `data/catalog/people/iyas-ibn-al-bukayr.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its seed
row in the same commit. Amir ibn Abi al-Bukayr's seed row, which referenced
Iyas's only for its shared ancestor-chain comment, now points at Iyas's
catalog file instead.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
