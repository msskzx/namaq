# Batch 7: Siyar v4 entries 72, 77–91 and v5 entries 1–3

Nineteen entries from سير أعلام النبلاء (Risalah edition): v4 p335–558 and v5 p5–17. Entries 73–76 came with earlier
batches. Store pages: `data/history/sources/siyar-alam-al-nubala-risalah/v4/335.md`–`558.md` (p335 stored again,
whole) and `v5/5.md`–`17.md`. Scripts: `/mnt/project-files/tarajim-app/conversion/batch7/` (helper `lib7.py`).

Every value rests on a quoted span, said by the author, a named narrator or an unnamed «قيل». The editor's footnotes
decide what is sound: only reports in al-Bukhari or Muslim, graded sahih, hasan or «قوي» by the editor, or affirmed by
the author become virtues. Reports the editor leaves ungraded, grades weak, or grades «رجاله ثقات» only stay out.
Al-Waqidi is used for maghazi only.

## Classified diff (`npm run model:diff -- <slug>`)

For every person, catalog `titles: companion` shows as catalog-only or different. COMPANION_OF covers it where the text
gives it, and `al-sabiqoon` where the author calls him one of the first. Full names differ because the model keeps the
Siyar's wording; where a heading and the author's nasab line are joined, the nisba at the end of the heading stays in
place (the same layout as Anas in batch 16).

- `abu-zayd-al-ansari`: no catalog entry; every value is model-only by addition.
- `ibn-umm-maktum`: sex, father same. Name different (the Madinah reading, plus the Iraq reading «عمرو», shown in the
  nominative). Added: mother Atikah, blindness, death places al-Madinah / al-Qadisiyyah, Qadisiyyah, the an-Nisa' 95
  revelation, 3 virtues.
- `khalid-ibn-al-walid`: sex, father same. Added: kunya, laqab «سيف الله», Mu'tah, the conquest of Makkah, Hunayn, the
  conquest of Damascus, his command, death 21 at Hims (and «بالمدينة»), age 60, 1 virtue.
