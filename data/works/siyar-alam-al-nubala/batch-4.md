# Batch 4: Siyar 1 (store volume v4), pp. 304-360, 17 people

Units: `units/siyar-v4-59-utbah.json` through `units/siyar-v4-76-bilal.json` (entry 72, Abu Zayd, is not in this batch),
plus `units/siyar-v5-28-zaynab.json` for Zaynab's own entry in Siyar 2. Scripts:
`/mnt/project-files/tarajim-app/conversion/batch4/` (one per person, re-runnable).

Store pages: v4 304, 314, 316, 324, 330 and 335 replaced with the full Shamela page (book 10906, ids 1730-1787), with small
vowel fixes on 324 and 330 (for example «حَرَامِ بنِ كَعْبِ … سَلَمَةَ»). Notes replaced for 304, 307, 308, 309, 316 and 335.
Added 314.notes, 315, 336 (+notes) and v5/250 (+notes), which ends Zaynab's v5 entry and was missing.

Grading follows the editor's footnotes on each page. Weak reports stay out; every left-out report is named at the top of
its person's script with the editor's words.

## How each difference from the catalog is classified

Classes: **same**; **addition** (the model holds more than the catalog, from the page); **rule** (different by a model
rule); **unsupported** (the catalog value is not in the text, or rests on a weak report).

Differences that repeat for every person:

- `titles: companion` (catalog only): **unsupported**. The entries never state «companion» as a title. Where the page says
  «صاحب النبي ﷺ» the model has `COMPANION_OF` (Thabit, Tulayhah, al-Tufayl).
- `fullName`: the model keeps the heading and nasab line as printed and leaves out nisbas and «حليف» phrases (**rule**, guide 1).
  Where the catalog's form joins a nisba between two nasab names («…هشام المخزومي بن المغيرة»), the model is the correct one.
- `PARTICIPATED_IN`, `ABSENT_FROM`, `office`, `SIBLING_OF`, `name.laqab`, `died.age`, `died.month`, `REVEALED_ABOUT`:
  **addition**, each from a quoted span (the catalog has no such fields for these people).
- `virtues`: the catalog folds whole paragraphs, quoted speech and some weak reports into one value. The model holds one
  virtue per statement and sayer (ADR 0020). Everything dropped from the catalog's text is either not a virtue
  (narrative), a gap below, or a weak report named in the script (**rule** / **unsupported**).
