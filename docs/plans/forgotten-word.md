# Forgotten words

Mark one Madina page word forgotten from its long-press menu and undo it there. Keep the ayah action. Store its zero-based position as `surah:ayah:word` alongside the existing offline ayah marks, without text. Reuse the forgotten band token and retain rose for pressed and recited words. Add no controls or signs to the reading area.

Include word marks in the forgotten shelf and due review. A word review shows its ayah with only that word hidden and tests it through `useRecite` and `RecitePill`. Remembered words follow the existing 1, 3, 7, 30 day review rests. Wrong answers reset that word's schedule without marking its whole ayah. Undo deletes only that position.

Affected paths: shared ayah marks and recite logic; mobile reader, ayah lines, home cards/feed and navigation intents. Reuse ActButton, MushafPageView, AyahLines and the recite pieces. Quran text stays in the pages and comes from the existing shared lookup functions.

Validate storage, distinct words and ayat, undo, due dates, wrong/correct review, hizb indexing and review navigation. Run lint, root and app type checks, all unit tests, build and UI tests. Capture light and dark reader and review screenshots. A fresh agent reviews the diff before one PR targeting main.

Records used in planning: R0054 for checking every recite caller, R0057 for counting page words without treating the hizb sign as a word.
