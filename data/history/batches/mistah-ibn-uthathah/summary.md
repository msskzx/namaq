# Batch: Mistah ibn Uthathah, Siyar entry 20

This batch gives مسطح بن أثاثة المطلبي his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/mistah-ibn-uthathah/](accounts/mistah-ibn-uthathah/)

## Source account

Entry 20 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on the
page shared with amir-ibn-al-bukayr's closing entry, page 187 (Shamela
1613), right after entry 19 ends. Its own bibliography footnote ("(* *)")
already sits on that same page, so this account's first page picks up from
`187-p7` and carries the footnote from that marker onward, the same split
the amir-ibn-al-bukayr batch used from the other side. The entry continues
onto page 188 (Shamela 1614) and closes there at `188-p6`, right before
entry 21 (أبو عبس) opens at `188-p7`. Entry 21's own bibliography footnote
("(*)") lands on that same closing page but belongs to entry 21, not this
one, so it is trimmed off the end of this account's second page.

## What this entry supports

Four claims, across the two pages.

His full ancestry, from the heading and the line that continues it:
"مِسْطَحُ بنُ أُثَاثَةَ بنِ عَبَّادِ بنِ المُطَّلِبِ المُطَّلِبِيُّ" (`187-p7`)
continuing "ابْنِ عَبْدِ مَنَافٍ بنِ قُصَيٍّ، المُطَّلِبِيُّ" (`187-p8`). The
seed's fullName already carried this chain, unsourced; this batch is the
first to cite it. The rest of that paragraph adds "المُهَاجِرِيُّ" (an
emigrant to Medina) and "البَدْرِيُّ" (a witness of Badr), plus a note that
he is "المَذْكُوْرُ فِي قِصَّةِ الإِفْكِ" (mentioned in the story of the
slander). المهاجري backs no field or title this model holds, so it is not
carried into a claim; البدري becomes his `PARTICIPATED_IN` relation to
`data/catalog/battles/badr.ts`, the same treatment the other al-Bukayr
brothers' entries gave that epithet.

The reference to the slander story (qissat al-ifk, concerning the
accusation against Aisha) is a factual description of who Mistah is, not
an assignment the model can hold: the catalog has no Event node for al-ifk,
so this stays in the source text rather than an `INVOLVED_IN` claim. The
`prophet-muhammad-sira` batch's only mention of the incident
(`sira/dhi-amar`'s citation, "قلت: وفيها حديث الإفك...") does not name
Mistah and cites a different claim (the year of a campaign), so there is no
existing claim to cross-check or contradict here.

Ibn Sa'd's description of him, quoted by al-Dhahabi: "كَانَ قَصِيْراً،
غَائِرَ العَيْنَيْنِ، شَثْنَ الأَصَابِع" (`188-p3`), giving his `appearance`
field. The same sentence adds "عَاشَ سِتّاً وَخَمْسِيْنَ سَنَةً" (lived
fifty-six years); the model has no field for a lifespan, and deriving a
birth year from it would mean subtracting from the death year rather than
reading a stated value, so it is not carried into a claim.

His death: "تُوُفِّيَ سَنَةَ أَرْبَعٍ وَثَلاَثِيْنَ" (`188-p4`), giving
`deathYearHijri: '34'`, the same year as his contemporary Iyas ibn
al-Bukayr.

## What the model has no shape for yet

Al-Dhahabi's own remark, "إِيَّاكَ يَا جَرِي أَنْ تَنْظُرَ إِلَى هَذَا
البَدْرِيِّ شَزْراً لِهَفْوَةٍ بَدَتْ مِنْهُ، فَإِنَّهَا قَدْ غُفِرَتْ، وَهُوَ
مِنْ أَهْلِ الجَنَّةِ" and his warning against a Rafidi slandering Aisha
after her exoneration (`188-p5`, `188-p6`), is his own homiletic comment on
the ifk affair, not a factual claim about Mistah that any field or relation
holds.

The opening paragraph's "كَانَ فَقِيْراً، يُنْفِقُ عَلَيْهِ أَبُو بَكْرٍ"
(`188-p1`, he was poor, and Abu Bakr supported him) names a real connection
between the two men, but no relation type here fits a one-time financial
arrangement, and the passage does not name the kinship the footnote's
Bukhari extract alludes to ("لقرابته منه"). Recording a specific family
relation from that alone would go past what this page states, so it stays
unclaimed.

## Kunya and titles

The entry gives no kunya for him; neither the heading nor the following
line uses أبو anything. No title beyond the seed's carried "companion" is
supported here: "البدري" is modeled as the Badr `PARTICIPATED_IN` relation
rather than a title, per the standing rule against duplicating a relation as
a title, and "المهاجري" has no title slug in `prisma/titleSeedData.ts` to
carry it under.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `mistah-ibn-uthathah` as an
active entry. `data/catalog/people/mistah-ibn-uthathah.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its
seed row in the same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
