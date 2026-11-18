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
أوائل السور, سمّع الآية, and the three Tuhfat al-Atfal questions.

## Cards to add

من التفسير, من البلاغة, من الإعراب, من القراءات, من ألفاظ القرآن (built in the word-meanings
work as «ما معنى؟»), من الأقسام, من ترتيب السور, موضوعات السورة, أذكار الصباح/المساء,
من الحديث, من ملاحظاتك.

## Quiz kinds to add

لأي آية هذا التفسير؟, ما الأسلوب؟, أي كلمة يعرب؟, من يقرأ بها؟, أين ترد؟ / ما ضدها؟,
بم أقسم؟, ما السورة التي قبلها؟, مقاصد أي سورة؟, أكمل الذكر, من القائل؟,
في أي سورة ذُكر؟, من المخاطَب؟

## Named exceptions

- Audio: a play button on the ayah cards instead of a card of its own.
- Qibla: already on the prayer card.
- Search, share and videos, settings, «ما أحفظه»: tools, not content.
- Party quizzes: played with others, not from the feed.
- Tarajim: no content yet; it gets a card when it has some.
