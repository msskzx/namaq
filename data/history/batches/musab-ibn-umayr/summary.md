# Batch: Musab ibn Umayr, Siyar entry 7

This batch preserves al-Dhahabi's complete entry on Musab ibn Umayr and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/musab-ibn-umayr/](accounts/musab-ibn-umayr/)

## Source account

Entry 7 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs from
printed page 145 to page 150.

Page 145 opens with the tail of a roster, "the fifty" early converts, that
belongs to a different, unnamed section rather than to Musab. His own entry
starts partway down the page at `145-p4`, and the notes are cut before his
`(*)` source list, dropping the two footnotes that belong to the roster
before him. Page 150 closes cleanly: its first paragraph finishes a list of
Uhud's martyrs that Musab's entry opens, and the next paragraph starts a new
heading, entry 8 on Abu Salamah ibn Abd al-Asad, so the account ends at
`150-p1` and carries none of that entry's notes.

Musab already had a catalog entry of his own,
[data/catalog/people/musab-ibn-umayr.ts](../../../catalog/people/musab-ibn-umayr.ts),
authored earlier from `prophet-muhammad-sira`. This batch adds to it rather
than replacing it.

## What the entry supports

Three claims and four citations.

**Full name.** The heading gives مصعب بن عمير بن هاشم بن عبد مناف, and the
line beneath continues the nasab to كلاب and closes with his nisbas, القرشي
and العبدري (`145-p4`, `145-p5`).

**Father, now a cited relation.** The same heading line names his father
plainly, بن هاشم بن عبد مناف, and backs the `SON` edge to Umayr ibn Hashim
that the seed asserted without a citation. Umayr ibn Hashim has no
PostgreSQL profile of his own, only a graph node from `neo4j/graphSeedData3.ts`,
so the relation stays graph-only, the same shape the seed already gave it.

**Two titles.** The same line calls him السيد، الشهيد، السابق، البدري،
القرشي، العبدري (`145-p5`). Of these, `martyr` and `al-sabiqoon` are titles
the catalog's title list already defines; `sayyid` and `badri` are not, so
only the two that match are added. `companion` stays on its legacy marker:
this entry never states his companionship in those words, the way Sa'id's
entry stated شهد المشاهد مع رسول الله for his.

## Corroboration against the sira batch

`prophet-muhammad-sira` already cites Musab three times, for his hijra to
Abyssinia, his mission to Medina, and Badr and Uhud. This entry does not
contradict any of them, and for Uhud it is close to word for word the same
report.

**Uhud.** The sira batch's `musab/uhud` claim reads: وقاتل مصعب بن عمير دون
رسول الله صلى الله عليه وسلم حتى قتل، قتله ابن قميئة الليثي، وهو يظنه رسول
الله صلى الله عليه وسلم. This entry's own account, citing Ibn Ishaq through a
different chain, gives the same sentence almost unchanged: وقاتل مصعب بن
عمير دون رسول الله صلى الله عليه وسلم حتى قتل. قتله ابن قمئة الليثي، وهو
يظنه رسول الله (`148-p5`, `148-p6`). Both editions of the report trace to Ibn
Ishaq, so this is one report cited twice rather than two independent
accounts, and no new claim is added for it.

**Standard-bearer.** After the same paragraph, this entry adds a detail the
sira batch's `musab/badr` claim does not carry for Uhud: once Musab was
killed, the Prophet gave the standard to Ali ibn Abi Talib (`148-p7`). The
catalog has no field for who took up a standard after its bearer fell, and
the claim would name Ali rather than Musab, so it stays in the source text.

## What the model has no shape for yet

**His poverty for the Prophet's sake** runs through three separate reports on
these pages: Khabbab's حديث naming him among those who died without eating
from their reward, Ali's account of him arriving in a patched cloak after
growing up the most pampered youth in Mecca, and Sa'd ibn Malik's account of
his skin peeling like a snake's and his friends carrying him when he could no
longer walk (`146-p3` through `146-p5`, `147-p4`, `148-p1` through `148-p4`).
None of it fits a structured field; `virtues` already holds one sentence from
the sira batch about his mission to Medina, and this batch does not extend
it.

**The Uhud martyrs' roster** that closes the entry (`149-p1` through `150-p1`)
lists dozens of names from the Aws and the Khazraj. None of them is Musab,
and the model has no field for a list a Companion's entry happens to include,
so it stays in the source text rather than becoming claims about people it
does not name as its own subject.

## Leaving the seed

There is no seed to retire: `prisma/personSeedData3.ts` already notes that
Musab is authored from the catalog, not from a seed row. His `sex` and
`virtues` fields and his `companion` title, plus the `MATERNAL_UNCLE`
relation to Shaybah ibn Uthman, stay as the earlier batch and the retired
seed left them. This entry says nothing about his maternal uncle in this
page range, so that relation keeps its legacy marker.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
