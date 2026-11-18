# Word meanings (alfaz al-Quran)

Owner decisions 2026-11-18, after the audit `docs/audits/2026-11-18-alfaz-al-quran.md` (#913):

- **Layer 1, meaning in the ayah:** Ibn Qutaybah's «تفسير غريب القرآن». It feeds the reader sheet and the «ما معنى؟» quiz.
- **Layer 2, the root:** al-Raghib's «المفردات في غريب القرآن», his whole article on the word's root. It is never offered as the word's meaning in its ayah.
- **Text:** Shamela through Turath, the authors' words only (no editor's notes). Not OpenITI, whose licence is non-commercial.
- **A word Ibn Qutaybah does not explain** opens on al-Raghib's article, as the balagha sheet shows only what the books hold. His pill stays only when he explains another word of the same ayah; an ayah he never touches shows al-Raghib alone.
- **Quiz:** every choice is Ibn Qutaybah's own words: the right one his meaning of the word, the wrong ones his meanings of other words. We read every question and drop those where a wrong choice could also be right; the owner checks a sample before shipping.
- **Build go (owner, "looks good"):** the whole Quran at once, no caps. On home, meaning questions join the feed's question cards, with no next button and no limit.

## Sources

- «تفسير غريب القرآن», Ibn Qutaybah al-Dinawari (d. 276), ed. al-Sayyid Ahmad Saqr, Dar al-Kutub al-Ilmiyya, 1398/1978. Shamela 3259, Turath `books-v3/3259.json`.
- «المفردات في غريب القرآن», al-Raghib al-Isfahani (d. 502), ed. Safwan Adnan al-Dawudi, Dar al-Qalam and al-Dar al-Shamiyya, 1st ed. 1412. Shamela 23636, Turath `books-v3/23636.json`.

Both files are pinned by sha256 in `scripts/quran/buildGharib.ts`. Both are public domain and listed in `shared/sources.ts`.

## Data

`npm run quran:gharib` writes `shared/data/quran/gharib.js` (0.8 MB) and `mufradat.js` (2.9 MB). Both ship with the app as built-in books (`shared/books.ts`, kind «معاني الكلمات»), so they can be hidden in the books page. The website reads them on the server through `/api/quran/gharib`.

`scripts/quran/gharib.ts`:

- **Ibn Qutaybah.** His surahs start at Shamela page 36. Before that are his chapters on the divine names, which name no ayah. An entry opens on a numbered line («١٤- ﴿…﴾») or a line that opens with a quote, and runs on over the lines after it.
- **Placing his entries.** Each quote is found in its surah: first exactly, in the ayah he numbers or the next place after the last entry, then loosely (و/ف/ال dropped, two quote words joined into one mushaf word) in the ayat nearby. A numbered entry that is still not found shows on its ayah with no word lit. 3,456 of 3,482 entries are placed, on 2,370 ayat. The 26 left are cross-references to other surahs and spellings the matcher misses.
- **Al-Raghib.** The articles start at the first «كتاب …» division and stop at «مقدّمة للفهارس». In Turath's export, some title marks fall inside words. So a heading is a line that is a title alone, or two to six letters alone.
- **Linking a word to an article.** A word is linked through its Quranic Arabic Corpus root, when exactly one of his headings fits it. Spellings are tried in order and the first that names a heading decides: the root (with a doubled last letter written once), then a weak letter written as alif (a و-root also as و, a ي-root as ي), then a weak last letter dropped. The rule never crosses و and ي, since نسو (women) is not نسى (forgetting). `ALIASES` lists the roots he files under a heading of his own, each checked against his article. 49,273 of 49,964 rooted words are linked. 111 roots have no heading and show nothing.

## «ما معنى؟»

- **Which entries are asked.** An entry is askable when its quote is at most eight words, is found in its ayah, and his first sentence after it gives the meaning in one to ten words of his own (owner, 2026-11-18):
  - his first sentence counts even when more follows;
  - a whole phrase counts with what he says it refers to («صراط الذين أنعمت عليهم» «يعني الأنبياء والمؤمنين»);
  - an addition that carries the ayah on counts («فأحياكم» «في الأرحام وفي الدنيا»);
  - one hedged «يقال:» counts when the entry offers no other reading.
  Left out: alternatives (a meaning followed by another reading: «ويقال:»، «وقيل:»، «وفيه قول آخر», «يقال … ويقال»، «أو»; a «يقال:» that shows the word in use, «يقال: نكب عن الحق: أي عدل عنه», is not one), pointers elsewhere («قد تقدم»، «في المشكل»), notes on the word's form («واحدها»، «جمع»، «فعيل من سجنت»), comments on majaz and reports.
- **The wrong choices.** Each question gets three of his other short meanings, from the same surah first (nearest ayah first), then from up to three surahs away. They are of similar length, share no content word with the right one or with each other, explain a different word, never come from the question's own ayah (in «من كل الثمرات» his «ثمره» would read as right beside «في الطعم»), and never a word of the same Quranic Arabic Corpus root (رهقا «ضلالا» is not a wrong choice for رهقا «ظلما»). A meaning that only names what a word points to («يعني: القرآن»، «هي: السورة») is asked as a question but never offered as a wrong choice, since it could fit many words.
- **Hand review.** Every question was read. The decisions are in `scripts/quran/meaningReview.json`:
  - `notMeaning`: 84 entries whose first sentence is not the word's meaning in the mushaf: a fragment, a note on the word's form, a meaning of one word set on a long quote, a meaning of the second ayah of a quote that runs over two, or a meaning of another reading than Hafs's (his «هنالك تتلو» is «تقرأ», but Hafs reads «تبلوا»). These are kept out of the questions and the wrong choices.
  - `apart`: 68 pairs of his meanings too close to be the right and a wrong choice of one question (البأساء «الشدة» and الضراء «البلاء», خاسئا «مبعدا» and فسحقا «بعدا», …). Such a question keeps another wrong choice instead of being dropped.
  - `ambiguous`: questions dropped outright (none now).
  - 2,467 questions remain.
- **Signs spelled out.** His text writes honorifics as single signs (﷿ for «عز وجل», ﵇ for «عليه السلام», ﵁ for «رضي الله عنه»). Readers did not recognise them, so both books spell them out in words; only ﷺ stays as a sign. One list in `scripts/quran/signs.ts`, shared with the Sa'di build.
- **On screen.** The question is the whole quote he explains, in its ayah, with the quote marked. After answering, each wrong choice shows the word it explains and where («معنى «فراتا»، المرسلات ٢٧»), and the note gives his pages.
- **Where it appears.** The kind is `MEANING` (`shared/quiz/meaning.ts`), asked solo, in a party, and in the home feed's turn of question cards. Hiding the book in the library hides the reader sheet's pill, not the quiz: the quiz is chosen by its own kind.

## Reader sheet

Long press on a word, then «المعنى» (app `GharibSheet`, web `GharibPanel`). The sheet has the ayah with the pressed word lit. Pills switch between «غريب القرآن لابن قتيبة» (his entries on the ayah, those on the word first; a tap lights the words an entry quotes) and «المفردات للراغب» (the article on the word's root). A book with nothing here has no pill. Each card's credit folds open to the edition and the Shamela page.
