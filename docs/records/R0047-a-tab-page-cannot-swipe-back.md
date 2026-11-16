---
title: "A tab page cannot swipe back"
summary: "The Quran tools and the search were hidden tab routes with a back arrow, so iPhone's back swipe (a native stack gesture) never existed for them; putting each bar button's pages in a native stack, set right to left, gave the swipe from the right edge with the page before peeking under it."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The owner asked for a back gesture. The pages people go back from (trees, compare, prophets, Tuhfa, the search) were tab routes, so a back arrow switched tabs and nothing could follow the finger or show the page underneath. The pages that were in the root stack (ayah, library, a prophet's story, quiz pages) did swipe back, but from the LEFT edge, against the back arrow on the right."
approach: "app/(tabs)/(quran) and app/(tabs)/(home) are native Stack groups (URLs unchanged, unstable_settings.initialRouteName keeps the hub or home under a tool opened from anywhere). expo-router's LocaleProvider direction=\"rtl\" at the root makes react-native-screens set the stacks' semanticContentAttribute to right to left, so the back swipe starts at the right edge and pages arrive from the left. fullScreenGestureEnabled is false, because on iOS 26 it defaults to the full-content pop that would fight the cards' own sideways swipes; the gesture-handler pans of the cards also leave the right 24 pt to the back swipe (hitSlop). The tab bar reads the open page from useSegments. toTab navigates withAnchor (initialRouteName only anchors a parsed URL, not an in-app navigate into a stack that has not been drawn), each Quran tool is dangerouslySingular so opening it again brings the one copy forward with its intent, home is reached by navigate then dismissAll (only from inside the tabs: from a page over them the pop would close the page just opened), and toTab only closes the root stack when a root page is in front, so a tree's compare goes back to the tree."
outcome: "solved"
conditions: "expo-router ~58 (its own react-navigation fork), react-native-screens 4.30, iOS in Expo Go; Android keeps its system back. 2026-11-14."
evidence: "e2e/app/back.spec.ts; mobile/src/lib/stackOptions.ts; react-native-screens ios/RNSScreenStackHeaderConfig.mm applySemanticContentAttributeIfNeededToNavCtrl (applied even with the header hidden)."
implication: "A page that has a back arrow belongs in a stack, not in the tab bar's hidden routes. A style direction: 'rtl' on a View does not reach native navigation; the navigator's locale direction does."
date: "2026-11-14"
topics: ["ui-rtl","ui-state"]
---

The `direction: 'rtl'` style on the root view lays out rows right to left but
never reaches UIKit, so the root stack still slid in from the right and swiped
back from the left. react-native-screens reads the direction from the stack's
header config, which native-stack fills from the navigation locale, and applies
it even when the header is hidden.

The web export cannot show the gesture; it checks the stacks (back arrow one page
back, the hub under a deep-linked tool, the Quran button returning to the open
tool). The swipe itself needs a phone.

## Tried

- reading the nested stack from the tab bar's `state` → the js-tabs bar gets a flattened state without the nested routes; useSegments has them
- unstable_settings.initialRouteName alone → a tool opened from home before the Quran tab was ever drawn had no hub under it; navigate needs withAnchor
- plain navigate to a tool already lower in the stack → a second copy was pushed and the hidden first copy took the intent; one copy per tool (dangerouslySingular, the new name of getId) fixes it
- dismissTo('/') from another tab → did nothing; navigate then dismissAll goes home and drops the search
