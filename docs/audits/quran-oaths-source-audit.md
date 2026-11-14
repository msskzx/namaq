# Quran oaths source audit

Read-only audit of the `origin/main` data in `shared/quran/oaths.ts` and `shared/data/quran/oaths.json`, 2026-11-13. This report changes no oath data or UI.

## Scope and count

The code has 41 records in `ALLAH_OATHS` and 12 in `OTHER_OATHS`. This is a verified count of records, not an independently established exhaustive count of Quranic oaths. The page uses a narrower rule: an overt oath formula, and it omits reported oaths with an explicit verb and implied oaths. Al-Suyuti calls 63:1 an oath by its function (*al-Itqan*, vol. 2, p. 277) and expressly counts 24:53 as an oath (p. 279); those fall outside Namaq's stated selection. The claim “every oath” needs that qualification.

Ibn al-Qayyim's *al-Tibyan fi Ayman al-Qur'an* treats divine oaths. Its editor, Abd Allah al-Battati, says that the author did not treat oaths reported from created speakers or implied oaths (2019 edition, introduction pp. 37–38). Al-Suyuti's section likewise focuses on divine oaths; neither work establishes that the 12 quoted oaths are complete. The editor's own inventory of ten overt divine self-oaths (introduction, p. 16) matches all ten in Namaq: 4:65, 10:53, 15:92, 16:56, 16:63, 19:68, 34:3, 51:23, 64:7, 70:40. Al-Suyuti's earlier seven at vol. 2 p. 277 omit 16:56, 16:63, and 34:3; the first two are still overt divine oaths, and Ibn al-Qayyim himself explicitly identifies 34:3 alongside the other two commanded Prophet oaths on pp. 9–10.

## Record coverage

T = Ibn al-Qayyim's own text in the al-Battati edition, printed page. E = the editor's introduction, printed page. S = al-Suyuti, *al-Itqan*, vol. 2, printed page. “Chapter” means an indexed discussion of that surah or oath, rather than a claim that every `by` token was checked against the source. The source confirms each divine oath formula, but this matrix does not certify the exact word highlighting or the completeness of the 41-record inventory.

| Kind | Verse | Source evidence | Status |
| --- | --- | --- | --- |
| Allah | 4:65 | E 16; S 277; T 652 chapter | Supported |
| Allah | 10:53 | T 9–10; E 16; S 277 | Supported |
| Allah | 15:72 | T 649–650; S 278 | Supported, alternative speaker reading recorded by T |
| Allah | 15:92 | T 5; E 16; S 277 | Supported |
| Allah | 16:56 | E 16 | Supported by editor inventory; absent from S's seven |
| Allah | 16:63 | E 16; T discussion in chapter on 77 | Supported by editor inventory; absent from S's seven |
| Allah | 19:68 | E 16; S 277 | Supported |
| Allah | 34:3 | T 9–10; E 16 | Supported; absent from S's seven |
| Allah | 36:2 | T 9; T 645 chapter | Supported |
| Allah | 37:1–3 | T 8; T 646 chapter; S 280 | Supported |
| Allah | 38:1 | T 8, 15 | Supported |
| Allah | 43:2 | T 645 chapter; E 17 | Supported |
| Allah | 44:2 | T 8; E 17 | Supported |
| Allah | 50:1 | T 21; E 17 | Supported |
| Allah | 51:1–4 | T 9, 424 chapter | Supported |
| Allah | 51:7 | T 434 explicitly treats it as a new oath | Supported as distinct oath |
| Allah | 51:23 | T 5, 9; E 16; S 277 | Supported |
| Allah | 52:1–6 | T 9, 399; S 278 | Supported |
| Allah | 53:1 | T 9; S 278 | Supported |
| Allah | 56:75 | T 8; S 280 | Supported |
| Allah | 64:7 | T 9–10; E 16; S 277 | Supported |
| Allah | 68:1 | T 9, 299 chapter | Supported |
| Allah | 69:38–39 | T 9, 264 chapter | Supported |
| Allah | 70:40 | E 16; S 277; T 288 chapter | Supported |
| Allah | 74:32–34 | T 250–260 chapter | Chapter corroboration |
| Allah | 75:1–2 | T 22–27 chapter; S 280 | Supported |
| Allah | 77:1–6 | T 9, 222 chapter | Supported |
| Allah | 79:1–5 | T 207–218 chapter | Chapter corroboration |
| Allah | 81:15–18 | T 184–190 chapter; S 278 | Supported |
| Allah | 84:16–18 | T 175–179 chapter | Chapter corroboration |
| Allah | 85:1–3 | T 139–140 chapter | Chapter corroboration |
| Allah | 86:1–3 | T 157 | Supported for v. 1; vv. 2–3 explain the sworn object |
| Allah | 86:11–12 | T 171–173 chapter | Chapter corroboration |
| Allah | 89:1–4 | T 40–45 chapter; S 280 | Supported |
| Allah | 90:1–3 | T 51–60, especially p. 60; S 280 | Supported for vv. 1 and 3; v. 2 is an interjected clause |
| Allah | 91:1–7 | T 27–37 chapter; S 278 | Supported; interpretation of `ما` varies |
| Allah | 92:1–3 | T 9, 87 chapter | Supported |
| Allah | 93:1–2 | T 111 chapter; S 281 | Supported |
| Allah | 95:1–3 | T 69 chapter; S 278 | Supported |
| Allah | 100:1–5 | T 117 chapter; S 280 | Supported |
| Allah | 103:1 | T 133 chapter; S 280 | Supported |
| Quoted | 6:23 | E introduction p. 15 quotes it as created-speaker oath | Outside both authors' divine inventories |
| Quoted | 6:30 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 12:73 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 12:85 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 12:91 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 12:95 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 21:57 | E introduction p. 15 quotes it as created-speaker oath; T p. 7 quotes the form | Outside both authors' divine inventories |
| Quoted | 26:44 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 26:97 | E introduction p. 19 quotes it as an oath-answer example | Outside both authors' divine inventories |
| Quoted | 37:56 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 38:82 | Quranic text in dataset | Outside both authors' divine inventories |
| Quoted | 46:34 | Quranic text in dataset | Outside both authors' divine inventories |

