# Shared pieces (app)

Screens arrange these; they never draw their own controls or boxes
(AGENTS.md "Shared first", guard `shared/sharedFirst.test.ts`). Need something
new? Add an option to the piece here, or build a new piece here and list it
below. Never copy one into a screen.

| Piece | What it is | Use it for |
| --- | --- | --- |
| `Button` (+ `Row`) | Filled, outlined or plain button with an icon; `Row` wraps a row of them | every tap that reads as a button, icon-only included (`variant="plain"`) |
| `IconButton` | Icon-only button: `bar` (22 in 40) or `small` (18 in 28), tone muted/ink/accent/green, `on` colours the icon (no square), `round` filled accent circle for a bar's main action, `dot`, `expanded`, `role="link"` | every button that shows only an icon |
| `ActButton` | Icon with its name under it; coloured icon when on | long-press and card menus |
| `TopBar` | Back (or the hub grid, or the shelf) first on the right, then `title` or `middle`, then the page buttons; help at the far left; the logo beside the gear on home only; see-through, hides on scroll | every screen's top bar, pushed screens included |
| `BarPicker` | A top bar's dropdown: text, chevron, no border; optional icon and count | the open list or item in a top bar (timeline, saved lists, compare, Tuhfa) |
| `Card` | The one card: radius 14, one colour, rule border; `pad` (or [top and bottom, sides]), `gap`, `spine`, `dashed`, `outline`, `picked`, `faded`, `clip`; with `onPress` the whole card is one button | every boxed block of content (feed posts, shelves, books, quizzes, Quran tools, sheets, share images) |
| `Tabs` | The website's segmented row: framed, the open tab filled in the accent; `fill` stretches, `iconOnly` | a few views of one thing (read or recite, two books, contents/saved/search, the two kinds of oaths); a wrapping list of words or filters is chips |
| `Chip` | A round framed word to pick in a wrapping row, filled in the accent when on; `lit` (+`tint`) stays framed for Quran words and surahs, `quran`, `check`, `dashed`, `small`, `count`, `onClear` (removable) | filters, settings with several values, topics, an ayah's words, a tree's surahs, a search's terms |
| `Tap` | The one press: a finger that moved more than 10px (a scroll or swipe) never presses | inside every button piece and tappable card; a screen drawing one counts as a control |
| `motion` (`useSlideAway`, `useHidden`, `hiddenProps`) | The one hide motion: slide off the edge and fade, hide 200ms ease-in, show 260ms ease-out | every bar that hides or comes back |
| `GlassBar` | A floating frosted bar of buttons, as tall as one icon button; `small` is a shorter pill sized to small buttons, sharing its row | recite mode's bar (`components/recite/RecitePill`, `small` on the home recall card) |
| `TabBar`, `tabBarSpace` | The floating bottom tab bar and its height | room under content |
| `FloatingMenu` (+ `MenuAt`) | A row of ActButtons over what was pressed, wrapping, above or below the finger; `overlay` dims behind and closes on a tap outside | the mushaf and book long press, the home cards menu |
| `Sheet` | Rises from the bottom, tap outside or swipe down closes; `tall` one height above the keyboard, `full` whole screen with title and close | every sheet, full-screen ones included (share, video) |
| `Toggle` | On means knob on the right | every on/off setting |
| `NumberPicker` (+ `NumberList`) | Drop-down number list | picking a number (no steppers) |
| `Text` | Amiri text with the interface scale | every non-Quran text |
| `ExternalLink` (+ `openExternal`) | Opens a page outside the app | every link out of Namaq |
| `Reference` | A book's quote with its page as a link | the sources of a section |
| `LoadingDots`, `LoadingScreen`, `Hourglass` | Small loader, app start screen, quiz timer | waiting |

Coming (docs/plans/shared-first.md):
`Field` / `SearchField`, `Empty`, one `Loading`.
