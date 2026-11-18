# Audit: hadith sources

1. Start with al-Nawawi's 42, retaining his text and linking each excerpt to separately stored, complete source narrations.
2. Twenty-eight entries cite only the Sahihayn, twelve cite only other works, and two mix Sahih material with another source; several need multiple routes or wording warnings.
3. Classical Arabic author text is the recommended offline path; no fully vowelled, commercially reusable digital package was verified for all the required books.
4. Curate narrator identities and Ibn Hajar's tabaqa statements for these routes first; existing Jibril ranks are a demonstration, and available datasets need source and matching checks.
5. Use Ibn Rajab as the first commentary layer, preserve named scholars' grading disagreements, and label questions, selections and product decisions as Namaq's work.

Research date: 18 November 2026. This is a research audit, not a data import, a rights clearance or an implementation. Recommendations, mapping judgments and proposed Arabic questions below are **Namaq's analysis**. Quoted Arabic belongs to the named source. A link establishes where to check a claim; it does not grant permission to redistribute that site's database.

## What already exists

Read first: [AGENTS.md](../../AGENTS.md), [shared/sources.ts](../../shared/sources.ts), the Jibril fixtures, builders and mobile screens. The source policy permits an old author's public-domain words offline, with edition and page references, excluding modern additions. Modern works require written permission. This audit adds no book to the shipped corpus; an adoption PR must add each adopted source and its actual licence to `shared/sources.ts`.

The current path is `src/lib/model/fixtures/jibril/` through [hadithView.ts](../../src/lib/model/hadithView.ts), [appHadith.ts](../../src/lib/model/appHadith.ts) and [buildAppHadith.ts](../../scripts/model/buildAppHadith.ts) to [units.json](../../shared/data/hadith/units.json). The phone reads that bundle through [mobile/src/lib/hadith.ts](../../mobile/src/lib/hadith.ts). [shared/hadith.ts](../../shared/hadith.ts) already distinguishes report voices, frames, scenes, chain branches, tahwil, gaps, reader pages, notes and commentary links. The bundle contains Bukhari Jibril, Muslim Jibril and a Fath al-Bari passage. Bukhari's compiler remark is a separate report.

This is a useful presentation model, not evidence that the whole pipeline is ready for 42 hadith. The builder still names fixture books explicitly. Fixture editions have test publication details and `checkedAgainstPrint: false`. [tabaqa.ts](../../src/lib/model/tabaqa.ts) uses hand-written name tables and a special Muslim tail. [The chain-row plan](../plans/hadith-chain-rows.md) explicitly distinguishes the built demo from the unbuilt version with stored source assertions. The source registry does not yet register these fixture editions as production Bukhari, Muslim, Fath or Taqrib sources.

