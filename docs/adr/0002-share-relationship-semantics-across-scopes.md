---
status: accepted
---

# Share relationship semantics across scopes

Existing graph filtering and person exploration will use one shared module for
relationship meaning, with scope supplied explicitly. Role matching, inverse
evidence, counts, and connection visibility must not acquire separate rules in
the API, graph controls, and embedded views. This requires consolidating the
current scattered filtering rather than adding an independent local filter,
so a direction or relationship fix applies consistently throughout the system.
