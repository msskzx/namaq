---
title: "A mushaf page wider for its height is held by its line height"
summary: "On the iPad the printed page's text was fitted to the width up to 0.72 of a line's height, and the Hafs font's marks ran into the next line; a 0.55 cap with a narrower, centred text block fixes it and leaves standing phones as they were."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The app's mushaf sets 15 lines in the page's height and fits each page's text to its width. On the owner's iPad each line's marks touched or covered the next line, and some tashkeel was hidden."
approach: "Measured the text size over the line height at several screens in the web export: phones 0.38 to 0.48 (fitted by width), iPads 0.57 to 0.67 standing and lying down (wider for their height). MushafPageView caps the printed text at TEXT_HEIGHT (0.55) of the line height, the opening oval too; where the cap holds, the text block narrows to the width its lines need and sits centred, titles with it."
outcome: "solved"
conditions: "Expo app, KFGQPC Hafs v18 font, iPad standing and lying down (two-page spread)."
evidence: "mobile/src/components/MushafPageView.tsx (TEXT_HEIGHT, block)"
implication: "A size fitted to the width needs a cap from the height that leaves the font's marks room: the Hafs marks need the line about twice the font size. A wider screen reaches the cap; narrow the text block rather than spreading the words."
date: "2026-11-23"
topics: ["mobile"]
buildsOn: []
---

The page's lines are a fixed share of its height, so only the font size can give
the marks room. Phones never reached the old 0.72 cap, so it never showed there.

## Tried

- Cap 0.5: the two-page spread's text came out small with wide sides; 0.55 keeps
  it closer to the width.
- Checked in the web export at 820x1180, 1180x820 and 440x956; the native font's
  shaping is the owner's iPad check.
