# Batch: Abdullah ibn Amr ibn Haram, Siyar entry 67

Al-Dhahabi's own entry on عَبْدِ اللهِ بنِ عَمْرِو بنِ حَرَامٍ, read against
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdullah-ibn-amr-ibn-haram/](accounts/abdullah-ibn-amr-ibn-haram/)

## Source account

Entry 67 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (*سير أعلام النبلاء ج١*), edited by حسين الأسد under شعيب الأرناؤوط.
Shamela 1750–1753, printed 324–327.

The first page is shared with a neighbour, and the cut is by the extractor's
own bounds:

- Printed 324 (Shamela 1750) also carries entry 66 (عكرمة بن أبي جهل) above
  entry 67. `--start-anchor p10` drops that text, and `--notes-start-marker
  '(*)'` drops entry 66's footnotes from the shared notes block. The marker is
  the `(*)` the footnote block uses for entry 66's source list.

The last page (printed 327, Shamela 1753) ends with entry 67; entry 68 (يزيد
بن أبي سفيان) starts on the next printed page, and this page's notes block
holds only entry 67's footnotes. No `--end-anchor` or `--notes-end-marker` was
needed, and none was invented.

Volume 4 is declared on the account, so the reader files the entry under the
book's own contents rather than under "entries with no assigned volume".

## Scope call: Companion

The entry settles the question itself: الأنصاري السلمي, one of the nuqaba of
Aqaba, present at Badr, killed at Uhud. Taken in as a Companion, no contest
recorded.

## What the entry supports

Eight claims across four pages.

**Nasab.** The heading and the chain that follows it: "٦٧ - عبد الله بن عمرو بن
حرام بن ثعلبة الأنصاري *" (`324-p10`), "ابن حرام بن كعب بن غنم بن كعب بن
سلمة بن سعد بن علي بن" (`324-p11`), and "أسد بن ساردة بن تزيد (١) بن جشم بن
الخزرج الأنصاري، السلمي، أبو جابر." (`325-p1`). The chain crosses two
paragraph boundaries, so the claim carries one citation per paragraph.

The chain is carried as plain text, not as graph nodes. The Banu Sulaym
lineage already models the generations around his father — `amr-ibn-haram`,
`haram-ibn-thalabah` — and everything below جشم بن الخزرج stays in `fullName`,
matching that depth.

**Kunya.** "أبو جابر" (`325-p1`), the kunya by which the entry names him.

**Father.** "عبد الله بن عمرو بن حرام" (`324-p10`) carries the legacy `SON →
amr-ibn-haram` edge to a cited claim.

**Child.** "أبو جابر" (`325-p1`) gives the `FATHER → jabir-ibn-abdullah`
edge, which is what completes the pair: Jabir's module already declares the
`SON` side.

**Appearance.** "وكان أحمر، أصلع، ليس بالطويل" (`326-p6`), in Ibn Sa'd's
report of the burial. A stated physical fact, not an inference.
`fields.appearance` is a free-text field with no narrower slot for it.

**Virtues.** One of the nuqaba of Aqaba, "أحد النقباء ليلة العقبة" (`325-p2`);
the angels shading him, "ما زالت الملائكة تظلله بأجنحته حتى رفعتموه"
(`325-p5`); the Prophet's witness, "زملوهم بجراحهم، فأنا شهيد عليهم"
(`326-p3`); God speaking to him face to face, "ألا أخبرك أن الله كلمك كفاحاً"
(`327-p10`); and his wish to be killed a second time, "أسألك أن ترددني إلى
الدنيا، فأقتل فيك ثانياً" (`327-p12`).

**Badr.** "شهد بدراً" (`325-p2`), a `PARTICIPATED_IN` participation. The
battle's roster had no row for him; this batch adds one.

**Uhud.** "استشهد يوم أحد" (`325-p2`), a `PARTICIPATED_IN` participation with
`MARTYRED` status. `battles/uhud.ts` already held a legacy row for him; this
batch adds its claim key to that row's citations rather than adding a second
row.

## Confirming absence

**Wives — confirmed absent.** زوج, امرأة, تزوج and نكح return no match across
all four pages, body or notes, and no wife is named. The entry names his
mother ("أمي", `325-p7`) and his daughters ("بناتي", `327-p2`) but never a
wife. Marked `notInSource`.

**Siblings — confirmed absent.** أخو, أخت, إخوة, إخوان and شقيق return no match
in the author's text. The one أخت-adjacent term is خالي (`325-p7`), his
maternal uncle, not a brother. Marked `notInSource`.

## Legacy values visited

`npm run catalog:ledger -- --batch` for this batch reports
`people/abdullah-ibn-amr-ibn-haram` owing evidence on four values. All four
were checked against the entry:

- **`sex: MALE`.** Left on the legacy marker. The entry uses masculine
  grammar throughout and calls him أبو جابر, but never states his sex as a
  fact, and the neighbouring batches in this run left theirs the same way.
- **`titles: [companion]`.** Left on the legacy marker. He is الأنصاري
  السلمي, one of the nuqaba of Aqaba, present at Badr and killed at Uhud — a
  Companion on any reading. The entry never says the word, so the title stands
  as carried rather than as cited.
- **`fullName`.** Promoted to the claim above. The promoted value is longer
  than the legacy value, which stopped at سلمة and reordered the tail into
  الأنصاري الخزرجي السلمي; the source's own chain and nisba are carried
  instead. Not a contradiction between two readings of the book — the legacy
  string is an abbreviation of the same chain, and nothing is lost but the
  redundancy.
- **`relations[0]` (`SON → amr-ibn-haram`).** Promoted to the claim above.

The ledger also pulls in subjects this batch's claims point at, and none of
them are this batch's to settle:

- `people/amr-ibn-haram` — `sex` and his legacy `SON → haram-ibn-thalabah`
  edge are his own batch's work. This entry's chain does state عمرو بن حرام,
  but the edge's target is already cited here from the same chain.
- `people/jabir-ibn-abdullah` — `sex`, `fullName`, the `companion` title and
  his own `SON` edge are his batch's work. The reciprocal `FATHER` side is
  authored here; the `SON` side is cited there.
- `battles/badr` and `battles/uhud` — the battles' own fields are the battles'
  work. This batch only adds a participant row and a claim key.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block, so its claims are not yet usable by `catalog:validate` and
appear in that run's "no batch declares claim" output alongside the other
unapproved batches in the tree. Both gates stay closed on purpose: review
needs someone to compare the batch against its pages, and approval records a
revision someone has chosen to publish.
