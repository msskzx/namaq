---
title: "Questions mixed into one quiz can answer each other"
summary: "Each question kind hid its own answer, but a recite question naming «يس ٢٠» gave away a which-surah question on the same ayah, and a party question's key named the surah."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "Mixing several question kinds in one quiz: each kind picks its ayat on its own and hides its answer, yet another question in the same quiz, or a field nobody draws, can show it."
approach: "mixQuestions skips a question whose ayat another picked question already asks (questionAyat: a tree's places, a choice question's ayah), with three times the needed candidates drawn so the quiz still fills; the party view replaces the question key with q<index> until the reveal, beside the blanked answer fields."
outcome: "solved"
conditions: "Which surah, recite the rest and the trees mixed in one quiz (2026-11-13). Recite names the surah; tree feedback labels every ayah with its surah; which-surah keys were SURAH:<surah>:<ayah>."
evidence: "shared/quiz/choiceKinds.ts mixQuestions, shared/party/rules.ts viewFor, rules.test.ts"
implication: "When a quiz mixes kinds, check what every other question and every sent field reveals about this one's answer, not only what this question shows."
date: "2026-11-13"
topics: ["agent-review", "ui-state"]
---

The review found that 26 of 50 mixed quizzes over surah 36 asked the same ayah twice. The recite question said «يس ٢٠», and a which-surah question on the same ayah followed. Each kind on its own was right.

In a party, the answer fields were blanked before the reveal, but the key `SURAH:2:34` went to every phone with the question.
