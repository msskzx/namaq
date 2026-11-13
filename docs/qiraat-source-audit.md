# Qira'at source audit

This audit checks 50 existing word positions from the per-ayah dataset introduced in PR #720. It changes seven definite errors and leaves four doubtful positions unchanged. No UI code changes.

## Method and limits

The sample is the first 50 eligible stored word positions in al-Baqara, in ayah and anchor order, at the fetched main revision. It is a consecutive, nonrandom sample, not an estimate for the whole Quran. A position counts once even when it has several readings. The audit checks the stored forms, reader assignments and anchors, not whether every variant in the book was imported.

Exclude Ibrahim spellings, including their overlapping phrase entry, so repetitions of one rule do not dominate the sample. Also exclude the stored performance positions 2:14 مستهزئون, 2:34 للملائكة اسجدوا, 2:62 الصابئين, 2:67 and 2:169 يأمركم, 2:136 النبيون and 2:142 صراط. Retain 2:173 اضطر because Abu Jafar's ta vowel is a word difference, while the preceding particle's joining vowel is performance. The last sampled position is 2:177 البر. The anchor column below records the original zero-based start, including the incorrect anchor being fixed.

Definite errors before correction: **7/50, or 14%**. Doubtful positions: **4/50, or 8%**, reported separately rather than called correct or wrong. The other **39/50** agree within this audit's scope. These counts describe this sample only. Several rows apply the same book rule to separate ayat.

## Source

All book references below are Ibn al-Jazari, *al-Nashr fi al-qira'at al-'ashr*, edited by Ali Muhammad al-Dabba, al-Matba'a al-Tijariyya al-Kubra, Dar al-Kutub al-Ilmiyya reproduction, volume 2. Page numbers are printed pages, not PDF indices. The [IslamHouse text](https://islamhouse.com/read/ar/النشر-في-القراءات-العشر-810046) identifies that edition and preserves its volume/page boundaries. The [downloadable book](https://d1.islamhouse.com/data/ar/ih_books/single_010/ar_elnashr_fe_elqaraat_el3ashr.pdf) is also available. The findings use the book's reader rules and its explicit route qualifications. Kufans includes Khalaf al-Ashir; Shuba is Abu Bakr in the book. The Medinans are Nafi and Abu Jafar, and the Basrans are Abu Amr and Yaqub.

## Checked positions

Every page in this table belongs to volume 2 of *al-Nashr*.

