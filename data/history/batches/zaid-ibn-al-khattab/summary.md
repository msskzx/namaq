# Summary — زَيْدُ بنُ الخَطَّابِ بنِ نُفَيْلِ بنِ عَبْدِ العُزَّى بنِ رِيَاحٍ العَدَوِيُّ

Entry 57 of *سير أعلام النبلاء*. Printed pages 297–299 (Shamela pages
1723–1725), volume 4. The heading sits at the foot of 297, so Sa'd ibn
Mu'adh's tail was cut with `--start-anchor p11` and his footnotes with
`--notes-start-marker '(*) طبقات ابن سعد'`. Page 298 is wholly Zaid's.
Page 299 carries two paragraphs of his tail (the rest of the Yamama
martyrs list and the Musaylimah-killer note) before entry 58 opens, cut
with `--end-anchor p2`. Its footnotes needed the opposite care from the
usual: the (١) staff-miracle takhrij belongs to Zaid's own 299-p1 marker
(`عَبَّادُ بنُ بِشْرٍ الأَشْهَلِيُّ الَّذِي أَضَاءتْ لَهُ عَصَاهُ (١)`), so it
stays, and only As'ad's `(*) المسند لأحمد` bibliography is cut
(`--notes-end-marker '(*) المسند لأحمد'`). A first pass cut at
`أخرجه البخاري (٣٠٨٥)` and left a bare `(١)` fragment; re-running with the
bibliography marker keeps exactly Zaid's note.

## What the entry states

Seventeen paragraphs, read in the order `docs/extraction-checklist.md`
gives.

- **Nasab** — `زَيْدُ بنُ الخَطَّابِ بنِ نُفَيْلِ بنِ عَبْدِ العُزَّى بنِ
  رِيَاحٍ العَدَوِيُّ` (297-p11). Recorded as `fields.fullName` and as the
  `SON` edge to `al-khattab-ibn-nufayl`.
- **Kunya** — `أَبُو عَبْدِ الرَّحْمَنِ` (298-p1), on `fields.kunya`.
- **Appearance** — `وَكَانَ أَسْمَرَ، طَوِيْلاً جِدّاً` (298-p3), on
  `fields.appearance`.
- **Manaqeb** — four things, all on `fields.virtues`:
  - Older than Umar and Muslim before him (298-p2).
  - The Badr armour exchange: Umar offers his coat of mail, Zaid answers
    he wants of martyrdom what Umar wants, and both go without it
    (298-p4–p6, one claim with three citations — the closing
    `فَتَرَكَاهَا جَمِيْعاً` opens the next paragraph, on the same printed
    page).
  - The Muslim banner at Yamama: he kept advancing with it into the
    enemy's ranks, fought till killed, and Salim mawla Abi Hudhayfah took
    it up (298-p6).
  - Umar's grief: `أَسْلَمَ قَبْلِي، وَاسْتُشْهِدَ قَبْلِي` and `مَا
    هَبَّتِ الصَّبَا إِلاَّ وَأَنَا أَجِدُ رِيْحَ زَيْدٍ` (298-p7–p8, one
    claim with two citations).
- **Wives** — none, and no `تزوج`/`امرأة`/`زوج` anywhere on the three
  pages (checked diacritic-insensitive). `notInSource`. The entry names a
  son, Abd al-Rahman ibn Zaid (298-p10), but no wife and no catalog person
  for the son, so no edge is authored.
- **Brothers and sisters** — `أَخُو أَمِيْرِ المُؤْمِنِيْنَ عُمَرَ`
  (298-p1), with the shared father from the nasab and no mother stated
  anywhere, so `HALF_BROTHER` to `umar-ibn-al-khattab` per the checklist's
  shared-father rule (the abu-jandal precedent). The `أَخُو عَاصِمٍ` on
  299-p1 is Ma'n ibn Adi's brother, not Zaid's.
- **Source text detail** — `printedPage` 297/298/299, `volumeNumber` 4,
  `extractionUrl` per page and `accessedAt` 2026-09-29 on the account and
  on all eighteen citations.

Also recorded: Badr participation (`شَهِدَ بَدْراً وَالمَشَاهِدَ`, 298-p3,
carried into `data/catalog/battles/badr.ts` with that wording as summary
and no status, since the page says nothing about what became of him at
Badr); the Mu'akhah tie (`آخَى النَّبِيُّ … بَيْنَهُ وَبَيْنَ مَعْنِ بنِ
عَدِيٍّ`, 298-p3) as `PACT_BROTHER` to `maan-ibn-adi`; death in Rabi' I
of year 12 (`deathYearHijri` 12, 298-p11) among the martyrs of Yamama
(`placeOfDeathArabic` اليمامة, 298-p12); `sex` MALE on the masculine
verbs at 298-p6; and the `companion` title on `شَهِدَ بَدْراً
وَالمَشَاهِدَ` — anyone the entry classes among the men of Badr is a
Companion.

## Legacy values visited

The catalog entry was carried from the retired graph seeds with three
values on `legacy-unreviewed`. All three are now answered, plus the
module gains what the page states beyond them.

| Legacy value | Outcome |
|---|---|
| `fullName` = `زيد بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي` | **Shortened, and the shortening is worth a look.** The page states the chain only as far as `بن رياح العدوي`, so that is what the field now holds, cited. The seed's deeper run — `بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي` — matches what Umar's own module still carries uncited for himself, but this page does not by itself support those five generations on Zaid, so they are not carried on his authority. |
| `sex` = `MALE` | Promoted to a cited claim, on the masculine verbs `قَاتَلَ … قُتِلَ` at 298-p6. |
| `titles` = `companion` / `صحابي` | Promoted to a cited claim, on `شَهِدَ بَدْراً وَالمَشَاهِدَ` at 298-p3. |
| `relations[0]` = `SON` → `al-khattab-ibn-nufayl` | Promoted to a cited claim, on the nasab at 297-p11. |

## What the entry mentions that gets no claim

- Ibn Umar transmitting from him the ruling on killing house-snakes
  (298-p9, with the edition's long takhrij in the 298 notes file):
  transmission chains stay in the source text.
- His son Abd al-Rahman transmitting two hadiths (298-p10): named but
  with no catalog person to point an edge at.
- The Yamama martyrs roll (298-p13–299-p1: Abu Hudhayfah, Salim, Abu
  Mirthad Kannaz and the rest): mere mentions, no edges.
- `وَيُقَالُ: إِنَّ أَبَا دُجَانَةَ هُوَ الَّذِي قَتَلَ يَوْمَئِذٍ
  مُسَيْلِمَةَ` (299-p2): about Abu Dujanah, weakened by the entry
  itself (`يقال`), and his own batch's matter, not this one's.

## Contradictions with other extractions

None. This is the first batch to speak for `zaid-ibn-al-khattab`. The
`HALF_BROTHER` edge to Umar and the `PACT_BROTHER` edge to Ma'n are
declared from this side only; neither target module carries the
reciprocal yet, which `catalog:project-graph` writes from the inverse.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/zaid-ibn-al-khattab`
is the check to re-run before approval; at authoring time the batch's own
subject carries no `legacy-unreviewed` value anymore.

`npm run catalog:validate` gains the "no batch declares claim …" family
for the fifteen new claims that every unapproved batch in this run
produces — each is resolvable only against an *approved* batch, and
nothing here is approved.

## Review state

Every claim is `NOT_REVIEWED`, and there is no approval block: this batch
ships unapproved, and marking it reviewed is the user's separate decision.
