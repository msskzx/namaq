# Sira stories: plan for more, sound ones only

Status: plan for owner review (2026-11-20). No data is extracted until the owner says go
(owner, 2026-11-19: no more data parsing until told).

## What we have today

Eleven stories, each an ordinary event in `data/catalog/events/` with `reports`:
Dimad, Utbah and Fussilat, al-Walid and al-Muddaththir, Abu Dharr, Abd Allah ibn Salam,
Jubayr hears al-Tur, the islam of Umar, the jinn hear the Quran, the night of the jinn,
the jinn of Nasibin, the ifrit in the prayer.

Each report is stored whole, exactly as the book prints it:

- `isnad`: the chain as printed, just before the text.
- `source`: book pages (al-Dhahabi's al-Sira in the Siyar) or one hadith number (Sahih al-Bukhari).
- `grading`: the source's own words placing the report, copied as printed (for example «أخرجه مسلم»).
  None when the source says nothing; a Sahih hadith needs none, the book is the grade.
- `moments`: the text split into short pieces with our title and the people in each.
  Joined back together they must equal the book's text (`data/catalog/events/stories.test.ts`).
- On the event: `people`, `tags` (إسلامهم، سمعوا القرآن، من كلامه ﷺ، فيمن نزلت), and `ayat` recited,
  each ayah with a quoted piece of evidence.

The gate so far has been: a report is used only if it is in one of the two Sahihs, or al-Dhahabi says
one of them has it. Stories that had only Ibn Ishaq's report were left out (al-Tufayl, Hamzah, Salman).
Al-Dhahabi's Sahih-placed reports in al-Sira volume 1 are mostly used up through page 162.

## The idea in one line

Take the stories straight from the sira chapters of the two Sahihs, which the app already holds whole
(`data/hadith/sahih/bukhari.json`, `muslim.json`, built and checked by `scripts/hadith/`), then add
al-Dhahabi's graded reports as second tellings.

## Sources, in order

| Rank | Source | What makes it teachable | Role |
|---|---|---|---|
| 1 | Sahih al-Bukhari: kitabs 63 مناقب الأنصار (3776–3948), 64 المغازي (3949–4473), and the story hadith in 61 and 62 | The book itself | Main story text |
| 1 | Sahih Muslim: kitabs 33 الجهاد والسير (1730–1817), 44 الفضائل, 45 فضائل الصحابة, and story hadith elsewhere (for example 832, 121) | The book itself | Main story text |
| 2 | al-Dhahabi, al-Sira (Siyar, volumes 1–2, already stored) | His own words: «أخرجه البخاري/مسلم»، «متفق عليه»، «إسناده صحيح» | Second telling, or a story the Sahihs lack |
| 3 | Zad al-Ma'ad (Ibn al-Qayyim) | Mostly no chains | Order and dates of events only, not story text, unless he names a Sahih |
| 4 | Graded by a later scholar: al-Sira al-Nabawiyya al-Sahiha (Akram al-Umari), Ibn Kathir's grading in al-Bidaya | Their stated verdict | Only if the owner agrees (question 2) |

Not used for story text: Ibn Ishaq, al-Waqidi or anyone else without a connected chain, unless a
rank 1 or 2 source places that very report.

## How grading is checked and cited

1. A Sahih hadith: the source line is the book and number (for example «صحيح البخاري، رقم ٤٣٩٢»), linked to sunnah.com.
2. A book report: `grading` holds the author's own words, copied, and the test checks they follow the
   report on the page. No grading words of ours, ever.
3. A report whose source says nothing, or says weak (ضعيف، منكر، مرسل), is not used.
4. The reviewer opens the page or hadith and confirms the grade before the story is accepted.

## Where reports differ

Both are kept whole, each under its own chain, the fullest first and the others folded, as Abu Dharr's
story does today (Ali leads him in one report, he finds the Prophet himself in the other). We never
blend two reports into one text. If a scholar reconciles them, his words are added as a report of their
own, as al-Dhahabi's are on the jinn. Disputed dates go on the event attributed («قيل … عند فلان»),
and a quiz on them has one right answer holding every reading. Two sound sources that disagree are not
an error to fix (R0015).

## What counts as a story

A hadith is a story when it tells something that happened, with people and a sequence: an islam, an
encounter, a battle scene, a sign. A ruling, a short virtue, or a list of names is not, even if it sits
in a sira kitab. Short is fine: Bukhari 4392 is only a few lines (al-Tufayl asks, the Prophet prays for
Daws) and it is the sound part of al-Tufayl's story we had to leave out before.

When the same story comes under several numbers, the fullest is the main report and the others are
folded under it, each whole. A story that belongs to an event we already have (Badr, Hudaybiyyah, the
hijra, the death of Abu Talib) is added to that event; we check the slug exists before writing a file.

## Batches

Each batch: one agent triages every hadith in the range (story or not, which event, which tags) and
writes the stories; a second agent re-reads every report against the book and the grade. With the test
green and the second agent's sign-off, the batch merges without waiting for the owner (standing rule for
data). Each batch is one PR with the triage list in it.

