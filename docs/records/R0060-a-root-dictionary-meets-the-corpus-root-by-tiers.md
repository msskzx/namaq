---
title: "A root dictionary meets the corpus's roots by tiers of spelling, never across و and ي"
summary: "Al-Raghib files his articles under headings of his own spelling, so a Quranic Arabic Corpus root found its article only when spellings were tried closest first and the first that named any heading decided; a rule that let و and ي stand for each other linked women to forgetting."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Each page word should open al-Raghib's article on its root (al-Mufradat, Turath 23636). The corpus writes roots in Buckwalter with hamza as alif and weak letters as و or ي; his headings write a weak last letter as alif («دعا»، «سما»), a doubled root once («ثجّ»), and some words under headings of their own («برهان» under «بره»)."
approach: "Try spellings in tiers and stop at the first tier that names any heading: the root itself and its doubled last letter once; then a و-root ending in alif or و, a ي-root ending in ي, a weak middle as alif; then the weak last letter dropped. Keep the link only when that tier names exactly one heading. Roots that still miss or land wrong go in a reviewed alias table, each alias checked to name one heading, and each checked by hand against the opening of his article."
outcome: "solved"
conditions: "Turath books-v3/23636.json (sha 35d8257c…) against trees.json roots, 2026-11-18. 1,625 articles; 49,273 of 49,964 rooted page words linked; 111 roots with no heading (اول، ليس، مول، نسو، عصي …) show nothing."
evidence: "scripts/quran/gharib.ts (headingsFor), scripts/quran/buildGharib.ts (ALIASES), scripts/quran/gharib.test.ts, shared/quran/gharib.test.ts"
implication: "When linking a word to a dictionary by root, order the spelling rules from closest to loosest and let the first that hits decide; never let one weak letter stand for the other, and put the exceptions in a checked table rather than a looser rule."
date: "2026-11-18"
topics: ["text-matching","source-extraction"]
buildsOn: ["namaq/R0043-a-book-quoting-the-quran-in-its-own-spelling-meets-the-mushaf-by-consonants"]
---

The first rule tried every spelling at once and kept a word when exactly one heading answered. It linked «نساء» (root نسو) to «نسى», forgetting, and «عصي» to «عصا», a stick, because a tier that let و and ي swap answered with one heading each. It also left «دعو» with two answers («دعا» and «دع»), since dropping the weak last letter was tried beside the alif spelling instead of after it.

Ordering the tiers fixed both: «دعو» stops at «دعا», and the swap tier is gone. The words it used to reach («جزي» → «جزا»، «رضو» → «رضي») are in `ALIASES`, each read against his article.

The Turath export also misplaces some title marks inside words («فلان م[أخ]وذ») and leaves some headings unmarked (إله، رأى، قول، كان), so a heading is a line that is a title alone or two to six letters alone, never a title inside a line.

## Tried

- Every spelling at once, keep when one heading answers → نسو linked to forgetting, عصي to a stick.
- A و/ي swap tier after the alif tier → the same wrong links, one tier later.
- Headings from title marks only → four common roots missing, and words cut where a mark fell inside them.
