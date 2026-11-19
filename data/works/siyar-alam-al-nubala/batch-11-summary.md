# Batch 11: Siyar v5 #89 to #107 (printed pages 460-530)

Converted under `/mnt/project-files/tarajim-app/conversion/GUIDE.md`. The scripts are in `conversion/batch11/`:
`e89_95.py`, `e96_101.py` and `e102_107.py`. They use `lib3.py` there and `../batch10/lib2.py`, and run from the repo
root. Store pages v5 461-530 were added as whole Shamela pages. Page 460, which is shared with batch 10, is unchanged.

## Units (19)

| # | unit | person |
|---|---|---|
| ٨٩ | siyar-v5-89-shaddad-ibn-aws | shaddad-ibn-aws |
| ٩٠ | siyar-v5-90-uqbah-ibn-amir | uqbah-ibn-amir-al-juhani |
| ٩١ | siyar-v5-91-buraidah-ibn-al-husayb | buraidah-ibn-al-husayb |
| ٩٢ | siyar-v5-92-abd-al-rahman-ibn-abi-bakr | abd-al-rahman-ibn-abi-bakr |
| ٩٣ | siyar-v5-93-al-hakam-ibn-amr | al-hakam-ibn-amr-al-ghifari |
| ٩٤ | siyar-v5-94-rafi-ibn-amr-al-ghifari | rafi-ibn-amr-al-ghifari |
| ٩٥ | siyar-v5-95-rafi-ibn-amr-al-muzani | rafi-ibn-amr-al-muzani (new) |
| ٩٦ | siyar-v5-96-al-arqam | al-arqam-ibn-abi-al-arqam |
| ٩٧ | siyar-v5-97-abu-humayd-al-saidi | abu-humayd-al-saidi |
| ٩٨ | siyar-v5-98-abdullah-ibn-al-arqam | abdullah-ibn-al-arqam |
| ٩٩ | siyar-v5-99-abdullah-ibn-mughaffal | abdullah-ibn-mughaffal |
| ١٠٠ | siyar-v5-100-khuzaymah-ibn-thabit | khuzaymah-ibn-thabit |
| ١٠١ | siyar-v5-101-awf-ibn-malik | awf-ibn-malik-al-ashjai |
| ١٠٢ | siyar-v5-102-muayqib | muayqib-ibn-abi-fatimah-al-dawsi |
| ١٠٣ | siyar-v5-103-abu-masud-al-badri | abu-masud-al-badri |
| ١٠٤ | siyar-v5-104-usamah-ibn-zaid | usamah-ibn-zaid |
| ١٠٥ | siyar-v5-105-imran-ibn-husain | imran-ibn-husain |
| ١٠٦ | siyar-v5-106-hassan-ibn-thabit | hassan-ibn-thabit |
| ١٠٧ | siyar-v5-107-kaab-ibn-malik | kaab-ibn-malik |

## Classified diff (`npm run model:diff -- <slug>`)

There are four classes: same, different by addition, different by rule, and unsupported in the text.

- **fullName** is *different by rule* for 17 of the people. The model keeps the printed heading and nasab line, with its
  tashkeel. The catalog adds nisbas the entry does not print (Shaddad's «النجاري الخزرجي»). It also reads al-Arqam's
  father as «عبد مناف» where the book prints «أبي الأرقم».
  - Abu Humayd's name is the heading alone. His ism is disputed, and both «قيل» readings are kept, attributed.
  - Abu Mas'ud's name comes from «واسمه:» (p494), and two other nasab readings are kept as variants (see the review).
- **sex** is *same* for all 18 people who have a catalog entry.
- **titles**: the catalog's `companion` is *unsupported in the text* as a title. Companionship is modeled as
  `COMPANION_OF` (7 people) where the page states it. Al-Arqam's `al-sabiqoon` is *different by addition*.
- **parents**: these are *different by rule*, because the catalog's father slugs are wrong legacy values:
  - Abdullah ibn al-Arqam: `abd-yaghuth-ibn-wahb` is really his grandfather. The model uses `al-arqam-ibn-abd-yaghuth`.
  - Ka'b ibn Malik: `malik-ibn-al-qayn` should be `malik-ibn-abi-kaab`.

  Hassan's mother al-Furay'ah is *different by addition*. Abu Mas'ud's father «عمرو بن ثعلبة» is a new slug
  (`amr-ibn-thalabah-ibn-asirah`).
- **siblings**: Abd al-Rahman and Aisha, and al-Hakam and Rafi' ibn Amr al-Ghifari, are *same in substance*. The
  catalog's `BROTHER` is the model's `SIBLING_OF`.
- **rafi-ibn-amr-al-muzani** is a new person, with no catalog entry. The catalog's `rafi-ibn-amr-al-ghifari-akhu-aidh`
  is really this man, al-Muzani, the brother of A'idh. It is a duplicate to clean up, and this batch does not use it.
- **virtues** (15), **death years** (15), **kunyas** (11), **participations** (17) and **absences** (5) are
  *different by addition*. Each one is read from its page with its sayer.

## Second-agent review

The first review stopped on a usage limit before it reported. A second one read all 19 units against the guide and the
pages, and found 10 must-fix items. All were fixed:

1. **Shaddad, Badr.** «شهد بدرا» is now the anonymous «بعضهم» alone. Al-Bukhari's «ولم يصح» (p464) is its own
   statement on the same DISPUTED assertion. His kunya «أبا يعلى» (p462) is credited to Muslim, Ahmad and al-Nasa'i,
   not to Muslim alone.
2. **Khuzaymah, Badr.** The «قيل» claim now also rests on the author's «والصواب: أنه شهد أحدا وما بعدها» (p485).
3. **Mu'ayqib, Badr.** Ibn Mandah's claim now also rests on the author's «ولا يصح هذا» (p491).
4. **Abd al-Rahman ibn Abi Bakr, death 53.** It now rests on the author's reason too: «ولا يستقيم؛ فإن في (صحيح
   مسلم): أنه دخل على عائشة يوم موت سعد» (p472).
