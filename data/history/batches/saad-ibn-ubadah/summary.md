# Summary — سَعْدُ بنُ عُبَادَةَ بنِ دُلَيْمِ بنِ حَارِثَةَ الأَنْصَارِيُّ

Entry 55 of *سير أعلام النبلاء*, section أعيان البدريين. Printed pages
270–279 (Shamela pages 1696–1705), volume 4. The entry opens printed 270
and runs to the top of printed 279; entry 56 (Sa'd ibn Mu'adh) starts
mid-page at 279-p3, so the last page was cut with `--end-anchor p2`.
The first page's note block opened with the tail of entry 54's poisoned-sheep
footnote, cut with `--notes-start-marker '(*) مسند أحمد'`; the last page's
single note block ran ours together with entry 56's `(*)` apparatus note,
cut with `--notes-end-marker 'طبقات ابن سعد: ٣ / ٢ / ٢'`, and the leftover
`(*)` stub the trim left behind was removed by hand from `010.notes.md`.
Nothing else was trimmed: pages 271–278 are wholly this entry's.

## What the entry states

One hundred and seven paragraphs, read in the order
`docs/extraction-checklist.md` gives.

- **Nasab** — `سَعْدُ بنُ عُبَادَةَ بنِ دُلَيْمِ بنِ حَارِثَةَ … ابْنِ أَبِي حَزِيْمَةَ بنِ ثَعْلَبَةَ بنِ طَرِيْفِ بنِ الخَزْرَجِ بنِ سَاعِدَةَ بنِ كَعْبِ بنِ الخَزْرَجِ` (270-p1–p2). Recorded as `fields.fullName` and as the `SON` edge to `ubadah-ibn-dulaym`, whose module carries no reciprocal `FATHER` edge yet — that is entry 56-plus's work, or Ubadah's own batch, not this one's; the edge is cited from this side here. Footnote (1) on printed 270 corrects the print's `حرام` to `أَبِي حَزِيْمَةَ` from Ibn Hisham, أسد الغابة, Ibn Sa'd and القاموس; the field takes the corrected form.
- **Kunya** — `أَبُو قَيْسٍ` (270-p3), on `fields.kunya`. The page also names the sons behind it: `أَوْلاَدُهُ؛ قَيْسٌ، وَسَعِيْدٌ، وَإِسْحَاقُ` (271-p7). Only Qays has a catalog node, so only the `FATHER` edge to `qais-ibn-saad` is declared; Sa'id and Ishaq stay in the pages until someone gives them nodes.
- **Appearance** — none, and no physical-description phrase anywhere in the ten pages (checked diacritic-insensitively for طويل/أسمر/أبيض/أدمة/لحية/جسيم/قصير/أعرج/أصلع). `notInSource`.
- **Manaqeb** — four claims, all on `fields.virtues`: the sayyid/naqib standing with the Saqifah gathering (270-p3; 271-p3; 272-p4; 276-p7)؛ the pre-Badr counsel and the Ansar standard (273-p16–274-p1; 273-p8; 273-p11)؛ the daily jafnah, the eighty of أهل الصفة, and the حمداً ومجداً du'a (271-p4; 276-p4; 276-p6)؛ الكامل — writing, swimming, archery — with the أطم crier (278-p12–279-p1; 279-p2).
- **Wives** — no one named. The Ansar's remark at 275 (`مَا تَزَوَّجَ امْرَأَةً قَطُّ إِلاَّ بِكْراً …`) speaks of his marriages in general and names no wife, so no `HUSBAND`/`WIFE` relation. `notInSource`.
- **Brothers and sisters** — none named, and no أخو/أخت/شقيق anywhere in the ten pages. `notInSource`. The only kin the entry names are his father, his three sons, and his unnamed mother (the نذر report at 271-p12).
- **Source text detail** — `printedPage` per page, `volumeNumber` 4, `extractionUrl` and `accessedAt` 2026-09-29 on the account and on all twenty-two citations.

## Badr: a genuine contest, recorded as absence

