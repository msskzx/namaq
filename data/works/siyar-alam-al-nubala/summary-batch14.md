# Batch 14: Siyar v6, entries 20–38

Units: `units/siyar-v6-20-yala.json` … `units/siyar-v6-38-jabir-abdullah.json` (19 people, printed pages 100–194).
Source: Risalah edition, store pages `data/history/sources/siyar-alam-al-nubala-risalah/v6/100–194`, read with the
editor's footnotes. Printed page 240 is missing on Shamela (the text runs 239→241); it is outside this batch.
Scripts that build the units: `/mnt/project-files/tarajim-app/conversion/batch14/*.py`.

## Classified diff (`npm run model:diff -- <slug>`)

These differences come up for every person, so they are listed once:

- `fullName`: **different by rule**. The catalog is unvowelled legacy text and adds the nisbas at the end. The model
  keeps the book's vowelled heading up to the last name, and carries the line on from the next printed line where the
  author continues it (Qais, Fadalah, Adi, Amr, Jabir ibn Abdullah, Zaid, Abd al-Muttalib, Mu'awiyah). A nisba in the
  middle of the heading stays out of `name.full`, so the shown name never reads «الطائي بن الحشرج».
- `titles: companion`: **unsupported in the text as a title**. Companionship is a status (ADR 0025). Where the entry
  names the Prophet ﷺ, it is a `COMPANION_OF` tie instead.
- `sex`: **same** for all 19 (MALE).
- Every `model-only` row (kunyas, virtues, battles, offices, death years and ages) is **different by addition**: each rests
  on a quoted span on its page.

Per person, beyond the above:

- **Ya'la ibn Umayyah**: `parents` different by addition (the model adds his father Umayyah from the heading; his
  mother Munyah stays). His sons Safwan, Uthman and Muhammad, and his brother Abd al-Rahman, are new («بنوه؛…، وأخوه؛»).
  The Najran governorship is «وقيل», kept as REPORTED_ANONYMOUS. No death year: «إلى قريب الستين، فما أدري».
- **Qais ibn Sa'd**: no catalog entry under this slug, so every value is new. «وجود قيس يضرب به المثل، وكذلك دهاؤه»
  is two virtues. The second clause is kept off the virtue quiz because it reads only with the first. Ibn Yunus's
  conquest of Egypt has no catalog event. No death year: «في آخر خلافة معاوية».
- **Abd al-Muttalib ibn Rabi'ah**: the death year 61 is new. «له صحبة» has no Prophet mention to tie (status is not
  built yet).
- **Fadalah ibn Ubayd**: al-Waqidi's Uhud is **DISPUTED**. Sa'id ibn Abd al-Aziz makes him the youngest at the Tree,
  and the author writes «إن ثبت شهوده أحدا، فما كان يوم الشجرة صغيرا». Bay'at al-Ridwan is modeled as the pledge at
  `hudaybiyyah`. Not modeled: his judgeship of Damascus, his burial «بباب الصغير» (rule 9), and Ibn Yunus's conquest of Egypt.
- **Abu Mahdhurah**: the second name «سمير بن عمير» («وقيل») is kept as a second `name.full`.
- **Mu'awiyah**: the catalog's fullName wrongly opens with his father «صخر بن حرب». The model starts with «معاوية».
  The catalog-only BROTHER relation (Umm Habibah) is the model's `SIBLING_OF` row, which the diff does not pair.
  Siffin rests on his own words «وهممت يوم صفين بالهزيمة» (p142). Yazid as his son rests on the author (p158).
  Hunayn is left out because the author refutes al-Waqidi. Also left out: «اللهم علمه الكتاب» (weak), the forged
  virtues, the uncle predicates (rule 9), and Caesarea and his date of Islam (no predicate).
- **Adi ibn Hatim**: Umar's «أقمت إذ كفروا…» is quoted by the author. The editor cites only Ibn Asakir, but the same
  words are in al-Bukhari 4394 (checked outside the page).
