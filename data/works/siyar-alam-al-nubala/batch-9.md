# Batch 9: Siyar v5 #51 to #69 (printed pages 282-355)

Converted under `/mnt/project-files/tarajim-app/conversion/GUIDE.md`. The scripts are in `conversion/batch9/`:
`asmas.py` (#51-53), `women2.py` (#54-56), `women3.py` (#57-60), `men1.py` (#61-65) and `men2.py` (#66-69), with the
helper `h.py`. Run them from the repo root with `NAMAQ=<repo> python3 <script>`. Store pages v5 283-355 were added as
whole Shamela pages.

## Units (19)

| # | unit | person | pages |
|---|---|---|---|
| ٥١ | siyar-v5-51-asma-bint-umays | asma-bint-umays | 282-287 |
| ٥٢ | siyar-v5-52-asma-bint-abi-bakr | asma-bint-abi-bakr | 287-296 |
| ٥٣ | siyar-v5-53-asma-bint-yazid | asma-bint-yazid-ibn-al-sakn | 296-297 |
| ٥٤ | siyar-v5-54-barirah | barirah | 297-304 |
| ٥٥ | siyar-v5-55-umm-sulaym | umm-sulaym-al-ghumaysa | 304-311 |
| ٥٦ | siyar-v5-56-umm-hani | umm-hani-bint-abi-talib | 311-314 |
| ٥٧ | siyar-v5-57-umm-al-fadl | umm-al-fadl-bint-al-harith | 314-316 |
| ٥٨ | siyar-v5-58-umm-haram | umm-haram-bint-milhan | 316-318 |
| ٥٩ | siyar-v5-59-umm-atiyyah | umm-atiyyah-al-ansariyyah | 318 |
| ٦٠ | siyar-v5-60-fatimah-bint-qays | fatimah-bint-qais-al-fihriyyah | 319 |
| ٦١ | siyar-v5-61-uthman-ibn-hunayf | uthman-ibn-hunayf | 320-322 |
| ٦٢ | siyar-v5-62-khabbab | khabbab-ibn-al-aratt | 323-325 |
| ٦٣ | siyar-v5-63-sahl-ibn-hunayf | sahl-ibn-hunayf | 325-329 |
| ٦٤ | siyar-v5-64-khawwat | khawwat-ibn-jubair | 329-331 |
| ٦٥ | siyar-v5-65-abdullah-ibn-jubayr | abdullah-ibn-jubayr | 331 |
| ٦٦ | siyar-v5-66-qatadah-ibn-al-numan | qatadah-ibn-al-numan | 331-333 |
| ٦٧ | siyar-v5-67-amir-ibn-rabiah | amir-ibn-rabiah | 333-335 |
| ٦٨ | siyar-v5-68-abu-al-darda | abu-al-darda | 335-353 |
| ٦٩ | siyar-v5-69-iyad-ibn-ghanm | iyad-ibn-ghanm | 354-355 |

## Classified diff (`npm run model:diff -- <slug>`)

There are four classes: same, different by addition, different by rule, and unsupported in the text.

- **fullName** is *different by rule* for 18 of the people. The model keeps the printed heading and nasab line, and the
  catalog adds nisbas or fathers the entry does not print. Barirah's name is the heading alone («بريرة مولاة أم
  المؤمنين عائشة»). Abu al-Darda's father is disputed, so his name is «عويمر بن زيد بن قيس» with every other reading kept
  beside it, each with its sayer.
- **sex** is *same* for all 19.
- **titles**: the catalog's `companion` is *unsupported in the text* as a title for all 19. Asma bint Abi Bakr's
  `dhat-an-nitaqayn` is modeled as her laqab (p288), resting on her own report (p289).
- **kunya** (16), **laqab** (4), **virtues** (15), **death year** (7), **age** (5) and **place of death** (5) are
  *different by addition*: the catalog had none of these values.
