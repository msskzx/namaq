# Batch: Ikrimah ibn Abi Jahl, Siyar entry 66

Al-Dhahabi's own entry on عِكْرِمَةُ بنُ أَبِي جَهْلٍ, read against
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [v4/323.md](../../../sources/siyar-alam-al-nubala-risalah/v4/323.md),
  [v4/324.md](../../../sources/siyar-alam-al-nubala-risalah/v4/324.md)

## Source account

Entry 66 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (*سير أعلام النبلاء ج١*), edited by حسين الأسد under شعيب الأرناؤوط.
Shamela 1749–1750, printed 323–324.

The entry is short — two printed pages. Printed 323 carries one paragraph of
entry 65's close (`323-p1`) above entry 66's opening; printed 324 is a boundary
page, with entry 66's end above entry 67's
opening. The store page for printed 324 held entry 67's half only, carried
over from that batch's own account pages when the store was built; this
batch completes it to the whole printed page, entry 66's end first. That
shifts entry 67's opening from `4/324-p1`/`-p2` to `4/324-p10`/`-p11`, so
the three citations in `abdullah-ibn-amr-ibn-haram` that sit on this page
moved to match, with their excerpts unchanged. Its recorded approval
therefore no longer covers its files, and `history:validate` says so until
it is approved again.

Volume 4 is declared on the account, so the reader files the entry under
the book's own contents rather than under "entries with no assigned volume".

## Scope call: Companion

The entry settles the question itself: المخزومي المكي, son of Abu Jahl, who
embraced Islam ("أسلم، وحسن إسلامه بالمرة") and was martyred fighting the
Romans. Taken in as a Companion, no contest recorded.

## What the entry supports

Five claims across two pages.

**Nasab.** The heading and the chain that follows it: "٦٦ - عكرمة بن أبي جهل
عمرو بن هشام المخزومي" (`323-p2`) and "ابن المغيرة بن عبد الله بن عمر بن
مخزوم بن يقظة بن مرة بن كعب بن لؤي." (`323-p3`). The chain is carried as
plain text, not as graph nodes — the Banu Makhzum lineage already models the
generations around his father, and everything below لؤي بن كعب stays in
`fullName`, matching that depth.

**Kunya.** "أبو عثمان" (`323-p4`), the kunya by which the entry names him.

**Father.** "عكرمة بن أبي جهل" (`323-p2`) carries the legacy `SON →
abu-jahl-ibn-hisham` edge to a cited claim.

**Virtues.** "الشريف، الرئيس، الشهيد" (`323-p3`); his Islam, "أسلم، وحسن
إسلامه بالمرة" (`323-p5`); his standing, "كان محمود البلاء في الإسلام"
(`324-p7`); and his martyrdom, "نزل عكرمة يوم اليرموك، فقاتل قتالا شديدا،
ثم استشهد" (`324-p8`) against the competing report "قتل يوم أجنادين"
(`324-p9`). The two death reports are kept in one virtues claim rather than
as competing `deathYearHijri` claims: the entry names the battles, not the
years, and the year is read off the front of that field, so a battle name
would leave it blank.

**Companion.** "صحابي؛ أسلم، وحسن إسلامه بالمرة" (`323-p5`), with the
Prophet's welcome of him as a مهاجر, "مرحبا بالراكب المهاجر" (`324-p4`),
as a second citation. The entry never says the word صحابي, but it describes
his Islam and the Prophet's welcome of him, which is what the title asserts.

## Confirming absence

**Appearance — confirmed absent.** طويل، أسمر، شديد، أدم and the other
physical-description patterns return no match across both pages, body or
notes. Marked `notInSource`.

**Wives — confirmed absent.** زوج، امرأة، تزوج and نكح return no match
across both pages, and no wife is named. Marked `notInSource`.

**Siblings — confirmed absent.** أخو، أخت، إخوة، إخوان and شقيق return no
match in the author's text. The entry names his father and his father's
clan but never a brother or sister. Marked `notInSource`.

## Legacy values visited

Run before this batch promoted anything, `npm run catalog:ledger -- --batch`
reported `people/ikrimah-ibn-abi-jahl` owing evidence on four values. All
four were checked against the entry:

- **`sex: MALE`.** Left on the legacy marker, and the one value this subject
  still owes. The entry uses masculine grammar throughout and names him
  أبو عثمان, but never states his sex as a fact.
- **`fullName`.** Promoted to the claim above. The promoted value is longer
  than the legacy value, which stopped at مخزوم and appended the nisba
  القرشي المخزومي; the source's own chain is carried instead. Not a
  contradiction — the legacy string is an abbreviation of the same chain.
- **`titles: [companion]`.** Promoted to the claim above.
- **`relations[0]` (`SON → abu-jahl-ibn-hisham`).** Promoted to the claim
  above.

The ledger also pulls in subjects this batch's claims point at, and none of
them are this batch's to settle:

- `people/abu-jahl-ibn-hisham` — no batch has read him, so all three of his
  owed values (`fields.sex`, and his `SON → hisham-ibn-al-mughirah` and
  `BROTHER → umm-harmalah-al-makhzumiyyah` edges) stand on the legacy marker.
  They are owed by whichever batch first reads his own entry, not by this one:
  the edge pointing at him is cited here, but nothing in this entry states his
  sex, his father, or his brother.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block, so its claims are not yet usable by `catalog:validate`.
Both gates stay closed on purpose: review needs someone to compare the batch
against its pages, and approval records a revision someone has chosen to
publish.
