---
title: "A tafsir dump keyed by ayah can hold book pages, not the passages that explain the ayah"
summary: "Quranpedia's al-Sa'di dump gives each ayah the page pieces its passage touches, so an ayah's text started with the passage before; the book had to be laid end to end and cut again at its own range markers."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The tafsir sheet must show al-Sa'di's passage for the pressed ayah and nothing else. The dump's ayahs[].content looks like that passage, but up to about surah 9 each piece is a whole printed page, later a page cut at passages, and the front matter, appendices, next-surah headings and next-volume title pages hang on neighbouring ayat."
approach: "Collect every distinct (page, text) piece in page order, clean it (editor footnotes and marks, page markers, next-surah headings), and cut the continuous text at the book's range markers ({١ - ٧} and ﴿١٣، ١٤﴾). A range starting lower than the last, or at 1 with the basmala, opens the next surah. A passage runs to the ayah before the next marker; a marker inside a wider range cuts it there; an ayah split between two passages (2:219) gets both. The build fails unless every ayah of every surah falls in a passage."
outcome: "solved"
conditions: "tafsir-book-3.json.gz version 2026-08-10, 920 pages, 42 pages missing from the dump (marked [...] where text breaks off)."
evidence: "scripts/quran/buildTafsirSadi.ts, shared/quran/tafsirSadiData.test.ts (2:11, 2:67, 28:35, 2:219, 3:96, 3:128)"
implication: "Before trusting a per-ayah field in a book dump, check whether its text starts and ends where the book's own markers do, on an early and a late surah; dedupe by text and test the first and last lines of passages, not only coverage."
date: "2026-11-14"
topics: ["data-sync","evidence-model"]
buildsOn: []
---

The handover's converter deduplicated the per-ayah content and treated each group
as a passage. Two reviews found what that hid: al-Fatiha carried al-Baqara's
heading, 2:11 opened on 2:10's commentary, 28:35 showed all of 28:1-51 under one
header, and volume title pages sat after the last passage of each volume.

The dump's schema calls the field content, but its unit is the printed page. Reading
the book once, in page order, and cutting where al-Sa'di cut is the only grouping that
is his.

## Tried

- Dedupe each ayah's pieces and keep the dump's grouping → passages began mid-commentary and ranges were the dump's, not the book's.
- Cut at markers but start a new surah when a range repeats → al-Sharh and al-Tin are both «{١ - ٨}» and merged; the basmala after the marker is the reliable sign.
- Keep each marker's full range → ranges nested ({١ - ٥١} then {٣٠ - ٥١}) served two passages under one header.
