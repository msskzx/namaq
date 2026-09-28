# Summary — بِشْرُ بنُ البَرَاءِ بنِ مَعْرُوْرٍ الخَزْرَجِيُّ

Entry 54 of *سير أعلام النبلاء*, section أعيان البدريين. Printed page 269
(Shamela page 1695), volume 4. The entry is one printed page and ends on it —
printed 270 opens entry 55 (saad-ibn-ubadah), so nothing spills over. The
preceding entry 53's last line (`-صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-، وَكَانَ ابْنُهُ:`)
was cut with `--start-anchor p2`.

## What the entry states

Seven paragraphs, all read in the order `docs/extraction-checklist.md` gives.

- **Nasab** — `بِشْرُ بنُ البَرَاءِ بنِ مَعْرُوْرٍ الخَزْرَجِيُّ` (269-p2). Recorded
  as `fields.fullName` and as the `SON` edge to `al-baraa-ibn-marur`, whose
  module already carries the reciprocal `FATHER` edge, so both sides of the
  pair are declared.
- **Kunya** — none. The header gives the nasab and the نسبة `الخَزْرَجِيُّ` and
  no `أبو فلان` form. `notInSource`.
- **Appearance** — none, and no physical-description phrase anywhere on the
  page. `notInSource`.
- **Manaqeb** — three things, all on `fields.virtues`:
  - `مِنْ أَشْرَافِ قَوْمِهِ` (269-p3), al-Dhahabi's own.
  - The Prophet naming him سيّد بني سلمة (269-p7), which al-Dhahabi's own
    footnote (1) on the same page demolishes: البخاري says `ذاهب الحديث`,
    أبو حاتم `متروك الحديث`, النسائي and العقيلي and الساجي `ضعيف`/`ليس بثقة`,
    and ابن عدي `لا يتابع`. The weakness is carried inside the value text and
    in the claim's assertion, so a reader of the profile sees the report and
    its grading together rather than praise on its own.
  - The poisoned sheep at Khaybar (269-p8), told in al-Dhahabi's first person
    and corroborated by the Sahihayn through footnote (2).
- **Wives** — none, and no `تزوج`/`امرأة`/`زوج` anywhere on the page.
  `notInSource`.
- **Brothers and sisters** — none, and no `أخو`/`أخت`/`شقيق` anywhere on the
  page. `notInSource`. The only other person the entry names is الجعد بن قيس,
  named in the hadith as the man the Prophet passed over for البخل, which is
  not a kinship claim.
- **Source text detail** — `printedPage` 269, `volumeNumber` 4,
  `extractionUrl` `https://shamela.ws/book/10906/1695` and `accessedAt`
  2026-09-28 on the account and on all eight citations.

## Legacy values visited

The catalog entry was carried from the retired `prisma/personSeedData6.ts` with
three values on `legacy-unreviewed`. All three are now answered.

| Legacy value | Outcome |
|---|---|
| `fullName` = `بشر بن البراء بن معرور بن صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي` | **Shortened, and the shortening is worth a look.** The page states only `بِشْرُ بنُ البَرَاءِ بنِ مَعْرُوْرٍ الخَزْرَجِيُّ`, so that is what the field now holds, cited. The seed's deeper run — `بن صخر بن خنساء بن سنان الأنصاري السلمي` — is the chain al-Baraa ibn Marur's own page carries for himself, which is where a batch covering entry 53 will cite it. The two agree once that is in; nothing here contradicts anything, but this page does not by itself support the four generations the seed asserted. |
| `sex` = `MALE` | Promoted to a cited claim, on the masculine verbs `أَكَلَ … فَأُصِيْبَ` at 269-p8. |
| `titles` = `companion` / `صحابي` | Promoted to a cited claim, on `وَهُوَ مِنْ كِبَارِ البَدْرِيِّيْنَ` at 269-p8 — anyone the entry classes among the leading men of Badr is a Companion. |

## A tradition the batch was asked for that the page does not carry

The brief for this entry expected the manaqeb to hold the tradition that he
carried the Prophet's banner at Badr and returned it having wounded many. The
page does not say it. Nothing in the seven paragraphs, and nothing in the
editor's notes on the page, mentions a لواء, a راية, or أيّار the standard
tradition names. The claim is therefore **not** recorded, and the omission is
deliberate: the source does not state it, and a claim needs a citation.

What the entry does give as his Badr record is `وَهُوَ مِنْ كِبَارِ البَدْرِيِّيْنَ`
(269-p8), which is what `data/catalog/battles/badr.ts` now carries, with no
status, since the page says nothing about what became of him at Badr. If the
banner tradition is wanted on the profile it needs a source that states it —
plausibly الاستيعاب ١ / ٣١٠ or أسد الغابة ١ / ٢١٨, both of which the page's
own footnote (1) lists, in a later batch from one of those books.

## Contradictions with other extractions

None. This is the first batch to speak for `bishr-ibn-al-baraa`.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/bishr-ibn-al-baraa`
prints six values still awaiting evidence, and none of them is on this batch's
own subject — `people/bishr-ibn-al-baraa` does not appear in the list at all,
so everything this batch is responsible for is cited.

| Awaiting | Whose it is |
|---|---|
| `people/al-baraa-ibn-marur` `fields.fullName`, `titles[0]`, `relations[0]` | His own page's work, for the entry 53 batch. `relations[1]`, the `FATHER` edge to this subject, is the same edge cited from this side at `bishr-ibn-al-baraa-siyar54/father`; his module's own copy stays `legacy-unreviewed` until that batch cites it from his page. |
| `battles/badr` `fields.location`, `participants[0]` | Pre-existing on a shared file and out of scope here. `participants[0]` is Umar, whom no batch in this run has read. |

`npm run catalog:validate` goes from 141 issues on `origin/main` to 150, and
all nine new ones are the "no batch declares claim …" family that every
unapproved batch in this run produces — the claim is only resolvable against
an *approved* batch, and nothing here is approved.

## Review state

Every claim is `NOT_REVIEWED`, and there is no approval block: this batch
ships unapproved, and marking it reviewed is the user's separate decision.
