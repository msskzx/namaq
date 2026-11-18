---
title: "A partly vowelled reading takes its tashkeel from a riwaya that reads it"
summary: "Quranpedia's dump writes about 900 of its 2,204 non-Hafs readings with only the vowel that differs, or none. Copying the word from the King Fahd text of a riwaya in the reading's group fills 165; the other 444 are vowelled by hand from the dump's own description, each checked by a second reviewer."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "The readings quiz and the reader's readings sheet draw each reading in the mushaf font, and the owner saw choices with partial tashkeel (يُكَذِّبون، يعملون). The owner asked for it to be fixed in the data, not by dropping questions."
approach: "In buildQiraat, after grouping: a reading that is not fully vowelled (every letter marked, except where the Madina page writes none: alif, a madd و or ي, a letter merged into a doubled one, the hidden ن, a word's last letter) is copied from the King Fahd text of a riwaya in its group, in the order Shu'ba, al-Duri, al-Susi, al-Bazzi, Qunbul. The copy must match the reading (sameForm) and no other reading of that word. The rest come from qiraatVowels.json."
outcome: "solved"
conditions: "fawazahmed0/quran-api editions, version 1, 2026-11-18. Qalun's and Warsh's texts follow the Maghribi mushaf (ے for a final ya, ْ for sukun, 42,046 ْ and no ۡ in Qalun) and are not copied. The others mark performance the readings leave out: wasl alif as اَ۬, imala ۪, tashil ۬, a dotless seat ٮ; pageForm turns them back into the page's form."
evidence: "scripts/quran/qiraatVowels.ts, scripts/quran/qiraatVowels.json, scripts/quran/qiraatVowels.test.ts"
implication: "Before vowelling a reading by hand, look for a full text of a riwaya that reads it, and check which mushaf's conventions that text follows. A reading the dump set apart only by performance comes out the same as another once vowelled; join the two instead of showing one reading twice."
date: "2026-11-18"
topics: ["source-extraction"]
buildsOn: ["R0028"]
---

A first check that counted a mark after every letter flagged 15,001 of the 77,629 words of the Hafs pages themselves, because the Madina page leaves a letter bare to show merging or hiding (the ل of ٱلشَّمۡس، the ن of كُنتُمۡ، the م of لَكُم before the next word). The check now follows those conventions and flags 17 page words, all muqatta'at or a merged ط (بَسَطتَ).

Matching by sameForm alone would merge readings the audit split on purpose: هزؤا and هزوا, كفؤا and كفوا differ only in the hamza, which sameForm counts as performance. Readings join only when their vowelled text is the same once pause signs are set aside (not the small sin of وَيَبۡصُۜطُ, which is the reading), and never when one riwaya is named under both (Hafs reads ضَعۡف and ضُعۡف at 30:54). The build fails when a reading is left unvowelled or a hand entry matches no reading.

The hand reviewers also found a few groups whose riwayat do not all read the text given (56:48 أو آباؤنا, 3:57 Rawh, 6:145 Warsh and Khalaf, 10:16 Qunbul, 6:90 Hisham). That is a grouping problem, not a vowelling one; those words are kept out of the quiz until the grouping is corrected from al-Nashr.
