---
title: "A printed page is found again in a built book by its letters"
summary: "The book reader needs each printed page's start inside passages that the builders cut, tidied and filled; matching the first letters of each dump page, after the page before, finds 99.9% of them with no change to the builders."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The book reader turns al-Sa'di, al-Kashshaf and al-'Ukbari page by page as printed, but their data keeps passages, not pages: the builders joined the dump's page pieces, dropped headings, footnotes and quoted ayat, marked Quran quotes and filled gaps from Shamela, so offsets into the dump no longer point into the text."
approach: "Read the same dumps again, clean each page with its book's own cleaner, and look for the page's first 24 letters (letters only, alif, ya and ta marbuta forms alike, vowel marks gone) in the passages' letter stream after the previous page's start. If those letters were dropped, try the next 24, then walk back while letters still agree. Only accept a match within a reach of the cursor; snap the break to the start of its word. Pages never found join the page before."
outcome: "solved"
conditions: "Quranpedia dumps version 2026-08-10. Al-Sa'di 857 of 857 pages, al-Kashshaf 2,882 of 2,886, al-'Ukbari 1,304 of 1,308 (its four front-matter pages)."
evidence: "scripts/quran/bookPages.ts, scripts/quran/buildBookPages.ts, scripts/quran/bookPages.test.ts, shared/bookReader.test.ts"
implication: "To recover positions a pipeline of text edits lost, align by letters rather than thread offsets through every edit. Bound how far a match may jump: short keys from front matter matched far ahead and dragged the cursor past hundreds of pages."
date: "2026-11-16"
topics: ["text-matching","source-extraction"]
buildsOn: ["namaq/R0034-a-dump-keyed-by-ayah-can-hold-pages-not-passages"]
---

The page breaks live in a small file of their own (shared/data/quran/bookPages.json, 80 KB) beside the books, as [passage, offset, part, page]; a test checks every break starts a word and al-Baqara opens on page 40.

## Tried

- 16-letter keys and a 60,000-letter window: al-'Ukbari's front-matter pages matched common phrases far ahead, the cursor jumped, and 1,269 of 1,308 pages were lost.
- A reach of 3,000 letters past the previous page: al-Sa'di lost 23 pages where his dump lacks pieces that Shamela filled. A reach of 20,000 letters plus twice the page's own length lost none.
