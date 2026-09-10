# How data reaches the app

Two things author data, and they write to the same store for different reasons.

**Seed files** under `prisma/` hold the subjects themselves: people, titles,
battles, events, and the Qur'an tables. **History batches** under
`data/history/` hold the evidence about those subjects: source editions, the
complete source accounts, claims and their citations
([the plan](data-quality-references-plan.md)).

Both write into PostgreSQL. Neo4j is derived from PostgreSQL and never authored
directly. The layout is computed from the graph and written back to both.

```mermaid
flowchart TB
  subgraph authoring["Authored by hand"]
    seeds["prisma/*SeedData*.ts<br/>people, titles, battles, events"]
    batches["data/history/batches/<br/>sources, accounts, claims, citations"]
  end

  seeds -->|"npm run seed:*"| pg[("PostgreSQL")]
  batches -->|"npm run history:import -- --apply"| pg

  pg -->|"people:sync, titles:sync,<br/>battles:sync, events:sync"| neo[("Neo4j")]
  neo -->|"npm run graph:layout -- --apply"| pg
  neo -->|"graphRank, layoutX, layoutY"| neo

  pg --> app["Profiles, search, evidence"]
  neo --> graph["Graph workspace"]
```

## Seed files to PostgreSQL

Each subject kind has a data file and a script that loads it.

| Data | Script | Wired in |
| --- | --- | --- |
| People | `npm run seed:people` | `personSeedData3` through `personSeedData15` |
| Titles | `npm run seed:titles` | `titleSeedData` |
| Battles | `npm run seed:battles` | `battleSeedData` |
| Events | `npm run seed:events` | `eventSeedData` |

Seeds upsert by slug, so re-running one updates the rows it owns rather than
duplicating them.

### Two paths are dormant

`prisma/personSeedData.ts` is **not imported** by `prisma/personSeed.ts`. It
holds the earliest people, the Prophet and the Companions among them, which were
loaded once and have since been edited in the database directly. Editing that
file changes nothing until it is wired back in, and wiring it back in would
write its contents over whatever the database now holds.

Battle participations are **not seeded at all**. The block that loads them in
`prisma/personSeed.ts` is commented out, and the data it reads lives in the
dormant file above. Participation rows in PostgreSQL came from an earlier run
and nothing maintains them now.

Neither is a bug to fix in passing. Both mean a canonical edit to an affected
subject needs a deliberate writer, and that the file and the database can
disagree without anything noticing.

## History batches to PostgreSQL

A batch is a directory: `batch.json` for sources, accounts and claims, Markdown
files for the source pages, and `summary.md` for review. `npm run history:extract`
pulls an entry from a digital library into that shape.

`npm run history:validate` checks it. `npm run history:import` dry-runs, and
`-- --apply` writes, but only when the files still hash to the revision recorded
as approved. Writes upsert on an authoring key, so a partly failed import can be
retried without duplicating anything.

Files are the source of truth here. The database holds a copy: change the files
and re-import, never edit the evidence tables directly.

## PostgreSQL to Neo4j

The sync scripts are one-way and non-destructive. They `MERGE` by slug, update
the properties PostgreSQL owns, and never delete a node, a relationship, or a
graph-only property. Each runs as a report first and writes only with `--apply`.

- `npm run people:sync` — shared person identity fields
  ([details](canonical-people-pipeline.md))
- `npm run titles:sync` — `:Title` nodes and `HOLDS_TITLE`
- `npm run battles:sync` — `:Battle` nodes and `PARTICIPATED_IN`, carrying each
  participant's status
- `npm run events:sync` — `:Event` nodes, `INVOLVED_IN`, and `PART_OF` to a
  linked battle
- `npm run people:sync-companions` — `COMPANION_OF` edges to the Prophet

Evidence does not sync. Claims and citations stay in PostgreSQL and no citation
becomes a node or an edge.

## Layout

`npm run graph:layout -- --apply` computes prominence, community and position
over the whole unified graph and writes them to both stores. Any change to graph
structure shifts them, so run it after seeding new subjects or relationships.
Importing evidence alone does not change graph structure and does not require it.

## Applying a canonical change today

A change to a person's own fields, a participation, or an event goes through
whichever path is live for it.

1. Author the change in the seed file that owns the subject, so the file records
   what is true even where the seed no longer runs.
2. Apply it. An active file needs its seed script. A subject in the dormant file
   needs a targeted write, because running the seed is not an option.
3. Sync the affected kind to Neo4j, then re-run the layout if graph structure
   changed.
4. If evidence supports the change, it belongs in a history batch, and the batch
   is what a reader sees as the reason.
