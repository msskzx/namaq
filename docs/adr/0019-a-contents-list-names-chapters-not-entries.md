---
status: accepted
---

# A contents list names chapters, never who an entry is about

`SourceContents.tsx` and `SourceAccountReader`'s own fullscreen index both let
someone jump into a source. Both name the book's own chapters and sections —
the same rows, built by `volumeChapterRows` — and never the person whose entry
opens on a page. A page with neither a heading nor an entry is left out; a
page with an entry and no heading falls back to the entry's own label, so
every page an entry begins on stays reachable.

This extends ADR 0018's "a page belongs to the book before it belongs to
whoever it is about" from storage into every reading surface. Before this,
the two lists disagreed: the outer contents list had already moved to chapters,
but the reader's own index, opened from a source, still listed every subject
read from the current volume — the same person-directory problem one click
deeper.

Reading from a profile asks a different question — which of the subject's own
works to switch to — and keeps its own entry selector; a profile's list is
short and genuinely about the subject, not the book.