Attendance is disputed on the page itself. Ibn Sa'd's narrative (271-p1) has
him preparing to march and urging the Ansar out until he was stung (نُهِشَ)
and stayed behind, with the Prophet's remark conceding the absence while
praising his eagerness (271-p2); `وَقَالَ جَمَاعَةٌ: مَا شَهِدَهَا` (270-p9).
Against that: Abū al-Aswad from Urwah (270-p8) and al-Bukhari in his
تاريخه, followed by Ibn Mandah (271-p5–p6). The catalog takes the majority
narrative — `ABSENT_FROM` with `ABSENT_EXCUSED` on `battles/badr`, the sting
as the excuse — and carries the dissent inside the summary text, attributed,
so a reader of the battle page sees both reports rather than a silent
absence.

## Death: three reports, one field

Yahya ibn Bukayr, Ibn A'isha and others give Hawran, سنة ست عشرة (278-p9),
and al-Waqidi's two-and-a-half years into Umar's caliphate (278-p4) agrees;
the field takes `16 AH` / حَوْرَان. Two dissents are kept as one DISPUTED
claim: Abū Ubayd's سنة أربع عشرة (277-p13) and al-Mada'ini's report that he
died in Abu Bakr's caliphate (278-p11). `وَقِيْلَ: قَبْرُهُ بِالمَنِيْحَةِ`
(271-p10) speaks of the grave, not the death place, and the model has no
burial field, so it stays in the pages.

## Legacy values visited

The catalog entry was carried from the retired graph seeds with three values
on `legacy-unreviewed`. All three are now answered, and the entry gains
four more values the seeds never held.

| Legacy value | Outcome |
|---|---|
| `fullName` = `سعد بن عبادة بن دليم بن حارثة بن أبي حزيمة بن ثعلبة الأنصاري الخزرجي الساعدي` | **Extended.** The page states the chain four generations deeper (بن طريف بن الخزرج بن ساعدة بن كعب بن الخزرج), so the field now holds the full stated chain, cited. No contradiction — the seed's run is a prefix of the page's. |
| `sex` = `MALE` | Promoted to a cited claim, on the masculine forms at 270-p3. |
| `titles` = `companion` / `صحابي` | Promoted to a cited claim, on `أَحَدُ النُّقَبَاءِ لَيْلَةَ العَقَبَةِ` at 272-p4. |
| `SON` → `ubadah-ibn-dulaym` | Promoted to a cited claim, on the nasab at 270-p1. |

New values with no seed behind them: `virtues` (four claims), `deathYearHijri`,
`placeOfDeathArabic`, and `FATHER` → `qais-ibn-saad`.

## Contradictions with other extractions

None. This is the first batch to speak for `saad-ibn-ubadah`. The nasab
extension agrees with the chain `qais-ibn-saad`'s own module already carries
for himself.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/saad-ibn-ubadah`
prints eight values still awaiting evidence, and none of them is on this
batch's own subject or its Badr participation — `people/saad-ibn-ubadah`
does not appear in the list at all, so everything this batch is responsible
for is cited.

| Awaiting | Whose it is |
|---|---|
| `people/qais-ibn-saad` `fields.sex`, `fields.fullName`, `titles[0]`, `relations[0]` | His own page's work, for a later batch. `relations[0]`, the `SON` edge to this subject, is the same edge cited from this side at `saad-ibn-ubadah-siyar55/father-of-qays`; his module's own copy stays `legacy-unreviewed` until that batch cites it from his page. |
| `people/ubadah-ibn-dulaym` `fields.sex`, `relations[0]` | His own page's work likewise. The `FATHER` edge to this subject stays undeclared on his module until then. |
| `battles/badr` `fields.location`, `participants[0]` | Pre-existing on a shared file and out of scope here. `participants[0]` is Umar, whom no batch in this run has read. |

`npm run catalog:validate` reports 14 issues, and all fourteen are the "no
batch declares claim …" family that every unapproved batch in this run
produces — the claim is only resolvable against an *approved* batch, and
nothing here is approved.

## Review state

Every claim is `NOT_REVIEWED`, and there is no approval block: this batch
ships unapproved, and marking it reviewed is the user's separate decision.
