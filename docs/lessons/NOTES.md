# Notes

## Workspace

Lives at `docs/lessons/`, chosen over the repo root so the lessons sit beside
the docs they cite. Relative links assume that location: `../data-pipelines.md`,
`../adr/NNNN-*.md`, `../../src/...`.

## Preferences observed

- Learns by questioning the model, not the procedure. The session that started
  this workspace was a push-back — "but they hold a model value, right?" — and
  it was correct. Lessons should leave room for that rather than closing every
  question.
- Wants the rule's *reason*, and the repo agrees: `AGENTS.md` forbids comments
  that explain and sends the explanation to a document. Lessons are that
  document's cousin — cite the file or ADR, never assert from memory.
- Reads Arabic; source excerpts can stay unglossed.

## Open threads for future lessons

- **Should a heading be a citable passage?** `PassageKind` has `BODY` and
  `NOTE`. A group heading in the Siyar's index carries a real model value
  (martyrdom at Badr) and no paragraph. Currently out of scope by consequence
  rather than by decision — that asymmetry is a design lesson.
- **`verifyExcerpts` is not wired into `history:validate`.** The one check that
  detects positional anchor drift is opt-in. Worth a lesson on which invariants
  this pipeline enforces and which it merely offers.
- **Two authoring paths live at once.** Three subjects (Abu Ubaydah, Talhah,
  al-Zubayr) come from the catalog alone; everyone else still comes from the
  seeds. Worth a lesson on the hand-off and how the catalog's authority differs
  before and after a seed entry is deleted.
- **The read side.** `sourceAccounts.ts` caps pages per request at 9 and builds
  a section index by stripping the editor's bracketed headings. Lesson material
  on how the reader's constraints feed back into what a page may be.