There is also a concrete citation defect to avoid carrying forward. The chain-row plan calls Taqrib entry 416 page 31 and entry 7414 page 507. Those are Shamela digital page IDs. The live pages identify **printed p. 105** and **p. 581**, respectively. Record both the printed locator and the digital ID. See [entry 416](https://shamela.ws/book/8609/31) and [entry 7414](https://shamela.ws/book/8609/507). This PR records the finding without changing the existing feature.

The two Jibril reports must remain distinct. Nawawi no. 2 is Umar's report, [Muslim 8a, Faith](https://sunnah.com/muslim:8a). [Bukhari 50, Faith](https://sunnah.com/bukhari:50) is Abu Hurayra's report. Muslim's opening story reaches Ibn Umar, who then says his father Umar narrated to him. A chain extractor stopping at Yahya b. Ya'mar loses that nested transmission. Bukhari's final Abu Abd Allah remark is the compiler's voice. Neither report supplies the other's chain or wording.

## Editions, digital witnesses and offline rights

The recommendation is an Arabic-only first release. A classical author's public-domain status, a modern edition's contributions, a transcription's terms, a translation's copyright and a dataset licence are separate questions. Free access and a free app do not settle commercial redistribution. The decisions below follow the repository's source policy; jurisdiction-specific rights in editions and databases still need an acquisition record.

| Work | Edition and useful digital witness | Text quality and numbering | Offline/commercial decision |
| --- | --- | --- | --- |
| Al-Nawawi, al-Arba'in | [Shamela 12836](https://shamela.ws/book/12836), attended by Qusay Muhammad Nawras al-Hallaq and Anwar b. Abi Bakr al-Shaykhi, Dar al-Minhaj, Beirut, first 1430/2009, 115 pages | All 42; chapter boundaries and print pagination. The live no. 1 is not fully vowelled. Modern footnotes and bracketed takhrij numbers must stay outside the author's text. | Recommend author-only text, collated against a pinned print witness. Nawawi died 676/1277. No permissive blanket file licence was located. Do not describe the modern edition or its apparatus as public domain. |
| Sahih al-Bukhari | [Shamela 1681](https://shamela.ws/book/1681), Sultaniyya, Bulaq 1311 AH, reproduced by Dar Tawq al-Najat 1422 under Muhammad Zuhayr al-Nasir, nine parts | Strong print baseline. Card distinguishes the old Sultani text from added Abd al-Baqi numbering and marginal references. Digital samples have tashkeel; complete vocalization and transcription fidelity need collation. | Prefer an independently acquired author-text transcription checked against the old Sultani print. Exclude modern notes, introductions and added commentary. Pin the precise scan/reprint used; an archive download alone is not a licence. |
| Sahih Muslim | [Shamela 1727](https://shamela.ws/book/1727), Muhammad Fuad Abd al-Baqi, Isa al-Babi al-Halabi, Cairo 1374/1955, five parts including index | Practical reference edition with grouped Abd al-Baqi numbers. [Faith, printed 1/36](https://shamela.ws/book/1727/60), contains the Jibril opening. Preserve combined chains, alternate wording, and references such as بمثله. Modern headings/index work need separate attribution. | Author Muslim died 261/875. Recommend classical Arabic text only, independently collated. Do not assume the editor's apparatus or a provider's export is cleared for commercial redistribution. |
| Ibn Rajab, Jami' al-'Ulum wal-Hikam | [Shamela 4268](https://shamela.ws/book/4268), Shuayb al-Arnaut and Ibrahim Bajis, Muassasat al-Risala, seventh 1417/1997, two parts | Fifty chapters: the Forty plus eight additions. Searchable, print pagination. Author's discussion supplies takhrij, variant chains and disagreement. Modern editorial footnotes are a separate layer. | Author died 795/1393. Recommend his words as the first commentary corpus, after author/editor segmentation and collation. No licence to bundle this modern apparatus was found. |
| Sharh al-Arba'in attributed to Ibn Daqiq al-'Id | [Shamela 11244](https://shamela.ws/book/11244), Muassasat al-Rayyan, sixth 1424/2003, 139 pages | Forty-two chapter headings make passage attachment feasible. Attribution is disputed; see below. This is not a verified manuscript-critical author attribution. | Classical commentary may be usable author-only after provenance review. Do not label it unconditionally as Ibn Daqiq's words or ship modern additions. |
| Ibn Hajar, Taqrib al-Tahdhib | [Shamela 8609](https://shamela.ws/book/8609), Muhammad Awwama, Dar al-Rashid, Syria, first 1406/1986, 765 pages | Entry numbers, aliases, compressed biography and tabaqa. Card says differences from Abu al-Ashbal's Dar al-Asima 1416 edition were inserted in square brackets. This is a mixed digital witness, not a pure transcription of one edition. | Ibn Hajar died 852/1449. Curate his actual statements with the edition recorded. Exclude or separately credit modern insertions. Do not silently remove brackets and claim one clean witness. |

No complete vowelled, rights-cleared export was downloaded and verified for these works in this audit. The best practical research witnesses are the edition-labelled Shamela texts plus print scans. The best shipping route remains a pinned, reviewed transcription of classical author text with documented acquisition terms. Vowels are part of the witness: never generate missing tashkeel and present it as the edition's wording.

| Provider or dataset | Findings | Use in Namaq |
| --- | --- | --- |
| Shamela / turath | Shamela cards identify editions and print pagination. Its free-service description is not a commercial redistribution licence. Turath is an export candidate used elsewhere in the repo, but a hadith export and its terms were not acquired here. | Research and collation candidates. Before adoption, retain the actual export, hash, metadata, terms and print checks. Do not claim all Shamela text has one licence. |
| Sunnah.com | [About](https://sunnah.com/about) restricts automated scraping and permits selected educational/presentation use. [Developers](https://sunnah.com/developers) requires an API key, describes a manually checked portion of the data, and says an offline dump is not yet available. Arabic examples have chains and vowels; translation and grading badges are additional layers. | Excellent reference aliases and spot checks. No bulk scraper or assumed offline redistribution right. Obtain an explicit grant for the intended scope if choosing their dataset. A licence on client/server code does not license the texts. |
| OpenITI | [Corpus documentation](https://openiti.org/documentation/) gives CC BY-NC-SA 4.0. Research copies of [Nawawi 12836](https://github.com/OpenITI/0700AH/tree/master/data/0676Nawawi/0676Nawawi.ArbacunaNawawiyya) and [Ibn Rajab 4268](https://github.com/OpenITI/0800AH/tree/master/data/0795IbnRajabHanbali/0795IbnRajabHanbali.JamicCulumWaHikam) are searchable, normalized texts with page markers. The inspected Forty copy lacks tashkeel and has transcription defects; it differs from the live Shamela witness. | Useful research search/index witness. NC conflicts with keeping commercial options open. Do not ship this corpus under a public-domain label because the historical author is public domain. |
| Scans on Waqfiya / archive.org | An old print can establish the author's words and vocalization. This audit has not pinned a complete scan set or certified a host's rights metadata. | Acquire a named scan, verify title page, edition, completeness and pages, and record the asset's terms. OCR alone is not the display text. |

For books beyond the Sahihayn, the table below supplies retrieval references, not a cleared bulk dataset. Each adopted Tirmidhi, Nasa'i, Abu Dawud, Ibn Majah, Ahmad, Darimi, Daraqutni, Muwatta or Bayhaqi edition needs the same edition/author/editor/rights review. This affects fourteen entries, including the two mixed cases. The primary narrations are classical; modern annotations, translations and grading databases are not automatically included.

## Mapping all 42

This is a research concordance, not a claim that every linked matn is character-for-character identical. The starting citation and Companion come from [Nawawi 12836](https://shamela.ws/book/12836), checked against the source narrations linked below. B = Bukhari; M = Muslim; T = Tirmidhi; AD = Abu Dawud; N = Nasa'i; IM = Ibn Majah. Muslim letters identify Sunnah.com's route subdivisions, not numbering written by Muslim. Additional print locators need edition-specific aliases.

In this table, "variant" means a related report under the same Companion with a wording or order difference; "excerpt" means Nawawi selects part of a longer record; "partial" means the linked record does not supply the whole quoted passage. Every row still needs a saved span comparison and print collation before production approval. A matching theme never authorizes attaching a chain to unrecorded words.

| No. / Companion | Books named by Nawawi | Source narration(s) and mapping judgment, Namaq's analysis |
| --- | --- | --- |
| 1 / Umar | B, M | [B 54, Faith](https://sunnah.com/bukhari:54), [M 1907a, Government](https://sunnah.com/muslim:1907a). Full migration clauses; opening wording varies. [B 1](https://sunnah.com/bukhari:1) omits the explicit migration-to-Allah-and-Messenger clause. Store B 1 as partial, not an exact replacement. |
| 2 / Umar | M | [M 8a, Faith](https://sunnah.com/muslim:8a). Excerpt from a longer story; preserve both collector routes, tahwil and Ibn Umar's embedded report from Umar. B 50 is a separately related Abu Hurayra report. |
| 3 / Ibn Umar | B, M | [B 8, Faith](https://sunnah.com/bukhari:8), [M 16c, Faith](https://sunnah.com/muslim:16c). B matches the Hajj-then-fasting order. Muslim's routes have wording/order differences; preserve them. |
| 4 / Ibn Masud | B, M | [B 3208, Beginning of creation](https://sunnah.com/bukhari:3208), [M 2643a, Destiny](https://sunnah.com/muslim:2643a). Wording variants, including Muslim's في ذلك. Never merge the embryology clauses into a new matn. |
| 5 / Aisha | B, M | [B 2697, Reconciliation](https://sunnah.com/bukhari:2697), [M 1718a, Judicial decisions](https://sunnah.com/muslim:1718a). Nawawi also quotes the separate [M 1718b](https://sunnah.com/muslim:1718b) wording من عمل عملا. Keep two excerpt links and their own chains. |
| 6 / Nu'man b. Bashir | B, M | [B 52, Faith](https://sunnah.com/bukhari:52), [M 1599a, Transactions](https://sunnah.com/muslim:1599a). Variant forms of the lawful/unlawful report. |
| 7 / Tamim al-Dari | M | [M 55a, Faith](https://sunnah.com/muslim:55a). Preserve the transmission discussion alongside the full chain; do not turn an intermediary discussion into Prophetic speech. |
| 8 / Ibn Umar | B, M | [B 25, Faith](https://sunnah.com/bukhari:25), [M 22, Faith](https://sunnah.com/muslim:22). Close wording, separately retained routes. |
| 9 / Abu Hurayra | B, M | [B 7288, Holding fast](https://sunnah.com/bukhari:7288), [M 1337, Hajj](https://sunnah.com/muslim:1337). Excerpt; Muslim includes the question about repeating Hajj. Clause order differs. |
| 10 / Abu Hurayra | M | [M 1015, Zakat](https://sunnah.com/muslim:1015). Longer report with the traveller's supplication and quoted Quran. |
| 11 / Hasan b. Ali | T, N | [T 2518, Resurrection](https://sunnah.com/tirmidhi:2518), [N 5711, Drinks](https://sunnah.com/nasai:5711). Excerpt. T includes an additional explanation and another route. Do not import a bracketed number from a different numbering scheme as the work's universal ID. |
| 12 / Abu Hurayra | T and others | [T 2317, Asceticism](https://sunnah.com/tirmidhi:2317). [T 2318](https://sunnah.com/tirmidhi:2318) is the mursal Ali b. Husayn route and compiler comparison, not a full Abu Hurayra chain. |
| 13 / Anas | B, M | [B 13, Faith](https://sunnah.com/bukhari:13), [M 45a, Faith](https://sunnah.com/muslim:45a). Muslim has brother/neighbour variant wording; B has two initial routes. |
| 14 / Ibn Masud | B, M | [B 6878, Blood money](https://sunnah.com/bukhari:6878), [M 1676a, Oaths/blood liability](https://sunnah.com/muslim:1676a). Different order/wording of the three cases. |
| 15 / Abu Hurayra | B, M | [B 6018, Manners](https://sunnah.com/bukhari:6018), [M 47a, Faith](https://sunnah.com/muslim:47a). Muslim has honouring the neighbour; B 6018 says not to harm him. Order also varies. |
| 16 / Abu Hurayra | B | [B 6116, Manners](https://sunnah.com/bukhari:6116). Preserve the repeated request and answer as recorded. |
| 17 / Shaddad b. Aws | M | [M 1955a, Hunting/slaughter](https://sunnah.com/muslim:1955a). Separate the Companion's introductory words from the quotation. |
| 18 / Abu Dharr and Muadh | T | [T 1987, Righteousness](https://sunnah.com/tirmidhi:1987). Distinct attributions/routes inside the record. T's discussion prefers the Abu Dharr attribution in the compared route. |
| 19 / Ibn Abbas | T; then an unnamed non-T variant | [T 2516, Resurrection](https://sunnah.com/tirmidhi:2516) supplies the main passage. [Ibn Rajab, ch. 19, 1/459–461](https://shamela.ws/book/4268/453), traces the extra wording to Abd b. Humayd's Musnad and discusses Ahmad's combined routes. Exact non-T collector-chain linkage remains pending; T's chain must not cover the added passage. |
| 20 / Abu Masud Uqba b. Amr | B | [B 3483, Prophets](https://sunnah.com/bukhari:3483). Match the named Companion; do not confuse Abu Masud with Ibn Masud. |
| 21 / Sufyan b. Abd Allah | M | [M 38, Faith](https://sunnah.com/muslim:38). فاستقم versus Nawawi's ثم استقم is a recorded wording difference. |
| 22 / Jabir | M | [M 15c, Faith](https://sunnah.com/muslim:15c) includes Ramadan and the requested clauses. M 15a is shorter; M 15b uses a backward wording reference. Do not expand either silently. |
| 23 / Abu Malik al-Ashari | M | [M 223, Purification](https://sunnah.com/muslim:223). Preserve each quoted clause and the complete record. |
| 24 / Abu Dharr | M | [M 2577a, Righteousness](https://sunnah.com/muslim:2577a). Qudsi report; distinguish Allah's quoted speech, the Prophet's transmission and narrator comments. |
| 25 / Abu Dharr | M | [M 1006, Zakat](https://sunnah.com/muslim:1006). Dialogue is part of the source report, not a Namaq scene invented around the saying. |
| 26 / Abu Hurayra | B, M | [B 2989, Jihad](https://sunnah.com/bukhari:2989), [M 1009, Zakat](https://sunnah.com/muslim:1009). Variant wording; keep the selected charity examples attached to their record. |
| 27 / Nawwas b. Saman; then Wabisa b. Mabad | M; Ahmad and Darimi | First report [M 2553a, Righteousness](https://sunnah.com/muslim:2553a). Separate Wabisa report [Ahmad 18028 / Darimi 2533, retrieval witnesses](https://dorar.net/h/XQnPbbTO?osoul=1). Different Companion, wording and routes; not one chain. Edition-specific numbers and complete imported chains still need collation. |
| 28 / Irbad b. Sariya | AD, T | [AD 4607, Sunnah](https://sunnah.com/abudawud:4607), [T 2676, Knowledge](https://sunnah.com/tirmidhi:2676). Variant wording and visit/story frames. |
| 29 / Muadh | T | [T 2616, Faith](https://sunnah.com/tirmidhi:2616). Retain the full question, deeds, tongue passage and source chain. |
| 30 / Abu Thalaba al-Khushani | Daraqutni and others | Daraqutni, old 4/184; [number 4396 in this digital witness](https://www.islamicurdubooks.com/hadith/hadith-.php?bookid=34&hadith_number=4396). [Ibn Rajab ch. 30, 2/150 onward](https://shamela.ws/book/4268/667), discusses raised/stopped forms and Makhul's unestablished hearing. Freeze an edition before treating 4396 as canonical. |
| 31 / Sahl b. Sad | IM and others | [IM 4102, Asceticism](https://sunnah.com/ibnmajah:4102). Same core text, but the quality of this particular chain is disputed. Other routes cannot simply inherit its chain or Nawawi's collective assessment. |
| 32 / Abu Said | IM, Daraqutni; Malik mursal | Abu Said route [Daraqutni 3079](https://dorar.net/h/TuTUL0ql/osoul), old 3/77; Malik, Muwatta, 2/745, Amr b. Yahya from his father, **mursal**. [IM 2340](https://sunnah.com/ibnmajah:2340) is Ubada and [2341](https://sunnah.com/ibnmajah:2341) Ibn Abbas. [Ibn Rajab 2/207](https://shamela.ws/book/4268/724) explicitly says IM did not transmit the Abu Said report. Store Nawawi's citation and this correction separately. |
| 33 / Ibn Abbas | Bayhaqi; part in B, M | Full proof/oath wording [Bayhaqi, Sunan kubra, old 10/252; digital 21201](https://dorar.net/h/iPutPnCW?osoul=1). [B 4552, Quran commentary](https://sunnah.com/bukhari:4552), [M 1711a, Judicial decisions](https://sunnah.com/muslim:1711a) support part. The complete familiar maxim must not appear under a Sahih chain that lacks it. |
| 34 / Abu Said | M | [M 49a, Faith](https://sunnah.com/muslim:49a). Preserve the Marwan/Eid frame and the point where the Companion cites the Prophet. |
| 35 / Abu Hurayra | M | [M 2564a, Righteousness](https://sunnah.com/muslim:2564a). Nawawi's ولا يكذبه is not in this linked route. Keep the edition difference visible rather than attaching new words to this chain. |
| 36 / Abu Hurayra | M | [M 2699a, Remembrance](https://sunnah.com/muslim:2699a). Nawawi says بهذا اللفظ; still preserve and compare the actual witnesses. |
| 37 / Ibn Abbas | B, M | [B 6491, Heart-softening](https://sunnah.com/bukhari:6491), [M 131a, Faith](https://sunnah.com/muslim:131a). Separate the transmitted saying from Nawawi's explanation after it. |
| 38 / Abu Hurayra | B | [B 6502, Heart-softening](https://sunnah.com/bukhari:6502). Nawawi's excerpt stops before the source record's final وما ترددت passage. |
| 39 / Ibn Abbas | IM, Bayhaqi and others | [IM 2045, Divorce](https://sunnah.com/ibnmajah:2045) says وضع; [Bayhaqi, old 7/356, digital 15195](https://dorar.net/h/TMfpncZ2/osoul) has تجاوز لي. Chains differ over the intermediary Ubayd b. Umayr; do not repair one from the other. |
| 40 / Ibn Umar | B | [B 6416, Heart-softening](https://sunnah.com/bukhari:6416). Mark إذا أمسيت as Ibn Umar's subsequent words, not part of the Prophet's saying. |
| 41 / Abd Allah b. Amr | Kitab al-Hujja | [Ibn Rajab 2/393](https://shamela.ws/book/4268/910) identifies Nasr b. Ibrahim al-Maqdisi's al-Hujja ala Tarik al-Mahajja and reproduces Abu Nuaym's route through Tabarani. This is a mediated chain witness, not a verified export of al-Hujja itself. The original-book linkage remains open. |
| 42 / Anas | T | [T 3540, Supplications](https://sunnah.com/tirmidhi:3540). Qudsi report. Nawawi's grade, Ibn Rajab's report of T's grade, and the present T witness differ; retain each witness and attribution. |

The count above classifies entries by Nawawi's citations, not by whether some related hadith can also be found in a Sahih. Outside-only entries are 11, 12, 18, 19, 28, 29, 30, 31, 32, 39, 41 and 42. Mixed entries are 27 and 33. "Others" is not an exhaustive takhrij list. The unresolved links in 19 and 41 are release blockers for showing a complete original-book chain for those passages; the app could retain Nawawi's excerpt with an explicit unlinked status meanwhile.

## Grading belongs to a scholar, a witness and a route

Do not publish a single Namaq-generated "authenticity" verdict. The following are attributed findings from Nawawi's text, the linked collection's compiler remarks and Ibn Rajab's corresponding chapters. Modern site badges are not substitutes for a named scholar and cited passage. A compiler's grading is its own voice, outside the Prophetic matn.

| Entry | Named scholarly evidence to retain |
| --- | --- |
| 11 | Nawawi reports Tirmidhi's حسن صحيح; [T 2518](https://sunnah.com/tirmidhi:2518) supplies the compiler statement. |
| 12 | Nawawi calls it حسن. [T 2317](https://sunnah.com/tirmidhi:2317) calls that route غريب; [2318](https://sunnah.com/tirmidhi:2318) prefers the mursal route as أصح. That comparative judgment does not establish a connected Abu Hurayra chain. |
| 18 | Nawawi reports حسن, with حسن صحيح in some copies. [T 1987](https://sunnah.com/tirmidhi:1987) has حسن صحيح and a route-attribution discussion. Record both the textual variation and the route scope. |
| 19 | [T 2516](https://sunnah.com/tirmidhi:2516) حسن صحيح for the main route. [Ibn Rajab ch. 19](https://shamela.ws/book/4268/453) discusses the Ahmad combination and identifies Abd b. Humayd's added wording as coming through a weak route. Do not extend T's grade to the extra passage. |
| 27 | Nawawi calls the Ahmad/Darimi Wabisa report's isnad حسن. [Ibn Rajab ch. 27, 2/93 onward](https://shamela.ws/book/4268/610), discusses defects in particular Wabisa routes and other supporting reports. Keep these separate from the Nawwas report in Muslim. |
| 28 | Nawawi and [T 2676](https://sunnah.com/tirmidhi:2676) report حسن صحيح. That label is attached to the cited report, not every later paraphrase. |
| 29 | Nawawi and [T 2616](https://sunnah.com/tirmidhi:2616) report حسن صحيح. |
| 30 | Nawawi calls it حسن. [Ibn Rajab 2/150 onward](https://shamela.ws/book/4268/667) discusses two defects: unestablished Makhul–Abu Thalaba hearing and disagreement over raising/stopping; he reports Daraqutni's preference for the raised form. Preserve all these claims with their speakers. |
| 31 | Nawawi calls it حسن and describes good chains. [Ibn Rajab 2/174 onward](https://shamela.ws/book/4268/691) questions that assessment and discusses Khalid b. Amr in the IM route. A modern unnamed badge is unnecessary to establish the disagreement. |
| 32 | Nawawi حسن, with routes strengthening one another. [Ibn Rajab 2/207 onward](https://shamela.ws/book/4268/724) corrects the IM attribution, reports Hakim's favourable judgment on a connected route and the competing criticisms, and discusses the mursal route. Preserve the actual missing Companion in Malik. |
| 33 | Nawawi حسن and explicitly says only part is in the Sahihayn. His qualification must travel with the citation. The full Bayhaqi wording is not thereby a full Sahihayn quotation. |
| 39 | Nawawi حسن. [Ibn Rajab 2/361 onward](https://shamela.ws/book/4268/878) first describes an outwardly sound chain, then reports Ahmad's and Abu Hatim's objections. Extracting only the favourable opening reverses his discussion. |
| 41 | Nawawi حسن صحيح and بإسناد صحيح. [Ibn Rajab 2/394](https://shamela.ws/book/4268/911) explicitly challenges the authentication, with reasons concerning Nuaym b. Hammad and route variation. See the exact quote below. |
| 42 | The inspected Nawawi witness says حسن صحيح. [Ibn Rajab ch. 42, 2/400 onward](https://shamela.ws/book/4268/917) reports T's حسن غريب and comments on the isnad. The linked [T 3540](https://sunnah.com/tirmidhi:3540) compiler text says غريب. This requires edition comparison, not a silently standardized grade. |

Sahih membership is a bibliographic fact that can be shown with the collection's name. It should not erase a scholar's discussion of a particular word, route or narrator. R0015's distinction between source disagreement and transcription error applies here.

## Numbering and text boundaries

Use a stable internal work ID and narration ID, plus edition-specific printed hadith number, volume/page, book heading and chapter heading. Store all outside aliases with their scheme, including Sunnah reference and in-book reference. For Muslim, Abd al-Baqi's grouped number is the reference anchor; make every collector route under that number independently addressable. `8a` is a useful external alias, not a universal printed number. Bukhari's repeated reports in different chapters remain distinct narrations.

Nawawi's number 1–42 identifies an anthology entry. It can hold several quoted spans and several source relations: exact wording in a pinned witness, excerpt, variant, partial support, related report, disputed attribution or unresolved. These relations are Namaq's reviewed editorial judgments. Keep their basis and reviewer. The same wording under a different Companion is another report, not an automatically equivalent chain.

Store immutable source text and offsets. Keep a separate normalized search string for candidate matching; never display a normalized, respelled or generated string as the quote. Preserve ح, paired collectors, حدثنا/أخبرنا/عن, narrator asides, مجهول/مبهم names, and backward references such as بمثله. If an abbreviated route points to a preceding matn, store that relation explicitly instead of pretending the abbreviated witness printed the expanded matn. Scene labels and chain divisions are Namaq's analysis unless the source itself states them.

## Narrator identities and tabaqa

For the initial 42, recommend a reviewed identity ledger using Taqrib statements, with Tahdhib al-Tahdhib or another named classical rijal work for teachers, students and ambiguous identity. A narrator's source spelling is an occurrence. A person is an identity supported by evidence. A tabaqa is Ibn Hajar's classification. Reliability judgments and proof of hearing are separate claims. An inferred chronology or a shared name does not establish any of these.

| Candidate | Evidence, licence and limitations | Decision |
| --- | --- | --- |
| Taqrib, Shamela 8609 | Classical biography text, entry numbers and explicit generation phrases. Modern edition and bracketed additions need separation, as above. | Best small, inspectable baseline for narrator biographies and tabaqa; retain a source quote for each published claim. |
| [Sanadset V5](https://data.mendeley.com/datasets/5xth87zwb5/5), DOI 10.17632/5xth87zwb5.5 | Publisher lists 650,986 records from 926 books, released 2 November 2022, Mghari, Bouras and El Hibaoui, CC BY 4.0. Commercial reuse is compatible with attribution under that stated licence. This is an isnad/text research dataset, not a certified narrator-to-Taqrib identity and tabaqa concordance. | Candidate extraction/search aid. Audit original text lineage, chain boundaries and labels before importing; do not equate record count with accuracy. |
| [emadjumaah/hadith-kg](https://huggingface.co/datasets/emadjumaah/hadith-kg), [source project](https://github.com/emadjumaah/hadith) | Maintainer advertises CC BY 4.0, about 49,819 biographies and 577,024 linked chains. Card acknowledges stub narrators; README says the raw 2017 dump is not distributed. It also reports a different rawi table count elsewhere. These are maintainer counts, not measurements by this audit. The underlying biography/grade sources and rights need a traceable audit. | Promising candidate identity graph, not approved authority. Download a pinned version only for a separate evaluation; source-level citations, licence lineage and error checks are prerequisites. Do not ship gigabytes of unreviewed data in the phone bundle. |
| OpenITI rijal texts | Searchable classical texts under the corpus's NC-SA licence; no verified complete name-identity graph established here. | Research comparison only for the commercial-compatible plan. |

Matching must consider full name, kunya, nisba, aliases, teacher and student pair, collector route and dates. For example, Muslim's Yahya b. Ya'mar belongs in the opening story; he is not the direct Companion narrator of the embedded Umar report. Abu Masud Uqba b. Amr and Ibn Masud are different people. The abbreviated Ismail b. Ibrahim in B 50 needs the identity proof for Ibn Ulayya, not the first matching search result.

Measure reliability before scaling. For each selected collector route, have one curator identify every occurrence and a second reader verify against the chain and biography. Report reviewed occurrence count, unique identities, unresolved/ambiguous occurrences, mistaken automatic matches and omitted/extra chain nodes. Stratify checks for kunyas, repeated names, tahwil, nested stories, collective narrators and missing names. Publish no accuracy percentage until a held-out, manually adjudicated sample exists. An unresolved narrator should remain unresolved in the UI.

Taqrib's numbered generations do not make collectors members of a guessed later generation. Keep the existing compiler row separate. Quote Ibn Hajar's introduction for the meanings of the classes, and label Namaq's translations or shortened class labels as editorial. Do not infer a narrator's reliability from his tabaqa, or chain continuity from two adjacent tabaqa numbers.

## Commentary and attribution

Recommend Ibn Rajab first. His fifty-chapter structure explicitly covers the 42 and adds eight. Attach author passages by chapter and exact source spans, with the full surrounding discussion available offline when cleared. Within a chapter, attach a passage to a specific Nawawi clause only after reading it. A chapter heading alone does not prove that every sentence explains every clause.

Separate Ibn Rajab's own speech, his quotations of Nawawi, earlier scholars' words and modern footnotes. A grade quoted by Ibn Rajab has both an original speaker and an intermediate witness. Keep that attribution chain. Modern editors' takhrij and authentication stay outside the author corpus unless separately licensed. A saved passage can cross printed pages; store a page range and offsets, not one page ID as if it covered the whole discussion.

The commentary commonly printed under Ibn Daqiq al-'Id's name needs a visible attribution qualification. In [Riyad al-Isa's research article, 13 May 2013](https://islamsyria.com/articles/شرح-الأربعين-النووية-ليس-لابن-دقيق-العيد), he contests that attribution and proposes Ibn Hajar. He also distinguishes later inserted introductory material from the body. This audit does not adjudicate the manuscript question or adopt the proposed replacement author. Use **الشرح المنسوب إلى ابن دقيق العيد** until the owner chooses a specialist-reviewed attribution policy. Never convert the disputed book label into an unqualified "Ibn Daqiq said" card. Its chapter structure permits attachment, but provenance review comes first.

## Verbatim samples and what each proves

These are short excerpts from classical author text, preserving the spelling and tashkeel of the linked digital witness. They are research samples, not a certified full-book transcription. Editorial punctuation follows the witness; quotes from one witness are never passed off as another edition's exact wording.

Al-Nawawi, al-Arba'in, no. 1, Dar al-Minhaj 1430, **printed p. 46**, [Shamela digital page 12](https://shamela.ws/book/12836/12):

> إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله

This is Nawawi's quotation. It is not evidence that Bukhari no. 1 prints all these clauses.

Al-Bukhari, Sahih, **Faith, hadith 8**, [digital witness](https://sunnah.com/bukhari:8), complete chain and matn of this short record:

> حَدَّثَنَا عُبَيْدُ اللَّهِ بْنُ مُوسَى، قَالَ أَخْبَرَنَا حَنْظَلَةُ بْنُ أَبِي سُفْيَانَ، عَنْ عِكْرِمَةَ بْنِ خَالِدٍ، عَنِ ابْنِ عُمَرَ ـ رضى الله عنهما ـ قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ ‏"‏‏.‏

Al-Bukhari, **Faith, hadith 50**, [final compiler remark](https://sunnah.com/bukhari:50):

> قَالَ أَبُو عَبْدِ اللَّهِ جَعَلَ ذَلِكَ كُلَّهُ مِنَ الإِيمَانِ‏.‏

This is Bukhari's remark, not the Prophet's speech. It is exactly the voice distinction the existing Jibril model should preserve at scale.

Ibn Hajar, Taqrib, **entry 416, printed p. 105**, [Shamela digital page 31](https://shamela.ws/book/8609/31):

> إسماعيل ابن إبراهيم ابن مقسم الأسدي مولاهم أبو بشر البصري المعروف بابن علية ثقة حافظ من الثامنة مات سنة ثلاث وتسعين وهو ابن ثلاث وثمانين ع

The phrase من الثامنة supports a tabaqa claim for this identified person. It does not by itself prove that a bare Ismail in an arbitrary chain is that person.

Ibn Rajab, Jami', **chapter 41, 2/394**, [Shamela digital page 911](https://shamela.ws/book/4268/911):

> قلت: تصحيحُ هذا الحديث بعيدٌ جدًّا من وجوه

Read this with [2/393](https://shamela.ws/book/4268/910), which reproduces Nawawi's favourable grade and identifies al-Hujja. The disagreement must remain visible. It cannot become a Namaq-authored compromise grade.

Ibn Rajab, Jami', **chapter 32, 2/207**, [Shamela digital page 724](https://shamela.ws/book/4268/724):

> حديث أبي سعيد لم يخرجه ابنُ ماجه

This directly supports the correction in mapping row 32. It does not authorize deleting Nawawi's original citation from the anthology text.

## Quizzes and daily feed

The following questions are **Namaq proposals**, not quotations from a scholar. Every answer option must be an actual, independently cited source span or source identity. Wrong options remain real names, book titles or matn spans. Never invent a hadith, interpolate a chain, change a word to make a fake quotation, or ask the learner to memorize a disputed grade as Namaq's verdict.

| Type | Concrete proposal and sourced options | Eligibility rule |
| --- | --- | --- |
| Companion | Ask who narrated the selected Bukhari 8 record. Options can quote the source forms ابْنِ عُمَرَ from [B 8](https://sunnah.com/bukhari:8), عُمَرَ بْنَ الْخَطَّابِ from [B 1](https://sunnah.com/bukhari:1), أَنَسٍ from [B 13](https://sunnah.com/bukhari:13), أَبِي هُرَيْرَةَ from [B 6018](https://sunnah.com/bukhari:6018). Correct identity is Ibn Umar. | Scope the prompt to this record. Do not ask "who narrated this meaning?" when another Companion also did. Display forms must come from the selected witness; a full normalized identity label needs its own biography citation. |
| Named collection | Ask which collection Nawawi names for no. 16. Options are the actual collection titles صحيح البخاري، صحيح مسلم، سنن أبي داود، جامع الترمذي, each attached to its work record and title witness. Correct answer Bukhari, according to Nawawi's citation. | Phrase as "according to Nawawi's citation". Asking which book contains a saying can have several correct answers. These are work-title options, not invented scholarly judgments. |
| Complete a quotation | In the selected [B 8](https://sunnah.com/bukhari:8) text, hide the final صَوْمِ رَمَضَانَ. Offer that exact span, مَا نَوَى from [B 1](https://sunnah.com/bukhari:1), مَا يُحِبُّ لِنَفْسِهِ from [B 13](https://sunnah.com/bukhari:13), and لاَ تَغْضَبْ from [B 6116](https://sunnah.com/bukhari:6116), using each witness's actual spelling/vowels. | These illustrate source selection, not final reviewed question typography. Store each option's exact span. Present wrong options as candidate fragments, never as full stitched quotations attributed to the Prophet. Exclude another valid continuation found in an approved variant. |
| Voice/source literacy | Ask whose remark the final line of [B 50](https://sunnah.com/bukhari:50) is. Options are cited person labels from relevant records; the proof is قال أبو عبد الله. | Only after the learner sees the source and the collector's identified kunya. A voice assignment without a source or reviewed identity must not enter the bank. |

Prefer two or three good options to four ambiguous ones. Questions should assess source facts or exact recall. Interpretive questions require an actual scholar's question/answer or a cited commentary passage, and every distractor must still quote real source material. Do not generate "plausible" doctrinal alternatives. No narrator-rank quiz until every displayed identity and tabaqa has its own evidence.

A proposed daily card uses an exact short matn selection, Companion, collection and hadith number. It opens the full source record, all chain routes and the source excerpt with context. Below it, a short licensed classical commentary selection names its scholar and locator. A card based on no. 41 must show the grading disagreement or defer that card until reviewed; the daily selector must not strip qualifications. For no. 40, a separate Ibn Umar quotation stays labelled as his words.

The new [feed-card rule](../../AGENTS.md) and [feed inventory](../feed-cards.md) require a hadith card and a quiz kind when this feature is built. Reuse the offline day selection in [shared/dailyPick.ts](../../shared/dailyPick.ts) and the app's [daily.ts](../../mobile/src/lib/daily.ts), after reviewing the current feed integration. Store only approved local record/span IDs in the daily pool. Date choice and question wording are Namaq's editorial work. Every card must remain usable without Sunnah, Shamela or an API being reachable. External links supplement the bundled text.

This audit adds no questions to the bank. A later question-authoring PR must follow [the quiz review workflow](../quiz-question-review.md), including independent review and its validation/projection gates.

## Recommended data plan and growth order

The following is a product/data proposal by Namaq, not a scholarly ranking of books or a prescribed course of study.

1. Freeze the Arabic witnesses for Nawawi, Bukhari and Muslim. Acquire their text and scan evidence, resolve file terms and modern additions, hash assets and record provenance. Add adopted sources once in `shared/sources.ts`. Keep all 42 anthology entries, with unapproved links visibly pending.
2. Curate the 28 Sahih-only entries first, plus the Sahih portions of 27 and 33. Save Nawawi spans separately from collector records. For each source route preserve the entire record, chain transitions, stories and voice boundaries. Have a second reader compare the text against print and verify the mapping. Avoid releasing a synthetic "full Nawawi chain".
3. Complete the outside-only and mixed entries book by book. Resolve the unnamed added route of 19, Malik's mursal form, Bayhaqi's complete wording and the mediated witness for 41. Pin editions before converting old volume/pages into newer numbers. Save each named scholar's grade as a separate cited statement with route and wording scope.
4. Build the small narrator ledger from the selected routes. Link source occurrences to biographies, store exact tabaqa statements and review ambiguous matches. Reuse the existing report/scene/chain model, replacing the fixture book list and manual ranks through the repository's evidence model. This requires a later design/implementation PR; no parallel hadith store is proposed here.
5. Attach Ibn Rajab's first 42 chapters by reviewed source spans, with attribution and editor boundaries. Add approved recall/source questions and a small daily pool from the same records. Measure bundle size and load time on a phone before deciding whether commentaries ship built-in or as an offline download. Do not estimate a compressed payload without actually building the data.
6. Add Ibn Rajab's eight extra hadith as a small follow-on corpus, with their own source mappings. Then expand through bounded Faith, knowledge, manners and remembrance chapters in the Sahihayn, using the already linked narrators and repeated reports. Muslim's grouped routes help comparisons; Bukhari's repeated placements teach chapter context. This order is a practical proposal, not a claim that one collection is easier or more authoritative.
7. Grow to the complete Sahihayn only after the importer handles tahwil, multiple routes, abbreviated matn references, muallaq reports, compiler comments and repeated chapter placements. Keep every original occurrence addressable even when search groups related matns. Full commentaries and modern translations are separately approved acquisitions.

For every published unit retain work/edition IDs, asset hash, printed locator, digital locator, exact source text and span, voice, narration relation, chain-occurrence IDs, biography evidence, commentary links, grading speaker and scope, rights record, reviewer and approval status. Review tools may suggest matches; they may not author missing narrations, biographies, explanations or grades.

## Open questions for the owner

- Approve the Arabic-only, author-text acquisition path, or seek explicit commercial/offline grants from a particular digital provider? Which legal markets should the rights ledger cover?
- Who will perform hadith/rijal and print-collation review? The full-chain links for 19 and 41 need specialist resolution before that view can claim completeness.
- Should all 42 be readable initially with unresolved chain links labelled, or should release wait until every chain, tabaqa and commentary attachment passes review?
- Adopt the Sultani Bukhari and Abd al-Baqi Muslim witnesses proposed here, and which scan copies should be the pinned collation references?
- Show all named grading disagreements with cited passages by default, or show a concise attributed notice that opens the full discussion? No single Namaq grade is recommended.
- Defer the commentary attributed to Ibn Daqiq, or show it under the qualified title until manuscript/attribution review resolves the policy?
- Bundle the first Ibn Rajab selections or offer the author-only commentary as an optional offline download after payload measurement?

The audit leaves these decisions open and adds no app feature, dataset, registry entry or quiz record.
