# Batch: Abu Dujanah al-Ansari, Siyar entry 39

This batch gives أبو دجانة الأنصاري سماك بن خرشة his first sourced claims, from al-Dhahabi's dedicated Siyar entry on him. It follows the [data quality and references workflow](../../../../docs/data-pipelines.md) and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-dujanah-al-ansari/](accounts/abu-dujanah-al-ansari/)

## Index position

The islamweb companion index runs كلثوم بن الهدم (entry 38), then أبو دجانة الأنصاري (entry 39), then خبيب بن عدي (entry 40). The Shamela text confirms the order: entry 38 closes at printed 243, heading ٣٩ opens at printed 244, and heading ٤٠ opens at printed 246.

## Scope

Companion, in scope. The entry sits at number 39 in the Siyar's first Sahaba run: an Ansari of Aws who fought at Uhud and was martyred at Yamamah. No work contests his صحبة, so there is nothing to record beyond the call itself.

## Source account

Entry 39 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb al-Arnaut. It opens at `244-p1` (Shamela 1670), mid-page: the Biʾr Maʿuna section occupies the top of page 244, so the first page was cut with `--notes-start-marker أبو دجانة` to drop entry 38's notes. The entry runs thirteen paragraphs to the end of page 244 and four paragraphs into page 245 (Shamela 1671), closing at `244-p4`, "وحرز أبي دجانة شيء لم يصح". Entry 40 (Khubayb ibn Adi) opens right after, so the last page was cut with `--notes-end-marker خبيب بن عدي` to drop entry 40's notes.

## What this entry supports

Nine claims, across the two pages.

His name, from `244-p3`: "وَقِيْلَ: هُوَ سِمَاكُ بنُ أَوْسِ بنِ خَرَشَةَ." The source gives "سماك بن خرشة" (or with the variant "سماك بن أوس بن خرشة"). The existing `fullName` carries the full chain "سماك بن خرشة بن لوذان بن عبد ود بن زيد الأنصاري الساعدي" from the retired graph seeds. The source here only supports "سماك بن خرشة" — the full chain is not stated. The fullName stays legacy. The variant "سماك بن أوس بن خرشة" is a competing account about the nasab; since the model holds the fullName, this is recorded as a DISPUTED claim.

His father, from `244-p3`: "سماك بن خرشة" — the father is Khirashah. The existing catalog has `SON` to `khirashah-ibn-lawdhan`. The source supports this, so the father relation is promoted to a cited claim.

His kunya, from `244-p1`: "رَمَى أَبُو دُجَانَةَ" — the entry is titled "أبو دجانة الأنصاري". The kunya is "أبو دجانة". This is a new field.

His companion title: an Ansari who fought at Uhud and was martyred at Yamamah — the entry's own placement among the Sahaba with no contest recorded.

His virtues, from multiple passages:
- His sword was not blameworthy; the Prophet offered it and Abu Dujanah took it by its right (`244-p7`–`244-p12`).
- He fought at Uhud with the sword, strutting and reciting poetry (`244-p13`–`245-p3`).
- The Prophet said about his gait: "It is a gait that Allah and His Messenger hate except in a place like this" (`245-p3`).
- He was silent when the companions boasted about their battles (`244-p5`).
- The Prophet said he saw him at Uhud with Gabriel (`244-p6`).
- He threw himself into the garden at Yamamah, broke his leg, and fought until killed (`244-p1`).

## What the entry does not state

Appearance, wives, and siblings: trigger-word grep (appearance phrases, تزوج/امرأة/زوج, أخو/أخت/شقيق) across both pages and both note files returns nothing, and the full seventeen-paragraph read confirms it. All three are marked `notInSource`.

No battle participation is authored: the entry mentions Uhud and Yamamah, but the model holds no battle file for Yamamah, and the Uhud battle file already has Abu Dujanah as a participant with a cited claim (`abu-dujanah/uhud`). The new evidence about his sword and poetry at Uhud is recorded as virtues, not as a new participation.

## Legacy values

The stub held four legacy values; all are visited here. The father edge is promoted to a cited claim. The companion title is promoted to a cited claim. The kunya is new. The virtues field is new. The fullName stays legacy because the source only gives "سماك بن خرشة" and not the full chain. The sex stays legacy because the entry does not explicitly state "رجل" — it is implied by the context but not stated.

## Review

Nothing is reviewed and nothing is approved. Every claim is NOT_REVIEWED, and the batch carries no approval block.
