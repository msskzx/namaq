---
status: accepted
---

# A kunya is a name, not a title

A person's kunya is a column on the person, beside their name and full name. It
is not a Title, and holding one creates no graph node and no `HOLDS_TITLE` edge.

A Title here is a subject in its own right: a node with a page listing everyone
who holds it, because holders of صحابي or العشرة المبشرون share the thing the
title names. A kunya names nobody's shared attribute. Modelling it as a title
would hang every أبو محمد off one hub node, joining people who have nothing in
common but what their eldest son was called, and a hub of that size moves
`graphRank` and the Louvain clusters for every subject around it.

The name system already carries it: an entry prints the kunya in its naming
line, sources address people by it, and for some people it is the name they are
known by — Abu Ubaydah ibn al-Jarrah is a kunya whose ism, عامر, survives only
inside `fullName`. A column makes that a recorded value with its own evidence
rather than an accident of which string landed in `name`.

`abu-al-hasan` predated this as a Title row, which is Ali's kunya in the wrong
place. The seeds no longer declare it and the value moves to his kunya, marked
`legacy-unreviewed` because no batch has read his entry. The title row and its
assignment survive in the live databases: deleting a catalog subject needs the
tombstone ADR 0012 requires, and that mechanism is not built, so the removal is
owed rather than done. `npm run titles:validate` reports it meanwhile, which is
the right place for a known debt to sit.
