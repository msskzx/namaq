# Batch: Umm Ayman, Siyar entry 24

This batch gives أم أيمن بركة her first dedicated source account and sourced catalog values from al-Dhahabi's entry. It follows the [data pipelines](../../../../docs/data-pipelines.md) and [extraction checklist](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/umm-ayman/](accounts/umm-ayman/)

## Index position

The companion index places أم أيمن after أم حبيبة أم المؤمنين and before حفصة بنت عمر. The Risalah edition labels her entry 24.

## Scope

Companion, in scope. The entry is in the Siyar's Companion section and calls her one of the first women emigrants. No source in this batch contests her companionship.

## Source account

Entry 24 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume 5 (سير أعلام النبلاء ج٢), edited by Hussein Asad under Shuayb al-Arnaut. The entry starts at `223-p13` (Shamela 2203), after Umm Habiba's closing report, and runs through `227-p4` (Shamela 2207). The extractor cut the first page at `p13` and its notes at Umm Ayman's bibliography. It cut the last page at `p4` and its notes before Hafsa's bibliography.

## What this entry supports

Four claims are projected into the catalog:

- Her given name is بركة (`224-p3`).
- Her standing is carried as `virtues`: she was among the first women emigrants and the Prophet's nurse; he called her the remainder of his household, described her as a woman of Paradise, and treated her with affection. The entry also reports the water lowered to her during her migration and her grief when revelation ceased (`223-p13`, `224-p2`, `224-p5`, `224-p7`, `224-p12`, `226-p10`).
- She married Zaid ibn Harithah (`224-p4`).
- She was the mother of Usamah ibn Zaid (`224-p4`).

The entry also names her earlier husband, عبيد بن الحارث الخزرجي, and their son Ayman. Neither is a catalog subject, so the complete text remains in the source account without creating unsupported graph-only people in this batch.

## What the entry does not state

The entry gives no kunya separate from “Umm Ayman,” no physical description, no father or nasab, and no siblings. Trigger-word checks and the full read confirm those absences, recorded in `notInSource`.

## Legacy values

The existing catalog held four legacy values. The source promotes her given name, Companion title, and marriage to Zaid. Her sex stays `legacy-unreviewed`: feminine grammar and marriage context imply it, but the entry does not state a standalone sex value. The new virtues field and mother relation to Usamah are cited from this batch.

## Review

Nothing is reviewed and nothing is approved. Every claim is `NOT_REVIEWED`, and the batch has no approval block.
