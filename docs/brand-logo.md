# Namaq logo B

نَمَق in Amiri Bold (SIL Open Font License), with the letters' dots redrawn as terracotta nodes: the dot of the ن and the two dots of the ق, joined, with two open branches leaving the ن. The letters are outlines, so no font is needed to show any file.

| Place | File | Notes |
|---|---|---|
| Homepage hero | `namaq-logo.svg` | Full mark. Inline it: the word is `currentColor`, the dots are `var(--logo-accent, #9c3b22)`. |
| Navbar, footer | `namaq-logo-small.svg` | Same drawing with heavier dots and lines so it holds at 32–44px. Same color tokens. |
| Places that can't inline (`<img>`, emails, slides) | `namaq-logo-light.svg`, `namaq-logo-dark.svg`, `namaq-logo-small-light.svg`, `namaq-logo-small-dark.svg` | Fixed colors. |
| Browser tab | `icon.svg`, `favicon.ico` (16, 32, 48) | Transparent. `icon.svg` switches to the dark colors when the browser is in dark mode; `favicon.ico` is the fallback in one terracotta pair that reads on both. In Next, drop them in `src/app/` as `icon.svg` and `favicon.ico`. |
| Home screen | `apple-icon.png` (180) | Square paper fill, the one opaque file, since iOS turns transparency black. Goes in `src/app/`. |
| Manifest | `icon-192.png`, `icon-512.png` | Transparent. |
| Seal (optional) | `namaq-seal-light.svg`, `namaq-seal-dark.svg` | The mark in a double ring, for a stamp-style use such as a social card or the about page. |

Colors are #405's: ink #2e2219 / #f5eddf, accent #9c3b22 / #eda183, paper #f4ecdb.
Every file has a transparent background except `apple-icon.png`.

Files live in `public/brand/`.
