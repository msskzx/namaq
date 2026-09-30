# عكاشة بن محصن

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 307–308
- **Shamela pages**: 1733–1734
- **Section**: أعيان البدريين

The entry opens at the top of printed 307 with its own header, so the first
page needed no start-anchor trim — but its notes block still carried the tail
of entry 59's (عتبة بن غزوان) notes, cut with `--notes-start-marker
"طبقات ابن سعد: ١٣"`. The entry ends on printed 308 at `308-p6`; entry 61's
(ثابت بن قيس) header at `308-p7` and its nasab tail at `308-p8` were cut with
`--end-anchor p6`, and ثابت's `(*)` source list with `--notes-end-marker
"طبقات ابن سعد: ٥"`.

## What the entry says

The header gives عُكَّاشَةُ بنُ مِحْصَنٍ أَبُو مِحْصَنٍ الأَسَدِيُّ — the
father's given name only, no chain — then the labels: السعيد الشهيد، حليف
قريش، من السابقين الأولين، البدريين، أهل الجنة.

The Prophet put him in command of سريّة الغمر and they met no resistance.
Umm Qays bint Mihsan reports he was 44 when the Prophet died and was killed a
year later at بزاخة, in Abu Bakr's caliphate, in year 12. He was among the
most beautiful of men. al-Dhahabi corrects the dating: كذا هذا القول،
والصحيح أن مقتله كان في سنة إحدى عشرة — killed by طليحة الأسدي, who apostatized
then returned to Islam.

At Badr he fought well; his sword broke in his hand and the Prophet gave him a
palm stalk or a stick that became a sword by God's leave — he fought with it
and witnessed the later battles with it. Abu Hurayrah and Ibn Abbas transmitted
from him. Khalid ibn al-Walid sent him with ثابت بن أقرم الأنصاري العجلاني as
a vanguard on two horses; Tulayhah caught and killed them both. Thabit was a
Badri of great standing who transmitted nothing. A report adds that at Mu'tah,
when Ibn Rawahah fell, the banner passed to Thabit ibn Aqram, who could not
bear it and handed it to Khalid.

Abu Hurayrah, Ibn Abbas, Khalid, Thabit ibn Aqram, Ibn Rawahah and Umm Qays
are named as narrators or as people present. They stay in the account text and
become no graph nodes or edges: the model holds no shape for "transmitted
from", for a killer, or for a vanguard pairing.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — header chain, 307-p1, plus الأسدي حليف قريش on 307-p2 |
| Nasab (father edge) | Confirmed absent — see below |
| Kunya | Found — أبو محصن, 307-p1–p2 |
| Appearance | Found — وَكَانَ مِنْ أَجْمَلِ الرِّجَالِ, 307-p7 |
| Manaqeb | Found — السابقون الأولون/Badri labels, the Ghamr command, Badr |
| Wives | Confirmed absent — no تزوج/امرأة/زوج trigger in either page |
| Siblings | Confirmed absent — see below |

## The father has no node, so the chain stays a string

The entry names the father only as محصن: no grandfather, no clan line through
him, and no catalog person for him. A `SON` edge needs a target the catalog
knows, so none was authored and `fullName` carries the whole chain instead.
`nasab` is marked `notInSource` on that basis — not "the source is silent"
but "no edge is modelable from what it states."

## Umm Qays bint Mihsan is a narrator, not a stated sister

307-p4 has وَرُوِيَ عَنْ أُمِّ قَيْسٍ بِنْتِ مِحْصَنٍ — the same father's given
name, and no word stating she is his sister, let alone a shared mother. She
has no catalog node either. No `SISTER`/`HALF_SISTER` edge was written;
`siblings` is marked `notInSource` and she stays a name in the pages.

## Two death years, both kept

307-p6 reports year 12 at Buzakhah; 308-p1 corrects it: والصحيح أن مقتله كان
في سنة إحدى عشرة. Both are authored as competing `deathYearHijri` claims; the
year-12 one is marked `disputed` and carries the correction inside its own
assertion, so a reader landing on it sees why it lost. The catalog takes 11,
the entry's own correction. His age at the Prophet's death (44, 307-p5) has no
model field and stays in the pages.

## Legacy values visited

- **sex** (MALE): left on the legacy marker. The entry never states it
  outright.
- **fullName**: promoted to `ukkashah-ibn-mihsan-siyar60/full-name`.
- **title companion**: promoted from من السابقين الأولين البدريين.
- **Badr participation** (`battles/badr.ts`): already cited by the approved
  sira claim `ukkashah/badr`; this entry's Badr account
  (`ukkashah-ibn-mihsan-siyar60/badr`) now cites it alongside, the way the
  sira's sword report and this entry's بلاء حسنا account agree.

## New catalog fields from this entry

kunya, tribalAffiliation (الأسدي، حليف قريش), appearance, virtues, deathYearHijri
(11), placeOfDeathArabic (بزاخة) — every one stated outright and cited.
`fullName` and the companion title were promoted off the legacy marker.

Field values are undiacritized, the convention the rest of `data/catalog/people/`
follows; the source's own spelling, diacritics and all, stays in the account
pages and in each citation's `excerptArabic`.

## Citations and what they quote

Every excerpt is a literal substring of the paragraph its anchor names, which
`scripts/history/verifyExcerpts.ts` checks. Two shapes are worth naming:

- **307-p2** is quoted whole for `virtues` even though the value stops before
  the kunya and nisba. Dropping that middle stretch unmarked would have left a
  gap in the excerpt that reads as continuous text; quoting the whole label run
  costs five words and stays honest.
- **307-p3** carries its own footnote marker `(١)`, which sits mid-sentence in
  the printed text. The excerpt keeps it so the quote is contiguous.

## Claims authored

1. `ukkashah-ibn-mihsan-siyar60/full-name`
2. `ukkashah-ibn-mihsan-siyar60/kunya`
3. `ukkashah-ibn-mihsan-siyar60/tribal-affiliation`
4. `ukkashah-ibn-mihsan-siyar60/appearance`
5. `ukkashah-ibn-mihsan-siyar60/virtues`
6. `ukkashah-ibn-mihsan-siyar60/titles` — صحابي
7. `ukkashah-ibn-mihsan-siyar60/badr` — PARTICIPATED_IN → badr
8. `ukkashah-ibn-mihsan-siyar60/death-place`
9. `ukkashah-ibn-mihsan-siyar60/death-year-twelve`
10. `ukkashah-ibn-mihsan-siyar60/death-year-eleven`

Every claim is `NOT_REVIEWED`, and there is no approval block: this batch
ships unapproved, and marking it reviewed is the user's separate decision.

## Review state

`npm run catalog:validate` goes from no issues on `origin/main` to 10, and
all ten are the "no batch declares claim …" family for this batch's new keys
— the claim is only resolvable against an *approved* batch, and nothing here
is approved.

`npm run catalog:ledger -- --batch <this dir>` reports three values still
awaiting evidence, only one of which is this batch's to resolve:
`people/ukkashah-ibn-mihsan` `fields.sex`, left on the legacy marker as
explained above. The other two are `battles/badr` `fields.location` (where the
battle took place — nothing in this entry speaks to it) and `participants[0]`,
which is Umar ibn al-Khattab.
