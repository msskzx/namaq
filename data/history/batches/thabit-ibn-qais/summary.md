# ثابت بن قيس بن شماس

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي، تحقيق حسين الأسد
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 308–314
- **Shamela pages**: 1734–1740
- **Entry**: 61

## Source account

Seven page files. The entry opens mid-page on printed 308 (`٦١ - ثَابِتُ بنُ
قَيْسِ...` is the seventh paragraph of Shamela 1734) and closes mid-page on
printed 314 (`ذُرِّيَتِهِ: عَدِيُّ بنُ ثَابِتٍ...` is the first paragraph of
Shamela 1740; the second opens the group heading شُهَدَاءُ أَجْنَادِيْنَ
وَاليَرْمُوْكِ). The slice runs `--start-anchor p7` to `--end-anchor p1`, giving
anchors `308-p7`–`308-p8`, all of 309–313, and `314-p1`. Anchor counts were
checked against paragraph counts per page (2, 17, 10, 13, 10, 13, 1).

Three note trims, all at entry boundaries where the extractor's own
`--notes-start-marker`/`--notes-end-marker` cannot reach (they trim the first
and last page only, and only from a marker onward):

- Printed 308's footnote block is entirely entry 60's (عكاشة): the `(١)` note
  on his Badr sword and the `(*)` bibliography. No `(*)` bibliography for entry
  61 exists anywhere in Shamela's footnotes for pages 1734–1740 (a raw-HTML grep
  finds exactly one `(*)`, عكاشة's). The `001.notes.md` file was deleted and
  the page carries no `notesFile`.
