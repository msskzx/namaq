# Shared first: one home for every UI piece

Owner, 2026-11-17: the same control keeps getting built again, so features drift.
Rule agreed: **shared first.** Every control or component lives in one shared
place; screens only arrange shared pieces. A missing variant becomes an option
on the shared piece, never a copy.

This file is the inventory (what is built more than once today), one home and
a merge plan for each, the AGENTS.md rule, and the guard. The owner agreed the
guard on 2026-11-17; step 1 (the shared folder), the rule and the guard are in
the same PR as this plan. The recite bar is left out (the quiz thread is merging it) and so
is Quran text (the Quran text pipeline owns it).

Counted on `main` at 566cd02.

Recite controls: the quiz thread is building them as `mobile/src/components/recite/`
(`RecitePill.tsx`, `useRecite.ts`) and `src/components/recite/`, over
`shared/quran/recite.ts` and `recitePage.ts`. They replace the copies in
`Reader.tsx`, `HomeFeed.tsx` (Recall), `QuizPage.tsx` + `QuizChoice.tsx` (app) and
`ReaderView.tsx`, `homepage/HomeFeed.tsx`, `quizzes/QuizPage` + `ChoiceParts`
(website). This plan leaves those files to that work; its buttons should come
from the shared `IconButton` once step 2 lands.

## Numbers first

App (`mobile/src`, the focus):

| What | Today | Shared piece today |
| --- | --- | --- |
| Hand-drawn tap targets (`<Pressable>`) | 219 in 63 files | `Button` used by 8 files |
| Icon-only buttons drawn by hand | 74 in 35 files, 11 icon sizes, 5 hit areas, 13 box sizes | `Button variant="plain"` (unused for this) |
| Icon + label buttons drawn by hand | 48 in 31 files | `Button`, `ActButton` |
| Top bars | 2 shared (`TopBar`, `BackBar`) + 5 hand-drawn copies | — |
| Full-screen / pop-up layers | `Sheet` (19 users) + 5 own `<Modal>` | `Sheet` |
| Floating action menus | 2 (`CardMenu` round pill, reader long press radius 12) | — |
| Tab rows (pick one view) | 7 own, 4 different looks | none |
| Card / boxed containers | `CARD` token (radius 14) spread in 27 files, but about 42 more boxes set their own radius (10, 12, 8, …) | a radius token only, no `Card` |
| Chips / pills | 9 in 6 files + `SurahChips` | none |
| Text inputs | 14 in 13 files | none |
| Empty-list messages | 3 own, 3 paddings | none |
| Loading signs | `LoadingDots`, `Hourglass`, `LoadingScreen`, raw `ActivityIndicator` (2 files) | — |
| Toggles | `Toggle` (5 users), no copies found | `Toggle` |

Website (`src`): further along. `Button` has 66 users, but 86 raw `<button>`
remain in 49 files; 6 own dialogs/sheets (`QuizReferenceDialog`, `TabBar`
menu, `ScopeFilter`, `CardMenu`, `Tour`, `AyahActions`); 4 loaders
(`LoadingDots`, `LoadingSpinner`, `InkLoader`, `NavigationLoader`); a shared
`Segmented` (7 users).

## Inventory and merge plan (app)

Each row is one PR. Order: cheapest high-traffic first. Each PR moves callers
onto the shared piece, deletes the copies, and posts before/after screenshots.

### 1. One shared folder (move only) — done
Today `mobile/src/components/` mixes 80 files: primitives (`Button`, `Sheet`,
`Toggle`, `Text`) next to whole features (`Reader`, `QuizPage`, `HomeFeed`).
Nobody can "search the shared folder" when it is this mixed.
**Home:** `mobile/src/ui/` for primitives: Button, ActButton, Toggle, Sheet,
TopBar, Text, ExternalLink, Reference, NumberPicker, Loading. Features stay in
`components/`. Web keeps `src/components/common/` as its shared folder.
**PR:** move files, fix imports, add `ui/README.md` listing each piece with a
screenshot. No look changes.

