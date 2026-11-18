# Feed cards and quiz kinds

The owner's rule (2026-11-18): every feature in the app has a card in the home feed,
with a few named exceptions, and a quiz kind where it has something to ask. The plan
with the sketch is "A feed card for every feature"
(https://claude.ai/artifact/93ufQsTcWLn8xY5C8Y5yix). This file is the list in the
repository; update it in the PR that adds a feature, a card, a quiz kind or an exception.

## Cards in the feed now

Continue reading, today's juz, prayer time, books, scenes (مشاهد), saved and forgotten
ayat, surah openings, a battle's moment (من غزوة …, opening the battle's page), a sira story whole (من قصص السيرة, its first report with
the ayat folded under it, opening the story's page), and the quiz cards in `FEED_QUIZ_NAMES`
(`shared/quiz/feedQuiz.ts`): في أي سورة؟, أكمل المتشابهات, سمّع بقية الآية, قارن الموضعين,
أوائل السور, سمّع الآية, and the three Tuhfat al-Atfal questions.

The ayah cards (`AyahNotePost` in `HomeFeed.tsx`, lists in `shared/quran/ayahNotes.ts`), one a batch, the kind turning:
من التفسير (an ayah al-Sa'di explains alone), من البلاغة (an ayah al-Suyuti surely names), من الإعراب (one word's line),
من القراءات. Each is small: the ayah, a little of the book, and a tap opens the reader's own sheet with the whole text
(owner, 2026-11-18).

## Cards to add

من ألفاظ القرآن (built in the word-meanings
work as «ما معنى؟»), من الأقسام, من ترتيب السور, موضوعات السورة, أذكار الصباح/المساء,
من الحديث, من ملاحظاتك.

## Quiz kinds to add

لأي آية هذا التفسير؟ (only on short tafsir entries: al-Sa'di's whole comment on one ayah, never cut, the
ayah's own words hidden, no wrong choice holding the explained words; owner 2026-11-18), ما الأسلوب؟, أي كلمة يعرب؟, من يقرأ بها؟, أين ترد؟ / ما ضدها؟,
بم أقسم؟, ما السورة التي قبلها؟, مقاصد أي سورة؟, أكمل الذكر, من القائل؟,
في أي سورة ذُكر؟, من المخاطَب؟, and for the battles and events: أين كانت؟ (on the map), متى كان؟ (on the
timeline), رتّب, من شهدها؟ / من أمير السرية؟, فيمَ نزلت؟, أي حدث هذا؟ (next battles PR: they wait for the years, places and ghazwah or sariyyah to be cited, so no quiz asks about a value without its reference)

## Named exceptions

- Audio: a play button on the ayah cards instead of a card of its own.
- Qibla: already on the prayer card.
- Search, share and videos, settings, «ما أحفظه»: tools, not content.
- Party quizzes: played with others, not from the feed.
- Tarajim: the battles have the moment card and the sira stories the story card; the people get theirs when they come to the app.
