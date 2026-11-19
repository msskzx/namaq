# Batch 15: Siyar v6, entries 39–57

Units: `units/siyar-v6-39-baraa.json` … `units/siyar-v6-57-wathilah.json` (18 people, printed pages 194–387).
Source: Risalah edition, store pages `data/history/sources/siyar-alam-al-nubala-risalah/v6/195–387`, read with the
editor's footnotes. Scripts that build the units: `/mnt/project-files/tarajim-app/conversion/batch15/*.py`.

Entry 56, the Kufan poet «عبد الله بن الزَّبير الأسدي», is **not converted**. The author gives him only «ذكرته
للتمييز»: no companionship, no date, no virtue. In the app his name would read «عبد الله بن الزبير» next to Ibn
al-Zubayr, and the quizzes would offer him as a choice that reads like the right answer.

Printed page 240 does not exist on Shamela (the text runs 239→241). It is listed in `source.json` under
`skippedPrintedPages`, and the coverage check now reads past a skipped page. Entry 56's heading is printed
«٥٦ -عبد» with no space after the dash; the coverage check now accepts that too, so entry 55 ends there.

## Classified diff (`npm run model:diff -- <slug>`)

Only al-Bara', al-Hasan and al-Husayn have catalog entries. The other 15 are new, so every value is
**different by addition** and rests on a quoted span on its page.

These differences come up for every person, so they are listed once:

- `fullName`: **different by rule**. The model keeps the book's vowelled heading and the nasab line that continues it.
  A nisba in the middle of the heading stays out of `name.full` (Ibn Umar «العدوي», Ibn al-Zubayr «الأسدي»).
- `titles: companion`: **unsupported in the text as a title**. Where the entry names the Prophet ﷺ, it is a
  `COMPANION_OF` tie (ADR 0025).
- Every `model-only` row (kunyas, virtues, battles, dates, ties) is **different by addition**.

Per person:

- **al-Bara' ibn Azib**: `sex` same. Death 72 (author) and 71 («وقيل») both kept. Too young for Badr is `ABSENT_FROM`.
- **Abdullah ibn Yazid al-Khatmi**: «أحد من بايع بيعة الرضوان» stays on the page and out of the virtue quiz (shared
  by about 1,400). His age «نحو من ثمانين» is approximate and not modeled.
- **al-Rubayyi' bint Mu'awwidh**: the Prophet's visit on her wedding morning is the author's line (the wedding report is
  in al-Bukhari, p199).
- **Zaynab bint Abi Salamah**: «ربيبة النبي» stays out of the virtue quiz (her brother Umar shares it). The subject of
  her ties is the heading mention, not the kin word «ربيبة».
- **Abd al-Rahman ibn Abza**: Nafi''s «عالم بالفرائض، قارئ لكتاب الله» (Muslim 817) stays out of the quiz (general
  praise).
- **Abu Juhayfah**: the name is «وهب بن عبد الله» («واسمه»), with the kunya from the heading. Death 74 is «والأصح».
- **Abdullah ibn Umar**: left out as unsound: Badr through Ali ibn Jud'an (weak); Mujahid's «شهد ابن عمر الفتح»
  (Mujahid was born after it, no grade); Ibn Mas'ud's «إن من أملك شباب قريش» through Ibrahim (broken, no grade).
  Salim's «عن أبيه» names Ibn Umar himself, so the sayer of «نعم الرجل عبد الله» reads as him. Every death year
  (73, 74) and age (84, 87, 85) keeps its sayer.
- **al-Dahhak ibn Qais**: four kunyas (one from the author, three «وقيل»). His sister is left out (the speaker is
  unclear). No death year: al-Waqidi's «سنة أربع وستين» dates the battle of Marj Rahit and does not name him.
- **al-Hasan ibn Ali**: «سيد شباب أهل الجنة» is a virtue from Abu Sa'id (p251, «صححه: الترمذي»), said of both
  brothers, so it is modeled here for each of them and kept out of the quiz (the author also gives it in his heading,
  p246). The catalog's «caliph» title is not modeled (`office` is not shown yet). His mother rests on Abu Rafi'
  (al-Haythami: «حديث حسن») and his brother on Usamah's «هذان ابناي وابنا بنتي» («وحسن الترمذي»); Ikrimah's
  unwitnessed report of the naming is left out. Abu Nu'aym al-Mula'i's 58 is **DISPUTED**: the author says
  «وغلط». The resemblance to the Prophet ﷺ stays out of the quiz, since al-Husayn's entry says it of him too.
- **al-Husayn ibn Ali**: «هما ريحانتاي» (Ibn Umar, al-Bukhari 3753) and Anas's «أشبههما» stay on the page and out
  of the quiz (said of both brothers). «سيدا شباب أهل الجنة» through al-Harith (weak) is left out; the sound report
  is in al-Hasan's unit. His age is not stated.
