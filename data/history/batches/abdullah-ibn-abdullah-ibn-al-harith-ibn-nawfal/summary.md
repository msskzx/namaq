# Batch: Abdullah ibn Abdullah ibn al-Harith ibn Nawfal, Siyar entry 30

This batch cites al-Dhahabi's dedicated Siyar entry on عَبْدُ اللهِ بنُ
عَبْدِ اللهِ بنِ الحَارِثِ بنِ نَوْفَلٍ الهَاشِمِيُّ, son of Abdullah ibn
al-Harith (entry 29) and grandson of al-Harith ibn Nawfal (entry 28). It
follows the [data quality and references
workflow](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages:
  [accounts/abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal/](accounts/abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal/)
- Catalog entry:
  `data/catalog/people/abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal.ts`
  (new, from scratch — no seed file declares this subject)

## Source account

Entry 30 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The entry straddles
printed pages 201–202 (Shamela 1627–1628): entry 29 closes on 201 with
"وَابْنُهُ:" ("and his son:"), this entry runs `201-p8` (the numbered
heading) through `202-p3`, and entry 31 (Sa'id ibn al-Harith) opens cleanly
at `202-p4`, so the bridge stays with entry 29 per the al-harith-ibn-nawfal
batch's precedent and no end trimming beyond the entry-31 opening was needed.

Page 201's footnote block mixes entry 29's `(1)`–`(2)` notes with this
entry's own `(*)` bibliography and `(3)` kunya correction, so the shared
block was cut at `(*)` and this entry's two notes alone remain in
`001.notes.md`. Page 202's block runs this entry's `(1)` al-Abwa'/samum
gloss and then entry 31's apparatus, so it was cut at entry 31's `(*)` and
only the gloss remains in `002.notes.md`.

Two signals place entry 31's `(*) تاريخ خليفة: ١٣١، الإصابة: ٤ / ١٨٤` on
its side of that cut. The edition prints an entry's bibliography on the
page its heading falls on and numbers the `(*)`, `(* *)` sigils per page;
entry 31's heading opens page 202, its sigil is the page's first `(*)`,
and entry 32's `(* *)` is the page's second. The `الإصابة: ٤ / ١٨٤`
reference is also the exact page entry 31's own `(2)` note quotes. By the
same rule the page-201 `(*)` is this entry's: entry 30's heading opens
page 201, and the `نسب قريش: ٨٦` it cites is the same nasab page entry
29's own bibliography cites for this family.

Unlike the al-harith-ibn-nawfal batch, no ajax fallback was needed:
Shamela's plain reading pages rendered their `.nass` bodies to a
browser-shaped request at extraction time. Re-running `npm run
history:extract -- --book 10906 --from 1627 --to 1628 --out
data/history/batches/abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal
--subject-slug abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal --source-slug
siyar-alam-al-nubala-risalah --start-anchor p8 --end-anchor p3
--notes-start-marker "(*) طبقات ابن سعد" --notes-end-marker "(*) تاريخ
خليفة"` reproduces these files exactly, with `extractionUrl` naming the
canonical reading pages.

## Scope call: contested Companion, taken in

Entry 30 sits inside the الطبقة الأولى — الصحابة (v1) run that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope, numbered between Hashimi Companions. The entry's own
signals pull both ways. For the Companion side, al-Dhahabi files him among
the Companions and heads him `(خَ، م)` — Bukhari and Muslim both transmit
from him, a sigil he does not give a mere Tabaqi. Against that, the entry
states no meeting with the Prophet: no صحبة, no إدراك, no رؤية, and every
generation marker in it reads second-generation Taba'i. He narrates from
his father, whom Ibn Sa'd grades "ثِقَةٌ تَابِعِيٌّ" and whose own supplication
in the Prophet's mouth the Siyar reports at entry 29, and from Ibn Abbas;
al-Zuhri narrates from him; he was among Caliph Sulayman's entourage; and
he died in 97 AH. A Companion with a Sahihayn sigil and a Taba'i's
genealogy is a contest, not a settled case, and the same contest is what
put his father in this run. Per the repo rule a contested Companion is
taken in with the contest recorded, never dropped — a wrongly included
subject costs a status note, a wrongly excluded one costs a silent hole.
No `companion` title is claimed, since no claim in this batch could back
it.

## What this entry supports

Seven claims, on the two pages.

His nasab, from the heading: "عَبْدُ اللهِ بنُ عَبْدِ اللهِ بنِ الحَارِثِ
بنِ نَوْفَلٍ الهَاشِمِيُّ" (`201-p8`). The heading stops at Nawfal, so
`fullName` stops there too rather than importing a longer chain without a
citation from this entry, per the al-harith-ibn-nawfal batch's precedent.
The same paragraph backs a `SON` relation to
`abdullah-ibn-al-harith-ibn-nawfal`, corroborated by "حدَّثَ عَنْ: أَبِيْهِ"
(`201-p10`); the reciprocal `FATHER` side is written by
`catalog:project-graph` at projection time. His sex is carried as a cited
claim off the masculine kunya and brother statements of `201-p9`, since no
seed carries it — the abu-ubaydah pilot's footing for a from-scratch
subject.

His kunya, أبو يحيى (`201-p9`). The `(3)` footnote records that the print
distorted it to "إسحاق"; the extracted text follows the corrected reading,
and the kunya is authored as أبو يحيى with the correction noted here.

His standing, carried as `virtues`: he was among Caliph Sulayman's
entourage (`202-p2`), and Ibn Sa'd grades him ثقة قليل الحديث (`202-p3`).
A courtier's proximity to the caliph goes in on the same footing as the
al-harith batch's governorship material; the rijal grade travels with it as
the entry's only other standing assessment.

His death, single-reported: killed by the samum wind at al-Abwa' in 97 AH
while with Sulayman, who prayed over him (`202-p3`). `deathYearHijri` 97
and `placeOfDeathArabic` الأبواء, each with its own claim on the shared
sentence — no competing report, so no suhail-ibn-amr-style split. The
al-Abwa' geography note stays in `002.notes.md` as editor's material.

## What the entry does not state

Appearance and wives are clean misses: trigger-word greps over the
diacritic-stripped text of both pages for physical-description phrases
(كان طويلا, أسمر, أبيض, أدمة, لحية) and marriage words (تزوج, امرأة, زوج)
return nothing, and all six paragraphs were read in full. Both are marked
`notInSource`.

No battle is named anywhere in the entry, so no `PARTICIPATED_IN` claim is
authored and no `data/catalog/battles/` file is touched. No muakhah is
stated, so no `PACT_BROTHER`. The `(خَ، م)` Sahihayn sigla on the heading
is transmission metadata with no model field and stays in the source text,
though the scope call above weighs it.

The entry names three brothers — Ishaq and Muhammad ("أَخُو إِسْحَاقَ
وَمُحَمَّدٍ", `201-p9`) and Awn, who narrates from him ("أَخُوْهُ عَوْنٌ",
`202-p1`) — with no mother stated, so any edge would be `HALF_BROTHER`.
None of the three is a catalog subject, and a relation needs something on
the far end, so no edge is authored and the brother statements stay in the
source text. `siblings` is therefore left unmarked rather than marked
`notInSource`, which would assert the entry is silent on a subject it
addresses twice. The cost is that `catalog:checklist` reports `siblings`
⚠️ unchecked rather than ⚪; that warning is the honest state, and it clears
when Ishaq, Muhammad or Awn is authored as a subject.

## Legacy values visited

`npm run catalog:ledger -- --batch` scopes this batch to its own subject
(no seed, nothing owed) plus the pointed-at
`people/abdullah-ibn-al-harith-ibn-nawfal`, which carries four legacy
values: `sex`, `fullName`, the `companion` title, and the `SON` edge to
al-Harith. All four stay `legacy-unreviewed`. The heading corroborates the
father's chain up to Nawfal and implies the father edge, but states neither
the longer tail (بن الحارث بن عبد المطلب…) nor anything about the father's
own standing; promoting any of the four belongs to the entry-29 batch that
owns that subject. No contradiction: nothing here disputes the father's
carried chain.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
