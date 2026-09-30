# Arwa bint Abd al-Muttalib — batch summary

Source: سير أعلام النبلاء, entry 175 on islamweb
(https://www.islamweb.net/ar/library/content/60/175/أروى-عمة-رسول-الله-صلى-الله-عليه-وسلم),
الجزء 2، ص272. One page, one short entry — four sentences, no editorial
footnotes on this reading.

## What the entry says

Her two marriages (Umayr ibn Wahb, then Artah) and the children each bore
her (Tulayb, then Fatimah), her conversion and hijrah, and her son Tulayb's
own conversion in Dar al-Arqam — sourced by al-Dhahabi to Ibn Sa'd. The
entry closes by noting nothing further is known of her and no narration of
hers survives.

## Checklist walkthrough

- **fullName / nasab**: her own entry never states "بنت عبد المطلب" — only
  "عمة رسول الله". `notInSource` on the account. The catalog's existing
  `fullName` and `DAUGHTER` edge stay `legacy-unreviewed`, unchanged.
- **kunya**: not stated. `notInSource`.
- **appearance**: not stated. `notInSource`.
- **manaqeb**: her Islam and hijrah, carried to `fields.virtues`.
- **wives** (husbands, for her): both marriages are stated and carried as
  `WIFE` relations to two new graph-only catalog people, `umayr-ibn-wahb`
  and `artah` (`hasProfile: false` — the entry gives no further nasab for
  either). Her children by them, Tulayb and Fatimah, are named in the source
  text but were **not** given catalog entries of their own — out of scope
  for a single-aunt extraction, same call the extraction checklist makes for
  a full-family sibling reconciliation.
- **siblings**: **not found**, despite this being widely stated elsewhere
  (including the brief given for this extraction) that Arwa is a full
  sister of Hamzah ibn Abd al-Muttalib and Safiyyah bint Abd al-Muttalib.
  This batch read Arwa's own entry (175), and, for the same "banat Abd
  al-Muttalib" grouping, Safiyyah's (174) and Atikah's (176), plus Hamzah's
  fourteen-page entry already in the repo
  (`data/history/batches/hamzah-ibn-abd-al-muttalib-siyar15`). Safiyyah's own
  entry states she is "شقيقة حمزة" (Hamzah's full sister, sharing a Zuhri
  mother) — already reflected as a `BROTHER`/`SISTER` edge on Hamzah's
  catalog module — but none of the four entries name Arwa as a sibling of
  either of them. `notInSource: ["siblings"]` is recorded honestly rather
  than adding an uncited edge to match the outside claim; the catalog's
  `DAUGHTER` relation is the only kinship tie this batch can support for her.

## Scope calls

- Extracted from islamweb directly (the entry text with volume/page
  metadata) rather than through `npm run history:extract`, which only reads
  `shamela.ws`. Islamweb's own volume/page numbering for this women's
  appendix does not line up with the Risalah-edition pagination the sibling
  Hamzah batch reads from `shamela.ws/book/10906` (verified: the shamela page
  printed as "272" in that edition is mid-Sira narrative for year 10 AH, not
  this entry), so the two are recorded as separate sources
  (`siyar-alam-al-nubala-islamweb` vs. `siyar-alam-al-nubala-risalah`) rather
  than merged.
- `umayr-ibn-wahb` and `artah` were added as minimal graph-only catalog
  people (mirroring `khansa-ibn-sinan`'s pattern) purely so the `WIFE`
  relation the source states has somewhere valid to point; neither gets a
  profile page.
