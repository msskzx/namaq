# Palette

The paper theme's colors are CSS variables on `.theme` in `src/components/homepage/Home.module.css`. Pages and components read the variables and never write a hex of their own.

| Variable | Light | Dark | Use |
|---|---|---|---|
| `--home-paper` | #f4ecdb | #0b0b0b | Page background. Dark mode keeps near-black for large reading surfaces, which gives the most contrast and the least strain in low light. |
| `--home-paper-deep` | #ebe0c8 | #1d1b19 | Small panels and cards, the root node of a word tree, and the ayah chips. |
| `--home-ink` | #2e2219 | #f2eadc | Text. |
| `--home-muted` | #6b5a4a | #b8ab98 | Secondary text, and the border of a neutral tag. |
| `--home-rule` | #c9b796 | #4b3f31 | Lines and borders. |
| `--home-highlight` | #fbbf24 | #fbbf24 | Amber. A context button whose node combines differing marks. |
| `--home-on-highlight` | #1c1917 | #1c1917 | Text on the amber context button. |
| `--home-highlight-border` | #d97706 | #d97706 | Selected ayah indicator in context cards. |
| `--home-accent` | #9c3b22 | #e8876c | Terracotta. Links, buttons, the logo's dots, an exact match. |
| `--home-root` | #5e4689 | #b9a3dc | Purple. A root match on the compare pages, and a first word with a joined ف in the branches tree. |
| `--home-green` | #4b644a | #9bb59a | Green. A first word with a joined و in the branches tree. |

Body text colors read at a contrast of at least 4.9 on either paper, above the 4.5 the web guidelines ask for.

Within the branches tree each color means one thing. A first word with و is green, one with ف is purple, so it does not read as a terracotta ayah link beside it, and a bare first word is neutral, a muted border around ink. A first word that differs only in its marks stays neutral, since the marks show the difference.

The dark logo and seal files in `public/brand/` keep the earlier dark colors (#f5eddf, #eda183): their content credentials sign each file, so editing a color would break them. The site draws its logo from `Logo.tsx`, which follows the variables.

The shared button variant `highlight` keeps its amber background in the paper theme. It signals differing marks on a context button; ordinary leaves use the borderless ghost variant. Leaf references and the icon form one borderless button. Differing-mark leaves fill the icon background with amber, so the reference text keeps its paper background. Inner nodes use the filled amber button. The icon and accessible label distinguish the action as well as its color.