### 2. Icon button — done
Drift: 74 hand-drawn icon buttons. Icon size 22 (32), 20 (11), 18 (9), 24 (8),
16 (8), 26, 28, 21, 19, 34, 17. Hit area 4, 6, 8, 10, 12. Box 40, 34, 44, 56,
52, 48, 42, 30, 38… Worst: `CompareCard.tsx` (15), `TopBar.tsx` (9),
`screens/book.tsx` (4), `EventPlaces.tsx`, `screens/openings.tsx` (3 each).
**Home:** `IconButton` in `ui/` (one size, one hit area, `active` colours the
icon per the owner's "no square" rule). Built on `Button variant="plain"`.
**PRs:** 2a top bars + sheets, 2b cards (CompareCard, MatrixCard, TreeCard,
HomeCards), 2c the rest.

### 3. One top bar — done (Share and Video sheet headers move with step 4)
Drift: `TopBar` (logo right, buttons, gear left; see-through), `BackBar`
(back chevron right, title, buttons left; solid with a line), and hand-drawn
copies with their own chevron in `screens/prophets/slug.tsx`,
`screens/ayah.tsx`, `BranchSearch.tsx`, `ShareSheet.tsx`, `VideoSheet.tsx`.
**Home:** `TopBar` with a `back` + `title` option (it already has `back` for
search). `BackBar` becomes that option, then is deleted.
**PR:** one.

### 4. Layers: sheet and floating menu (done: 4a sheets, 4b FloatingMenu)
Drift: `Sheet` has 19 users, but `ShareSheet`, `VideoSheet`, `CompareSheet`
each open their own `<Modal>` (slide, full screen or see-through), and
`CardMenu` (round pill bar) and the reader's long-press bar
(`Reader.tsx:410`, radius 12, wraps rows) are two floating menus with the same
job. `Tour` keeps its own overlay.
**Home:** `Sheet` gains `full` (full screen); one `FloatingMenu` holding
`ActButton`s, used by the card menu and the reader long press.
**PRs:** 4a sheets, 4b floating menu.

### 5. Card
Drift: the `CARD` token in `lib/theme.ts:63` is only a radius (14), spread
as `...CARD` in 27 files, each adding its own border, colour and padding.
About 42 more boxed containers set a literal radius instead: 10 (19), 12 (8),
8 (5), 4, 9, 16, 18, 20, 22, 24, 27. The agreed card is 14px, one colour, no
card in a card.
**Home:** `Card` in `ui/` (radius 14, `palette.card`, rule border, padding
options). Smaller boxes (word chips, inputs) are not cards and go to their own
pieces below.
**PRs:** 5a home + library + quizzes, 5b Quran tools screens.

### 6. Tabs
Drift: seven tab rows, four looks: filled accent (`ReaderSheets`,
`BalaghaSheet`), outlined round pill (`WordSheet`, `IrabSheet`), 56×38 radius
12 (`screens/book.tsx`), full-width radius 10 (`screens/oaths.tsx`,
`screens/lataif.tsx`).
**Home:** `Tabs` in `ui/`, same look as the website's `Segmented`.
**PR:** one.

### 7. Chip
Drift: 9 round chips in `Reader.tsx` (3), `CardMenu.tsx` (2), `WordSheet`,
`screens/book.tsx`, `screens/order.tsx`, `screens/oaths.tsx`, plus
`SurahChips` and `FilterFields`, paddings 12/6, 14/2, 10/…
**Home:** `Chip` (selected, removable).
**PR:** one.

### 8. Text field
Drift: 14 inputs. Search fields in `BranchSearch`, `screens/search.tsx`,
`screens/words.tsx`, `screens/book.tsx`, `CompareSheet`, `Utilities`; note
and party fields in `NoteSheet`, `screens/quiz/party/*`. Writing boxes
(`useWriteBoxes`, `QuizTree`, `QuizCompare`) belong to the recite work and
stay out.
**Home:** `Field` and `SearchField` (16px, one height, clear button on the
right).
**PR:** one.

### 9. Empty state and loading
Drift: empty messages in `ComparePager`, `screens/library.tsx`,
`screens/book.tsx` each styled differently; loading by `LoadingDots`,
`Hourglass`, `LoadingScreen` and raw `ActivityIndicator` (`Books.tsx`,
`screens/books.tsx`).
**Home:** `Empty` and one `Loading` (dots inline, full screen for screens).
**PR:** one.

### Website
Same pieces, same order, after the app: raw `<button>` onto `Button`
(worst: `Utilities.tsx` 10, `homepage/Memorized.tsx` 6), one `Dialog` for the
6 own dialogs, one loader. One PR per piece.

## AGENTS.md rule (added as "Shared first")

> ## Shared first
>
> Screens arrange shared pieces; they never draw their own controls. The
> shared folders are `mobile/src/ui/` (app) and `src/components/common/`
> (website); each has a README listing its pieces.
>
> - Before building any button, bar, sheet, menu, card, tab row, chip, field,
>   empty message or loader, look in the shared folder. If the piece is there,
>   use it.
> - If it is there but lacks what you need, add an option to it (a prop), and
>   check every current caller still looks the same. Never copy it.
> - If it is not there, build it in the shared folder first, add it to the
>   README, then use it. A screen-only look is still a shared piece used once.
> - Every PR that touches UI lists, before `Records used:`, a line
>   `Shared pieces: used Button, Sheet; added Chip` (or `none`).

## Guard (second vote taken, owner agreed 2026-11-17)

The first draft only banned importing `Pressable`, `Modal` and the like, and
any `borderRadius`. The second agent prototyped it and showed it was too easy
to get around and too blunt (see the vote below). This version takes all of its
changes.

`shared/sharedFirst.test.ts` (one file for the app and the website), built
like `oneQuranText.test.ts`. Outside `mobile/src/ui/`:

1. **No drawn controls.** Count JSX uses (not imports) of: `Pressable`,
   `Touchable*`, `Modal`, `TextInput`, `Switch`, `ActivityIndicator` from
   `react-native`; `RectButton`, `BorderlessButton`, `Pressable`,
   `Touchable*`, `Gesture.Tap`/`Gesture.LongPress` from gesture handler;
   `BlurView` from `expo-blur`. Aliases, multi-line imports and `require`
   count. `onPress`/`onLongPress` or responder props on `Text`, `View` or
   `Animated.*` count too. `ui/` may not re-export a raw primitive.
2. **No framed surfaces.** A style with a corner radius (any `border*Radius`,
   `...CARD`, or a `.radius` token) together with a border or a
   `palette.card`/`palette.paperDeep` background counts. Literal radius
   numbers count. Shapes that are content, not chrome, are exempt by a short
   named list: `BranchTree`, `TreeCard` nodes, `MushafPageView`, the video
   renderers in `lib/`, `ThemeTiles`.
3. `sharedFirst.baseline.json` lists today's breaks per file with counts. The
   test fails when a file gains a break or a new file appears; counts only go
   down. `UPDATE_BASELINE=1` rewrites it after a merge PR.

Taken after step 1 (move Button, Sheet, Toggle, TopBar, TabBar, `CARD` into
`ui/`), so the shared pieces are not listed as breaks.

Website rules in the same file, outside `src/components/common/`: no
`<button`, `<input`, `<select`, `<textarea`, `<dialog`, `role="dialog"`,
`role="button"`, `popover`, `createPortal`, `fixed` overlays, `onClick` on a
`div`/`span`, or `<summary>` used as a button; `rounded-*` classes counted per
file and only allowed to shrink.

Baseline after the move (`shared/sharedFirst.baseline.json`): app controls 222
in 65 files, app boxes 154 in 61 files, website controls 172 in 76 files,
website rounded corners 286 in 98 files. Checked to fail on: a new button in
an unlisted screen through a multi-line `Pressable as Tap` import, a second
button in a listed file, a `View` with responder props, a `...CARD` box with a
border, a clickable `div` with `rounded-xl` on the website, a box whose
border colour is a template string, `rounded-t-xl`, tappable `Text` with a `>`
in a prop, and a file in `ui/` that imports `Pressable` and exports it again.

### Second vote

An independent agent got the problem, the code and the first draft of the
guard (not this plan's reasoning), prototyped it in a separate worktree and
tried to break it. **Vote: approve with changes.** What it showed:

- An old-style icon button in a new file, even with `Pressable as Tap` on a
  multi-line import, made the test fail. Good.
- A second hand-drawn button in a file already in the baseline passed,
  because the draft counted imports. Counting JSX uses made it fail (11 → 12).
- A button made from `View` responder props, with no primitive imported,
  passed. `Text onPress` already appears 5 times (`CompareCard.tsx:56`,
  `BalaghaSheet.tsx:147`, `MatrixCard.tsx:89`, `:97`, `screens/book.tsx:233`)
  and a responder at `TreeCard.tsx:258`.
- Bars are drawn with `BlurView` (`screens/book.tsx:177` has its own).
- `...CARD` in 27 files hides the radius from a `borderRadius` search, while
  plain radius bans hit tree curves, mushaf bands and the toggle.
- On the website, `onClick` on divs (8), `role="button"` (5), `<summary>` as
  buttons (10), popovers, portals (5 files) and 217 `rounded-*` classes would
  all slip past.

Both votes now agree on the version above. The two agents did not disagree on
anything left in it.
