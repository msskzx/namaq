# Balagha in the reader

Owner decisions 2026-11-16: balagha comes from the books, never from us. The first step is al-Zamakhshari's al-Kashshaf in a reader sheet. The owner chose to show his **whole passage** on the ayah, as the tafsir sheet does, because picking sentences out of it would rest on our judgment. Nothing in his text is cut or summarized.

## Source

«الكشاف عن حقائق التنزيل وعيون الأقاويل في وجوه التأويل», Jar Allah al-Zamakhshari (d. 538), Dar al-Kitab al-Arabi, Beirut, 3rd ed. 1407, four volumes. Quranpedia's dump of book 346, version 2026-08-10, pinned in `scripts/quran/buildKashshaf.ts`. Public domain, listed in `shared/sources.ts`.

The book carries Mu'tazili readings of some divine attributes. The owner knows; al-Sa'di stays the default tafsir, and al-Kashshaf is a download on the phone that nobody gets without choosing it.

## Data

`npm run quran:kashshaf` writes `shared/data/quran/kashshaf.js` (7.3 MB, about 2.2 MB gzipped), a module that parses a JSON string with a declaration beside it, like `irabUkbari.js`. The phone downloads it from `/api/books/kashshaf`; the website reads it on the server through `/api/quran/balagha`.

`scripts/quran/kashshaf.ts` reads the dump the way al-Sa'di's is read (`docs/records/R0034`):

- Each piece is a printed page. The pages are laid end to end in volume and page order and cut at his headings, «[سورة … (n) : آية a]» or «… الآيات a الى b]».
- The footnotes are the marginal works printed with this edition (Ibn al-Munayyir's al-Intisaf and others), so they are dropped with their «١» marks. Pieces without a page number belong to another edition and are dropped too.
- A heading sometimes names fewer ayat than its passage explains, so a passage runs to the ayah before the next heading (`docs/records/R0049`). The build fails if any ayah falls in no passage.
- A heading that names an ayah the heading before already named (printed again on the next page, or an overlapping range such as «٣٨ الى ٤٧» after «٣٦ الى ٤٠») continues that passage, so each ayah has exactly one passage. The build fails if a passage is empty or two hold the same ayah.
- The ayat quoted under the heading are dropped, since the sheet shows the ayah itself. A surah's opening words go to its first passage.
- His prose is unvocalized and his Quran quotes are vocalized. A vocalized parenthesis, or a run of words with two or more marks each, becomes ﴿…﴾ when every word is a Quran word. That keeps a vocalized proverb as prose.

Result: 2,970 passages covering all 6,236 ayat.

## The lit sentences: a fixed rule

A sentence is lit when it holds one of his own words for a device, at the start of a word (after و، ف، ب، ل، ك or ال at most), outside a Quran quote:

| Device (chip) | His words |
| --- | --- |
| الاستعارة | استعار، مستعار، استعير، يستعار |
| التشبيه | تشبيه، شبّه، «شبه … ب» within five words |
| التمثيل | تمثيل، مثّل |
| الكناية | كناية، كنى به/عن، يكنى، كنوا |
| المجاز | مجاز (not مجازيهم، المجازاة) |
| الالتفات | التفات (not «التفات إلى») |
| التقديم | تقديم، «قدّم … على» |
| التكرير | تكرير، تكرار، كرّر |

Grammar's «كاف التشبيه» and «حرف التشبيه» don't count. A sentence is cut at «.», «؟», «!» and line ends. Lines of poetry are never lit.

Where a device word is used in another sense, such as a grammar analogy, fiqh («تقديم الزكاة») or «تكرير الدرس», the sentence is listed in `scripts/quran/kashshafExclusions.json` with the passage, the words, and why. That file has 45 entries now. It is the only judgment in the data, and each entry says why.

Result: 916 lit sentences in 622 passages (a sentence can name two devices).

The ayah words light only where the sentence quotes them vocalized and the quote matches the mushaf's words of an ayah in the passage, by consonants (`docs/records/R0043`). That holds for 327 sentences. Where he speaks of the words in prose, as on Maryam 4 («ثم أسند الاشتعال إلى مكان الشعر»), nothing is placed.

## Display

A long press in the reader, app and website, gives «البلاغة» (a sparkles icon) on every ayah. The sheet shows:

1. The ayah in the Quran font.
2. His whole passage, quotes in the Quran font and accent. Lit sentences sit on the reader's neutral band, with his device words muted in front, «الاستعارة». The first lit sentence that quotes the pressed ayah lights its words in the ayah; a tap on another lit sentence moves the light.
3. A collapsible reference under the passage: «الكشاف للزمخشري ج/ص». Opened, it names the edition, the dump version and the rule, and links the printed page on quranpedia.net.

On the phone without the book, the sheet says what it holds and offers the download (`shared/books.ts`, kind «البلاغة»).

## Later

- A device browser: browse the lit sentences by device, cards like the iltifat page. The iltifat page is a starting point to be completed there; its cards not attested in a classical book are to be checked.
- Other books where free: al-Iskafi and al-Karmani's cases on repeated ayat already in the compare cards.
