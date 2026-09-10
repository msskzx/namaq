---
status: accepted
---

# Require explicit catalog tombstones

Absence is not a deletion request. Removing a historical subject, relationship,
or stable slug requires an approved, persistent tombstone that identifies the
record and approving batch revision; a slug replacement also names its successor.
Dry runs show the affected rows and graph elements, and apply commands delete only
records covered by tombstones.

Treating a missing file as deletion would make an accidental omission
destructive. Keeping every stale record would prevent the catalog from becoming
authoritative. Explicit tombstones make removal reviewable, repeatable, and
idempotent.
