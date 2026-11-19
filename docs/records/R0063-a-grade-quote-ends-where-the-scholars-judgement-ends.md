---
title: "A grade quote ends where the scholar's judgement ends"
summary: "Ibn Rajab's discussion of a hadith's routes runs for pages and turns more than once. A quote cut at a favourable clause («وبعضُ طرقه جيدة») read as praise of the route al-Nawawi cited, when Ibn Rajab meant other Companions' routes after weakening that one. The second reviewer caught it; the quote now ends where his judgement of al-Nawawi's route ends."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "The hadith page shows each scholar's grade for the Forty outside the Sahihayn in his own words. Ibn Rajab's words are a span of his chapter, from a start phrase to an end phrase chosen by the agent; a span can end on a clause that says the opposite of his verdict on the route shown."
approach: "data/hadith/forty-map.json names each span by its first and last words (say/to); scripts/hadith/buildForty.ts takes the printed text between them, so nothing is retyped. The end phrase is chosen at the end of a sentence where his verdict on the route al-Nawawi cites is complete, never mid-sentence and never on a clause about another Companion's route. A reviewer reads each span against the chapter for a reversal after it."
outcome: "solved"
conditions: "Ibn Rajab, Jami' al-'Ulum wal-Hikam, Risala 1417, turath 4268; al-Nawawi's Forty nos. 11–42 outside the Sahihayn, 2026-11-19."
evidence: "data/hadith/forty-map.json (no. 27 «ولكنه لم يدرك وابصةَ، والله أعلم.»), scripts/hadith/buildForty.ts quoteIn, shared/quiz/hadith.test.ts"
implication: "When quoting a scholar's judgement from a long discussion, read on past the end phrase: if the next sentence turns or names another route, end before the turn or after the whole of it. A grade a compiler reports from his teacher (al-Tirmidhi's «قال محمود») goes under the teacher's name."
date: "2026-11-19"
topics: ["source-extraction"]
buildsOn: ["R0050"]
---

Search for the span by its words with each word's marks put in one order (R0050): the edition types shadda before or after the vowel in different places, so a phrase copied from one page does not match another byte for byte. The quote shown is still the printed slice.

A paragraph the build joins across a page break keeps where the page turned, so a quote that ends on the next page names it (no. 12 ends on 1/288, not 1/287).
