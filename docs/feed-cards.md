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
أوائل السور, سمّع الآية, the three Tuhfat al-Atfal questions, and the two tarajim questions
(أين يلتقي النسبان؟ and صاحب المنقبة, `shared/quiz/tarajim.ts`).

من التراجم (`TarajimPost`): a virtue from a converted Siyar entry, in the book's words with who says it and
its page; the head opens the person's page. Every fourth batch from the fourth (`hasTarajimCard` in `shared/homeFeed.ts`).

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
في أي سورة ذُكر؟, من المخاطَب؟

## Named exceptions

- Audio: a play button on the ayah cards instead of a card of its own.
- Qibla: already on the prayer card.
- Search, share and videos, settings, «ما أحفظه»: tools, not content.
- Party quizzes: played with others, not from the feed.
