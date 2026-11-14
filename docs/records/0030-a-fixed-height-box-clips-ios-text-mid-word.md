---
title: "A fixed-height box makes iOS cram the rest of a text onto its last line"
summary: "Quran text in a fixed-height, overflow-hidden box showed two lines on iPhone, the second holding all the remaining words and clipped mid-word; numberOfLines and a box sized to its content fix it."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The home page's continue-reading card showed a slice of the mushaf page in a 124-point box with overflow hidden. On the owner's iPhone it drew two lines, the second starting with a cut-off word, and left empty space below; the web export looked fine."
approach: "Drop the fixed height and the fade overlay, and give the Text numberOfLines={3} so React Native lays out exactly three lines and ends the last with an ellipsis. On the website, clamp an inner span with -webkit-line-clamp: 3 so the padding of the outer box doesn't show the marks of the fourth line."
outcome: "solved"
conditions: "Expo SDK app on iOS, Hafs font at 21/40, justified rtl text made of nested Text spans. The box gave the text less height than its lines needed."
evidence: "mobile/src/components/HomeFeed.tsx ContinueReading; src/components/homepage/Homepage.module.css .pageLines"
implication: "Never limit a text's lines by the height of its container on native: use numberOfLines. Web-export screenshots can't show this; reason from how iOS lays out text, or check on the phone."
date: "2026-11-13"
topics: ["mobile","ios","text"]
buildsOn: []
---

Without numberOfLines, iOS lays text out with clipping line breaks inside whatever
height the text view gets. When that height is short of the text, the last line
that fits takes every remaining word on one line, and the box clips it. With a
justified rtl line, what showed was the end of that long line with a word cut at
the right edge, and the space for a third line stayed empty.

numberOfLines makes React Native wrap by words, stop at the given line, and end it
with an ellipsis, and the box then sizes itself to those lines.

## Tried

- Checked the app's web export → three lines and a fade, no clipping; the bug only shows on the phone.
- Fix checked in the web export and the site at phone size, light and dark; not yet confirmed on the iPhone when written.
