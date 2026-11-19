---
title: "A reading's quoted context words are trimmed, not shown"
summary: "Quranpedia's dump quotes a word with a neighbour or two («وما يخدعون», «بغيا أن ينزل», «الرحيم مالك» across the end of an ayah) and often quotes the other readings without them. The build now trims the words every reading shares, lines a shorter reading up with the Hafs word it stands for, and moves a difference left wholly in the ayah before to that ayah."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "The owner saw al-Fatiha 4 and al-Baqara 9 show «الرحيم» and «وما» as part of the readings, though every reader reads them alike. 405 differences in 385 ayat carried such words, and 280 one-word quiz questions were hidden behind them."
approach: "scripts/quran/qiraatTrim.ts, run in buildQiraat after vowelling. Edge words are shared when they match up to a context spelling (open or closed tanween, madd, small waw or ya, a written sukun), never a shadda or a vowel. A shorter reading is padded with Hafs's words only when its own words also differ, its letters do not take in a neighbour (the dump's «ماهى» for «ما هيه»), and the phrase does not repeat its word (46:15's two «كرها»)."
outcome: "solved"
conditions: "Quranpedia dump 2026-11-14. About 60 differences the rules cannot settle (real omissions like 9:100 «من تحتها», muqatta'at, readings told in words) are shown untrimmed and listed in the build's review file."
evidence: "scripts/quran/qiraatTrim.ts, scripts/quran/qiraatTrim.test.ts, /mnt/project-files/qiraat-page/trim-diff.md (before and after, reviewed by a second agent)"
implication: "Trimming changes where a difference sits (`at`), so anything keyed by a difference's place (quiz review drops `qiraat:<ayah>:<n>`, corrections tests) must be checked after a rebuild. A trimmed quiz bank grows: run the second-agent sample review on the new questions, which found pronunciation rules (the alif of «أنا», a vowel for two sukuns, a joined plural mim) now filtered in buildAyahQuizzes."
date: "2026-11-19"
topics: ["source-extraction"]
buildsOn: ["R0062"]
---

Two dump entries that quoted the same word alone and with a neighbour (36:9 «سدا») become one once trimmed; two that disagree on the same word (3:80 «يأمركم») are left out, as the build already did for a word listed twice with different readings, until al-Nashr settles them.
