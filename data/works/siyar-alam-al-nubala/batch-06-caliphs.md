# Batch 6: the four caliphs (Khulafa' volume)

Units: `units/siyar-v3-abu-bakr.json` (p7–20), `siyar-v3-umar.json` (p71–96), `siyar-v3-uthman.json` (p149–162),
`siyar-v3-ali.json` (p225–251). Volume 3 of this edition, «سيرة الخلفاء الراشدين», Shamela pages 1155–1430 stored whole
under `data/history/sources/siyar-alam-al-nubala-risalah/v3/` (printed pages 7–290). Scripts:
`/mnt/project-files/tarajim-app/conversion/batch6/`.

## What is different about this volume

- **No footnotes.** Shamela's text of the Khulafa' volume is unvowelled and carries none of the editor's notes. Every
  grading used here is al-Dhahabi's own words, kept as a frame span on the report: «متفق على صحته», «صححه الترمذي»,
  «حسن», «إسناده حسن», «رواه مسلم», «أخرجه مسلم», «وفي الصحيح», «وثبت», «وصح من وجوه», «صحيح غريب», «وهو الصحيح».
- **History by year.** The volume is a year-by-year history; each caliph's biography is one block. The death years of
  Abu Bakr, Uthman and Ali are given only in the year sections («سنة ثلاث عشرة … وفيها توفي»), whose year sits in a
  heading the date reader cannot read (ADR 0027 reads a number from its own quote). Those years are left unmodeled.
  Umar's is modeled: «استشهد في أواخر ذي الحجة سنة ثلاث وعشرين» states year and month in one quote.
- **Names.** The name lines run on past the nasab («، أمير المؤمنين، أبو عمرو…»; Abu Bakr's «اسمه عبد الله -ويقال:
  عتيق- بن أبي قحافة»). `name.full` rests on the nasab span plus the nisba span, so the nasab line and the tree read
  only fathers; the kunya, the office and «عتيق» are their own assertions on the same statement.
- **Unnamed views** («وقيل», «وقال غيره») are REPORTED_ANONYMOUS with the unnamed-group word as origin; the app shows
  them under «قيل».
- Un-headed death notices inside the year sections (Fatimah p50–54 and others) are not entries and are not converted.

## Classified diff (`npm run model:diff -- <slug>`)

### Abu Bakr (`abu-bakr-as-siddiq`)
- fullName: different by rule. The catalog's short form drops most of the printed chain; the model holds
  «عبد الله بن أبي قحافة عثمان بن عامر … بن لؤي القرشي التيمي» (p7).
- kunya «أبو بكر»: by addition (heading). laqab «عتيق»: by addition, from Ibn Abi Mulaykah and Ibn Ma'in (p7).
- appearance: different by addition. The catalog's line is the p7 «وقيل» view, now held as an unnamed view; al-Zuhri's
  «كان أبو بكر أبيض أصفر لطيفا جعدا…» (p8) is the named one. Both shown.
- titles: the model holds «صديق الأمة» only by the text read so far. caliph is the `office` assertion («خليفة رسول
  الله ﷺ», heading). the-ten, al-khulafa-al-rashidun, al-sabiqoon, al-qarinayn and companion are not stated as titles in
  p7–20: unsupported in this text, not copied.
- virtues: different by addition. Author: «وكان أول من آمن من الرجال». Sound reports with their gradings: Umar «أبو بكر
  سيدنا…» (صححه الترمذي); the Prophet ﷺ via Abu Sa'id: «إن من أمن الناس علي…», «لو كنت متخذا خليلا…», «لا تبقين في المسجد
  خوخة…» (متفق على صحته), Abu Sa'id «وكان أبو بكر أعلمنا به»; the Prophet ﷺ «إن لم تجديني فأتى أبا بكر» (via Jubayr, متفق على صحته); Aisha «ويأبى الله
  والمؤمنون إلا أبا بكر»; «هل أنتم تاركو لي صاحبي» (البخاري); Ali «خير هذه الأمة بعد نبيها أبو بكر وعمر» (متواتر); Ali
  «أعظم الناس أجرا في المصاحف أبو بكر» (إسناده حسن). The unnamed «وقال غيره: كان أعلم قريش بأنسابها» is
  ungraded and anonymous, so it is not a virtue. The catalog's line on whom he
  called to Islam is not in p7–20 of this volume: unsupported here.
