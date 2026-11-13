---
title: "A second text may only correct what it can see"
summary: "The King Fahd riwaya texts fixed real slips in the qira'at dump, but they also moved readings their spelling cannot show, so they now correct only a lone riwaya back to Hafs."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "A reading list (Quranpedia's dump) and whole riwaya texts (King Fahd Complex) disagree at some words; letting the texts overrule the list moved riwayat into the wrong group."
approach: "The texts move a riwaya only when the dump sets it apart alone, its own reading is not found in its text, and the only reading found there is Hafs's; al-Bazzi and Qunbul are never moved."
outcome: "solved"
conditions: "Quranpedia qira'at dump 2026-11-07 (20 riwayat, 5,783 word positions); seven King Fahd texts from fawazahmed0/quran-api; comparison by letters and vowels only."
evidence: "scripts/quran/buildQiraat.ts; scripts/quran/qiraatFarsh.test.ts; src/app/quran/qiraat/data/qiraatData.test.ts"
implication: "Before a second source overrules the first, list what its notation cannot express (here: a small sin over sad, a dot for tashil, a doubled ta), and limit the correction to cases where that cannot matter."
date: "2026-11-13"
topics: ["data-sync","text-matching","evidence-model"]
buildsOn: ["namaq/0015-two-sources-that-disagree-are-not-an-error"]
---

The dump names who reads each word; the King Fahd texts print what seven riwayat actually read. A first
pass let the texts overrule the dump wherever a riwaya's text matched another group's reading better than
its own. It fixed real slips, but it also moved Qunbul's سراط (the text marks the sin with a small letter
over the sad), riwayat with tashil between two hamzas (a dot the letter comparison drops) and al-Bazzi's
doubled ta (a mark the texts place differently). Each of those looked like a disagreement only because
the second source writes the reading in a way the comparison cannot read.

The correction is now narrow: a riwaya the dump sets apart on its own, whose own reading does not occur in
its King Fahd text, and whose text reads exactly Hafs's word, goes back to the Hafs group. Every move is
listed in the build's review file.

## Tried

- the texts overrule any group → Qunbul, al-Bazzi and the tashil riwayat moved wrongly
- a separate check script that only reports → 254 disagreements, almost all spelling, too many to review