5. **Abd al-Rahman ibn Abi Bakr, place of death.** Ibn Abi Mulaykah's «بالصفاح» (p473) is removed. It has no chain on the
   page, and the sound wording the editor gives (Tirmidhi, Abd al-Razzaq) says «بالحبشي».
6. **Abu Mas'ud, Badr.** «عمن لا يتهم: … وكان قد شهد بدرا» (p495) is removed: the link is unnamed, there is no grade,
   and the aside is the narrator's. Al-Hakam's claim keeps Badr DISPUTED, beside the author's «ولم يشهد بدرا على
   الصحيح».
7. **Abu Mas'ud, nasab variants** (rule 13).
   - «وقيل: يسيرة بن عسيرة … بن الحارث بن الخزرج» is added, unattributed.
   - Al-Daraqutni's «جده نسيرة - بنون - فخولف» (p494) is added with his name.
8. **Abu Humayd, his ism.** «قيل: اسمه عبد الرحمن» and «وقيل: المنذر بن سعد» (p481) are added, each DISPUTED.
9. **Buraydah, death 62.** The span now ends before «وهذا أقوى». That remark is the author's own statement on the
   same assertion, so he is shown backing 62.
10. **Abdullah ibn al-Arqam, laqab «الكاتب».** The value now sits inside its own statement («الزهري، الكاتب», p482).

These SHOULD items were done too:
- Usamah at Mu'tah («وقيل», p497) is DISPUTED, like the other «قيل» battle claims.

These were left for the main Tarajim thread or recorded as gaps:
- **Al-Waqidi outside maghazi.** Abu Mas'ud's place of death and Hassan's mother's name use al-Waqidi, as earlier
  merged units do.
- **Stated companionship not modeled.** «وله صحبة» and similar for al-Hakam (p474), Rafi' (p477), the Muzani brothers
  (p478), Ibn Mughaffal (p483), and al-Bukhari's «شداد له صحبة» (p464).
- **Abu Mas'ud at al-Aqabah** (the author and al-Waqidi, p494). It waits for an Aqabah event.
- **Sound virtues not yet added:**
  - the angels greeting Imran (p508-509, Muslim 1226), and Ibn Sirin's word on him (p509, «رجاله ثقات»);
  - Khuzaymah's witness counted as two (p486, Abu Dawud 3607);
  - Umar's «هذا الرجل الصالح» on Mu'ayqib (p492).
- **Ka'b, ayat.** The page labels «لقد تاب الله على النبي» as [التوبة: ١١٨], but those words open 9:117. The value
  9:118 is kept, because the quote runs on to «وعلى الثلاثة». The page also prints ١٢٠ for 9:119.
- **Other gaps:**
  - Abd al-Rahman at Badr with the mushrikun.
  - Buraydah's 62 against 63: both kept.
  - Hassan's 60 + 60 years, and whether he fought («لم يشهد مشهدا»).
  - Mu'ayqib's hijra to Abyssinia.
  - Ka'b at al-Aqabah, his jahili kunya «أبو بشير», and the mu'akhat dispute.
  - Shaddad «ابن أخي حسان»: there is no uncle predicate.
  - Offices, burials, and children not named with a tie.

## Quiz check

Every new virtue and laqab question was read.
- Twelve general or shared virtues go into `virtueQuizSkip.json`, each with its reason. Among them:
  - Ka'b as one of the three left behind;
  - Usamah's «إني أحبهما», said of him and al-Hasan together;
  - Ibn Mughaffal as one of the ten sent to Basra;
  - Abdullah ibn al-Arqam's writing for the Prophet ﷺ.
- Three laqabs go into `namesQuizSkip.json`, each with the Siyar page that gives it to another man:
  - «شاعر رسول الله», for both Hassan (v5 p512) and Ka'b (v5 p523);
  - «حب رسول الله» for Usamah, which is also said of Zaid ibn Harithah (v4 p220).
