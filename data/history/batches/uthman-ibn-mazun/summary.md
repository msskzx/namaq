# Batch: Uthman ibn Maz'un, Siyar entry 9

This batch preserves al-Dhahabi's complete entry on Uthman ibn Maz'un and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/uthman-ibn-mazun/](accounts/uthman-ibn-mazun/)

## Source account

Entry 9 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs from
printed page 153 to page 160.

Page 153 opens mid-page with the tail of Abu Salamah's entry, entry 8. Uthman
ibn Maz'un's own entry starts at `153-p9` with its heading, and its `(*)`
source list sits in the same page's notes, after six footnotes that belong to
Abu Salamah instead, so the page's notes are split by marker: the six stay
with Abu Salamah's batch and the `(*)` block opens this one. Page 160 closes
the entry at `160-p10`, a description of the Maz'un brothers' looks, and page
161 opens entry 10 on Qudamah ibn Maz'un with its own `(*)` source list, so
nothing on page 160 needs trimming.

Uthman ibn Maz'un has no seed entry of his own to retire: `uthman-ibn-mazun`
in `prisma/personSeedData3.ts` carries only a name and the `companion` title,
and no `data/catalog/people/uthman-ibn-mazun.ts` exists yet. This batch is
that file's first authoring, alongside the `prophet-muhammad-sira` batch,
which already cites him for his first hijra to Abyssinia
(`ibn-mazun/hijra-habasha-first`), his death (`ibn-mazun/death`), and a poem
rebuking his cousin Umayyah ibn Khalaf (`ibn-mazun/verses-umayyah`).

## What the entry supports

Eight claims and nine citations.

**Father, now a cited relation.** The entry's heading names his father,
"عثمان بن مظعون بن حبيب بن وهب الجمحي" (`153-p9`), backing the `SON` edge to
Mazun ibn Habib that the graph seed asserted without a citation.

**Full name and kunya.** The heading and the line after it together give his
full nasab down to Ka'b, "عثمان بن مظعون بن حبيب بن وهب بن حذافة بن جمح بن
عمرو بن هصيص بن كعب الجمحي" (`153-p9`, `153-p10`), and his kunya, "أبو
السائب" (`153-p10`).

**Appearance.** A description from his niece Aishah bint Qudamah closes the
entry: "كان عثمان شديد الأدمة، كبير اللحية" (`160-p10`), dark-skinned and
heavy-bearded.

**Virtues.** His wife's own words describe his devotion, said when Umm
Salamah and the other wives of the Prophet remarked on her poor state: "أما
ليله فقائم، وأما نهاره فصائم" (`157-p14`), up at night and fasting by day.

**Two brothers, now cited relations.** The entry names Qudamah and Abdullah,
"بنو مظعون", alongside him at their lodging after the hijra to Medina
(`158-p6`), backing a `BROTHER` edge to each: `qudamah-ibn-mazun` and
`abdullah-ibn-mazun-al-jumahi`, both already seeded as his brothers by name
alone.

**A competing death year.** This entry's own closing line puts his death in
Sha'ban, year 3 AH: "ومات: في شعبان، سنة ثلاث" (`159-p1`). The
`death-of-uthman-ibn-mazun` event already holds year 2 AH, established in
`prophet-muhammad-sira` from al-Dhahabi's sira narrative, which places the
death "بعد بدر بيسير" under a heading dated "سنة اثنتين من الهجرة". Badr fell
in year 2, so the sira's own dating and this entry's "سنة ثلاث" disagree
within the same book. Neither passage names a source for its year. The
sira's placement, shortly after a battle it has just narrated and under its
own year heading, is the more exact of the two, so the event field keeps
year 2 and this entry's year 3 is recorded as a `DISPUTED` claim rather than
overwriting it.

## Corroboration against the sira batch

`prophet-muhammad-sira` already cites this same book, volume 1 page 363, for
his death near Badr, his rank among the early converts ("أسلم بعد ثلاثة عشر
رجلا"), his first hijra to Abyssinia, and his asceticism ("كان صواما قواما
قانتا لله"). This entry repeats the "أسلم بعد ثلاثة عشر رجلا" line almost
word for word at `155-p1`, tracing it to Abu Umar al-Namari rather than the
sira's own unnamed telling, so it is one report cited twice rather than
independent corroboration; no new claim is added for it.

His hijra comes up again at `158-p6` and `158-p7`, naming his lodging with
Abdullah ibn Salamah al-Ajlani and noting that "آل مظعون ممن أوعب في الخروج
إلى الهجرة، وغلقت بيوتهم بمكة". Al-Dhahabi does not say here whether this is
the migration to Abyssinia or to Medina, and the surrounding household and
lodging details fit Medina, so this stays out of the
`first-hijra-to-abyssinia` event rather than being read into it.

## What the model has no shape for yet

**Being the first Muhajir buried at al-Baqi** is this entry's most repeated
claim, reported through three separate chains (`154-p2`, `154-p3` through
`154-p6`, `155-p3`). The catalog has no field for a place of burial distinct
from a place of death, so this stays in the source text.

**The Prophet's grief at his death and funeral**, his reproach of women's
wailing, and Umar's account of losing confidence after Uthman ibn Maz'un
died unmartyred (`155-p6` through `156-p9`, `160-p1` through `160-p8`), are
narration about the event rather than a value any field records.

**His asceticism in detail**, including his wish to be celibate and the
Prophet's refusal of it (`154-p9`, `157-p2` through `157-p11`), his declining
Umm al-Ala's testimony that he had earned paradise outright (`159-p7`
through `160-p1`), and his abstaining from wine before its prohibition
(`155-p4` through `155-p8`), stay in the source text: the model's `virtues`
field already holds one citation and is not a list.

## Leaving the seed

`prisma/personSeedData3.ts` still carries `uthman-ibn-mazun` with only a name
and the `companion` title. This batch does not retire that entry: the new
`data/catalog/people/uthman-ibn-mazun.ts` carries `companion` forward on its
legacy marker, since this entry never states his companionship in those
words, matching the pattern already used for Abu Salamah and Musab ibn
Umayr.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
