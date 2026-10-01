# Batch: Yazid ibn Abi Sufyan, Siyar entry 68

Al-Dhahabi's entry on يَزِيْدُ بنُ أَبِي سُفْيَانَ, read against
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [v4/328.md](../../../sources/siyar-alam-al-nubala-risalah/v4/328.md),
  [v4/329.md](../../../sources/siyar-alam-al-nubala-risalah/v4/329.md),
  [v4/330.md](../../../sources/siyar-alam-al-nubala-risalah/v4/330.md)

## Scope

Companion, no contest. The entry is a Mudayyan-era death-cohort entry sitting in
the book's first tabaqa, between عبد الله بن عمرو بن حرام (entry 67) and أبو العاص
بن الربيع (entry 69), all three inside the run
[docs/data-pipelines.md](../../data-pipelines.md#companion-scope) marks in scope.
He accepted Islam at Fath Makkah and is titled صحابي by the catalog already.

This batch replaces the empty `batch.json` an abandoned worktree left behind at
`.claude/worktrees/yazid-ibn-abi-sufyan`, which held no transcribed pages at all.
There was nothing there to resume, so the entry was read from Shamela directly.

## Source account

Entry 68 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume 4
(*سير أعلام النبلاء ج١*), edited by حسين الأسد under شعيب الأرناؤوط. Shamela
1754-1756, printed 328-330.

**Volume check.** Shamela reports `ج1` for all three pages, and Shamela's `الجزء`
does not count the two sira volumes and the caliph volume bound before them, so
`الجزء ١` is this edition's volume 4 (*سير أعلام النبلاء ج١*, printed 5-558).
Printed 328-330 all fall inside it, so the account declares `volumeNumber: 4`.

Printed 328 is a boundary page: entry 67's tail runs to `328-p5`, and entry 68's
heading opens at `328-p6`. The entry itself runs to printed 330, ending at
`330-p9`; entry 69 opens at `330-p10`.

**Page 330 was completed here.** The store copy held entry 69's head only, carried
over from that batch's own account pages when the page store was built, and entry
68's tail was missing from the corpus entirely. It is now the whole printed page,
entry 68's end first. That moves entry 69's opening from `4/330-p1` to `4/330-p10`,
so the two `abu-al-as-ibn-ar-rabia` citations on that paragraph move with their
excerpts unchanged. Its nasab citation already sat at `4/330-p11`, which is where
it still belongs. That batch carries no approval, so nothing else about it changes.

## What the entry supports

Ten claims over three printed pages.

**Nasab.** The heading, "يَزِيْدُ بنُ أَبِي سُفْيَانَ بنِ حَرْبِ بنِ أُمَيَّةَ الأُمَوِيُّ"
(`328-p6`), and the chain that follows, "ابن عبد شمس بن عبد مناف بن قصي الأموي"
(`328-p7`). The chain is carried as plain text, not as graph nodes, matching the
truncation depth the Banu Umayyah lineage already uses. `fullName` also carries
the `SON → abu-sufyan-ibn-harb` edge.

**Tribal affiliation.** الأموي, stated twice (`328-p6`, `328-p7`).

**Half-brother.** "أخو معاوية من أبيه" (`329-p1`) becomes
`HALF_BROTHER → muawiyah-ibn-abi-sufyan`. The source says *من أبيه* — on their
father's side — which is exactly the "source is clear they share only the father"
case in the extraction checklist, and what distinguishes it from the full-sibling
relations the checklist wants confirmed by an explicit shared mother.

**Companion title.** "أسلم يوم الفتح، وحسن إسلامه" (`329-p3`).

**Virtues.** The epithet "يقال له: يزيد الخير" (`329-p1`); "كان من العقلاء الألباء،
والشجعان المذكورين" (`329-p3`); the gift of Hunayn's spoils, "مائة من الإبل،
وأربعين أوقية فضة" (`329-p4`); his place among the four commanders Abu Bakr sent
against the Romans (`329-p5`); "وعلى يده كان فتح قيسارية" (`329-p9`); "كان يزيد
بن أبي سفيان على ربع" at Yarmouk (`330-p6`); and the جارية incident, from the
seizure (`329-p12`) through Abu Dharr's appeal (`329-p13`) to the return
(`330-p4`).

**Mother and sister.** "وأمه: هي زينب بنت نوفل الكنانية، وهو أخو أم المؤمنين
أم حبيبة" (`329-p2`) is carried as a virtues claim rather than as relations. His
mother is named, but there is no `zaynab-bint-nawfal` in the catalog, so a `MOTHER`
edge would have nothing to point at. The sister is not declared either: this entry
states his mother and calls Umm Habibah his sister without saying whether they
share one, so neither a confirmed full sibling nor a stated half-sibling follows
from it. Whoever reads Umm Habibah's own entry settles that edge; guessing from
outside this entry would be inventing a citation.

**Battle participations.** Hunayn (`329-p3`, "شهد حنيناً") and Yarmouk (`330-p6`,
"كان … على ربع … يعني يوم اليرموك"). Both `isMuslim: true` — he accepted Islam at
Fath Makkah, before either. No status is recorded: the entry says he commanded a
quarter and that there was no commander over them, not that he was wounded or
killed, and he in fact outlived Yarmouk.

**Death year.** "توفي يزيد في الطاعون، سنة ثماني عشرة" (`330-p7`), with `330-p8`
("ومات هذه السنة في الطاعون") as a second citation on the same reading rather than
a competing report.

## What the entry does not support, and why

**Kunya — confirmed absent.** No `أبو فلان` form for him appears anywhere on the
three pages. The entry gives "يقال له: يزيد الخير" (`329-p1`), which is an epithet,
not a kunya, and the catalog has no field for one, so it is carried in `virtues`.
Marked `notInSource`.

**Appearance — confirmed absent.** طويل، أسمر، شديد الأدمة، كبير اللحية and the
other physical-description patterns return no match across all three pages, body or
notes. Marked `notInSource`.

**Wives — confirmed absent.** زوج، زوجته، امرأة، تزوج and نكح return no match
across all three pages, and no wife is named. The جارية of `329-p12` is a
captured slave, not a marriage. Marked `notInSource`.

**Siblings — partly surfaced.** One sibling relation is declared, from the
half-brother line above. The sister line is carried as virtues and left for the
batch that reads Umm Habibah. Nothing else on the three pages names a brother or
sister.

**Not claimed, having nowhere to land.** "وعلى يده كان فتح قيسارية" (`329-p9`) and
"ولما فتحت دمشق أمره عمر عليها" (`329-p5`) name events the catalog has no battle or event for,
and the four-commanders sentence names no campaign the catalog holds. AGENTS.md is
that these stay in the source text: a claim must back a value the model holds
today. The same goes for the transmission line "حدث عنه: أبو عبد الله الأشعري،
وجنادة بن أبي أمية" (`329-p7`) — a narrator does not become a node or an edge.

## Legacy values visited

`npm run catalog:ledger -- --batch` reported four values owed on this subject
before anything was promoted. All four were checked against the entry:

- **`sex: MALE`.** Left on the legacy marker. The entry uses masculine grammar
  throughout, but never states his sex as a fact.
- **`fullName`.** Promoted to the claim above. The legacy value read
  "يزيد بن أبي سفيان صخر بن حرب بن أمية بن عبد شمس بن عبد مناف القرشي الأموي";
  the source's chain has no صخر between أبي سفيان and حرب, no القرشي, and adds
  بن قصي. Not a contradiction — the legacy string carries a generation and a
  nisba the source does not, and drops one the source gives.
- **`titles: [companion]`.** Promoted to the claim above.
- **`relations[0]` (`SON → abu-sufyan-ibn-harb`).** Promoted to the claim above.

The ledger also pulls in the subjects this batch's claims point at:

- `people/abu-sufyan-ibn-harb` — already carries `SON → harb-ibn-umayyah` from his
  own entry's work. The FATHER edge above Yazid's grandfather is Abu Sufyan's to
  declare, not this batch's.
- `people/muawiyah-ibn-abi-sufyan` — his side of the new half-brother edge. His own
  values are owed by whichever batch reads his entry; nothing in this entry states
  them.
- `battles/hunayn` and `battles/yarmuk` — each still owes its `engagement`,
  `hijriYear` and `location`, plus other participants whose evidence is owed. This
  batch adds Yazid's participation to both and cites it; it states nothing about
  when or where either battle was fought.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block, so its claims are not yet usable by `catalog:validate`. Both gates
stay closed on purpose: review needs someone to compare the batch against its
pages, and approval records a revision someone has chosen to publish.
