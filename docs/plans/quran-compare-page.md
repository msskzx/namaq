# Quran comparison decisions

`/quran/compare` compares wording or topics. Similar ayat are the default text view; `view=ayat` requests positional alignment. [Similar ayat](quran-similar-ayat.md) records why those views remain distinct.

## Alignment

- Use the stored Hafs text for display. Morphology supplies comparison keys, not replacement text. Where corpus and stored word boundaries disagree, fall back to the ayah's normalized letters.
- A root match can connect different wording; preserve that distinction from an exact word match. A shared word can change position without ceasing to be shared.
- Preserve order when aligning ayat. Repeated formulas can produce ambiguous pairings; the diagonal preference preserves parallel refrains instead of chasing an isolated longer phrase. Its weight is a heuristic, not an interpretation.
- Selected equal-length ranges align positionally, even where the text does not match. The separate end-of-surah alignment also counts positions and must say so. A single shared word is visible but cannot establish an anchor.
- Render an ayah once beside all its counterparts. Distinguish the links and retain the root-match cue. Unmatched passages remain available through disclosure.

Numerical thresholds, scoring and grouping belong in `src/lib/quran/compare.ts`, with regression examples beside it. Do not maintain a second algorithm specification here.

## Reading and state

The URL owns the selected surahs, ayah ranges and comparison view. Resetting one range preserves the other range and current view. Choosing a range within one surah is valid; an identical selection on both sides asks the reader to choose different passages.

Keep the original Arabic text when interface language changes. Share PageSpread with other Quran views. Matching explanations can collapse; the unreviewed status stays visible. The [theme guide](../palette.md) owns color meanings.
