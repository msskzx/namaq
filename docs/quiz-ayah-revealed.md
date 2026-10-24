# "In whom was this ayah revealed" questions

The quiz topic `AYAT` (في من نزلت, "Revealed about whom") shows an ayah and asks in whom it was revealed. It replaces the earlier `AYAH_LINK` family, which asked which ayah "the sources linked" to a person. Those links mixed three things: an ayah revealed about the person, an ayah that describes a group the person belonged to, and an ayah the person quoted or acted on. Its 22 questions are retired.

## Data (`revealedAbout` on a catalog ayah link)

- A link in `data/catalog/people/*.ts` `ayat` carries `revealedAbout` only when its cited source says the ayah was revealed about that person: نزلت فيّ, نزلت فيها, فأنزل الله فيهما, or an account of revelation in the person's own story (Aisha and النور 11). A link backed only by `legacyUnreviewed` cannot carry it.
- Not tagged: ayat that describe a group the person was in (الفتح 18 for أهل بيعة الرضوان, آل عمران 172), ayat the person read or acted on (التوبة 41 for Abu Talha), ayat revealed during an event the person took part in without the source saying they were revealed about them (الروم 2 to 4 for Abu Bakr's wager), and the Prophet's ayat, since every ayah was revealed to him.
- `with` lists other people the same source says the ayah was revealed about, such as Aisha beside Hafsa for التحريم 4 (فأنزل الله فيهما). They are never offered as distractors.
- `alsoUnnamed` marks a source that says the ayah was revealed about a group it does not fully name: الأنعام 52 "in six, I and Ibn Mas'ud among them", and الأنفال 70 about al-Abbas and the other captives. No question is asked for such a link, since a distractor could be one of the unnamed people.

## Questions (`revealedAboutQuestions` in `src/lib/quiz/generate.ts`)

- One question per tagged link. The prompt is «في من نزلت هذه الآية؟». The question's `attribute` is the ayah key, and the quiz and review pages show the ayah's text and reference under the prompt (`askedAyah` and `ayahDetails`).
- Choices come from the catalog alone, so the question does not change with the database. The three distractors are other catalog people of the same sex, since the ayah's wording often shows it (إن تتوبا, منها). Names are shown without their diacritics, as the database names are.
- After a catalog change, regenerate with `npm run quiz:generate`, review the pending questions per [quiz-question-review.md](quiz-question-review.md), and project them with `npm run quiz:project -- --apply`.
