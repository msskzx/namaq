---
title: "One-to-many compare cards reuse link ids"
summary: "Finding which compare-card links pair words written differently, across all partners of a one-to-many card at once, coloured an exact pair amber, because every partner numbers its links from the same ids; counting only the partner picked fixed it."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The one word rule (docs/adr/0037) finds written pairs on compare cards when they draw (writtenLinks), so the stored cards stay as they are. The first version gathered the exact marks of every partner of a one-to-many card into one map keyed by link."
approach: "manyCard in src/app/quran/compare/buildCards.ts runs wordMarks on each partner alone, so each partner names its links 0-0, 0-1 and so on, and encodeCard maps those strings to the same numbers card-wide. writtenLinks now takes the picked option and reads only that partner's ayah and shared ayah; the app card, the website card and the video pass the option they show."
outcome: "solved"
conditions: "compareCards.js as encoded on 2026-11-14."
evidence: "shared/quran/compareCardLook.test.ts ('written differently' case with a reused link id); shared/quran/compareCardLook.ts writtenLinks."
implication: "A compare card's link id is unique only within one partner of a one-to-many card. Anything that joins marks across partners has to key by partner too."
date: "2026-11-14"
topics: ["text-matching","agent-review"]
---

A second review caught it; the first test gave each partner distinct link ids, so it passed.
