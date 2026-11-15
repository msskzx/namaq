---
title: "A dump's missing page numbers are not always lost text"
summary: "Quranpedia's al-Sa'di dump has no piece for 42 page numbers, which the first build read as 42 lost pages; walking every passage against Shamela's copy of the same edition showed most of those pages sit inside the piece before, and the real losses are seven passages whose piece breaks off, which the build now fills from Shamela."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The al-Sa'di build marked '[…]' wherever the dump's page numbers jumped, so 34 passages showed a gap, and 3:96-97 broke off mid-word. The question was which text was really missing and where to get it."
approach: "turath.io's export of Shamela book 42 (same al-Risala 2000 edition, page numbers as printed, inline ⦗page⦘ marks) has every page. scripts/quran/sadiShamela.ts finds the last 40 letters before each '[…]' in Shamela (letters only, tashkeel and hamza seats folded, ﷺ and similar signs spelled out), and takes what follows up to the text after the gap or the next range marker. 27 of the 34 gaps filled with nothing; seven filled with real text (3:96-97, 4:11-12, 12:110-111 about 10,000 characters, 18:60-82, 24:11-26, 48:29, 61:10-14). The build then walks every passage against Shamela in 60-letter steps and prints any run it lacks."
outcome: "solved"
conditions: "Quranpedia tafsir-book-3 dump 2026-08-10; turath book 42 export pinned by sha256 on 2026-11-15."
evidence: "scripts/quran/sadiShamela.ts, scripts/quran/buildTafsirSadi.ts, shared/quran/tafsirSadiData.test.ts."
implication: "Before calling text missing from a dump, compare it with a second copy of the same edition letter by letter; page numbering gaps and truncation are different faults. A cut-off piece is the one to look for."
date: "2026-11-15"
topics: ["data-sources","tafsir"]
---

The audit also catches false alarms from refrains («فبأي آلاء ربكما تكذبان») matching early; it ignores a jump whose skipped words are in the passage or the one before.
