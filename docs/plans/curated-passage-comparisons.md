# Compare two surahs on the متشابه engine

## Decision

One engine, with criteria for each feature. The متشابه engine (`src/lib/quran/mutashabih/engine.ts`) aligns two ayat word by word and matches words by letters, lemma or root. The branches page asks it for long, near-identical ayat (`MATCH_CONFIG`). The compare page asks the same alignment for shorter ayat that share their wording (`COMPARE_CRITERIA` in `src/lib/quran/mutashabih/similar.ts`):

- at least 3 matched content words (words with a root), covering at least 35% of the content words of the longer ayah, or every content word of both ayat when there are only two;
- the matched roots are rare enough together: the sum of log(ayat / ayat with the root) is at least 7, so «قال … رب العالمين» alone does not link two ayat.

`npm run quran:compare-pairs` writes the pairs to `src/app/quran/compare/pairs.json` (6,225 pairs). At-Tur/Al-Qalam has 6 pairs, Al-A'raf/Ash-Shu'ara 24. After the in-order alignment, a second pass marks same-lemma words whose order crosses (هودا … إبراهيم / إبراهيم يهوديا); it does not count towards the criteria, because crossing «الله» and «قال» would link far too many ayat. `LEMMA_ALIASES` joins lemmas the corpus spells apart (يهوديا and هودا).

Rules cannot tell shared meaning from shared vocabulary, so curation runs after the engine. `src/lib/quran/curation/comparePairs.json` holds a reader's verdict on each pair (keep, or only shared vocabulary) with a one-line reason; the page leaves out dropped pairs, and `?review=1` shows every pair with its verdict. The first pass covers Al-Baqara/Al Imran (40 of 78 kept). Pinned stories, and later hand-made story ranges, are curation too, and any of the three features can use it.

`npm run quran:compare-cards` builds every card once into `src/app/quran/compare/compareCards.js`: pair ids, tree links and word marks, with no ayah text or verdicts, which the page joins back in. Re-run it when a verdict's `keep` or `alone` changes; a test fails when the file is stale. Checking a card or editing its reason needs no re-run. It is a `.js` file of `JSON.parse` because TypeScript runs out of memory inferring a type from JSON this large.

`src/lib/quran/mutashabih/pairs.ts` orders the pairs, groups them by surah pair and links a pair to its branches family when one family holds both ayat.

## The page

- The top bar holds the pair's title («سُورَةُ الطُّورِ وَسُورَةُ القَلَمِ») and its number of cards. On a phone it opens the list as a bottom sheet; on a desktop the list stays in a side pane and the button focuses its search. In mushaf order the list groups pairs under each of their surahs, collapsed except the current one.
- The list pins hand-picked stories («مختارة»: Adam and the Children of Israel 2/7, Noah, Hud, Salih and Shuayb 7/11, Moses and Pharaoh 7/26, creation and Iblis 15/38), then every surah pair with at least three similar ayah pairs (738 pairs). It is in mushaf order by default; «الأكثر تشابهًا» sorts by count and is remembered on the device. Search takes a surah name, number or story name.
- Each card shows the two ayat with the engine's word marks: exact or same letters in the accent colour, same lemma in purple, same root only in a faint purple (the words may differ in meaning, «بين» and «بيان»). A book icon opens each ayah in the reader. Tapping a word lights its partner. A tree icon opens the pair in the branches page when the branches page has it. The page ends with a link to the next pair.
- Kept pairs that continue each other become one range card (7:106-125 with 26:31-50; `pairChains` in `src/lib/quran/mutashabih/pairs.ts`): both sides move forward by at most 4 ayat, and neither side runs more than 2 ayat ahead of the other. Runs whose ayah ranges overlap on one side and overlap or touch on the other join into one card (69:3-4 with 101:1-3). A pair sharing an ayah but sitting far away keeps its own card. A verdict with `alone: true` in `comparePairs.json` keeps that pair on its own card by hand, for merges the rule gets wrong (7:70 with 11:62). The ayat between matches are shown unmarked, verdicts stay per ayah pair, and a saved card is recognised by its ayat on both sides, so it stays saved when verdicts change a range.
- An ayah paired with several far ones becomes one card (10:72 with 26:109, 127, 145, 164, 180). The many side stacks all its ayat, muted except the selected one, which starts as the first; selecting another moves the word marks to that pairing. It is one level only, range cards take their pairs first, and verdicts stay per ayah pair.
- There are no juz' filters, topics or ayah-by-ayah blocks. `?preset=` and reversed or invalid pairs redirect to a valid `?a=&b=`.

The earlier comparison page, with ayah-by-ayah blocks, topics and ranges, stays reachable from the experiments page (`/quran/compare?view=similar`) and from any URL that carries its range or view parameters.

## Validation

Data-level tests check that the stored pairs are what the engine finds today, the six At-Tur/Al-Qalam pairs, that pairs sharing only common words are left out, that branches links point to a family holding both ayat, that counts match and no listed pair is shorter than three cards, and that every pinned story is listed.

Distillate namaq/0021 informs keeping the old entry points reachable when changing exploration defaults.

## Next steps

In this order, agreed with the owner on 2026-11-07:

1. Finish the verdict review of every pair in `src/lib/quran/curation/comparePairs.json`.
2. After the review, a surah pair gets its own compare page only with 3 or more kept ayah pairs, counted after review rather than from the engine's pairs. A merged card counts each of its pairs. Pairs on the pages below that belong to `/branches`.
3. `/branches` and `/compare` stay separate. Branches answers where else this wording occurs, for memorization. Compare answers how two surahs tell the same thing, for tadabbur. Link both ways: compare cards already link to their tree; trees gain an "also in compare" link.
4. Curate the `/branches` trees with an agent pass, then the owner's review. Compare verdicts are a hint, not the rule: formula endings dropped in compare (عزيز حكيم against عليم حكيم) are often the hard part for memorizers.
5. Curated word links: `src/lib/quran/curation/compareLinks.json` holds links by hand or from a book of متشابه (`source`), which win over the engine's on the same words and add the pair if the engine has none. The first is 3:40 with 19:9. A later pass adds more from the owner and the books. Re-run the cards script after editing it.
6. Passage pass: recover matches the old matcher found across ayah boundaries or in short ayat, judged by meaning, then reviewed by the owner. Juz 25-30 with both sides in range is drafted (`npm run quran:passage-pairs` writes `src/app/quran/compare/passagePairs.json`, 657 ayah pairs); the 1,001 old pairs with only one side in juz 25-30, and the earlier juz, wait until the owner has seen samples.
7. Animation on the compare page (what animates to be decided with the owner).
