# Batch 10: Siyar v5 #70–#88 (printed pp355–460)

Nineteen units, one per entry, in `units/siyar-v5-70-…` to `units/siyar-v5-88-…`. Source: the Risalah
edition as stored in `data/history/sources/siyar-alam-al-nubala-risalah/v5/355–460`, read page by page with
the editor's notes. Every value rests on a quoted span; disputed points are kept, each attributed to whoever
the book names, and marked DISPUTED where the book rejects one side.

## Classified diff (`npm run model:diff -- <slug>`)

These hold for every person and are not repeated below:

- `titles`: catalog `companion` is unsupported as a title in the text (17 people). Companionship is modelled
  as `COMPANION_OF` where the book says it.
- `fullName`: different by rule. The model keeps the name as printed (heading plus the nasab line), with
  the nisba moved after the nasab when the book prints it between the two lines; the catalog adds nisbas
  the heading does not print.
- Every `model-only` value is different by addition: it is in the entry, on the cited page.

Per person, only what is not covered above:

- **salamah-ibn-salamah** (p355): deaths 34 (an unnamed «قيل») and 45 at age 70 (Ibn Sa'd), both kept.
  `cousins` with Muhammad ibn Maslamah is stated once, in this unit; the catalog repeats it on Muhammad's
  side (same, seen from one side).
- **al-numan-ibn-muqarrin** (p356): `parents` different. The book names his father Muqarrin
  (`muqarrin-ibn-aidh`); the catalog's `amr-ibn-muqarrin` is unsupported by this entry. Kunya أبو حكيم
  (author) and أبو عمرو (unnamed), both kept. He also has a batch-7 entry (v4 #83).
- **muadh / muawwidh / awf ibn al-Harith (Banu Afra')** (pp358–359): the book's sibling line names Awf,
  Rafi' and Rifa'ah as Mu'adh's brothers; those are `SIBLING_OF`. The catalog's Mu'adh–Mu'awwidh and
  Awf–Mu'awwidh ties follow from the shared parents (al-Harith and Afra') on every unit: same, by rule.
  Mu'awwidh's catalog virtue «يرحم الله ابني عفراء…» is not in this entry: unsupported in the text.
- **rifaah-ibn-al-harith-ibn-rifaah** (p360): new person. Badr DISPUTED: Ibn Ishaq alone («تفرد بذكره ابن إسحاق»)
  against al-Waqidi «ليس ذلك عندنا بثبت», both on the one assertion.
- **hudhayfah-ibn-al-yaman** (pp361–369): the catalog's «حسل» is the father's name the book also gives; the
  heading prints «اليمان», kept as printed. Father `hisl-ibn-jabir-al-absi`. Brother Safwan (Uhud) kept.
- **muhammad-ibn-maslamah** (pp369–374): death Safar 43 (Yahya ibn Bukayr and others), age 77; kunyas
  أبو عبد الله (author) and أبو عبد الرحمن، أبو سعيد (unnamed). Absent from Jamal and Siffin.
- **uthman-ibn-abi-al-as** (p374): death 51.
- **abdullah-ibn-zayd-ibn-abd-rabbih** (p375): the note «وقيل إن ذكر ثعلبة في نسبه خطأ» is not modelled
  (no predicate for a disputed nasab link).
- **abdullah-ibn-zayd-al-najjari** (p377): Badr DISPUTED, resting on Ibn Mandah's claim and Ibn Abd al-Barr's «بل هو
  أحدي» together; Uhud (Ibn Abd al-Barr); death 63 (unnamed).
- **harithah-ibn-al-numan** (p378): «ويقال ابن رافع بدل نفع» not modelled (as above).
- **abu-musa-al-ashari** (pp380–402): `parents` different by addition (the model adds the father). Deaths 42
  (al-Haytham), 43 (unnamed), 44 (Abu Nu'aym and others), 52 (al-Waqidi), 53 (al-Mada'ini), and 44 in Dhu
  al-Hijjah, the author's «على الصحيح». Khaybar DISPUTED: al-Haytham's «أول مشاهده خيبر» against Abu Ahmad al-Hakim's «قدم… بعد فتح خيبر بثلاث».
- **abu-ayyub-al-ansari** (pp402–413): deaths 52 (Yahya ibn Bukayr) and 50 (Khalifah). Al-Waqidi's 52 (p412) is left
  out: the editor grades it weak (note 1, p413).
- **abdullah-ibn-salam** (pp413–426): `virtues` different by rule. The catalog's «لقد علمت يهود أني سيدهم…» is his
  own word about himself, so it is not a virtue; the model holds Sa'd's «ما سمعت… إلا لعبد الله بن سلام» (p417) and
  the author's epithet. Revealed about 46:10: «وفيه نزلت» in Sa'd's hadith is Malik's own words inserted into it
  (editor's note 1, p417), so its sayer is Malik; Awf ibn Malik's report (p426, al-Hakim: sahih) ends with the ayah,
  and the author names the witness as Ibn Salam. The same note gives the other view (Masruq, al-Sha'bi, Ibn
  Kathir: the ayah is Meccan, before his Islam); it is the editor's, not the book's, so it is recorded here only.
- **zaid-ibn-thabit** (pp426–441): deaths 45 (al-Waqidi, at 56; his followers), 51 (Ahmad, Amr ibn Ali),
  55 (al-Mada'ini), and Abu Ubayd's «أثبت» 56.
- **tamim-al-dari** (pp442–448): `fullName` different by rule: the nasab line «تميم بن أوس… بن جذيمة اللخمي» plus the
  heading's «الداري». Revealed about 5:106 (Ibn Abbas, in the Sahih). The page prints «[المائدة: ١١٠]»; the ayah
  quoted («شهادة بينكم…») is 5:106, so 5:106 is right and should not be "fixed" to 110.
- **abu-qatadah-al-ansari** (pp449–456): name الحارث بن ربعي «على الصحيح» (author); the other names are kept as
  DISPUTED names: النعمان and عمرو («وقيل», p449), النعمان (Ibn Umarah and al-Waqidi, p454). Died in Medina
  (al-Waqidi) and in Kufa (the people of Kufa, DISPUTED, with al-Bayhaqi's «هذا غلط» on the same assertion); death 54.
- **amr-ibn-absah** (pp456–460): `titles` different by addition, al-sabiqoon (his «ربع الإسلام»). Badr
  DISPUTED. No death year: the book says «لم يؤرخوا».

## Not modelled yet (model gaps, per the guide)

- Aqaba: first-pledge-of-aqaba and second-pledge-of-aqaba are catalog events, but the app lists every
  PARTICIPATED_IN under battles, so the pledges (Salamah and Mu'adh «العقبتين», Abu Ayyub, Mu'awwidh «عند ابن إسحاق
  فقط») wait for the main Tarajim thread to decide how a pledge shows. The brotherhood (mu'akhat) and uncle ties
  have no predicate.
- Offices (amir of an army or a city) are held by `office`, which the app ignores; none is added in this batch.
- Children are modelled only where the entry's own sentence names them (Mu'awwidh: al-Rubayyi' and Umayrah).
  The long children lists (Mu'adh, Zaid, Harithah, Abu Qatadah), Zaid's wives and burial places are left out.
- Nasab variants with no predicate (asked of the main Tarajim thread): Harithah «ويقال: ابن رافع بدل نفع» (p378),
  Ibn Abd Rabbih «وقيل: إن ذكر ثعلبة في نسبه خطأ» (p376), Hudhayfah's father «حسل، ويقال: حسيل» (p361).
- Ibn Sa'd's longer nasab for Abu Qatadah.
- Abu Musa's brothers: the Sahih versions differ on who they are, so none is linked.
- «هم قومك يا أبا موسى» (5:54) is not linked; Abu Ahmad al-Hakim's «سنة اثنتين» for Abu Musa is
  ambiguous and skipped; Zaid's Khandaq report («ويروى») skipped; Hudhayfah's «لا تضره الفتنة» about Muhammad ibn
  Maslamah (Ibn Sirin's report, p371; al-Hakim: sahih) is not added yet.
- Tamim's brother Nu'aym (al-Waqidi) is not added: he may be the same man as Abu Hind.

## Quiz check

Every new nasab and virtue question was read. Virtues another person could rightly own too stay on the pages and go
into `shared/data/tarajim/virtueQuizSkip.json`: Abdullah ibn Salam's «المشهود له بالجنة», Tamim's «عابدا، تلاء
لكتاب الله», Harithah's «دينا، خيرا», al-Hasan's «ما رأيت أحدا أفضل منه» (Uthman ibn Abi al-As), Abu Ayyub's «السيد
الكبير», Anas's «جمع القرآن… أربعة» (a group) and Amr ibn Abasah's «ربع الإسلام» (Abu Dharr says the same). Sentences
holding two virtues were split: Hudhayfah (the hypocrites' names; the fitan), Abu Ayyub, Harithah («برا بأمه»).

## Second-agent review

All must-fix items were fixed: the 46:10 sayer, Khaybar and Badr disputes resting on both sides, the Afra basis,
display slips (sibling and kunya spans that took a «و», «أهل الكوفة» as a place), al-Waqidi's weak 52 for Abu
Ayyub, Tamim's full name, and Abu Qatadah's other names. The Jews' «ذاك سيدنا» was dropped as a virtue, since they
took it back at once.
