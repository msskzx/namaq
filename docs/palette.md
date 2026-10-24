# Paper and ink theme

Namaq gives the source text the most space and contrast. Warm paper, ink, fine rules and restrained typography borrow from a printed reference book. Color draws attention to an action, a selection or a meaningful distinction in the content. Secondary information stays quiet and can be disclosed when needed.

`src/app/theme.css` owns the palette for light and dark modes. Read the values there. Use its `--home-*` variables in pages, portals, SVGs, charts and graphs. Derive transparency from those tokens instead of adding colors. The signed brand files in `public/brand/` retain their original colors because editing them breaks their content credentials.

- Paper and deeper paper distinguish reading surfaces. Ink is primary text, muted ink is secondary text, and rules separate content.
- Terracotta identifies actions and exact word matches. Purple identifies root matches. In branches, joined ف is purple and joined و is green. Keep the text or symbol that explains each distinction.
- Amber highlights differing marks that need inspection. It is not the default button color. Slot and bubble colors distinguish content groups, without assigning new meanings to those colors.
- Use the shared Button, Badge, Toggle and ExplorationCard. Homepage and hub navigation share ExplorationCard. Lucide icons use a consistent stroke, an action label and an accessible name when the label is hidden. Mirror directional arrows in RTL.
- Keep existing routes and essential information. Prefer clear headings, restrained borders and space over nested cards. Collapse secondary details when they compete with the main reading task.
- Support Arabic and English, both directions, both themes, visible keyboard focus and reduced motion. Restore focus after overlays close; use `:focus-visible` so mouse clicks do not leave a keyboard ring.

Amiri gives vocalized Arabic room to read. Its type scale is larger because its letters occupy less of the em than a UI sans. Source passages use double leading so vowel marks do not collide. English homepage headings retain the existing serif face.
