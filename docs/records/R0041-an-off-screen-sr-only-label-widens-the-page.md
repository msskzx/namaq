---
title: "An off-screen page's sr-only labels widen the whole document"
summary: "Putting the website's three utilities side by side in a scroll-snap row blanked the page in screenshots: the calendar's sr-only day labels are position absolute, so in the off-screen pane they escaped the row's clip and stretched the right-to-left document 650px to the left."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "A horizontal pager (overflow-x auto, scroll snap) clips its panes, but an absolutely positioned child is clipped only by a scroll container that is also its containing block. The calendar's Tailwind sr-only spans had no positioned ancestor inside the row, so they counted toward the document's width; the right-to-left page grew to 1044px and headless screenshots came out blank."
approach: "Give each pane position: relative, so every absolute part of a page is held, and clipped, by its own pane."
outcome: "solved"
conditions: "Chromium (Playwright) at 390px, Next.js page in dir=rtl, panes laid out with flex 0 0 100%."
evidence: "src/components/utilities/Utilities.module.css (.pane)."
implication: "When a page puts content off screen in a scroll row, make each slide a positioned box. If a screenshot comes out blank, compare document.documentElement.scrollWidth with the viewport before anything else."
date: "2026-11-15"
topics: ["ui-rtl"]
---

Removing panes one at a time found the calendar as the cause; elementFromPoint still saw the page, which is why the content looked present but never painted where the screenshot looked.
