# Re-extract Arwa and Asma from Shamela

Status: **not started**.

Two batches hold text read from islamweb. Shamela is the only digital host this
project extracts from (`AGENTS.md`, "Content sources"), because it carries the
editor's footnotes and its printed pages are the ones every citation records.
Both subjects have entries in the مؤسسة الرسالة edition, so islamweb was never
needed for either.

This replaces their page text, their printed page numbers and every citation
excerpt. It is extraction work under
[docs/extraction-checklist.md](../extraction-checklist.md), not a relabel — an
earlier attempt to fix it by renaming the source was reverted, because renaming
records the anomaly rather than removing it.

## Where the entries are

| Subject | Entry | Shamela | Namaq volume | Printed page | Page id |
| --- | --- | --- | --- | --- | --- |
| `arwa-bint-abd-al-muttalib` | ٤٢ أَرْوَى عَمَّةُ رَسُوْلِ اللهِ | الجزء ٢ ص٢٧٢ | 5 | 272 | 2252 |
| `asma-bint-al-numan-al-kindiyyah` | ٣٢ أَسْمَاءُ بِنْتُ كَعْبٍ الجَوْنِيَّةُ | الجزء ٢ ص٢٥٥ | 5 | 255 | 2235 |

Shamela's `الجزء` labels the Siyar's own parts and does not count the two sira
volumes and the caliph volume bound before them, so its `الجزء ٢` is this
edition's volume 5.

Both entries are one printed page each, and both share their page:

- **Page 272** also opens entry ٤٣ عَاتِكَةُ بِنْتُ عَبْدِ المُطَّلِبِ, another
  of the Prophet's aunts, which has no batch. Extracting Arwa puts the first
  half of that page in the store; Atika's half arrives when someone takes her.
- **Page 255** closes entry ٣١ العَالِيَة and opens entry ٣٣ أُمُّ شَرِيْكٍ,
  which already has a batch. So the store's `v5/255.md` currently holds Umm
  Shareek's portion only, and Asma's portion is missing from it.

## Agreed behavior and scope

### Arwa

The current batch records islamweb's page 272, and the Risalah entry is also on
page 272. **Treat that as a coincidence to verify, not a shortcut.** Her three
claims — two marriages (`WIFE` to عمير بن وهب and to أرطاة) and islam/hijrah
under `virtues` — read as Risalah wording already, so the likely outcome is that
the excerpts survive and gain the editor's footnotes islamweb drops. Confirm
each excerpt against the Shamela page rather than assuming.

Her account records `notInSource` of `fullName`, `kunya`, `appearance` and
`siblings`. Every one has to be rechecked against the Risalah entry, since a
"not in source" assertion is about the entry actually read.

### Asma

Harder, and the identity is the reason. The Risalah entry opens
`قِيْلَ: هِيَ أَسْمَاءُ بِنْتُ كَعْبٍ الجَوْنِيَّةُ` and names كعب as her
father, while the islamweb text the batch holds says
`أسماء بنت النعمان الجونية` and makes النعمان بن أبي الجون الكندي her father.
The Risalah entry also reports `أَسْمَاءَ بِنْتَ النُّعْمَانِ الغِفَارِيَّةَ` as
an alternative identification on Qatada's authority.

So al-Dhahabi himself records competing identifications, and the model holds the
value they compete over — `fullName`. Record them as separate attributed claims
with the disagreement visible, rather than choosing one
([ADR 0008](../adr/0008-separate-review-from-visibility.md); `AGENTS.md`,
"Competing accounts"). The subject slug `asma-bint-al-numan-al-kindiyyah` and
the account's `titleArabic` of `الكندية` both come from the islamweb entry's
heading and should be reconsidered against the Risalah heading; **changing a
subject slug is a catalog change, not an extraction change, and needs its own
decision.**

Her three claims are `fullName`, `appearance` (`أجمل أيم في العرب`) and a `WIFE`
relation to المهاجر بن أبي أمية after the separation. Each needs its excerpt
re-quoted from the Risalah page, or dropping if that page does not support it —
the entry is one page where the islamweb version ran to three, so some of it may
not survive.

### Out of scope

- Entry ٤٣ عاتكة بنت عبد المطلب, which merely shares Arwa's page.
- Any change to the subject slug or to catalog records. Flag, do not act.
- Filling other coverage gaps in volume 5.

## Acceptance criteria

1. No account in `data/history/batches/` names `siyar-alam-al-nubala-islamweb`,
   and no page or citation carries an `islamweb.net` URL.
2. The `siyar-alam-al-nubala-islamweb` source is removed from the manifest and
   from every batch that declared it, and `grep -ri islamweb data/` returns only
   the Risalah source note that warns the two editions must not be merged.
3. Both entries exist in the page store as Risalah pages: `v5/272.md` holding
   Arwa's portion and `v5/255.md` holding Asma's portion joined with Umm
   Shareek's, each with the editor's footnotes in the matching `.notes.md`.
4. Every citation excerpt on both subjects is a literal substring of its Risalah
   page, checked with `scripts/history/verifyExcerpts.ts`.
5. Where the Risalah entry reports competing identifications of Asma, the
   `fullName` value carries one attributed claim per reading rather than a
   single chosen value.
6. `notInSource` on both accounts states what the *Risalah* entry omits.
7. `npm run history:validate` passes on both batches, and
   `npm run catalog:checklist -- <slug>` runs clean for each.
8. `npm run catalog:ledger -- --batch <dir>` is run and its output considered
   before publication is requested.

## Consequences

- **Both batches change wholly**, so any recorded publication approval no longer
  covers them and must be given again. Neither is published today.
- **The page store gains two Risalah pages and loses two islamweb ones.** If
  this lands after [source-page-store.md](source-page-store.md), the pages are
  edited in the store directly; if before, in the batch directories.
- **Volume 5's read extent grows** to include page 272, which is currently its
  last read page by way of Safiyyah's entry ending at 271.
- Nothing outside PostgreSQL is affected; no catalog or graph projection reads
  page text.

## Open issues

### Blockers

None. Both entries are located and reachable.

### Nonblocking

- **Is Asma's subject one person or two?** `أسماء بنت كعب الجونية`,
  `أسماء بنت النعمان الجونية` and `أسماء بنت النعمان الغفارية` may be one woman
  with a contested nasab, which is how al-Dhahabi presents it, or the catalog's
  subject may not be the Risalah's entry at all. Resolve before writing claims;
  if they are one subject, the slug's `al-kindiyyah` is unsupported by the
  Risalah heading.
- **Arwa's islamweb text may already be the Risalah text**, given the page
  number matches and the excerpts are vocalised. If verification confirms it,
  the work is confined to re-pointing the URLs and adding the footnotes.
- **The islamweb source block may be worth keeping in the manifest** as a record
  that this edition is not that one, rather than deleted. Decide when criterion
  2 is implemented.
