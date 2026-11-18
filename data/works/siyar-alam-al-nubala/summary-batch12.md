# Batch 12: Siyar v5 entries 108-126 (printed pages 530-632)

Units: `units/siyar-v5-108-jarir.json` to `units/siyar-v5-126-abu-hurayrah.json`, 18 entries. Entry 118 (Umayr ibn
Sa'd, pp. 557-562) is the second entry of the man batch 5 converts as v5 #12 (the editor: «تقدمت ترجمته في الصفحة ١٠٣
من هذا الجزء بأخصر مما هنا»). It waits for batch 5 and follows as its own unit.
Source: Risalah third edition, witness `siyar-alam-al-nubala-risalah`. Store pages 530-633 are whole printed pages from
Shamela book 10906 (ids 2510-2613), new to the store. Scripts that build each unit:
`/mnt/project-files/tarajim-app/conversion/batch12/` (h.py takes quotes without harakat and resolves them to the page).

Classes follow the guide: **same**; **addition** (the model holds more of what the entry states); **rule** (different
by a modelling rule); **unsupported** (the catalog value is not stated in this entry).
`titles: companion` is catalog-only for every person: the entry does not state it as a title (**rule**, as in batches 1
and 3). Every PARTICIPATED_IN, ABSENT_FROM, SIBLING_OF, COMPANION_OF, kunya, appearance, died.* and virtue shown as
model-only is an **addition** with its own page. Fathers with no catalog file get a slug from their name (guide rule 12);
`parents` model-only is an **addition**, and the three catalog fathers (nawfal-ibn-uhayb, umayyah-ibn-khalaf,
samurah-ibn-habib) are **same**.

## Per person

- **Jarir ibn Abdullah** (530-536). fullName: same (the heading, the nasab line «ابن نصر… عوف» and «البجلي، القسري» after
  the kunyas). Kunya «أبو عمرو» (author), «أبو عبد الله» («وقيل»). Four sons from «وأولاده الأربعة». Virtues: the pledge
  «على النصح لكل مسلم» (author); «ما رآني… إلا تبسم في وجهي» and «على وجهه مسحة ملك» (Ibn Uyaynah's chain, the editor:
  «إسناده صحيح», its first part in al-Bukhari and Muslim); «اللهم اجعله هاديا مهديا» (al-Bukhari and Muslim). Al-Qadisiyyah
  is al-Sha'bi's (through Mujalid). Death 51 (al-Haytham, Khalifah, Ibn al-Muthanna) and 54 (Ibn al-Kalbi); place «بالشراة»
  (Ibn Sa'd from al-Waqidi). Left out: «إذا أتاكم كريم قوم» (Suwar, matruk), «جرير منا أهل البيت» (the author: منكر),
  the visits to show him off (fabricated chain), Umar's «يوسف هذه الأمة» reports («رجاله ثقات» only; a broken chain).
- **Abu al-Yusr** (537-538). fullName: rule. The heading's ism «كعب بن عمرو الأنصاري»; the catalog's «السلمي» is on the
  next line of descriptions. Badr, «الذي أسر العباس» and the banner of Badr (author). Siffin (author). Appearance is
  «وقيل». Death 55 at Madinah.
- **Abu Usayd al-Sa'idi** (538-540). fullName: rule (the ism «مالك بن ربيعة بن البدن»). Three sons. Death 40 (author,
  Ibn Sa'd, Khalifah), 60 (al-Mada'ini, the author: «بعيد»; Abbas ibn Sahl), 65 (Ibn Mandah, «وأشذ منه»), 30 (al-Fallas):
  all kept, attributed. Age 78 is «وقيل». The banner of Banu Sa'idah at the Conquest is Ibn Sa'd's.
- **Huwaytib ibn Abd al-Uzza** (540-541). fullName: same. Age 120; death 54 (author), 52 («وقيل»). Virtues: the Haram
  markers and Uthman's burial, «حميد الإسلام». Left out: his Badr (as an idolater) and the Hunayn loan (al-Waqidi).
