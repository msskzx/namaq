---
title: "A pair must be named in the quoted sentence, not the one next to it"
summary: "Ayah pairs shown under a book quote came from sentences around the quote, so the page showed links the quote did not make."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "A book passage on why one surah follows another names ayat in several sentences. We quoted one sentence and showed ayah pairs taken from the others, so the card's quote did not support its pairs."
approach: "Check every pair against the displayed quote only. Widen the quote with «…» cuts until it names both ayat, or drop the pair. Match every quote to its cited page in the turath.io text of the book, fuzzily only where an obvious typo of the digital text was corrected."
outcome: "solved"
conditions: "/quran/order: 74 aims from al-Biqa'i and 73 links from al-Suyuti and Ibn al-Zubayr, from Shamela books 9098, 1404, 9992 and 1388. The review found 10 links whose pairs were named outside the quote."
evidence: "Namaq PR for /quran/order (commits 1bcae6d and 5fc5977); shared/quran/surahOrder.ts; docs/plans/quran-order-sources.md."
implication: "When a citation carries derived items (pairs, chips, colours), check each item against the exact text shown, not against the page or passage it came from."
date: "2026-11-13"
topics: ["evidence-model","sources"]
buildsOn: ["namaq/0026-a-citation-does-not-authorize-every-chip"]
---

Al-Suyuti often makes a link in three steps: it names an ayah at the end of one surah, names another at the start of the next, then concludes in a short sentence. The short conclusion read best on a card, so we quoted it and showed the ayat from the earlier sentences. An independent review against the book's pages found that the pairs on 10 of the 73 links were not in the quoted words.

The fix keeps the earlier sentences, with «…» marking each cut, so the reader sees the book name both ayat. The quotes were also checked by script against their cited pages: the text was normalized (diacritics, hamza forms and inline references removed), and fuzzy matching was used only for corrected typos such as «الحدسيد» to «الحديد».

## Tried

- Quoting the concluding sentence and taking the pairs from the same page → the quotes were accurate, but the pairs were not supported by them.
