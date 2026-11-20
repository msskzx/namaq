# Batch 18: Siyar v6 entries 96–118 (printed pages 467–509)

Eighteen entries from سير أعلام النبلاء ج٣ (volume 6 of this edition), Shamela pages 3075–3117. The store pages
`data/history/sources/siyar-alam-al-nubala-risalah/v6/467.md`–`534.md` are whole Shamela pages; p509–534 are stored here
for batch 19, which starts on p509. Scripts: `/mnt/project-files/tarajim-app/conversion/batch18/` (one per person, `h.py`
from batch 5). Entries 96–109 were written on 2026-11-18 on a branch based before #935 merged; their batch-only diff
was re-applied on main and every script re-run, so the units are what the scripts produce today.

Every value rests on a quoted span, said by the author, a named narrator or an unnamed «قيل». The editor's footnotes
decide what is sound: only reports in al-Bukhari or Muslim, or graded sahih or hasan by the editor, become virtues.

## Scope

Entries 110–113 (عبد الله بن شداد، كعب الأحبار، زياد بن أبيه، صلة بن أشيم) are outside the Companions and nobody's
contested Companion (siyar-index, docs/data-pipelines.md «Companion scope»). They are not converted.

**#117 al-Sunabihi (عبد الرحمن بن عسيلة) is left out too**, though the index marked him «contested». Read in full
(p505–507), the author settles it against: «قدم المدينة بعد وفاة النبي ﷺ بليال», and his own words agree («ما فاتني
النبي ﷺ إلا بخمس ليال»). Ibn Ma'in's «وعبد الله الصنابحي يشبه أن يكون له صحبة» is about the name «عبد الله», which the
author calls a mistake for this man («وبعضهم يهم فيه»), and Ibn al-Madini's «له صحبة» is about الصنابح بن الأعسر.

**#104 Muhammad ibn Abi Bakr and the other «born in the Prophet's ﷺ lifetime» entries stay in** with no COMPANION_OF:
siyar-index takes in an entry whose subject was born in the Prophet's lifetime (here «ولدته… في حجة الوداع», p481) as a
Companion by age, per docs/data-pipelines.md («excluding a real Companion costs a silent hole»). The tie itself is only
modeled where the page states one.

## Classified diff (`npm run model:diff -- <slug>`)

Sixteen of the eighteen have no catalog entry («no catalog entry»), so every value is **model-only by addition**.

