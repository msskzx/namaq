# Batch: Al-Hakam ibn Abi al-As, Siyar entry 14

This batch records al-Dhahabi's dedicated entry for الحكم بن أبي العاص and follows the [data pipeline](../../../../docs/data-pipelines.md) and [extraction checklist](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/al-hakam-ibn-abi-al-as/](accounts/al-hakam-ibn-abi-al-as/)

## Scope

Companion, in scope. Al-Dhahabi calls him one of the converts at the Conquest of Mecca and says he had "the slightest share of companionship." That explicit, qualified attribution is enough to retain the existing Companion title. His son Marwan is not part of this batch.

## Source account

Entry 14 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume 5 in Namaq's source numbering (the work's second biographical volume), edited by Mamun al-Sagharji under Shuayb al-Arnaut. The entry begins at `107-p12` on Shamela page 2087, after Abu Sufyan's entry; the store page holds the whole printed page, Abu Sufyan's tail first and then this entry's head. It continues through all eleven paragraphs of printed page 108 and ends at `108-p11`. Entry 15 begins on printed page 109.

## Claims and legacy values

The entry supports his shorter nasab, father relation, kunya, Companion title, and death in 31 AH. The catalog's longer full name remains `legacy-unreviewed` because this entry stops at Umayya and does not state the carried chain through Abd Shams or the Qurashi nisba. The father relation and Companion title are promoted from legacy evidence; the kunya and death year are new cited fields. Sex remains `legacy-unreviewed` because the entry does not state it directly.

The account states no appearance, virtues, wife, or sibling. These four items are marked `notInSource`. Its reports about exile, censure, and his children do not support a current modeled virtue or a named relationship, so the source text preserves them without duplicating them as claims.

## Review

Every claim is `NOT_REVIEWED`. The batch carries an approval block recorded
2026-09-30, which the file changes above have since invalidated: merging
Abu Sufyan's tail into printed page 107 moved this entry's `5/107` anchors
from p1/p3/p4 to p12/p14/p15, so the approval no longer covers the files on
disk and the batch needs approving again before it can be imported.
