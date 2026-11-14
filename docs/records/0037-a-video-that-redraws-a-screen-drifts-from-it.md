---
title: "A video that redraws a screen drifts from it"
summary: "The compare video drew its own version of the compare card in a canvas, so every later change to the app's card (marks, sizes, the read word, the story parts) left the video behind; it now draws from the same measures and the same layout pieces the app renders."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Share-as-video records a canvas inside a web view (the app) or a frame (the website), so it cannot render the app's React Native components. The compare recorder had guessed the card: no card box, labels centred in sans-serif, the ayah number muted, a thick bar under the read word, related marks as a faded root colour, one block of text for story cards and one-to-many cards, the emblem on every frame and a title frame first. The owner found the same drift in the tree video and asked that every video use the app's own nodes."
approach: "shared/quran/compareCardLook.ts holds the card's measures (COMPARE_CARD, in phone points), the mark colours (markColour), the side names (sideTitle) and the card's layout as pieces (sideView: ayat runs, story-part rules, stretch gaps, picked and unpicked partners, silent parts). The app's CompareCard renders those pieces with those measures, and the recorder draws the same pieces scaled by 1080 / 390, so a change to the card changes the video. Interface text is Amiri at the app's UI_SCALE; a card taller than the frame scrolls with the reading, as on the phone, instead of shrinking the text to nothing."
outcome: "solved"
conditions: "Expo app (mobile/src/components/CompareCard.tsx, mobile/src/lib/compareVideo.ts) and Next.js site (src/app/quran/compare/CompareVideo.tsx), one recorder in shared/video/compareVideo.ts, 2026-11-14."
evidence: "shared/quran/compareCardLook.test.ts; frames compared side by side with the app's web export at 390 pt (/mnt/project-files/video-match/)."
implication: "A drawing that copies a screen (a video, an image, a widget) takes its sizes, colours and structure from a module the screen itself uses, never from numbers typed again. Check it by putting a frame next to the screen at the same moment."
date: "2026-11-14"
topics: ["ui-state","graph-ui"]
buildsOn: ["namaq/0031-a-card-that-redraws-a-feature-loses-its-behaviour"]
variantOf: ["namaq/0036-a-video-that-copies-the-app-drifts-from-it"]
---

The video's canvas cannot hold React Native views, so "reuse the component" here
means reusing everything under the component: the measures, the colour rule and
the code that decides what a side shows. Only the last step, turning a piece into
pixels, is written twice (once as views, once as canvas calls), and it is short.

Recording the real screen instead (capturing the rendered card per word) would
reuse the views themselves, but it needs a phone build to test and hundreds of
captures per page video; it stays an option if the canvas drifts again.

## Tried

- shrinking the text until a story card fits the frame → at 30 px a long story card still overflowed and the text was too small to read; scrolling with the reading replaced it
