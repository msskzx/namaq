# Evidence for the data-model rethink

Facts only, gathered while making Siyar volumes 4-5 exact quotes (2026-10-03). Each line names the file that holds it. No solutions here.

## How the data is built today

Five stores hold the same facts, each authored or derived separately:

1. **Page store** `data/history/sources/<source>/v<vol>/<printedPage>.md` (+ `.notes.md`): one printed page of one edition, paragraphs split on blank lines; a paragraph is addressed by position, `4/41-p3` (ADR 0018, `src/lib/history/sourceStore.ts` `pageAnchors`).
2. **Batches** `data/history/batches/<batch>/batch.json`: source accounts, **claims** (`key`, `field` or relation, free-text `assertion`, `confidence`, `reviewStatus`) and their **citations** (`passageAnchor`, `excerptArabic`, `volume` label, `pageReference`, `extractionUrl`). A batch carries an `approval` = hash of the whole batch revision (`src/lib/history/batchSchema.ts` `batchRevision`, `checkApproval`).
3. **Catalog** `data/catalog/{people,battles,events,utterances}/*.ts`: the values the app shows (`fullName`, `kunya`, `appearance`, `virtues[]`, participations, relations...). Each value carries `claims: ['<claim key>']` or `legacy-unreviewed` (`src/lib/catalog/types.ts`). Hand-typed text.
4. **PostgreSQL** (`prisma/schema.prisma`): `Person`, `HistoricalClaim` (copies `assertion`), `Citation`, `SourcePage`, `PersonVirtue`, ... written by `history:import`, `catalog:project`, `people:sync`.
5. **Neo4j**: graph nodes/relations projected from the catalog (`catalog:project-graph`).
Also dormant legacy: `prisma/personSeedData*.ts`, `neo4j/*Seed*.ts` (extracted without citations; "a checklist, never a source", AGENTS.md).

Value -> claim key -> claim in an approved batch -> citation -> anchor -> page. `catalog:validate` treats claim keys of batches not approved at their current revision as unknown (`scripts/data/validateCatalog.ts` `approvedClaimKeys`).

## Drift and defects found (counts are from this session)

- Profile values come from the catalog, not from `claim.assertion`; 25 PRs rewrote `assertion` (a field no profile value reads) before this was seen.
- 41 of 105 batches had citations failing `scripts/history/verifyExcerpts.ts` (248 FAIL lines, 128 in volumes 4-5): an excerpt missing a space, a lost footnote marker, text spanning two paragraphs, text from another edition (unvowelled islamweb text in a batch claiming the Shamela edition), 8 anchors past the paragraph count (e.g. `4/92-p15`).
- Of 1,354 volume 4-5 citations, 318 did not match their paragraph under the quoted-value matcher before its punctuation fixes.
- Catalog values: 414 of 727 collected text values failed exact-quote checks; `name`, `fullName`, `kunya` unvowelled while the citation beside them was vowelled; `virtues` was one string joined from up to 6 claims (Hatib), mixing al-Dhahabi's narration with a companion's words; stitched summaries (Sa'd ibn Ubadah's Badr summary) that no one wrote.
- Citations' `volume` label is "1", "السيرة 1" (a book label) while the anchor prefix is the namaq volume (`4/...`): two numbering systems for one thing.
- Anchors are paragraph indexes: repaginating or re-splitting a page silently re-points a citation.
- Sira volumes 1-2 are served bare (no tashkeel, no footnotes) by Shamela (`10906/428`); the same edition's volumes 4-5 are vowelled with footnotes.
- Chapter headings: the contents list detected a numbered entry title only as a page's first paragraph, so mid-page entries fell back to the catalog name (`src/lib/history/sectionHeadings.ts`).
- Approval gating: 8 batches pending approval before this work (abu-ubaydah-pilot, arwa-bint-abd-al-muttalib-siyar175, fatimah-bint-muhammad, qutaylah-bint-qais-al-kindiyyah, saad-ibn-abi-waqqas, safiyyah-bint-huyayy, talhah-ibn-ubaydullah, umm-shareek); `catalog:validate` fails with 110 issues on `main`; any batch edit lapses its approval wholesale.
- `verifyExcerpts.ts` proves an excerpt is inside ONE paragraph; the authoring rules allow joined fragments and ellipses, so the verifier rejects legitimate citations and passes nothing about the catalog value.
- Fixes by agents were mostly accepted by their own checks while a reviewer found meaning changes in ~65 of ~300 values (dropped clauses, speaker changed, a lineage link added or lost).
- A repo lesson already records "a check that exists but doesn't run" (`docs/lessons/lessons/0003-...`) and "checks that don't rederive pass the wrong inputs".
- AGENTS.md rule today: "Transmission chains stay in the source text. A person mentioned only as a narrator does not become a graph node or an edge."

## Corrections after the lesson was verified against the repo

- `virtues` is no longer one string: ADR 0020 and PR #302 made it a list of single-speaker entries (`CatalogVirtue`, `PersonVirtue`). The migration is not applied to the database.
- Chapter headings: PR #299 now detects a numbered entry title on every paragraph.
- Approvals: 5 batches have no approval block (arwa-bint-abd-al-muttalib-siyar175, fatimah-bint-muhammad, qutaylah-bint-qais-al-kindiyyah, safiyyah-bint-huyayy, umm-shareek) and 3 carry a stale approval (abu-ubaydah-pilot, saad-ibn-abi-waqqas, talhah-ibn-ubaydullah).
- Citation `volume` labels are mixed across batches (`1`, `2`, `4`, `5`, `السيرة 1`, `السيرة 2`, ...), while the anchor prefix is the namaq volume.
- AGENTS.md lets a citation join fragments with an ellipsis; ADR 0020 forbids `…` stitching for a virtue. The two rules conflict.
- The footnote-marker normalisation is duplicated between `verifyExcerpts.ts` and `src/lib/history/sectionHeadings.ts`.

## Existing ADRs and docs that bound the model

ADR 0008 (review separate from visibility), 0009 (citations independent of profiles), 0010 (author under data/), 0011 (role of cited evidence), 0013 (attendance vs outcome), 0014 (kunya is a name), 0015 (one record for what someone said), 0018 (page belongs to the edition), 0019 (contents list names chapters), 0020 (a virtue is one entry with one speaker); `docs/data-pipelines.md`, `docs/extraction-checklist.md`, `docs/plans/source-page-store.md`, `CONTEXT.md`, `docs/lessons/MISSION.md`.

## Where the project is going (from the owner)

- More works: other Sira and companion histories; Sahih al-Bukhari (and hadith generally, with isnad as nodes); Qur'an tafsir / explanation books; tarajem.
- A mistake about the Prophet's hadith is far graver than a mistake in history; every thing used or said must trace to a reference and hold exactly as it was said, the way hadith narrators state how they heard it and from whom.
- Facts, not our opinion or our own words.
- Arabic-first, vowelled text, editions differ and must not be merged by publisher alone.
