# معن بن عدي

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي، تحقيق حسين الأسد
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 320–321
- **Shamela pages**: 1746–1747
- **Entry**: 64

## Source account

The entry opens mid-page on printed 320 (Shamela 1746), whose first eight
paragraphs close entry 63 (سعد بن الربيع), and runs to printed 321 (Shamela
1747), where entry 65 (عبد الله بن عبد الله بن أبي) opens at that page's tenth
paragraph. The slice keeps `p9`–`p13` on the first page and `p1`–`p9` on the
second, anchored `320-p9`–`320-p13` and `321-p1`–`321-p9`: fourteen paragraphs,
paragraph counts checked against the anchor runs. The Saqifah report crosses
the page turn, so its citation runs on a `320-321` page range from the `320-p13`
anchor; the two halves are contiguous in the source, so the join is a plain
space and nothing is elided.

Notes trimming: the first page's footnote block opens with entry 63's notes
(دلائل النبوة, مالك via ابن عبد البر), so everything before this entry's `(*)`
bibliography (`طَبَقَات ابْن سَعْد: ٣ / ٢ / ٣٥`) is dropped. The second page's
block opens with this entry's Bukhari note on معن's statement after the
Prophet's death, followed by entry 65's `(*)` bibliography (`٣ / ٢ / ٨٩`),
which is cut from that marker on.

## What the entry supports

Seven claims on two pages.

- `maan-ibn-adi-siyar64/full-name` — the heading's chain (`320-p9`) with the
  nisba and hilf clause (`320-p10`): معن بن عدي بن الجد بن العجلان الأنصاري،
  من حلفاء بني مالك بن عوف. Promotes the legacy value verbatim.
- `maan-ibn-adi-siyar64/father` — SON → `adi-ibn-al-jidd`, from the heading's
  patronymic and from `هُوَ أَخُو عَاصِمِ بنِ عَدِيِّ بنِ الجدِّ` (`321-p7`).
  `adi-ibn-al-jidd.ts` is the same man: its own `SON` edge to الجد بن العجلان
  agrees with the chain here. Left untouched — his own entry is a later batch's
  work.
- `maan-ibn-adi-siyar64/titles` — صحابي, on `العَقَبِيُّ، البَدْرِيُّ`
  (`320-p10`) with Ibn al-Athir's matching `عَقَبِيٌّ، بَدْرِيٌّ، مَشْهُوْرٌ`
  (`321-p6`).
- `maan-ibn-adi-siyar64/virtues` — `مِنْ سَادَةِ الأَنْصَارِ، كَانَ يَكْتُبُ
  العَرَبِيَّةَ قَبْلَ الإِسْلاَمِ` (`320-p10`); the Saqifah report, that he was
  one of the two men who met Abu Bakr and Umar on their way to the portico
  (`320-p13`–`321-p2`); and his words on hearing the people wish they had died
  before the Prophet: `مَا أُحِبُّ أَنِّي مُتُّ قَبْلَهُ حَتَّى أُصَدِّقَهُ
  مَيْتاً، كَمَا صَدَّقْتُهُ حَيّاً` (`321-p5`).
- `maan-ibn-adi-siyar64/badr` — PARTICIPATED_IN badr, on `البَدْرِيُّ`
  (`320-p10`). Added to `data/catalog/battles/badr.ts` the way entry 54's
  Bishr row was: the label in the source's own wording, no status and no deed,
  since the entry narrates nothing of what he did there.
- `maan-ibn-adi-siyar64/death-year` — `12`, on `مِمَّنِ اسْتُشْهِدَ يَوْمَ
  اليَمَامَةِ، سَنَةَ اثْنَتَيْ عَشْرَةَ` (`321-p9`).
- `maan-ibn-adi-siyar64/death-place` — `اليمامة` (`321-p9`).

## Discrepancy in the source