- `safwan-ibn-bayda`, `suhail-ibn-bayda`: sex same, father same (Suhail's father comes through his brother). Added:
  mother Da'd (Safwan), kunyas, Badr, Uhud (Suhail), deaths 38 (Ramadan) and 9, Suhail's funeral prayer in the mosque
  (Muslim 973, the editor).
- `al-miqdad-ibn-amr`: sex, father same. Catalog-only: wife Duba'ah (not in his entry). Added: appearance, Badr, death 33
  at 70, 1 virtue.
- `ubayy-ibn-kaab`: sex, father same. Added: 2 kunyas, laqab «سيد القراء», appearance, Badr, five death years (19, 22,
  30, 32), 4 virtues.
- `al-numan-ibn-muqarrin`: sex same. The Siyar has him twice: here (v4 entry 83) and in v5 entry 71 (an earlier
  batch). Father: catalog `amr-ibn-muqarrin`; the model's `muqarrin-ibn-aidh` comes from the v5 entry. This entry's line
  «النعمان بن عمرو بن مقرن» names Amr, so it adds no CHILD_OF; reported for the main Tarajim thread. Added here: kunyas
  «أبو عمرو» and «أبو حكيم» (قيل), «الأمير», Kaskar for Umar, Khandaq, Hudaybiyyah, Nahavand, death 21 (Ibn Ishaq).
- `ammar-ibn-yasir`: sex, father same; mother Sumayyah added. Virtues different: the catalog's «تقتله الفئة الباغية» is
  not on these pages as a graded report about him; «مرحبا بالطيب المطيب» is modeled. Added: kunya, appearance, Badr,
  Siffin, age 93.
- `an-najashi`: sex same. Added: name «أصحمة», 2 virtues.
- `muadh-ibn-jabal`: sex, father same; mother Hind added. Added: 2 kunyas, appearance, Badr, the second Aqabah, Islam at
  18, death 17/18 at Qusayr Khalid, ages 32 and 38, 3 virtues.
- `abdullah-ibn-masud`: sex, father same; mother Umm Abd added. Catalog virtue (the sheep of Uqbah) unsupported here as
  graded; three others modeled. Added: kunya, laqab «فقيه الأمة», appearance, Badr, Yarmuk, death 32/33 at al-Madinah,
  age 63.
- `utbah-ibn-masud-al-hudhali`: sex, father same. Added: brother Abdullah (al-Zuhri), son Abdullah ibn Utbah.
- `khubayb-ibn-yasaf`: sex, father same. Added: wife Jamilah, three children, Badr, Uhud, COMPANION_OF (al-Waqidi,
  maghazi), the reading «إساف بن عدي» (Ibn Abi Hatim) as name.variant.
- `uwaym-ibn-saidah`: sex, father same. Added: kunya, Badr, the second Aqabah («بلا نزاع»), age 65 (Ibn Sa'd).
- `salman-al-farisi`: sex same. Added: name «سلمان ابن الإسلام» (Ibn Asakir; in `nasabSlips.json`, since «ابن الإسلام» is
  not a father), kunya, COMPANION_OF, death at al-Mada'in, 36 (Abu Ubayd, Shabab) and 33 («يقال»), variants «ماهويه»
  (Abu Nu'aym) and «ماية» (قيل), 3 virtues (the thurayya hadith: al-Bukhari 4897, Muslim 2546, the editor).
- `ubadah-ibn-al-samit`: sex, father same. Catalog-only: wife Umm Haram (not on these pages). Added: kunya, appearance
  (his son al-Walid), son al-Walid, Badr, the first Aqabah, COMPANION_OF, death 34 at al-Ramlah aged 72 (and al-Haytham's
  45), 1 virtue. The editor's bracketed «[عمرو بن عوف]» is left out of the name.
- `abdullah-ibn-hudhafah`: sex, father same. Added: kunya, `al-sabiqoon`, COMPANION_OF, Badr (Ibn Yunus, Ibn Mandah), 2
  virtues (the letter to Kisra; the captivity at Caesarea, the author's own line).
- `abu-rafi`: sex same. Added: name = kunya (GUIDE 15), variants Ibrahim / Aslam, son Ubaydullah, COMPANION_OF, Uhud,
  Khandaq, death 40 at al-Kufah («قيل»), 1 virtue.

## Not modeled (why)

- Utbah: «هاجر إلى الحبشة» (which hijra is not said); Ibn Mas'ud's words about him and Umar waiting for Umm Abd (al-Hakim
  only, ungraded).
- Khubayb: the Ibn Sa'd/Ahmad report of his Islam (ungraded); «توفي في خلافة عثمان» (no year); al-Dimyati's claim the
  author answers.
- Uwaym: the first Aqabah («في قول الواقدي»); brotherhoods (no predicate); «نعم العبد» (weak); two «قيل» firsts.
- Salman: the long Ibn Ishaq story (no predicates, versions graded differently); «سلمان منا أهل البيت» («سنده ضعيف»);
  «الجنة تشتاق إلى ثلاثة» (weak); Shabab's «سنة سبع» (the author: «وهم»); the ages 250/350 (the author doubts them).
- Ubadah: residence and grave in Jerusalem; weak and «رجاله ثقات»-only reports; «زمن معاوية» (no year).
- Abdullah ibn Hudhafah: the fire story (its sound version does not name him); «أبوك حذافة» (the man is unnamed);
  ungraded captivity stories.
- Abu Rafi': Coptic origin and clientage (no predicates); «توفي في خلافة علي» (no year).

## Quiz checks (GUIDE check 4)

The nasab questions were read; none offers a wrong choice that is also right. Nine virtues went into
`virtueQuizSkip.json`: the Quran-gatherers named together by Anas (Abu Zayd, Ubayy), the muezzin (shared with Bilal),
horsemen at Badr, the twelve naqibs, and four general praises. Suhail's funeral prayer stays asked: the editor's Muslim
973 names Suhail alone. Ibn Umm Maktum's Iraq reading «عمرا» shows in the nominative (`nominativeName`, tested).
`coverage.ts` now finds a heading whose number and dash the print splits over two lines (v4 p501).
