# Siyar batch 2: v4 entries 16 to 37 (pages 185 to 241)

Units: `units/siyar-v4-16-aqil-bukayr.json` to `units/siyar-v4-37-ibn-rawahah.json`, 21 entries (entry 34, Ja'far ibn
Abi Talib, was converted in the pilot). Scripts: `/mnt/project-files/tarajim-app/conversion/batch2/`.
Source: Risalah third edition, witness `siyar-alam-al-nubala-risalah`, read page by page with the editor's footnotes.

## Store pages

- Added `241.md` and `241.notes.md`, which were missing; the coverage test needs the pages continuous to the end of entry 37.
- `240.md` now runs to the start of «فصل: شهداء يوم الرجيع», and `202.notes.md`, `230.notes.md`, `240.notes.md` were
  refetched from Shamela where they were cut short. Other pages are unchanged, so earlier anchors stay stable.

## Rules applied across the batch

- **Ibn Sa'd's paragraphs.** After «قال ابن سعد» a paragraph is his until al-Dhahabi's «قلت». Used for Khalid, Iyas and
  Amir ibn al-Bukayr; Aqil ibn al-Bukayr's Badr and age sentence goes to Ibn Sa'd as the editor's note says.
- **Two full names, both kept, attributed.** Aqil ibn al-Bukayr (the author's, and Ibn Sa'd's «عاقل بن أبي البكير»
  line); Abu al-Haytham («قاله جماعة», and the Aws line from Abdullah ibn Muhammad ibn Umarah); Abu Sufyan ibn
  al-Harith (al-Mughirah per the author, Ibn al-Kalbi and al-Zubayr; «طائفة» say his name is his kunya). The app shows
  only the first; reported to the main Tarajim thread.
- **Anonymous «قيل» kept as REPORTED_ANONYMOUS:** Abdullah ibn Suhail's al-sabiqoon title and first hijra; Nawfal's
  death in 20 and in 15; Abu Sufyan's death in 20 at Madinah; Abu al-Haytham's death in 20 («غيره»).
- **Dying in a battle** is PARTICIPATED_IN that battle when the battle is in the event catalog, not `died.place`, as in
  the pilot (Ja'far, Hamzah). Where the book names a town (al-Baraa at Tustar, Abu Jandal in al-Urdunn), that town is
  `died.place`.
- **Mushrikin at Badr** (Suhail, Nawfal, Aqil ibn Abi Talib) are not given PARTICIPATED_IN badr: the predicate has no side.
- **Weak or mursal reports left out** (editor's notes): Abu al-Haytham's «المستشار مؤتمن»; al-Waqidi's description of
  Zayd as short and dark; Abu Sufyan's «سيد فتيان أهل الجنة» and «خلفاً من حمزة»; Aqil's «أحبك حبين»; Ibn Rawahah's
  Ahmad hadith, Ibn Abi Layla's mursal, Urwah's report on the al-Shu'ara' verse and the poems; al-Baraa's Tustar story.
- **Gradings recorded for what was kept:** al-Baraa «لو أقسم على الله لأبره» (al-Hakim sahih, al-Tirmidhi 3853 hasan
  sahih); Jabalah's report on Zayd (al-Tirmidhi 3817 hasan, al-Hakim sahih); «أنت مولاي» (al-Hakim sahih, Ibn Hajar
  hasan); Zayd's imarah (al-Bukhari 3730, Muslim 2426); Aisha via al-Bahi (al-Nasa'i, hasan); Buraydah (al-Dhahabi
  «إسناده حسن»); Abu al-Darda's fasting report (al-Bukhari 1945, Muslim 1122); Ibn Rawahah's two rak'ahs (Ibn Hajar,
  sound chain); Abu Jandal at Hudaybiyah (al-Bukhari 2700); Zayd and 33:5 from Ibn Umar (al-Bukhari 4782, Muslim 2425).
