# Feed cards and quiz kinds

The owner's rule (2026-11-18): every feature in the app has a card in the home feed,
with a few named exceptions, and a quiz kind where it has something to ask. The plan
with the sketch is "A feed card for every feature"
(https://claude.ai/artifact/93ufQsTcWLn8xY5C8Y5yix). This file is the list in the
repository; update it in the PR that adds a feature, a card, a quiz kind or an exception.

## Cards in the feed now

Continue reading, today's juz, prayer time, books, scenes (مشاهد), saved and forgotten
ayat, surah openings, and the quiz cards in `FEED_QUIZ_NAMES`
(`shared/quiz/feedQuiz.ts`): في أي سورة؟, أكمل المتشابهات, سمّع بقية الآية, قارن الموضعين,
أوائل السور, سمّع الآية, ما معنى؟, the four ayah quizzes below, and the three Tuhfat al-Atfal questions.

The ayah quizzes (`shared/quiz/ayahQuizzes.ts`), whose questions are built once by `scripts/quran/buildAyahQuizzes.ts`
(the app and the website only read the bank; hand review in `scripts/quran/ayahQuizReview.json`):
- لأي آية هذا التفسير؟: only on short tafsir entries, al-Sa'di's whole comment on one ayah, never cut, the ayah's own
  quotes hidden («…»); three whole ayat to pick from, no wrong one saying what the passage says (owner 2026-11-18).
- ما الأسلوب؟: the words al-Suyuti quotes, coloured, and which of his headings he cites them under; wrong headings from
  his other chapters (ITQAN RULE: only places he surely means).
- ما إعرابها؟: one word, coloured, and its role (Quranic Treebank), only plain roles its case ending shows.
- كيف يقرؤها؟: a word the ten readers differ on, and how one of them reads it; half ask a reader who reads as the
  mushaf does. (The sketch asked «من يقرأ بها؟»; with two readings that question is answered by knowing the mushaf is
  Hafs's reading, so it asks the other way.)

The ayah cards (`AyahNotePost` in `HomeFeed.tsx`, lists in `shared/quran/ayahNotes.ts`), one a batch, the kind turning:
من التفسير (an ayah al-Sa'di explains alone), من البلاغة (an ayah al-Suyuti surely names), من الإعراب (one word's line),
من القراءات. Each is small: the ayah, a little of the book, and a tap opens the reader's own sheet with the whole text
(owner, 2026-11-18).

## Cards to add

من ألفاظ القرآن (built in the word-meanings
work as «ما معنى؟»), من الأقسام, من ترتيب السور, موضوعات السورة, أذكار الصباح/المساء,
من الحديث, من ملاحظاتك.

## Quiz kinds to add

أين ترد؟ / ما ضدها؟,
بم أقسم؟, ما السورة التي قبلها؟, مقاصد أي سورة؟, أكمل الذكر, من القائل؟,
في أي سورة ذُكر؟, من المخاطَب؟

## Named exceptions

- Audio: a play button on the ayah cards instead of a card of its own.
- Qibla: already on the prayer card.
- Search, share and videos, settings, «ما أحفظه»: tools, not content.
- Party quizzes: played with others, not from the feed.
- Tarajim: no content yet; it gets a card when it has some.