## Findings and open questions

- The source supports 51:7 as a **separate** oath. Ibn al-Qayyim moves from the answer to 51:1–4 to a new oath by the sky on printed p. 434.
- At 86:1–3, Ibn al-Qayyim calls 86:1 the oath and 86:3 its explanation on p. 157. At 90:1–3, he explicitly calls 90:2 an interjected clause within the oath on p. 60 (following the p. 59 page break). Both records are correctly counted once, but the displayed range includes text beyond the oath itself. This conflicts with the plan/help promise to show “the oath only.”
- For 15:72, both authors treat `لعمرك` as Allah's oath by the Prophet's life (S vol. 2 p. 278; T pp. 649–650). Ibn al-Qayyim also reports al-Zamakhshari's reading as the angels swearing by Lot's life and rejects it. The current divine classification follows his preferred reading, but a source audit should acknowledge the dispute.
- For 91:5–7, al-Suyuti gives the verbal-noun reading of `ما` and calls it an oath by divine action (vol. 2 p. 278). Ibn al-Qayyim discusses both a relative-pronoun and verbal-noun reading. A single `ما` chip spanning unlike constructions should be described as a shared written form, not a shared referent.
- The named books do not supply a complete list of quoted oaths. The 12 entries' literal formulas are visible in the bundled Quran text, but exhaustiveness and every speaker label still require a separate Quran-wide audit. An index chapter is weaker evidence than a checked passage; chapter-only rows above should retain that status.

## Sources

- [Ibn al-Qayyim, *al-Tibyan fi Ayman al-Qur'an*, ed. Abd Allah al-Battati, Dar Ata'at al-Ilm / Dar Ibn Hazm, 4th ed. 1440/2019, full text with printed page markers](https://islamhouse.com/read/ar/%D8%A7%D9%84%D8%AA%D8%A8%D9%8A%D8%A7%D9%86-%D9%81%D9%8A-%D8%A3%D9%8A%D9%85%D8%A7%D9%86-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-265620). The editor's introduction and Ibn al-Qayyim's text are distinct parts of this edition.
- [Same edition, browsable printed-page index](https://quranpedia.app/books/b18337/index.html).
- [Al-Suyuti, *al-Itqan fi Ulum al-Qur'an*, type 67, vol. 2 pp. 277–281](https://islamweb.net/ar/library/content/68/445/%D8%A7%D9%84%D9%86%D9%88%D8%B9-%D8%A7%D9%84%D8%B3%D8%A7%D8%A8%D8%B9-%D9%88%D8%A7%D9%84%D8%B3%D8%AA%D9%88%D9%86-%D9%81%D9%8A-%D8%A3%D9%82%D8%B3%D8%A7%D9%85-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86).

Distillate records consulted: `namaq/0026-a-citation-does-not-authorize-every-chip` (used to distinguish a shared token from shared meaning), `namaq/0006-a-rule-that-stops-a-clear-reading`. Their read and use events were logged to Distillate's `activity.jsonl`. The fetched `origin/main` has `docs/records`; I read records 0015 and 0026 there. Record 0015 supports preserving the 15:72 interpretive dispute rather than treating source disagreement as a data error.
