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
- Reads the text first and expects agents to. When a rule makes an agent stop on
  something a reader sees at once (who answers in a question and answer, whether
  two narrations are one event), the owner treats the rule as the defect. See
  learning record 0006 and ADR 0024.

## Open threads for future lessons

- **Should a heading be a citable passage?** `PassageKind` has `BODY` and
  `NOTE`. A group heading in the Siyar's index carries a real model value
  (martyrdom at Badr) and no paragraph. Currently out of scope by consequence
  rather than by decision — that asymmetry is a design lesson.
- **Two authoring paths live at once.** Three subjects (Abu Ubaydah, Talhah,
  al-Zubayr) come from the catalog alone; everyone else still comes from the
  seeds. Worth a lesson on the hand-off and how the catalog's authority differs
  before and after a seed entry is deleted.
- **The read side.** `sourceAccounts.ts` caps pages per request at 9 and builds
  a section index by stripping the editor's bracketed headings. Lesson material
  on how the reader's constraints feed back into what a page may be.

## Settled, no longer open

- **Who owns a page** — answered by [ADR 0018](../adr/0018-a-page-belongs-to-the-edition.md)
  and taught in lesson 0002. The page store plan is
  [docs/plans/source-page-store.md](../plans/source-page-store.md); implemented
  in PRs #220-222.
- **Which invariants does this pipeline enforce, and which does it merely
  offer?** Taught in lesson 0003, using two instances the page-store migration
  itself produced: an anchor-position check that counted paragraphs instead of
  comparing the anchor's own number, and a dangling Prisma relation that
  shipped past lint/tsc/1,701 tests and was only caught by a live query.
  `verifyExcerpts` still isn't wired into `history:validate` — that specific
  gap is unresolved, tracked as its own item below rather than folded into the
  lesson, since it's a workflow fix, not a design question.

## Not yet fixed (not lesson material, just owed)

- `npm run history:verify-excerpts` runs as a separate script; nothing calls
  it from `history:validate` or CI, so a batch can pass validation with a
  citation excerpt that doesn't literally appear in its cited paragraph.