| Ayah | Original anchor | Word | Printed page | Book rule checked | Result |
| --- | ---: | --- | --- | --- | --- |
| 2:9 | 4 | يخدعون | 207 | Nafi, Ibn Kathir and Abu Amr use يخادعون; the others use يخدعون. | Matches |
| 2:10 | 11 | يكذبون | 207-208 | The Kufans use the light form; the others use the doubled form. | Matches |
| 2:36 | 0 | فأزلهما | 211 | Hamza alone has the long alif and light lam. | Matches |
| 2:37 | 4 | كلمات | 211 | Ibn Kathir raises كلمات; the others use the accusative. | Fixed word text |
| 2:38 | 11 | خوف | 211 | Yaqub opens the fa without tanwin; the others raise it with tanwin. | Matches |
| 2:48 | 9 | يقبل | 212 | Ibn Kathir and both Basrans use the feminine verb. | Matches |
| 2:51 | 1 | واعدنا | 212 | Abu Jafar and both Basrans omit the long alif. | Matches |
| 2:58 | 15 | نغفر | 215 | Ibn Amir has تغفر, the Medinans يغفر, and the others نغفر. | Matches |
| 2:62 | 18 | خوف | 211 | Yaqub opens the fa without tanwin, as at 2:38. | Matches |
| 2:74 | 36 | تعملون | 217 | Ibn Kathir alone uses يعملون. | Matches |
| 2:81 | 6 | خطيئته | 218 | Both Medinans use the plural خطيئاته. | Matches |
| 2:83 | 6 | تعبدون | 218 | Ibn Kathir, Hamza and Kisai use يعبدون. | Matches |
| 2:83 | 17 | حسنا | 218 | Hamza, Kisai, Yaqub and Khalaf open both ha and sin. | Matches |
| 2:85 | 10 | تظاهرون | 218 | The Kufans use the light form; the others double it. | Matches |
| 2:85 | 16 | أسارى | 218 | Hamza alone uses أسرى. | Matches |
| 2:85 | 17 | تفادوهم | 218 | Both Medinans, Asim, Kisai and Yaqub use تفادوهم. | Matches |
| 2:85 | 48 | تعملون | 218 | Nafi, Ibn Kathir, Yaqub, Khalaf and Shuba use يعملون; the others تعملون. | Fixed missing Abu Jafar |
| 2:87 | 15 | القدس | 216 | Ibn Kathir alone silences the dal. | Matches |
| 2:90 | 9 | ينزل | 218-219 | Ibn Kathir and both Basrans lighten the zay. | Matches |
| 2:96 | 24 | يعملون | 219 | Yaqub alone uses تعملون. | Matches |
| 2:97 | 4 | جبريل | 219 | Ibn Kathir opens jim without hamza; Shuba has two hamzated forms. | Fixed Shuba |
| 2:98 | 6 | جبريل | 219 | The same Gabriel rule applies in both Baqara positions. | Fixed Shuba |
| 2:98 | 7 | ميكال | 219 | Both Basrans and Hafs omit hamza; the Medinans have hamza without ya; Qunbul has two routes. | Doubtful |
| 2:102 | 10 | ولكن | 219 | Ibn Amir, Hamza, Kisai and Khalaf lighten nun and raise the following noun. | Matches |
| 2:105 | 9 | ينزل | 218-219 | Ibn Kathir and both Basrans lighten the zay. | Matches |
| 2:106 | 2 | ننسخ | 219-220 | Ibn Amir raises the first nun and lowers sin, except Hisham's Dajuni route. | Doubtful |
| 2:106 | 6 | ننسها | 220 | Ibn Kathir and Abu Amr have ننسأها; the others ننسها. | Matches |
| 2:111 | 11 | أمانيهم | 217-218 | Abu Jafar lightens ya, silences it here and lowers ha. | Matches |
| 2:112 | 11 | خوف | 211 | Yaqub opens the fa without tanwin, as at 2:38. | Matches |
| 2:116 | 0 | وقالوا | 220 | Ibn Amir alone omits waw before قالوا. | Matches |
| 2:117 | 10 | فيكون | 220 | Ibn Amir alone has accusative nun at this position. | Matches |
| 2:119 | 6 | تسأل | 221 | Nafi and Yaqub open ta and make lam jussive. | Matches |
| 2:125 | 5 | واتخذوا | 222 | Nafi and Ibn Amir open kha; the others lower it. | Matches |
| 2:126 | 21 | فأمتعه | 222 | Ibn Amir alone lightens ta. | Matches |
| 2:132 | 0 | ووصى | 222-223 | The Medinans and Ibn Amir have وأوصى. | Matches |
| 2:140 | 1 | تقولون | 223 | Ibn Amir, Hamza, Kisai, Khalaf, Hafs and Ruways use the address form. | Matches |
| 2:143 | 43 | رؤوف | 223 | Both Basrans and Kufans except Hafs shorten the hamza. | Matches |
| 2:144 | 33 | يعملون | 223 | Abu Jafar, Ibn Amir, Hamza, Kisai and Rawh use تعملون. | Matches |
| 2:148 | 3 | موليها | 223 | Ibn Amir alone has مولاها. | Matches |
| 2:149 | 16 | تعملون | 223 | Abu Amr alone uses يعملون. | Matches |
| 2:158 | 18 | تطوع | 223 | Hamza, Kisai, Khalaf and Yaqub use يطوع with doubled ta and jussive ayn. | Matches |
| 2:164 | 34 | الرياح | 223 | Hamza, Kisai and Khalaf use the singular here. | Matches |
| 2:165 | 17 | يرى | 224 | Nafi, Ibn Amir and Yaqub address the reader; Ibn Wardan has a route with that form too. | Doubtful |
| 2:165 | 21 | يرون | 224 | Ibn Amir alone raises ya. | Matches |
| 2:165 | 23 | أن القوة | 224 | Abu Jafar and Yaqub lower the opening hamza. | Matches |
| 2:165 | 26 | وأن | 224 | Abu Jafar and Yaqub lower the hamza; all others open it. | Fixed Khalaf an Hamza |
| 2:168 | 10 | خطوات | 216 | Nafi, Abu Amr, Hamza, Khalaf and Shuba silence ta; Bazzi has both routes. | Doubtful |
| 2:173 | 3 | الميتة | 224-225 | Abu Jafar alone doubles ya here. | Matches |
| 2:173 | 12 | اضطر | 225-226 | Abu Jafar lowers ta; all others raise it. The particle's joining vowel is performance. | Fixed missing riwayat |
| 2:177 | 0 | البر | 226 | Hamza and Hafs use accusative البر; all others raise it. | Fixed anchor |

