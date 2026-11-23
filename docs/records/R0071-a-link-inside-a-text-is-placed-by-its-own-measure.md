---
title: "A link box inside a Text is placed by its own measure on iOS"
summary: "Reference sheets drew each citation over the last line of its quote, and the link's mark over the page digits, because the link was a pressable box nested in the quote's Text; laying the link out beside or under the text fixes it."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "In the app's «المصدر» sheets, a quote from al-Suyuti's Tanasuq al-Durar ended with its citation («السيوطي، تناسق الدرر ص٨٤» and the out-of-site mark). On the owner's iPhone the citation was drawn on top of the quote's second line, and in a shorter quote the mark sat over «١٢٥». The web export looked fine."
approach: "ExternalLink was a Pressable wrapping a Text that ended with an inline lucide SVG, and four callers (Reference, SourceLine, a story's grading line, a battle moment's grading line) put it inside a Text. ExternalLink is now a row: the label Text and the mark side by side, nothing inline. The quote is its own Text with the link under it, and a grading before a link goes in LeadLink's wrapping row. shared/externalLinkNesting.test.ts parses every app .tsx and fails on a link anywhere under a Text."
outcome: "solved"
conditions: "Expo SDK app on iOS, root laid out right to left, Amiri text with Arabic-Indic digits, a Pressable nested inside a Text."
evidence: "mobile/src/ui/ExternalLink.tsx; shared/externalLinkNesting.test.ts"
implication: "Never nest a box (Pressable, View, SVG) inside a Text in the app: iOS measures it apart from the words and positions it wrong in right-to-left lines. Put it beside or under the text. The web export cannot show this."
date: "2026-11-23"
topics: ["mobile"]
buildsOn: ["R0030"]
---

React Native turns a View nested in a Text into an attachment whose size comes from
its own layout pass. In a right-to-left line that also holds Arabic-Indic digits,
iOS placed the attachment at the wrong line and over the digits. A nested Text with
an SVG at its end did the same to the mark.

## Tried

- Web export → the citation flowed after the quote; the bug shows only on the phone.
- Fix checked in the web export (dark, 440×956); the owner checks on the iPhone.
