# Batch: Abu Ubaydah ibn al-Jarrah, Siyar entry 1

This batch preserves al-Dhahabi's complete entry on Abu Ubaydah ibn al-Jarrah
and supports the canonical records selected from it. It is the pilot for the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-ubaydah-ibn-al-jarrah/](accounts/abu-ubaydah-ibn-al-jarrah/)

## Source account

Entry 1 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account spans printed
pages 5–23. Each page preserves the author's text separately from the editor's
footnotes and links to the corresponding Shamela page.

## Review

The user compared all 14 claims with the stored source text on 2026-09-11 and
requested citation corrections, then explicitly marked the complete batch
reviewed. The batch contains 27 citations after consolidating source selections
that pagination or extraction had split into separate records.

The year of death remains disputed within one claim: Abu Hafs al-Fallas reports
18 AH, while Ibn Aidh alone reports 17 AH. The canonical profile uses 18 AH and
keeps both reports visible.

## Publication

The reviewed revision was published on 2026-09-11. Re-running `npm run history:import --
data/history/batches/abu-ubaydah-pilot --apply` safely upserts the same revision.

Importing this batch updates PostgreSQL evidence records only. It does not
change graph structure, so no Neo4j synchronization or graph-layout run is
required.
