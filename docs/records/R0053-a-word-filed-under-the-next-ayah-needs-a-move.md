---
title: "A word filed under the next ayah needs a move, not a replacement"
summary: "The al-Nashr audit of al-Imran to al-Nas found qira'at words stored under the following ayah and words the dump never had; the corrections file could only replace an entry in place, so it learned to add and drop."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "28 confirmed mismatches: wrong riwayat, a riwaya named nowhere (Warsh three times), neighbouring words glued into a reading (كثير ويعلم، المعارج تعرج), words stored one ayah late (زبورا, كبيرا, فواق, مستقر, لبدا), and words missing outright (شنآن twice, علي, كفوا, every هزوا)."
approach: "Each correction is checked against the al-Nashr text (IslamHouse searchable copy, scan where the copy is garbled) and, for the seven riwayat with King Fahd texts, against those. qiraatCorrections.json now takes `at: null` to add a word and `replacement: null` to drop one; a late word is dropped from the next ayah and added to its own. Readings no longer carry a word from a neighbouring ayah. The build now checks every corrected word against the Hafs text at its position and fails if two words in an ayah overlap."
outcome: "solved"
conditions: "Quranpedia qira'at dump 2026-11-14; al-Nashr vol. 2 ed. al-Dabba; audit docs/audits/2026-11-16-qiraat-nashr.md (296 positions)."
evidence: "al-Durra and Tahbir al-Taysir on shamela.ws (books 7749, 5556); scripts/quran/qiraatCorrections.json; scripts/quran/buildQiraat.ts; shared/quran/qiraatData.test.ts"
implication: "When the dump anchors a word on the first word of an ayah, check the last word of the ayah before it. Hafs's waw in هزوا and كفوا is farsh in al-Nashr («فروى حفص إبدال الهمزة فيهما واوا»), not hamza usul, so those words belong in the data."
date: "2026-11-16"
topics: ["evidence-model","source-extraction"]
buildsOn: ["namaq/R0033-a-reader-book-has-more-routes-than-the-dataset"]
---

The dump quotes the phrase al-Nashr names, and al-Nashr often names a word with the word after it
(«مستقر ولقد», «مالا لبدا»). The generator anchors the phrase where it ends, so مستقر landed on 54:4's
ولقد. A replacement keyed by ayah and position cannot fix that: the entry has to leave 54:4 and appear in
54:3. The same glue put the reading of طوى (20:12) inside وأنا (20:13), and يحسب (90:7) inside لبدا (90:6).

The searchable al-Nashr text has slips the scan does not (وفرضناها adds ابن عامر, نحسات says ابن جعفر). Check
the scan before calling the data wrong on one of those.

Ibn Jammaz at شنآن: al-Nashr gives him sukun by al-Hashimi and fath by the other routes. Al-Durra's line 99
«وشنآن سكن أوف» puts the code letter أ (Abu Ja'far, both rawis) in أوف. Ibn al-Jazari's *Tahbir al-Taysir*, whose
routes al-Durra versifies, takes Ibn Jammaz through Sulayman ibn Dawud al-Hashimi (pp. 84, 86). So he reads
sukun with Ibn Wardan.

Al-Nashr also reports a khulf for Ibn Wardan in العسر/اليسر. Al-Durra's line 74 «والعسر واليسر أثقلا» puts the
code letter أ in أثقلا, naming Abu Ja'far whole, and *Tahbir* (p. 214) gives him the damma with no khulf.

Al-Duri 'an Abi 'Amr's second reading at 3:115 is a Tayyiba route. *Tahbir* (p. 238) gives the ya to Hafs,
Hamza, al-Kisa'i and Khalaf and the ta to the rest, Abu 'Amr included, and the King Fahd mushaf of al-Duri 'an
Abi 'Amr prints the ta.

## Tried

- replace the 54:4 entry with a new `at` → the word is still shown on the wrong ayah
