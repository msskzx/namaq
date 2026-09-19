# Batch: the Prophet ﷺ, lineage, birth, and names

This batch preserves the first three sections of al-Dhahabi's sira and supports
the canonical records selected from them. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/prophet-muhammad/](accounts/prophet-muhammad/)

## Source account, and why it is a slice

The sira in *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, is not an entry. It is thirteen chapters running from printed page 29 to page
1154, about 988 pages, where the longest companion entry so far was 33. It
cannot be one batch.

This batch takes the first three sections of chapter one, printed pages 29 to
41: ذكر نسب سيد البشر, مولده المبارك, and أسماء النبي وكنيته. They are the
sections that speak to his profile rather than to the events around him, and
they end cleanly: the سطيح chapter opens at the top of page 42, so neither end
needed slicing.

The sira section is unvowelled where the companion entries are vowelled, so the
excerpts here carry no vowels. That is the edition, not an extraction fault.

**Claim keys are namespaced by what they assert** (`prophet/lineage`,
`prophet/names`) because later sira batches will speak about the same subject,
and `catalog:validate` gathers claim keys into one flat set across all batches
with no collision check.

## What these pages support

Thirteen claims and twenty-three citations.

**His lineage to عدنان**, which al-Dhahabi gives as agreed, unpacking the names
behind the bynames: عبد المطلب is Shaybah, هاشم is Amr, عبد مناف is al-Mughirah,
قصي is Zayd (`29-p7`). What lies beyond Adnan he does not settle, and this batch
does not either: the pages carry four counts of the fathers to Ismail, Urwah's
refusal to guess, Ibn Sa'd's الإمساك عما وراء عدنان, and the Prophet's own
كذب النسابون (`29-p8` to `31-p2`). The model holds one full name, so the value
stops where the agreement does.

**His kunya**, أبو القاسم, which al-Dhahabi calls mutawatir (`40-p7`), with the
prohibition on combining his name and kunya behind it (`40-p8`).

**Ten of his twelve titles.** The names hadith gives محمد، أحمد، الماحي،
الحاشر، العاقب، الخاتم and, in the longer wording, المقفى، نبي الرحمة، نبي
التوبة، نبي الملحمة (`38-p2`, `38-p4`, `38-p5` to `39-p1`). الأمين is what
Quraysh called him before prophethood (`40-p2`), and الصادق المصدوق is Ibn
Mas'ud's (`39-p11`). المصطفى rests on the اصطفاء hadith Muslim reports
(`32-p5`), and نبي and رسول on the descriptions al-Dhahabi lists from the
Qur'an (`39-p9`).

**Two Qur'an links.** al-Anbiya 107 is quoted straight after the رحمة مهداة
hadith (`39-p4`), and al-Ma'arij 13 is read of him, his فصيلة being بنو عبد
المطلب (`32-p4`).

**His father**, from the naming line. `SON` to عبد الله بن عبد المطلب.

## His birth, and the day that is disputed

The year is not disputed: عام الفيل, which Ibn Abbas gives with a sound isnad
(`33-p2`), Qays ibn Makhramah confirms as his own birth year (`33-p3`), and
Khalifah ibn Khayyat calls المجمع عليه (`35-p1`). al-Dhahabi rejects the
alternatives outright, calling Ibn Shihab's seventy-years reading a وهم
(`34-p3`) and the fifteen-years-before report a lie against Ibn Abbas
(`34-p6`).

The day is disputed and the model can hold it, so both readings are authored.
Monday is agreed, from the Prophet's own answer about fasting it: ذاك يوم ولدت
فيه وفيه أوحي إليّ (`35-p3`). The date splits: the twelfth of Rabi al-Awwal
(`35-p2`, and Abu Ma'shar at `36-p3`) against the tenth, which Abu Ja'far gives
and al-Dimyati calls الصحيح (`36-p2`, `36-p4`), with Ramadan as a third
reading. The event description takes the twelfth; the tenth and Ramadan are one
`DISPUTED` claim.

**No year is written to the model.** عام الفيل is neither hijri nor Gregorian,
and converting it would be this batch's arithmetic rather than the book's
statement. The seeded event keeps the year it already has.

## Why nothing here carries the legacy marker

He is still declared in `prisma/personSeedData.ts`, which makes the catalog
additive for him: `catalog:project` connects what this module declares and
leaves every other seeded value alone. So his appearance, his other five Qur'an
links, the two titles these pages do not reach (الشفيع and سيد ولد آدم) and all
his relations beyond his father stay the seed's, with no marker needed, because
the seed is still their author. Removing his seed entry is what would hand this
module authority over him, and that waits until the sira has been read.

## What the model has no shape for yet

**His mother.** آمنة بنت وهب بن عبد مناف بن زهرة is named at `32-p6`, and
al-Dhahabi notes she is nearer to Kilab than her husband by one man. She has no
subject in the app, so there is nothing to link to.

**His circumcision and naming**, which Ibn Abbas puts on the seventh day at his
grandfather's hands, with the feast at which he named him Muhammad (`36-p7`).
That is an event with no subject yet, and a later batch may want one.

**His مبعث.** These pages date it twice, على رأس أربعين سنة من الفيل (`33-p4`,
`34-p3`). The chapter that narrates it opens at page 233, outside this batch, so
no event is authored from a date alone.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch carries
no approval.
