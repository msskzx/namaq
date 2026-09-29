# سعد بن الربيع

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 318–319
- **Shamela pages**: 1744–1745
- **Section**: أعيان البدريين (entry 63)

The entry sits whole on its two pages: 1744 opens with the numbered header
(٦٣ - سَعْدُ بنُ الرَّبِيْعِ) and 1745 closes with وَفَاضَتْ نَفْسُهُ, so no
anchor trimming was needed at either end. The following entry (64, معن بن عدي)
starts on printed 320.

## What the entry says

The header gives the chain سعد بن الربيع بن عمرو بن أبي زهير, continued in the
next paragraph through مالك بن امرئ القيس … إلى بني الحارث بن الخزرج, then the
labels الأنصاري الخزرجي الحارثي البدري النقيب الشهيد. The editor's first note
records that لفظة "الحارثي" سقطت من المطبوع — the chain itself still carries
بن الحارث بن الخزرج, so the label is kept as the entry states it.

The body holds three reports: the Prophet paired him with عبد الرحمن بن عوف,
and Sa'd offered him half his wealth and the divorce of one of his two wives
so he could marry her — Abd al-Rahman declined, prayed for him, and left. At
Uhud the Prophet sent first an unnamed Ansari, then (in Kharijah ibn Zayd's
report) Zayd ibn Thabit himself, to find him; dying of his wounds — seventy
sword-cuts — he sent the Prophet his greeting and his thanks (جزاك الله عني
خير ما جزى نبيا عن أمته), said أجد ريح الجنة, and charged the Ansar لا عذر لكم
عند الله إن خلص إلى نبيكم ومنكم عين تطرف, then died. A third report has his
widow bring his two daughters to the Prophet after Uhud; their uncle had taken
their inheritance, the Prophet said يقضي الله في ذلك, and the inheritance verse
came down — two thirds to the daughters, an eighth to the mother, the rest to
the uncle.

Muhammad ibn Abd al-Rahman ibn Abi Sa'sa'ah, Ibn Ishaq, Jabir ibn Abd Allah,
Abd Allah ibn Muhammad ibn Aqil, Kharijah ibn Zayd and his father are named as
transmitters or as people present. They stay in the account text and become no
graph nodes or edges.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — the entry's own patronymic, 318-p1–p2, printed 318 |
| Nasab (father edge) | Found — the same patronymic, 318-p1, printed 318 → `al-rabi-ibn-amr` |
| Kunya | Confirmed absent — no كنية anywhere in the entry |
| Appearance | Confirmed absent — no physical description |
| Manaqeb | Found — the Aqaba naqibship, the muakhat generosity, and the Uhud death reports, printed 318–319 |
| Wives | Confirmed absent as a relation — two wives are mentioned (إحدى زوجتيه، امرأته، أمهما) but none is named, so no edge can be declared |
| Siblings | Confirmed absent — no sibling trigger in the entry |

## Values already held, visited

`catalog:ledger -- --batch` owed four values on `saad-ibn-al-rabi`, all visited:

- `fields.sex` MALE — promoted (masculine labels, 318-p3).
- `fields.fullName` — promoted (318-p1–p2).
- `titles[0]` companion — promoted (البدري النقيب الشهيد, 318-p3).
- `relations[0]` SON → `al-rabi-ibn-amr` — promoted (318-p1).

New values added with this batch's evidence: `fields.tribalAffiliation`,
`fields.virtues`, and `PACT_BROTHER` → `abdur-rahman-ibn-awf` (that edge
already exists from Abd al-Rahman's side on `awf/muakhat-saad`; this cites it
from Sa'd's own entry).

The entry also names the next generation up (بن عمرو بن أبي زهير), so the two
legacy values on `al-rabi-ibn-amr` (`fields.sex`, `SON` → `amr-ibn-abi-zuhayr`)
are promoted on this batch's evidence too. The chase stops there:
`amr-ibn-abi-zuhayr`'s own values stay legacy — his father is not named as a
slug in this entry, and rounding up the whole ancestor chain is not one
batch's job.

Not taken up: the entry calls him البدري, but `data/catalog/battles/badr.ts`
does not list him — adding a Badr roster membership is a catalog change beyond
this batch's four owed values and is left for a follow-up. His Uhud
participation is already cited (`saad-rabi/uhud`). His two daughters and his
wife are unnamed in the entry, so no family edges are declared.
