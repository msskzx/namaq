# Compare two surahs on the متشابه engine

## Decision

One engine, with criteria for each feature. The متشابه engine (`src/lib/quran/mutashabih/engine.ts`) aligns two ayat word by word and matches words by letters, lemma or root. The branches page asks it for long, near-identical ayat (`MATCH_CONFIG`). The compare page asks the same alignment for shorter ayat that share their wording (`COMPARE_CRITERIA` in `src/lib/quran/mutashabih/similar.ts`):

- at least 3 matched content words (words with a root), covering at least 35% of the content words of the longer ayah, or every content word of both ayat when there are only two;
- the matched roots are rare enough together: the sum of log(ayat / ayat with the root) is at least 7, so «قال … رب العالمين» alone does not link two ayat.

`npm run quran:compare-pairs` writes the pairs to `src/app/quran/compare/pairs.json` (6,699 pairs, 771 surah pairs with 3 or more). At-Tur/Al-Qalam has 6 pairs, Al-A'raf/Ash-Shu'ara 25. Curation (pinned stories, later hand-made story ranges) is a separate step after the engine, and any of the three features can use it.

`src/lib/quran/mutashabih/pairs.ts` orders the pairs, groups them by surah pair and links a pair to its branches family when one family holds both ayat.

## The page

- The top bar holds the pair's title («سُورَةُ الطُّورِ وَسُورَةُ القَلَمِ») and its number of cards. On a phone it opens the list as a bottom sheet; on a desktop the list stays in a side pane and the button focuses its search.
- The list pins hand-picked stories («مختارة»: Adam and the Children of Israel 2/7, Noah, Hud, Salih and Shuayb 7/11, Moses and Pharaoh 7/26, creation and Iblis 15/38), then every surah pair with at least three similar ayah pairs (771 pairs). It is in mushaf order by default; «الأكثر تشابهًا» sorts by count and is remembered on the device. Search takes a surah name, number or story name.
- Each card shows the two ayat with the engine's word marks: exact or same letters in the accent colour, same lemma or root in purple. Tapping a word lights its partner. A tree icon opens the pair in the branches page when the branches page has it. The page ends with a link to the next pair.
- There are no ranges, juz' filters, topics or ayah-by-ayah blocks. `?preset=` and reversed or invalid pairs redirect to a valid `?a=&b=`.

The earlier comparison page, with ayah-by-ayah blocks, topics and ranges, stays reachable from the experiments page (`/quran/compare?view=similar`) and from any URL that carries its range or view parameters.

## Validation

Data-level tests check that the stored pairs are what the engine finds today, the six At-Tur/Al-Qalam pairs, that pairs sharing only common words are left out, that branches links point to a family holding both ayat, that counts match and no listed pair is shorter than three cards, and that every pinned story is listed.

Distillate namaq/0021 informs keeping the old entry points reachable when changing exploration defaults.
