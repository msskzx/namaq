# Batch: Talhah ibn Ubaydullah, Siyar entry 2

This batch preserves al-Dhahabi's complete entry on Talhah ibn Ubaydullah and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md)
and the [Abu Ubaydah pilot](../abu-ubaydah-pilot/summary.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/talhah-ibn-ubaydullah/](accounts/talhah-ibn-ubaydullah/)

## Source account

Entry 2 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account spans printed
pages 23-40. It opens partway down page 23, where Abu Ubaydah's entry ends, so
that page carries both entries: its text starts at the entry heading and its
notes at the `(*)` bibliography, leaving the four notes above with entry 1.

## What the entry supports

Ten claims and sixteen citations, covering his full name, appearance, virtues,
year of death, his three title assignments, his father, his companionship of
the Prophet, and three battles.

## What the entry contradicts

**The old seed has him present at Badr.** The entry says the opposite, in
al-Dhahabi's own voice: he was away on a trading journey in Syria, grieved at
missing it, and the Prophet assigned him its share and its reward (`25-p3`).
The participation is kept, because a share was assigned, and it now carries the
status `ABSENT_EXCUSED` and the passage that says so. Nothing was overwritten
silently.

**Two accounts of his complexion.** Ibn Mandah describes him as آدم, dark; his
son Musa describes him as أبيض يضرب إلى الحمرة, fair with a reddish cast. The
author prefers neither, so the profile follows source order and takes Ibn
Mandah's, and the claim is marked disputed and carries both.

The seed's own wording, كان أشعر، حسن الوجه، كريم اليد, is a loose paraphrase
of Ibn Mandah plus his generosity rather than a third account. It is replaced
by the cited text.

## What the entry is silent about

- **The six of the Shura**: the entry never seats him among them, though the
  next entry says it of al-Zubayr. The title keeps its `legacy-unreviewed`
  marker.
- **Khandaq**: the seed's participation stands uncited, in a new module that
  exists to carry it rather than leave it unrecorded.
- **The years of Badr, Uhud and Jamal**: the entry dates his death to 36 AH but
  never dates a battle. Those three years stay owed.

## What the model has no shape for yet

The entry names three titles the Prophet gave him, طلحة الفياض, طلحة الخير and
طلحة الجود, and the last two rest on an isnad al-Dhahabi himself calls weak
(`30-p5`). The catalog has no module kind for titles, so none of the three is
recorded; the passages keep them. His wife Umm Kulthum bint Abi Bakr and his
children are named in the entry and are not in the graph; adding them is a
later batch's work, not this one's.

## Review

Nothing is reviewed. The ten claims are extracted and authored but no one has
compared them against the stored pages, so every claim is Not reviewed and the
batch carries no approval. `npm run catalog:validate` therefore reports each
cited value as unusable until the batch is approved, which is the gate working
rather than a defect.