| Batch | Range | Examples (numbers checked against our copy) |
|---|---|---|
| 0 | Code only | Muslim as a report source; the test reads the built Sahihayn instead of separate hadith files |
| 1 | Makkah: Bukhari 3851–3896, Muslim 832, 121 | Uqbah and Abu Bakr «أتقتلون رجلا» (3856), Abu Bakr's islam (3857), Sa'd's (3858), Sa'id ibn Zayd (3862), death of Abu Talib (3884), Aqaba (3893), Amr ibn Abasah (Muslim 832), Amr ibn al-As (Muslim 121) |
| 2 | Hijra and Madinah: Bukhari 3897–3948 | the hijra (3905), Suraqa (3906), arrival in Madinah, Salman «من رب إلى رب» (3946–3947) |
| 3 | Badr to Uhud: Bukhari 3949–4085, Muslim 1763, 1779, 1800 | the two youths and Abu Jahl (3988), Umar's account of Badr (Muslim 1763), Wahshi and Hamzah (4072) |
| 4 | Khandaq to Khaybar: Bukhari 4097–4249, Muslim 1783–1808 | Jabir's food at the trench (4101), Hudaybiyyah, Dhu Qarad (Muslim 1807) |
| 5 | Fath to the end: Bukhari 4274–4473, Muslim 1775, 1780 | the conquest of Makkah (Muslim 1780), Hunayn (Muslim 1775), Thumamah (4372), al-Tufayl (4392), Ka'b ibn Malik (4418) |
| 6 | al-Dhahabi, al-Sira v1 after p162 and v2 | Second tellings he places in a Sahih or calls sound |

Rough size before triage: 60 to 80 stories across batches 1–5. This is a guess; the triage lists will
give the real count.

Every story shows where stories already show: its own page, «قصص السيرة», the «حياته» of each person in
it, the feed card, and the sira quiz kinds. Nothing new to build on screen for this plan, on the app or
the website.

## Owner's answers (2026-11-22)

1. «حسن» is enough when the source itself grades it so, for example al-Dhahabi's «إسناده حسن» or
   al-Tirmidhi's «حسن صحيح». The card shows the grader's own words.
2. A later scholar's verdict does not make a report teachable, not for now. The Sahihs and al-Dhahabi come first.
   Salman's long story waits.
3. Long stories (the Ifk, Ka'b ibn Malik, Salamah at Dhu Qarad) are told whole. Their feed card shows one
   moment or a preview, and a tap opens the whole story.
4. Signs of prophethood (Jabir's food, the split moon) get a tag, but in a scholar's words, not ours.
   The tag is al-Bukhari's own chapter heading «علامات النبوة في الإسلام» (Sahih al-Bukhari, Kitab al-Manaqib,
   the chapter before hadith 3571), and its reference names him. A story takes the tag only when its source
   files it under such a chapter.

## Tests for new stories

These notes come from the test audit (2026-11-22) and apply to every batch:

- Don't add a test file for one story or one person. Don't pin hand-typed values, such as counts or
  "exactly 3 citations".
- Rely on the general checks that already run over every story: `data/catalog/claimProvenance.test.ts`,
  `data/catalog/events/stories.test.ts` (reports word for word, ayah evidence as printed, only catalog people)
  and `src/lib/catalog/validateCatalog.test.ts`. When a story needs a new rule, write it as a general rule over all
  stories.
- After catalog changes, rebuild with `scripts/battles/buildAppBattles.ts` so `shared/data/events/stories.json`
  and `life.json` match the catalog. No test checks this yet, so check it by hand.
