# Namaq logo B

نَمَق in Amiri Bold (SIL Open Font License), with the letters' dots redrawn as terracotta nodes: the dot of the ن and the two dots of the ق, joined, with two open branches leaving the ن. The letters are outlines, so no font is needed to show any file.

| Place | File | Notes |
|---|---|---|
| Homepage hero | `namaq-logo.svg` | Full mark. Inline it: the word is `currentColor`, the dots are `var(--logo-accent, #9c3b22)`. |
| Navbar, footer | `namaq-logo-small.svg` | Same drawing with heavier dots and lines so it holds at 32–44px. Same color tokens. |
| Places that can't inline (`<img>`, emails, slides) | `namaq-logo-light.svg`, `namaq-logo-dark.svg`, `namaq-logo-small-light.svg`, `namaq-logo-small-dark.svg` | Fixed colors. |
| Browser tab | `src/app/icon.svg`, `src/app/favicon.ico` (16, 32, 48) | The icon (below), not logo B. Transparent. `icon.svg` switches to the dark colors when the browser is in dark mode; `favicon.ico` is the fallback in one terracotta pair (#a8432a, #e0875f) that reads on both. |
| Home screen | `src/app/apple-icon.png` (180) | The icon, transparent, in the same terracotta pair so it still reads on the black iOS puts behind it. |
| Manifest | `icon-192.png`, `icon-512.png` | The icon, transparent, terracotta pair. |
| Seal (optional) | `namaq-seal-light.svg`, `namaq-seal-dark.svg` | The mark in a double ring, for a stamp-style use such as a social card or the about page. |

Colors follow [palette.md](palette.md). The dark logo and seal files keep the earlier dark ink #f5eddf and accent #eda183, since their content credentials sign each file.
Every file has a transparent background.

Files live in `public/brand/`.

# Namaq icon

A wordless mark: a calligraphic tree with round terracotta nodes on its tips, rising from the bowl of a ن, which also reads as a crescent. The ن has no dot. The tree is the Distillate logo's tree with its drop removed, its lowest right bough joined to the trunk and its trunk flared into the bowl. One drawing serves every size.

The navbar shows the icon beside logo B. Everywhere else that needs a mark (footer, browser tab, home screen, manifest, link previews) uses the icon alone. The homepage hero keeps logo B as the page's heading.

| Place | File | Notes |
|---|---|---|
| Navbar, footer | `src/components/common/Emblem.tsx` | Inline: the drawing is `currentColor`, the nodes are `var(--logo-accent, #9c3b22)`. |
| Inline elsewhere | `namaq-icon.svg` | Same color tokens. |
| Places that can't inline | `namaq-icon-light.svg`, `namaq-icon-dark.svg` | Fixed palette colors. |
| Link previews | `src/app/opengraph-image.png` (1200×630) | Icon, logo B and the site description on paper, centered so a square crop keeps it. The description lives in `src/lib/siteMeta.ts`. |
