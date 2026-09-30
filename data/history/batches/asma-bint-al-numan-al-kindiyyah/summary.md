# Batch: Asma bint al-Numan al-Kindiyyah, Siyar "الكندية"

This batch reads الكندية (checklist line 167 of
[docs/companion-extraction-checklist.md](../../../../docs/companion-extraction-checklist.md))
from al-Dhahabi's *Siyar A'lam al-Nubala'*, the wives section (زوجاته صلى الله
عليه وسلم), following
[docs/data-pipelines.md](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages:
  [accounts/asma-bint-al-numan-al-kindiyyah/](accounts/asma-bint-al-numan-al-kindiyyah/)

## Identifying the subject

"الكندية" is a heading, not a personal name — one of several short entries in
the wives section named by tribal nisba rather than by name (see also
الكلابية, العالية, سناء nearby). Reading the entry identifies her outright:
al-Dhahabi names her twice inside the account itself, "أسماء بنت النعمان
الجونية" (`259-p2`) and via her father "النعمان بن أبي الجون الكندي"
(`258-p3`). That matches the existing catalog entry
`data/catalog/people/asma-bint-al-numan-al-kindiyyah.ts`
(`fullName: أسماء بنت النعمان بن أبي الجون الكندي`, already related to
`al-numan-ibn-abi-al-jawn-al-kindi` as `DAUGHTER`), which had stood on the
legacy marker since the graph-seed migration with no batch behind it. This
batch is that batch: no new person is created, and no new checklist slug is
needed beyond the one already tracked.

A separate Siyar heading, plain "أسماء" (checklist line, several lines above
"الكندية"), gives a *different* identification for the Prophet's
Kindite/Ghifari wife — "أسماء بنت كعب الجونية" per Ibn Ishaq, or "أسماء بنت
النعمان الغفارية" per al-Zuhri/Qatadah — and is its own checklist item, not
touched by this batch. This batch does not attempt to reconcile the two
entries; it only reads "الكندية," which names her patronymic consistently
with the catalog's existing slug.

## Extraction host: a scope call

`docs/data-pipelines.md` prefers Shamela (shamela.ws) as the extraction host
because it retains editorial footnotes, and `npm run history:extract` reads
Shamela's own reading-page markup. Shamela's `book/10906` reading-page id for
this specific entry could not be located within the time budgeted for this
extraction (site search returns a client-side form, and web search did not
surface an indexed deep link into this exact entry). Rather than block the
batch, the account was read from **islamweb's** own digitization of the same
Risalah-edition text (`https://www.islamweb.net/ar/library/content/60/169/الكندية`),
which carries the same three-page printed-page markers ([ص:258]/[ص:259]/[ص:260],
جزء 2) as the edition recorded in this batch's source. The wording was
cross-checked word-for-word against Wikisource's independent transcription of
the same Risalah edition
(https://ar.wikisource.org/wiki/سير_أعلام_النبلاء/زوجاته) and the two agree
exactly apart from punctuation, so the text is not in doubt — only the
editor's footnotes (if any exist on these three pages) are unconfirmed, since
neither digitization exposes them separately. `accounts/.../NNN.notes.md`
say so plainly rather than inventing an empty apparatus. A follow-up that
finds the Shamela reading-page id can re-extract with footnotes intact
without changing any claim's substance.

## Source account

Three printed pages (258–260) of volume 2 ("السيرة النبوية ج٢") of the
Risalah third edition, opening at the "الكندية" heading and closing with the
account's last paragraph — no neighbouring entry shares either page, so no
anchor trimming was needed.

## What this entry supports

Three claims.

**Nasab / father edge** (`asma-bint-al-numan-al-kindiyyah-siyar/father`,
`field: fullName`, `relationshipType: DAUGHTER` → `al-numan-ibn-abi-al-jawn-al-kindi`,
ESTABLISHED): the entry states outright that her father, النعمان بن أبي الجون
الكندي, offered her in marriage (`258-p3`), and a second report names her
directly as "أسماء بنت النعمان الجونية" (`259-p2`). Promotes the existing
legacy `fullName` and `relations[0]` on the catalog entry — both keep the
value already carried, now cited instead of legacy.

**Appearance** (`asma-bint-al-numan-al-kindiyyah-siyar/appearance`,
`field: appearance`, LIKELY): her father calls her "أجمل أيم في العرب" ("the
most beautiful unmarried woman in Arabia," `258-p3`) while pitching the
match — a description of her, though said by an interested party rather than
the narrator, hence LIKELY rather than ESTABLISHED. New field on the catalog
entry; nothing legacy is displaced.

**Second marriage** (`asma-bint-al-numan-al-kindiyyah-siyar/husband-al-muhajir`,
`relationshipType: WIFE` → `al-muhajir-ibn-abi-umayyah-al-makhzumi`, DISPUTED):
after the Prophet released her, "خلف على أسماء بنت النعمان المهاجر بن أبي
أمية" (`260-p3`). No catalog entry existed for al-Muhajir ibn Abi Umayyah
al-Makhzumi, so a graph-only stub (`hasProfile: false`, no profile of his
own) was added the same way `khansa-ibn-sinan.ts` restates a relation cited
from the other side, per the precedent in
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md#other-precedent-to-know-about-before-extracting-family-relations).

**Contradiction flagged, not resolved:** the very same account also reports,
on a separate chain from زهير بن معاوية, "فماتت كمدا" — that she died of grief
(`260-p2`), which cannot be true alongside a second marriage. Al-Dhahabi
presents both without adjudicating. The model has no field for "cause/manner
of death" to hold the conflicting value, so only the marriage — a value the
model does hold — is claimed, marked `confidence: DISPUTED` with a
`reviewerNote` pointing at the conflicting report; "ماتت كمدا" itself stays
unclaimed in the source page, per AGENTS.md's rule that a disagreement about
something the model does not record stays in the source pages rather than
forcing a claim.

## What this entry does not carry into the model

No `WIFE`/`HUSBAND` relation to `prophet-muhammad` is claimed. The account is
explicit that the marriage was voided before consummation — "فطلقها ولم يبن
بها" (`259-p1`) — and `prophet-muhammad.ts`'s own wives list already omits
her for exactly that reason; this batch does not disturb that module.

`kunya`, `manaqeb` and `siblings` are marked `notInSource` after a full read:
no `أبو`/`أم` kunya is given for her, no virtue/manaqeb material appears (the
entry is a marriage-and-divorce narrative, not a virtues account), and no
sibling is named anywhere in the three pages.

## Legacy values visited

`npm run catalog:ledger -- --batch asma-bint-al-numan-al-kindiyyah` before
this batch listed three: `fields.sex`, `fields.fullName`, `titles[0]`
(companion), `relations[0]` (DAUGHTER).

- `relations[0]` and `fields.fullName`: promoted together to
  `siyar/father` above.
- `fields.sex`: left on the marker, per Siyar-batch convention — the entry's
  grammar and content are unambiguously about a woman, but nothing in it is a
  formal statement of sex the way the checklist means it.
- `titles[0]` (companion): left on the marker, per Siyar-batch convention —
  no Siyar batch in this repo claims the companion title from an entry's
  content alone; her presence in the wives section is not itself a صحبة
  attestation in the entry's own words.

## Review

Nothing is reviewed. All three claims are Not reviewed, and the batch
carries no approval block — publication approval is a separate step this
task does not take.
