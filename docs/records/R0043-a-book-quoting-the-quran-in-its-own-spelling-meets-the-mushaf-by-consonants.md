---
title: "A grammar book quoting the Quran in its own spelling meets the mushaf by consonants"
summary: "Al-'Ukbari's headings name Quran words in standard spelling, so finding them in the mushaf's Uthmani words worked once both were cut to consonants and searched first among the quoted ayat."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The i'rab sheet must show al-'Ukbari's passage under the word it parses. His headings «قوله تعالى: (كُفُوًا أَحَدٌ)» are vocalized standard Arabic; the reader's words are Uthmani rasm with marks the book never uses (open tanwin U+08F0-08F2, dagger alif, small waw), and the book names the ayah only in an earlier «قال تعالى» quote whose number format varies."
approach: "Compare consonant skeletons: strip vowel marks including U+08D3-08FF, then drop alif, waw, ya and hamza seats, and allow one leading ف, ل, ب or ك to differ. Search the heading in the last quote's ayat (or, when that quote is behind the last ayah found, around that ayah), then three either side, then the next 20 ayat, taking a hit there only when it is unique. Read quote numbers inside and right after the parenthesis, single or double."
outcome: "solved"
conditions: "Quranpedia e3rab-book-309 version 2026-08-10 against morphology.json 2026-11-14 (corpus Uthmani text). 5,795 passages, 5,616 on words, 179 on whole ayat, 63 line headings merged into the passage before; 14 passages still sit on an ayah well before the one ahead of them, some of them al-'Ukbari's own look back."
evidence: "scripts/quran/irabUkbari.ts, scripts/quran/irabUkbari.test.ts, shared/quran/irab.test.ts"
implication: "To place a book's Quran quotes on mushaf words, match consonant skeletons within the book's own ayah context before searching wider, and include the Arabic Extended-A mark range when stripping marks."
date: "2026-11-15"
topics: ["text-matching","source-extraction"]
buildsOn: ["namaq/R0034-a-dump-keyed-by-ayah-can-hold-pages-not-passages"]
---

The first pass placed 2,964 of 4,737 passages on words. Three things held the rest back. The mushaf text writes tanwin with the open forms in Arabic Extended-A (ࣰ ࣱ ࣲ), outside the usual U+064B-065F range, so «مُّحَمَّدࣱ» never met «مُحَمَّدٌ». About a fifth of the quotes put the ayah number after the closing parenthesis, «(…) (٨٢).», so the ayah context lagged one quote behind and later headings were searched in the wrong ayah. And much of the book names words inline, «وَ (هَلُوعًا) : حَالٌ», without «قوله تعالى».

Dropping alif, waw and ya from both sides is what makes the rasm and the book's spelling meet («ٱلصَّلَوٰةَ» and «الصَّلَاةَ» both become «صله»). Within one ayah, collisions are rare enough that the first run of matching words is the right one.

## Tried

- Match after stripping only U+064B-065F and U+06D6-06ED → tanwin in Extended-A blocked every word that carried it.
- Read quote numbers only inside the parenthesis → passages after «(…) (٨٢).» landed on the ayah of the quote before.
- Search the whole surah for a unique match → a word spelled with a prefix the match did not forgive («رَءُوفٌ» for «لَرَءُوفࣱ») landed on a later ayah that has it bare (2:143 → 2:207); a review found it by listing passages that run back in book order.
- Leave unmatched line headings as new passages on the quoted ayah → cross-references to other surahs («[الأنعام: ١٥٣]») became passages on al-Baqara; they now stay in the passage before.
