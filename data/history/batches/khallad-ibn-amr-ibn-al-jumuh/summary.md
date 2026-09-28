# Batch: Khallad ibn Amr ibn al-Jumuh, Siyar entry 43

This batch preserves al-Dhahabi's complete entry on Khallad ibn Amr ibn
al-Jumuh and supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/khallad-ibn-amr-ibn-al-jumuh/](accounts/khallad-ibn-amr-ibn-al-jumuh/)

## Source account

Entry 43 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The account runs
entirely on printed page 252, in the شهداء بئر معونة section.

Page 252 is shared with entries 42 and 44. Entry 42 (Mu'awwidh ibn Amr ibn
al-Jumuh) opens higher on the same page; its heading is marked "*" and its
source list "(*)" in the page's notes. Entry 44 (Amr ibn al-Jumuh, their
father) begins immediately below this entry; its heading is marked "***" and
its source list "(* * *)" in the same notes block. The extraction keeps only
the three body paragraphs of entry 43 (anchors `252-p6` through `252-p8`) and
trims the notes at the "(* *)" and "(* * *)" markers, so nothing here belongs
to entry 42 or entry 44.

`khallad-ibn-amr-ibn-al-jumuh` had a catalog file before this batch, carried
from the retired `neo4j/graphSeedData*.ts`. Every value was on the legacy
marker.

## What the entry supports

Four claims and four citations.

**Full name.** The heading gives it directly: "خَلاَّدُ بنُ عَمْرِو بنِ
الجَمُوْحِ الأَنْصَارِيُّ" (`252-p6`). `fullName` holds "خلاد بن عمرو بن
الجموح الأنصاري".

**Father.** The same heading names his father: "خلاد بن عمرو بن الجموح"
(`252-p6`). This confirms the `SON`/`FATHER` edge to `amr-ibn-al-jumuh`,
already carried on the legacy marker.

**Badr.** The entry's second line: "شَهِدَ بَدْراً" (`252-p7`). This adds him
as a plain participant to the Battle of Badr.

**Uhud.** The same line closes: "وَاسْتُشْهِدَ يَوْمَ أُحُدٍ" (`252-p7`). This
adds him as a martyred participant to the Battle of Uhud.

## Legacy values visited

The catalog file carried four legacy values. This batch visits each:

- **`fullName`.** Promoted to a cited claim. The source states "خلاد بن عمرو بن
  الجموح الأنصاري"; the legacy value carried a longer chain ("خلاد بن عمرو بن
  الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي
  السلمي") that this entry does not restate. The shorter form is what the
  source supports; the longer chain is not contradicted by this entry but is
  not attested here either. The discrepancy is flagged for a future batch that
  reads entry 44 (their father's entry), which does carry the full chain.

- **`sex: MALE`.** Left on the legacy marker. The entry uses masculine verb
  forms (شهد، استشهد) but never states his sex explicitly.

- **`titles: [companion]`.** Left on the legacy marker. The entry sits in the
  الطبقة الأولى - الصحابة section and witnessed Badr, but the entry itself
  never states the word صحابي.

- **`relations: [SON/FATHER to amr-ibn-al-jumuh]`.** Promoted to a cited
  claim. The heading "خلاد بن عمرو بن الجموح" (`252-p6`) directly states the
  patronymic.

## Absent from the source

The entry is terse — three paragraphs, two of them a single line each. The
following are genuinely absent and marked `notInSource` on the account:

- **Kunya** — no أبو or أم is given.
- **Appearance** — no physical description.
- **Manaqeb** — no virtues or notable deeds beyond the battles.
- **Wives** — no marriage is mentioned.
- **Siblings** — the entry does not name any sibling. (Entry 42 mentions
  "معاذ وخلاد" as brothers of معوذ, but that is entry 42's text, not this
  entry's.)

## Corroboration and disputes

No other batch cites Khallad ibn Amr ibn al-Jumuh, so there is nothing here
to corroborate or dispute against. The Badr and Uhud participations are new
to the catalog.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
