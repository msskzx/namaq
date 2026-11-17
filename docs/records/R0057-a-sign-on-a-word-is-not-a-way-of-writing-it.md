---
title: "A sign on a word is not a way of writing it"
summary: "Rebuilding the tree data from the Madina page text (owner, 2026-11-17: one Quran text, every sign shown) put waqf and sajda signs, the sajda line (U+06E4) and the page's tatweel into every tree word. Code that compared words letter for letter then saw the same word as two: a sajda on 27:26 made al-Naml 26 part from al-Tawba 129 in the compare quiz, a waqf sign braided «ملة إبراهيم حنيفا», the matrix called exact words 'letters', and shared boxes dropped the tatweel."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The older tree text had no waqf signs, wrote hamza seats as one letter (ئ), split «بعد ما» and «إل ياسين» as one word and «لوما», «مالي» as two, and every comparison (likeness, writtenForms, foldForms, the mutashabih engine, the quiz integrity check) compared raw words. Signs, page hamza (يٕ) and new word positions in 7 ayat broke tree ids, curated group ids and those comparisons."
approach: "One `bare()` in shared/quran/quranText/ayahWords.ts takes off the page's signs (U+06D6-06DC, 06DE, 06E4, 06E9) and every 'same word' comparison goes through it. normalizeWord reads the page's hamza on a seat (يٕ, ىٕ, ؤ) as the seated letter, so tree ids stay. Morphology is joined by `corpusWordsAt`, which maps page words to corpus words where the two split an ayah differently. A shared box keeps a sign only where all its ayat carry it, and sharedDisplay keeps tatweel. mushafText passes a word that is already page text through untouched."
outcome: "solved"
conditions: "Trees, matrix, compare and quizzes, app and website, 2026-11-17."
evidence: "shared/quran/quranText/ayahWords.ts (bare, corpusWordsAt); shared/quran/normalize.ts; shared/quran/wordMatch.ts; shared/quran/writtenForms.ts; shared/quran/foldForms.ts; shared/quran/phraseTrees.ts (sharedDisplay); shared/quiz/integrity.ts; src/lib/quran/mutashabih/engine.ts."
implication: "When a text gains marks it did not have, grep every equality on words before trusting the tests: a sign is drawn with the word, never part of how it is written. Check the ids built from positions (comparisonId) for the ayat whose word split changed."
date: "2026-11-17"
topics: ["text-matching","graph-ui"]
buildsOn: ["namaq/R0054-a-guard-on-one-feature-misses-the-copies-in-another"]
---

The owner (2026-11-17): «remove that extra source», after the plan to draw every Quran text as the Madina mushaf prints it, signs included.
