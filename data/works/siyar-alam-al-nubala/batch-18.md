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
(p505–507), the entry settles it: «قدم المدينة بعد وفاة النبي ﷺ بليال» (the author) and his own words «ما فاتني النبي ﷺ
إلا بخمس ليال، قبض وأنا بالجحفة». The two «له صحبة» on his pages are about other men: Ibn Ma'in's «وعبد الله الصنابحي
يشبه أن يكون له صحبة» is about عبد الله الصنابحي, whom «بعضهم يهم فيه» confuses with him, and Ibn al-Madini's is about
الصنابح بن الأعسر الأحمسي. So nobody on the page claims companionship for him, and he stays out with entries 110–113.

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

## Quiz check (GUIDE check 4)

Every new virtue question was read. Six are general praise and go into `virtueQuizSkip.json`: Abu Asib «من الصلحاء
العباد», Safiyyah «الفقيهة، العالمة», Abu al-Tufayl «ثقة… شاعرا، فارسا», Abd al-Rahman ibn al-Harith «من نبلاء الرجال»,
Ibn Tha'labah «شاعرا، فصيحا، نسابة», Hashim «موصوفا بالشجاعة».

The kunya quiz offered «أبو القاسم» (Muhammad ibn Abi Hudhayfah's kunya, and Marwan's by «قيل») as a wrong choice. That
is the Prophet's ﷺ kunya, which the owner's rule keeps out of every choice list; `nameQuestions` now leaves out any
name the Prophet ﷺ bears. Umm Khalid's entry states her marriage to al-Zubayr too, so the al-Zubayr profile and diff
tests count his wives once each.
