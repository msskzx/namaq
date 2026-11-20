# Batch 17: Siyar v6 entries 77–95 (printed pages 430–467)

Nineteen entries from سير أعلام النبلاء ج٣ (volume 6 of this edition), Shamela pages 3038–3075. The store pages
`data/history/sources/siyar-alam-al-nubala-risalah/v6/431.md`–`467.md` are whole Shamela pages (p430 came with batch
16; p467 is shared with batch 18). Scripts: `/mnt/project-files/tarajim-app/conversion/batch17/` (one per person,
`h.py` from batch 5).

Every value rests on a quoted span, said by the author, a named narrator or an unnamed «قيل». The editor's footnotes
decide what is sound: only reports in al-Bukhari or Muslim, graded sahih, hasan or «قوي» by the editor, or affirmed by
the author become virtues. Reports the editor leaves ungraded, grades weak, or grades «رجاله ثقات» only stay out.

## Classified diff (`npm run model:diff -- <slug>`)

Seventeen of the nineteen have no catalog entry, so every value is **model-only by addition**. Their fathers, mothers,
siblings and children are new slugs too (named in the entry, no catalog person yet), except those below.

- `said-ibn-al-as-ibn-said` (entry 87): new slug. The catalog's `said-ibn-al-as` is Abu Uhayhah, his grandfather, so
  this man gets his own slug, and his father `al-as-ibn-said-ibn-al-as` too.
- `abdullah-ibn-jaafar` (catalog): `sex` same. Full name: different by addition (heading + nasab line, p456; the page
  prints «الهاشمي» at the end of the heading line, before the line goes on, the same layout as Anas in batch 16).
  Mother Asma bint Umays same; father Ja'far added. Model-only by addition: kunya, COMPANION_OF, brothers Awn and
  Muhammad, sons Isma'il, Ishaq and Mu'awiyah, Siffin, deaths 80 / 84 / 85 / 90, and six virtues. Catalog virtues
  («ابن عم النبي، من أجود الناس… بحر الجود») are unsupported in this text as written; the author's own «الجواد» praise is
  modeled instead. Catalog-only `titles: companion`: covered by COMPANION_OF.

Catalog slugs reached: `al-abbas-ibn-abd-al-muttalib`, `umm-al-fadl-bint-al-harith`, `jaafar-ibn-abi-talib`,
`asma-bint-umays`, `prophet-muhammad`, events `yarmuk`, `siffin`, `qadisiyyah`, `fath-cyprus`.

## Per entry: what is modeled, and what is not

