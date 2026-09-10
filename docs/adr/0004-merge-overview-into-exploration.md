---
status: accepted
---

# Merge Overview into a single exploration workspace

Current design review: [Exploration rules review](../graph-exploration-review.md) supersedes conflicting
local/global scope, filter, search-enablement, reset, and removal behavior below.
The rules are confirmed but not yet implemented; older implementation
descriptions are not evidence of compliance.

Overview was planned as a separate view for discovering clusters across the whole graph, distinct from Exploration's subject-scoped controls. Selecting a subject now determines the scope of the shared relationship controls instead: with a subject selected, a relationship choice such as Father expands only that subject (see 0002); with no subject selected, the same choice becomes a global relationship filter across the whole exploration. Show full graph, an explicit action within that same exploration, replaces Overview for revealing the entire dataset, so there is no longer a separate mode to switch into.

Deselecting a subject keeps the exploration as built; it does not reset the view or reveal the full dataset. A relationship control's scope is fixed at the moment it is switched on, from whatever is selected then, and stays live under that scope until switched off — selecting or deselecting something else afterward does not retroactively change it.
