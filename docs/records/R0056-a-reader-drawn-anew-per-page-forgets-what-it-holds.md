---
title: "A reader drawn anew for every page forgets what it holds"
summary: "The website's mushaf reader is remounted on each page URL, so a 'follow the ayah being read' flag kept in its useState was back to true after every manual turn, and the reader snapped back to the recitation. The flag now lives in the playback module next to the recitation, with the last ayah seen on the pages, so leaving it by any link stops the following."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "While audio plays, the reader turns pages with the ayah being read until the reader turns away. On the phone the Reader stays mounted, so useState worked; on the website each /quran/read/N is a new ReaderView, and the state reset on the turn it was meant to remember."
approach: "Keep the flag outside the page component (src/lib/listen.ts: setFollowing, shouldFollow, useFollowing). 'Landed' = the ayah last seen on the pages: if it was shown, then is not while the same ayah plays, the reader left it (arrows, index, any link), so following stops until the back-to-the-ayah pill."
outcome: "solved"
conditions: "Next.js 15 app router; ReaderView keyed by page. Found by the review subagent, not by a test: the e2e stayed on one page."
evidence: "src/lib/listen.ts (follow), src/app/quran/read/ReaderView.tsx (shouldFollow effect)"
implication: "Before keeping UI state in a page component, check whether a route change remounts it. State that must outlive a page (a playing recitation, a mode) belongs with the thing it describes, outside the page."
date: "2026-11-17"
topics: ["ui-state","agent-review"]
---

A second slip in the same feature: a reset that runs only when the recitation stops (an effect on `listening` becoming null) never runs if nothing was playing, so a flag turned off by a jump stayed off for the next recitation. A new recitation now turns following on where it starts.