- **participations** (17) are *different by addition*. Each one is read from its page with its sayer.
- **siblings**: Umm Haram and Umm Sulaym, Sahl and Uthman ibn Hunayf, and Khawwat and Abdullah ibn Jubayr are *same in
  substance*. The catalog's `SISTER`/`BROTHER` is the model's `SIBLING_OF`. The tie rests on the sentence that states it
  in one of the two entries.
- **spouses and parents** are *different by addition* (6 and 9). They come from the entries' own sentences. Barirah is
  married to Mughith (Ibn Abbas, «إسناده صحيح», p302).
- **appearance**: Asma bint Abi Bakr's is *different by addition*. Khawwat's «ربعة» was left out in review, because it
  is Ibn Sa'd's «قالوا», which is al-Waqidi's material (p330, note 4).

## Second-agent review

A second agent read all 19 units against the guide and the pages. It found 13 must-fix items, and all were fixed:

1. Asma bint Umays: the speaker of «للناس هجرة واحدة، ولكم هجرتان» was the mention «لرسول الله», with the preposition
   stuck on. It is now «رسول الله», shown as the Prophet ﷺ.
2. Asma bint Abi Bakr: her son's mention read «وعروة». It is now «عروة».
3. Asma bint Yazid: her second kunya read «وأم سلمة». It is now «أم سلمة».
4. Umm Sulaym: «دخلت الجنة… فإذا أنا بالغميصاء» is the Prophet's ﷺ words (Muslim 2456). They are now credited to him,
   not to Anas.
5. Umm Sulaym: «لم يكن رسول الله يدخل بيتا غير بيت أم سليم» (Anas) and «إني أرحمها، قتل أخوها معي» (the Prophet ﷺ)
   are now two virtues, each with its own speaker.
6. Umm Hani: «قد أجرنا من أجرت يا أم هانئ» is now credited to the Prophet ﷺ.
7. Umm Haram: the virtue is now only his answer «أنت من الأولين», credited to him. Her question is the frame.
8. Umm Haram: her father's identification now rests on «ملحان بن خالد», not on a span that does not name him.
9. Khabbab: «ادنه، فما أحد أحق بهذا المجلس منك إلا عمار» is Umar's words (p324). It is now credited to «عمر». Abu
   Layla stays in the isnad.
