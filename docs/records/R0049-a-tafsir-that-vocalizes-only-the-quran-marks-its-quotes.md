---
title: "A tafsir that vocalizes only the Quran marks its own quotes"
summary: "Al-Kashshaf's dump has no quote markers, but its prose is bare and its Quran quotes carry vowel marks, so vocalized runs whose every word is a Quran word could be set as quotes; its headings also name fewer ayat than their passages explain."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The balagha sheet shows al-Zamakhshari's whole passage with his Quran quotes in the Quran font, and lights ayah words only where a lit sentence quotes them. Quranpedia's dump of al-Kashshaf gives plain text: quotes sometimes sit in parentheses, often run inline with no marker at all. Separately, a build that cut passages at the «[سورة … : الآيات a الى b]» headings left ayat in no passage (44:48-50, 26:190-191 and seven more)."
approach: "Wrap a vocalized parenthesis, or a run of tokens with two or more marks each, in ﴿…﴾ when every word's consonant skeleton is in the set of all mushaf words. Leave lines of poetry alone. Extend each passage to the ayah before the next heading, or to the surah's end, and fail the build if any ayah is still uncovered."
outcome: "solved"
conditions: "Quranpedia tafsir-book-346 version 2026-08-10 (Dar al-Kitab al-Arabi, 3rd ed. 1407). 2,970 passages over all 6,236 ayat; 916 lit sentences, 327 placed on ayah words."
evidence: "scripts/quran/kashshaf.ts, scripts/quran/buildKashshaf.ts, scripts/quran/kashshaf.test.ts, shared/data/quran/kashshaf.test.ts"
implication: "When a classical text's printed edition vocalizes only the Quran, the marks themselves find the quotes; guard with the Quran's vocabulary so vocalized proverbs and poetry stay prose. Treat a heading's ayah range as a start, not an end."
date: "2026-11-16"
topics: ["text-matching","source-extraction"]
buildsOn: ["namaq/R0034-a-dump-keyed-by-ayah-can-hold-pages-not-passages","namaq/R0043-a-book-quoting-the-quran-in-its-own-spelling-meets-the-mushaf-by-consonants"]
---

One mark per word was too loose: his prose sometimes marks a single shadda or a case ending to settle a reading, and those words became quotes. Two marks per word and the vocabulary check together kept proverbs such as «أَسْرَعُ مِنْ نِكَاحِ أُمِّ خَارِجَةَ» as prose.

The heading «الآيات ٤٣ الى ٤٧» on al-Dukhan runs on to ayah 50 before the next heading; the edition's headings were added by its editor and are not al-Zamakhshari's own cuts.

## Tried

- Cut passages exactly at the headings' ranges → nine ayat fell in no passage.
- Treat each heading as its own passage → 25 ayat sat in two passages (headings printed twice, ranges overlapping), and the reader showed only the first, some of them empty; a review caught it.
- Mark any token with one vowel mark → glosses with a single shadda were set as Quran.
