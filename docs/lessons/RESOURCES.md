# Resources

Graded by how much they can be trusted about *this* pipeline. In-repo code and
ADRs outrank everything else, because they are the thing being learned.

## In-repo, authoritative

| Resource | Trust | What it settles |
| --- | --- | --- |
| [docs/data-pipelines.md](../data-pipelines.md) | Highest | The authored-layer map: which paths write Postgres, which write Neo4j, which are one-way, which look live and are not |
| [docs/extraction-checklist.md](../extraction-checklist.md) | Highest | Reading order for an entry, where each thing is recorded, `notInSource` vs unchecked |
| [docs/companion-extraction-checklist.md](../companion-extraction-checklist.md) | Highest | Extraction order and resume point, in the companion index's own order |
| [prisma/schema.prisma](../../prisma/schema.prisma) | Highest | The stored shape. Its doc comments carry design reasons the ADRs do not repeat |
| `src/lib/history/batchSchema.ts` | Highest | Every validation rule, and `passageExcerpts` — the positional anchor binding |
| `src/lib/history/importBatch.ts` | Highest | How a batch becomes rows, inside one transaction |
| `scripts/history/verifyExcerpts.ts` | Highest | The substring check that detects anchor drift; not wired into validate |
| `src/lib/history/sourceAccounts.ts` | Highest | The read side: pagination, section index, payload shaping for the reader |

## ADRs that hold the design arguments

| ADR | What it decides |
| --- | --- |
| [0008](../adr/0008-separate-review-from-visibility.md) | Review status is shown, never used to hide data |
| [0009](../adr/0009-citations-independent-of-profiles.md) | Evidence attaches to a subject slug, not a profile |
| [0010](../adr/0010-author-historical-data-under-data.md) | `data/` is authority; Postgres, Neo4j and seeds are projections |
| [0011](../adr/0011-classify-the-role-of-cited-evidence.md) | Evidence role is a property of the citation, not the work |
| [0013](../adr/0013-separate-attendance-from-outcome.md) | Attendance is the relation; what happened is the status |
| [0016](../adr/0016-a-reader-that-owns-the-whole-screen.md) | A page is the source's page, not the screen's |

## External

| Resource | Trust | Notes |
| --- | --- | --- |
| [Siyar, al-Risalah ed. on Shamela](https://shamela.ws/index.php/book/10906) | High for the text | The edition the batches cite: ed. Husayn al-Asad under Shu'ayb al-Arna'ut, 3rd ed., 1405/1985. Delivery host, not an evidence class (ADR 0011) |
| [Siyar on Islamweb](https://www.islamweb.net/ar/library/content/60/1/) | High for the text | Different edition data from the Shamela copy — noted in `batch.json`. Its [companion index](https://www.islamweb.net/ar/library/maktaba/nindex.php?id=2&treeLevel=1&bookid=60&page=bookssubtree&searchtext=&showexact=) is what extraction order follows |

## Communities

Not yet explored. The design questions here (provenance modelling, citable-unit
granularity, editorial review states) are shared with digital-humanities and
TEI work — worth finding a venue for once a concrete design proposal exists to
put in front of people. Raise it when you want this pursued.
