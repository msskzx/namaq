# Home and bottom bar sketches

I would pick the study desk, with one suggested task and a choice to read, review or explore.\
It puts the current task before the catalogue and keeps the other continue items within reach.\
The four section tabs and the full directory give every tool a stable home as Hadith grows.\
Books stay visible on the desk and in the directory without taking a tab.\
The tradeoff is less daily discovery on home, so the owner's shelves are better if browsing is the priority.

These are HTML sketches only. No app code, routes, stored state or dependencies change. Both use the app's dark fig palette from `mobile/src/lib/theme.ts`, its bundled Amiri and Hafs fonts, and its emblem. The Arabic layout is 390 CSS pixels wide. There are no profile, login, progress, count or streak elements. The word-count tool remains reachable by name without showing a count on home.

## Compare the proposals

| | Owner's starting idea | Study desk |
| --- | --- | --- |
| Open | [starting-idea.html](starting-idea.html) | [study-desk.html](study-desk.html) |
| First screen | [starting-idea.png](starting-idea.png) | [study-desk.png](study-desk.png) |
| Whole page | [starting-idea-full.png](starting-idea-full.png) | [study-desk-full.png](study-desk-full.png) |
| Organizing idea | Daily circles, continue cards, then a shelf per section | An intent selects the main task; a short desk keeps unfinished work available |
| Discovery | One item each for Quran, Hadith, Tarajim and Books | One daily suggestion; sections and a searchable directory handle deliberate browsing |
| Cost | Books and the later shelves require scrolling | Less content discovery, plus an intent choice when switching tasks |

The study desk changes the organizing principle. It is neither a section-tile grid nor a compulsory daily path. Choosing "أقرأ", "أراجع" or "أستكشف" replaces the main card without adding a feed. There is no completion sequence. The default reading card opens the saved reading place; review opens due forgotten material; exploration opens a daily prophet selection. This works from local state and bundled content, without a recommendation service. [Review](study-desk-review.png) and [exploration](study-desk-explore.png) show the other choices.

The owner's circles contain only changing content: today's juz, an ayah to review, the current adhkar time, and a daily prophet. Saved items and notes belong in the directory, not those circles. The continue group preserves the reading place, recitation and forgotten-word entry points. Each following section shelf has one item and "عرض الكل". Quizzes use their tab and the directory.

The sketches use fixed sample states so reviewers can compare the layouts. "باب العلم" is a proposed Hadith slot, not an imported hadith or a claim about existing Hadith data. Its opened destination is labelled as a navigation preview. The adhkar entry is likewise proposed. Books use the app's real catalogue title "تيسير الكريم الرحمن". Only installed books should appear as offline reading suggestions. An implementation should omit unavailable suggestions, use "ابدأ القراءة" before a first reading place exists, and offer today's recall ayah when nothing is due. It should never invent a saved place or fill an empty shelf with statistics.

## Navigation

The bottom bar reads right to left: Quran, Hadith, home, Tarajim, Quizzes. Home stays in the middle. It preserves the floating frosted pill and colours only the active icon. Small Amiri labels make the new section destinations explicit. The emblem is on the left of the top bar. Search, directory and settings are icon-only buttons on the right.

| From home | Destination and coverage |
| --- | --- |
| Quran tab, or Quran shelf "عرض الكل" | [Quran hub](quran-hub.png). The mushaf leads inside Quran. Its list includes trees and matrix, compare, recite, i'rab, balagha, لطائف, openings, oaths, qira'at, tafsir, audio, search and word counts. Tuhfa and surah order remain available. |
| Hadith tab, or Hadith shelf "عرض الكل" | A small Hadith hub. The proposed reading slot can grow without rearranging home. |
| Tarajim tab, or Tarajim shelf "عرض الكل" | People, prophets' timeline and graphs. Prophet stories move here from the current Quran hub. |
| Quizzes tab | Solo and party. No social profile or results dashboard. |
| Books shelf, desk book row, or directory | Book reader and library, with no Books tab. |
| Top compass or "تصفّح كل ما في نمق" | [Full directory sheet](all-tools-sheet.png). All sections, their tools, saved items, notes, forgotten material, memorized scope and utilities. |
| Top search | The same directory with focus in its search field. [Filtered example](tool-search.png). This sketch searches tool names only; "البحث في القرآن" is the separate content-search entry. |

