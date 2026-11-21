---
title: "A bare «قال» is read from the sharh, not from the story's flow"
summary: "Drawing a story by speaker needs every «قال» and «فقال» attributed; where the text does not name the speaker, a sharh that names him in brackets is the witness, and where none does the line stays narration."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Muslim 868 (Dimad's story) has six sayings introduced by a bare «فقال» or «قال فقال». «قال فبايعه» reads as Ibn Abbas narrating that Dimad pledged, or as the Prophet ﷺ taking his pledge; the owner would not build either on our reading."
approach: "Al-Nawawi's sharh names no speakers. Al-Harari's al-Kawkab al-Wahhaj (Shamela 18268) writes Muslim's words in brackets and puts the speaker beside them: «(قال) ابن عباس (فقال) ضماد (هات يدك)». Each turn stores the shortest quote that names its speaker, with volume and page, and the stored page is the check. Al-Ityubi's al-Bahr al-Muhit al-Thajjaj (Shamela 148870) agreed on all sixteen turns."
outcome: "solved"
conditions: "Sahih Muslim, Abd al-Baqi's numbering; al-Kawkab al-Wahhaj, Dar al-Minhaj 1430, vol. 10 pp. 343–345."
evidence: "data/catalog/events/islam-of-dimad.ts; data/history/sources/kawkab-wahhaj/v10/; data/catalog/events/stories.test.ts ('names each speaker as the text or a book does')."
implication: "Before drawing a hadith or story by speaker, look for a sharh that brackets the matn (al-Harari for Muslim, Ibn Hajar for al-Bukhari). A lead-in that names the speaker («فقال رسول الله ﷺ») needs nothing more. A quote may skip words with « … » when the name and the saying are apart («(فقال صاحب السرية) أي أميرهم … (فقال) أمير السرية (ردها)»); each part must be on the page."
date: "2026-11-21"
topics: ["source-extraction","evidence-model"]
---

The owner asked for the story split by who speaks, each saying in its speaker's bubble. Most of the turns in Muslim 868 open with a bare «فقال», and the narrator's own «قال» sits in front of several of them. Reading the flow gets most of them right, but «قال فبايعه» showed that a plausible reading can still be a guess, and the owner ruled out guesses.

## Tried

- al-Nawawi's Sharh Muslim → explains words, names no speaker
- al-Dhahabi's telling in the Siyar → drops «أعد علي كلماتك» and misplaces «ثلاث مرات», so it cannot be the main text
- al-Harari's bracketed commentary → names every speaker; a second agent read each quote in its context and checked it against al-Ityubi
