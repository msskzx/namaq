# Batch 1: Siyar 1 pp. 5–171 and the two Kilabi and Kindi wives (Siyar 2 pp. 256–260)

Fourteen units, built by the scripts in the project files under `tarajim-app/conversion/batch1/`
(one script per person, all using `conversion/lib.py`). Witness `siyar-alam-al-nubala-risalah`.
Store volume 4 is Siyar vol. 1 and store volume 5 is Siyar vol. 2.

| Unit | Entry | Pages |
| --- | --- | --- |
| siyar-v4-1-abu-ubaydah | ١ | 4: 5–23 |
| siyar-v4-4-abdur-rahman-ibn-awf | ٤ | 4: 68–92 |
| siyar-v4-5-saad-ibn-abi-waqqas | ٥ | 4: 92–124 |
| siyar-v4-6-saeed-ibn-zaid | ٦ | 4: 124–143 |
| siyar-v4-7-musab-ibn-umayr | ٧ | 4: 145–150 |
| siyar-v4-8-abu-salamah | ٨ | 4: 150–153 |
| siyar-v4-9-uthman-ibn-mazun | ٩ | 4: 153–160 |
| siyar-v4-10-qudamah-ibn-mazun | ١٠ | 4: 161–162 |
| siyar-v4-11-abdullah-ibn-mazun-al-jumahi | ١١ | 4: 163 |
| siyar-v4-12-as-saib-ibn-uthman | ١٢ | 4: 163–164 |
| siyar-v4-13-abu-hudhayfah | ١٣ | 4: 164–167 |
| siyar-v4-14-salim-mawla-abi-hudhayfah | ١٤ | 4: 167–170 |
| siyar-v5-35-al-kilabiyyah | ٣٥ | 5: 256–257 |
| siyar-v5-36-asma-bint-al-numan-al-kindiyyah | ٣٦ | 5: 257–260 |

## Store pages

- v4/144 added (Shamela id 1570, the author's list of the first fifty sabiqun). v4/145 replaced with the full page
  (its top was missing).
- v5/256 and v5/260 replaced with the full pages (256 lacked headings ٣٤ and ٣٥; 260 lacked the end of entry ٣٦).
  v5/257–259 added. The old batch for al-Kindiyyah pointed at the sira volume (store v2 p258), which is the wrong book
  part: the two wives are Siyar vol. 2 entries ٣٥ and ٣٦.
- The sabiqun list (v4/144–145) sits between entries ٦ and ٧ and belongs to no entry. The coverage guard keeps every
  span inside its own entry, so the list is not cited from any unit. Uthman ibn Maz'un and as-Sa'ib lose the
  `al-sabiqoon` title for now (their entries do not say it); a unit for the list section would restore it.

## Gradings used (rule 4)

Kept, with the editor's grading:
- Sahihayn: Abu Ubaydah «لكل أمة أمين» and Hudhayfah's «رجلا أمينا» (agreed upon); Sa'd's «ما جمع أبويه», «أول من رمى»,
  «سابع سبعة» (agreed upon), «جمع لي أبويه يوم أحد» and «ثلث الإسلام» (al-Bukhari), the guarding report (agreed upon),
  al-An'am 52 (Muslim); Sa'id's «لموثقي على الإسلام» (al-Bukhari) and Arwa (Muslim); Mus'ab's Khabbab report (agreed
  upon), al-Bara' (al-Bukhari) and Ibn Awf's words (al-Bukhari); Umm Salamah on Abu Salamah (Muslim); Umm al-Ala' on
  Uthman ibn Maz'un (al-Bukhari); Salim's imamate at al-Usbah (al-Bukhari).
- Graded sahih or hasan: Sa'd «اللهم استجب لسعد» (isnad sahih); Sa'id's Hira hadith («حديث صحيح»); Uthman ibn Maz'un
  kissed by the Prophet ﷺ (al-Tirmidhi: sahih; editor: hasan by its witness); Salim's voice (isnad sahih, author: جيد).
