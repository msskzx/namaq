# Namaq logo B

نَمَق in Amiri Bold (SIL Open Font License), with the letters' dots redrawn as terracotta nodes: the dot of the ن and the two dots of the ق, joined, with two open branches leaving the ن. The letters are outlines, so no font is needed to show any file.

| Place | File | Notes |
|---|---|---|
| Homepage hero | `namaq-logo.svg` | Full mark. Inline it: the word is `currentColor`, the dots are `var(--logo-accent, #9c3b22)`. |
| Navbar, footer | `namaq-logo-small.svg` | Same drawing with heavier dots and lines so it holds at 32–44px. Same color tokens. |
| Places that can't inline (`<img>`, emails, slides) | `namaq-logo-light.svg`, `namaq-logo-dark.svg`, `namaq-logo-small-light.svg`, `namaq-logo-small-dark.svg` | Fixed colors. |
| Browser tab | `icon.svg`, `favicon.ico` (16, 32, 48) | Paper tile with the mark. Reads on light and dark tab bars. In Next, drop them in `src/app/` as `icon.svg` and `favicon.ico`. |
| Home screen, manifest | `apple-icon.png` (180), `icon-192.png`, `icon-512.png` | Square paper fill, no transparency, since iOS turns transparency black. `apple-icon.png` goes in `src/app/`. |
| Seal (optional) | `namaq-seal-light.svg`, `namaq-seal-dark.svg` | The mark in a double ring, for a stamp-style use such as a social card or the about page. |

Colors are #405's: ink #2e2219 / #f5eddf, accent #9c3b22 / #eda183, paper #f4ecdb.
All SVGs and the .ico have transparent backgrounds, except the tile icons.

Files live in `public/brand/`.