- parents, spouses (Asma bint Umays, al-Zuhri p19): same. companionOf the Prophet ﷺ: by addition («صاحبي»).
- died.age 63 (Abu Ma'shar): by addition. Death year: not modeled (year section, above).
- catalog-only FATHER (Aisha, Asma, Abd al-Rahman): Abd al-Rahman is held as CHILD_OF from al-Zuhri; Aisha's tie is
  in her own converted entry; Asma's belongs to her batch. FATHER_IN_LAW, CALLED_TO_ISLAM, ayat 30:2–4: not in p7–20.

### Umar (`umar-ibn-al-khattab`)
- fullName/kunya «أبو حفص»/title al-farouq: same or by addition (p71). office «أمير المؤمنين»: by addition.
- appearance: different by addition: Abdullah ibn Umar «أبيض تعلوه حمرة…» and Abu Raja' «طويلا جسيما…» (p71–72),
  each with its sayer. The catalog's merged line is not copied.
- virtues: six, each the Prophet's ﷺ words with al-Dhahabi's grading (أعز الإسلام «من وجوه جيدة», الوزيران «حسن», اقتدوا
  «حسن», فرار الشياطين «صححه الترمذي», المحدَّث «رواه مسلم», القصر «وفي الصحيح»). Catalog's one virtue is the first.
- parents: by addition (mother Hantamah bint Hisham). spouses and children p87–88: by addition (Zaynab bint Maz'un,
  Mulaykah, Umm Hakim, Jamilah, Umm Kulthum bint Ali, Atikah bint Zayd; Abdullah, Hafsa, Abd al-Rahman, Ubaydullah,
  Fatimah, Asim, Zayd, Ruqayyah). Ubaydullah's mother is DISPUTED: the same sentence adds «وقيل: أمه وأم زيد الأصغر أم
  كلثوم بنت جرول». «وتزوج لهية امرأة من المن فولدت له عبد الرحمن الأصغر» (p88) names no one in the catalog: not modeled.
  catalog-only FATHER Hafsa: held through the p87 list.
- islam.age 27, died.year 23 and month 12: by addition. died.age 55 (Ibn Umar), 60 (Aslam, al-Waqidi), 61 (Qatadah),
  63 (Ibn al-Musayyib), 66 (Ibn Abbas), each with its sayer (60 is Aslam's, from al-Waqidi, who calls it «أثبت
  الأقاويل»). Not modeled: Ibn al-Musayyib's other report «ابن أربع أو خمس وخمسين» (two numbers in one quote) and
  Ibn Umar's «أنا ابن سبع أو ثمان وخمسين» two years before his death (an age before death, and «تفرد به أبو عاصم»).

### Uthman (`uthman-ibn-affan`)
- fullName: different by rule (nasab to «عبد شمس» + «القرشي الأموي»). kunyas أبو عمرو and أبو عبد الله: by addition.
- titles al-sabiqoon and dhu-al-nurayn: same. the-ten, the-six, al-khulafa-al-rashidun, companion: not stated as titles
  in p149–162. office «أمير المؤمنين»: by addition.
- appearance: different. The author's «فيما بلغنا لا بالطويل ولا بالقصير…» (p150); the catalog's «طويل القامة» is not in
  the text.
- virtues: «صاحب الهجرتين», «زوج الابنتين» (p149), «وصح من وجوه أن عثمان قرأ القرآن كله في ركعة» (p157). The catalog's
  «أول من هاجر بأهله بعد لوط» is not in these pages. Added: the Prophet's ﷺ «ألا أستحيي من رجل تستحيي منه الملائكة»
  (Aisha's report, «رواه مسلم», p153).
- parents and spouses: same. Son Abdullah by Ruqayyah: by addition. ABSENT_FROM Badr (nursing Ruqayyah; given his
  share): by addition. «روى عنه بنوه: أبان وسعيد وعمرو» (p149) is a list of narrators; the sons are not modeled as
  children here (no catalog entries).
- died.age 82 («وهو الصحيح», from «غيره») and 86 («وقيل»): both unnamed views, shown under «قيل».
- catalog-only MATERNAL_NEPHEW Amir ibn Kurayz and SON_IN_LAW: not in these pages.

### Ali (`ali-ibn-abi-talib`)
- fullName: by rule (nasab to «عبد مناف» + «القرشي الهاشمي»). kunyas أبو الحسن and «أبا تراب» (p226): by addition.
- title al-sabiqoon (p226): same. Others as for Uthman. office: by addition. PARTICIPATED_IN Badr: by addition.
- appearance: Abu Raja' «شيخا أصلع… ربعة عظيم البطن عظيم اللحية» (p226), with sayer.
- virtues: Ibn Abbas «أول من أسلم علي» is DISPUTED: al-Qurazi on the same page says «أول من أسلم خديجة» (and that the
  first two men were Abu Bakr and Ali, Ali before Abu Bakr), whole quote kept as the counter-statement. Rule 3a is
  written for ties; the same shape (DISPUTED, counter-statement in restsOn) is used here for a contested virtue. The Harun hadith (Sa'd, «صحيح غريب», p229–230), «من كنت مولاه فعلي مولاه» (p231), «لا يحبك إلا مؤمن
  ولا يبغضك إلا منافق» (أخرجه مسلم, p236): by addition. The catalog's night-of-the-hijra line is not in these pages.
- islam.age 8 (Urwah), 9 (al-Hasan ibn Zayd), 14 (al-Mughirah): all shown with sayers.
- parents: same. sons al-Hasan and al-Husayn («وبنوه», p225): held. Muhammad and Umar in the same line are not modeled:
  no certain catalog slug. Umm Kulthum and Zaynab are not named in that line.
- spouses: Fatimah, by addition, from Aisha's «قالت: فاطمة، فقيل: من الرجال، فقالت: زوجها» (p237, «حسن غريب»). Asma
  bint Umays: not in these pages.
- died.age 58 and 63, both from al-Baqir (p250–251): shown with their sayer.

## Checks

1. `npm run model:check`: 12 units (8 before the batch + 4).
2. Diffs above.
3. `npm run model:app-people` re-run; each caliph has a full page.
4. `npx vitest run shared/ src/lib/model`: passing. Nasab meeting points read: Abu Bakr–Talhah at عمرو, Abu Bakr–Ali and
   Abu Bakr–the Prophet ﷺ at مرة, Umar–everyone else at كعب, Ali–al-Zubayr at قصي. Uthman's printed nasab stops at
   عبد شمس, below the meeting point with the Hashimis, so no question pairs him.
5. Nasab tree checked against the printed lines above.
6. Second-agent review: done. Its must-fix items were fixed: the sayer of «إن لم تجديني» (the Prophet ﷺ, not
   Jubayr), the anonymous «أعلم قريش بأنسابها» removed as a virtue, Ubaydullah's disputed mother, children's names
   without «و», and the quiz skip list. Skip list entries: Abu Bakr «أول من آمن من الرجال» and «خير هذه الأمة…»,
   Umar's «وزيرين» and «اقتدوا», Uthman's «صاحب الهجرتين».
