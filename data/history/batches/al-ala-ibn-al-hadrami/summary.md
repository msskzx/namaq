# Batch: al-Ala ibn al-Hadrami, Siyar entry 51

This batch gives العلاء بن الحضرمي his first sourced claims, from al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/al-ala-ibn-al-hadrami/](accounts/al-ala-ibn-al-hadrami/)

## Scope

Companion, in scope. The entry sits at number 51 in the Siyar's first Sahaba
run, inside أعيان البدريين: a Hadrami of Hadramawt who was a حليف of Banu
Umayya rather than born Qurayshi, appointed over Bahrain by the Prophet and
then by Abu Bakr and Umar, and sent against Bahrain in Abu Bakr's day. At four
printed pages it is the longest entry in this run.

## Source account

Entry 51 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb
al-Arnaut. It opens at `262-p7` (Shamela 1688), mid-page: entry 50 (عمرو بن
سعيد الأموي) occupies `262-p1`–`262-p6`, so the page was cut with
`--start-anchor p7` at the numbered heading "٥١ - العَلاَءُ بنُ الحَضْرَمِيِّ".
Page 262's footnote block is shared; entry 51's footnote (١), the note on
`عِمَادِ`, is the second half of it, so the block was cut with
`--notes-start-marker "(١) عماد بالميم"`.

The entry runs to printed 266, not 265: its last paragraph — the group's burial
of him in the open country without water — is the only paragraph on that page,
and entry 52 (سعد بن خيثمة) opens at `266-p2` immediately after it. So the
extraction runs Shamela 1688–1692, cut with `--end-anchor p1`, and page 266
carries no notes file: its single footnote block is entry 52's bibliography and
footnotes, dropped with `--notes-end-marker "(*) طبقات ابن سعد"`.

## What this entry supports

Seven claims over five pages, six on the subject and one on his father.

His name and clan, from `262-p8` and `262-p9`: the entry gives his real name
as العلاء بن عبد الله بن عماد بن أكبر بن ربيعة بن مقنع بن حضرموت and places
him as `كان من حلفاء بني أمية، ومن سادة المهاجرين`. `fullName` carries the
chain as stated, ending at the clan eponym حضرموت, plus the حليف clause.
Because he is an ally and not born into Quraysh, no edge is drawn into Banu
Umayya's blood tree.

His father, from the same `262-p8`: a `SON` relation to
`abdullah-ibn-imad-al-hadrami`, which the father's own module already carries
in the reciprocal direction.

His companion title, from `262-p9`: the entry files him among the emigrants,
`من سادة المهاجرين`.

His standing, carried as `virtues` over three citations: the Prophet's
appointment of him over Bahrain and its renewal under Abu Bakr and Umar
(`263-p1`); Abu Bakr's army sent against Bahrain and the crossing of the sea
between the two sides on foot at الرقراق (`264-p2`); and Abu Hurayrah's
`رأيت من العلاء ثلاثة أشياء لا أزال أحبه أبدا` (`265-p7`).

His death year, from `264-p3`: `توفي سنة: إحدى وعشرين`.

His father, from Ibn Ishaq at `263-p8`: `كان والدهم الحضرمي حلف حرب بن
أمية، وهو من بلاد حضرموت` — a claim on `abdullah-ibn-imad-al-hadrami` for
`sex`, and the source's own account of the alliance and homeland behind his
`fullName`.

## What the entry does not state

Kunya, appearance, and wives: five pages with no trigger word for any of the
three — no `أبو فلان` for him, no `كان طويلا`/`أسمر`, no `تزوج`/`زوجة`. All
three are marked `notInSource`.

His brothers are named — ميمون بن الحضرمي at `262-p10`, and عمرو وعامر at
`262-p11` — so `siblings` is not marked `notInSource`, but it is also not
authored: none of the three has a module under `data/catalog/people/`, and this
batch does not invent people. `catalog:checklist` therefore still reports
`siblings` as unchecked, which is the honest state — the source states them and
the model has no node to hang them on.

The entry gives no event for the Bahrain expedition and no module exists for
one, so no event link is declared. Nor is there any mention of a Yemen
expedition or of a musk-scent report attributed to the Prophet; neither appears
anywhere in the five pages, and neither is recorded.

## Legacy values

The subject's stub held four legacy values, and all four are promoted to cited
claims: sex, fullName, the companion title, and the SON edge to his father.
Nothing is left legacy and nothing contradicts.

The legacy fullName read "العلاء بن عبد الله بن عماد الحضرمي حليف بني أمية",
which this entry supports, but the entry states a longer chain and the seed
value dropped it. `fullName` now carries the chain to حضرموت with the حليف
clause kept, so the change adds the source's own words rather than replacing
them.

`catalog:ledger -- --batch` also reaches the father, whose own claims this
entry's `SON` assertion points at. His stub held two legacy values, both now
cited: his sex, from Ibn Ishaq's `كان والدهم الحضرمي حلف حرب بن أمية وهو من
بلاد حضرموت` (`263-p8`), and the reciprocal `FATHER` edge, which the same
`/father` claim already supports from the other side.

The retired seed's own note recorded that the father's name is reported two
ways, and the entry does report it two ways: the heading's `بن عبد الله بن
عماد` at `262-p8`, and Ibn Ishaq's `واسمه: عبد الله بن عباد بن الصدف` at
`263-p9`. The editor's footnote (١) on page 262 settles the reading — "عماد
بالميم. كذا الأصل" in al-Tahdhib, its branches, al-Isaba, al-Isti'ab, Fath
al-Bari and Asad al-Ghaba, with the scribe's "عباد" written above, and Ibn
Ishaq's variant reported below. The catalog's father slug
`abdullah-ibn-imad-al-hadrami` already follows the heading, which is what the
editor calls the original reading. The competing form stays in the source
pages, where it already is, and is recorded here rather than written over his
name.

## Review

Nothing is reviewed and nothing is approved. Every claim is NOT_REVIEWED, and
the batch carries no approval block.
