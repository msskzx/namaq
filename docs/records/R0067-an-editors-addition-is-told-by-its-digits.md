---
title: "An editor's addition in an old book is told by its digits"
summary: "Turath's exports of al-Kirmani, al-Iskafi and Ibn al-Zubayr mix the editors' ayah references, entry numbers, footnotes and bracketed insertions into the author's lines. The old authors wrote numbers in words, so every Arabic-Indic digit is the editor's: the build takes out each reference with its surah name, then any digit left, and a test holds the books free of digits and square brackets."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "AGENTS.md ships an old book with the author's words only. The editions mark their additions in many shapes and with typos: «(الإسراء: ٧٥)», «) البقرة ٥٨،», «في سورة الرعد ٣٧:», «(وقب (٣)», «\"٣١\" الآية», «١/ب», «٥٨٧- قوله», «[الرازى]», a reference cut by a page break, and in al-Iskafi two whole pages of the editor's notes among the author's (vol. 1 pp. 404, 467). A pattern per shape always left some behind, and a loose one («any word before a colon and a number») ate the author's surah names («في سورة لقمان»)."
approach: "Take out the shapes that carry words of the editor's (a surah name inside brackets or right after a quote, «الآية: ٢١», «(ينظر …)», square brackets, footnotes after the rule), carry a reference cut at a page's end onto the next page, then remove every digit that is left. Counted the words that went missing per book against Turath's text: nearly all were surah names out of references; read the rest by hand. The two note pages are named in the build script."
outcome: "solved"
conditions: "Turath books-v3 3580, 1340, 1419, pinned by hash in scripts/quran/buildMutashabihBooks.ts, 2026-11-19."
evidence: "scripts/quran/mutashabihBooks.ts, scripts/quran/mutashabihBooks.test.ts, shared/data/quran/mutashabihBooks.test.ts"
implication: "To strip an editor's apparatus from a classical text, find what the author could not have written (here digits) and check its absence in a test, rather than chasing each shape of reference. Count the words removed per book to see that nothing of the author's went with it."
date: "2026-11-19"
topics: ["source-extraction"]
buildsOn: []
---

Some of the editors' work stays because it cannot be told from the author's by its form: a stray «الأنعام» where al-Iskafi's
editor typed «ن» for the closing bracket, and «:...» where a quote was cut short. These are a few words in each book, printed as
the edition has them.
