# Batch: Amir ibn Abi al-Bukayr, Siyar entry 19

This batch gives عامر بن أبي البكير الليثي his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/amir-ibn-al-bukayr/](accounts/amir-ibn-al-bukayr/)

## Source account

Entry 19 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on the
page right after Iyas's entry closes, introduced by "أَخُوْهُمُ الرَّابِعُ"
(their fourth brother) and its own numbered heading, and it closes on the
same page: entry 20, Mistah ibn Uthathah, opens right after with its own
heading and bibliography footnote. The whole entry is five paragraphs on one
page, so this batch's account has a single page rather than a range.

## What this entry supports

Five claims, all citing the same page. Amir had no catalog file before this
batch; the seed row only gave his name, an inferred full ancestor chain, and
a bare "companion" title, so this batch is his first author.

His name, from the entry's own heading: "عَامِرُ بنُ أَبِي البُكَيْرِ
اللَّيْثِيُّ" (`187-p2`). The entry gives no fuller ancestor chain than
this; the seed's longer form back to Sa'd ibn Layth was inferred from book
placement, not read from his own page, so this batch does not carry it
forward as a cited value. It does not repeat the al-Bukayr father-name
dispute either, told once already in Aqil's entry. The heading gives no
kunya for him.

The Prophet paired him with Thabit ibn Qays ibn Shammas under the pact of
brotherhood (`187-p3`), which gives Amir his first `PACT_BROTHER` relation.
Thabit already has a seed row (`prisma/personSeedData6.ts`, slug
`thabit-ibn-qais`) with no catalog file of his own yet, so this batch adds
only a one-sided reference to his existing slug rather than authoring him.

The same paragraph adds that he attended Badr, "شَهِدَ بَدْراً", giving him
a `PARTICIPATED_IN` relation to `data/catalog/battles/badr.ts` with no
`status`; he survived it, unlike his brother Aqil.

He was martyred at the Battle of Yamama: "وَاسْتُشْهِدَ عَامِرٌ يَوْمَ
اليَمَامَةِ" (`187-p6`). The catalog has no Battle entry for Yamama, so this
cannot become a `PARTICIPATED_IN` relation the way Badr did; the same
sentence instead backs two things the model does hold: a `placeOfDeathArabic`
field ("اليمامة") and the `martyr` title, since "استشهد" states the fact a
bare "شهيد" epithet would.

## What the model has no shape for yet

"وَالمَشَاهِدَ كُلَّهَا" (all the [major] battles) names no specific
engagement this app's `Battle` catalog holds, so it backs no claim, the same
gap Iyas's and Khalid's entries left. Al-Dhahabi's own remark that no other
four brothers besides them attended Badr together ("قُلْتُ: مَا شَهِدَ
بَدْراً إِخْوَةٌ أَرْبَعَةٌ سِوَاهُم") is about the brothers as a group, not
a value this app's person or battle model records for Amir individually, so
it stays in the source text rather than becoming a claim. Yamama itself has
no Battle catalog entry at all; a Battle record for it, if one is added
later, would let his martyrdom become a `PARTICIPATED_IN` relation with
`status: ['MARTYRED']` instead of the two field/title claims used here.

## Corroboration

`prophet-muhammad-sira`'s roster of the Prophet's confederates names "خالد،
وعامر، وعاقل، وإياس بنو البكير" together as allies of Banu Adi (claims
`ammar/hilf` and `suhayb/hilf`, which cite the same sentence for other
people in it but not for the al-Bukayr brothers themselves). Amir's own
entry says nothing about tribal affiliation, so this batch cannot close that
gap for him from his own page; it stays where Iyas's, Khalid's, and Aqil's
batches left it, in `prophet-muhammad-sira`.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `amir-ibn-al-bukayr` as an
active entry. `data/catalog/people/amir-ibn-al-bukayr.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its seed
row in the same commit. He was the last of the four al-Bukayr brothers still
in the seed.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
