# Batch 16: Siyar v6 entries 58–76 (printed pages 387–430)

Nineteen entries from سير أعلام النبلاء ج٣ (volume 6 of this edition), Shamela pages 2995–3038. The store pages
`data/history/sources/siyar-alam-al-nubala-risalah/v6/387.md`–`430.md` are whole Shamela pages (p430 is shared with
batch 17, p387 with batch 15). Scripts: `/mnt/project-files/tarajim-app/conversion/batch16/` (one per person, `h.py`
from batch 5, `fetchPages.ts` for the store pages).

Every value rests on a quoted span, said by the author, a named narrator or an unnamed «قيل». The editor's footnotes
decide what is sound: only reports in al-Bukhari or Muslim, graded sahih or hasan by the editor, or affirmed by the
author («صح», «ثبتت بإسنادين») become virtues. Reports the editor leaves ungraded or grades «رجاله ثقات» only stay out.

## Classified diff (`npm run model:diff -- <slug>`)

Eighteen of the nineteen have no catalog entry («No catalog entry»), so every value is **model-only by addition**.
Their father, mother and children slugs are new too (named in the entry, no catalog person yet), except those below.

- `anas-ibn-malik` (catalog node, no profile): `sex` same. Everything else model-only by addition: full name (heading +
  nasab line, p395), kunya (p396), parents (Malik ibn al-Nadr `malik-ibn-an-nadr-al-najjari`, Umm Sulaym
  `umm-sulaym-al-ghumaysa`), companionOf, five virtues, death 91 / 92 / 93, age 103 / 107. Catalog-only
  `HALF_BROTHER al-baraa-ibn-malik`: unsupported in this entry (it rests on al-Baraa's own entry, batch 2).

Catalog slugs reached: `makhramah-ibn-nawfal` (al-Miswar's father, batch 12), `abu-salamah` and `umm-salamah`
(Umar and Salamah, batches 1 and 8), `uqba-ibn-abi-muayt` and `uthman-ibn-affan` (al-Walid), `umamah-bint-hamzah`
(new slug; Salamah's wife), `prophet-muhammad` (COMPANION_OF).

## Per entry: what is modeled, and what is not

| # | slug | modeled | not modeled (why) |
|---|---|---|---|
| 58 | abdullah-ibn-al-harith-ibn-jaz | name, father, kunya, virtue (last Companion to die in Egypt), death 86 (author) and 85 (قيل), place | «سنة سبع» (87 by ellipsis; the reader reads 7); uncle Mahmiyah (no uncle predicate); the Abu Hanifah claim the author rejects |
| 59 | abdullah-ibn-as-saib | name (heading + nasab), father, 2 kunyas, virtues: reciter of Makkah, read to Ubayy, prayed behind the Prophet (Muslim 455), Mujahid's «قارئنا» (editor: sahih) | the «نعم الخليط» report (editor: weak); death «في إمارة ابن الزبير» (no year) |
| 60 | al-miswar-ibn-makhramah | name, father, mother Atikah, children Abd al-Rahman and Umm Bakr, 2 kunyas, virtues (close to Umar; Ibn Ma'in «ثقة»), death 64, Rabi' al-Akhir (Umm Bakr) | **name stops at «زهرة»**: the print goes on «بن قصي بن كلاب», but Zuhrah is Kilab's son, so the tree would meet the Hashimis at Qusayy instead of Kilab (raised with the main Tarajim thread); al-Mada'ini's 73, which the author calls an error; born «بعد الهجرة بعامين» (offset); ungraded reports |
| 61 | sulayman-ibn-surad | name, father, kunya, virtue («كان ديناً عابداً»), Siffin, killed 65 at Ayn al-Wardah | «الأمير» (office with no scope) |
| 62 | anas-ibn-malik | see the diff above | «وآخر أصحابه موتاً» (Abu al-Tufayl, batch 18, outlived him); Badr (the author: present as a boy, not counted); weak or ungraded reports («يا ذا الأذنين», the kunya story, «رجاله ثقات» ones); born (offset) |
| 63 | umar-ibn-abi-salamah | name, father, mother (قيل), Abu Salamah's four children, kunya, virtue (the Prophet taught him to eat, al-Bukhari and Muslim), death 83 (Ibn al-Athir) | «هو الذي زوج أمه بالنبي»: Salamah's entry says it of Salamah (disputed; as virtues each would make the other a wrong choice that is right); milk uncle; born (offset) |
| 64 | salamah-ibn-abi-salamah | name, father, mother, wife Umamah bint Hamzah, brother Umar and death place al-Madinah (Ibn Sa'd) | the same «زوّج أمه» virtue; «أكبر من أخيه» vs the author's «هذا أكبرهم» stays in the shown sentence, attributed to Ibn Sa'd |
| 65 | busr-ibn-artah | name, father, kunya | the author's «فارساً شجاعاً، فاتكاً» beside the wrongs he lists (no merit to quote alone); «وفي صحبته تردد» (status is not a predicate yet); «إلى حدود سنة سبعين» (approximate) |
| 66 | an-numan-ibn-bashir | name, father, 2 kunyas (author, يقال), COMPANION_OF, virtue (heard the Prophet, a young Companion by agreement), son Muhammad, offices al-Kufah and Hims, killed late 64 at Birin (قيل) | «صاحب رسول الله وابن صاحبه» as a virtue (true of the sons of Abu Salamah too); Simak's praise (ungraded); born 2 vs al-Bukhari's «عام الهجرة» |
| 67 | al-walid-ibn-uqbah | name, father, kunya, brother Uthman (by the mother), office al-Kufah | no virtue: the author's praise sits in sentences that name his drinking; al-Hujurat 6 only in the editor's note; burial near al-Raqqah; no death year in the text |
| 68 | utbah-ibn-abd-as-sulami | name (heading with kunya), father, kunya, COMPANION_OF, son Yahya, age 94 (al-Waqidi), death 87 (Abu Ubayd) | renaming from «عتلة» (ungraded); the pledge of Banu Sulaym («رجاله ثقات») |
| 69 | utbah-ibn-an-nudhdhar | name, father, death 84 (Khalifah) | his one hadith (editor: weak) |
| 70 | amr-ibn-hurayth | name (heading + nasab), father, death 85, eleven children (al-Waqidi), brother Sa'id | the Prophet's prayer for him (weak), «كنت في بطن المرأة يوم بدر» (Sharik), age at the Prophet's death |
| 71 | al-irbad-ibn-sariyah | name, father, virtue (of the people of al-Suffah), REVEALED_ABOUT al-Tawbah 92 (editor: sahih chain), kunya (Ahmad), death 75 (Abu Mushir) | «ربع الإسلام» (the author: not sound); the angel story (ungraded). The book prints [التوبة: ٩٣]; the quoted words are 9:92 |
| 72 | sahl-ibn-saad | name (heading + nasab), father, kunyas (author, «بعضهم»), virtue (last Companion to die in al-Madinah), son Abbas, death 91 (many) and 88 (Abu Nu'aym, al-Bukhari) | renaming from «حزن» (weak); fifteen wives (ungraded) |
| 73 | maslamah-ibn-mukhallad | name, father, 3 kunyas (author, two قيل), office Egypt, death Dhu al-Qa'dah 62 at Alexandria (Ibn Yunus) | companionship contested by Abu Hatim alone («وشذ»): status not a predicate yet; ungraded reports |
| 74 | abdullah-ibn-sarjis | name, father, virtue (the Prophet asked forgiveness for him, Muslim 2346), death place al-Basrah | «سنة نيف وثمانين» (indefinite); Asim's «لم يكن له صحبة», which the author explains |
| 75 | al-miqdam-ibn-madikarib | name, father, 5 kunyas (author, four قيل/يقال), COMPANION_OF, son Yahya, death 87 (جماعة) and 88 (al-Tamimi), age 91 (al-Fallas) | «أفلحت يا قديم» and the ear story (weak); burial (قيل) |
| 76 | abdullah-ibn-abi-awfa | name, father, 3 kunyas, COMPANION_OF, virtues (last Companion to die in al-Kufah; the Prophet's prayer for his family, al-Bukhari and Muslim; seven campaigns, al-Bukhari and Muslim), Hunayn (al-Bukhari), death 86 (author) and 88 (قيل) | «من أهل بيعة الرضوان» as a virtue (true of many; a quiz could offer al-Zubayr); «قارب مائة سنة» (approximate) |

## Code changes in this batch

- `nasabOf`: a nominative «أبو …» after a father's name is a kunya, not a father («سليمان بن صرد أبو مطرف»); «بن أبي بسر»
  stays a father.
- A person with no catalog entry is named «X بن Y» from the nasab (was the first three words: «عبد الله بن»).
- The virtue quiz finds the owner's name without its article (Ibn Ma'in's «مسور ثقة»); the nasab test matches whole
  words («عمرو» does not name «عمر»).

## Checks

1. `npm run model:check`: 27 units (8 + 19).
2. Diff: above.
3. `npm run model:app-people`: all 19 in people.json with their pages (none «٠–٠»).
4. `npx vitest run shared/ src/lib/model`: pass. Every new nasab and virtue question was read; the three that offered a
   wrong choice that is also right were removed at the data (above) or fixed in code.
5. Nasab meetings checked: Umar ibn Abi Salamah and Amr ibn Hurayth meet at «عبد الله» (ibn Umar ibn Makhzum), Ibn
   al-Sa'ib and Amr ibn Hurayth at «عمر» (ibn Makhzum); al-Miswar, cut at Zuhrah, has no meeting until the main thread
   decides.
