---
title: "A commentary on Shamela carries the text it explains above its rule"
summary: "Al-Qazwini's full al-Idah is not on Turath (only its first three volumes, on al-ma'ani), but his Talkhis al-Miftah is printed whole above al-Subki's commentary in 'Arus al-Afrah, each page's matn above the line «ــ», so his own definitions can be quoted from there."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "The balagha terms page quotes each device's definition from the books. Al-Suyuti defines most of his headings in al-Itqan, but not all; the owner chose al-Qazwini's al-Idah for the rest. Turath's al-Idah (book 7380, Khafaji's edition) holds only volumes 1 to 3, al-ma'ani with the editor's essays between, and none of al-bayan or al-badi'."
approach: "Use al-Qazwini's own Talkhis al-Miftah, which al-Idah explains, as printed in al-Subki's 'Arus al-Afrah (Turath 11151, Hindawi's edition): on each page the Talkhis runs above a line «ــ» and the commentary below it. Quote only the top part, check the quoted text is on that page's top part at build time, and credit it as «تلخيص المفتاح للقزويني، في عروس الأفراح ج/ص»."
outcome: "solved"
conditions: "Turath books-v3/11151.json (sha 80f9cd10…) and 7380.json, 2026-11-18. Of the 67 terms the balagha cards use, al-Suyuti defines 56 himself; the Talkhis defines تأكيد المدح بما يشبه الذم; the other ten (عتاب المرء نفسه، التأكيد، الصفة …) are Ibn Abi al-Isba''s or grammar headings the Talkhis does not define either, so their pages show al-Suyuti's words on them without calling them a definition."
evidence: "scripts/quran/buildBalaghaTerms.ts (matn), scripts/quran/balaghaTermDefinitions.json, shared/quran/balaghaTerms.test.ts"
implication: "Before saying a book is missing, look for its matn inside a commentary: Shamela's commentaries often print the whole matn above a rule on each page. Quote only the matn part, and check the text against that part when building."
date: "2026-11-18"
topics: ["source-extraction"]
buildsOn: []
---

Al-Itqan's balagha data in the app (`itqanBalagha`) keeps only the paragraphs that quote an ayah, so a definition with no ayah in it (المشاكلة: «ذكر الشيء بلفظ غيره لوقوعه في صحبته») was not there. The definitions are read from the same pinned Turath export, by page id and opening words, in `balaghaTermDefinitions.json`; the build fails when an opening matches no paragraph or more than one.

Some definitions al-Suyuti gives inside another heading's paragraph: the definitions of إيجاز الحذف and of الإطناب by زيادة are al-Qazwini's and Baha' al-Din's words he quotes in the chapter's opening (3/179–181), not under the headings themselves.

## Tried

- al-Idah on Turath (7380) → volumes 1 to 3 only, no bayan or badi'.
- Searching Turath for al-Qazwini's jinas definition → found only in commentaries: 'Arus al-Afrah, al-Atwal, al-Sa'idi's Bughyat al-Idah.
