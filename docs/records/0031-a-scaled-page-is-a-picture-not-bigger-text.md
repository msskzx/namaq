---
title: "Zooming a page with a scale transform enlarges a picture, not the text"
summary: "The mushaf reader zoomed by drawing the page bigger and scaling the view; on iPhone the text came out blurry and cut off at the sides, so zoom became a font size with the words wrapped again and the page scrolled down."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Pinch zoom in the app's reader (#664) drew the page at width times zoom inside a view scaled back down, then scaled that view up again. On the owner's iPhone the text was blurry and pixelated, and the lines ran past both edges of the screen, so reading meant dragging sideways."
approach: "Make zoom a text size. At 1 the printed page stays as it is. Above 1 each word group is measured once at a base size, the page's words are broken into new lines at the screen's width (breakLines in mobile/src/lib/pageZoom.ts), every line except a paragraph's last is spread edge to edge, and the page grows taller inside a vertical scroll view. While the fingers move, a scale transform only previews the new size; when they lift, the page is set again at that size. On the website, the lines become inline text with text-align: justify in flow mode, and a two-finger touch or ctrl+wheel sets the size."
outcome: "solved"
conditions: "Expo app on iOS with Reanimated transforms on a view of nested Text; Next.js reader on phone browsers. Web-export screenshots don't show the blur: transforms there re-rasterize text sharply."
evidence: "mobile/src/components/ReaderPager.tsx, MushafPageView.tsx (rows), Reader.tsx (scroll, anchor); src/app/quran/read/MushafPage.tsx fit(), Mushaf.module.css [data-flow]"
implication: "Don't zoom text with a transform past the gesture itself: change the font size and lay the text out again. Check anything that measures positions (highlight bands, write boxes, kept scroll) at the new layout, after it is drawn, not in the same render."
date: "2026-11-14"
topics: ["mobile","ios","text","reader"]
buildsOn: ["namaq/0030-a-fixed-height-box-clips-ios-text-mid-word"]
---

The old zoom kept the page's 15 lines and made everything bigger, which is what
a picture viewer does. iOS draws text once into a layer and a scale transform
then stretches those pixels, so the letters blurred. The owner asked for the
behaviour of a book app instead: bigger words, more lines, scroll down.

Flowing lines need each word's width, not each line's, so the page now measures
every word group once at the base size; a printed line's width is the sum of its
groups and the gaps, the same number as before.

The pinch needs an anchor: the share of the page's height that was between the
fingers is kept, and once the page reports its new height the scroll puts the
same words back under them. The first try used the anchor in the same render as
the new size, before the page had reported its new height, and landed at the top.

## Tried

- Anchor applied when zoom changed → used the old height; fixed by waiting until the page reports a different height.
- Restoring the saved scroll on the first height report → the first report is the screen's height (before words are set), so it clamped to 0; fixed by waiting for a height past the screen's.
