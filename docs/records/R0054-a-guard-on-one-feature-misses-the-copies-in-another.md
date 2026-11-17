---
title: "A guard written for one feature misses the same bypass in another"
summary: "#811 fixed the compare tree by building it with the branches rules and added a guard test, but the quiz kept its own tree path: it built trees with the bare trie (createPhrasePresenter) instead of the folded builder, drew every box itself through renderNode, and its settings example blanked the root by hand. The owner saw the same tree bugs in quizzes a day later."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "R0051's guard (shared/quran/oneTree.test.ts) checked that pages build Branch nodes in shared/quran and draw them through BranchTree. The quiz passed both checks while still bypassing the rules: shared/quiz/branchQuestions.ts called createPhrasePresenter (no foldForms, no curated ends), QuizTree and the website's BranchAnswers drew every given node as plain text through renderNode (no end signs, no references), the hint treated an ayah sign (﴿١٧﴾) as the first word, the quiz matrix dropped the words before the tree (يطوف / ويطوف), and the settings example cleared the root's words so its leaves floated with no parent."
approach: "One builder: phraseTrees `createTreePresenter` (createPhrasePresenter + foldForms), used by phrasePresentation and the quiz, with the owner's `ayat: 'own'` verdict applied as on the branches tab (`ownAyat` moved to shared). renderNode returns undefined for every node the quiz does not ask, so BranchTree draws them; an asked node gets only its box, with any leading ayah sign drawn before it. Hints and grading skip signs. The matrix rows carry each ayah's own words before the tree. The settings example draws the real tree and the matrix from the same pieces. The guard now also fails when createPhrasePresenter is used outside phraseTrees/subtrees, and when a quiz renderNode draws given nodes."
outcome: "solved"
conditions: "Quizzes, app and website, 2026-11-17."
evidence: "shared/quran/phraseTrees.ts (createTreePresenter); shared/quiz/branchQuestions.ts; mobile/src/components/QuizTree.tsx, QuizExplainer.tsx; src/app/quizzes/BranchAnswers.tsx; shared/quran/oneTree.test.ts."
implication: "When a fix comes with a guard, grep for every caller of the lower-level function the fix stopped using (here createPhrasePresenter) and every place that overrides drawing (renderNode, nodeContent), not only the feature the owner reported. A guard that checks the drawer but not the builder lets a second feature keep the old path."
date: "2026-11-17"
topics: ["graph-ui","agent-review"]
buildsOn: ["namaq/R0051-one-tree-means-one-builder-not-one-drawer"]
---

The owner (2026-11-17): «The same bug we had in trees is still in quizzes. Why is that?»
