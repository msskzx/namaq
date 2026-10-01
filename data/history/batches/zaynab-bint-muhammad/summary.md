# Batch: Zaynab bint Muhammad — two Siyar entries

Al-Dhahabi's entries on زَيْنَبُ بِنْتُ رَسُوْلِ اللهِ, read against
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: vol. 4 [v4/334.md](../../../sources/siyar-alam-al-nubala-risalah/v4/334.md);
  vol. 5 [v5/246.md](../../../sources/siyar-alam-al-nubala-risalah/v5/246.md),
  [v5/247.md](../../../sources/siyar-alam-al-nubala-risalah/v5/247.md),
  [v5/248.md](../../../sources/siyar-alam-al-nubala-risalah/v5/248.md),
  [v5/249.md](../../../sources/siyar-alam-al-nubala-risalah/v5/249.md)

## Scope

Companion, no contest, and in the book's own in-scope run: vol. 4 printed 334
sits between أبو العاص بن الربيع (entry 69) and أمامة (entry 71), inside the run
`docs/data-pipelines.md#companion-scope` marks in scope. The vol. 5 entry is in
`تابع: الصحابة`, the second of the in-scope runs.

## The Siyar gives her two entries, and the cross-reference points at the wrong one

Printed 334 carries a three-paragraph entry (entry 70). Its footnote (٢) says
al-Dhahabi had folded something from her entry into her husband's entry here,
marked the word زينب with *ستعاد* — "to be repeated" — and given her a detailed
entry separately: "وهي في الجزء الثاني برقم (١٢١)".

Following that note does not land where it says. Volume 5's printed numbering
restarts, and her substantive entry is **entry 28 of the vol. 5 run, printed
246-249** (Shamela 2226-2229), not 121. Verified directly against Shamela rather
than by trusting the cross-reference: printing 121 of vol. 5 lands on فاطمة بنت
رسول الله. So the batch reads both entries and cites each for what only it says.

This entry replaces the `batch.json` an abandoned worktree left at
`.claude/worktrees/zaynab`. Its six "transcribed" pages were not hers at all —
Shamela 1610-1615, printed 184-189, is حمزة بن عبد المطلب and the entries that
follow it, in the volume-4 run near أَحْديَاء. Nothing in that worktree was
salvageable, so her entry was read from Shamela directly.

## Volume check

Shamela reports `ج1` for page 1760 and `ج2` for 2226-2229. Shamela's `الجزء` does
not count the two sira volumes and the caliph volume bound before them, so `ج1` is
this edition's **volume 4** and `ج2` is **volume 5**. Printed 334 is inside
volume 4's extent (5-558); printed 246-249 are inside volume 5's (5-633). Both are
declared per page, and the account opens in volume 4.

**The account crosses a volume**, so it yields two spans, as
`prophet-muhammad` already does — 334 in vol. 4, and 246-249 in vol. 5.

## Page 334 was incomplete in the store

The store copy of `v4/334.md` held printed 334's first six paragraphs — entry
67's tail — and stopped there, because it was carried over from that batch's own
account pages when the page store was built. It is now the whole printed page:
entry 67's tail, then entry 70's three paragraphs. The page only grew at the end,
so no existing anchor moved, and no batch cited `4/334` beforehand. Its notes file
already held every footnote on the page and is unchanged.

`v5/246.md` through `v5/249.md` are new: volume 5's store jumped 245 to 255, so
her entry was not in the corpus at all.

## What the entries support

Six claims across five printed pages in two volumes.

**Nasab and title.** The heading `٥/246-p1` — "٢٨ - زَيْنَبُ بِنْتُ رَسُوْلِ
اللهِ" — with `246-p2` ("وأكبر أخواتها، من المهاجرات السيدات") behind the
`daughter-of-prophet` and `companion` titles and the `DAUGHTER →
prophet-muhammad` edge.

