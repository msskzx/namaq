# Batch: Aqil ibn al-Bukayr, Siyar entry 16

This batch gives عاقل بن البكير الليثي his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/aqil-ibn-al-bukayr/](accounts/aqil-ibn-al-bukayr/)

## Source account

Entry 16 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on printed
page 185 with its own heading and its own source-list footnote, right after
Hamzah ibn Abd al-Muttalib's entry closes on page 184. It ends on page 186,
paragraph 3, where his death at Badr is reported; entry 17, his brother
Khalid ibn al-Bukayr, opens on the same page with its own heading and its
own source-list footnote, so the two entries' footnote blocks are cut apart
at that boundary rather than shared.

This is a short entry, two pages against Hamzah's fourteen: most of the four
al-Bukayr brothers' shared history (their names, their conversion at Dar
al-Arqam, their migration as one household) is told once here, under Aqil as
the eldest of the four, and the next three entries each add only what is
specific to that brother.

## What this entry supports

Four claims and seven citations. Aqil had no catalog file before this batch;
the seed row only gave his name and a bare "companion" title, so this batch
is his first author.

His full name, from the entry's own heading:
"عَاقِلُ بنُ البُكَيْرِ بنِ عَبْدِ يَا لَيْلَ بنِ نَاشِبٍ اللَّيْثِيُّ" (`185-p1`).
The entry itself then spends three paragraphs (`185-p3` to `185-p5`) on a
scholarly dispute over whether his father's name was al-Bukayr or Abu
al-Bukayr, attributing each reading to different named authorities (Ibn Sa'd
against Abu Ma'shar and al-Waqidi on one side, Musa ibn Uqbah, Ibn Ishaq and
Ibn al-Kalbi on the other). `fullName` is a single field, and the heading is
al-Dhahabi's own choice of reading, so this batch takes that and leaves the
dispute in the source text rather than modeling a second competing name.

His virtues combine three reports: the Prophet renamed him from Ghafil to
Aqil (`185-p3`); he and his three brothers were the first to give their
oath of allegiance at Dar al-Arqam (`185-p7`); and the whole household of
men and women migrated together, locking their doors behind them (`185-p9`).

His pairing with Mubashshir ibn Abd al-Mundhir under the Prophet's pact of
brotherhood, and their shared death at Badr (`185-p12`), gives Aqil his
first `PACT_BROTHER` relation. Mubashshir already had a catalog subject from
an earlier batch's work through the Badr martyr roster, with no relations
of his own yet; this is the first one he gets.

His death at Badr already carries `MARTYRED` status from a `prophet-muhammad-sira`
claim naming him among the fourteen the chapter lists. This entry adds who
killed him and his age: "اسْتُشْهِدَ عَاقِلٌ يَوْمَ بَدْرٍ شَهِيْداً، وَهُوَ ابْنُ
أَرْبَعٍ وَثَلاَثِيْنَ سَنَةً" and "قَتَلَهُ مَالِكُ بنُ زُهَيْرٍ الجُشَمِيُّ"
(`186-p2`, `186-p3`). `CatalogParticipation.summary` holds what happened to a
person at a battle, so this batch adds that field to his existing Badr row in
`data/catalog/battles/badr.ts` rather than opening a second participation.

## What the model has no shape for yet

A second, unattributed report gives a different pact partner: "وَقِيْلَ:
آخَى بَيْنَ عَاقِلٍ وَبَيْنَ مُجَذَّرِ بنِ زِيَادٍ" (`186-p1`). Mujaddir ibn
Ziyad has no catalog subject anywhere in the app, seed or catalog, and this
entry is the only place he is named, so there is nothing here to attach a
second `PACT_BROTHER` relation to. It stays in the source text, the same way
Hamzah's entry left Hind bint Utbah and Wahshi without a place to attach.

His age at death (thirty-four) has no catalog field. The book states it
alongside the Badr martyrdom already cited above, so it stays in the source
text.

## Corroboration and disputes

`prophet-muhammad-sira`'s existing `aqil-bukayr/badr` claim and this entry
agree on the martyrdom at Badr; nothing here contradicts it, and this batch
adds to that participation's `summary` rather than duplicating the claim.

## Leaving the seed

`prisma/personSeedData3.ts` no longer carries `aqil-ibn-al-bukayr` as an
active entry. `data/catalog/people/aqil-ibn-al-bukayr.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its
seed row in the same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