- **Left out of virtues on purpose:** shared or generic lines where a wrong quiz choice could also be right («ما شهد
  بدراً إخوة أربعة سواهم», idol-breaking with Abu Burdah, the killers of Ka'b ibn al-Ashraf as a virtue), and Nawfal's
  «كان أسن بني هاشم في زمانه» (a fact, not a virtue; al-Abbas was later the eldest too).

## Gaps the model does not cover (left out of the units)

- Pact brotherhood (المؤاخاة), uncle, milk brother, former name (Aqil ibn al-Bukayr was غافل).
- Suhail's death: Yarmuk per al-Mada'ini, the Amwas plague per al-Shafi'i and al-Waqidi, with no year; no predicate fits.
- Events not in the catalog: al-Yamamah, al-Raji', Fath Misr, Bay'at al-Ridwan («تحت الشجرة»), al-Aqabah. These
  mentions stay unidentified.
- Approximate ages («نحو من سبعين»).
- Ja'far ibn Abi Sufyan's «صحبة» (p205, Ibn Sa'd): COMPANION_OF needs a mention of the Prophet ﷺ, and the line has only
  a pronoun («معه»).
- Sa'id ibn al-Harith: al-Dhahabi says only al-Hakim names him among the Companions. The entry is converted as printed
  (name and nasab only).

## Classified diff (`npm run model:diff -- <slug>`)

Common to all 21: catalog `titles: companion` is **unsupported in the text** as a title (no entry states it); the
model's extra PARTICIPATED_IN, SIBLING_OF and cousins rows are **different by addition**, each on its span. Catalog
`placeOfDeathArabic` for a battle death (Yamamah, al-Raji', Mu'tah) is **different by rule** (PARTICIPATED_IN instead).
Catalog `fullName` values that end in a nisba the heading lacks, or stitch the heading to a later line, are **different
by rule** (name exactly as printed). Catalog `virtues` that fold quoted speech or weak reports into one value are
**different by rule** (one virtue, one speaker; weak reports out).

- **aqil-ibn-al-bukayr**: fullName different by addition (second, Ibn Sa'd's); virtues catalog-only by rule (former
  name and a shared Badr line); died.age 34 by addition (Ibn Sa'd); pact brother is a gap.
- **khalid-ibn-al-bukayr**: died.month 2 (Safar) and died.age 34 by addition, on the same Ibn Sa'd statement as year 4;
  al-Raji' place by rule (event unidentified, gap); pact brother gap.
- **iyas-ibn-al-bukayr**: Fath Misr mention unidentified (gap); pact brother gap. Otherwise same.
- **amir-ibn-al-bukayr**: al-Yamamah by rule and gap; pact brother gap.
- **mistah-ibn-uthathah**: fullName by rule (nisba «المطلبي» is not part of the nasab line); died.age 56 by addition.
- **abu-abs**: fullName by rule (catalog has «الأوسي» twice, out of order); the model's name ends «واسمه عبد الرحمن»
  (pp188-189), so his ism shows; died.age 70 by addition; Ka'b ibn
  al-Ashraf's killing as PARTICIPATED_IN by addition.
- **abu-al-haytham-ibn-at-tayyihan**: fullName by addition (two attributed lines); death in 20 rests on «غيره» and
  al-Waqidi's «هذا أثبت عندنا»; the report he answers, «أنه قتل بصفين مع علي», is kept as a DISPUTED
  PARTICIPATED_IN siffin with both statements; virtue «يكره الأصنام» by rule (al-Waqidi's
  word on the Jahiliyyah, with no chain; left out); pact brother gap.
- **abu-jandal**: fullName same name, the model keeps the kunya the heading prints first; death place «الأردن» same,
  «طاعون عمواس» is the cause, not the place (by rule); virtue different by addition (the whole author sentence); the
  half-brother tie is a gap.
- **abdullah-ibn-suhail**: titles different (al-sabiqoon, attributed to «قيل»); virtues by rule; Yamamah by rule;
  died.age 38 by addition; first hijra to Abyssinia by addition (attributed).
- **suhail-ibn-amr**: death place catalog-only, a gap (two attributed opinions, no year); virtues different by addition
  (three, the third from al-Zubayr ibn Bakkar).
- **al-baraa-ibn-malik**: fullName by rule; virtues by rule (weak and quoted lines out; two kept with gradings);
  COMPANION_OF the Prophet ﷺ by addition; «تحت الشجرة» unidentified (gap); Anas as SIBLING_OF by addition.
- **nawfal-ibn-al-harith**: fullName and kunya same (the catalog lacks the final vowel); death year 20 or 15, both
  attributed (by addition); virtues by rule («أسن» left out); cousin of the Prophet ﷺ by addition.
- **al-harith-ibn-nawfal**: office (Makkah for Umar and Uthman) by addition; the catalog's virtue is the same line, now
  an office, by rule.
- **abdullah-ibn-al-harith-ibn-nawfal**: death year 84 or 83, both attributed; mother Hind bint Abi Sufyan by addition
  (new slug `hind-bint-abi-sufyan`, sex FEMALE); laqab «ببة» by addition; office at Basra by addition.
- **abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal**: death place same (الأبواء; the catalog wraps the sentence);
  virtue catalog-only by rule (Ibn Sa'd's «ثقة» is a rijal grade, not a virtue).
- **saeed-ibn-al-harith**: same apart from titles.
- **abu-sufyan-ibn-al-harith**: fullName by addition (two attributed); virtues by rule (two weak reports out; Hunayn
  kept); milk brother gap; Nawfal and Rabi'ah as siblings by addition.
- **jaafar-ibn-abi-sufyan-al-hashimi**: fullName as printed after «ولـ», in the genitive (by rule); Hunayn by addition.
- **aqil-ibn-abi-talib**: fullName as printed in the heading (by rule); no kunya (p218 «ويزيد وبه كان يكنى» names
  the son; the one «يا أبا يزيد», p219, is mursal); each of the eight children rests on a span with that child's name; virtue «أحبك حبين» out (weak); Mu'tah by addition; the Ja'far brother tie comes
  from the pilot side.
- **zaid-ibn-harithah**: fullName by rule; appearance different (al-Waqidi's short and dark is weak; the sound report
  says very white); virtues by rule, nine kept each with its speaker («سيد الموالي» and «أسبقهم إلى الإسلام» split); father Harithah ibn Sharahil by addition (new
  slug); ABOUT_AYAH 33:37 and REVEALED_ABOUT 33:5 by addition (33:5's sayer is shown as the chain «سالم، عن أبيه»: the book
  never names Salim's father here); died.month 5 (Jumada al-Ula) and age 55 by addition;
  Mu'tah by rule; son Usamah same (from the p222 sentence).
- **abdullah-ibn-rawahah**: fullName by rule; kunyas same (three, as printed); virtues by rule (four kept); Abu
  al-Darda as SIBLING_OF (Qutaybah: «أخوان لأم») by addition; al-Aqabah unidentified (gap); Mu'tah by addition, on al-Tirmidhi's line (p235) and al-Dhahabi's «بل مؤتة بعدها بستة
  أشهر جزماً» (p236), which rejects the order of events, not the death.

## Second-agent review

An independent agent reviewed every script against pages 185-241 and their notes. Fixed from its must-fix list: people.json
regenerated after the last unit change; Aqil ibn Abi Talib's false kunya dropped and each child given its own basis
span («سعيد» without the «و»); Abu Abs's ism added; Zayd's 33:5 sayer no longer shown as «أبيه»; Abu al-Haytham's
Siffin counter-report kept as disputed; Zayd's two epithets split; Rabi'ah's basis now names him. From its suggestions:
Ibn Rawahah's Mu'tah also rests on al-Dhahabi's own line. Kept as is: Abu Jandal's virtue stays the whole author
sentence (trimmed to «كان من خيار الصحابة» it would fit many Companions, and a quiz choice could also be right).
