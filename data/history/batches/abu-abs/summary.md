# Batch: Abu Abs, Siyar entry 21

This batch gives أبو عبس بن جبر his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-abs/](accounts/abu-abs/)

## Source account

Entry 21 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on the
page shared with Mistah ibn Uthathah's closing entry, page 188 (Shamela
1614), right after entry 20 ends at `188-p6`. Its own bibliography footnote
("(*)") lands on that same page and is trimmed to start from it, the same
split the Mistah batch used. The entry continues onto page 189 (Shamela
1615) and closes there at `189-p7`, right before entry 22 (Ibn al-Tayyihan)
opens at `189-p8`; entry 22's own bibliography footnote lands on page 189
too but belongs to it, not this account, so it is trimmed off the end.

## What this entry supports

Six claims, across the two pages.

His ancestry and given name, from the heading and the two lines that
continue it: "بنُ جَبْرِ بنِ عَمْرٍو الأَوْسِيُّ" (`188-p7`), continuing
"ابْنِ زَيْدِ بنِ جُشَمَ بنِ حَارِثَةَ بنِ الحَارِثِ الأَوْسِيُّ" (`188-p8`,
introduced by "وَاسْمُهُ": and his name is), then "عَبْدُ الرَّحْمَنِ"
(`189-p1`). Together they give `fullName: 'عبد الرحمن بن جبر بن عمرو بن
زيد بن جشم بن حارثة بن الحارث الأوسي.'` The seed's fullName carried the
same chain plus "الأنصاري", a word the entry never uses (only "الأوسي"
twice), so this batch's citation drops it rather than carrying an uncited
word forward. The ancestry also backs a `SON` relation to
`jabr-ibn-amr`, the existing graph-only node for his father.

His kunya, the heading's own opening word: "أَبُو عَبْسٍ" (`188-p7`).

His death: "مَاتَ بِالمَدِيْنَةِ سَنَةَ أَرْبَعٍ وَثَلاَثِيْنَ" (`189-p7`),
giving `deathYearHijri: '34'` and `placeOfDeathArabic: 'المدينة'`, the same
death year as Mistah ibn Uthathah, his neighbor in the book's ordering.

His presence at Badr, twice: "بَدْرِيٌّ كَبِيْرٌ" (`189-p2`) and "شَهِدَ
بَدْراً" (`189-p5`); the `PARTICIPATED_IN` claim cites the latter, the
plainer statement of attendance. البدري is modeled as this relation rather
than a title, the same treatment the al-Bukayr brothers and Mistah got.

His part in killing Kaab ibn al-Ashraf: "كَانَ فِيْمَنْ قَتَلَ كَعْبَ بنَ
الأَشْرَفِ" (`189-p5`). The `prophet-muhammad-sira` batch already carries
this event (`data/catalog/events/killing-of-kaab-ibn-al-ashraf.ts`) with
Muhammad ibn Maslamah as its one named participant, from `sira/kaab-ibn-
al-ashraf`'s account of who volunteered and struck the fatal blow. Abu
Abs's entry does not compete with that account; it names an additional
member of the party the sira's own wording already implies ("فَأَتَاهُ
لَيْلاً فِي نَفَرٍ فَقَتَلُوْهُ", he came to him by night with a group and
they killed him), so this batch adds him to the event's `people` list
rather than disputing anything.

## What the model has no shape for yet

The paired-brotherhood line, "آخَى رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ
وَسَلَّمَ- بَيْنَهُ وَبَيْنَ خُنَيْسِ بنِ حُذَافَةَ السَّهْمِيِّ" (`189-p4`),
fits the `PACT_BROTHER` relation type that Amir ibn al-Bukayr's entry
already uses for the same kind of pairing. Khunays ibn Hudhafah al-Sahmi
has no Person node in the graph yet, and creating one is outside this
subject's own batch, so the pairing stays unclaimed rather than pointing a
relation at a slug nothing backs.

The tax-collector line, "وَكَانَ عُمَرُ وَعُثْمَانُ يَبْعَثَانِهِ
مُصَدِّقاً" (Umar and Uthman used to send him to collect zakat, `189-p5`),
names no field or relationship type this model holds.

The narrator list, "حَدَّثَ عَنْهُ: ابْنُهُ زَيْدٌ، وَحَفِيْدُهُ؛ أَبُو
عَبْسٍ بنُ مُحَمَّدِ بنِ أَبِي عَبْسٍ، وَعَبَايَةُ بنُ رِفَاعَةَ" (`189-p6`),
stays in the source text per the standing rule that a person named only as
a narrator does not become a graph node or an edge, even where the same
clause calls one of them his son.

## Kunya and titles

The heading gives his kunya outright, "أَبُو عَبْسٍ", carried as the
`kunya` field. No title beyond the seed's carried "companion" is supported
here: البدري is modeled as the Badr `PARTICIPATED_IN` relation rather than
a title, per the standing rule against duplicating a relation as a title.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `abu-abs` as an active entry.
`data/catalog/people/abu-abs.ts` is now his sole author, per the standing
rule that a subject's catalog file retires its seed row in the same
commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
