# Batch 3: Siyar v4 entries 38-58 (printed pages 242-303)

Units: `units/siyar-v4-38-kulthum.json` to `units/siyar-v4-58-asad-ibn-zurarah.json`, 21 entries.
Source: Risalah third edition, witness `siyar-alam-al-nubala-risalah`. The store pages 242-303 and their notes were
replaced with the full printed pages (Shamela book 10906): the old store had sliced pages (243 lacked Abu Dujanah's
heading; 251, 252 and 259 were cut short). Scripts that build each unit: `/mnt/project-files/tarajim-app/conversion/batch3/`.

Classes below follow the guide: **same**; **addition** (the model holds more of what the entry states);
**rule** (different by a modelling rule); **unsupported** (the catalog value is not stated in this entry).
`titles: companion` is catalog-only for every person: the entry does not state it as a title (**rule**, as in batch 1).
Every PARTICIPATED_IN, ABSENT_FROM, SIBLING_OF, died.month, office, name.laqab and died.age shown as model-only is an
**addition** with its own page. Fathers (`parents`) are **same** for all 21.

## Per person

- **Kulthum ibn al-Hidm** (242-243). fullName, sex: same. virtues: rule. The model splits the catalog's run-on value into the
  author's sentences, and it keeps both views on where the Prophet ﷺ stayed (with him, or with Sa'd ibn Khaythamah,
  «وقيل», attributed).
- **Abu Dujanah** (243-244). fullName: addition. The heading name as printed, plus the «قيل» name «سماك بن أوس بن خرشة»,
  attributed. kunya: same. virtues: rule. The sword account stays (Muslim 2470). Left out: the Talhah/Jibril report (very
  weak), «إنها لمشية» (weak), the hirz (fabricated) and the Yamamah sentence (no Yamamah event yet).
- **Khubayb ibn Adi** (246-248). fullName: same. placeOfDeath: different, rule. Ibn Sa'd names «التنعيم», and the catalog's
  «مكة» is the wider place. virtues: «أول من سن الصلاة عند القتل» (Asim ibn Umar; al-Bukhari 3045). Left out: the
  grapes wording (not al-Bukhari's) and the curse.
- **Mu'adh ibn Amr ibn al-Jumuh** (249-250). fullName: addition. The heading «… الجموح بن كعب الأنصاري» as printed, plus Ibn
  Ishaq's longer nasab. The tree carries his line through his father's entry (guide rule 10). titles: killer-of-abu-jahl,
  same. virtues: rule. «كلاكما قتله» and the salab (al-Bukhari 3141, Muslim 1752) replace the catalog's account of his
  arm, which is Ibn Ishaq's story. Dispute kept as a gap: he lived to late in Umar's caliphate or Uthman's (no year).
- **Amr ibn al-Jumuh** (252-255). fullName: same. appearance: addition. «الجعد الأبيض» (Jabir, al-Adab al-Mufrad, sound)
  beside al-Waqidi's «أعرج». ABSENT_FROM badr is al-Waqidi's, attributed. catalog FATHER relations are the sons'
  CHILD_OF in his unit («والد معاذ ومعوذ وخلاد»). Left out: «لعل الله يرزقه الشهادة» (mursal).
- **Khallad ibn Amr** (252). same. Badr and Uhud: addition.
- **Mu'awwidh ibn Amr** (252). fullName: same apart from the printed final «ُّ». catalog HALF_BROTHER: the model states SIBLING_OF
  Mu'adh and Khallad from the entry. Badr: addition, with the author's doubt kept in the sentence.
- **Ubaydah ibn al-Harith** (256). Death year 2, Ramadan, at al-Safra': addition. Title al-sabiqoon: rule (catalog
  companion). Office: amir of the first banner (Ibn Ishaq). spouses (Zaynab bint Khuzaymah): unsupported. His entry does
  not name her.
- **Rabi'ah ibn al-Harith** (257-259). Death year 13 is «وقيل», attributed. ABSENT_FROM badr is «قالوا». Fath and Hunayn are
  Ibn Sa'd's. catalog-only virtue (the Khaybar grant): rule, because it is a grant, not praise. HALF_BROTHER Abu Sufyan
  ibn al-Harith: unsupported in this entry. Left out: «نعم العبد» (unsound).
- **Abdullah ibn al-Harith** (259). died.place «بالصفراء», «فرووا»: same as the catalog's place without the verb. Siblings
  Rabi'ah and Nawfal: addition.
- **Khalid ibn Sa'id** (259-260). Title al-sabiqoon: rule. Mother Umm Khalid: from her report. Appearance «وسيما جميلا» is
  «قيل», attributed. Ajnadayn: addition. Left out: «أول من كتب بسم الله» (ungraded).
- **Aban ibn Sa'id** (261). Siblings Khalid and Amr: addition. Office: amir over al-Bahrayn. Ajnadayn «على الصحيح».
- **Amr ibn Sa'id** (261-262). Yarmuk (author) and Ajnadayn («ويقال»), both kept and attributed.
- **Al-Ala ibn al-Hadrami** (262-264). fullName: rule. The name ends at «حضرموت». The catalog's «من حلفاء…» is an alliance,
  not a name. Death year 21: same. Office: amir of al-Bahrayn. Dispute kept as a gap: Ibn Ishaq gives the father as «عبد
  الله بن عباد بن الصدف». A name.full on the father would add him to the app, so it is not modelled. Left out: the
  Mujalid/al-Sha'bi miracle reports.
