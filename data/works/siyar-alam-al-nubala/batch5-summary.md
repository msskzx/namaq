# Batch 5: what the 24 entries state and what they do not

Units: `units/siyar-v5-*.json` (Siyar v5, Risalah third edition, witness
`siyar-alam-al-nubala-risalah`). Every value cites its page anchor. Built with
the scripts in the project's `tarajim-app/conversion/batch5/` folder.
Diffs: `npm run model:diff -- <slug>`.

Classes, as in `summary.md`: **same**; **by addition** (the model holds more,
each piece sourced); **by rule** (the catalog value folds in quoted speech,
someone else's words, or a value the entry does not state); **unsupported**
(the catalog holds something this entry does not say).

## Store pages refetched

The store copies of v5 pages 109, 223, 255, 256 and 260 stopped part way.
They are now the full Shamela pages (book 10906, page id = printed page +
1980), body and notes. Pages 257, 258 and 259 were missing and are added.
Page 109 now holds entry ١٥ (Yazdagird), which closes al-Hakam's bounds in
the coverage test.

## Per person

- **Suhaib**: kunya, parents, death place and the age views are by addition:
  أبو غسان next to أبو يحيى, mother سلمى بنت قعيد, three attributed ages,
  month Shawwal. Titles: `companion` unsupported as a title.
- **Abu Talha**: death year 34 plus the attributed 32 and 51 (by addition);
  the sea death place is by addition. `ayat` and `companion` are unsupported in this entry.
- **Abu Bardah**: name is «هانئ» with the heading's nasab; the kunya stays
  out of the name. Death year 42 (an unnamed «وقيل» view) is by addition.
- **Jabr ibn Atik**: the catalog death year is unsupported; the author gives
  that date to Jabir, not Jabr. Left out (open question 1).
- **Al-Ash'ath**: office, age and REVEALED_ABOUT by addition. The catalog's
  «فكفّر عن يمينه» virtue is quoted narrative about a dispute, not praise,
  so it is left out by rule.
- **Hatib**: father is `amr-ibn-umayr-al-lakhmi`. The catalog kunya
  «أبي بلتعة» is his father's kunya, not his own (unsupported).
- **Abu Dharr**: brother Unays, Badr absence and the battles he joined are by
  addition. Appearance and virtues keep the author's words.
- **Umayr ibn Sa'd**: the laqab «نسيج وحده» (stated twice, both kept) and his governorship of Damascus and Hims for Umar are by addition.
- **Abu Sufyan**: name starts at «صخر». The catalog spouses and relations are
  not stated in this entry (unsupported here). Death in Medina in 31 (author, same as
  the catalog) and 32 (an unnamed «وقيل», by addition; the value reads the decade from
  the line before). The «ثلاث أو أربع وثلاثين، وله نحو التسعين» view is open question 2.
- **Al-Hakam**: kunya same (the catalog prints the accusative «أبا مروان»).
  Cousinship with the Prophet is by addition.
- **Khadijah**: mother Fatimah bint Za'idah, husbands Abu Halah and Atiq,
  laqab «الطاهرة» (al-Zubayr ibn Bakkar), death three years before the hijra
  (Qatadah, with Urwah and al-Waqidi), and age 65 (anonymous) are by addition.
- **Fatimah bint Asad**: Ali is her son. The virtues are al-Zubayr ibn
  Bakkar's words, attributed to him.
- **Fatimah bint Muhammad**: name as the entry prints it, with «فاطمة».
  Kunya «أم أبيها», death in Ramadan, year 11 (Sa'id ibn Ufayr): by addition.
  Ages 28 (al-Baqir) and 29 («قيل») are DISPUTED: the author's own view, «أربعا أو
  خمسا وعشرين» with «والأول أصح», is a source of both. Her mother is stated twice and
  both sources are kept.
- **Umm Ayman**: name «بركة», her kunya, and the husbands Ubayd and Zayd, with
  their sons Ayman and Usamah.
- **Hafsa**: husband Khunays, brother Abd Allah, and the line about 66:4 are
  by addition. Death year 41 (author) and 45 in Medina (al-Waqidi) are both kept.
  The catalog's 66:5 is unsupported here.
- **Safiyyah bint Huyayy**: husbands Sallam, Kinanah and the Prophet. She died in 36 or 50,
  both «قيل», and both are kept.
- **Maymunah**: sister Umm al-Fadl and two earlier husbands are by addition.
  She died at Sarif (Ata') or in Mecca («قيل»), in 51 (Khalifah) or 61 at 80 (al-Waqidi). The author answers al-Waqidi at once
  («لم تبق إلى هذا الوقت، فقد ماتت قبل عائشة»), so 61 and 80 are DISPUTED and his
  answer is a source of both.
- **Umm Shareek**: name, kunya and sex from the heading. The catalog virtues
  are quoted reports about marriage, so they are left out by rule.
- **Sana'**: her marriage to the Prophet comes only in Abu Ubayd's «زعم»
  report and stays attributed to him. Her other name, «سناء بنت سفيان الكلابية», is a «قيل» view.
- **Qutaylah**: her brother is al-Ash'ath (heading and «يقال»). Abu Ubaydah reports her marriage
  to the Prophet, and it stays his attributed report. Urwah's denial of a marriage to
  «أخت الأشعث» («ما تزوجها قط», p258-259) is printed in entry ٣٦ (al-Kindiyyah), outside
  this entry's bounds, so this unit cannot cite it (open question 9). The catalog parents and companionship are only implied
  (open question 6).
- **Khawlah bint Hakim**: same on all stated fields; the author's «فأرجأها»
  gives the marriage.
- **Juwayriyah**: appearance (author), husband Musafi (Ibn Sa'd), Aisha's
  «بركة» line, and death in 50 (author) or 56 («قيل»).
- **Sawdah**: husband al-Sakran by addition. She died in Medina (author). Shawwal 54 (al-Waqidi's chain) is
  DISPUTED: the author puts her death at the end of Umar's caliphate and Sa'id ibn
  Abi Hilal «زمن عمر» (editor: «رجاله ثقات»); both are sources of it.
- **Arwa**: everything rests on Ibn Sa'd («روى هذا: ابن سعد»). Husbands
  Umayr ibn Wahb and Artah; children Tulayb and Fatimah. The parents are
  implied, not stated (open question 6).

Across the batch the `companion` title is catalog only: these entries never
state it as a title, as in `summary.md`.

## Virtues kept out of quizzes

`shared/data/tarajim/virtueQuizSkip.json` gains 20 entries. Each one is praise
that several companions share, such as «من الرماة», «من السابقين», «من
المهاجرات الأول» or «سيدة نساء العالمين في زمانها», so a "who is this?" quiz
would have more than one right answer. Each entry gives its reason.

## Open questions

1. Jabr's death date: al-Dhahabi gives it to Jabir; nothing is assigned to Jabr.
2. Abu Sufyan's «وقيل: سنة ثلاث أو أربع وثلاثين، وله نحو التسعين» is two years in one
   view and an approximate age, so it has no value yet.
3. Fatimah's age: the author's own view «أربعا أو خمسا وعشرين» (he calls it the sounder,
   «والأول أصح») is two numbers in one view, so it stands as the counter-statement of 28
   and 29 with no value of its own. Sa'id's «سبع وعشرين أو نحوها» is left out as well.
4. Ties with no predicate yet: maternal aunt (Maymunah), burial places,
   brotherhood pacts, a month with no year.
5. Two «حسبك/أفضل نساء أهل الجنة» virtues (Khadijah p117, Fatimah p124) are the
   Prophet's words («مرفوعا»), but the text names no word for him in the chain, so the
   unit's speaker is the Companion (Anas, Ibn Abbas). Suhaib's «سابق الروم» wording is
   from al-Hasan's mursal (editor: «إسناده ضعيف لإرساله»); it is kept because the author
   adds «بإسناد جيد من حديث أبي أمامة». Khadijah's mother and first husbands (p111) follow
   «قال الزبير بن بكار» and may be his words rather than the author's.
6. Arwa's and Qutaylah's fathers are implied by their names, not stated.
7. Old names changed by the Prophet («برة») are not modelled.
8. New people slugs not yet in the catalog: the sira and kin people named
   above (for example `fatimah-bint-zaidah`, `abu-halah-ibn-zurarah`,
   `atiq-ibn-abid`, `muhsin-ibn-ali`, `tulayb-ibn-umayr`).
9. Qutaylah's marriage: Urwah's denial sits in entry ٣٦ (al-Kindiyyah, batch 1). Once
   that unit carries it, the tie should become DISPUTED with both sources.
