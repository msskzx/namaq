# سعد بن خيثمة

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي، تحقيق حسين الأسد
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed page**: 266
- **Shamela page**: 1692
- **Entry**: 52

## Source account

The whole entry fits one printed page, so the batch has a single page file.
The Shamela reading page holds eleven paragraphs; `p1` is the closing lines of
entry 51 (العلاء بن الحضرمي) and the slice starts at `p2`, so the ten paragraphs
kept are anchored `266-p2` through `266-p11`. Entry 53 (البراء بن معرور) opens
the next printed page (267, Shamela 1693) at its own `p1`, so nothing is cut on
the far side. The page's single footnote block holds only this entry's notes
(the `(*)` bibliography and markers `(١)` and `(٢)`), so no notes trimming was
needed.

Two corrections to what the interrupted run left in `batch.json`:

- `volumeNumber` was unset. The account declares 4 now, so the reader files the
  entry under the book's own volume rather than under "entries with no assigned
  volume" — the gap AGENTS.md records as having shipped on ten batches.
- Every passage anchor carried a `4/` volume prefix (`4/266-p2` …), which no
  other batch in the repo uses. Anchors are now `266-p2` … `266-p11`.

The anchors were checked against the paragraph count rather than renumbered
blind: ten paragraphs, ten anchors, and the numbers run p2–p11 because the
entry begins at the reading page's second paragraph. Nothing is missing.

## What the entry supports

Eight claims, all on this one page.

- `saad-ibn-khaythamah-siyar52/full-name` — the chain the entry opens with,
  `سَعْدُ بنُ خَيْثَمَةَ بنِ الحَارِثِ` (`266-p2`) and its continuation
  `ابْنِ مَالِكِ بنِ كَعْبِ بنِ النَّحَّاطِ … بنِ السَّلْمِ` (`266-p3`).
- `saad-ibn-khaythamah-siyar52/father` — SON → `khaythamah-ibn-al-harith`, from
  the entry's own patronymic and from `وَاسْتُشْهِدَ أَبُوْهُ خَيْثَمَةُ` (`266-p11`).
- `saad-ibn-khaythamah-siyar52/kunya` — `أَبُو عَبْدِ اللهِ` (`266-p3`).
- `saad-ibn-khaythamah-siyar52/tribal-affiliation` — `الأنصاري، الأوسي، البدري`
  (`266-p3`).
- `saad-ibn-khaythamah-siyar52/titles` — صحابي, on `البَدْرِيُّ` (`266-p3`) and
  `وَاسْتُشْهِدَ بِبَدْرٍ` (`266-p11`).
- `saad-ibn-khaythamah-siyar52/virtues` — one of the twelve naqib (`266-p7`),
  the Prophet's pact with Abu Salama ibn Abd al-Asad (`266-p6`), and the Badr
  lots: his father Khaythama offered to stay, and he refused with
  `لَوْ كَانَ غَيْرَ الجَنَّةِ آثَرْتُكَ بِهِ` (`266-p8`–`266-p10`).
- `saad-ibn-khaythamah-siyar52/badr` — PARTICIPATED_IN badr, with the source's
  own wording of what he did (`266-p11`).
- `saad-ibn-khaythamah-siyar52/death-place` — `بدر` (`266-p11`).

## Discrepancy in the source

The entry disputes one link of the chain against Ibn al-Kalbi: `وَكَانَ ابْنُ
الكَلْبِيِّ يُخَالِفُ فِي النَّحَّاطِ، وَيَجْعَلُهُ الحَنَّاطَ بنَ كَعْبٍ`
(`266-p5`). The batch's `fullName` takes the reading al-Dhahabi's own text
carries, النحاط, and nothing is resolved. The rival reading cannot become a
second claim: the model holds one `fullName` string, and `-history:validate`
rejects a claim backing no field or relation. Both readings stay in the account
page, where the source has them.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — heading plus chain, printed 266 |
| Nasab (father edge) | Found — خيثمة بن الحارث, a catalog person |
| Kunya | Found — أبو عبد الله |
| Manaqeb | Found — naqib, the pact, the Badr lots |
| Appearance | Confirmed absent — no physical description; a diacritic-insensitive grep for طويل/أسمر/القصير/الأدمة/أفطس/أبيض hits nothing |
| Wives | Confirmed absent for the model — see below |
| Siblings | Named by the source, not modellable — see below |

## The sibling the entry names, and why no edge is declared