- Doubled model values in `spouses` / `parents` (for example Zaynab's father three times) are one tie stated on several
  pages; the app merges them into one tie with every page (**same**).

### Per person

- **Utbah ibn Ghazwan** (59, pp. 304-306). fullName, placeOfDeath, sex, parents: same. kunya: addition («قيل» Abu Abd Allah).
  death year: addition («قيل» 15 beside the author's 17), and age 57 («قيل»). office: left out; Ibn Sa'd has Umar making him
  governor of al-Basrah from al-Waqidi («الواقدي متروك», the note to p304) and the page gives no other chain. virtues: rule; the catalog's sermon is his own speech, and «هاجر إلى الحبشة» is a gap.
- **Ukkashah ibn Mihsan** (60, pp. 307-308). kunya, place of death, sex: same. Year 12, Buzakhah and «وكان من أجمل الرجال» follow Umm Qays's words
  after an unnamed «قال», so they are REPORTED_ANONYMOUS («قيل»), not hers. fullName: rule (the nisba and «حليف قريش»
  are not the name). appearance: same text, the model keeps the leading «وكان». death year: addition (12 from Umm Qays
  beside the author's «والصحيح» 11). titles: al-sabiqoon from the page. virtues: unsupported for the sword story (the
  editor: «إسناد تالف فيه الواقدي»); the al-Ghamr raid is the office.
- **Thabit ibn Qais** (61, pp. 308-313). fullName: same words, the model is vowelled. kunya: same, split into the author's
  and the «قيل» one. parents: addition (Hind al-Ta'iyyah from the author, Kabshah from «قيل»). HALF_BROTHER Abd Allah
  ibn Rawahah: the model has SIBLING_OF to him and Amrah (the page says «وإخوته لأمه»; half-sibling is a gap). virtues:
  «أما ترضى أن تعيش حميدا» is mursal (the editor) and left out; the Tamim khutbah has no chain. The Hujurat 2 report
  is a story of him acting on an ayah (gap). The «بل هو من أهل الجنة» virtue is told on p310 by Ayyub from Ikrimah, which is mursal; it is
  kept because the editor gives the same words connected through Anas in Muslim 119 and Bukhari 3613 (notes to p310, p311). Death at
  al-Yamamah rests on Hammad's report from Anas; the same day is in the Ayyub and Ibn Awn routes from Anas on p311, which
  the editor gives as Bukhari 2845.
- **Tulayhah ibn Khuwaylid** (62, pp. 316-317). placeOfDeath «نهاوند» (catalog only): unsupported; the page says
  «أبلى يوم نهاوند ثم استشهد», which does not say where he died (ADR 0024). Umar's letter is not a virtue.
- **Sa'd ibn al-Rabi'** (63, pp. 318-320). PACT_BROTHER Abd al-Rahman (catalog only): gap (no brotherhood predicate), kept
  inside the virtue sentence. Uhud: his widow's words in Jabir's report, so she is the sayer. His last words (Ibn Ishaq, Malik) have no connected chain and stay out.
- **Ma'n ibn Adi** (64, pp. 320-321). death year and place: same. virtues: the Saqifah story is not a virtue; Urwah's
  «لكني والله…» is mursal (the editor) and left out.
- **Abd Allah ibn Abd Allah ibn Ubayy** (65, pp. 321-322). fullName: rule; the dashed aside on Salim is about an
  ancestor and is left between the two name spans. placeOfDeath al-Yamamah: addition. virtues: the gold nose is an error
  (the editor: «هذا وهم من ابن مندة», it was Arfajah); the gold tooth has no grading; the former name al-Hubab is a gap.
- **Ikrimah ibn Abi Jahl** (66, pp. 323-324). placeOfDeath: addition, two attributed places (al-Yarmuk from Abu Ishaq
  al-Sabi'i, Ajnadayn from Urwah, Ibn Sa'd and a group). Tirmidhi's «مرحبا بالراكب المهاجر» is left out (the author:
  Mus'ab did not meet him; the editor: not sahih).
- **Abd Allah ibn Amr ibn Haram** (67, pp. 324-328). appearance: same (Ibn Sa'd «قالوا»). FATHER of Jabir: same tie,
  as Jabir CHILD_OF him (from Jabir's «لما قتل أبي يوم أحد»). virtues: «زملوهم بجراحهم» is about all the Uhud martyrs and
  is not his; «أسألك أن تردني» is part of the kifah hadith already held. Additions: «أول من قتل يوم أحد» (Ibn Sa'd), the
  earth not consuming him (Bukhari 1351), REVEALED_ABOUT Al Imran 169 (Tirmidhi 3013, hasan).
- **Yazid ibn Abi Sufyan** (68, pp. 328-330). death year: same. HALF_BROTHER Mu'awiyah: the model has SIBLING_OF
  («أخو معاوية من أبيه»; half-sibling is a gap). Additions: mother Zaynab bint Nawfal, sister Umm Habibah, laqab
  «يزيد الخير» (an unnamed «ويقال له», so REPORTED_ANONYMOUS), two amir offices, Hunayn, Yarmuk (Ibrahim ibn Sa'd). «فقيل… أعطاه من غنائم حنين» is not a virtue.
  The Abu al-Aliyah story is mursal and weak (the editor) and left out.
- **Abu al-As ibn al-Rabi'** (69, pp. 330-334; his death is on p335 inside entry 70). The virtue «حدثني فصدقني، ووعدني
  فوفى لي» is the Prophet's words from al-Miswar (Bukhari 3729, Muslim 2449). The Ibn Abbas report of Zaynab's return is
  graded «منكر» in the note to p334 and «فيقوى بها ويصح» with its witnesses in v5/249 n1; the model follows the v5 grading.
  Additions: kunya, laqab, mother
  Hala bint Khuwaylid, death 12 in Dhu al-Hijjah. «واسمه لقيط» and «وقيل: اسم أبيه ربيعة» are gaps.
- **Zaynab bint Muhammad** (v4 70, pp. 334-335, and v5 28, pp. 246-250). fullName: rule; her v5 heading prints
  «زينب بنت رسول الله ﷺ», not a nasab (the tree carries her line through the Prophet's entry). titles: daughter-of-prophet
  same. virtues: the ransom necklace and the jiwar are Aisha's weak report («بإسناد واه») and Yazid ibn Ruman's mursal;
  Habbar's harm (al-Bazzar; the editor: «إسناده قوي») is left out because no predicate
  fits harm suffered. parents: addition (Khadijah comes from the Prophet's unit).
  The v5 «توفيت: في أول سنة ثمان» is not modeled: the editor says it is al-Waqidi's, and since facts from two units are
  not merged it would repeat the author's v4 «سنة ثمان», which stands.
- **Umamah bint Abi al-As** (71, p335). fullName, sex, virtue: same. spouses: addition (al-Mughirah ibn Nawfal).
- **Abbad ibn Bishr** (73, pp. 337-340). fullName, kunya: same. placeOfDeath: rule (the place «اليمامة», from Ibn
  al-Athir, not the whole sentence). Additions: age 45, Badr, Ka'b ibn al-Ashraf (Bukhari 4037), Tabuk. Left out: the
  dream «بإسناد ضعيف» and the mu'allaq «اللهم اغفر له».
- **Usayd ibn al-Hudayr** (74, pp. 340-343). death year: same, from Yahya ibn Bukayr and from al-Waqidi, Abu Ubayd and a
  group. kunya: same, split. Additions: ABSENT_FROM Badr (Ibn Ishaq), Uhud. Left out: the regret over Badr («سنده تالف»),
  the two debt reports (weak), «وروي… أحسن الناس صوتا بالقرآن» (no chain given).
- **al-Tufayl ibn Amr** (75, pp. 344-347). place of death al-Yamamah (catalog only): unsupported; it rests only on a
  broken chain (below). virtues: the rest of the catalog's text is his Islam story (narrative). Additions: laqab «ذو
  النور» (the author and Hisham ibn al-Kalbi), son Amr.
- **Bilal ibn Rabah** (76, pp. 347-360). appearance (catalog only): unsupported, al-Waqidi's report «في سنده جهالة،
  والواقدي متروك». death year: addition (21 «قيل» beside 20). places: addition, each attributed (the author's own «أحدها: بداريا، في سنة عشرين», p347, is a further
  source on year 20 and on Darayya) (al-Sham from al-Bukhari,
  Damascus from al-Taymi, Ibn Ishaq, Abu Umar al-Darir and a group, Darayya from al-Tatari, Aleppo from Ibn Khurrazadh's
  chain). virtues: «سابق الحبشة» (Umarah ibn Zadhan, weak; al-Hasan's mursal), «سيد المؤذنين» (weak routes), «أذن فوق
  الكعبة» (mursal) are unsupported; «أول من أذن» (al-Mas'udi from al-Qasim, a tabi'i, so mursal; the editor only gives Ibn Sa'd) is left out. REVEALED_ABOUT al-An'am 52-53
  (Muslim 2413): addition.

## Not in the units

- Ikrimah: the author's own line that he died at al-Yarmuk in 15 is printed on p316, inside another entry, so his unit
  cannot quote it (spans stay inside the entry). His unit has al-Yarmuk from Abu Ishaq al-Sabi'i.
- al-Tufayl: his absence from Badr, Uhud and al-Khandaq and his death at al-Yamamah rest only on Ibn Ishaq from Uthman
  ibn al-Huwayrith from Salih ibn Kaysan, who did not meet al-Tufayl (munqati'). A broken chain is weak, so both are left
  out. His laqab «ذو النور» is the author's own line (print «ذو الطفيتين», corrected by the editor).
- Ghufrah bint Rabah: female from «بنت» in her catalog name; the page names her only in the sibling list.

## Gaps (left out of the units, for the model to add later)

- Poems (Abbad, Bilal and the Madinah fever verses).
- Brotherhood (mu'akhah): Sa'd ibn al-Rabi' and Abd al-Rahman ibn Awf, Abbad and Abu Hudhayfah, Usayd and Zayd ibn
  Harithah, Bilal and Abu Ruwayhah, Thabit and Ammar («قيل»).
- Half-siblings («أخو معاوية من أبيه», «وإخوته لأمه: عبد الله بن رواحة…»): modeled as SIBLING_OF.
- Aunt and cousin through an aunt («ابن أخت خديجة», «ابن خالتها»).
- Wala' (Bilal «مولى أبي بكر»).
- Former name or ism (al-Hubab, «واسمه لقيط»), and a differing father's name («وقيل: اسم أبيه ربيعة»). Ibn Sa'd's line
  on p351 reads «بلال بن عبد الله» in this print; not modeled as a second father, flagged for review.
- The time of Islam («أسلم قبل الهجرة بمكة», «أسلم قبل الحديبية بخمسة أشهر», «أسلم قديما»).
- Origin (Bilal «حبشي» / «من مولدي الحجاز»).
- Burial places (Bilal: Bab al-Saghir, Bab Kaysan, Darayya; Usayd: al-Baqi').
- Events missing from the catalog: al-Yamamah, the al-Ghamr raid, Bay'at al-Ridwan (Thabit), the night of al-Aqabah
  (the pages do not say which pledge). Al-Yamamah is kept as a place of death.
- Acting on an ayah (Thabit and al-Hujurat 2).
- «عاش بضعا وستين» and «نحو ثلاثين سنة»: indefinite, not a readable age.

## Quiz checks

- Nasab questions read: all right. Thabit ibn Qais and Sa'd ibn al-Rabi' first met at «ثعلبة» because Thabit's print says
  «مالك الأغر»; the main Tarajim thread fixed the rule on main (#946), and they now meet at «مالك» (son of Imru' al-Qays).
- Virtue questions read: 34 general or group-shared virtues added to `shared/data/tarajim/virtueQuizSkip.json` with the
  reason (the naqibs, «من سادة الأنصار/الأوس», the muezzin, the Umm Atiyyah washing also told of Umm Kulthum, the lit staff given to Abbad and Usayd together, and so on).
