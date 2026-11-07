# Curated passage comparisons

## Decision

Refine the existing `/quran/compare`; retain its matcher, precise-range URLs, TextCompare, CompareView and PageSpread. The primary journey offers curated comparisons rather than a custom pair builder. Existing custom and topic URLs remain usable, but this work adds no topic annotations or new comparison engine.

## Acceptance

- The default compare destination presents curated comparisons and opens a useful initial selection. The curated journey exposes a clear list of choices, not the general topic/range/pair-builder controls.
- Start with Moses and Pharaoh 7:103–137 / 26:10–68; Noah 7:59–64 / 26:105–122; Hud 7:65–72 / 26:123–140; Salih 7:73–79 / 26:141–159; Lot 7:80–84 / 26:160–175; Shuayb 7:85–93 / 26:176–191; creation and Iblis 15:26–44 / 38:71–85. Boundaries were checked against the local Quran text and neighboring verses. Shuayb's passages name different audiences; no shared-audience claim is made.
- The comparison picker sits centred in the top bar. Each choice reads «سُورَةُ الأَعۡرَافِ و سُورَةُ الشُّعَرَاءِ - موسى وفرعون» with «الأعراف ١٠٣–١٣٧ · الشعراء ١٠–٦٨» under it. Curated pages show no title block, legend or match chips.
- Preset URLs contain the exact selected ranges, are shareable, and clear unrelated global filters. Invalid preset IDs recover to the list or a clear unavailable state.
- Reuse the existing renderer. Ayat without a lexical match start hidden; one page button (desktop rail, phone top bar) shows or hides them all, and a hidden group leaves no empty card. Once shown, every selected ayah appears once per side, with correct reference numbers. Label mechanical word links as lexical matches, without asserting editorial narrative alignment.
- The curated journey omits the custom PairForm and by-topic controls. Existing explicitly requested custom and topic modes retain their behavior.
- Offer curated comparisons from the shared desktop side rail and mobile bottom bar. Keep the branches page free of a separate comparison button.
- New controls and text support Arabic/English, both themes, keyboard navigation, shared Button and Lucide icons. Check desktop and phone layouts.

## Validation and review

Protect preset URLs, range bounds, legacy custom links, complete initially visible context, no duplicate ayat, and invalid preset recovery. Independent tests come from this spec. Run lint, TypeScript, all tests, and production build, then an independent code review under the two-cycle cap before opening the PR. Merge after green CI and verify production.

## Evidence

The read-only audit found all selected verses already represented in CompareView rows, but unmatched context starts collapsed. Salih initially showed only one of nineteen ayat on one side. The existing matcher also provides lexical matches between different narrative moments, so its links must remain distinguishable from the editorial selection of the two passages. Existing equal-length positional matching is retained for custom mode.

Distillate namaq/0021 informs preserving old entry points when changing exploration defaults. Distillate namaq/0005 requires independently deriving expected passage coverage from Quran text, rather than checking counts produced by the aligner. Namaq/0018 requires checking the actual navigation destination when adding a link, including lists maintained separately from the shared navigation catalog.