`أَخُو أَبِي ضَيَّاحٍ النُّعْمَانِ بنِ ثَابِتٍ لأُمِّهِ` (`266-p3`) states the
same mother, so this is a confirmed **full** sibling and the edge would be
`BROTHER`, not `HALF_BROTHER` — `docs/extraction-checklist.md` asks for the
mother to be stated explicitly, and لأُمِّهِ does exactly that. No catalog person
exists for أبو ضياح النعمان بن ثابت, and minting a node for a man the entry
names once is separate work, so no edge is authored and no `notInSource` mark is
made. `catalog:checklist` therefore keeps one ⚠️ on siblings for this subject.
The same call was made for Zaid ibn Harithah's brother Jabalah
(`data/history/batches/zaid-ibn-harithah/summary.md`).

## Wives

The entry mentions wives exactly once, and not about him: his father tells him
`آثِرْنِي بِالخُرُوْجِ، وَأَقِمْ مَعَ نِسَائِكَ` (`266-p9`) — an exhortation to stay
home, naming no wife and describing no marriage. A diacritic-insensitive grep
for تزوج/امرأة/زوج/نكح/خطب across the page hits nothing else. There is no
spouse to hold, so `wives` is marked `notInSource`.

## Legacy values visited

`data/catalog/people/saad-ibn-khaythamah.ts` carried four legacy values.

- **`sex` MALE** — stays on the legacy marker. The entry never states his sex
  outright; the rosters that state it for the Badr martyrs are cited in
  `data/catalog/people/badr-martyrs.test.ts`, not here.
- **`fullName`** — promoted. The legacy value stopped at `بن مالك بن كعب` and
  ended with `الأنصاري الأوسي`. The entry's chain continues `بن النحاط بن كعب
  بن حارثة بن غنم بن السلم`, so the full chain is the new `fullName` and the
  nisba labels moved to `tribalAffiliation` (`الأنصاري، الأوسي، البدري`),
  matching how the neighbouring batches split the header. Nothing was dropped:
  البدري is new to the catalog entry and is in the source.
- **`companion` title** — promoted, on البدري and his martyrdom at Badr.
- **`SON` → `khaythamah-ibn-al-harith`** — promoted to the new father claim.
  `khaythamah-ibn-al-harith.ts` is the same man, not a second one: the entry's
  father is named خيثمة بن الحارث, and that module's own `SON` edge to
  `al-harith-ibn-malik` (الحارث بن مالك) agrees with the chain here. The module
  is left untouched — his own Uhud martyrdom
  (`وَاسْتُشْهِدَ أَبُوْهُ خَيْثَمَةُ يَوْمَ أُحُدٍ`) is recorded here as part of this
  claim's assertion, and modelling his participation at Uhud is his own batch's
  work. As the catalog declares a relation from one side and the projector
  writes the reciprocal, the `FATHER` edge reaches the graph from Saad's `SON`.

## Battle registration

`data/catalog/battles/badr.ts` already lists him, from the sira chapter's
fourteen-martyr roster (`saad-khaythamah/badr`). This batch adds the summary in
his entry's own wording — the lots, the going out, the death — and its own
claim key beside the existing one, so the row no longer rests on the roster
alone. Attendance and outcome stay split: `PARTICIPATED_IN` with status
`MARTYRED` (ADR 0013).

## Not modelled

`انْقَرَضَ عَقِبُهُ سَنَةَ مَائتَيْنِ` (`266-p4`) dates the extinction of his
line, not his death, so no `deathYearHijri` is written. Ibn al-Kalbi's rival
reading is above. Both stay in the account page.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/saad-ibn-khaythamah`
lists five values still awaiting evidence, three of them on subjects this
batch's claims point at rather than subjects it read.

- `people/saad-ibn-khaythamah` `fields.sex` — left `legacy-unreviewed`, as
  above.
- `people/khaythamah-ibn-al-harith` `fields.sex` and `relations[0]` — his
  module is left untouched by this batch. Nothing contradicts it: the entry's
  own chain, `سعد بن خيثمة بن الحارث بن مالك`, agrees with its `SON` edge to
  الحارث بن مالك. Both values are owed a claim from a batch that reads
  خيثمة's own entry.
- `battles/badr` `fields.location` and `participants[0]` — the battle's own
  legacy values, reached because this batch's participation claim names the
  battle. This entry says nothing about where Badr was and names none of the
  roster's remaining participants, so neither is visited here.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block: approving for publication and marking claims reviewed are the
user's separate decisions.