- **Zaid ibn Arqam**: the kunya «أبو عمرو» is the author's. The four «ويقال» kunyas are anonymous.
- **Abu Sa'id al-Khudri**: the catalog-only BROTHER relation (Qatadah ibn al-Nu'man) is the model's `SIBLING_OF`.
  Ibn al-Madini's 63 is **DISPUTED** by the author's «شذ بهما ووهم». His second opinion, «بعد الحرة بسنة», has no year
  in it. Being turned away at Uhud and al-Harrah are not modeled (ungraded, no event).
- **Safinah**: his name «مهران» (author) and «رومان» and «قيس» («وقيل») are kept as further `name.full` values. His
  sons Umar and Abd al-Rahman are new. No death year: «بعد سنة سبعين».
- **Jundub al-Bajali**: no death year: «إلى حدود سنة سبعين».
- **Jundub al-Azdi**: the alternative «جندب بن كعب» is kept attributed. Killing the sorcerer is not modeled (no
  predicate). The «حد الساحر» hadith is weak and stays out. The Siffin death of Jundub ibn Zuhayr is not his.
- **al-Nabighah al-Ja'di**: «أبو ليلى» and «حيان بن قيس» are kept as further names. Both «يقال» ages are kept.
  The Ya'la ibn al-Ashdaq report is weak and stays out.
- **Amr ibn Umayyah al-Damri**: «بعثه سرية وحده» and «بعثه رسولا إلى النجاشي» are two virtues. His sons Ja'far and
  Abd Allah are new. Not modeled: Bi'r Ma'unah (no event), and Harun al-Hammal's «شهد مع المشركين بدرا وأحدا». No
  death year: «زمن معاوية».
- **Rafi' ibn Khadij**: the author gives «سنة أربع أو ثلاث وسبعين», so both 73 and 74 rest on him. 74 also rests on
  Bushayr ibn Yasar. Siffin is «وقيل», kept anonymous. The catalog fullName adds «الخزرجي المدني» from the next line,
  which is different by rule.
- **Samurah ibn Jundab**: the author gives 58, and «وقيل» 59 is kept.
- **Jabir ibn Samurah**: Abu Ubayd's 66 is **DISPUTED** by his own «والأول أصح». Ibn Sa'd's «في ولاية بشر» has no year.
- **Habib ibn Maslamah**: died in Armenia in 42 («فمات بها»).
- **Jabir ibn Abdullah**: Badr is **DISPUTED** and kept with both claims, his own «كنت أمتح لأصحابي يوم بدر» (Ibn Hajar
  graded the chain sahih) and «وقد ورد: أنه شهد بدرا». Against them is his own «لم أقدر أن أغزو حتى قتل أبي بأحد»
  through al-Waqidi. The editor also cites Muslim 1813 against it. Bay'at al-Ridwan is modeled as `hudaybiyyah`. The
  year 78 rests on both Kharijah and al-Waqidi's group, and Abu Nu'aym's 77 is kept. The age 94 rests on Kharijah and
  on «قيل».

## Quiz

- Virtues another person could rightly own too stay on the page and are listed in
  `shared/data/tarajim/virtueQuizSkip.json` (17 entries, each with its reason).
- Every nasab and virtue question was read. The meeting points are right: Zaid and Qais meet at كعب, Abu Sa'id and Zaid
  at الحارث, and Mu'awiyah meets the Hashimites at عبد مناف.

## Second-agent review

A second agent checked all 19 units against the pages and this guide. Its must-fix items are all fixed: shared virtues
went back in with quiz skips, Jabir's Badr is disputed, Rafi's 74 rests on the author, «و» was dropped from kunya
spans, double virtues were split, and the «قيل» claims were added. So were its should-fix items: Ridwan, Fadalah's
Uhud, Abu Sa'id's 63, Jabir ibn Samurah's 66, Mu'awiyah's Siffin and Yazid, the merged duplicates, the sons, the final
full stops and Habib's place of death.
