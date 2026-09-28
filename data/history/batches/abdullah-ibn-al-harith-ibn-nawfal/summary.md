# Batch: Abdullah ibn al-Harith ibn Nawfal, Siyar entry 29

This batch gives عبد الله بن الحارث بن نوفل الهاشمي (laqab: ببة) his own
cited catalog entry from al-Dhahabi's Siyar entry on him, son of al-Harith
ibn Nawfal (entry 28, PR #141) and father of entry 30's subject. It follows
[docs/data-pipelines.md](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdullah-ibn-al-harith-ibn-nawfal/](accounts/abdullah-ibn-al-harith-ibn-nawfal/)

## Source account

Entry 29 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. It opens at the
top of page 200 (Shamela 1626) with the bridge "وَابْنُهُ: ٢٩" — entry 28
closes at the foot of page 199, so no start trimming was needed — and runs
through `201-p6` on page 201 (Shamela 1627): "يُحَدِّثُ أَيْضاً عَنْ:
صَفْوَانَ بنِ أُمَيَّةَ، وَأُمِّ هَانِئ بِنْتِ أَبِي طَالِبٍ، وَحَكِيْمِ بنِ
حِزَامٍ." Entry 30's bridge ("وَابْنُهُ: ٣٠") opens at `201-p7` on the same
page, so the run used `--end-anchor p6`; the shared footnote block was cut
with `--notes-end-marker "(*) طبقات ابن سعد"`, keeping entry 29's notes
(١)(٢) and dropping entry 30's `(*)` bibliography and note (٣), which the
entry-30 batch owns.

Unlike the entry-28 batch, no ajax fallback was needed: Shamela's plain
reading pages for ids 1626 and 1627 served full bodies to the browser-shaped
request, and `npm run history:extract -- --book 10906 --from 1626 --to 1627
--out data/history/batches/abdullah-ibn-al-harith-ibn-nawfal --subject-slug
abdullah-ibn-al-harith-ibn-nawfal --source-slug siyar-alam-al-nubala-risalah
--end-anchor p6 --notes-end-marker "(*) طبقات ابن سعد"` reproduces these
files exactly.

## Scope call: Companion, with a recorded contest

Entry 29 falls in the الطبقة الأولى — الصحابة (v1) block that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope, and the entry's own bibliography cites الإصابة (7/201).
The entry itself gives "وُلِدَ فِي حَيَاةِ النَّبِيِّ" (`200-p3`) and Ibn
Sa'd's report that his mother brought him to the Prophet as an infant, who
spat in his mouth and prayed for him (`201-p2`). Against that, the same
Ibn Sa'd report labels him "ثِقَةٌ تَابِعِيٌّ" — a Tabi'i, not a Companion.
That is a genuine contest over his صحبة, so per the scope rule he is taken
in rather than left out: the `companion` title stays on the catalog entry
and this paragraph records who holds what. Modelling the generation as a
cited value remains open and undecided, so no field carries it.

## What this entry supports

Six claims, across the two pages.

His name, from the heading: "عَبْدُ اللهِ بنُ الحَارِثِ بنِ نَوْفَلٍ
الهَاشِمِيُّ" (`200-p2`). The heading stops at Nawfal, so `fullName` stops
there too rather than importing the seed's longer chain (بن الحارث بن عبد
المطلب بن هاشم القرشي) without a citation from this entry for it — the
same call the suhail-ibn-amr and al-harith-ibn-nawfal batches made. The
longer ancestry stays reachable through the father edge. The bridge
"وَابْنُهُ:" (`200-p1`) with the heading backs a `SON` relation to
`al-harith-ibn-nawfal`, which exists on origin/main; the reciprocal
`FATHER` side is written by `catalog:project-graph` at projection time.

His standing, carried as `virtues`: at Yazid's death the people of Basra
agreed to make him their emir (`200-p4`); when Ubayd Allah ibn Ziyad fled
they settled on him, wrote to Ibn al-Zubayr pledging allegiance to him
through him, and Ibn al-Zubayr confirmed him over them (`200-p9`,
`200-p10`). A governorship is virtues material on the entry-28 batch's
footing.

His death, as competing reports: Ibn Sa'd's account has him fleeing Basra
for Oman in fear of al-Hajjaj at Ibn al-Ash'ath's revolt and dying in Oman
in the year 84 (`201-p3`), giving both `deathYearHijri` (84) and
`placeOfDeathArabic` (عمان); Abu Ubayd says he died in 83 (`201-p4`). The
83 report is kept as its own DISPUTED `death-year-alt` claim on the
suhail-ibn-amr death-place pattern and is not carried into the catalog
file.

## What the entry does not carry into the model

The laqab ببة (`200-p3`) has no field in the model — it already lives in
the catalog entry's transliterated name — and stays in the source text.
His mother is named Hind, sister of Mu'awiyah (`200-p5`), with her rajaz
verses teasing Babbah (`200-p7`); she has no catalog slug (hind-bint-utbah
is the grandmother's generation and the entry does not state that link),
so no relation is claimed. The teacher and student lists (`200-p11`,
`200-p14`, `201-p1`, `201-p6`) and the transmission remarks ("أرسل حديثا"،
"كثير الحديث"، حديثه في الكتب الستة) have no fields and stay unclaimed.
"شَهِدَ الجَابِيَةَ مَعَ عُمَرَ" (`200-p12`) names no modeled battle —
there is no `data/catalog/battles/` entry for al-Jabiyah, and authoring one
is its own undertaking — so no `PARTICIPATED_IN` is authored and no battle
file is touched. No muakhah is stated, so no `PACT_BROTHER`.

## What the entry does not state

Kunya, appearance, wives, and siblings are all clean misses, checked by
diacritic-stripped grep across both extracted pages plus a full read. The
أبو occurrences all belong to other men (أبو التياح، أبو إسحاق السبيعي،
أبو عبيد); the subject has a laqab, not a kunya. The نكح/جارية hits are
all inside Hind's rajaz about marrying Babbah off, not a stated wife. The
one أخت hit is "ابن أخت معاوية" — he is the sister's son; no sibling of
his is named. All four are marked `notInSource`.

## Legacy values visited

`data/catalog/people/abdullah-ibn-al-harith-ibn-nawfal.ts` carried four
legacy values: `sex` MALE, the long `fullName` chain, the `companion`
title, and the `SON` edge to al-Harith. The name and the father edge are
promoted to the new claims above (with `fullName` shortened to what the
entry states, per the neighbouring batches' precedent). `sex` and the
`companion` title stay `legacy-unreviewed`: the entry implies both through
masculine grammar and placement in the الصحابة run, and states neither
outright — the same footing the entry-28 batch left them on.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