- Printed 309's block opens with the tail of عكاشة's bibliography (`= الإسلام:
  ١ / ٣٧١ ... خلاصة تذهيب الكمال: ٥٧`, continuing page 308's `تاريخ =`). That
  head was cut; the file starts at `(١) أخرجه الحاكم ٣ / ٢٣٤ من طريق وهب بن
  بقية...`, which annotates this entry's `قَالُوا: رَضِيْنَا (١)`.
- Printed 314's block is entirely the أجنادين section's (the `(١)` note on
  وَقْعَةُ أَجْنَادِيْنَ). The `007.notes.md` file was deleted and the page
  carries no `notesFile`.

## What the entry supports

Eleven claims, all `NOT_REVIEWED`.

- `thabit-ibn-qais-siyar61/full-name` — the chain the entry opens with,
  `ثَابِتُ بنُ قَيْسِ بنِ شَمَّاسِ بنِ زُهَيْرِ بنِ مَالِكٍ` (`308-p7`), its
  continuation `ابْنِ امْرِئِ القَيْسِ بنِ مَالِكٍ الأَغَرِّ بنِ ثَعْلَبَةَ بنِ`
  (`308-p8`), and its end `كَعْبِ بنِ الخَزْرَجِ بنِ الحَارِثِ بنِ الخَزْرَجِ`
  (`309-p1`).
- `thabit-ibn-qais-siyar61/father` — SON → `qais-ibn-shammas`, from the
  entry's own patronymic (`308-p7`).
- `thabit-ibn-qais-siyar61/kunya` — `أَبُو مُحَمَّدٍ، وَقِيْلَ: أَبُو عَبْدِ
  الرَّحْمَنِ` (`309-p2`). Both forms share one claim; the catalog value keeps
  the source's `وقيل`, the way Hamzah's module keeps both of his.
- `thabit-ibn-qais-siyar61/tribal-affiliation` — `الأنصاري، الخزرجي`
  (`308-p7`, `309-p1`).
- `thabit-ibn-qais-siyar61/titles` — صحابي, on `مِنْ نُجَبَاءِ أَصْحَابِ
  مُحَمَّدٍ` (`309-p3`).
- `thabit-ibn-qais-siyar61/virtues` — خطيب الأنصار, جهير الصوت, the arrival
  khutbah (`نَمْنَعُكَ... فَمَا لَنَا؟ قَالَ: الجَنَّةُ`), `أَمَا تَرْضَى أَنْ
  تَعِيْشَ حَمِيْداً، وَتُقْتَلَ شَهِيْداً، وَتَدْخُلَ الجَنَّةَ`, `بَلْ هُوَ مِنْ
  أَهْلِ الجَنَّةِ` after the لا ترفعوا أصواتكم verse, `نِعْمَ الرَّجُلُ ثَابِتُ
  بنُ قَيْسِ بنِ شَمَّاسٍ`, answering Tamim's orator, commanding the Ansar at
  Yamama (الحاكم), and fighting till killed.
- `thabit-ibn-qais-siyar61/half-brother-abdullah` — HALF_BROTHER →
  `abdullah-ibn-rawahah`, from `وَإِخْوَتُهُ لأُمِّهِ` (`309-p6`). Uterine
  siblings share the mother only, so HALF, not BROTHER — the mirror of the
  Aban ibn Said call, where sharing the father only also meant HALF.
- `thabit-ibn-qais-siyar61/badr-absence` — ABSENT_FROM badr, on `وَلَمْ
  يَشْهَدْ بَدْراً` (`309-p3`). No reason is given, so no status.
- `thabit-ibn-qais-siyar61/uhud` — PARTICIPATED_IN uhud, on `شَهِدَ أُحُداً`
  (`309-p3`).
- `thabit-ibn-qais-siyar61/hudaybiyyah` — PARTICIPATED_IN hudaybiyyah, on
  `شَهِدَ بَيْعَةَ الرُّضْوَانِ` (`309-p3`), the same shape as Nawfal ibn
  al-Harith's pledge attendance in `hudaybiyyah.ts`.
- `thabit-ibn-qais-siyar61/death-place` — `اليمامة` (`311-p1`, `311-p9`),
  the way Saad ibn Khaythamah's batch records بدر.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — heading plus chain, printed 308–309 |
| Nasab (father edge) | Found — قيس بن شماس, a catalog person |
| Kunya | Found — أبو محمد، وقيل أبو عبد الرحمن |
| Manaqeb | Found — orator of the Ansar, the two Paradises sayings, نعم الرجل, Yamama |
| Appearance | Confirmed absent — a diacritic-insensitive grep for طويل/أسمر/القصير/الأدمة/أفطس/أبيض/آدم/لحية hits nothing; `جَهِيْرَ الصَّوْتِ` is a voice, not a body |
| Wives | Named by the source, not modellable — see below |
| Siblings | Found — uterine brother عبد الله بن رواحة; his sister عمرة is named but has no catalog person — see below |

## The wife the entry names, and why no edge is declared

`وَكَانَ زَوْجَ جَمِيْلَةَ بِنْتِ عَبْدِ اللهِ بنِ أُبَيِّ ابْنِ سَلُوْلٍ،
فَوَلَدَتْ لَهُ مُحَمَّداً` (`309-p7`) names a wife outright, so `wives` is not
marked `notInSource` — that would say the source is silent, and it isn't. No
catalog person exists for Jamilah, and minting a node for her is separate work,
so no edge is authored and `catalog:checklist` keeps one ⚠️ on wives for this
subject. The same call was made for Saad ibn Khaythamah's named-but-unmodellable
sibling (`data/history/batches/saad-ibn-khaythamah/summary.md`). The khul'
(`فَاخْتَلَعَتْ مِنْهُ`, `312-p8`–`312-p10`) and the editor's جميلة-vs-حبيبة
discussion in footnote `(٤)` stay in the account pages; with no spouse node
there is nowhere in the model for the incident to hang.

## The sibling the entry names, and why only one edge is declared

`عَمْرَةُ بِنْتُ رَوَاحَةَ` shares the same entry sentence but has no catalog
person, so only the HALF_BROTHER edge to عبد الله بن رواحة is authored. His
module is left untouched — the projector writes the reciprocal from this
side's declaration.

## Legacy values visited

`data/catalog/people/thabit-ibn-qais.ts` carried four legacy values.

- **`sex` MALE** — stays on the legacy marker. The entry never states his sex
  outright; nothing here promotes it.
- **`fullName`** — promoted. The legacy chain stopped at `بن ثعلبة` plus the
  nisba labels; the entry continues `بن كعب بن الخزرج بن الحارث بن الخزرج`, so
  the full chain is the new `fullName` and الأنصاري/الخزرجي moved to
  `tribalAffiliation`, matching how the neighbouring batches split the header.
- **`companion` title** — promoted, on من نجباء أصحاب محمد.
- **`SON` → `qais-ibn-shammas`** — promoted to the new father claim. His
  module is left untouched; whatever evidence his own entry owes is his own
  batch's work.

## Battle registration

- `data/catalog/battles/badr.ts` gains him as `ABSENT_FROM` with no status —
  the source remarks on the absence (which is what admits it, per AGENTS.md)
  and gives no reason, and `ABSENT_EXCUSED` would invent one.
- `data/catalog/battles/uhud.ts` gains him as `PARTICIPATED_IN` with no
  summary beyond the attendance the source states.
- `data/catalog/battles/hudaybiyyah.ts` gains him as `PARTICIPATED_IN` with
  the source's own wording of what he did there, `شَهِدَ بَيْعَةَ
  الرِّضْوَانِ`. Attendance and outcome stay split (ADR 0013).
- Yamama has no battle module, so the martyrdom lives in `virtues` and
  `placeOfDeathArabic`, not in a participation. The entry states no death year.

## Not modelled

- The مؤاخاة report (`قَالَ ابْنُ إِسْحَاقَ: قِيْلَ: آخَى... بَيْنَهُ وَبَيْنَ
  عَمَّارٍ`, `309-p8`) arrives with its own counter-report in the next breath
  (`وَقِيْلَ: بَلِ المُؤَاخَاةُ بَيْنَ عَمَّارٍ وَحُذَيْفَةَ`, `309-p9`). No
  `PACT_BROTHER` edge is declared on a قيل the entry itself disputes — the
  same restraint Saad's batch showed, leaving his pact report in
  `virtues` text too. Both sentences stay in the account page.
- The sons killed at al-Harrah (`وَقَدْ قُتِلَ مُحَمَّدٌ، وَيَحْيَى، وَعَبْدُ
  اللهِ، بَنُو ثَابِتِ بنِ قَيْسٍ يَوْم الحَرَّةِ`, `313-p10`), the daughter who
  narrates (`فَأَتَيْتُ ابْنَةَ ثَابِتِ بنِ قَيْسٍ`, `313-p5`), and the other
  Thabit — `بَنِي ثَابِتِ بنِ قَيْسِ بنِ الخَطِيْمِ الأَوْسِيِّ الظَّفَرِيِّ`
  (`313-p11`), whose line عدي بن ثابت belongs to (`314-p1`), not this
  subject's. None has a catalog person; none is edged.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/thabit-ibn-qais`
lists fifteen values still awaiting evidence, one of them on this subject and
the rest on subjects this batch's claims point at.

- `people/thabit-ibn-qais` `fields.sex` — left `legacy-unreviewed`, as above.
- `people/qais-ibn-shammas` `fields.sex` and `relations[0]` — his module is
  left untouched by this batch. Nothing contradicts it; both values are owed
  a claim from a batch that reads his own entry.
- `people/abdullah-ibn-rawahah` `fields.sex` and `titles[0]` — same: pointed
  at, not read.
- `battles/badr` `fields.location` and `participants[0]`, `battles/uhud`
  `fields.location` and `participants[0..2]`, `battles/hudaybiyyah`
  `participants[0, 2, 3, 10]` — the battles' own pre-existing legacy values,
  reached because this batch's participation claims name the battles. This
  entry says nothing about where Badr or Uhud were and names none of the
  rosters' remaining participants, so none is visited here.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block: approving for publication and marking claims reviewed are the
user's separate decisions.
