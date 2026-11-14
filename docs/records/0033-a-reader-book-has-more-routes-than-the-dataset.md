---
title: "A reader book has more routes than the dataset"
summary: "Al-Nashr gives some riwayat a second reading from al-Tayyiba routes; checked against the Shatibiyya routes the dataset follows, four 'doubtful' qira'at entries were right and one correction added a reading too many."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "An audit of the qira'at data against Ibn al-Jazari's al-Nashr flagged entries where the book gives a riwaya two routes and the data names one, and a correction gave Shuba both of his al-Nashr readings of جبريل."
approach: "Name the route scope first: the twenty riwayat follow al-Shatibiyya and al-Durra. Keep a second reading only when it is on those routes, and confirm with the King Fahd riwaya mushaf where one exists (Shuba prints جَبۡرَئِلَ only; Qunbul ميكائيل and al-Bazzi خطوات match the data)."
outcome: "solved"
conditions: "Quranpedia qira'at dump 2026-11-14 (same output as 2026-11-07); al-Nashr vol. 2 ed. al-Dabba; King Fahd texts for seven riwayat from fawazahmed0/quran-api."
evidence: "docs/audits/qiraat-source-audit.md; scripts/quran/qiraatCorrections.json; shared/quran/qiraatData.test.ts"
implication: "Before calling a qira'at entry wrong or incomplete from al-Nashr, ask whether the extra reading is a Tayyiba route; the data's scope is Shatibiyya and Durra."
date: "2026-11-14"
topics: ["evidence-model","source-extraction"]
buildsOn: ["namaq/0028-a-second-text-may-only-correct-what-it-can-see"]
---

Al-Nashr collects every route Ibn al-Jazari accepted, so it often says a riwaya reads a word two ways. The
dataset, like the King Fahd mushafs, follows one route per riwaya, the one in al-Shatibiyya or al-Durra. An
audit that compares the two without naming that scope finds "missing" readings that are not missing.

At 2:97 and 2:98 the dump wrongly put Shuba with Ibn Kathir. The first fix gave him both al-Nashr forms,
جَبْرَئِيل (al-Ulaymi) and جَبْرَئِل (Yahya ibn Adam). Al-Shatibiyya reads Shuba through Yahya ibn Adam
(«وَالْيَاءُ يَحْذِفُ شُعْبَةٌ»), and the King Fahd Shuba mushaf prints جَبۡرَئِلَ, so only that one stays.

## Tried

- give Shuba both al-Nashr routes → a second reading the app's riwayat do not have
- leave four entries "doubtful" pending a scope decision → the scope was already fixed by the riwayat list
