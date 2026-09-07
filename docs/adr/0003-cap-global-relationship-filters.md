---
status: accepted
---

# Cap global relationship filters at one provenance-scoped hop

A global relationship filter (no subject selected) both shows existing connections of its type between visible subjects and introduces one hop of new subjects for anyone visible who lacks theirs — for example, turning on Father reveals Muhammad's father and, independently, each of his visible wives' fathers. Left uncapped, a subject introduced this way would itself qualify to trigger the same filter, cascading through the entire dataset's paternal lines rather than stopping at one hop.

The cap is by provenance, not by counting: a subject introduced by filter F can never again trigger F's automatic introduction, permanently, for as long as it remains in the exploration. The cap applies per relationship type, not globally — a subject introduced by Wives remains fully eligible to trigger Father. The cap only restricts the automatic, no-selection path; selecting a capped subject and using its own expansion choices (including full-depth Paternal lineage) is unrestricted, and an active global filter will still pick up one hop from whatever a person manually reveals, since manually-revealed subjects are not filter-introduced.

Considered and rejected: resetting the cap each time the filter is retriggered (off/on), which would let repeated toggling walk arbitrarily deep across the whole visible set. Rejected because the product already offers two dedicated ways to go deep — per-subject expansion for one branch, and Show full graph for everything — and a deepenable global filter blurs into "show me the whole cluster," undermining the exploration as a deliberate, bounded workspace.
