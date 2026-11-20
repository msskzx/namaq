# Feed cards and quiz kinds

The owner's rule (2026-11-18): every feature in the app has a card in the home feed,
with a few named exceptions, and a quiz kind where it has something to ask. The plan
with the sketch is "A feed card for every feature"
(https://claude.ai/artifact/93ufQsTcWLn8xY5C8Y5yix). This file is the list in the
repository; update it in the PR that adds a feature, a card, a quiz kind or an exception.

## Cards in the feed now

Continue reading, today's juz, prayer time, books, scenes (مشاهد), saved and forgotten
ayat, surah openings, a balagha term (من مصطلحات البلاغة: its name, its definition in the scholar's words and one of
al-Suyuti's examples, opening the term's page in «مصطلحات البلاغة»; `TermPost`), a battle's moment (من غزوة …, opening the battle's page), a sira story whole (من قصص السيرة, its first report with
the ayat folded under it, opening the story's page), one of al-Nawawi's Forty (من الحديث, his text for an entry he takes whole
from the Sahihayn, opening the hadith's page; `HadithPost`), a passage of Ibn Rajab's
commentary (من شرح ابن رجب, a paragraph where he explains a phrase of one of those hadith, opening the hadith's page;
`RajabPost` drawn by `components/IbnRajab`, the page's own view), the books that record one of the Forty (من أخرجه, the
start of one al-Nawawi takes whole from the Sahihayn and the «من أخرجه» drawing of each book and number; `RecordedPost` drawn
by `components/HadithBooks`, the page's own view), al-Bukhari's chain for one (من الإسناد, the drawing «الرسم» of his record
for one of those hadith with the start of the saying, opening the hadith's page; `IsnadPost` drawn by `components/Isnad`), a hadith of Sahih al-Bukhari or Sahih Muslim whole
(من صحيح البخاري / من صحيح مسلم, its kitab › bab in the head, Muslim's bab marked «تبويب النووي», drawn by `SahihHadithView`, the
hadith page's own view, opening the hadith's page; `SahihPost`, only once the book is downloaded on the phone), and the quiz cards in `FEED_QUIZ_NAMES`
(`shared/quiz/feedQuiz.ts`): في أي سورة؟, أكمل المتشابهات, سمّع بقية الآية, قارن الموضعين,
أوائل السور, سمّع الآية, ما معنى؟, the four ayah quizzes below, ما المصطلح؟ (`shared/quiz/balaghaTermQuiz.ts`: a term's
definition with its name hidden, four terms to pick from, each choice linking to its definition once answered), the three Tuhfat al-Atfal questions, السيرة والغزوات (shared/quiz/sira.ts), the five tarajim questions
(أين يلتقي النسبان؟, صاحب المنقبة and ما صلته به؟, `shared/quiz/tarajim.ts`; في أي سنة كان؟, `shared/quiz/life.ts`:
the year of an event or story of someone's «حياته», or of a person's death (battles are the sira quiz's); two years where
the sources give two, the wrong choices of the same shape and none near; the look-up his timeline; أكمل النسب,
`shared/quiz/nasabFill.ts`: a person's nasab as boxes, every other one blank, one blank asked at a time from other fathers
the entries name, of the answer's shape; the look-up the nasab written out), بمَ لُقّب؟ and ما كنيته؟ (each its own interest), أسماء النبي ﷺ (several right choices, under السيرة), and the four hadith questions (من راوي الحديث؟, أكمل الحديث, من أخرجه؟ and من حدّث به؟: al-Bukhari's chain
with one narrator left out, the wrong choices narrators of other chains named nowhere in this hadith's records;
`shared/quiz/hadith.ts`), and في أيّ كتاب؟ (`shared/quiz/sahih.ts`: a bab heading of either Sahih and the kitab it stands in).

The ayah quizzes (`shared/quiz/ayahQuizzes.ts`), whose questions are built once by `scripts/quran/buildAyahQuizzes.ts`
(the app and the website only read the bank; hand review in `scripts/quran/ayahQuizReview.json`):
- لأي آية هذا التفسير؟: only on short tafsir entries, al-Sa'di's whole comment on one ayah, never cut, the ayah's own
  quotes hidden («…»); three whole ayat to pick from, no wrong one saying what the passage says (owner 2026-11-18).
- ما الأسلوب؟: the words al-Suyuti quotes, coloured, and which of his headings he cites them under; wrong headings from
  his other chapters (ITQAN RULE: only places he surely means).
  Once answered, each choice opens its term's definition in a sheet (`TermChips`), from «مصطلحات البلاغة».
- ما إعرابها؟: one word, coloured, and its role (Quranic Treebank), only plain roles its case ending shows.
- كيف يقرؤها؟: a word the ten readers differ on, and how one of them reads it; half ask a reader who reads as the
  mushaf does. (The sketch asked «من يقرأ بها؟»; with two readings that question is answered by knowing the mushaf is
  Hafs's reading, so it asks the other way.)

من التراجم (`TarajimPost`): a virtue from a converted Siyar entry, in the book's words with who says it and
its page; the head opens the person's page.

صلة (`TiePost`): two converted people joined through someone else, the nearest chain of ties as one sentence
(«صفية أمُّ الزبير، و…») with the pages that state each tie; the head opens «بينه وبين…» with the two picked
(pairs from `linkedPairs` in `shared/tarajimGraph.ts`).

من حياته (`LifePost`): a converted person's «حياته» timeline as his page draws it (the strip of years, the kinds as
chips), the rail a year a line; the head opens his page. Only people whose strip has two years or more (`drawsLine`).

لقب وصاحبه / كنية وصاحبها (`NamePost`, interests «الألقاب» and «الكنى»): one person's laqab or kunya large, the person
under it, the book's words when they say more, and the person page's folded reference (lists from `shared/tarajimNames.ts`).

The ayah cards (`AyahNotePost` in `HomeFeed.tsx`, lists in `shared/quran/ayahNotes.ts`), each kind under its own interest:
من التفسير (an ayah al-Sa'di explains alone), من البلاغة (an ayah al-Suyuti surely names), من الإعراب (one word's line),
من القراءات. Each is small: the ayah, a little of the book, and a tap opens the reader's own sheet with the whole text
(owner, 2026-11-18).

The drawings built for their pages (owner, 2026-11-20; items and sources in `shared/drawingCards.ts`, the website's
cards in `src/lib/drawingCards.ts`). Each draws the page's own component and its open button opens that page at the item.
An item whose own data names no source is left out:
- نسبه (`NasabPost`, under التراجم): the nasab tree with its long runs folded, credited to the entries each name comes from.
- صلاته (`TiesPost`, under التراجم): the ties ring; a person on it opens his page.
- غزوة … (`BattlePost`, under السيرة والمغازي): the battle's map and the two sides' numbers. Jamal, Siffin and Nahrawan show only
  their name, year, place and people, whatever their data holds (`FITNA_BATTLES`); Siffin and Nahrawan have no cited
  year or place yet, so they stay out.
- من صحيح … (`HadithScenePost`, under الحديث): one scene of a hadith drawn as a chat, only scenes where someone speaks.
- من فواتح السور (`OpeningCardPost`, under الحفظ والمراجعة): one card of «فواتح السور», only those a scholar groups (al-Suyuti);
  our own groupings stay out.
- من الأقسام (`OathPost`, under التفسير): the oath's words, sworn words coloured, with the scholar's sentence on it (Ibn
  al-Qayyim, al-Suyuti), so only oaths in `OATH_QUOTES`.
- A prophet's event (`EventPost`, under قصص الأنبياء): an event told in more than one surah, its places side by side. The
  story card draws the map of the whole story; this one draws one event's ayat.

## Interests: which card comes when

The feed comes in rounds by the reader's interests (owner, 2026-11-19; plan "Plan: a better home feed with interests",
https://claude.ai/artifact/24iRYmxLcG2ymRuqQqZKR5). `shared/interests.ts` lists the interests under the sections as Ibn
Khaldun names the sciences («السيرة والتاريخ» and some chips are ours, marked `ours`), and **every feed card kind
(`FEED_CARD_KINDS`) and question kind (`FEED_QUIZ_KINDS`) belongs to exactly one interest** (`shared/interests.test.ts`).
A new card or quiz kind goes into an interest's `cards` or `quizzes` in the same PR, with its item list in `LIST_OF`
(`mobile/src/components/HomeFeed.tsx`).

- A round (`feedRound` in `shared/homeFeed.ts`) has one card from each interest picked (all when none is), content and
  questions taking turns, never two questions side by side, the order turning with the day. With «فاجئني من غير اهتماماتي»
  (on by default) one card a round comes from an interest not picked, with «أضفه».
- Only three open rules move a card up: what is picked, a question answered wrong comes back after the ayah rests
  (`shared/quiz/missedQuestions.ts`), and a story opened goes on from where it stopped. Nothing is learned from taps.
- Every card walks its own list with what was seen (`shared/feedSeen.ts`), so a card is new until the list is done.
- Each card's row under it (owner 2026-11-20, like an Instagram post; the rule is in docs/ship-checklist.md section 4)
  holds, from the right, the button that opens the item in its own reader, the card's tools, «احفظ» (a `card:` bookmark,
  shown in the library and among the saved cards) and share; a «⋯» alone at the left opens a small menu with «ليس من
  اهتماماتي» (`ui/MoreMenu`, `common/MoreMenu`), and a card with no such choice has no «⋯». The open button is the one way to
  the item: the head and the card are not buttons for it too. Under the row, the source line:
  a book icon and the books the card stands on («المصحف · الإخلاص ٣» for the Quran), a tap opening a sheet with where in
  them (HomeFeed `Post` `source`; a `Reference` inside a card joins it on its own, ui/sourceSlot.ts). The books card is
  the one card with no line: its books are the card. A card from outside the reader's interests is added from its line above («أضفه»). Nothing on screen moves:
  interests are kept for the visit, and a card taken out leaves a line with «تراجع».
- No card is taller than two thirds of the screen (`CARD_CAP_SHARE` in `shared/homeFeed.ts`, owner 2026-11-20): longer
  content stops with a fade and «اقرأ كاملًا» opens it whole in a sheet with the row and the source line at its foot
  (app `CardWithRow` `cap`, website `common/CappedCard`). Nothing scrolls inside a card. Question cards and recall cards
  are never capped: a question shows all its choices, a recall card its whole ayah.
- Today's juz, the forgotten ayat, books, the prayer card and saved items stay outside the rounds.
- The chips over the feed: «لك» and each interest picked; a tap shows that interest's cards alone.
- The website has the same picker (first open, settings, the chip row and its pencil, `src/components/homepage/Interests.tsx`);
  «فاجئني» is the app's alone, since the website's feed has no surprise card.

## Cards to add

من ألفاظ القرآن (built in the word-meanings
work as «ما معنى؟»), من ترتيب السور, موضوعات السورة, أذكار الصباح/المساء,
من ملاحظاتك.

## Quiz kinds to add

أين ترد؟ / ما ضدها؟,
بم أقسم؟, ما السورة التي قبلها؟, مقاصد أي سورة؟, أكمل الذكر, من القائل؟,
في أي سورة ذُكر؟, من المخاطَب؟, and for the battles and events: أين كانت؟ (on the map), متى كان؟ (on the
timeline), رتّب, من شهدها؟ / من أمير السرية؟, فيمَ نزلت؟, أي حدث هذا؟ (next battles PR: they wait for the years, places and ghazwah or sariyyah to be cited, so no quiz asks about a value without its reference)

## Named exceptions

- Audio: a play button on the ayah cards instead of a card of its own.
- Qibla: already on the prayer card.
- Search, share and videos, settings, «ما أحفظه», «اهتماماتي»: tools, not content.
- الأذكار: an interest once its card or question is built (owner agreed it is one, 2026-11-19).
- Party quizzes: played with others, not from the feed.
- Tarajim: the battles have the moment card and the sira stories the story card; the people have «من التراجم», «صلة», «من حياته», «لقب وصاحبه», «كنية وصاحبها», «نسبه» and «صلاته».
