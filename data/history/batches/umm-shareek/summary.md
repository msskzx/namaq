# أم شريك — review summary

## Source

*سير أعلام النبلاء* (al-Dhahabi), Mu'assasat al-Risalah edition, volume 2
(السيرة النبوية ج٢), entry 33 — the "زوجاته صلى الله عليه وسلم" chapter,
printed pages 255–256. Shamela book 10906, pages 2235–2236.

## Scope call: which أم شريك

The name أم شريك is contested across the tradition — sources disagree
whether she was النجارية (Ansariyyah, Banu al-Najjar), العامرية, or
الدوسية (Ghuzayya/Ghuzayla bint Jabir, the Companion who secretly called
Meccan women to Islam and was later tortured for it). That richer,
more-cited story belongs to *Tabaqat Ibn Sa'd* and *Sifat al-Safwah*, not
to al-Dhahabi's *Siyar*: Dhahabi's own entry, checked directly, is the
short النجارية one reproduced here in full — two sentences naming her as
an Ansari woman of Banu al-Najjar, then two hadith reports about the
Prophet's aborted marriage to her. This batch extracts exactly and only
what *Siyar* itself states about the entry titled "أم شريك"; it does not
import the Daws narrative, since that is a different (though possibly
identical) figure sourced from a different book, and AGENTS.md scopes this
pipeline to *Siyar* content per entry. The identity dispute is recorded via
`confidence: "DISPUTED"` on the one claim that reports the marriage/
self-offering episode, not silently resolved.

## What the entry states

- She is an Ansari woman of Banu al-Najjar (`tribalAffiliation`).
- Her kunya, أم شريك, is the entry's own heading.
- Qatada reports the Prophet said he loved to marry among the Ansar but
  disliked their jealousy, and that he did not consummate a marriage with
  her.
- Urwah ibn al-Zubayr reports, from her, that she was among the women who
  offered themselves to the Prophet in marriage — the basis for
  صحابية.

## Checklist items confirmed absent

`fullName`, `nasab`, `appearance`, `wives`, `siblings` — the entry gives no
nasab chain, no personal name beyond the kunya, no physical description,
no confirmed consummated marriage, and no siblings. Recorded as
`notInSource` on the account per `docs/extraction-checklist.md`.

## Seed check

No `prisma/personSeedData*.ts` entry exists for her under any slug, so
there is no legacy value to carry forward or reconcile — the catalog entry
is authored fresh from this batch alone.

## Catalog

A new `data/catalog/people/umm-shareek.ts` entry is authored (no prior
seed or catalog file covers her), carrying `sex`, `kunya`,
`tribalAffiliation`, `virtues`, and the صحابية title, all cited to this
batch's claims.

## Not run

This batch is not approved for publication and `history:import --apply`
was not run, per instructions. `npm run catalog:checklist -- umm-shareek`,
`npm run history:validate -- data/history/batches/umm-shareek`, lint, tsc
and the test suite were run and are clean.
