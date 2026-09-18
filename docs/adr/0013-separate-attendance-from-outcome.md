---
status: accepted
---

# Separate attendance from outcome

A battle participation answers two questions: whether the person was there, and
what happened to them there. Attendance belongs to the relationship type,
`PARTICIPATED_IN` or `ABSENT_FROM`. Outcome belongs to the status, and the two
relationship types admit disjoint status sets: outcomes on a participation,
`ABSENT_EXCUSED` on an absence, and an empty list on either meaning nothing
further is recorded. Nothing in the database enforces the partition, so
`npm run catalog:validate` rejects a status its relationship cannot carry.

Holding both in one status list made an unmarked row assert presence: absence
had to be opted into, so forgetting it stated the opposite of the truth. That is
how the seed came to place Talhah ibn Ubaydullah at Badr, which his Siyar entry
says he missed while trading in Syria. With attendance on the relationship,
`MATCH (p)-[:PARTICIPATED_IN]->(b)` means "was there" with no filter to
remember, and the mistake left available — forgetting to include absentees —
shows itself instead of hiding.

An absence is recorded only where a source remarks on it. Everyone in history is
absent from Badr; the edge exists because al-Dhahabi says the Prophet assigned
Talhah its share and its reward. An absence a source mentions without excusing
gets its own status or relationship when one is first needed, and is never filed
as excused because that is the only slot available.

Each participation also carries a `summary` of what the person did, in the
source's own wording rather than ours, cited like any other value. It replaces
`courage`, which presupposed valour and so could not describe a capture, a death
or an absence.
