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
| `TopBar` | Logo, hub, shelf or back on the right; `title` or `middle` beside back; page buttons; help, sources, gear; see-through, hides on scroll | every screen's top bar, pushed screens included |
| `BarPicker` | A top bar's dropdown: text, chevron, no border; optional icon and count | the open list or item in a top bar (timeline, saved lists, compare, Tuhfa) |
| `motion` (`useSlideAway`, `useHidden`, `hiddenProps`) | The one hide motion: slide off the edge and fade, hide 200ms ease-in, show 260ms ease-out | every bar that hides or comes back |
| `TabBar`, `tabBarSpace` | The floating bottom tab bar and its height | room under content |
| `Sheet` | Rises from the bottom, tap outside or swipe down closes | every sheet |
| `Toggle` | On means knob on the right | every on/off setting |
| `NumberPicker` (+ `NumberList`) | Drop-down number list | picking a number (no steppers) |
| `Text` | Amiri text with the interface scale | every non-Quran text |
| `ExternalLink` (+ `openExternal`) | Opens a page outside the app | every link out of Namaq |
| `Reference` | A book's quote with its page as a link | the sources of a section |
| `LoadingDots`, `LoadingScreen`, `Hourglass` | Small loader, app start screen, quiz timer | waiting |

Coming (docs/plans/shared-first.md): `FloatingMenu`, `Card`,
`Tabs`, `Chip`, `Field` / `SearchField`, `Empty`, one `Loading`.
