# Battle participation: attendance, outcome, and what was done

Status: attendance and outcome are being separated; the participation render and
relation selection are not built yet. The decision is
[ADR 0013](adr/0013-separate-attendance-from-outcome.md).

## The two axes

A participation answers two separate questions, and until now both lived in one
`status` array:

| Question | Where it lives |
| --- | --- |
| Was the person there? | The relationship type |
| What happened to them there? | The status |

Each relationship type admits its own statuses, and the two sets are disjoint:

| Relationship | Statuses it may carry |
| --- | --- |
| `PARTICIPATED_IN` | `MARTYRED`, `DIED`, `INJURED`, `CAPTURED`, `WAS_CAPTURED`, or empty |
| `ABSENT_FROM` | `ABSENT_EXCUSED`, or empty |

An empty list means the same thing on both: the relationship is recorded and
nothing further is. The graph filter already calls that "status not recorded".

Nothing in PostgreSQL enforces the partition — `status` is an unconstrained
array — so `npm run catalog:validate` rejects a status its relationship cannot
carry. A participation that claims both attendance and absence is the
contradiction this change exists to prevent, so it fails the catalog rather than
reaching a store.

## Why not a flag on one relationship

With attendance as a column on a single `PARTICIPATED_IN` edge, the shortest
query for "who was at Badr" still returns absentees, and every caller has to
remember the filter. With two relationship types that query is correct as
written, and the remaining mistake — forgetting to include absentees — is
visible rather than silent.

This matters because the old shape failed in the dangerous direction. Absence
had to be opted into, so a row nobody annotated asserted presence. The seed
placed Talhah ibn Ubaydullah at Badr that way; his Siyar entry says he was
trading in Syria and that the Prophet assigned him the share and the reward.

## When an absence is recorded

Only where a source remarks on it. Everyone in history is absent from Badr, and
an absence with no comment behind it gets no edge at all. If a source ever
remarks on an absence without excusing it, that gets its own status or
relationship at the time; it is never filed as excused for want of another slot.

## The summary

Each participation carries a `summary` of what the person did, replacing
`courage`, which presupposed valour and so had nothing to say about a capture, a
death, or an absence.

It holds the source's own wording, not ours, like every other Arabic value in
the catalog, and it is cited like any other value. The citations themselves are
not repeated beside it — they live in the references section, where the profile
already gathers a claim's evidence.

## Where it is shown

| Surface | Shows |
| --- | --- |
| Profile participations list | Battle, status, summary, and the claims and citations backing that participation |
| Battle page | Participants and absentees as separate groups, each with its status |
| Graph, selected relation | The summary and a link to the profile's participation — never the citation list |

The profile is the full evidence surface: a participation shows its texts with
their citations, the same machinery `ClaimEvidence` already uses to group a
claim under what it supports.

Two pieces of this are deliberately not built yet:

- **Selecting a relation.** The graph can only select nodes today —
  `GraphSurface` exposes one callback and the workspace turns it into
  `selected=<slug>`. Showing a summary when an edge is selected needs a way to
  name an edge in the URL (source, type and target), mutual exclusion with node
  selection, an answer for reciprocal pairs drawn as one line, and a hit target
  better than a two-pixel line on a phone. It is a feature of its own.
- **The participations list on the profile.** The evidence block already groups
  a relationship claim under a heading naming both ends; gathering a
  participation's claims under its battle, beside the status and summary, is the
  remaining work.

## Migrating the existing rows

Three participations carry `ABSENT_EXCUSED` under the old shape: Uthman ibn
Affan at Badr, Ali ibn Abi Talib at Tabuk, and Talhah at Badr, whose batch is
authored directly in the new shape. The first two move to `ABSENT_FROM` and keep
their status.

`npm run battles:sync` only ever `MERGE`s and never deletes, by design, so it
will add the new edge without removing the old one. Rather than teaching the
sync to delete, which would give a one-way, additive script a destructive
branch for the sake of two rows, the stale edges are removed once by hand:

```cypher
MATCH (p:Person)-[r:PARTICIPATED_IN]->(b:Battle)
WHERE (p.slug = 'uthman-ibn-affan' AND b.slug = 'badr')
   OR (p.slug = 'ali-ibn-abi-talib' AND b.slug = 'tabuk')
DELETE r;
```

`npm run battles:validate` reports the drift before and after, and
`src/lib/graphIntegrity.live.test.ts` fails while a stale edge remains.