| # | slug | modeled | not modeled (why) |
|---|---|---|---|
| 77 | abdullah-ibn-busr | name, father, kunya, brother Atiyyah and sister al-Samma', COMPANION_OF, Cyprus, virtue «لتبلغن قرناً» (his own words, Ahmad, «وسنده حسن»), death 88 (al-Waqidi, «جماعة») and 96 (Abd al-Samad), age 94 | «آخر من مات من الصحابة بالشام»: al-Waqidi alone, and not a date or battle, so no virtue; «بركة الشام» (an epithet, no deed); «يعيش هذا الغلام قرناً» (ungraded); «قبل سنة مائة» and «في إمرة سليمان» (no year) |
| 78 | abu-inabah-al-khawlani | name = kunya (GUIDE 15), COMPANION_OF DISPUTED (Ibn Ma'in for the people of Hims against al-Daraqutni and Shurahbil), Yarmuk | «ممن صلى القبلتين» (said of many); residence in Hims |
| 79 | muhammad-ibn-hatib | name (heading + the author's line through Habib, p435), parents, brother al-Harith, four sons, kunya, COMPANION_OF, virtue: the Prophet's ruqyah for his burnt hand («سنده حسن»), «قيل» first named Muhammad in Islam (shown, not asked), death 74 | born in Abyssinia (no birth place predicate); milk brother of Abdullah ibn Ja'far (no milk predicate) |
| 80 | as-saib-ibn-yazid | name, father, son, 2 kunyas, COMPANION_OF, virtue: Hajj with the Prophet at seven (al-Bukhari), death 94 (al-Ju'ayd), 91 (al-Waqidi, Abu Mushir, «جماعة»), 80 (al-Haytham, DISPUTED: the author's «وشذ», GUIDE 17) | «بارك الله فيك» («رجال الصحيح… وهو ثقة» only); Ibn Khatal and Umar's words (Ibn Asakir, ungraded) |
| 81 | jubayr-ibn-al-huwayrith | name as printed, father, COMPANION_OF (the author's «صحابي صغير، له رؤية», p439), Yarmuk | «وقيل: … بحذف بجير»: the anonymous reading drops Bujayr; the name stays as printed and the line meets other Qurashis at Qusayy either way |
| 82 | qutham-ibn-al-abbas | name, parents, brothers, COMPANION_OF, 2 virtues (both on the page, not asked: shared resemblance, general praise), death place Samarqand (al-Zubayr, al-Hakim) and Marw (قيل) | riding behind the Prophet («رجاله ثقات» only); «آخر من خرج من لحده» (ungraded); no death year |
| 83 | mabad-ibn-al-abbas | name, parents, three children | birth order; descendants |
| 84 | kathir-ibn-al-abbas | name, father, brothers, virtue (Ibn Sa'd «فقيهاً… ثقة», not asked: general) | unnamed mother; «تابعي» (no status predicate) |
| 85 | tammam-ibn-al-abbas | name, father, brother, virtue «من أشد أهل زمانه بطشاً» (Ibn Sa'd) | unnamed mother; descendants |
| 86 | al-fadl-ibn-al-abbas | name (his heading; parents and brothers come from his father's and brothers' entries) | the book gives his heading only («وأخوهم عبد الله مر»); the editor's note under it is not the book's text |
| 87 | said-ibn-al-as-ibn-said | name (heading + nasab), father, sons Amr al-Ashdaq and Yahya, COMPANION_OF, 3 virtues (not asked: general praise, the fitnah, the mushaf group), death 59 (al-Zubayr ibn Bakkar, Khalifah), 58 (Musaddad, Abu Ma'shar), 57 (Musaddad's other year; both of Abu Ma'shar's and Musaddad's «سبع/ثمان» take the decade from Musaddad's «وخمسين», GUIDE 16), place: his palace at al-Arsah | Tabaristan (no catalog event); ungraded reports and poems |
| 88 | amr-ibn-said-al-ashdaq | name as printed, father Sa'id (from entry 87), office Damascus | the heading's «بن العاص» names his grandfather: in `nasabSlips.json` (GUIDE 11), so his line goes on through Sa'id; his rising and killing (no year) |
| 89 | al-hirmas-ibn-ziyad | name, father, kunya, COMPANION_OF («إسناده حسن») | «عمر دهراً»; the author's guess «إلى حدود سنة تسعين» |
| 90 | qudamah-ibn-abdullah-al-kilabi | name, father, kunya, COMPANION_OF («إسناده حسن») | residence; «إلى بعد الثمانين» (no year) |
| 91 | sufyan-ibn-wahb-al-khawlani | name, father, kunya, COMPANION_OF DISPUTED (the author and al-Barqi, Ibn Abi Hatim, Ibn Yunus against Ibn Sa'd and al-Bukhari), death 91 (al-Musabbihi) | his hadith (Ibn Lahi'ah, weak); the Farewell Hajj («فيما قيل») |
| 92 | ghudayf-ibn-al-harith | name, «وقيل فيه: الحارث بن غضيف» as name.variant (GUIDE 13), father, son, kunya, COMPANION_OF DISPUTED (Ibn Abi Hatim, Abu Zur'ah against Ibn Sa'd), virtue: Umar's «نعم الفتى غضيف» (as Abu Dharr quotes him, «إسناده صحيح»; names him, so not asked) | the date-palm hadith (al-Ala ibn Yazid unassessed); the Abd al-Malik report (weak); «في حدود سنة ثمانين» |
| 93 | abdullah-ibn-jaafar | see the diff above; virtues: «آخر من رأى النبي… من بني هاشم» (author), riding behind the Prophet («صحيح على شرط مسلم»), «شبه خلقي وخلقي» and «بارك… في صفقته» («قوي»), the boys met on return from travel (Muslim 2428); death 80 (al-Waqidi, Mus'ab al-Zubayri), 84 (Abu Ubayd, al-Mada'ini), 85 (al-Mada'ini), 90 (يقال) | the pledge at seven (weak); «بارك له في تجارته» («رجالهما ثقات»); generosity stories (ungraded) |
| 94 | qais-ibn-aidh-abu-kahil | name, father, kunya, COMPANION_OF | «إلى حدود سنة ثمانين» (no year) |
| 95 | hujr-ibn-adi | name, father, kunya, laqab «حجر الخير», brother Hani, two sons, COMPANION_OF, Qadisiyyah, Siffin, 3 virtues (Ibn Umar's grief, «وهو صحيح», asked; two general ones not asked), killed 51 | the arrest and killing story (no chain or «قيل»); burial at Adhra (burial apart from death place) |

## Quiz checks (GUIDE check 4)

New nasab questions were read; none offers a wrong choice that is also right. Nine virtues went into
`virtueQuizSkip.json` (general praise, or shared with a group). Sa'id ibn al-As's grandfather is printed «أبي أحيحة
سعيد», and Khalid ibn Sa'id's father «سعيد»: `sameName` now takes a kunya before a name as the same man, so the two
lines meet at Abu Uhayhah and not one father higher (test in `tarajimLine.test.ts`).

## Second-agent review

Must-fix items applied: Ibn Busr's al-Sham «last» dropped as a virtue; «لتبلغن قرناً» credited to Ibn Busr; Amr
al-Ashdaq's heading in `nasabSlips.json`; Sa'id's sons linked to his name, not «والد»; the leading «و» dropped from
fourteen relatives' names; al-Haytham's year DISPUTED; Ghudayf's name variant. Should-fix applied: every sayer in a
shared frame credited, the «X أو Y» years, Jubayr's companionship, Umar's words as one speaker. Not applied: Abu
Hatim beside Abu Zur'ah on Ghudayf (the page names him only as «أبي», Ibn Abi Hatim's father, which would show as a
sayer «أبي»); Hujr's death place (the «عذراء» lines are unattributed narrative). Earlier batches still quote some
relatives with a leading «و» (v5 Jarir, Abu Usayd, Hatib, Wa'il, al-Abbas, Fatimah); reported for the main Tarajim
thread.
