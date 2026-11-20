# Batch 13: Siyar v6 entries 1-19 (printed pages 5-100) and v5 #118

Units: `units/siyar-v6-1-abu-bakrah.json` to `units/siyar-v6-19-aqil.json`, plus `units/siyar-v5-118-umayr.json`.
Entry 19 (Aqil, pp. 99-100) is the second entry of the man batch 2 converts as v4 #35, and v5 #118 (Umayr ibn Sa'd,
pp. 557-562) is the second entry of v5 #12 (the editor: «تقدمت ترجمته في الصفحة ١٠٣ من هذا الجزء بأخصر مما هنا»).
Neither second entry carries name.full: the first entry owns the name in the app, and these add what only they state.
Source: Risalah third edition, witness `siyar-alam-al-nubala-risalah`. Store page v6/37 had its heading split over two
lines («١٠» then «- معاوية…»); the two lines are joined so the coverage test finds the heading. No other page changed.
Scripts that build each unit: `/mnt/project-files/tarajim-app/conversion/batch13/` (h.py takes quotes without harakat
and resolves them to the page; each script's top comment lists what was left out and why).

Classes follow the guide: **same**; **addition** (the model holds more of what the entry states); **rule** (different
by a modelling rule); **unsupported** (the catalog value is not stated in this entry).
`titles: companion` is catalog-only for every person: the entry does not state it as a title (**rule**, as in the earlier
batches). `fullName` differs for every person because the model keeps the print with its harakat and the heading's
nisbas where they stand (**rule**, guide 1). Every PARTICIPATED_IN, SIBLING_OF, COMPANION_OF, kunya, appearance,
office, died.* and virtue shown as model-only is an **addition** with its own page. Fathers with no catalog file get a
slug from their name (guide 12); `parents` model-only is an **addition**.

COMPANION_OF is modelled only where the sentence names the Prophet ﷺ («صاحب رسول الله», «كنت مع النبي…»). «له: صحبة»
alone names no one, so it is not a COMPANION_OF (Ibn Abi Sarh, Ruwayfi', Hisham ibn Hakim).

## Per person

- **Abu Bakrah** (5-10). fullName «نفيع بن الحارث». Father: al-Harith ibn Kaladah (author; Ibn Asakir) against Masruh
  («وقيل»; his own «فأنا نفيع بن مسروح»): contested, each DISPUTED (guide 3a). Six children, mother Sumayyah, Ziyad his
  brother through her. Virtue «من فقهاء الصحابة» (author; quiz skip). Death at Basra (Ibn
  Sa'd), 51 («فقيل»), 52 (Khalifah). Left out: al-Hasan's «لم ينزل البصرة أفضل…» (removed on review).
- **Uthman ibn Talhah** (10-12). Father now the catalog's talhah-ibn-abdullah-ibn-abd-al-uzza (guide 10; the draft had a
  new slug). parents: different → **rule** resolved to the catalog slug. Virtues: «حاجب البيت الحرام» (quiz skip: his family
  shares it) and the key of the Ka'bah (author).
- **Shaybah ibn Uthman** (12-13). Father now the catalog's uthman-al-hijabi-ibn-abdullah (as above). Cousin Uthman ibn
  Talhah, the Sidanah (author; quiz skip, shared with Uthman). Kunya «أبو صفية» (author), «أبو عثمان» («وقيل»). Two children. Death 59 (author),
  58 at Makkah («وقيل»).
- **Abu Rifa'ah** (14). Khalifah's other name «عبد الله بن الحارث» is name.variant (guide 13). The printed line «ابن عدي
  بن عبد مناة بن أد بن طابخة» is his tribe's, not father by father, so `nasabSlips.json` stops his tree before «عدي»
  (guide 11). His death (killed in an army
  under Abd al-Rahman ibn Samurah, no year) is left out. Quiz skips: «من فضلاء الصحابة», «ذا تعبد وتهجد».
- **Thawban** (15-18). Fathers Jahdar (author) and Bajdad («وقيل»): DISPUTED (guide 3a), kept from the draft. The
  conquest of Egypt (Ibn Yunus) has no catalog event. Death 54 at Hims (Ibn Sa'd; Thawr ibn Yazid); «وقبض بحمص» (Abd
  al-Samad). Virtue «من تكفل لي…» (Abu al-Aliyah; «وهذا سند صحيح», the editor).
- **Abdullah ibn Amir** (18-21). Gap: «ابن خال عثمان» (no maternal-cousin predicate). Quiz skips: «من كبار ملوك
  العرب», «رفق وحلم». Left out: «سخيا كريما» (removed on review).
- **Al-Mughirah** (21-32). Left out: the accusation story, the khutbah reports, «آخر الناس عهدا» (Mujalid, weak), Jarir's
  «استغفروا للمغيرة» (ungraded). Death 50, Sha'ban, aged 70 («وقال الجماعة», a named group of
  transmitters, so TRANSMITTED, not «قيل»). Quiz skip «من كبار الصحابة…».
- **Abdullah ibn Sa'd ibn Abi Sarh** (33-35). Kunya «أبو يحيى»; amir of Egypt for Uthman; «الذي فتح إفريقية» (author). Left
  out: Dhat al-Sawari (no catalog event). Death 59 rests on «قيل» (Abu Nu'aym) and the author's «والأصح: وفاته في خلافة علي»: DISPUTED
  (guide 17). Gaps: «أخو عثمان من الرضاعة» (no milk-brother predicate). Left out: «وقيل: شهد صفين» (the author: «والظاهر
  أنه اعتزل الفتنة»); death at al-Ramlah or Asqalan (two ungraded places).
- **Ruwayfi' ibn Thabit** (36). Tripoli of the Maghrib for Mu'awiyah, 46 (author); died at Barqah as its amir (Ibn
  al-Barqi; Ibn Yunus, 56).
- **Mu'awiyah ibn Hudayj** (37-40). Kunyas «أبو نعيم» and «أبو عبد الرحمن» (author). Companionship DISPUTED (guide 3a):
  the author and Ibn Sa'd «له صحبة», «ذكر الجمهور أنه صحابي», against Ibn Sa'd's other placing among the first generation
  after the Companions («لقي عمر»). Amir of Egypt for Mu'awiyah; al-Yarmuk (author). Son Abd al-Rahman (author). Virtue «خير أمير…» (Abd al-Rahman ibn
  Shimasah; Muslim 1828, «إسناده صحيح»). Death in Egypt, 52 (Ibn Yunus). Left out: al-Hasan's rebuke and Abu Qabil's
  report (ungraded, against him; the author: «فسبيلنا الكف»).
- **Abu Barzah** (40-44). fullName «نضلة بن عبيد» («على الأصح», author); the five other names («نضلة بن عمرو», «نضلة بن
  عائذ», «ابن عبد الله», «عبد الله بن نضلة», «خالد بن نضلة») are name.variant on their «وقيل»/«ويقال» (guide 13).
  Son al-Mughirah (author). Conquest of Makkah (Ibn Sa'd), Khaybar and «آدم، ربعة» (author). Death places Basra, Khurasan, the desert between Herat
  and Sijistan (each «قيل»), Marw (Ibn Sa'd); years 60 («يقال»), 64 (al-Hakim). Left out: Ibn Khatal (a deed), «حرب
  الحرورية» (which battle is not certain), the ungraded reports.
- **Hakim ibn Hizam** (44-51). Father hizam-ibn-khuwaylid (same). Kunya «أبو خالد». Hunayn and al-Ta'if (author). Al-Zubayr
  his paternal cousin (author). Eight children (author, p45). Age 120 (Ibrahim ibn al-Mundhir; Ibn Mandah). Appearance
  (al-Zubayr ibn Bakkar). Virtues: «أسلمت على ما سلف لك من خير» (the Prophet ﷺ; al-Bukhari, Muslim 123), «فما أخذ حكيم من
  أبي بكر ولا ممن بعده…» (Urwah; al-Bukhari, Muslim 1035), «علامة بالنسب…» (author). Death 54 (al-Haytham, al-Mada'ini,
  Abu Ubayd, Shabab: one report each). Gaps: Khadijah his aunt (no aunt predicate), born in the Ka'bah (no birth place),
  born 13 years before the Elephant (relative). Left out: al-Bukhari's «ستين… وستين» (the author corrects the split),
  «من دخل دار حكيم» and the Islam of the three (mursal), «أربعة أربأ بهم» (weak), the hundred slaves at Arafah (weak).
- **Hisham ibn Hakim** (51-52). Father hakim-ibn-hizam (his converted entry). Virtue «صليبا، مهيبا» (Ibn Sa'd; quiz skip).
  Left out: al-Zuhri's «يأمر بالمعروف» (removed on review). Death «في أول خلافة معاوية» (no year): gap.
- **Ka'b ibn Ujrah** (52-54). Bay'at al-Ridwan (author). Four sons. Death 52 (author). His own words (al-Bukhari): with
  the Prophet ﷺ at al-Hudaybiyyah (COMPANION_OF) and «ونزلت فيّ آية الفدية» (ABOUT_AYAH 2:196, the ayah the editor names).
  Left out: Ibn Sa'd «بلوي» against al-Waqidi «من أنفسهم» (lineage, not maghazi), al-Waqidi's Islam story, the poverty
  hadith, «يده دخلت الجنة» (ungraded).
- **Amr ibn al-As** (54-77). Kunya «أبو عبد الله» (author), «أبو محمد» («ويقال»). Son Abd Allah (author). Urwah ibn
  Uthathah his brother through the mother (al-Zubayr ibn Bakkar). Appearance (Ibn al-Barqi). Died in Egypt (al-Bukhari). His brother Hisham through «ابنا العاص… عمرو وهشام». Virtues
  from the Prophet ﷺ: «ابنا العاص مؤمنان» (hasan; quiz skip, shared with Hisham), «أسلم الناس وآمن عمرو» (hasan), «نعما
  بالمال الصالح للرجل الصالح» (sahih). Dhat al-Salasil over Abu Bakr and Umar (Abu Uthman al-Nahdi from Amr; al-Bukhari,
  Muslim 2384): office and battle. Oman at the Prophet's ﷺ death, Egypt under Umar and Uthman, Egypt from Mu'awiyah (author).
  Al-Yarmuk (author). Death year: 43 (al-Layth, al-Haytham ibn Adi, al-Waqidi), 42 (Ibn Numayr: «سنة اثنتين»), 43 (Yahya ibn
  Bukayr: «سنة ثلاث»); the last two print no decade, so they read it from «سنة ثلاث وأربعين» on the same page (guide 16).
  Left out: «رشيد الأمر» (weak), Talhah's «من صالحي قريش» (munqati'), «اللهم صل على عمرو» (munqati'), «هذان المؤمنان»
  (two people), «يرحم الله عمرا» (one narrator ungraded), Shaddad's report (two unknowns), the ages at death (99, about
  100, 70: the author reckons «بضع وثمانون سنة، ما بلغ التسعين», no number), 51 («وهذا خطأ») and 58 («وهذا لا شيء»), the
  night of Eid al-Fitr («قالوا», no year beside it). Catalog-only spouse raitah-bint-al-hajjaj: **unsupported** in this
  entry (she is Abd Allah's mother in his entry). Catalog BROTHER hisham-ibn-al-as: **rule** (the tree joins the
  brothers through the same father slug).
- **Hisham ibn al-As** (77-79). Father al-as-ibn-wail-al-sahmi; mother Umm Harmalah, Abu Jahl's sister (author, pp.
  77-78). Virtues «الرجل الصالح، المجاهد» (author), «ابنا العاص مؤمنان» («صحيح», the editor), early Islam and the hijrah to
  Abyssinia (Ibn Sa'd; quiz skip). Left out: his death «يوم اليرموك، أو غيره» (place not certain), «لم يعقب» (no predicate).
- **Abd Allah ibn Amr** (79-94). Father amr-ibn-al-as (his converted entry). Kunya «أبو محمد» (author), «أبو عبد الرحمن»
  and «أبو نصير» («وقيل»). Mother Ra'itah bint al-Hajjaj (author). «ويقال: كان اسمه العاص» as name.variant. Virtues: the
  author's, and Abu Hurayrah's «إلا ما كان من عبد الله بن عمرو، فإنه يكتب ولا أكتب» (al-Bukhari). Son Muhammad (author).
  Appearance «سمينا» (Qatadah). Siffin on Mu'awiyah's right wing (Abu Ubayd; his own «ما ضربت بسيف»). Kufah for Mu'awiyah (Khalifah). Death 63
  (Ahmad), 65 in Egypt (Yahya ibn Bukayr; the same year from Khalifah, Abu Ubayd, al-Waqidi, al-Fallas; the editor: «وهو
  الصحيح»); al-Ta'if (Khalifah), Makkah («ويقال»). Left out: «نعم أهل البيت» (munqati'), the Torah reading (the author:
  «منكر»), «ألف مثل» (Ibn Lahi'ah), his looks from al-Uryan and Sulayman ibn Rabi'ah (contradict each other, ungraded),
  death in al-Sham (his children, no named sayer).
- **Jubair ibn Mut'im** (95-99). Father mutim-ibn-adi (same). Kunya «أبو محمد» (author), «أبو عدي» («ويقال»). Sons
  Muhammad and Nafi'. Al-Tur at Maghrib when he came about the captives of Badr (his own words; «إسناده حسن», al-Bukhari,
  Muslim 463): PARTICIPATED_IN jubair-hears-al-tur. Virtues: the author's, and Mus'ab ibn Abd Allah's. Kufah for Umar
  (Khalifah). Death 59 (al-Haytham ibn Adi, Khalifah), 58 (al-Mada'ini). Left out: «ابن عم النبي» (not a first cousin:
  Nawfal and Hashim were brothers), the monastery story (weak), Hassan's lament («فيما قيل»; poems wait).
- **Aqil ibn Abi Talib, second entry** (99-100). The Prophet's ﷺ paternal cousin; kunyas «أبو يزيد» and «أبو عيسى»; his
  brothers Ali and Ja'far; Mu'tah; «علامة بالنسب وأيام العرب» (all author). kunya: different → **addition** (the catalog
  has the accusative «أبا يزيد»). Left out: Badr with the pagans, «إني أحبك لقرابتك» (mursal, the author).
- **Umayr ibn Sa'd, second entry** (v5 557-562). «العبد الصالح، الأمير», the conquest of Damascus with Abu Ubaydah, Damascus
  and Hims for Umar (author); «وكان من الزهاد» (al-Qaddah). Left out: «لا عدوى» (weak), the Hims story (Abd al-Malik ibn
  Harun: «كذاب»), Mu'awiyah's and Ibn Sirin's reports (ungraded), «زهاد الأنصار ثلاثة» («ويقال»).

## Carried fixes

- Batch 4 (guide 13): Abu al-As's «وقيل: اسم أبيه ربيعة» (v4 p331) and Ibn Sa'd's «بلال بن عبد الله» for Bilal (v4 p351)
  are now name.variant, each on its sayer («وقيل»; Muhammad ibn Sa'd, as a second statement of the unit's existing
  Ibn Sa'd report). Applied by
  `/mnt/project-files/tarajim-app/conversion/batch13/batch4_fixes.py`.
- Batch 12/13: the kunya-only heading («أبو ثعلبة الخشني» → «أبو ثعلبة») and the «لؤي»/«لأي» folding are already on
  main (`nasabOf` in src/lib/model/appPeople.ts; `bare` in shared/tarajimLine.ts), with tests. Nothing more to apply.

## Checks

- `npm run model:check`: 298 units after merging main (batches 15 and 17 landed meanwhile; 20 units here).
- `npx vitest run shared/ src/lib/model`: 1506 passed; `shared/tapSize.test.ts` cannot load in this container (it needs
  the mobile app's Expo tsconfig) and is not related.
- Nasab meeting points read for each new person (Amr ibn al-As and Abd Allah meet Abu Bakr at «كعب», Hakim and Hisham meet
  al-Zubayr at «خويلد», Jubair meets the Umayyads at «عبد مناف»): all right.
- 26 quiz skips added to `shared/data/tarajim/virtueQuizSkip.json` for general or shared praise.
- A second agent reviewed the batch against the guide and the pages (4 must-fix, 17 should-fix). All must-fix items are
  fixed (Bilal's variant on its own statement, Abu Rifa'ah's tree stop, three quiz skips, and Abu Bakrah's own claim of
  his father), and the should-fix items are fixed or answered above.
