# Batch: ثابت بن قيس, Siyar entry 61

Al-Dhahabi's own entry on ثابت بن قيس بن شماس, the orator of the Ansar who
died at Yamaama. It follows the [data pipelines
document](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/thabit-ibn-qais/](accounts/thabit-ibn-qais/)
- Catalog entry: `data/catalog/people/thabit-ibn-qais.ts`
- New catalog entry: `data/catalog/people/jamilah-bint-abd-allah-ibn-abi.ts`
  (graph-only, from the wife the entry names)

## Source account

Entry 61 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb
al-Arnaut. Seven page files, printed 308–314 (Shamela 1734–1740).

The slice starts at `308-p7` — entry 60 (عكاشة بن محصن) holds `308-p1`–`308-p6`
— and ends at `314-p1`, whose second paragraph opens the group heading
شُهَدَاءُ أَجْنَادِيْنَ وَاليَرْمُوْكِ. Anchor counts match paragraph counts on
every page (2, 17, 10, 13, 10, 13, 1), and the pages were re-fetched from
Shamela and compared paragraph by paragraph against the stored text.

Two pages carry no notes file. Printed 308's footnote block is entirely entry
60's — the `(١)` note on Ukaysah's Badr sword and the `(*)` bibliography — and
printed 314's is entirely the أجنادين section's. Entry 61 has no `(*)`
bibliography of its own anywhere in Shamela's footnotes for 1734–1740 (a raw
grep finds exactly one `(*)`, Ukaysah's), so nothing of his is lost by
dropping both blocks. Printed 309's block opens with the tail of Ukaysah's
bibliography (`= الإسلام: ١ / ٣٧١ ... خلاصة تذهيب الكمال: ٥٧`, continuing
page 308's `تاريخ =`); that head is cut and `002.notes.md` starts at the `(١)`
note on `قَالُوا: رَضِيْنَا`, which is this entry's own.

## What this entry supports

Fourteen claims, all `NOT_REVIEWED`: eleven on the subject, one on his wife,
and two on battle participations that the entry's attendance sentence carries.

- `full-name` — the whole chain the heading opens with, `ثَابِتُ بنُ قَيْسِ بنِ
  شَمَّاسِ بنِ زُهَيْرِ بنِ مَالِكٍ` (`308-p7`) through `كَعْبِ بنِ الخَزْرَجِ بنِ
  الحَارِثِ بنِ الخَزْرَجِ` (`309-p1`). The chain runs contiguously across the
  308/309 page turn, so it is one citation with a page range and no ellipsis.
- `father` — SON to `qais-ibn-shammas`, from the entry's own patronymic
  (`308-p7`).
- `kunya` — `أَبُو مُحَمَّدٍ، وَقِيْلَ: أَبُو عَبْدِ الرَّحْمَنِ` (`309-p2`). Both
  forms ride one claim; the catalog value keeps the source's `وقيل`.
- `tribal-affiliation` — الأنصاري from the heading's nisba (`308-p7`) and
  الخزرجي from where the chain closes (`309-p1`), two separate selections
  because the labels sit at opposite ends of the heading.
- `titles` — صحابي, on `كَانَ مِنْ نُجَبَاءِ أَصْحَابِ مُحَمَّدٍ` (`309-p3`).
- `virtues` — nine citations over `309-p3`, `309-p10`, `309-p12`, `310-p2`,
  `310-p4`, `312-p4`, `312-p6`, `313-p2` and `311-p9`: orator of the Ansar;
  `وَكَانَ جَهِيْرَ الصَّوْتِ، خَطِيْباً بَلِيْغاً`; the khutbah on arriving at
  Medina and the Prophet's `قَالَ: (الجَنَّةُ)`; `أَمَا تَرْضَى أَنْ تَعِيْشَ
  حَمِيْداً`; the لا ترفعوا أصواتكم verse, his `فَأَنَا مِنْ أَهْلِ النَّارِ`, and
  `بَلْ هُوَ مِنْ أَهْلِ الجَنَّةِ`; `نِعْمَ الرَّجُلُ ثَابِتُ بنُ قَيْسِ بنِ
  شَمَّاسٍ`; answering Tamim's orator and `سُرَّ ... بِمَقَامِهِ`; al-Hakim on his
  place with the Ansar at Yamaama; and `فَقَاتَلَ حَتَّى قُتِلَ`.
- `wife-jamilah` — HUSBAND to `jamilah-bint-abd-allah-ibn-abi`, on `وَكَانَ زَوْجَ
  جَمِيْلَةَ بِنْتِ عَبْدِ اللهِ بنِ أُبَيِّ ابْنِ سَلُوْلٍ، فَوَلَدَتْ لَهُ مُحَمَّداً`
  (`309-p7`).
- `half-brother-abdullah` — HALF_BROTHER to `abdullah-ibn-rawahah`, from
  `وَإِخْوَتُهُ لأُمِّهِ` (`309-p6`). Uterine siblings share the mother only, so
  HALF, not BROTHER.
- `badr-absence` — ABSENT_FROM badr, `uhud` and `hudaybiyyah` — all three from
  the one sentence `وَلَمْ يَشْهَدْ بَدْراً، شَهِدَ أُحُداً، وَبَيْعَةَ الرُّضْوَانِ`
  (`309-p3`), one claim per value the model holds.
- `death-place` — `اليمامة` (`310-p8`), the day Yamaama, the speech to the
  Ansar, and `وَقُتِلَ` in one selection with the speech's middle elided.
- `jamilah-bint-abd-allah-ibn-abi-siyar61/full-name` and `/sex` — her name and
  her being a بنت, both from `309-p7`, so the node this batch mints has two
  cited values rather than one carried marker.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — the heading's chain, printed 308–309 |
| Nasab (father edge) | Found — قيس بن شماس, a catalog person |
| Kunya | Found — أبو محمد، وقيل أبو عبد الرحمن |
| Manaqeb | Found — nine selections, `virtues` |
| Appearance | Confirmed absent — a diacritic-insensitive grep for طويل/أسمر/القصير/أدمة/أفطس/أبيض/آدم/لحية across all seven pages and all five notes files returns nothing. `جَهِيْرَ الصَّوْتِ` is a voice, not a body |
| Wives | Found — Jamilah, and a node minted for her |
| Siblings | Found — uterine brother عبد الله بن رواحة |

## The wife, and why she needed a node

`catalog:checklist` reported ⚠️ on wives before this batch, and the honest
answers were author it or lie about it. Marking `notInSource` would say the
entry is silent, and it is not: `309-p7` names her, and `312-p8`–`312-p10`
brings her again with the خلع (`أَتَرُدِّيْنَ عَلَيْهِ حَدِيْقَتَهُ؟` /
`فَاخْتَلَعَتْ مِنْهُ`). So the edge is authored, which needs a target, and no
module existed for her.

`jamilah-bint-abd-allah-ibn-abi` is therefore new, `hasProfile: false` — the
entry gives a name, a father, a marriage and one incident, nothing that fills
a profile page. This is the same call the al-Hala ibn al-Hadrami batch made
for its father (`abdullah-ibn-imad-al-hadrami`), and the wider precedent of a
batch minting the graph-only node its own claim needs.

Her name is contested, and the contest stays in the source. The editor's
footnote (٤) on printed 312 reports Ibn Abd al-Barr recording the Basrans on
جَميلة بنت أبي and the Medinans on حبيبة بنت سهل, and Ibn Hajar reading the two
as two separate women and therefore two separate خلع incidents, each with a
sound chain in its book. Al-Dhahabi's text says جَميلة once and the module
follows the text; the competing name is not a second value the model holds, so
it is not a second claim, and the footnote stays where the editor put it.

## The sibling the entry names, and why only one edge is declared

`وَإِخْوَتُهُ لأُمِّهِ: عَبْدُ اللهِ بنُ رَوَاحَةَ، وَعَمْرَةُ بِنْتُ رَوَاحَةَ` is one
sentence naming a brother and a sister. عبد الله بن رواحة has a module;
عمرة بنت رواحة does not, and minting a second node for a woman this entry
names once would be the same judgement the wife above makes — except the
checklist's `siblings` item is already settled by the brother, so the
asymmetry has a reason rather than an oversight. She stays in the page.

`عَبْدُ اللهِ بنُ رَوَاحَة`'s own module is left untouched: the projector writes
the reciprocal, and his own entry (entry 37, already batched) is where the
evidence for his own values belongs.

## Legacy values visited

`npm run catalog:ledger -- --batch data/history/batches/thabit-ibn-qais`
before this batch's claims listed four legacy values on the subject. All four
are resolved, none left legacy:

- **`sex` MALE** — stays on the legacy marker. The entry never states his sex
  as a fact; nothing here promotes it.
- **`fullName`** — promoted. The legacy chain stopped at `بن ثعلبة` with the
  nisba labels attached; the entry continues `بن كعب بن الخزرج بن الحارث بن
  الخزرج`, so the chain is the new value and الأنصاري/الخزرجي moved to
  `tribalAffiliation`, matching how the neighbouring batches split a heading.
- **`companion` title** — promoted, on `من نجباء أصحاب محمد`.
- **`SON` to `qais-ibn-shammas`** — promoted to the new `father` claim.

Two further values arrived with the wife's node, both cited from the same
sentence rather than left as new debt on a node this batch created.

The ledger also reaches subjects this batch's claims point at. Their own
modules are left alone, since the evidence for a person's own values belongs
to the batch that reads their own entry:

- `people/qais-ibn-shammas` `fields.sex` and `relations[0]` — pointed at by
  `father`, not read.
- `people/abdullah-ibn-rawahah` `fields.sex` and `titles[0]` — pointed at by
  `half-brother-abdullah`, not read.
- `battles/badr` `fields.location` and `participants[0]`, `battles/uhud`
  `fields.location` and `participants[0..2]`, `battles/hudaybiyyah`
  `participants[0, 2, 3, 10]` — the battles' own pre-existing legacy values,
  reached because the participation claims name the battles. This entry says
  nothing about where Badr or Uhud were and names none of those rosters'
  participants.

## Battle registration

- `badr.ts` gains him as `ABSENT_FROM` with no status. The source remarks on
  the absence, which is what admits it, and gives no reason, so
  `ABSENT_EXCUSED` would invent one.
- `uhud.ts` gains him as `PARTICIPATED_IN`, with nothing more than the
  attendance the source states — the entry says nothing about what became of
  him there, and he is not among those it names as killed at Uhud.
- `hudaybiyyah.ts` gains him as `PARTICIPATED_IN` with the source's own
  wording, `شَهِدَ بَيْعَةَ الرُّضْوَانِ`, the same shape Nawfal ibn al-Harith's
  pledge attendance established there.
- Yamama has no battle module, and الجمل is a different fight, so the killing
  stays in `virtues` and `placeOfDeathArabic` rather than becoming a
  participation. The entry states no death year.

## Not modelled

- The muakhah report (`قَالَ ابْنُ إِسْحَاقَ: قِيْلَ: آخَى رَسُوْلُ اللهِ بَيْنَهُ
  وَبَيْنَ عَمَّارٍ`, `309-p8`) is contradicted in the entry's own next sentence
  (`وَقِيْلَ: بَلِ المُؤَاخَاةُ بَيْنَ عَمَّارٍ وَحُذَيْفَةَ`, `309-p9`), so no
  `PACT_BROTHER` edge is declared on a `قيل` the source itself withdraws. Both
  sentences stay in the page. (`nawfal-ibn-al-harith` did declare a
  `PACT_BROTHER` on an uncontradicted `وقيل`; this one has the counter-report
  beside it, which is the difference.)
- The mother: `وَأُمُّهُ: هِنْدٌ الطَّائِيَّةُ`, then `وَقِيْلَ: بَلْ كَبْشَةُ بِنْتُ
  وَاقِدِ بنِ الإِطْنَابَةِ` (`309-p4`–`309-p5`). Two names for one mother and no
  module for either, so no `MOTHER` edge. The report stays in the page; it is
  also the reason the half-sibling claim exists at all, since the brother is
  named as a sibling on the mother's side.
- The son the wife bore him, `فَوَلَدَتْ لَهُ مُحَمَّداً` (`309-p7`), named again
  among the three killed at al-Harrah (`وَقَدْ قُتِلَ مُحَمَّدٌ، وَيَحْيَى،
  وَعَبْدُ اللهِ، بَنُو ثَابِتِ بنِ قَيْسٍ يَوْم الحَرَّةِ`, `313-p10`): no module,
  no edge.
- The daughter who narrates the verse story at `313-p5` (`فَأَتَيْتُ ابْنَةَ ثَابِتِ
  بنِ قَيْسٍ`), and the other Thabit — `بَنِي ثَابِتِ بنِ قَيْسِ بنِ الخَطِيْمِ
  الأَوْسِيِّ الظَّفَرِيِّ` (`313-p11`), whose line عدي بن ثابت belongs to
  (`314-p1`) — are not this subject and get nothing. A narrator is not a node.
- The entry's last line, `وَأَبُوْهُ مِنْ فُحُوْلِ شُعَرَاءِ الأَوْسِ، مَاتَ قَبْلَ
  فَشُوِّ الإِسْلاَمِ` (`313-p13`), reads at first as a fresh subject's heading
  and is not: the sentence after it names the Kufan narrator as
  `عَدِيُّ بنُ أَبَانَ بنِ ثَابِتِ بنِ قَيْسِ بنِ الخَطِيْمِ`, a different Thabit
  altogether, and the clause belongs to him. Nothing about the poet is carried
  across.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block: approving for publication and marking claims reviewed are the
user's separate decisions, and neither has been taken.
