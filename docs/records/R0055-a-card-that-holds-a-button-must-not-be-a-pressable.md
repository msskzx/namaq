---
title: "A card that holds a button must not be a pressable"
summary: "The library's book cards carry their own download, remove and hide buttons; wrapping such a card in a disabled Pressable disabled the button inside it on the web, and on phones a Pressable card hides inner buttons from screen readers. The card is a plain View whenever it does not open."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Library cards open a book when tapped, but in edit mode (and for books not on the phone) the card must not open while its own button still works. The first version kept a Pressable with disabled={!onPress}."
approach: "Render a Pressable only when the card opens, and a View otherwise, with the same style; a card that opens has no button inside it."
outcome: "solved"
conditions: "Expo SDK web export (react-native-web) for the UI tests; iOS VoiceOver and Android TalkBack for the accessibility reading (from React Native's docs: a Pressable is accessible by default and groups its children)."
evidence: "mobile/src/screens/books.tsx (Card), e2e/app/books.spec.ts (the pencil hides a built-in book and brings it back)"
implication: "Never nest a button in a Pressable. If a container sometimes acts and sometimes holds controls, switch the element, not its disabled flag."
date: "2026-11-17"
topics: ["mobile","ui-state"]
---

On react-native-web a disabled Pressable renders aria-disabled and pointer rules that reach its children: Playwright waited on "element is not enabled" for the hide button inside it.