- «رجاله ثقات»: Aisha on al-Kilabiyyah; Abu Burdah on Uthman ibn Maz'un's worship.
- Historians and the author's own words, attributed (as the pilot did with Khalifah and al-Mada'ini): Ibn Sa'd,
  al-Waqidi (maghazi only: dates, battles and the sariyyah command; the three appearance reports that run through him,
  for Abu Ubaydah p7, Ibn Awf p75 and Sa'd p97, are left out), Ibn Ishaq, Musa ibn Uqbah, Urwah, Ibn Abd al-Barr, Ibn Mandah, Abu al-Zinad,
  Aisha bint Sa'd, Aisha bint Qudamah, Abd Allah ibn Muhammad ibn Aqil.

Left out as weak or broken (editor or author says so): Ibn Awf's appearance via Abd al-Aziz ibn Abi Thabit (matruk, p97 n3); Sa'd's «هذا خالي» chain; Sa'id's Marwan and «سيد أهل البلد»
(ungraded, Ata' mukhtalit); the mu'akhat hadith of p141 (author: موضوع); Uthman ibn Maz'un's Kathir ibn Zayd and
Ubaydullah ibn Abi Rafi' mursals, Ibn Sabit (author: لا يثبت), both Ibn Abbas reports (Sufyan ibn Waki', Ali ibn Zayd),
al-Ifriqi, al-Zuhri and Abu Qilabah reports, al-Waqidi's Umar report; Mus'ab's Ali report (unnamed link) and Sa'd's
report via Salih ibn Kaysan (munqati'); Salim's al-Waqidi Yamamah report (matruk), Muhammad ibn Ibrahim's mu'akhat
(munqati'), Umar's «لو أدركني» (Ali ibn Zayd); al-Kindiyyah: al-Waqidi's reports, Abu Usayd's report (author: إسناده واه),
Zuhayr and al-Kalbi (Hisham ibn Muhammad, matruk). So al-Kindiyyah's name «أسماء بنت النعمان», her father and her second
husband al-Muhajir rest only on weak reports and are not in the unit. The Bukhari version of the Jawniyyah story is
only in the editor's note on p259, and notes are not the author's text.

## Classified diff (`npm run model:diff -- <slug>`)

Common to all: the catalog's `companion` title is not a title any entry states (by rule, as for al-Zubayr). Names end
at the last «بن X» and leave out nisbas (القرشي، الزهري…), so the catalog's trailing nisbas are a difference by rule.
PARTICIPATED_IN, office, islam.age and died.month have no catalog field, so they show as model-only additions.

- **abu-ubaydah-ibn-al-jarrah**: fullName different by rule (the heading's «أبو عبيدة بن الجراح» shorthand is kept as
  printed; nasabOf drops it). deathYear 18 and 17, each with its sayer (rule 3). placeOfDeath فحل: unsupported in this
  entry's sound text. titles: the-ten not stated as a title in this entry (unsupported); ayah 9:100: not stated.
- **abdur-rahman-ibn-awf**: appearance split into its three sayers (presentation). parents add two unidentified mothers
  (al-Shifa' per «جماعة», Safiyyah bint Abd Manaf per Abu Ahmad al-Hakim). spouse Umm Kulthum bint Uqbah and ayat 9:79,
  9:100: only in ungraded or weak reports, left out. PACT_BROTHER: gap (mu'akhat). placeOfDeath البقيع: burial, gap.
- **saad-ibn-abi-waqqas**: deathYear 55 (Ibn Mandah; al-Mada'ini and Abu Ubaydah), 56 (Ibrahim ibn Sa'd), 58
  (Abu Nu'aym al-Mula'i). «وقيل: سنة سبع» is unreadable without its decade and is not modeled; the author's «والأول هو
  الصحيح» is not modeled either. Ayat 6:52, 29:8 and 31:15 are REVEALED_ABOUT (the book labels the verse العنكبوت ٨, the
  wording is Luqman 15, so both are linked). awwal-rami title: the entry gives it as Sa'd's own words, so it is a
  virtue, not a title. MATERNAL_UNCLE: gap; the «هذا خالي» report is not in this unit.
- **saeed-ibn-zaid**: deathYear 51 (al-Waqidi, Abu Ubayd, Yahya ibn Bukayr, Shihab), 52 (Ubaydullah ibn Sa'd al-Zuhri).
  placeOfDeath العقيق (Aisha bint Sa'd; Malik) and الكوفة (al-Haytham ibn Adi, whom the author calls شاذ; kept, attributed,
  rule 3). Badr: the author counts him among the Badris, and Urwah says he came from Sham after Badr and was given his
  share («وكذلك قال موسى بن عقبة، وابن إسحاق»). That is a virtue in Urwah's words, with Urwah as its one speaker
  (ADR 0020), not PARTICIPATED_IN badr.
  Wife «فاطمة أخت عمر» unidentified (no catalog person).
- **musab-ibn-umayr**: fullName same (the heading's «*» marker is left out by splitting the span). virtues: the catalog's
  «المقرئ / أول من جمع الجمعة» is not in this entry. MATERNAL_UNCLE: gap.
- **abu-salamah**: deathYear 3 (author), 4 (Abd al-Malik ibn Ubayd's report, with month Jumada II; the year is the
  report's own gloss «يعني: سنة أربع», kept on that report), 3 («وقيل»). PATERNAL_COUSIN of the Prophet ﷺ («وابن عمته»,
  as al-Zubayr's «ابن عمتي»). MILK_BROTHER: gap.
  The children (Salamah, Umar, Durrah, Zaynab, per Mus'ab al-Zubayri) are not catalog people, so not modeled.
- **uthman-ibn-mazun**: died Sha'ban 3 (author). Brothers come from Abd Allah's entry (SIBLING_OF there); as-Sa'ib's
  CHILD_OF comes from as-Sa'ib's entry. Badr comes from Abd Allah's entry («شهد بدرا هو وإخوته: عثمان، وقدامة»).
  «أول من دفن بالبقيع»: burial, gap.
- **qudamah-ibn-mazun**: wife Safiyyah bint al-Khattab unidentified (no catalog person). Children (Umar, Fatimah,
  Aisha) not catalog people. The wine episode and his removal from al-Bahrayn have no predicate; left out.
  «من أخوال حفصة وابن عمر»: maternal uncle, gap.
- **abdullah-ibn-mazun-al-jumahi**: mu'akhat with Sahl ibn Ubayd: gap.
- **as-saib-ibn-uthman**: Badr rests on three sayers (Ibn Ishaq, Abu Ma'shar, al-Waqidi, via Ibn Sa'd). Hisham ibn
  al-Kalbi's «الذي شهدها هو السائب بن مظعون» (Ibn Sa'd: وهم) has no predicate (a claim about another man); noted here.
  Mother Khawlah bint Hakim al-Sulamiyyah is left unidentified: the catalog's khawlah-bint-hakim is built from Siyar 2
  entry ٣٨, which does not tie her to Uthman ibn Maz'un, so the page does not make the identity certain.
  Died of a wound from al-Yamamah, year 12 (Ibn Sa'd). Mu'akhat with Harithah ibn Suraqah: gap.
- **abu-hudhayfah**: other name «مهشم» («فيما قيل», anonymous; al-Suhayli in the editor's note calls it an error).
  died.age 53 («قيل»). Catalog BROTHER musab-ibn-umayr is a catalog error: p166 says Abu Hashim ibn Utbah, his brother,
  «أخو الشهيد مصعب بن عمير لأمه». Abu Hashim is not a catalog person. Hind's poem: poems wait.
- **salim-mawla-abi-hudhayfah**: first name is the heading «سالم مولى أبي حذيفة»; «سالم بن معقل» is Musa ibn Uqbah's
  reading. His death year 12 comes from Abu Hudhayfah's entry («هو ومولاه سالم»). MAWLA and PACT_BROTHER: gap (and the
  mu'akhat report is munqati'). The adult-nursing ruling (Muslim) has no predicate.
- **al-kilabiyyah**: the heading gives «فاطمة بنت الضحاك بن سفيان» (also al-Waqidi's «قال بعضهم»). Other readings, each
  attributed: عمرة بنت زيد («قيل», and Ibn Ishaq), العالية بنت ظبيان, سناء بنت سفيان, عمرة بنت حزن (all «قيل»).
  Marriage to the Prophet ﷺ from Aisha's report. «كلابية واحدة أو جماعة» (al-Hakim) has no predicate. Ibn Shihab's
  al-Aliyah report is not tied to her (the catalog keeps al-aliyah as a separate person).
- **asma-bint-al-numan-al-kindiyyah**: name is the heading «الكندية» only (see weak reports above). Marriage to the
  Prophet ﷺ from Ibn Aqil (ungraded; the marriage itself is sound, in al-Bukhari, as the editor's note on p259 shows).
  Catalog fullName, father, appearance and al-Muhajir as spouse: unsupported by sound text. The app still titles her
  «أسماء بنت النعمان» from the catalog's `name`; that is for the main Tarajim thread to settle.

## Changes after the second-agent review

- Uthman ibn Maz'un: Ibn Abd al-Barr's sentence split into three virtues, the death clause left out; «أما هو فقد جاءه
  اليقين…» is the Prophet's ﷺ words, so its speaker is the Prophet ﷺ, not Umm al-Ala'.
- Al-Kilabiyyah: «عمرة بنت زيد» is two readings, one anonymous («قيل», p256) and one by Ibn Ishaq on his own words (p257).
- Sa'id: the Arwa report's sayer is Urwah, not «أبيه».
- Added: Abu Ubaydah PARTICIPATED_IN yarmuk (author, p22); Sa'd's virtue in Ali's words «ما سمعت النبي ﷺ يجمع أبويه
  لأحد غير سعد» (agreed upon, p100); Abu Hudhayfah SIBLING_OF Hind bint Utbah (Abu al-Zinad, p165).
- Not changed, noted: COMPANION_OF is given only where a sentence puts the person with the Prophet ﷺ; Badr shows once per
  source in the app's battle list (an app-side merge); general-praise virtues («السيد الكبير») may need a quiz skip
  list once the main thread adds one.

## Gaps (rule 9 and others)

- Former names (عبد عمرو / عبد الكعبة for Ibn Awf).
- Offsets that do not read as a year: Ibn Awf born «بعد عام الفيل بعشر»; Uthman ibn Maz'un «توفي بعد بدر»; Sa'id
  «ابن بضع وسبعين».
- Burial apart from death place: al-Baqi' (Ibn Awf, Uthman ibn Maz'un), Madinah (Sa'id).
- Milk brother (Abu Salamah), maternal uncle (Sa'd, Mus'ab, Qudamah), mawla (Salim), mu'akhat (Ibn Awf, Abd Allah ibn
  Maz'un, as-Sa'ib, Salim).
- Loose «ابن عمه» (Sa'd; Sa'id and Fatimah, Sa'id and Umar): not modeled as PATERNAL_COUSIN.
- Killed in battle: Mus'ab at Uhud, Abu Hudhayfah, Salim and as-Sa'ib at al-Yamamah. No predicate and no al-Yamamah
  event, so the deaths show as years and the battle in the virtue text only.
- Children who are not catalog people (Abu Salamah's, Qudamah's, Abu Hudhayfah's son Muhammad).
- Sound reports that are not virtues or ties (Sa'd's report on the Prophet ﷺ refusing Uthman ibn Maz'un's tabattul;
  Sahlah's nursing of Salim): no predicate.
- Material about Sa'id's father Zayd ibn Amr (pp. 126–135) belongs to Zayd's own profile; not converted here.

## Checks

- `npm run model:check`: 22 units (8 before, 14 added).
- `npm run model:app-people`: 22 people; no empty section, no «ص ٠–٠».
- `npx vitest run shared/ src/lib/model`: 146 files, 1,240 tests pass.
