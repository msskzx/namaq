# Batch 19: Siyar v6 entries 119–138 (printed pages 509–534)

Thirteen entries from سير أعلام النبلاء ج٣ (volume 6 of this edition), Shamela pages 3117–3140. The store pages
`data/history/sources/siyar-alam-al-nubala-risalah/v6/509.md`–`534.md` came in with batch 18. Scripts:
`/mnt/project-files/tarajim-app/conversion/batch19/` (one per person, `h.py` from batch 5); each script's comments say
what is modeled and why the rest is not.

Every value rests on a quoted span, said by the author, a named narrator or an unnamed «قيل». The editor's footnotes
decide what is sound: only reports in al-Bukhari or Muslim, or graded sahih, hasan or «سند قوي» by the editor, become
virtues.

## Scope

Entries 127, 129, 131, 132, 134, 136 and 137 (قيس بن مكشوح، يزيد بن مفرغ، عمرو بن سلمة الهمداني، كعب بن سور، صعصعة بن
صوحان، حكيم بن جبلة، جبلة بن الأيهم) are outside the Companions and nobody's contested Companion (siyar-index). They are
not converted. The entry stops at «١٣٩ - الوليد بن عتبة» on p534.

**#133 Zayd ibn Suhan and #138 Uqbah ibn Nafi stay in with no COMPANION_OF.** The index marked both «contested»; read in
full, the author settles each against: «ولا صحبة له» (Zayd, p525) and «لم يصح له صحبة» (Uqbah, p533). GUIDE 3a: no tie,
and the sentence stays a statement.

**#122, #123 and #128, born in the Prophet's ﷺ lifetime, stay in with no COMPANION_OF**, as in batch 18: a tie is
modeled only where the page states one. #122's «فعلى هذا يكون… قد رأى النبي» rests on his father dying at Badr, which
the editor (after Ibn Hajar) says «لم يثبت»; #123's «ولعله رآه» is a guess.

**#135 Abd Allah ibn al-Harith ibn Nawfal** is his second entry (batch 2 converted v4 #29). This unit models only what
that one does not: kunya, the tahnik, the DISPUTED tie and the author's praise.

## Code

