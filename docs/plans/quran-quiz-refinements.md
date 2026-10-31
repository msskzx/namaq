# Quran quiz and tree refinements

## Scope

Finish the owner's launch refinements for Quran trees, solo quizzes and party
quizzes. Keep other features reachable by URL. No feature flags or mobile rewrite.

## Acceptance criteria

- Quiz setup offers only متشابهات القرآن, with juz bounds and answer count in
  one responsive row. Remove the requested solo and party headings and links.
- Allow quiz trees with 2–10 ayat and 1–10 requested answers. Grade reordered
  leaves without enumerating every permutation; given nodes remain fixed.
- Preserve the words preceding each shared phrase, including the five
  الإنسان ما passages. Show no node controls in the setup example.
- Changing setup preserves scroll. Preview nodes keep their dimensions when
  difficulty changes. Party setup receives twice the desktop width of sharing
  and players.
- Tree canvases share a fixed responsive height, center the diagram and fit it
  in both dimensions, allowing enlargement up to the existing 200% limit.
- Quran text uses the mushaf font. Render Quran.com words using matching stored
  reader forms; convert shared synthetic marks without switching to Amiri.
  Source text, matching and grading remain unchanged.
- After revealing a solution, offer surrounding ayat, off by default and fetched
  on demand. Remove the separate شجرة العبارة navigation button.
- Use متشابهات القرآن consistently in the affected launch labels. Support
  Arabic, English, RTL, light and dark themes through the shared components.

## Paths and validation

Quiz settings, assembly, grading and feedback; shared tree viewport and context;
homepage/navigation labels; Quran font styles and display lookup; colocated tests.
Regenerate the font lookup with `node --import tsx scripts/quran/buildMushafWords.ts`.
It must match all 6,236 ayat and reject ambiguous mappings or word-count drift.

Lint, TypeScript, the production build and all 3,306 tests passed before PR review.
Browser verification was unavailable because browser access was disabled.
An independent reviewer must review the complete diff before the PR opens.

## Review

The first review found that reordered correct answers could retain the original
slot's surrounding-ayah metadata. The solution now builds its display tree from
the matched answers while preserving slot traversal. A regression failed before
the fix and passes after it. The second and final review found no further defects.

Prior local Distillate searches found no applicable records. The session's draft
records describe the grading cost, shared corpus indexing and font-encoding issue.
