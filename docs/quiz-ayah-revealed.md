# "In whom was this ayah revealed" questions

The quiz topic `AYAT` (في من نزلت, "Revealed about whom") shows an ayah and asks in whom it was revealed. It replaces the earlier `AYAH_LINK` family, which asked which ayah "the sources linked" to a person. Those links mixed three things: an ayah revealed about the person, an ayah that describes a group the person belonged to, and an ayah the person quoted or acted on. Its 22 questions are retired.

## Data (`kind` and `revealedAbout` on a catalog ayah link)

Every link has a `kind`, which says how its cited source ties the ayah to the person (owner, 2026-11-18):

| kind | Arabic label | Example |
|---|---|---|
| `REVEALED_ABOUT` | «نزلت فيه» | Sa'd: «نزلت هذه الآية فيّ» (لقمان 15 and العنكبوت 8) |
| `DESCRIBES` | «ذُكر فيمن تصفهم» | Abd al-Rahman ibn Awf among أهل بيعة الرضوان (الفتح 18) |
| `ACTED_ON` | «عمل بها» | Abu Talha read «انفروا خفافا وثقالا» and went out (التوبة 41) |
| `READ_AS_ABOUT` | «قرأها فيه فلان» | Qatadah reads التوبة 79 as about those who mocked Ibn Awf's gift; المعارج 13 for the Prophet rests on an unnamed «قيل», shown as such |
| `IN_STORY` | «في خبره» | Abu Bakr's wager and الروم 2 to 4 |

Only `REVEALED_ABOUT` carries `revealedAbout`, and only it becomes a question; `catalog:validate` refuses one without the other.

- A link in `data/catalog/people/*.ts` `ayat` carries `revealedAbout` only when its cited source says the ayah was revealed about that person: نزلت فيّ, نزلت فيها, فأنزل الله فيهما, or an account of revelation in the person's own story (Aisha and النور 11). A link backed only by `legacyUnreviewed` cannot carry it.
- Not `REVEALED_ABOUT`: ayat that describe a group the person was in (`DESCRIBES`: الفتح 18 for أهل بيعة الرضوان, آل عمران 172), ayat the person read and acted on (`ACTED_ON`: التوبة 41 for Abu Talha), ayat revealed during an event the person took part in without the source saying they were revealed about them (`IN_STORY`: الروم 2 to 4 for Abu Bakr's wager), ayat someone the source quotes reads as about the person (`READ_AS_ABOUT`: Qatadah on التوبة 79, about the hypocrites who mocked Abd al-Rahman ibn Awf's gift), and the Prophet's ayat, since every ayah was revealed to him.
- `with` lists other people the same source says the ayah was revealed about, such as Aisha beside Hafsa for التحريم 4 (فأنزل الله فيهما). They are never offered as distractors.
- `alsoUnnamed` marks a source that says the ayah was revealed about a group it does not fully name: الأنعام 52 "in six, I and Ibn Mas'ud among them", and الأنفال 70 about al-Abbas and the other captives. No question is asked for such a link, since a distractor could be one of the unnamed people.

## Questions (`revealedAboutQuestions` in `src/lib/quiz/generate.ts`)

- One question per tagged link, and one per report: when one report names two ayat (Sa'd: لقمان 15 and العنكبوت 8), the first is asked. The prompt is «فيمن نزلت هذه الآية؟», unless the link's `revealedAbout.prompt` words it closer to the source: Aisha's asks in whose acquittal the ayat of the ifk came down (النور 11 names the slanderers), and al-Ash'ath's asks who said «فيّ نزلت», since other reports give that ayah another occasion.
- When `with` names others («فيهما»: Hafsa and Aisha at التحريم 4), the answer names them all, and every wrong choice is a group of the same size. The question's `attribute` is the ayah key, and the quiz and review pages show the ayah's text and reference under the prompt (`askedAyah` and `ayahDetails`).
- Choices come from the catalog alone, so the question does not change with the database. The three distractors are other catalog people with a profile and of the same sex, never the Prophet (every ayah was revealed to him), since the ayah's wording often shows it (إن تتوبا, منها). Names are shown without their diacritics, as the database names are.
- After a catalog change, regenerate with `npm run quiz:generate`, review the pending questions per [quiz-question-review.md](quiz-question-review.md), and project them with `npm run quiz:project -- --apply`.
