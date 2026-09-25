# Batch: Suhail ibn Amr, Siyar entry 25

This batch gives سهيل بن عمرو بن عبد شمس his own catalog file and cites
al-Dhahabi's dedicated Siyar entry on him, the father of both أبو جندل
(entry 23) and عبد الله بن سهيل (entry 24). It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/suhail-ibn-amr/](accounts/suhail-ibn-amr/)

## Source account

Entry 25 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on page 194
(Shamela 1620), the same page entry 24 (Abdullah ibn Suhail) closes on. The
abdullah-ibn-suhail batch already trimmed entry 24's own account at `194-p1`;
this entry starts at `194-p2`, "وَ:", the one-word transition into the
numbered heading "٢٥ - سُهَيْلُ بنُ عَمْرٍو: أَبُوْهُمَا" at `194-p3`
("their father", referring back to both sons just covered).

The entry runs out at `195-p6`, six lines into page 195 (Shamela 1621).
Entry 26, on al-Bara' ibn Malik, opens right after at `195-p7`. Page 194's
footnote block is entry 25's own bibliography and needed no trimming, since
entry 24's account had already cut it out in full on its own side. Page
195's footnote block holds two content footnotes referenced inside entry 25
(`كردوس` and `اليرموك`, at `195-p3` and `195-p4`) followed by entry 26's own
bibliography footnote; that trailing block was cut with `--notes-end-marker`
so only entry 25's two footnotes remain in `002.notes.md`.

Suhail's own entry is short, six printed lines longer than his son Abu
Jandal's, not the long account his historical prominence at Hudaybiyyah and
the conquest of Mecca might suggest.

## What this entry supports

Ten claims, across the two pages.

His name, from the heading: "سُهَيْلُ بنُ عَمْرٍو" (`194-p3`). The heading
gives only his father's name, not the full ancestor chain his sons' entries
carry, so `fullName` stops there rather than importing the seed's longer
chain without a citation from this entry for it. The same passage names his
father and backs a `SON` relation to `amr-ibn-abd-shams`, an existing
graph-only node (`neo4j/graphSeedData4.ts`).

His kunya: "يُكْنَى: أَبَا يَزِيْدَ" (`194-p4`; a footnote flags a printing
error, "زيد" for "يزيد", which does not change the name itself).

His standing and character, carried as `virtues`: orator and one of
Quraysh's foremost men (`194-p5`), generous and eloquent (`194-p11`), the
one who calmed Mecca with a speech on the Prophet's death and "exalted
Islam" (`194-p12`), and after that turn to frequent prayer, fasting, alms,
and weeping at the Qur'an (`195-p1`, `195-p2`).

Four battle placements, each a `PARTICIPATED_IN` claim against an existing
battle:

- **Badr** (`194-p9`): captured and got free, on the Quraysh side, so
  `isMuslim: false` and `status: ['WAS_CAPTURED']` on `badr.ts`.
- **Hudaybiyyah** (`194-p6`, `194-p7`): he negotiated the treaty for Quraysh,
  and the entry gives the Prophet's own wordplay on his name, "سَهُلَ
  أَمْرُكُم" ("your affair has been made easy"). Still not Muslim, so
  `isMuslim: false` on `hudaybiyyah.ts`, alongside the `abu-jandal` row
  already there for the same event from his son's side.
- **Fath Makkah** (`194-p8`): "تَأَخَّرَ إِسْلاَمُهُ إِلَى يَوْمِ الفَتْحِ،
  ثُمَّ حَسُنَ إِسْلاَمُهُ" states outright that his conversion is dated to
  the conquest, so he is added there with `isMuslim: true`.
- **Yarmuk** (`195-p3`): commanded a كردوس (division) there, `isMuslim: true`.

## The two competing death reports

`195-p4` and `195-p5` give two reports that disagree outright: al-Mada'ini
and others say he was martyred at Yarmuk; al-Shafii and al-Waqidi say he
died in the Amwas plague. The entry does not reconcile them.

The plague reading takes `placeOfDeathArabic` (`suhail-ibn-amr-siyar25/death-place`,
ESTABLISHED), on the same footing as the saad-ibn-abi-waqqas batch's
handling of a competing death year: two named individual reporters against
"al-Mada'ini and others," an unnamed group. The Yarmuk martyrdom stays its
own claim, `suhail-ibn-amr-siyar25/death-place-alt`, marked `DISPUTED` and
not projected onto the field. His Yarmuk participation row carries no
`status`, since asserting `MARTYRED` there would take the disputed side.

Neither report gives a hijri year for either death, so `deathYearHijri` is
left unset rather than inferred from the battle's own (legacy, uncited)
year or from his son Abu Jandal's death year in the same plague, eighteen
years later. Nothing here says the two deaths are connected.

## The sibling dispute between Abu Jandal and Abdullah ibn Suhail

This is the cross-check the task called for. The just-merged `abu-jandal`
batch declared a `DISPUTED` `HALF_BROTHER` relation between Abu Jandal and
Abdullah ibn Suhail, because that entry names only their shared father, not
a shared mother.

**The dispute stays open.** Suhail's own entry, read here in full, names no
wife and no mother for either son; `wives` is marked `notInSource` on this
account. It also names no other children beside the two sons already
covered ("أَبُوْهُمَا" points at exactly the two, no more), so there is
nothing here to promote to new subjects. Nothing in `data/catalog/people/abu-jandal.ts`
or its `HALF_BROTHER` relation is changed by this batch.

## Kunya, appearance, and siblings

Kunya is found (above). Appearance never appears in this entry, so it is
marked `notInSource`. Siblings of Suhail himself (not his sons to each
other) are also not named here; a `BROTHER` edge to al-Sakran ibn Amr exists
as a raw, uncited `neo4j/graphSeedData9.ts` seed edge, outside this batch's
scope to carry into the catalog since this entry does not state it.

## What the page does not answer for this claim

`194-p10`, Suhail rallying Quraysh to march out after Badr ("يَالَ غَالِبٍ!
أَتَارِكُوْنَ أَنْتُم مُحَمَّداً..."), is a pre-conversion speech, not a
manaqeb passage and not tied to a battle the catalog models by itself, so no
claim is authored from it; it stays in the source text.

## Corroboration with the sira batch

`data/history/batches/prophet-muhammad-sira`'s Hudaybiyyah pages (`527.md`,
`528.md`) name Suhail as Quraysh's negotiator in the same episode this entry
covers, consistent with the `abu-jandal` batch's own corroboration note.
Nothing there contradicts this entry, so no new claim is authored from the
sira pages; the two known-open sira-pass items are left untouched, per
scope.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `suhail-ibn-amr` as an active
entry. `data/catalog/people/suhail-ibn-amr.ts` is now his sole author, per
the standing rule that a subject's catalog file retires its seed row in the
same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
