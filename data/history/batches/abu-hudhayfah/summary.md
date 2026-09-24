# Batch: Abu Hudhayfah, Siyar entry 13

This batch preserves al-Dhahabi's complete entry on Abu Hudhayfah ibn Utbah
ibn Rabiah and supports the canonical records selected from it. It follows
the [data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-hudhayfah/](accounts/abu-hudhayfah/)

## Source account

Entry 13 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on printed
page 164, right after as-Saib ibn Uthman's entry closes, and runs to page
167, where it closes right before entry 14, Salim mawla Abi Hudhayfah, opens.

Page 164 carries the tail of as-Saib's own footnotes first, then Abu
Hudhayfah's heading, marked `*`, and his own source list in the page's
notes. Pages 165 and 166 are his in full. Page 167 opens with the last two
lines of his entry, then Salim's heading and his own footnotes, which
belong to the next batch. The extraction keeps only Abu Hudhayfah's own
paragraphs and trims the notes at each entry boundary.

`abu-hudhayfah` had no catalog file before this batch. He was only a name in
`prisma/personSeedData3.ts`, carrying the `companion` title and nothing
else, and a `SON`/`FATHER` edge pair to `utbah-ibn-rabiah` in
`neo4j/graphSeedData3.ts` with no citation. This entry's opening line gives
his nasab back to Utbah directly, so this batch promotes that edge to a
cited claim.

## What the entry supports

Seven claims and seven citations.

His nasab. The entry's second line gives it directly: "أَبُو حُذَيْفَةَ ابْنُ
شَيْخِ الجَاهِلِيَّةِ: عُتْبَةَ بنِ رَبِيْعَةَ بنِ عَبْدِ شَمْسٍ بنِ عَبْدِ مَنَافٍ بنِ قُصَيِّ بنِ
كِلاَبٍ" (`164-p8`). This cites the `SON` relation to `utbah-ibn-rabiah`,
replacing its legacy marker.

His standing. The same line opens with "السَّيِّدُ الكَبِيْرُ، الشَّهِيْدُ" (`164-p8`),
which holds `virtues`.

Badr. The same line closes with the epithet "البَدْرِيُّ" (`164-p8`). This adds
him as a plain participant to `badr`, next to as-Saib ibn Uthman, the entry
right before his.

Two migrations to Abyssinia. "وَهَاجَرَ إِلَى الحَبَشَةِ مَرَّتَيْنِ" (`165-p3`) states
the count without distinguishing the two trips, so this one line backs his
entry in both `first-hijra-to-abyssinia` and `second-hijra-to-abyssinia`. The
first event already listed him under `abu-hudhayfah/hijra-habasha-first`,
a claim from `prophet-muhammad-sira` naming him in Ibn Ishaq's roster of the
first party; this entry's own count corroborates that without repeating the
roster, so its people list now carries both claim keys.

His half-brother. "وَهُوَ أَخُو الشَّهِيْدِ مُصْعَبُ بنُ عُمَيْرٍ لأُمِّهِ" (`166-p7`) adds a
`BROTHER` relation to `musab-ibn-umayr`, a subject the app already models.

Death year. He was martyred at Yamamah in year 12 AH: "اسْتُشْهِدَ أَبُو حُذَيْفَةَ
-رَضِيَ اللهُ عَنْهُ- يَوْمَ اليَمَامَةِ، سَنَةَ اثْنَتَيْ عَشْرَةَ" (`166-p4`). `deathYearHijri`
holds "12" from this passage. No `yamamah` battle exists in the catalog yet,
so this stays a field value with no `PARTICIPATED_IN` relation, matching
as-Saib ibn Uthman's own death-at-Yamamah claim in the batch before this one.

## What the model has no shape for yet

His birth name, Qais, and the note that the earlier chronicler Ibn Hisham's
"Mihsham" is a mistake belonging to a different man's kunya. Both live only
in the page's footnotes (`002.notes.md`), not its body, so neither is
citable through `passageAnchor`.

His wife, Sahlah bint Suhayl, and their son Muhammad ibn Abi Hudhayfah, who
later led the revolt against Uthman ibn Affan (`165-p3`). Neither is a
catalog subject, so there is no `HUSBAND`/`WIFE` or `SON`/`FATHER` relation
to declare yet.

His mawla Salim's manumission and adoption, and Sahlah's milk-kinship ruling
for him (`165-p4`). `salim-mawla-abi-hudhayfah` is a catalog subject, but a
mawla relationship has no relation type in the model, and the milk-kinship
ruling is not a value any field or relation holds.

His challenge to his own father at Badr, "أَنَّ أَبَا حُذَيْفَةَ بنَ عُتْبَةَ دَعَا يَوْمَ
بَدْرٍ أَبَاهُ إِلَى البرَازِ" (`165-p5`), and his sister Hind's poem rebuking him for
it (`165-p6`, `166-p1`, `166-p2`). The entry does not say whether Abu
Hudhayfah killed Utbah in that duel, only that he called him to it, so
`badr.ts`'s participant comment states the challenge and stops there.

His full-brother Abu Hashim ibn Utbah's later conversion, his career under
Muawiyah, and the hadith Abu Hashim narrates (`166-p5` through `166-p13`).
Abu Hashim is not a catalog subject.

His age at death, 53 years (`167-p1`), which the model has no field for
alongside `deathYearHijri`.

## Corroboration and disputes

`prophet-muhammad-sira` names Abu Hudhayfah once, in its roster of the first
party to Abyssinia (`1/147-p3`). This entry's "مَرَّتَيْنِ" agrees with that
without adding a second, independent count, so both claims stay on
`first-hijra-to-abyssinia`'s people list rather than one replacing the
other. Nothing in this entry conflicts with as-Saib ibn Uthman's own Badr
entry, the one immediately before it.

## Leaving the seed

`prisma/personSeedData3.ts` still carries `abu-hudhayfah` with only a name
and the `companion` title. This batch does not retire that entry: the new
`data/catalog/people/abu-hudhayfah.ts` carries `companion` forward on its
legacy marker, since this entry never calls him صحابي outright, matching
the pattern in as-Saib's own entry.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