- **Abdullah ibn Hanzalah**: his death at al-Harrah has no catalog event and no year in his own statement.
- **Salamah ibn al-Akwa'**: Mu'tah is «قيل», kept anonymous. «خير رجالتنا: سلمة» is reported by Salamah himself
  («عن أبيه» in Iyas's words).
- **Abdullah ibn Abbas**: died 68 (Ibn al-Madini; al-Waqidi, al-Haytham and Abu Nu'aym) or 67 (Ibn al-Madini).
  «سنة ثمان» is printed without its decade. The units span is kept as printed, and the decade comes from «سبع وستين»
  in Ibn al-Madini's sentence (`decadeFrom`, GUIDE rule 16). His daughters Lubabah and Asma are left out (no «بنت»).
  His birth «قبل عام الهجرة بثلاث سنين» is not modeled.
- **Abu Umamah al-Bahili** (new): the name «صدي بن عجلان بن وهب…» rests on Khalifah (p359–360), and the kunya on the
  heading. Two virtues: the house that was always fasting (Raja' ibn Haywah, the editor: «سند صحيح») and his mission to
  Bahilah (the editor: hasan, al-Haythami: «إسناد الأولى حسن»). Left out: «وروي: أنه بايع تحت الشجرة» (anonymous,
  ungraded), «لا تقوموا» (two unknown narrators), the 300 dinars (an unknown mawlah) and the talqin hadith (al-Haythami:
  unknown narrators). Death 86 (al-Mada'ini and others) and 81 (Isma'il ibn Ayyash) both kept.
- **Abdullah ibn al-Zubayr** (new): name and two kunyas (author); father al-Zubayr from the heading; mother Asma'
  from Ibn Abbas's words (al-Bukhari 4665); brother Urwah and sons Amir and Abbad from the author. Companionship and
  the pledge at seven rest on Asma''s report (Muslim 2146, the author: «إسناده قوي»). Al-Yarmuk rests on Urwah in
  al-Bukhari. «عائذ بيت الله» is a laqab from Mus'ab ibn Abdullah. Virtues: first child born to the Muhajirun in Medina
  (author), the pledge at seven, and Ibn Abbas's «قارئ لكتاب الله» and «عفيف في الإسلام» (two virtues, both out of the
  quiz as general praise); copying the mushafs (al-Bukhari) is out of the quiz, since four men share it. Died Jumada
  al-Akhirah 73 (Ibn Ishaq and others). Damrah and Abu Nu'aym's 72 is **DISPUTED** by the author's «ووهم», and its
  decade comes from «سنة ثلاث وسبعين» (rule 16).
  Left out: his birth year (the author gives 2 and «وقيل» 1; the date reader cannot read «إحدى» alone, and keeping
  only 2 would pick a side); his caliphate (the author says some scholars do not count him, and `office` is not shown yet); the ungraded
  worship and appearance reports; the «يلحد بمكة» hadith (the author: «في إسناده مقال»); Ibn Umar's words at the
  cross (weak chain in the text; the editor gives the Muslim 2545 wording only in a footnote); «نيفا وسبعين» as his age.
- **al-Mundhir ibn al-Zubayr** (new): name, kunya, father; his daughter Fatimah bint al-Mundhir (author). Killed
  during the siege of 64, from Mus'ab ibn Uthman through al-Zubayr ibn Bakkar. Age 40 (author). «أحد الأبطال» is out
  of the quiz.
- **Abdullah ibn al-Zubayr ibn Abd al-Muttalib** (new): father al-Zubayr ibn Abd al-Muttalib, mother Atikah bint Abi
  Wahb (author). Ajnadayn rests on Abu al-Huwayrith through al-Waqidi (maghazi). His death year is the battle's date
  only, so it is not modeled. No companionship line names the Prophet ﷺ.
- **Wathilah ibn al-Asqa'** (new): the other line «واثلة بن الأسقع بن عبد العزى بن عبد ياليل بن ناشب» is a
  `name.variant` («وقيل», rule 13). Four kunyas: two the author lists, two «وقيل». Tabuk (author). Companionship and
  Ahl al-Suffah from his own report (the editor: «رجاله ثقات»); the Suffah line is out of the quiz. «وأنت من أهلي»
  (the author: «حسن، غريب»). Death 83 at 105 (Sa'id ibn Khalid, «اعتمده البخاري») and 85 at 98 (Abu Mushir and others).
  Qatadah's «آخر من مات من الصحابة بدمشق» is ungraded and left out.

## Checks

- `npm run model:check`: 221 units (203 on main + 18).
- `npm run model:app-people`: re-run; 18 new people, none with an empty section or «ص ٠–٠».
- `npx vitest run shared/ src/lib/model`: all pass.
- Second-agent review: all must-fix items applied (unsound reports dropped or moved to graded ones, sayers fixed,
  value spans trimmed, stale quiz-skip keys removed). Left for the main Tarajim thread: facts from historians who give
  no chain (Ibn al-Athir's office for Ibn Abza, Ibn Asakir's battles for al-Dahhak, Abu Ishaq's description of Ibn
  Umar), and the kunya-only headings (Abu Umamah, Abu Juhayfah) named by «واسمه» as earlier batches did.
- Quiz read: kunya, laqab, tie and virtue questions for the 18 people read by hand. Shared virtues are in
  `virtueQuizSkip.json`.