**Husband.** `246-p3`: "تزوجها في حياة أمها: ابن خالتها أبو العاص؛ فولدت له
أمامة". The `HUSBAND → abu-al-as-ibn-al-rabi` edge was already declared and cited
from his own entry; declaring it here as well matches how `fatimah-bint-muhammad`
carries both of hers.

**Virtues.** `246-p2`, `246-p5` (her Islam and hijrah six years before her
husband's), the Badr ransom with Khadijah's زَفار collar and the Prophet's
`246-p7`, her convalescence `247-p4`, the iqar she made for Abu al-As and the
Prophet's `وَإِنَّهُ يُجِيْرُ عَلَى النَّاسِ أَدْنَاهُمْ` at `248-p2`/`248-p3`, براءة
نساء at `248-p5`, and the restoration of the marriage at `249-p2` and `249-p5`.

**Death year 8 AH — from the short entry only.** `4/334-p8`: "وتوفيت سنة ثمان من
الهجرة، وغسلتها أم عطيّة". The substantive vol. 5 entry never gives her death at
all, so a batch reading only vol. 5 would have left this field owed. The
companion gift the same paragraph leads to is a second virtues claim, `4/334-p9`.

## What the entries do not support, and why

**No Badr participation.** `246-p6` opens "فروى عن عائشة بإسناد واه" — al-Dhahabi
marks the report weak in its own line. A battle relation needs the source to
support it, so none is recorded; the ransom narrative rides in virtues instead.

**Nasab chain.** Neither entry gives the chain her profile carries
(بن عبد الله بن عبد المطلب بن هاشم). Both stop at "بنت رسول الله". `fullName`
stays on the legacy marker: promoting the shorter cited form would delete a
correct, useful chain to replace it with less.

**Siblings.** Both entries place her among her sisters — `246-p2` ranks her
"وأكبر أخواتها", `4/334-p8` calls her "أكبر بناته" — but neither names one, so
no `SISTER` edge can be pointed at a known slug. Marked `notInSource` with that
reasoning here rather than left as an unexplained ⚠️.

**Wives.** She married Abu al-As and no other husband is named, so no other wife
is in the source. Marked `notInSource`.

**Kunya.** No `أم فلانة` form in either entry. Marked `notInSource`.

**Appearance.** No physical description in either entry or their notes. Marked
`notInSource`.

**Not claimed, having nowhere to land.** `246-p4` records Ibn Sa'd dating the
marriage before the prophethood and al-Dhahabi rejecting it ("وهذا بعيد");
`247-p1` records "وقيل: هاجرت مع أبيها، ولم يصح" — a competing report he marks
unsound. Neither is a value the model holds over the one it already does, so both
stay in the source pages. `246-p6`'s named ransom-broker and `247-p2`'s
transmission chain are likewise narrator detail, not graph nodes.

## Legacy values visited

`npm run catalog:ledger -- --batch` reported five values owed on this subject.
All five were checked against both entries:

- **`sex: FEMALE`.** Left on the legacy marker. Both entries use feminine
  grammar throughout, but neither states her sex as a fact.
- **`fullName`.** Left on the legacy marker, as above: the chain is the seed's,
  not the source's, and the source states less than the profile does.
- **`virtues`.** Promoted, over two claims. The legacy string ("كبرى بنات النبي،
  هاجرت بعد معاناة، عرفت بوفائها لزوجها") is a paraphrase of what the entries
  say in their own words; not a contradiction.
- **`titles: [companion, daughter-of-prophet]`.** Promoted to one claim covering
  both.
- **`relations[]` was empty.** Nothing was owed here, and that is the gap this
  batch closes: the entries state her father and her husband plainly, and her
  profile carried neither edge even though all three reciprocal edges existed
  already from the other side.

The ledger also pulls in the subjects these claims point at — the Prophet, Abu
al-As, Ummamah — and all three already carry their own cited values, so nothing
else is owed by this batch.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block, so its claims are not yet usable by `catalog:validate`. Both gates
stay closed on purpose: review needs someone to compare the batch against its
pages, and approval records a revision someone has chosen to publish.