10. Umm Atiyyah: her other name «وقيل: نسيبة بنت كعب» (p318) is added, unattributed.
11. Abu al-Darda: death year 31 (Khalid ibn Ma'dan) is DISPUTED. It rests on the claim and on the author's «فهذا خطأ»
    (p353, rule 17).
12. Abu al-Darda: these name readings are added, each with its own sayer:
    - «ويقال: ابن عبد الله» and «وقيل: ابن ثعلبة بن عبد الله» (both unattributed, as name variants);
    - «عويمر بن عامر» from Mughith ibn Sumayy, and from Ahmad and Ibn Abi Shaybah;
    - «عويمر بن ثعلبة» from Ibn Ishaq and from Abu Mushir (p335, p337).
13. Abu al-Darda: «حكيم هذه الأمة، وسيد القراء بدمشق» is now two virtues (rule 5).

These SHOULD items were done too:
- Asma bint Abi Bakr's «آخر المهاجرات وفاة» (p288) repeats «خاتمة المهاجرين والمهاجرات» (p296), so only the second is kept.
- Her «ذات النطاقين» report now ends at her own words, «فاربطي بهما».
- Umm Hani's brother mention «وجعفر» is now «جعفر».
- Asma bint Yazid's `PATERNAL_COUSIN` to Mu'adh ibn Jabal is dropped. The heading says «بنت عمة معاذ», a cousin through
  his aunt, but the app words `PATERNAL_COUSIN` as «ابنة عم», and the author rejects «بنت عم» on p297 («ولا يستقيم
  ذلك، لأن أسماء من بني عبد الأشهل، ومعاذا من بني سلمة»).

These were left for the main Tarajim thread:
- Children named in the accusative («محمدا», «عونا», «هانئا», «مغيثا») show as printed. The same happens on main (Ja'far,
  Umar), so it is a rule gap in the app.
- Abu al-Darda's «وولي القضاء بدمشق» (p336) and Abdullah ibn Jubayr's command of the archers (p331) are offices, kept
  as virtues until an office predicate exists (ADR 0025).
- Qatadah's eye at Uhud (p332) is the author's own statement and is kept (rule 5). The editor lists only weak or mursal
  routes for it, and the next report says «يوم بدر».
- Abu al-Darda at Uhud rests on Sa'id ibn Abd al-Aziz (p338). It is kept as a maghazi report.
- Asma bint Abi Bakr's age 100 is read from the end of Urwah's report (p293). It is her age ten days before her son's
  death, not at her own.
- Some nasab differences are recorded here, not modeled:
  - Asma bint Umays's «معبد» is «معد» in Ibn Sa'd, the Jamharah and the Isti'ab (editor, p282 note 3).
  - Sahl's line from Ibn Sa'd (p328) has «بن عمرو» where Uthman's (p320) does not.
  - Khawwat's «وهو امرؤ القيس بن ثعلبة» (p329).
- The other isms of Umm Hani («فاختة», «وقيل: هند») and of Umm Sulaym («سهلة», «أنيفة», «رميثة») are not modeled.
- Not added: Anas's «لم يجمع القرآن غير أربعة: أبو الدرداء…» (p339). It is shared by four people.

## Not modeled

- Barirah being a mawla of Aisha: there is no predicate for it.
- Umm Haram's raid. The «يقال» that it was Cyprus is not modeled.
- Abdullah ibn Jubayr's killer.
- The Ali–Sahl brotherhood (Ibn Sa'd's «قالوا»).
- Amir ibn Rabi'ah's death is printed «سنة خمسين وثلاثين», a misprint, so it is left out.
- Uthman ibn Hunayf's list of sons repeats «عبد الله». It is modeled once.
- Abu al-Darda's wife is left out, because «أم الدرداء العالمة» could be either of the two.
- Shared or general wordings are kept out of virtues: «من أفاضل النساء», «من نجباء السابقين», «من السابقين الأولين»,
  «إحدى المهاجرات», «من فقهاء الصحابة», «السيدة، الفاضلة».

## Quiz check

Every new virtue question was read:
- Virtues that name their owner (Umm Hani, Umm Sulaym, Sahl, Amir) are not asked. The generator already skips them.
- Two virtues go into `virtueQuizSkip.json`:
  - Asma bint Umays's «ولكم هجرتان», which was said to all who emigrated to Abyssinia.
  - Umm al-Fadl's «كنت أنا وأمي من المستضعفين», which her son says of himself as well.

## New slugs (proposed; no catalog entry yet)

mughith, haram-ibn-milhan, malik-ibn-al-nadr, abu-umayr-ibn-abi-talhah, abdullah-ibn-abi-talhah, hubayrah-ibn-abi-wahb,
the sons of Hubayrah, tammam-ibn-al-abbas, al-dahhak-ibn-qays-al-fihri, abu-amr-ibn-hafs-al-makhzumi, hunayf-ibn-wahib,
the sons of Uthman ibn Hunayf, al-aratt-ibn-jandalah, abu-umamah-ibn-sahl, jubayr-ibn-al-numan,
al-numan-ibn-zayd-al-zafari, umar-ibn-qatadah, rabiah-ibn-kaab-al-anazi, abdullah-ibn-amir-ibn-rabiah,
bilal-ibn-abi-al-darda, ghanm-ibn-zuhayr-al-fihri. Where batches.md proposes a slug for a later entry, this batch uses
the same slug. hubayrah-ibn-abi-wahb is the name he is known by. The page prints «هبيرة بن عمرو بن
عائذ» (p311), and the unit quotes that print.
