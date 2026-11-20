---
title: "A book section's outside quotes are mostly proof, not pairs"
summary: "To find mutashabih pairs the three books discuss but the cases missed, every Quran quote in each section was resolved to an ayah and compared with the case's places. Of 1,541 quotes that landed outside, readers found 16 real comparisons; the rest were proof for a meaning or grammar point, or the next section's heading."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Each section of al-Kirmani, al-Iskafi and Ibn al-Zubayr became one case with the places its question sets side by side. An aside inside the section («ومثله…», «وفي سورة كذا…», a second question) could compare other places, and only reading tells an aside from a proof text («كما قال…»)."
approach: "Resolve each quote in the section to ayat (word-skeleton match over the whole Quran), drop the ones inside the case or already paired by any case, and give the rest to readers with the section. A second reader rechecked every proposal, and a reviewer read the diff; where they split, the pair waits on the owner."
outcome: "solved"
conditions: "shared/quran/mutashabih/evidence.json and the section texts of #1039, 2026-11-20."
evidence: "shared/quran/mutashabih/evidence.json (ids ending in b or c), /mnt/project-files/compare-refine/open-questions.md"
implication: "A section's text ends with the next section's heading, so its quotes look like extras: check them against the next case before reading. Al-Iskafi's quotes end in the editor's ayah number «(١٠٥)», which a bracket pattern misses, so read his sections whole. Strip the editor's references from a new quote (R0067)."
date: "2026-11-20"
topics: ["source-extraction"]
buildsOn: ["R0067"]
---

A new comparison found inside a section becomes its own case (the section's id with a letter), quoting only the author's words where he sets the places side by side, with the printed page those words are on.
