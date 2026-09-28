# أبو سفيان بن الحارث — batch summary

## What the source says

Entry 32 of سير أعلام النبلاء (printed pages 202–205, Shamela 1628–1631, volume 4),
between entry 31 (سعيد بن الحارث) and entry 33 (جعفر بن أبي سفيان, his son). أبو
سفيان بن الحارث، اسمه المغيرة بن الحارث بن عبد المطلب بن هاشم الهاشمي — cousin of
the Prophet, foster-brother nursed by the same woman, حليمة, and brother of نوفل
and ربيعة. He met the Prophet on the road before the conquest of Mecca hostile
and reciting satire against him, was received coldly, then humbled himself until
the Prophet softened toward him; his Islam then became sound. He stood firm with
العباس at Hunayn when others fled, holding the mule's rein. The entry reports the
Prophet's love for him, his hope that he would be "a replacement for Hamza," his
being counted among those who resembled the Prophet, and the Prophet's saying
"أبو سفيان بن الحارث سيد فتيان أهل الجنة." He composed an elegy for the Prophet's
death. Two death reports both point to the same period: he died after a Hajj
haircut wound turned fatal, reportedly four months after his brother نوفل, and
separately "يقال: مات سنة عشرين بالمدينة" — year 20 AH, the same year نوفل's own
catalog entry already carries.

## Scope call

Companion, uncontested. He sits inside the الطبقة الأولى — الصحابة run (opens
Shamela 1431), is the Prophet's paternal cousin and foster-brother, stood with
him at Hunayn, and received the Prophet's direct testimony of Paradise
("سيد فتيان أهل الجنة"). No source cited in the entry disputes his صحبة.

## Legacy values visited

| Legacy value | Disposition |
|---|---|
| sex: MALE | Promoted to cited claim (`abu-sufyan-ibn-al-harith-siyar32/sex`) |
| fullName: المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي | Promoted to cited claim (`abu-sufyan-ibn-al-harith-siyar32/full-name`); source reads الهاشمي without القرشي |
| titles: companion | Promoted to cited claim (`abu-sufyan-ibn-al-harith-siyar32/companion`) |
| SON → al-harith-ibn-abd-al-muttalib | Promoted to cited claim (`abu-sufyan-ibn-al-harith-siyar32/father`) |

## New values authored

- kunya: أبو سفيان (`abu-sufyan-ibn-al-harith-siyar32/kunya`)
- virtues: the Prophet's love and testimony of Paradise, the Hamza remark, being
  counted among those who resembled the Prophet, "سيد فتيان أهل الجنة"
  (`abu-sufyan-ibn-al-harith-siyar32/virtues`)
- deathYearHijri: 20, confidence LIKELY — the entry hedges with "يُقَالُ"
  (`abu-sufyan-ibn-al-harith-siyar32/death-year`)
- PATERNAL_COUSIN → prophet-muhammad (`abu-sufyan-ibn-al-harith-siyar32/cousin-of-prophet`)
- MILK_BROTHER → prophet-muhammad, nursed by the same حليمة
  (`abu-sufyan-ibn-al-harith-siyar32/milk-brother`)
- HALF_BROTHER → nawfal-ibn-al-harith (`abu-sufyan-ibn-al-harith-siyar32/half-brother-nawfal`);
  this closes the one-directional edge nawfal's own batch already declared
  (`nawfal-ibn-al-harith-siyar27/half-brother`) — the reciprocal was missing on this
  subject's file before this batch.
- HALF_BROTHER → rabiah-ibn-al-harith (`abu-sufyan-ibn-al-harith-siyar32/half-brother-rabiah`);
  `data/catalog/people/rabiah-ibn-al-harith.ts` had no edge to this subject at all,
  so the reciprocal is added there too, citing this same claim.
- PARTICIPATED_IN hunayn (`abu-sufyan-ibn-al-harith-siyar32/hunayn`); registered as a
  participant on `data/catalog/battles/hunayn.ts` alongside نوفل and ربيعة.

## Absent from source

- appearance: no physical description in the entry (being counted among those who
  resembled the Prophet is recorded as `virtues`, not a physical description)
- wives: no marriage mentioned

## Notes

- The entry spans four printed pages (202–205); pages 202 and 205 are shared with
  entries 31 and 33, so only the paragraphs belonging to entry 32
  (`4/202-p9`–`p11`, `4/205-p1`–`p12`) are extracted, and each page's footnote
  block is trimmed to the notes belonging to this entry.
- The two death reports (haircut wound after Hajj, four months after نوفل; and
  "سنة عشرين") are not modeled as competing claims: they agree with each other and
  with نوفل's own already-cited death year, so a single `deathYearHijri` claim is
  authored from the explicit year statement, and the haircut-wound account stays
  in the source text unclaimed since the model holds no cause-of-death field.
- "وَقَدْ رَوَى عَنْهُ وَلَدُهُ عَبْدُ المَلِكِ" names a son, عبد الملك, who is not
  a catalog subject and gets no relation — the checklist's seven content items
  do not include a subject's own children.
- Shamela's reading pages fetched normally with a browser User-Agent; no ajax
  fallback was needed.

## Review

Nothing is reviewed. All twelve claims are Not reviewed, and the batch carries no
approval block.
