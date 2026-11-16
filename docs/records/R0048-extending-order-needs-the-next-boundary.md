---
title: "Extending surah order needs the boundary into the old range"
summary: "Adding the early surahs also needs Ghafir's link into Fussilat, and existing aim quotations need checking against their actual source pages."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The old list started at Fussilat and had no link into it. Reusing the earlier aims from the topics feature also carried corrected digital transcriptions that were not literal matches to their cited text."
approach: "Added the links from al-Suyuti's cited edition, including his explicit Hawamim sequence for the Ghafir–Fussilat boundary. Checked the early aims against the cited editions, selected literal excerpts, and used Masa'id al-Nazar where its wording avoided corrupt Nazm transcriptions. A checksum-pinned verifier checks the early quotations against their printed pages."
outcome: "solved"
conditions: "Shamela 9992, 9098 and 1404 as exported by Turath; /quran/order previously covered surahs 41–114."
evidence: "scripts/quran/verifyOrderQuotes.ts; shared/quran/surahOrder.test.ts; e2e/web/order.spec.ts; e2e/app/quran.spec.ts"
implication: "Check the boundary into an existing range, and verify reused quotations as well as new ones. A failed source match is not evidence that the author is silent."
date: "2026-11-16"
topics: ["evidence-model","text-matching","testing"]
buildsOn: ["namaq/R0044-a-pair-must-be-named-in-the-quoted-sentence"]
---

The book's table of contents also omits a separate entry for Hud, though its text appears on Shamela page 93. Reading the pages found the passage; the missing index entry did not become a missing quotation.

The source check validates printed volume and page separately from the Shamela page ID. It strips HTML and normalizes letters for matching; displayed quotations retain their wording. Ellipses identify cuts. No early ayah-pair illustrations were added without separately establishing that the displayed quotation names both ayat.

The existing editions are already in `shared/sources.ts`; this extension adds no edition. Full books stay in the temporary download cache, outside the checkout and client bundles.
