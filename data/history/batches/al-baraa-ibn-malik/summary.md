# Batch: Al-Baraa ibn Malik, Siyar entry 26

This batch gives البراء بن مالك بن النضر his own catalog file, cited from
al-Dhahabi's Siyar entry on him, the tenth and last of this ten-chapter run
(entries 17-26), immediately after his neighbour سهيل بن عمرو (entry 25). It
follows [docs/data-quality-references.md](../../../../docs/data-quality-references.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/al-baraa-ibn-malik/](accounts/al-baraa-ibn-malik/)

## Source account

Entry 26 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. It opens on page
195 (Shamela 1621), right after entry 25 (Suhail ibn Amr) closes at `195-p6`.
The suhail-ibn-amr batch already trimmed that page's shared footnote block
down to entry 25's own two content notes; this account picks up from the
`(*)` marker that starts entry 26's own bibliography, dropping entry 25's
notes the same way that batch dropped entry 24's.

The entry runs four printed pages, through `198-p10`: "اسْتُشْهِدَ يَوْمَ
فَتْحِ تُسْتَرَ، سَنَةَ عِشْرِيْنَ" ("he was martyred on the day Tustar
fell, in the year twenty"), the last line on page 198 (Shamela 1624). Entry
27 (Nawfal ibn al-Harith) opens cleanly at the top of the next page, so no
notes trimming was needed at that end: page 198's footnote block belongs to
entry 26 alone.

Shamela's book pages for ids 1624 and 1625 returned HTTP 200 with an empty
body from three independent fetch paths (curl through the session proxy,
Python's urllib, and the WebFetch tool), while the surrounding pages (1621-
1623, 1626, 1627) fetched normally. Appending a trailing slash to the URL
(`/book/10906/1624/`) worked where the bare path did not; both pages were
then read in full. `scripts/history/extractShamelaEntry.ts` fetches the bare
path, so a temporary copy reading from the pages cached during this
diagnosis was used to run the real extraction and write `batch.json`; the
temporary copy and the cached HTML were deleted once the pages were written.

## What this entry supports

Eight claims, across the four pages.

His name, from the heading: "البَرَاءُ بنُ مَالِكِ بنِ النَّضْرِ بنِ
ضَمْضَمٍ الأَنْصَارِيُّ" (`195-p7`), continued on the next paragraph with
"ابْنِ زَيْدِ بنِ حَرَامِ بنِ جُنْدَبِ بنِ عَامِرِ بنِ غَنْمِ بنِ عَدِيِّ
بنِ النَّجَّارِ الأَنْصَارِيُّ، النَّجَّارِيُّ، المَدَنِيُّ" (`195-p8`), a
Dhahabi heading pattern: the printed title gives the short name and nisba,
then the next line resumes the same chain. `fullName` joins both paragraphs
as the source states them, which is why "الأنصاري" appears twice, once
mid-chain and once at the close. The same first paragraph names his father
"مالك", backing a `SON` relation to the existing graph-only node
`malik-ibn-an-nadr-al-najjari` (`neo4j/graphSeedData4.ts`), already
prepared for this entry: that node's own comment reads "father of al-Baraa
ibn Malik and Anas ibn Malik".

His standing, carried as `virtues`: the champion who charges repeatedly,
companion of the Prophet and brother of Anas ibn Malik, the Prophet's
servant (`195-p9`); Umar ibn al-Khattab's written order to his army
commanders not to put al-Baraa in charge of a force, because "he is one of
the destructions, he leads men into it" (`196-p2`); a reputation for killing
a hundred brave men in single combat over his campaigns (`196-p6`); a hadith
in which the Prophet names him among the weak, ragged men whose oath God
would honour (`197-p5`); and, near his death, his own answer when asked why
he sang, that he did not expect to die in his bed, having killed ninety-nine
men in single combat besides what he shared with the Muslims generally
(`198-p3`).

Two battle placements, each a `PARTICIPATED_IN` claim against an existing
battle, both from the single line "شَهِدَ أُحُداً، وَبَايَعَ تَحْتَ
الشَّجَرَةِ" (`195-p10`): Uhud, and the pledge under the tree at
Hudaybiyyah (Bay'at al-Ridwan).

His death: "اسْتُشْهِدَ يَوْمَ فَتْحِ تُسْتَرَ، سَنَةَ عِشْرِيْنَ" (`198-
p10`) gives both `deathYearHijri` (20) and `placeOfDeathArabic` (تستر), with
no competing report to weigh against it.

## What the entry does not carry into the model

Most of this entry's most vivid material sits inside two episodes the
catalog has no battle for: his conduct at the Battle of Yamamah against
Musaylimah (`196-p3` through `196-p6`, the shield thrown into the walled
garden, the wounds, Khalid ibn al-Walid tending him for a month) and the
siege of Tustar where he died (`196-p7` through `198-p9`, the underground
passage, his duel with the marzban of Zarah). Neither Yamamah nor Tustar has
a `data/catalog/battles/` entry, and authoring one is its own undertaking,
not something this single-subject batch is scoped to add. The `virtues`
field draws two lines from this material (the duel-kill reputation, his own
words before dying) as character description rather than as claims tied to
a battle; the rest stays in the source pages, unclaimed.

## The Anas ibn Malik sibling question

The task asked whether أنس بن مالك already exists as a catalog or graph
subject, and whether this entry states the sibling tie itself rather than
assuming it from outside knowledge. Both questions resolve from the text.

Anas ibn Malik has no catalog file and, before this batch, no graph node at
all: `prisma/personSeedData10.ts` and `neo4j/graphSeedData4.ts` and
`graphSeedData9.ts` each carry a comment noting him as "not yet in this
pipeline". This entry's own line, `195-p9`, states the tie directly: "وَأَخُوْ
خَادِمِ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَنَسِ بنِ مَالِكٍ"
("and brother of the Prophet's servant, Anas ibn Malik"). It names no
mother for either of them, so the tie is `HALF_BROTHER`, not `BROTHER`, per
the checklist's rule that a full sibling needs the mother stated
explicitly, not just a shared father. That shared father is itself read
from the entry, not assumed: "أنس بن مالك" carries the same father's name
as our subject's own opening nasab.

Since `catalog:project-graph` links a catalog relation to an existing graph
node by `MATCH`, never `MERGE` (`scripts/data/projectCatalogGraph.ts`:
"a relation whose end is missing stays reported rather than inventing a
node with nothing but a slug"), declaring the `HALF_BROTHER` relation on
al-Baraa's catalog file needed Anas to exist as a node first. This batch
adds him to `neo4j/graphSeedData4.ts` as a bare stub, name and slug only, no
profile, no full name, the same shape as `malik-ibn-an-nadr-al-najjari` and
the other family nodes already in that file. He gets no catalog entry and
no profile page; the stub exists only so the relation this entry states can
be modelled instead of dropped. A future batch on Anas ibn Malik himself
would replace this stub with a real profile.

## Kunya, appearance, and wives

None of the three appear anywhere in the four pages read, so all three are
marked `notInSource` on the account.

## Corroboration with the sira batch

`data/history/batches/prophet-muhammad-sira` does not mention al-Baraa ibn
Malik by name in the pages already in scope; his best-known role, at
Yamamah against Musaylimah, falls after the Prophet's death, outside the
sira's own coverage. Nothing there corroborates or contradicts this entry,
so no claim draws from it, and the two known-open sira-pass items are left
as they were.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `al-baraa-ibn-malik` as an
active entry. `data/catalog/people/al-baraa-ibn-malik.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its
seed row in the same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
