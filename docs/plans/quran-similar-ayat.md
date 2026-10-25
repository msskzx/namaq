# Similar ayat decisions

A memoriser can confuse short passages with nearly identical wording that a long shared-run finder misses. `/quran/compare` therefore offers similar ayat alongside positional alignment. These are computed candidates, not a scholar's reviewed classification or proof of shared meaning.

## Evidence and matching

- Display the stored Hafs text. The Quranic Arabic Corpus supplies roots and lemmas. Preserve its attribution and license under [attributions](../../src/app/attributions/page.tsx).
- Consider short consecutive ayah windows because one surah may express in two ayat what another expresses in one. Reject padding whose boundary ayah contributes nothing.
- Weight rare content roots more than common particles. A common root with particles alone must not manufacture a match. A long consecutive shared run can independently justify a candidate that length-normalized similarity would miss.
- Exact text across surahs remains useful to a memoriser. Exact within-surah repetition belongs in the separate repeated-phrase view.
- Every highlighted word needs a counterpart. Keep exact wording distinct from root-only matches, and expose counterparts in the word's tooltip. A word with an exact counterpart and a second root-only counterpart keeps both distinctions.

Scoring, thresholds and build optimizations belong in `src/lib/quran/similar.ts`; examples and generated-data checks belong in its tests. Regenerate `similar.json` and `wordKeys.json` with `npm run quran:similar` after changing source data or matching rules.

## Reading and navigation

A surah view lists matches touching that surah. A range comparison includes matches touching both selected ranges. Preserve orientation and original references when reversing a pair.

Shared passages and similar ayat must not show the same evidence twice. Attach the shared-word count to the matching candidate instead of restoring a duplicate passage list. Within-surah exact phrases remain separate because they answer a different question.

The sidebar counts matching pairs, or shared topics in topic mode. A pair appears under both participating surahs. Its expanded/current state follows navigation; ordering and name/number search remain available.

## Deferred

A list derived from books of متشابه القرآن, such as al-Kirmani's البرهان and Ibn al-Zubayr's ملاك التأويل, could supply matches and explanations no root count provides. It requires those works to be parsed first and is not an approved frontend addition.
