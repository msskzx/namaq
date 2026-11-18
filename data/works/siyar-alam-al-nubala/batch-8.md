# Batch 8: Siyar v5 #20 to #50 (printed pages 201-282)

Converted by the batch 8 thread under `/mnt/project-files/tarajim-app/conversion/GUIDE.md`. Scripts:
`conversion/batch8/` (one per entry, `aunts.py` for #43-48, helper `h.py`). Store pages v5 202-222, 250-254,
257-259 and 273-282 were added as whole Shamela pages (book 10906, ids 2182-2262); 223, 255, 256 and 260, which
held only a neighbour's slice, now hold the whole page. Page 282 joins its split heading «٥١ - أسماء بنت عميس» onto
one line, as the book prints it, so the coverage test finds where Umm Umarah's entry ends.

## Units (16)

| # | unit | person | pages |
|---|---|---|---|
| ٢٠ | siyar-v5-20-umm-salamah | umm-salamah | 201-210 |
| ٢١ | siyar-v5-21-zaynab-bint-jahsh | zaynab-bint-jahsh | 211-217 |
| ٢٢ | siyar-v5-22-zaynab-bint-khuzaymah | zaynab-bint-khuzaymah | 218 |
| ٢٣ | siyar-v5-23-umm-habibah | umm-habibah | 218-222 |
| ٢٩ | siyar-v5-29-ruqayyah | ruqayyah-bint-muhammad | 250-251 |
| ٣٠ | siyar-v5-30-umm-kulthum | umm-kulthum-bint-muhammad | 252-253 |
| ٣١ | siyar-v5-31-al-aliyah | al-aliyah | 254 |
| ٣٢ | siyar-v5-32-asma-bint-kaab-al-jawniyyah | asma-bint-kaab-al-jawniyyah (new) | 255 |
| ٤٣ | siyar-v5-43-atikah | atikah-bint-abd-al-muttalib | 272 |
| ٤٤ | siyar-v5-44-al-bayda | al-bayda-bint-abd-al-muttalib | 273 |
| ٤٥ | siyar-v5-45-barrah | barrah-bint-abd-al-muttalib | 273 |
| ٤٦ | siyar-v5-46-umaymah | umaymah-bint-abd-al-muttalib | 273-274 |
| ٤٧ | siyar-v5-47-dubaah | dubaah-bint-al-zubayr-ibn-abd-al-muttalib | 274 |
| ٤٨ | siyar-v5-48-durrah | durrah-bint-abi-lahab | 275-276 |
| ٤٩ | siyar-v5-49-umm-kulthum-bint-uqbah | umm-kulthum-bint-uqbah | 276-277 |
| ٥٠ | siyar-v5-50-umm-umarah | umm-umarah | 278-282 |

Waiting (second entries, per batches.md, until their batch merges): #28 Zaynab bint Muhammad (batch 4), #35
al-Kilabiyyah and #36 «الكندية» (batch 1). Their store pages (246-249, 256-259) are in the store already.

## Classified diff (`npm run model:diff -- <slug>`)

Four classes: same / different by addition / different by rule / unsupported in the text.

- **fullName**, all 15 with a catalog entry: *different by rule*. The model keeps the book's printed name: the
  heading and the nasab line (Umm Salamah p201-202, Umm Habibah p218-219, Umm Kulthum bint Uqbah p276, Umm Umarah
  p278, Duba'ah p274), or the heading alone where nothing more is printed (Zaynab bint Jahsh, the aunts, Durrah).
  The catalog adds nisbas and fathers the entry does not print (Zaynab bint Khuzaymah's line to Sa'sa'ah; «القرشية»).
  The daughters' names are printed «بنت رسول الله», not «بنت محمد بن عبد الله…»; their nasab tree goes on through
  the Prophet's own entry. Al-Aliyah's heading «العالية امرأة من بني بكر بن كلاب» describes her tribe; the name is «العالية».
- **titles**: `mother-of-believers` same (four wives). `daughter-of-prophet` same (Ruqayyah, Umm Kulthum, from
  «بنت رسول الله»). `companion`: *unsupported in the text*, not stated as a title in these entries. `umm-al-masakeen`
  (Zaynab bint Khuzaymah): modeled as her laqab «أم المساكين» (p218), not a title, as for Zaynab bint Jahsh (p217).
- **virtues**: *different by rule*. The model holds the author's own sentences and sound reports with their sayers;
  the catalog's values are summaries with no page. Seven short, shared descriptions are kept out of virtues,
  because the same words are said of other women in the app and the «صاحب المنقبة» quiz would offer a right answer
  as wrong: «من المهاجرات الأول» (Umm Salamah, Zaynab bint Jahsh), «من المهاجرات» (Duba'ah, Durrah, Umm Kulthum
  bint Uqbah), «وكانت تعد من فقهاء الصحابيات» (Umm Salamah, said in other words of Aisha), «أسلمت، وهاجرت»
  (Atikah), «وكانت صالحة، صوامة، قوامة، بارة» (Zaynab bint Jahsh), «الفاضلة، المجاهدة» (Umm Umarah). They stay
  as spans and statements in the units, so a rule can bring them back.
- **appearance**: Umm Salamah «من أجمل النساء» (p202) same in substance. Zaynab bint Jahsh's catalog appearance is
  *unsupported* as appearance; «صناع اليد» (p217) is Aisha's report about her work, not modeled.
- **spouses**: *different by addition*. Zaynab bint Jahsh + Zayd (p211). Zaynab bint Khuzaymah + Abd Allah ibn Jahsh
  (author), al-Tufayl ibn al-Harith (an unnamed «قيل», and al-Jurjani), Ubaydah (al-Jurjani): every opinion kept with
  its sayer. Umm Kulthum bint Uqbah + Abd al-Rahman ibn Awf, Amr ibn al-As (p277). Umm Habibah + Ubaydullah ibn Jahsh
  (Ibn Sa'd p220, and her own report p220-221, Abu Dawud, sahih per the editor).
- **parents**: Umm Habibah's mother Hind bint Utbah is *catalog-only*; the entry does not name her.
- **ayat**: Umm Salamah's catalog `33:33` is *catalog-only*. The entry says the passage al-Ahzab 32-34 is about all
  the Mothers of the Believers (p207); a statement about a group is not tied to one person here. New: Zaynab bint
  Jahsh `33:37` (author, «وهي التي يقول الله فيها», p211), Umm Kulthum bint Uqbah `60:10` (author, p276-277).
- **death**: Zaynab bint Khuzaymah's catalog year 4 and al-Baqi' are *unsupported in the text* (the entry gives no
  year: «لم تمكث عنده إلا شهرين أو أكثر، وتوفيت»). Model-only: Umm Salamah 61 (author, p210) and 59 in Dhu al-Qa'dah
  (Umar ibn Abi Salamah through al-Waqidi, p203; the author calls 59 a slip on p210, and both are kept with their sayers); Zaynab bint Jahsh 20; Umm Habibah 44
  (al-Waqidi, Abu Ubayd, al-Fasawi) and 42 (al-Mufaddal al-Ghallabi); Umm Kulthum bint Muhammad Sha'ban 9.
- **asma-bint-kaab-al-jawniyyah**: no catalog entry; new subject. The book itself records the identity as reported:
  «قيل: هي أسماء بنت كعب الجونية. كذا سماها ابن إسحاق» and «وقيل: بل هي أسماء بنت النعمان الغفارية». The model has no
  predicate for an alternative name, so the second naming is left as text. Kept apart from
  asma-bint-al-numan-al-kindiyyah (batch 1, and #36 «الكندية»), whose entry names a different father and tribe.
  Al-Zuhri's «أخت بني الجون … فاستعاذت منه» is not tied to her: the page does not say it is the same woman.

- **Second-agent review fixes**: Umm Habibah's «ليس في أزواجه من هي أقرب نسبا إليه منها» is the only virtue taken
  from that sentence; «أكثر صداقا» and «نائية الدار أبعد» are facts about the marriage (GUIDE rule 5). Umm Umarah's virtue
  is «وقطعت يدها في الجهاد» (p278); her list of battles stays as PARTICIPATED_IN. Her husband Ghaziyyah ibn Amr rests on
  al-Waqidi's own statement (p278), used as a historian as for Umm Habibah's death year.
- **Al-Bayda and Uqbah ibn Abi Mu'ayt (p273) not modeled**: «ثم خلف عليها: عقبة بن أبي معيط، فولدت له: الوليد، وخالدا،
  وأم كلثوم» follows «وأروى والدة الشهيد عثمان», so «عليها» may be al-Bayda or Arwa (the nearer antecedent; Ibn Sa'd,
  cited by the editor, puts it on Arwa). The text is unclear, so neither reading is modeled. The catalog's link of
  al-Bayda to Uqbah's children is *catalog-only*.
- **Bare «عثمان»** in Ruqayyah's and Umm Kulthum's entries (p251-252) is identified as uthman-ibn-affan from the
  context of the Prophet's daughters' marriages; the entries do not print «بن عفان».
- Zaynab bint Jahsh's ayah reference prints «[الأحزاب: ٣٧٠]», a print slip; the value is 33:37.

## Weak reports kept out (editor's grading in the notes)

Umm Salamah: al-Najashi gift (p209, «إسناده ضعيف»); Abu Hurayrah praying over her (p210, al-Waqidi, rejected by the
author). Zaynab bint Jahsh: «أواهة» (p217, «إسناده ضعيف … مرسل»); her shroud (p217, al-Waqidi). Ruqayyah: «أول من هاجر
بعد لوط» (p251, «سنده واه»); Ibn Abbas's burial report (p252, «منكر» per the author). Al-Aliyah: Ka'b ibn Ujrah's
report (p254, Jamil ibn Zayd «واه»). Umm Habibah: the dream report (p221, «منكرة»); her daughter Habibah (p220, al-Waqidi).

## Gaps the model does not cover (left out)

- Milk-brother: Abu Salamah is the Prophet's milk-brother (p202).
- Burial apart from death place: Umm Salamah and Zaynab bint Jahsh al-Baqi'.
- Indefinite ages: «عاشت نحوا من تسعين سنة» (Umm Salamah), «بقيت إلى بعد عام أربعين فيما أرى» (Duba'ah), «توفيت في خلافة علي».
- Death with no number: Ruqayyah «والمسلمون ببدر».
- Marriage dates (Umm Salamah Shawwal 4; Zaynab bint Jahsh Dhu al-Qa'dah 5, «وقيل»).
- «ليلة العقبة» (Umm Umarah) is not said to be the first or the second pledge, and al-Yamamah has no catalog slug.
- Group statements: al-Ahzab 32-34 and 33 «في أزواج النبي» (Umm Salamah p207-208, Umm Habibah p221).
- «وهي من بنات عم الرسول» (Umm Habibah p219) is a tribal kinship, not a first cousin, so it is not `PATERNAL_COUSIN`.
- Hadith counts, narrators from her, wealth and gifts.
- Atikah «أسلمت، وهاجرت» and Umaymah «أسلمت، وهاجرت» conflict with the author's own doubt (Umaymah p274 «والظاهر أن
  أميمة الكبرى العمة ما هاجرت، ولا أدركت الإسلام»; Safiyyah's entry «والصحيح أنه ما أسلم من عمات النبي سواها»), so
  neither is shown as a virtue. Al-Bayda («ما أظنها أدركت نبوة المصطفى») and Barrah («لم تدرك المبعث») are in the
  book's run of women and are converted, with no companionship claimed.

## New slugs (proposed; no catalog entry yet)

Children and spouses named on these pages: umar-ibn-abi-salamah, salamah-ibn-abi-salamah, zaynab-bint-abi-salamah,
durrah-bint-abi-salamah, hamnah-bint-jahsh, abu-ahmad-ibn-jahsh, abdullah-ibn-jahsh, ubaydullah-ibn-jahsh,
khuzaymah-ibn-al-harith, at-tufayl-ibn-al-harith, anbasah-ibn-abi-sufyan, hanzalah-ibn-abi-sufyan,
utbah-ibn-abi-lahab, utaybah-ibn-abi-lahab, abdullah-ibn-uthman-ibn-affan, al-walid-ibn-uqbah, khalid-ibn-uqbah,
umarah-ibn-uqbah, abu-ruhm-ibn-abd-al-uzza, abu-sabrah-ibn-abi-ruhm, abdullah-ibn-al-miqdad, karimah-bint-al-miqdad,
ibrahim-ibn-abd-al-rahman-ibn-awf, humayd-ibn-abd-al-rahman-ibn-awf, abdullah-ibn-kaab-al-mazini,
abd-al-rahman-ibn-kaab-al-mazini, ghaziyyah-ibn-amr, habib-ibn-zayd-ibn-asim. Where batches.md proposes a slug for a
later entry (umar-ibn-abi-salamah, salamah-ibn-abi-salamah, zaynab-bint-abi-salamah, al-walid-ibn-uqbah), the same
slug is used, so that entry links up when it is converted.