- **Sa'd ibn Khaythamah** (266). Title naqib (new classified value, shown with the book's word). placeOfDeath «بدر»: same.
  Ibn al-Kalbi's «النحاط/الحناط» variant: gap (no predicate).
- **Al-Bara' ibn Ma'rur** (267-269). Title naqib. PATERNAL_COUSIN Sa'd ibn Mu'adh («ابن عمة»): addition. Virtues: first to
  pledge, «فاضلا تقيا فقيه النفس», «أجل السبعين» (pp. 268-269). catalog FATHER: Bishr's CHILD_OF in Bishr's unit.
- **Bishr ibn al-Bara'** (269). Khaybar and Badr: addition. Left out: «سيدكم بشر» (weak per the editor).
- **Sa'd ibn Ubadah** (270-279). Badr is disputed and both sides are kept, attributed. Urwah (via Abu al-Aswad) and
  al-Bukhari's Tarikh: he was there. «جماعة» and Ibn Sa'd: he was not. Death year: Abu Ubayd gives 14, while Yahya ibn
  Bukayr and Ibn Aisha give 16 (the catalog has 16 only). Death place: Hawran (Ibn Asakir, Abu Ubayd, Ibn Bukayr) and
  Busra (Sa'd ibn Abd al-Aziz). laqab «الكامل» (Ibn Sa'd): addition. Son Qays: CHILD_OF from «أولاده؛ قيس». Virtues:
  «سيد الخزرج», Ibn Sa'd's «عقبيا نقيبا سيدا جوادا», Anas's «لو أمرتنا أن نخيضها البحر لأخضناها» (Muslim 1779), and the
  author's «كان ملكا شريفا مطاعا». Left out: the banner report (ungraded), Ibn Sirin's ahl al-suffa and the jinn story,
  al-Waqidi's bay'ah account («إسنادها كما ترى»), and al-Mada'ini's «في خلافة أبي بكر» (no year).
- **Sa'd ibn Mu'adh** (279-296). Badr and al-Khandaq (Ibn Shihab), Banu Qurayzah (Abd al-Rahman ibn Sa'd; al-Bukhari 3043).
  Appearance: addition (al-Waqidi plus Anas «من أعظم الناس وأطولهم», hasan). Death year 5 (same) and age 37 are
  al-Waqidi's, attributed. Virtues: the author's «الذي اهتز العرش لموته»; Jabir's «اهتز عرش الرحمن لموت سعد» (al-Bukhari
  3803, Muslim 2466), which also rests on the author's «وقد تواتر»; the handkerchiefs (author «وثبت» and Anas, hasan);
  Aisha's «لو كان أحد ناجيا منها نجا منها سعد» (al-Dhahabi: «إسناده قوي»); Aisha's «ما كان أحد أشد فقدا…» (hasan); the
  author's «من أهل الجنة… من أرفع الشهداء». Gaps: «ابني خالة» with As'ad (no maternal-cousin predicate), the
  brotherhood (two views), burial at al-Baqi', and sons Abdullah and Amr (no slugs).
- **Zayd ibn al-Khattab** (297-298). appearance: same apart from the leading «وكان». Brother Umar: SIBLING_OF (catalog
  HALF_BROTHER; the entry says «أخو», rule). Died Rabi' I, year 12, at al-Yamamah (same). Virtues: «وكان أسن من عمر،
  وأسلم قبله» and the Yamamah banner. Gaps: the brotherhood with Ma'n ibn Adi, and the Yamamah event.
- **As'ad ibn Zurarah** (299-303). Title naqib «نقيب بني النجار». Virtues: «من كبراء الصحابة» and Ka'b ibn Malik's «كان أول
  من جمع بنا بالمدينة» (Abu Dawud 1069, hasan). Gaps: death «في السنة الأولى من الهجرة» (the date reader cannot read it
  yet) and Ibn Ishaq's «قبل بدر» (no year). The catalog's longer virtue text is not in his entry's words (rule).

## Gaps for the whole batch (guide rule 9)

Poems; uncle and milk-brother ties; brotherhood (no predicate); burial apart from death place; a month with no year;
who killed whom; hosting; children with no catalog slug; maternal cousins; no Yamamah or al-Raji' event in the catalog.

## Checks

- `npm run model:check`: 29 units (8 before, 21 new).
- `npm run model:app-people`: all 21 have full pages, with no empty section and no «ص ٠–٠».
- `npx vitest run shared/ src/lib/model`: 1,240 passed. Nasab questions read: all right. Nasab lines: Mu'adh, Khallad
  and Mu'awwidh go through Amr ibn al-Jumuh; Aban through Khalid; Bishr through al-Bara'. Amr ibn Sa'id's line stops at
  «العاص» (three names, no brother rule), which is short but not wrong.
- Virtue questions: a few quotes are too general for «فيمن قيل هذا؟» («من كبراء الصحابة», «من أشراف قومه»). They stay on
  the pages, and a quiz rule for them was asked of the main Tarajim thread.
