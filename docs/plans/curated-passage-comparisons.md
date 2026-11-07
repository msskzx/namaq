# Compare two surahs on the متشابه engine

## Decision

`/quran/compare` shows two surahs side by side, one card per similar ayah pair, so a reader can ponder how the same story is told in different words. The pairs come from the متشابه engine (`src/lib/quran/mutashabih/engine.ts`, data in `src/app/quran/branches/mutashabih.json`), the same engine behind `/quran/branches`. Compare adds no matcher of its own, so the two pages always agree.

`src/lib/quran/mutashabih/pairs.ts` turns the engine groups into cross-surah ayah pairs. A group stores word links from its first place to every other place; links between two other places are composed through the first one, and a word pair takes the weaker of the two levels. Pairs inside one surah stay on the branches page.

## The page

- The top bar holds the pair's title («سُورَةُ الطُّورِ وَسُورَةُ القَلَمِ») and its number of cards. On a phone it opens the list as a bottom sheet; on a desktop the list stays in a side pane and the button focuses its search.
- The list pins hand-picked stories («مختارة»: Adam and the Children of Israel 2/7, Noah, Hud, Salih and Shuayb 7/11, Moses and Pharaoh 7/26, creation and Iblis 15/38), then every surah pair with at least three similar ayah pairs (202 pairs). It is in mushaf order by default; «الأكثر تشابهًا» sorts by count and is remembered on the device. Search takes a surah name, number or story name.
- Each card shows the two ayat with the engine's word marks: exact or same letters in the accent colour, same lemma or root in purple. Tapping a word lights its partner. A tree icon opens the pair in the branches page. The page ends with a link to the next pair.
- There are no ranges, juz' filters, topics or ayah-by-ayah blocks. `?preset=` and reversed or invalid pairs redirect to a valid `?a=&b=`.

The earlier comparison page, with ayah-by-ayah blocks, topics and ranges, stays reachable from the experiments page (`/quran/compare?view=similar`) and from any URL that carries its range or view parameters.

## Validation

Data-level tests check that every pair and matched word comes from an engine group, that a two-place group's pair matches the branches comparison word for word, that counts match and no listed pair is shorter than three cards, and that every pinned story is listed.

Distillate namaq/0021 informs keeping the old entry points reachable when changing exploration defaults.
