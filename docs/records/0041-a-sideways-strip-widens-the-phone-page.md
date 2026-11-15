---
title: "A sideways strip widens the phone page"
summary: "The website's utilities strip (three pages side by side, scroll snap, right to left) clipped its pages on a desktop-sized window, yet on a phone-sized mobile viewport the whole document grew to the strip's full width and opened scrolled to the side; contain: paint on the strip kept the page at the screen's width."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "With overflow-x: auto on the strip, Chromium's mobile emulation (isMobile, hasTouch) still counted the pages off to the left when it sized the layout viewport, so html was 1044px wide at a 390px screen and the fixed bars stretched with it."
approach: "Probing which elements reached past the screen showed only the strip's off-screen pages. contain: paint on the strip keeps their overflow out of the document; overflow-x: clip on the wrapper and turning snapping off did not."
outcome: "solved"
conditions: "Next.js website, dir=rtl page, Chromium headless with isMobile true, 2026-11-15."
evidence: "src/components/utilities/Utilities.module.css (.strip); e2e/web/pages.spec.ts (prayer times for a picked city)."
implication: "Test a sideways scroller at a phone viewport with isMobile on, not only a narrow desktop window. contain: paint also makes the strip the offsetParent of its pages, so measure with getBoundingClientRect rather than offsetLeft."
date: "2026-11-15"
topics: ["ui-rtl","testing"]
---

The desktop-width probe looked right (strip 358px, grid column 358px), which hid the bug until the phone screenshots.

## Tried

- grid-template-columns: minmax(0, 1fr) on the wrapper → fixed a real grid blow-out, but not the mobile viewport
- overflow-x: clip on the wrapper, scroll-snap-type: none → no change
