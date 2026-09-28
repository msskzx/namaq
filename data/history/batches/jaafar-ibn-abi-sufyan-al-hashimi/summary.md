# Batch: Jaafar ibn Abi Sufyan al-Hashimi, Siyar entry 33

This batch reads جعفر بن أبي سفيان (islamweb companion index id 38,
`idfrom=41`) from al-Dhahabi's Siyar, entry 33, the entry immediately after
his father أبو سفيان بن الحارث (entry 32). It follows
[docs/data-pipelines.md](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages:
  [accounts/jaafar-ibn-abi-sufyan-al-hashimi/](accounts/jaafar-ibn-abi-sufyan-al-hashimi/)

## Scope call

Companion, in scope. The entry states صُحْبَةٌ outright (`205-p15`), and the
subject sits inside the الطبقة الأولى الصحابة run, well before either
كبار التابعين passage. No contest over his صحبة appears in the entry.

## Source account

Entry 33 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4. The whole entry fits on one printed page: it opens at `205-p13`
with the heading "٣٣ - وَلِـ: جَعْفَرِ بنِ أَبِي سُفْيَانَ *" (Shamela 1631)
and closes at `205-p17` ("قَالَهُ: ابْنُ سَعْدٍ"). Entry 34 (Jaafar ibn Abi
Talib) opens on the next Shamela page, so no end trimming was needed. The
page's footnote block is shared with entry 32, so extraction used
`--start-anchor p13` and `--notes-start-marker "(*)"`, keeping only the
entry's own bibliography line.

Shamela's reading page fetched normally with a browser User-Agent; no
ajax fallback was needed.

## What this entry supports

Two claims, both ESTABLISHED, from five paragraphs.

The `وَلِـ` heading attaches this entry to the Abu Sufyan of entry 32 (Abu
Sufyan ibn al-Harith), and the text confirms it: "وَثَبَتَ مَعَهُ هُوَ
وَأَبُوْهُ يَوْمَ حُنَيْنٍ" ("he stood firm with him, he and his father, on
the day of Hunayn", `205-p15`). That backs the `SON` relation to the
existing catalog subject `abu-sufyan-ibn-al-harith`
(`jaafar-ibn-abi-sufyan-al-hashimi-siyar33/father`), promoted from the
legacy marker on the catalog file.

The same line places him at Hunayn, a modeled battle:
`jaafar-ibn-abi-sufyan-al-hashimi-siyar33/hunayn` (`PARTICIPATED_IN` →
`hunayn`). No outcome status applies — the entry reports steadfastness, not
a wound, death, or capture — so the claim carries no status. The
participant-side registration on `data/catalog/battles/hunayn.ts` is left
for the follow-up noted below; this batch does not touch that file.

"وَعَاشَ إِلَى وَسْطِ خِلاَفَةِ مُعَاوِيَةَ" (lived till mid-Muawiya's
caliphate, `205-p16`) is not a year the model can hold, so it stays in the
source pages unclaimed rather than invented as a `deathYearHijri`.

## What the entry does not carry into the model

The entry's single deed — the stand at Hunayn — is modeled once, as the
participation above. No separate `virtues` claim repeats it, so `manaqeb`
is marked `notInSource` with this reason. Kunya, appearance, wives, and
siblings are genuinely absent after a full read of all five paragraphs
(trigger words أخو/أخت/شقيق, تزوج/امرأة/زوج, and physical-description
phrases appear nowhere; the only أبو in the text is أَبُوْهُ, "his
father", not a kunya). No sibling tie is claimed: the entry names only his
father.

## Legacy values visited

`npm run catalog:ledger -- --batch` listed four: `fields.sex`,
`fields.fullName`, `titles[0]` (companion), `relations[0]` (SON).

- `relations[0]`: promoted to the cited `siyar33/father` claim.
- `fields.fullName`: left on the marker. The entry states only the
  two-link patronymic "جعفر بن أبي سفيان"; the carried extension
  (المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي) has no support
  here, and replacing it with the short form would lose information.
- `fields.sex`: left on the marker, per Siyar-batch convention (masculine
  agreement alone does not make a formal claim).
- `titles[0]`: left on the marker, per Siyar-batch convention — no Siyar
  batch claims titles; the entry's صُحْبَةٌ is recorded in the scope call
  above.

## Review

Nothing is reviewed. Both claims are Not reviewed, and the batch carries no
approval block.
