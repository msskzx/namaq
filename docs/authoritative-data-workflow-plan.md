# Authoritative historical data workflow

Status: ready for implementation.

This handoff defines how Namaq will author, review, and materialize historical
data. It records the authority boundary from
[ADR 0010](adr/0010-author-historical-data-under-data.md), the evidence-role
decision from [ADR 0011](adr/0011-classify-the-role-of-cited-evidence.md), and
the deletion rule from
[ADR 0012](adr/0012-require-explicit-catalog-tombstones.md). Domain terms live
in [CONTEXT.md](../CONTEXT.md#historical-evidence).

## Agreed behavior and scope

### Authority

`data/` is the only authoring source for historical subjects, relationships,
source accounts, claims, and citations.

It contains two authored layers:

1. The evidence layer records what one consulted historical work and edition
   says. It preserves source pages, notes, claims, citations, and attribution.
2. The canonical catalog records the structured values and relationships Namaq
   currently projects into its stores.

Seed code, PostgreSQL rows, Neo4j nodes and edges, and computed graph layout
properties are derived. A live database cannot supply an authoritative value.

“Authoritative” means authoritative for rebuilding Namaq. It does not mean that
Namaq declares a historical source infallible.

### Version-one evidence policy

- Each review batch has one focal subject. It may include supporting subjects,
  titles, events, battles, and relationships required to represent that focal
  subject's source account coherently.
- Version one uses one eligible historical source and edition per focal subject.
- Each citation records its evidence role: direct evidence, transmitted report,
  synthesis, or editorial analysis. The role describes the cited passage, not
  the work or digital host as a whole.
- Namaq does not score claims or perform its own historical assessment.
  Structured data follows the consulted source.
- When a source records competing claims, use the source author's explicit
  preference. If the author does not choose, use the consulted editor's explicit
  preference. If neither chooses, retain the existing canonical value; for a new
  field, use the first claim in source order.
- The display choice does not discard alternatives. Every competing claim and
  citation remains recorded.
- Adding a second source for the same focal subject is deferred. The validator
  must stop that operation until a later decision defines multi-source
  reconciliation.
- Claim review status remains independent from approval and visibility, as
  established by ADR 0008.

### Existing data

Existing historical data was extracted without recorded sources. Migrate the
repository's existing records once as `legacy-unreviewed`. Do not invent source
records, citations, claim confidence, or review history.

Backfilling evidence for legacy records is deferred and does not block this
workflow. PostgreSQL and Neo4j may be compared for loss detection, but live-only
values are reported rather than adopted.

### Included

- profile-backed and graph-only people;
- titles and person-title assignments;
- battles and battle participations;
- events, involved people, and event-battle links;
- person-to-person relationships;
- historical sources, accounts, pages, claims, and citations;
- validation, approval, promotion, seeding, synchronization, drift detection,
  explicit deletion, and graph-layout triggers.

### Excluded

- Qur'an tables and their seeds;
- researching or reviewing the historical basis of the legacy dataset;
- multiple sources for one focal subject;
- claim scoring or independent historical assessment;
- a PostgreSQL model for person-to-person relationships;
- generated copies of catalog data;
- treating a digital host as the historical source;
- automatic adoption of live-only database values.

## Target data model

### File layout

Use stable slugs as filenames. Display names can change; slugs identify records.

```text
data/
├── catalog/
│   ├── people/<slug>.ts
│   ├── titles/<slug>.ts
│   ├── battles/<slug>.ts
│   ├── events/<slug>.ts
│   └── tombstones/<kind>/<slug>.ts
└── history/
    └── batches/<batch>/
        ├── batch.json
        ├── summary.md
        └── accounts/<focal-subject>/NNN.md
```

Catalog modules are declarative TypeScript checked with `satisfies` against
shared types. They contain no I/O, environment reads, database calls, or computed
values. Seed commands discover and load them directly; there is no generated seed
layer.

### Subject records

Profile-backed and graph-only people share one canonical person type. An explicit
profile capability determines whether the person has a profile page. Promoting a
graph-only person changes that capability and adds profile fields without
changing the slug or relationships.

A person record owns:

- identity and profile fields;
- title assignments;
- person-to-person relationships encountered while researching that focal
  person.

A title record owns the title definition. A battle record owns its fields and
participations. An event record owns its fields, involved-person references, and
optional battle reference.

Every historical field, title assignment, participation, event link, and person
relationship carries one of:

- claim keys from the approved source batch; or
- the baseline-only `legacy-unreviewed` marker.

Structural values such as subject kind, slug, and profile capability use identity
or migration metadata rather than historical citations.

### Person relationships

Author a relationship from the focal person's perspective using the existing
relationship vocabulary. Normalize it with the existing reciprocal mapping. For
example, `abu-ubaydah SON abdullah` and
`abdullah FATHER abu-ubaydah` identify the same semantic relationship.

Equivalent declarations from either endpoint combine their claim keys. The
projector emits both directed Neo4j edges and uses `MERGE`, so repeated
declarations and repeated application do not change the graph. A declaration
whose direction or reciprocal type is incompatible fails validation.

Person-to-person relationships go directly from the canonical catalog to Neo4j.
Do not add a PostgreSQL relation table solely to route them. Existing PostgreSQL
models and synchronization paths remain responsible for people, titles, battles,
events, Companion edges, and the relationships they already model.

### Explicit removal

Absence is not a deletion request. Removing a subject, relationship, or stable
slug requires an approved operation and a persistent tombstone.

A tombstone identifies the removed kind and slug or normalized relationship key,
the approving batch revision, and an optional replacement slug. Dry runs show the
rows, joins, nodes, and edges that will be removed. Apply commands act only on
explicit tombstones and are idempotent. Unexpected live records without a
tombstone are reported as drift rather than deleted.

## Review and release workflow

### 1. Extract one source account

Create a review batch under `data/history/batches/`. Preserve exact pages,
editorial notes, stable passage anchors, the consulted edition, digital host,
extraction URLs, and access dates.

### 2. Author claims and proposed catalog operations

Add cited claims and declarative operations for fields and relationships. Each
operation references its supporting claim keys. The one-time migration command
is the only path allowed to create `legacy-unreviewed` values.

### 3. Validate and preview

`npm run data:review -- data/history/batches/<batch>` must:

- validate sources, pages, anchors, claims, citations, and evidence roles;
- enforce one source and edition for the focal subject in version one;
- validate the proposed catalog result as a whole;
- reject missing references and incompatible relationships;
- normalize equivalent relationships and combine their provenance;
- show the semantic catalog diff and planned store effects;
- identify required tombstone deletions and graph-layout work;
- write nothing.

### 4. Approve the exact revision

The content hash covers `batch.json`, page and note files, claims, citations,
and proposed canonical operations. One approval authorizes both evidence import
and deterministic catalog promotion. Claim review status does not change.

Any edit to a covered input invalidates approval.

### 5. Promote

`npm run data:promote -- data/history/batches/<batch>` applies only an approved,
current revision to the per-subject catalog. Promotion is deterministic and
idempotent. It writes repository files, not databases.

### 6. Materialize

1. Seed PostgreSQL subjects and the relationships it already models from the
   catalog.
2. Import the approved evidence batch into PostgreSQL.
3. Run the existing people, title, battle, event, and Companion synchronization
   paths.
4. Project person-to-person relationships and tombstones directly to Neo4j.
5. Run strict drift reports.
6. When graph structure changed, run the layout dry run, review it, and then
   apply it.

Every mutating command has a dry-run default and requires `--apply`. Commands
stop on the first failed gate. Repeating an approved revision has no further
effect.

## Migration and implementation order

### Phase A — catalog foundation

- Add catalog types, loading, whole-dataset validation, relationship
  normalization, and tombstones.
- Extend the history batch format with evidence roles and proposed catalog
  operations.
- Add review and promotion commands with revision approval checks.
- Prove the shapes with one profile-backed person, one graph-only person, one
  relationship, one battle participation, and one event link.

### Phase B — mechanical legacy baseline

- Parse every active and dormant repository data writer.
- Split people, titles, battles, and events into per-slug catalog modules.
- Convert person relationships from Cypher strings into typed declarations.
- Mark every migrated value and relationship `legacy-unreviewed`.
- Produce a migration summary for duplicates or repository contradictions that
  required a choice.
- Use live-store comparisons only as optional loss-detection reports.

### Phase C — shadow projections

- Adapt existing seed and synchronization commands to read the catalog.
- Compare dry-run projections with the normalized repository baseline.
- Verify person relationships normalize to the same directed edge set as the
  existing graph seed.
- Prove a clean rebuild against disposable PostgreSQL and Neo4j instances.

### Phase D — cutover

- Apply the legacy baseline through the new path.
- Apply the approved Abu Ubaydah source batch through review, promotion,
  evidence import, seed, and sync.
- Run graph layout because relationship materialization can change structure.
- Run strict drift validation.

### Phase E — remove split authority

- Remove replaced `prisma/*SeedData*.ts` and `neo4j/graphSeedData*.ts` modules
  only after parity tests prove them unreachable.
- Replace `scripts/people/activeSeedData.ts` import parsing with catalog loading.
- Add CI checks rejecting new historical data outside `data/`.
- Update `docs/data-pipelines.md`, `AGENTS.md`, and README instructions to name
  only the new workflow.

## Affected components

Existing paths were verified on `origin/claude/history-evidence-pilot`.
Proposed new paths are marked.

| Component | Intended change | Order |
| --- | --- | --- |
| `data/catalog/**` | Proposed per-subject modules and tombstones | 1 |
| `src/lib/catalog/types.ts` | Proposed subject, provenance, operation, and tombstone types | 1 |
| `src/lib/catalog/loadCatalog.ts` | Proposed standard-library discovery and loading | 1 |
| `src/lib/catalog/validateCatalog.ts` | Proposed whole-catalog and relationship validation | 1 |
| `src/lib/history/batchSchema.ts` | Add evidence role and canonical operations; include them in the revision | 2 |
| `src/lib/history/importBatch.ts` | Persist evidence role while retaining transactional retry behavior | 2 |
| `scripts/data/reviewBatch.ts` | Proposed non-mutating semantic and store preview | 2 |
| `scripts/data/promoteBatch.ts` | Proposed approved, deterministic catalog promotion | 2 |
| `prisma/schema.prisma` and a migration | Persist citation evidence role; do not add person relations | 2 |
| `prisma/personSeed.ts` | Load canonical people and title assignments | 3 |
| `prisma/titleSeed.ts` | Load canonical titles | 3 |
| `prisma/battleSeed.ts` | Load canonical battles and participations | 3 |
| `prisma/eventSeed.ts` | Load canonical events and links transactionally | 3 |
| `neo4j/graphSeed.ts` | Project normalized person relationships and tombstones | 3 |
| `scripts/people/activeSeedData.ts` | Read the catalog instead of parsing seed imports | 3 |
| Existing `scripts/{people,titles,battles,events}/` syncs | Preserve boundaries; change only inputs if required | 3 |
| `scripts/graph/computeGraphLayout.ts` | Reuse after structural changes | 4 |
| `package.json` | Add catalog review, promotion, and validation commands | 4 |
| Legacy Prisma and Neo4j data modules | Delete after parity and clean-rebuild gates pass | 5 |

Each new catalog, review, promotion, and projection module gets a colocated
`<file>.test.ts`.

## Acceptance criteria and validation

| Acceptance criterion | Validation |
| --- | --- |
| Every historical subject has one per-slug catalog module; graph-only and profile-backed people share an identity | Filename/kind/slug uniqueness tests and graph-only promotion test |
| Existing unsourced repository data is retained without invented evidence | Migration snapshot test requiring `legacy-unreviewed` on every migrated historical value |
| New changes cannot bypass evidence | Validator tests rejecting missing claims, citations, edition metadata, anchors, URLs, and evidence roles |
| Version one cannot silently combine sources | Validator test rejecting a second source for one focal subject |
| Source conflicts follow deterministic source order without claim scoring | Tests for author preference, editor preference, existing-value retention, and first-claim fallback |
| An approved revision covers evidence and catalog operations exactly | Revision tests for every covered file and stale approval |
| Promotion is deterministic and retry-safe | Golden semantic diff and repeated-promotion test |
| Equivalent relationship declarations do not change graph output | Normalize both endpoint perspectives, union claim keys, and compare generated edges |
| Incompatible relationship declarations fail | Direction and inverse mismatch tests |
| Repeated seed and sync operations are idempotent | Apply twice against disposable stores and compare counts and values |
| Person relations never require PostgreSQL | Schema assertion and integration test projecting them directly to Neo4j |
| Removal requires explicit approval | Tests showing omission only reports drift while a tombstone plans and applies deletion |
| Slug replacement preserves the redirect target | Tombstone validation and seed/sync integration test |
| Structural changes trigger layout work | Dry-run test distinguishing evidence-only from node or edge changes |
| Legacy writers cannot affect stores after cutover | Import search, CI path rule, and clean rebuild without legacy modules |

Required repository checks are `npm run lint`, `npx tsc --noEmit`, and
`npm test`. Data integration verification additionally requires:

1. the worktree's `.env` symlink;
2. running PostgreSQL and Neo4j;
3. a complete dry run;
4. application to disposable stores;
5. strict people, title, battle, event, relationship, and layout validation.

No visual UI verification is required unless implementation changes how evidence
or legacy status is rendered.

## Data and operational consequences

- The baseline migration can be large but must be mechanical. It is not an
  editorial review.
- PostgreSQL and Neo4j do not share a transaction. Each apply step is idempotent,
  and the orchestrator stops and reports the last completed step so a failed run
  can resume safely.
- Event seeding must become transactional instead of deleting and rebuilding
  outside a transaction.
- Current additive syncs gain explicit tombstone handling; they do not globally
  prune unexpected live records.
- Graph structure changes require the mandated layout dry run, reviewed diff, and
  apply.
- The old seed and graph modules remain until shadow parity and clean rebuild
  pass, then are removed in the same cutover series.

## Assumptions and deferred work

There are no implementation blockers.

Nonblocking implementation assumptions:

- use Node's standard library for catalog discovery and deterministic ordering;
- reuse existing relationship types and reciprocal mappings;
- keep dry run as the default for every command;
- serialize promoted TypeScript deterministically and test the output;
- reject concurrent approved batches that target the same field or relationship
  revision until the earlier batch is promoted;
- model a slug rename as a new subject plus an explicit tombstone pointing to the
  replacement;
- keep tombstones indefinitely in version one.

Deferred work:

- admitting and reconciling multiple sources for one subject;
- claim scoring or independent historical assessment;
- backfilling citations for legacy records;
- Qur'an data;
- automatic deletion based only on absence;
- adopting live-only data.
