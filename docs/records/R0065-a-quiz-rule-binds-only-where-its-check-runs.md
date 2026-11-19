---
title: "A quiz rule binds only where its check runs"
summary: "The rule that a question must not give its answer away lived in docs/quiz-question-review.md, written for the reviewed bank in data/quiz. The quiz kinds built in code in shared/quiz never passed through that review, so new kinds shipped questions like «أين كانت سرية أبي سلمة إلى قطن؟» and «ما صلة عمر بن أبي سلمة بأبي سلمة؟». The rule now sits in AGENTS.md for every kind, and giveaway.test.ts runs every registered kind."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The owner had stated the rule when the website quizzes were built, and it was in the repo, yet the 2026-11-18 kinds (tarajim ties, sira, qira'at, meanings) broke it. Each kind's author checked their own kind by hand for some cases (virtues naming their owner, hadith naming their Companion) and missed others; nothing tied the rule to a kind's code."
approach: "Read every kind's questions over the whole Quran with one shared check (givesAway: the right choice written in the question and no wrong one; the right choice alone holding a second reading), then by hand for what only the subject shows (names that tell a tie, a Hafs page showing 'Asim's reading, a story named by its surah). Fixed in each builder; the generic check runs over CHOICE_KINDS in a test, with each flagged question that was read and found fair listed with why."
outcome: "solved"
conditions: "CHOICE_KINDS as of 2026-11-19 (22 kinds). The generic check cannot see knowledge-based leaks; those stay with the kind's own test and the twenty-question read AGENTS.md asks of author and reviewer."
evidence: "shared/quiz/giveaway.ts, shared/quiz/giveaway.test.ts, AGENTS.md \"Quiz questions\""
implication: "A rule kept in a doc for one pipeline does not reach code that makes the same thing another way. Put a rule where every producer passes (a registry-wide test), and name in AGENTS.md what the test cannot see."
date: "2026-11-19"
topics: ["quiz"]
buildsOn: []
---

Seen leaks, for the next kind's author: a name holding the answer («غزوة خيبر» asked where; «جبير بن مطعم يسمع سورة الطور» asked which surah), names telling a tie («بن», «أم/أبو» the same kunya), the page already showing the answer ('Asim on a Hafs mushaf), the ayah saying the meaning next to the word («هذا عذب فرات»), an ayah saying its surah's name («هودًا»), and one choice longer or with «وقيل …» where the others are bare.