- **Sa'id ibn Yarbu'** (542). fullName: rule (the catalog's «المخزومي» is not printed in the name). Age 120, death 54.
  His son Abd al-Rahman. Virtue: the Haram markers.
- **Makhramah ibn Nawfal** (542-544). fullName: same. Kunya «أبو المسور». Son al-Miswar. Virtue: the garment (al-Bukhari
  and Muslim). Death 54. Gap: «وله مائة عام وخمسة عشر عاما» (115) is not read by the date reader («عام»). Left out:
  «بئس أخو العشيرة» (Abu Amir al-Khazzaz; the Sahih wording does not name him, and others name Uyaynah ibn Hisn).
- **Abu al-Ghadiyah** (544-545). fullName: addition (the heading «أبو الغادية الصحابي»; the catalog has none). His son
  Sa'd. Al-Hudaybiyyah is «يقال». Left out: the report on Ammar's killing (the author: «إسناده فيه انقطاع») and the
  naval arrow story (ungraded). No death year («لم أجد لأبي الغادية وفاة»).
- **Safwan ibn al-Mu'attal** (545-550). fullName: rule (the heading; «ثم الذكواني» is on the kunya line). «ما علمت إلا خيرا»
  (the Prophet ﷺ, the Ifk account in al-Bukhari and Muslim). Death: 60 at Sumaysat (al-Waqidi, also through Ibn Sa'd),
  «بناحية سميساط من الجزيرة» (Khalifah), killed in Armenia in 19 (Ibn Ishaq). The author thinks they may be two men;
  every reading is kept, attributed. Left out: the poem (poems rule), «خبيث اللسان، طيب القلب» (weak chain).
- **Dihyah al-Kalbi** (550-556). fullName: same. The envoy to the ruler of Busra (author; the letter is in al-Bukhari).
  Yarmuk (author), Khaybar («وصح»), ABSENT_FROM Badr (Ibn Sa'd). Appearance: the author's «أجمل الصحابة… فلذا كان جبريل
  ربما نزل في صورته». Left out: the gifts and the Caesar audience (weak or matruk), Anas's «في صورة دحية» chain (weak;
  the Ibn Umar route the editor grades sahih is only «روى نحوه», no text).
- **Abu Jahm ibn Hudhayfah** (556-557). fullName: rule. The heading «أبو جهم بن حذيفة القرشي العدوي»; the catalog's
  «عبيد» is «قيل: اسمه عبيد» (no predicate for a second ism: gap). Virtues: «علامة بالنسب», sent as a zakat collector.
- **Safwan ibn Umayyah** (562-567). fullName: same (three spans). Yarmuk (author). Son Abdullah. Kunya «أبا وهب» in the
  Prophet's words (Ahmad; the editor: «رجاله ثقات»). Death 41 (al-Haytham, al-Mada'ini). Left out: Hunayn and al-Ta'if
  (he was there as an idolater), the curse report (weak), the marriage (Malik's balagh; the wife is unnamed).
- **Abu Tha'labah al-Khushani** (567-571). fullName: addition (kunya and nisba only; his ism is disputed in a dozen
  readings: gap). Bay'at al-Ridwan (identified as al-Hudaybiyyah) and Khaybar (al-Daraqutni and others). Brother «عمرو
  بن جرهم» (author). Death 75 (Abu Hassan al-Ziyadi, Abu Ubayd). Left out: the death in prostration (ungraded).
- **Abd al-Rahman ibn Samurah** (571-572). fullName: different, unsupported in part. The entry's name follows Ibn
  al-Kalbi, Ibn Ma'in, al-Bukhari and Abu Ubayd; the catalog's «بن ربيعة» is al-Zubayr ibn Bakkar and Mus'ab's longer
  line, kept out of name.full. Because the link is disputed, `shared/data/tarajim/nasabSlips.json` stops his line at
  Habib so the nasab quiz asks no meeting point through it. Death 50 at Basra (author), 51 («وقيل»).
- **Wail ibn Hujr** (572-574). fullName: same (the heading without the kunya in its middle). Sons Alqamah and Abd
  al-Jabbar. «سيد قومه» (author). Siffin is «ويقال».
- **Abu Waqid al-Laythi** (574-576). fullName: rule (the ism «الحارث بن عوف»). Badr is al-Bukhari's and Abu Ahmad
  al-Hakim's, contested by Sinan's «أسلم يوم الفتح» (rule 3a: DISPUTED, shown «على خلاف»). The Conquest (author). Age 75
  («فيما قيل»). Death 68 (Yahya ibn Bukayr, al-Fallas), 65 (al-Waqidi).
- **Ma'qil ibn Yasar** (576). fullName: addition («البصري»). Bay'at al-Ridwan. Kunya «أبا علي» (Ibn Sa'd). Died at Basra
  late in Mu'awiyah's caliphate (no year).
- **Ma'qil ibn Sinan** (576-577). fullName: same. The banner of Ashja' at the Conquest. Four kunyas, each «قيل». Killed
  in 63. Gap: «نيف وسبعون» is no number; al-Harrah has no event in the catalog.
- **Abu Hurayrah** (578-632). fullName: rule. The heading's ism «عبد الرحمن بن صخر», which the author calls «أرجحها»;
  the other names are «قيل» (gap: no second-ism predicate). Mother «ميمونة بنت صبيح» (al-Tabarani). Gap: his own «وأنا
  أبو هريرة بن أميمة» (p612, sahih) names her differently; the page does not say they are one woman, so only al-Tabarani's
  tie is modelled. Appearance: Ibn Lubaynah («آدم») and Ibn Sirin («أبيض»), both kept. Khaybar: his own «شهدت خيبر»
  (Ibn al-Musayyib's report). Virtues: the author's epithets and «حمل… علما كثيرا»; the Prophet's prayer for him and his
  mother (Muslim, the author: «إسناده حسن»); «ما نسيت شيئا سمعته منه» (al-Bukhari and Muslim; the author: «صحيحان»);
  «لما رأيت من حرصك على الحديث» (al-Bukhari); al-Shafi'i's «أحفظ من روى الحديث في دهره»; the author's «إليه المنتهى…»
  and «رأس في القرآن…». Death 57 (Hisham ibn Urwah and five others), 58 (Abu Ma'shar and three others), 59 with age 78
  (al-Waqidi, and Ibn Ishaq and three others «كالواقدي»). Burial at al-Baqi' is a gap. Office over al-Bahrayn for Umar
  (p619) is not modelled yet.

## Quiz

Read every new nasab and virtue question. Five virtues went into `virtueQuizSkip.json`: Wail's «سيد قومه», Huwaytib's
«حميد الإسلام», both Haram-marker virtues (Huwaytib and Sa'id ibn Yarbu' share them) and Abu Hurayrah's «رأس في القرآن».
Abu Tha'labah and Abu al-Ghadiyah show a one-word nasab («أبو»): their name has no «بن», and the rule is the main Tarajim
thread's (asked).
