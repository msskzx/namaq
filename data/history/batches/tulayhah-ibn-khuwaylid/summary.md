# Batch: Tulayhah ibn Khuwaylid, Siyar entry 62

This batch gives طليحة بن خويلد بن نوفل الأسدي his first sourced claims, from
al-Dhahabi's dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/tulayhah-ibn-khuwaylid/](accounts/tulayhah-ibn-khuwaylid/)

## Index position and the section

The islamweb companion index runs ثابت بن قيس, then the شهداء أجنادين
واليرموك group heading (skipped: a collective martyrdom heading, not a
single-person entry), then طليحة بن خويلد, then سعد بن الربيع. The Shamela
text confirms the order: Thabit ibn Qays closes on printed 315, the
أجنادين/اليرموك names run across printed 315–316, heading ٦٢ opens near the
bottom of printed 316, and the entry's text runs to the end of printed 317,
where heading ٦٣ (Sa'd ibn al-Rabi') opens at the top of printed 318.

## Source account

Entry 62 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb
al-Arnaut. It opens at `316-p7` (Shamela 1742) with its numbered heading
"٦٢ - طُلَيْحَةُ بنُ خُوَيْلِدِ بنِ نَوْفَلٍ الأَسَدِيُّ *" and runs eight
paragraphs to the end of printed 317 (Shamela 1743), closing at `317-p8`,
"قُلْتُ: أَبْلَى يَوْمَ نَهَاوَنْدَ، ثُمَّ اسْتُشْهِدَ". Entry 63 opens on the
next page, so no end anchor was needed. The first page was cut with
`--start-anchor p7`, dropping the أجنادين/اليرموك roster above it.

Page 316's footnote block opens with two notes belonging to the roster
entries above ((١) on a قتل reading, (٢) on الحكماء), so
`--notes-start-marker (*)` cuts from Tulayhah's own bibliography marker,
keeping only the (*) source list in `001.notes.md`. Page 317's two notes
both belong to this entry ((١) on لخالد in `317-p5`, (٢) the نهاوند gloss
in `317-p8`), so the whole block is kept in `002.notes.md`.

## What this entry supports

Seven claims, across the two pages.

His name, from the heading: "طُلَيْحَةُ بنُ خُوَيْلِدِ بنِ نَوْفَلٍ
الأَسَدِيُّ" (`316-p7`). `fullName` carries the chain as stated, matching
the stub's form exactly, and the same heading backs a `SON` relation to
`khuwaylid-ibn-nawfal`, which already exists in the catalog.

His companion title: "البَطَلُ الكَرَّارُ، صَاحِبُ رَسُوْلِ اللهِ"
(`317-p1`). No work contests his صحبة. Scope call: the entry itself records
that he converted in year 9, apostatized, claimed prophethood in Najd,
fought the Muslims, then returned to Islam after Abu Bakr's death and died a
martyr — and still frames him as "صاحب رسول الله". He is kept as a
companion on the book's own framing plus the classical position that an
initial conversion during the Prophet's lifetime with a final death as a
Muslim qualifies, which the catalog stub already held; this batch changes
nothing there.

His virtues, carried as `virtues`: the hero epithet ("وَمَنْ يُضْرَبُ
بِشَجَاعَتِهِ المَثَلُ", `317-p1`); Umar's letter to Sa'd ibn Abi Waqqas to
consult Tulayhah in war but appoint him to nothing (`317-p6`); and Ibn Sa'd's
"كَانَ طُلَيْحَةُ يُعَدُّ بِأَلْفِ فَارِسٍ لِشَجَاعَتِهِ وَشِدَّتِهِ"
(`317-p7`). All three are transmitted material — the book is quoting Umar and
Ibn Sa'd — so the field rests on none of the entry's own editorial voice.

His Qadisiyyah and Nahavand attendance: "ثُمَّ شَهِدَ القَادِسِيَّةَ
وَنَهَاوَنْدَ" (`317-p5`) gives him a `PARTICIPATED_IN` relation to each of
`data/catalog/battles/qadisiyyah.ts` and `data/catalog/battles/nahavand.ts`,
with no `status` on Qadisiyyah. Nahavand carries `MARTYRED`, with the
source's own wording as its `summary`, and the same passage backs
`placeOfDeathArabic` ("نهاوند").

## What rests on al-Dhahabi's own voice

The entry's last paragraph is "قُلْتُ: أَبْلَى يَوْمَ نَهَاوَنْدَ، ثُمَّ
اسْتُشْهِدَ" (`317-p8`) — al-Dhahabi speaking in the first person, not a
report from anyone. The "قَلْتُ" passages are the least evidential material in
the Siyar, and the Siyar's own footnote (٢) on نهاوند gives the battle's date
as year 19 "وقيل" 21 without settling it. Everything else in this entry is
attributed to someone — Umar, Ibn Sa'd, or the transmitted report of Buzakhah
— so this one paragraph carries the death on its own.

`death-place` is therefore LIKELY, not ESTABLISHED, and the Nahavand
participation's `summary` quotes the line rather than paraphrasing it, so a
reader sees that the martyrdom is al-Dhahabi's assertion and not a cited
report. Nothing here contradicts the entry; it is the difference between
"the book says" and "the author says".

The same caution applies to his standing as a hero of the battle, so
`أَبْلَى يَوْمَ نَهَاوَنْدَ` is kept out of `virtues` and left to the battle
summary where its provenance is visible.

## What the entry does not state

Kunya, appearance, and wives: trigger-word grep (يكنى/أبو, appearance
phrases, تزوج/امرأة/زوج) across both pages and both note files returns
nothing of his — the one "أبو" hit is Sa'd ibn Abi Waqqas's name in Umar's
letter. The full read confirms it. All three are marked `notInSource`.

Siblings: the entry names none. "فَقَتَلَهُمَا طُلَيْحَةُ وَأَخُوْهُ"
(`317-p5`) mentions an unnamed brother who fought beside him at Buzakhah,
but with no name there is no slug to link, so no edge can be recorded;
`siblings` is marked `notInSource` on that basis.

No death year: the entry gives no year for his martyrdom. The (٢) footnote
on نهاوند reports the conquest as year 19, "وقيل" 21 — competing reports
about the battle, not a stated death year for him — so no
`deathYearHijri` is set. `death-place` is LIKELY for the reason given above.

## What stays in the pages

The model has no shape for these, so no claim names them and they live only
in the extracted text: the year-9 conversion, the apostasy and false
prophethood in Najd, the Ridda wars against the Muslims, the flight to the
Ghassanids, the return to Islam and the Hajj; Umar's "لا أحبك" exchange over
the killing of Ukashah ibn Mihsan and Thabit ibn Aqram at Buzakhah; and the
unnamed brother above.

## Legacy values

The stub held four legacy values; three are visited here. `fullName`, the
companion title, and the `SON` edge to `khuwaylid-ibn-nawfal` are each
promoted to a cited claim above. `sex` stays on the legacy marker: the entry
never states "رجل" outright, and the masculine name and verb forms are
consistent with MALE but are not a citable statement — the same call the
khubayb and amir-ibn-al-bukayr batches made for their subjects.

The reciprocal `FATHER` side of the `SON` tie is left to
`catalog:project-graph`, which writes it from the declared inverse.

## Review

Nothing is reviewed and nothing is approved. Every claim is NOT_REVIEWED, and
the batch carries no approval block.