The header calls him `مِنْ حُلَفَاءِ بَنِي مَالِكِ بنِ عَوْفٍ` (`320-p10`), but
the Ibn al-Athir passage al-Dhahabi quotes calls him `حَلِيْفُ بَنِي عَمْرِو بنِ
عَوْفٍ` (`321-p6`). The batch's `fullName` keeps the header's reading, which is
also what the legacy value carried; the rival reading stays in the account
page, where the source has it. It cannot become a second claim: the model holds
one `fullName` string.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — heading plus chain, printed 320 |
| Nasab (father edge) | Found — عدي بن الجد, a catalog person |
| Kunya | Confirmed absent — no kunya for him; a diacritic-insensitive grep for أبو/أم hits only أبي بكر and أبي البداح, neither his |
| Manaqeb | Found — سادة الأنصار, pre-Islamic writing, the Saqifah report, his statement after the Prophet's death |
| Appearance | Confirmed absent — no physical description; grep for طويل/أسمر/قصير/الأدمة/أبيض/لحية hits nothing |
| Wives | Confirmed absent — grep for تزوج/امرأة/زوج/نكح/خطب hits nothing |
| Siblings | Named by the source, not modellable — see below |

## The brother the entry names, and why no edge is declared

`هُوَ أَخُو عَاصِمِ بنِ عَدِيِّ بنِ الجدِّ بنِ العَجْلاَنِ` (`321-p7`) shares the
father but states no mother, so the edge type is undeterminable (full versus
half), and no catalog person exists for عاصم بن عدي — minting a node for a man
the entry names in passing is separate work. No edge is authored and no
`notInSource` mark is made, so `catalog:checklist` keeps one ⚠️ on siblings
for this subject. The same call was made for Saad ibn Khaythamah's maternal
brother Abu Dayyah (`data/history/batches/saad-ibn-khaythamah/summary.md`).

## Legacy values visited

`data/catalog/people/maan-ibn-adi.ts` carried four legacy values.

- **`sex` MALE** — stays on the legacy marker. The entry never states his sex
  outright.
- **`fullName`** — promoted verbatim. The header's chain and hilf clause match
  the carried value word for word.
- **`companion` title** — promoted, on العقبي والبدري.
- **`SON` → `adi-ibn-al-jidd`** — promoted to the new father claim. The
  reciprocal `FATHER` edge reaches the graph from Maan's `SON`, the way the
  projector writes it.

## Not modelled

`وَلَهُ عَقِبٌ اليَوْمَ` (`320-p11`, Ibn Sa'd: he has living descendants) names
no one the graph holds, so it stays in the account page. Asim's standing
(`سَيِّدَ بَنِي العَجْلاَنِ`) and his son Abu'l-Baddah (`321-p7`), Asim's Badr
presence (`321-p8`), and the Yamama campaign itself (no battle module exists
for it) are likewise left to their own subjects' batches. No Yamama
participation edge is authored: attendance there is attested only through the
martyrdom wording, and the battle it belongs to is not in the catalog.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/maan-ibn-adi` prints
five values still awaiting evidence across the three subjects this batch speaks
about, one of them on the batch's own subject.

| Awaiting | Whose it is |
|---|---|
| `people/maan-ibn-adi` `fields.sex` | Left `legacy-unreviewed`: the entry states his sex nowhere outright, so there is nothing to cite it from. |
| `people/adi-ibn-al-jidd` `fields.sex`, `relations[0]` | His own page's work. `relations[0]` is the `FATHER` edge to الجد بن العجلان — the same edge this batch cites from Maan's side at `maan-ibn-adi-siyar64/father`; his module keeps its own copy on the legacy marker until a batch reads his page. |
| `battles/badr` `fields.location`, `participants[0]` | Pre-existing on a shared file and out of scope here. `participants[0]` is Umar, whom no batch in this run has read. |

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`: the entry is extracted and
the claims authored, and nobody has compared them against the stored pages.
The batch is approved for publication, which permits the import and asserts
nothing about review.
