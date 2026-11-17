---
title: "Gestures inside React Native's own scroll view lose to the scroll"
summary: "The zoomed mushaf page sat in React Native's ScrollView with gesture-handler pans and a pinch inside; on the owner's phone the page would not scroll and could not be pinched back to its printed size. A Gesture.Native() around the scroll view, with the pinch running alongside it and the scroll held still while pinching, puts all of them in one set of gestures."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "After zoom became a text size (R0045), a zoomed page in the app's reader was meant to scroll down inside a vertical ScrollView, with the page swipe (a horizontal Pan), the pull for the index and the pinch on the row inside it. On a real phone the zoomed page did not scroll, and pinching in to go back to the printed page did not work. The web export showed neither."
approach: "Wrap React Native's ScrollView in a GestureDetector with Gesture.Native(), so the scroll is a gesture the pager's gestures are weighed against: a vertical drag fails the swipe (failOffsetY) and the scroll takes it. The pinch is declared simultaneousWithExternalGesture with that Native gesture, and while two fingers pinch the reader turns scrolling off and anchors the new size to the scroll where the pinch began. Not the ref of gesture-handler 3's ScrollView: that ref is React Native's instance with no handlerTag, so the builder API drops a relation made with it without a word (a cast hid it from TypeScript)."
outcome: "open"
conditions: "Expo app with react-native-gesture-handler 3 and a Pan or Pinch inside a scroll view. The home feed already used the gesture handler's ScrollView with a tree's pan inside it."
evidence: "mobile/src/components/Reader.tsx (scrollGesture, onPinch, pinchFrom), mobile/src/components/ReaderPager.tsx (pinch.simultaneousWithExternalGesture)"
implication: "A scroll view holding gesture-handler gestures gets a Gesture.Native() detector, and a two-finger gesture on it is made simultaneous with that gesture object, never with a component ref. Confirm on a phone: the web export does not run native gesture arbitration."
date: "2026-11-17"
topics: ["mobile"]
buildsOn: ["namaq/R0045-a-scaled-page-is-a-picture-not-bigger-text"]
---

The reader kept React Native's ScrollView from before zoom was a text size, when it
only scrolled while writing above the keyboard. Once the zoomed page had to scroll
too, the scroll and the gesture-handler gestures inside it competed without
knowing about each other, and on the phone the scroll lost its drag and the pinch
lost its two fingers. The outcome stays open until the owner confirms on the phone.

## Second cause (2026-11-17, after the owner tried #844)

The page still did not scroll on the phone: the zoomed words ran out past the page
frame. The two frame Views around the text were `flex: 1`. In Yoga that is a zero
basis, and Yoga has no CSS automatic minimum size, so under a `minHeight` parent the
frames stayed at the screen's height and the page never reported a taller one.
There was nothing to scroll. The web export grows them anyway, because browsers keep a
flex item's content height. While flowing, the frames now use `flexGrow: 1`, and the
body is keyed on flowing so it measures itself again at the printed size. Lesson:
anything that must grow with its content in a `minHeight` parent is `flexGrow`, not
`flex: 1`, and a web screenshot cannot show the difference.

## Third cause (2026-11-17, after the owner tried #861)

Pinching back out of a zoomed page stopped at the printed text size with the 15
lines spread over a page about twice the screen's height; only another page or
surah drew it right again. Keying the text body on flowing was not enough: the
page's outer View and its two frames changed their styles in place (`minHeight`
to `height`, `flexGrow` to `flex: 1`) and on the phone the page kept its tall
flowing height. The same transition laid out in `yoga-layout` comes out right,
so the stale size comes from how the native views took the changed styles, not
from Yoga's rules. The page's outer View is now keyed on flowing, so a page that
starts or stops flowing is drawn fresh with only its new styles. The body's size
is kept for each mode, so the printed lines are set at once at their old size
instead of waiting a frame for a new measure (keying the whole page component
would have dropped that state and drawn an empty page for a frame). The reader
also clears its kept scroll offset when the text stops flowing, which the
neighbour pages are placed by.
Lesson: when a native view switches between two layouts with different style
keys, draw it anew rather than trusting the style change; the web export cannot
show it.
