# Batch: Qudamah ibn Maz'un, Siyar entry 10

This batch preserves al-Dhahabi's complete entry on Qudamah ibn Maz'un and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/qudamah-ibn-mazun/](accounts/qudamah-ibn-mazun/)

## Source account

Entry 10 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs
from printed page 161 to page 162, Uthman ibn Maz'un's brother and the entry
right after his.

Page 161 opens on its own with the heading "١٠ - قُدَامَةُ بنُ مَظْعُوْنٍ أَبُو
عَمْرٍو الجُمَحِيُّ" and its own `(*)` source list in the same page's notes, so
nothing here is shared with Uthman's entry on the page before. Page 162
closes the entry with Aishah bint Qudamah's account of his death and looks;
entry 11, on Abdullah ibn Maz'un, opens fresh on page 163 with its own
heading and `(*)` block. Both pages of this entry belong to him alone, so no
anchor or notes-marker trimming was needed.

`qudamah-ibn-mazun` had no catalog file before this batch: `prisma/
personSeedData3.ts` carries only his name and the `companion` title, and
`neo4j/graphSeedData3.ts` carries an uncited `SON` edge to `mazun-ibn-habib`.
The `prophet-muhammad-sira` batch does not cite him at all; the only prior
mention of him is `uthman-mazun-siyar9/brother-qudamah`, the `BROTHER` edge
from Uthman's own entry.

## What the entry supports

Six claims and six citations.

**Kunya.** The heading gives it directly: "قُدَامَةُ بنُ مَظْعُوْنٍ أَبُو عَمْرٍو
الجُمَحِيُّ" (`161-p1`), so `kunya` holds "أَبُو عَمْرٍو".

**A second hijra to Abyssinia.** Ibn Sa'd's account of his family says "وَهَاجَرَ
الهِجْرَةَ الثَّانِيَةَ إِلَى الحَبَشَةِ" (`162-p4`), naming which of his two hijras to
Abyssinia this one was (`161-p3` mentions a hijra to Abyssinia too, but
without saying first or second, so only the more specific line is cited).
This adds him to the `second-hijra-to-abyssinia` event, alongside Ja'far ibn
Abi Talib and az-Zubayr ibn al-Awwam.

**Badr and Uhud.** The same line continues "وَشَهِدَ بَدْراً، وَأُحُداً" (`162-p4`),
adding him as a plain participant to both battles.

**Death year.** His daughter Aishah bint Qudamah's account: "أَنَّ أَبَاهَا
تُوُفِّيَ سَنَةَ سِتٍّ وَثَلاَثِيْنَ" (`162-p5`), thirty-six AH. `deathYearHijri` holds
this value.

**Appearance.** The same account continues "وَكَانَ طَوِيْلاً أَسْمَرَ" (`162-p5`),
tall and brown-skinned.

## What the model has no shape for yet

**Governing Bahrain and the wine incident.** The entry's longest passage
(`161-p2` through `162-p2`) is Umar's appointment of Qudamah as governor of
Bahrain, al-Jarud's accusation that he drank wine there, the testimony of
Abu Hurayrah and Qudamah's own wife Hind bint al-Walid, the hadd Umar had
carried out on him despite Qudamah's Qur'anic argument that Maidah 93
excused him, and their reconciliation afterward. The catalog has no field
for a governorship or a legal punishment, so this stays in the source text.
It is also the reason his entry's heading names him "مِنَ السَّابِقِيْنَ
البَدْرِيِّيْنَ" rather than صحابي outright; the `companion` title carries
forward on its legacy marker, matching Uthman's entry.

**Family by marriage.** The entry opens by placing him among the maternal
uncles of Hafsah bint Umar and Abdullah ibn Umar, and as husband of Umar's
paternal aunt Safiyyah bint al-Khattab (`161-p2`). None of Hafsah, Abdullah
ibn Umar (Umar's son) or Safiyyah bint al-Khattab exist as catalog subjects;
adding them is outside this batch's scope.

**Children.** Ibn Sa'd names three, Umar, Fatimah and Aishah (`162-p4`), the
last of whom the entry itself quotes as a source two lines later. None are
seeded subjects, so this stays in the source text as well.

**The Ayyub al-Sakhtiyani aside and al-Dhahabi's own correction** (`162-p1`),
that Qudamah was the only Badr veteran ever flogged for wine and that
al-Dhahabi adds Nu'ayman ibn Amr as a second, is commentary rather than a
value about Qudamah himself.

## Corroboration and disputes

No other batch cites Qudamah, so there is nothing here to corroborate or
dispute against.

## Leaving the seed

`prisma/personSeedData3.ts` still carries `qudamah-ibn-mazun` with only a
name and the `companion` title. This batch does not retire that entry: the
new `data/catalog/people/qudamah-ibn-mazun.ts` carries `companion` forward
on its legacy marker and the `SON` edge to `mazun-ibn-habib` on its legacy
marker too, since this entry's heading never restates his father's name.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
