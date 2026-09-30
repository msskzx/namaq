# Batch: Hafsa bint Umar, Siyar entry 25

This batch records al-Dhahabi's dedicated entry for حفصة بنت عمر بن الخطاب
العدوية أم المؤمنين. It follows
[docs/data-pipelines.md](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/hafsa-bint-umar/](accounts/hafsa-bint-umar/)
- Catalog entry: `data/catalog/people/hafsa-bint-umar.ts`

## Source account

Entry 25 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 5, edited by Hussein Asad under Shuayb al-Arnaut. It runs across
printed pages 227–231 (Shamela 2207–2211). Page 227 begins with the close of
the preceding entry, so `--start-anchor p5` begins at Hafsa's numbered
heading. Page 231 continues into Safiyya bint Huyayy's entry, so
`--end-anchor p2` stops after Hafsa's final report. The first notes block was
trimmed at Hafsa's `(*) مسند أحمد` bibliography, and the last at Safiyya's
`(*) مسند أحمد: ٦ / ٣٣٦` bibliography.

## Scope call: Companion

Entry 25 is in the الصحابة section and identifies Hafsa as a wife of the
Prophet and أم المؤمنين. She is in Companion scope without a contested-status
qualification.

## What the entry supports

The heading supplies the cited form "حفصة بنت عمر بن الخطاب العدوية أم
المؤمنين", the Mother-of-the-Believers title, and the daughter relation to
Umar ibn al-Khattab. The next paragraph states that the Prophet married her
after her waiting period following Khunays ibn Hudhafah, supporting her wife
relation to the Prophet. Khunays has no catalog subject, so the earlier
marriage stays in the source account rather than creating an unresolved edge.

The final page preserves Gabriel's words that she was صوامة قوامة and the
Prophet's wife in Paradise; this replaces the broader uncited legacy virtue
text. The entry gives 41 AH as its direct death-year statement and reports 45
AH as an alternative, so the catalog takes 41 while the 45 report remains a
separate disputed claim. It also connects Hafsa and Aisha to Qur'an 66:4,
which is added beside the legacy-unreviewed 66:5 link rather than silently
removing that older value.

## What the entry does not establish

No kunya or physical description appears. The account calls Ibn Umar her
brother but does not state their mother or otherwise distinguish a full from a
half sibling, so the batch does not invent either relation type; `siblings` is
recorded as lacking modelable detail. It also names her two maternal uncles,
Qudamah and Uthman ibn Maz'un, but the catalog has no uncle relation type.

The birth report places her birth five years before the prophetic mission,
not in a Hijri or Gregorian year the current fields can represent directly.
The reports about her marriage negotiations, divorce and restoration, hadith
transmission, funeral, and burial remain in the preserved account because
they do not support another current profile field or relation.

## Legacy values visited

The catalog entry carried legacy-unreviewed sex, full name, appearance,
virtues, Companion and Mother-of-the-Believers titles, and Qur'an 66:5. This
batch promotes the name, virtues, and Mother-of-the-Believers title. Sex and
the Companion title remain legacy-unreviewed because the entry does not state
either as a standalone modeled value. Appearance is explicitly absent. Qur'an
66:5 remains legacy-unreviewed because this entry names verse 4 instead.

## Review

Nothing is marked reviewed. Every claim remains Not reviewed, and the batch
has no publication approval.