## Corrections and regression coverage

Each changed position has its book, volume, page and replacement in `scripts/quran/qiraatCorrections.json`. `buildQiraat.ts` applies that table after the dump conversion and before writing the bundled data. A missing original position fails the build rather than silently discarding its correction. `shared/quran/qiraatData.test.ts` has one regression test per changed position.

- 2:37, p. 211: replace the instruction "raise the ta" with the actual reading كَلِمَاتٌ. Ibn Kathir's nominative is explicit.
- 2:85, p. 218: add both Abu Jafar riwayat to تعملون. The book enumerates the five readers or narrators who use يعملون and assigns the address form to the remainder.
- 2:97 and 2:98, p. 219: remove Shuba from Ibn Kathir's unhamzated جَبْرِيل and retain both Shuba routes, جَبْرَئِيل and جَبْرَئِل. The book gives al-Ulaymi the former and Yahya ibn Adam the latter. Both are retained; the correction selects neither route.
- 2:165 وأن, p. 224: move Khalaf an Hamza to the open hamza group. The book restricts the lowered hamza to Abu Jafar and Yaqub.
- 2:173, pp. 225-226: add the ten omitted riwayat to the raised ta group of اضطر. All readers other than Abu Jafar raise ta. Particle joining vowels do not create separate farsh groups.
- 2:177, p. 226: anchor البر itself at token 2. The previous span included the rub marker and ليس and omitted the word whose case differs. Keep Hafs and Hamza on the accusative and the rest on the nominative.

## Doubtful positions left unchanged

These need a decision about the dataset's route scope before adding readings. They are excluded from the definite-error numerator.

- 2:98 ميكائيل, p. 219: the book gives Qunbul both hamza-with-ya and hamza-without-ya routes. The dump stores only the former. Do not silently expand its route scope.
- 2:106 ننسخ, pp. 219-220: the book exempts Hisham's Dajuni route from the raised-nun, lowered-sin form. The dataset stores only that form for Hisham.
- 2:165 يرى, p. 224: a specified Ibn Wardan route has ترى, while the dataset names him only for يرى.
- 2:168 خطوات, p. 216: Bazzi has both silenced and raised ta routes in the book; the dataset names him only for silenced ta.

`docs/records/` was absent in the starting checkout and present in the fetched-main audit worktree. Records 0009, 0010 and 0026-0028 were read there before opening the PR. Record 0028 prompted an explicit comparison confirming that all four doubtful entries, including Qunbul and Bazzi route assignments, remain unchanged. Distillate record `namaq/0015-two-sources-that-disagree-are-not-an-error` was also read; it did not change the implementation or checks. Its first activity-log append failed with a sandbox permission error; a later authorized append succeeded. The marker/anchor detour is recorded locally in Distillate as `namaq/0029-empty-normalized-tokens-can-steal-word-anchors`.
