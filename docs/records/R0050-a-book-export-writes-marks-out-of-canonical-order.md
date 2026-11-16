---
title: "A book export writes marks out of canonical order"
summary: "Turath's export of al-Itqan writes shadda before fatha, so vowelled patterns typed in canonical order matched nothing until both sides were NFC-normalized; its headings are bare short lines, told from verse by their neighbours."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The balagha sheet shows al-Suyuti's al-Itqan paragraphs under his own headings. Reading kinds 52 to 58 from Turath's export of Shamela 11728, the regex for «النَّوْعُ … وَالْخَمْسُونَ» found no kind at all, though the text looked identical. Then, with kinds found, short lines of poetry were taken for device headings, and one kind's title was a plain line rather than a marked title."
approach: "NFC-normalize the page text and the source file holding the patterns. Read a short line (five words or fewer, no Quran, no closing colon or full stop) as a heading only when neither neighbour is as short as a line of verse (eight words); a kind's title never counts as that neighbour. Generic headings (a note, a rule, a closing word) leave the device heading before them in force."
outcome: "solved"
conditions: "Turath books-v3/11728.json, sha 56e52b86…; Shamela pages 884-1095 less 942. 955 paragraphs, 583 placed on 1,128 ayat."
evidence: "scripts/quran/itqanBalagha.ts, scripts/quran/buildItqanBalagha.ts, scripts/quran/itqanBalagha.test.ts, shared/quran/itqanBalagha.test.ts"
implication: "Before matching vowelled Arabic from any export, normalize both sides to NFC: the same word can be stored with its marks in another order and look the same on screen. A heading in a flat text is known by its neighbours, not by its own length."
date: "2026-11-16"
topics: ["text-matching","source-extraction"]
buildsOn: ["namaq/R0043-a-book-quoting-the-quran-in-its-own-spelling-meets-the-mushaf-by-consonants","namaq/R0049-a-tafsir-that-vocalizes-only-the-quran-marks-its-quotes"]
---

Page 942 is a stray piece under a second title of kind 55, numbered 3/68 and cut by the export («...»); it is left out by id.

## Tried

- Match the kind titles as typed → no match; the export's «النَّوْعُ» stores shadda then fatha.
- Any short line is a heading → half-lines of poetry became device names.