- `umm-khalid-bint-khalid`: `sex` same; full name, kunya, virtue, father, companionOf model-only by addition.
- `umm-kulthum-bint-ali`: `sex` same. `fullName` different by rule (the print, heading + «ابن عبد المطلب بن هاشم
  الهاشمية»; the catalog's retyped «القرشية» is not on the page). `parents` different by addition (Ali from this entry;
  Fatimah already comes from Fatimah's own unit). companionOf («ورأت النبي ﷺ») and both brothers al-Hasan and al-Husayn
  («شقيقة الحسن والحسين») model-only by addition. Catalog-only virtue «بنت علي وفاطمة، حفيدة النبي»: unsupported as a
  virtue sentence in this entry.

## Per entry: what is modeled, and what is not

| # | slug | modeled | not modeled (why) |
|---|---|---|---|
| 96 | hujr-ibn-yazid | as written on 2026-11-18 (see the script) | |
| 97 | abu-at-tufayl | name, father, kunya, COMPANION_OF (three statements), virtues (last to see the Prophet ﷺ; «ثقة…», in the quiz skip list as general praise), death 100 (Khalifah), 107 (يقال), 110 (Jarir, the author's «هذا هو الصحيح») | born after the Hijrah (no birth predicate); the poem; al-Mukhtar's banner («قيل») |
| 98 | umm-khalid-bint-khalid | name, father, kunya, COMPANION_OF, husband al-Zubayr, sons Amr and Khalid, virtue (the khamisah, al-Bukhari) | «وأظنها آخر الصحابيات وفاة» (a guess); al-Najashi (al-Waqidi) |
| 99 | amr-ibn-az-zubayr | name (the heading), father, brothers Abd Allah and Ubaydah, appearance | his fight and death («قيل», no year). **Fixed on resume**: the father's identification rested on a span in his mother's entry (p471), which the coverage test rejects; it now rests on his brothers' names inside his own entry. No companionship statement in the entry (scope «in» was the index's) |
| 100–106 | | as written on 2026-11-18 (see each script) | |
| 107 | mahmud-ibn-labid | name, father, kunya, COMPANION_OF (al-Bukhari), death 97 (author) and 96 («ويقال: في سنة ست») | **Fixed on resume**: 96 is printed without its decade; GUIDE rule 16 reads it with `decadeFrom` pointing at «سنة سبع وتسعين» just before it |
| 108 | hashim-ibn-utbah | as written on 2026-11-18 (see the script) | **Fixed on resume**: the Siffin basis span had no prefix (model:check) |
| 114 | umm-kulthum-bint-ali | name (heading + the line under it), father Ali, brothers al-Hasan and al-Husayn, COMPANION_OF («ورأت النبي ﷺ»), son Zayd by Umar (al-Zuhri; the author's «وكان ابنها زيد»), husbands Umar and Awn (Ibn Ishaq), Muhammad and Abd Allah sons of Ja'far (Ibn Ishaq; identified as the three brothers by the author's «الإخوة الثلاثة») | born «في حدود سنة ست» (no birth predicate); Umar's «كل سبب ونسب» (the Prophet's words about his own lineage, not about her); the dowry and the proposal story (ungraded, and mursal by the other way); «وقيل: ولدت له رقية»; al-Zuhri's daughter Bathnah by Muhammad ibn Ja'far, which the author's «فلم يولدها أحد من الإخوة الثلاثة» contradicts (a child with no entry: both stay out); her death with Zayd (no year) |
| 115 | abdullah-ibn-thalabah-ibn-suayr | name, father, kunya, COMPANION_OF (the Prophet ﷺ wiped his head, author), virtues «شاعرا، فصيحا، نسابة» (author; quiz skip, general) and al-Zuhri learning nasab from him (editor: sahih chain, after Ibn Hajar), death 89 (Khalifah and others) | «وقيل: بل ولد عام الفتح» and the author's answer (no birth predicate; it is within the Prophet's lifetime, so it does not contest the tie) |
| 116 | abdullah-ibn-rabiah-as-sulami | name, father, COMPANION_OF ×2, each DISPUTED (GUIDE 3a): the unnamed «قيل: له صحبة» with the author's «فإن لم تكن، فحديثه من قبيل المرسل», and Shu'bah's «وكانت له صحبة» with the author's «هكذا قال» | «توفي بعد الثمانين» (no year). The entry never names the Prophet ﷺ, so the tie's object is his name in the editor's note on Shu'bah's hadith (al-Nasa'i, «أنه كان مع رسول الله ﷺ في سفر»); the note is not a statement the tie rests on |
| 118 | safiyyah-bint-shaybah | name (heading + nasab across p507–508), father Shaybah ibn Uthman, kunya, virtue «الفقيهة، العالمة» (quiz skip, general), COMPANION_OF DISPUTED (GUIDE 3a: «يقال: لها رؤية» against «ووهّى هذا: الدارقطني»), son Mansur | Ibn Hajar's reply to al-Daraqutni, quoted in the editor's note (al-Bukhari's ta'liq; Abu Dawud's chain «حسن» per al-Mizzi): an editor's quotation, not a statement in the book, so the tie stays «على خلاف»; the Ibn Majah report of her seeing him at the Ka'bah (p509 note: «فيه عنعنة ابن إسحاق»); «أحسب أنها عاشت إلى دولة الوليد» (no year) |

## Second-agent review (fixed before the PR)

- #106 Abd al-Rahman ibn al-Harith: the author's «ولا صحبة لعبد الرحمن، بل له رؤية» settles it, so the COMPANION_OF is removed (GUIDE 3a, ADR 0025); the sentence stays a statement.
- #108 Hashim: «وبعضهم عده في الصحابة» (unnamed) and the author's «باعتبار إدراك زمن النبوة» are now two statements, and the tie is DISPUTED on both.
- #109 Tariq: the sayer of «رأيت رسول الله ﷺ وغزوت…» is Tariq, not Qays ibn Muslim who transmits it.
- #97 Abu al-Tufayl: the sayer of the year 110 is Jarir, Wahb's father («سمعت أبي»), not Wahb.
- #99 Amr ibn al-Zubayr: Ubaydah's «قد أجرته» sits inside a «قيل» story, so it is an unnamed report; appearance is «بديع الجمال» only.
- #101, #105: relatives named without the conjunction («ميمونة», «عبد الله بن عبد الله»); #105's sons rest on the sentence that names them too.
- #100 Amr ibn Akhtab: the tie rests on the author's «من مشاهير الصحابة»; «وغزا معه ثلاث عشرة غزوة» is no longer a virtue (the editor says only «رجاله ثقات»).
- #107 Mahmud ibn Labid and #118 Safiyyah: the author's «يرسلها» / «وهذا من أقوى المراسيل» join the DISPUTED tie.
- #114: Zayd is named by the author's nominative «زيد».

Left for the main Tarajim thread: a relative's name is taken from the first unit's mention text, so an accusative print («عمرا»، «زيدا» in older units) can show as the name; #105 shows as «عبد الله بن أبي طلحة زيد»; #105's tie rests on a newborn's tahnik (PROPOSED); #116 is the first tie whose Prophet mention sits in the editor's notes.

## Quiz check (GUIDE check 4)

Every new virtue question was read. Six are general praise and go into `virtueQuizSkip.json`: Abu Asib «من الصلحاء
العباد», Safiyyah «الفقيهة، العالمة», Abu al-Tufayl «ثقة… شاعرا، فارسا», Abd al-Rahman ibn al-Harith «من نبلاء الرجال»,
Ibn Tha'labah «شاعرا، فصيحا، نسابة», Hashim «موصوفا بالشجاعة».

The kunya quiz offered «أبو القاسم» (Muhammad ibn Abi Hudhayfah's kunya, and Marwan's by «قيل») as a wrong choice. That
is the Prophet's ﷺ kunya, which the owner's rule keeps out of every choice list; `nameQuestions` now leaves out any
name the Prophet ﷺ bears. Umm Khalid's entry states her marriage to al-Zubayr too, so the al-Zubayr profile and diff
tests count his wives once each.