Both HTML files have working local navigation for the tabs, section lists, intent chips, directory search, daily circles, card menu and settings sheet. Feature entries open a labelled destination preview; the sketches do not reproduce readers, quizzes or graphs. The sheet closes on Escape, its close button or the backdrop, traps keyboard focus and restores it on close. The production `Sheet` already supplies the native dismissal gesture; no drag animation is added here.

## Existing pieces reused

HTML cannot mount Expo's native components directly. These sketches reproduce their visual contracts in one shared stylesheet and script; they do not introduce replacement app components. A production implementation should arrange these existing pieces and pass navigation intents to the real features.

| Existing piece | Where the sketch reuses it |
| --- | --- |
| `mobile/src/ui/TopBar.tsx` | Home header layout, emblem and right-hand actions |
| `mobile/src/ui/IconButton.tsx` | Bare top-bar and card-menu icons, 40px tap target, coloured active icon |
| `mobile/src/ui/TabBar.tsx` | Frosted bottom pill and active-icon treatment, with the proposed destinations |
| `mobile/src/ui/Card.tsx` | Every content card, radius 14, one card colour and rule border; `spine` on the book shelf |
| `mobile/src/ui/Chip.tsx` | The study desk's intent choices |
| `mobile/src/ui/Sheet.tsx` | Directory, search, settings and destination previews |
| `mobile/src/ui/FloatingMenu.tsx`, `ActButton.tsx` | The card's more menu, frosted with labelled icon actions |
| `mobile/src/ui/Button.tsx`, `Text.tsx` | Labelled actions and Amiri typography |
| `mobile/src/components/HomeFeed.tsx` `Stories`, `ContinueReading`, `ForgottenPost` | Daily-circle treatment and the reading/review content roles |
| `mobile/src/components/HomeCards.tsx` `ShelfCard`, `reviewForgotten` | Shelf spine, forgotten-word entry and its review destination |
| `mobile/src/components/recite/RecitePill.tsx` | Existing recitation controls remain in the opened recitation feature; home only links there |
| `mobile/src/components/TreeIcon.tsx` | Existing rotated `GitFork` symbol for trees and matrix |
| `public/brand/namaq-icon-dark.svg` | The existing Namaq emblem |

No cards sit inside cards. The hero's footer is a ruled action, and the desk's other items are plain rows. Floating surfaces use the app's glass tint and blur. There are no scripted transitions or autoplay animations. The shared HTML is a sketch adaptation, not an alternate implementation of `AyahLines`, `TreePager`, `CompareCard` or `StoryMap`. Those features must use their actual components if later embedded, as described in R0031. Text sizes to its contents rather than a clipped fixed-height Quran box, following R0030. Pushed pages should retain their native RTL stacks, following R0047.

## Quran provenance and viewing

`mushaf.js` contains text extracted from `shared/data/quran/mushaf/1.json`, the same bundled Madinah mushaf read by `mobile/src/lib/mushaf.ts`. The extraction accumulates string tokens until each numeric ayah boundary, including across line breaks. The displayed passages are Fatiha 1:2 and 1:5. No Quran text was typed into the HTML or script. `capture.mjs` checks the extracted text against that source and checks Hafs on every displayed passage. Other Arabic uses the app's Amiri files. `icons.js` contains SVGs rendered from the already installed `lucide-react` package, with the app's rotated fork for trees. No fonts, libraries or text sources were added.

Serve the repository root, so the relative font and emblem paths resolve:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/docs/sketches/home-redesign/starting-idea.html` or `study-desk.html`. No network resources are requested beyond this local server. To reproduce the PNGs and run the sketch checks, use the existing Playwright dependency:

```sh
node docs/sketches/home-redesign/capture.mjs
```

The capture script starts its own local server. It uses system Chromium, or `CHROMIUM_PATH` if supplied. First-screen PNGs use a 390 by 844 CSS-pixel viewport at double pixel density. Whole-page PNGs extend the viewport to the content height so the bottom bar appears at the bottom of the overview; these are layout overviews, not a literal phone screenshot.
