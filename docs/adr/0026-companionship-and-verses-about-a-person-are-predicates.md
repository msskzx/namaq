---
status: accepted
---

# Companionship and verses about a person are predicates

`COMPANION_OF` links a person to the one they accompanied, and `ABOUT_AYAH` says
a verse is about a person, with the verse as the classified value (`3:172`). Both
rest on a statement of the text, so the catalog's `COMPANION_OF` edge and its
`ayat` list for al-Zubayr now close in the diff. `EXPLAINS_AYAH` stays for a
hadith or commentary that explains a verse, which is a different relation.
`COMPANION_OF` is not the `companion` status of [ADR 0025](0025-title-status-and-office-are-separate-predicates.md).