- `src/lib/model/coverage.ts`: Shamela prints #136's number on a line of its own («١٣٦» then «- حكيم بن جبلة», p531), so
  #135's coverage ran on to the end of the stored pages. The next-entry stop now takes either form; a test in
  `coverage.test.ts` holds it. (Merged with main's optional space after the dash.)

## Per entry

| # | slug | modeled | not modeled (why) |
|---|---|---|---|
| 119 | yusuf-ibn-abdullah-ibn-salam | name, father, kunya, virtue (the Prophet ﷺ named him and sat him in his lap; «إسناده صحيح», Ibn Hajar in the editor's note), COMPANION_OF ×3 DISPUTED (the author's «وله رؤية ما», Ibn Abi Hatim's «له رؤية», al-Bukhari's «له صحبة», each against Abu Hatim's «ليست له صحبة» and al-Ijli's «تابعي، ثقة») | the «كسرة… تمرة» report (majhul narrator; the author's «فإن صح هذا»); death «في خلافة عمر بن عبد العزيز» (no year); the Eid khutbah («غريب جدا») |
| 120 | abdullah-ibn-ukaym | name, father, COMPANION_OF DISPUTED (the unnamed «قيل: له صحبة» against the author's «وقد أسلم بلا ريب في حياة النبي ﷺ», sure of his Islam only), death 88 («قيل») | the letter hadith («ضعيف لاضطرابه»); the kunya «أبا معبد» (said by an unnamed man in a report) |
| 121 | ubaydullah-ibn-al-abbas | name, father, the Prophet's ﷺ cousin, six brothers, COMPANION_OF (unnamed «له رؤية»), a second COMPANION_OF DISPUTED (Ibn Sa'd's «سمع من النبي ﷺ» against the author's «حكمه أنه مرسل»), virtue (author's description), office (Ali's governor of al-Yaman), death 58 (Khalifah and others) and 87 (Abu Ubayd and Abu Hassan al-Ziyadi, each a sayer) | his sons killed by Busr; the «قيل» gift; deaths with no year |
| 122 | ubaydullah-ibn-adi-ibn-al-khiyar | name, father, mother Umm Qital (Ibn Sa'd), Ata ibn Yazid's praise | born in the Prophet's ﷺ lifetime (no birth predicate); no tie (see Scope; in al-Bukhari he answers Uthman «أدركت رسول الله؟ قال: لا») |
| 123 | rabiah-ibn-abdullah-ibn-al-hudayr | name, father, death 93 aged 87 (author) | «ولعله رآه» (a guess); his brother's sons (no uncle predicate) |
| 124 | rabiah-ibn-abbad | name, father, COMPANION_OF DISPUTED (al-Bukhari and others «له صحبة», against the author's «ولا ريب في سماع ربيعة… ولكن كان قبل أن يسلم» and his seeing him at Dhu al-Majaz «قبل أن يسلم»), al-Yarmuk |  «إلى حدود سنة تسعين» (no year) |
| 125 | abu-umamah-ibn-sahl | name (heading: kunya and father's line, GUIDE 15), kunya, father, COMPANION_OF ×2 (the unnamed «فيما قيل», Abu Ma'shar's «وقد رأى النبي ﷺ»), al-Zuhri's praise, sons Muhammad and Sahl, death 100 (by agreement) | the name «أسعد» alone (one word); grandfather As'ad ibn Zurarah (no predicate); the Uthman report (ungraded) |
| 126 | mahmud-ibn-ar-rabi | name, father, mother, kunyas Abu Muhammad (author) and Abu Nu'aym («ويقال»), virtue (the majjah, al-Bukhari; the span stops before «وهو يومئذ ابن أربع سنين», since al-Bukhari has «ابن خمس سنين» and Ibn Hajar found four nowhere), COMPANION_OF ×2 DISPUTED (the author's «أدرك النبي ﷺ وعقل منه» and Ibn Ma'in's «له صحبة», against al-Ijli's «من كبار التابعين»), death 99 aged 93 (al-Waqidi, and al-Tamimi «وكذا أرخه») and 96 (Khalifah) | in-law of Ubadah (no predicate); the Constantinople raid (no event) |
| 128 | abdullah-ibn-amir-ibn-rabiah | name (heading up to the kunya), kunya, father, death 85 (author) | born «عام الحديبية» (no birth predicate), no companionship statement («له حديث مرسل»); his elder brother of the same name (no full name) |
| 130 | amr-ibn-salamah-al-jarmi | name (heading up to the kunya), father, kunyas, virtue (led his people's prayer as a boy, al-Bukhari), COMPANION_OF DISPUTED («وقد قيل: إنه وفد مع أبيه، وله رؤية» against the author's «فالله أعلم»), death 85 (Ahmad) | his father's companionship (for the father's own entry) |
| 133 | zaid-ibn-suhan | name, father, brother Sa'sa'ah, kunyas Abu Sulayman (author) and Abu A'ishah («وقيل»), virtue (author), wounded at al-Jamal (Ghaylan ibn Jarir) | no tie (see Scope); the «جندب وما جندب» report (weak narrators per the editor); the hand at Jalula' or Nahawand (ungraded); Ibn Sa'd's reports (ungraded) |
| 135 | abdullah-ibn-al-harith-ibn-nawfal | kunya, virtue (the Prophet ﷺ did his tahnik), COMPANION_OF DISPUTED (the tahnik against Ibn Sa'd's «ثقة، تابعي»), the author's praise | everything v4 #29 already holds; «عاش بضعا وسبعين» (no exact age) |
| 138 | uqbah-ibn-nafi | name, father, the author's description (courage, resolve, piety), office, Kairouan (author), son Abu Ubaydah, death 63 (Ibn Yunus) | no tie (see Scope); the beasts leaving the valley (al-Waqidi, ungraded); «مجاب الدعوة» (no chain); 62 is his reappointment, not his death |

## Second-agent review (fixed before the PR)

- #121: the brothers are named without the conjunction («كثير»، «الفضل»…), and Abd Allah is `abdullah-ibn-abbas` (the page: «هو شقيق عبد الله»); Abu Hassan al-Ziyadi is the second sayer of 87.
- #125: the son is named «سهل», not «وسهل»; the author's birth sentence no longer carries the «فيما قيل».
- #120 and #124: the tie is DISPUTED on the author's answer (above).
- #126: the majjah virtue drops the age of four; al-Tamimi's «وكذا أرخه» is a second sayer of 99.

Kept as in batch 18, for the main Tarajim thread to rule on once: a scholar's own words of praise quoted by the author
(Ata ibn Yazid on #122, al-Zuhri on #125) are kept as virtues, as batch 18 kept Ahmad on Marwan and Umar on Ghudayf; both
are in the quiz skip list. The older units v5 #11 and v6 #82 name Ibn Abbas `abdullah-ibn-al-abbas`, a slug with no
app entry. Zayd's third brother Sayhan («لا يكاد يعرف») is left out.

## Quiz check (GUIDE check 4)

Every new virtue question was read. Five fit other people in the app and go into `virtueQuizSkip.json`: Zayd's «من
العلماء العباد», Ubaydullah ibn al-Abbas's «أميرا، شريفا، جوادا، ممدحا», Ubaydullah ibn Adi's «من فقهاء قريش وعلمائهم»,
Uqbah's description, and al-Zuhri's «من علية الأنصار… ومن أبناء البدريين» on Abu Umamah.
