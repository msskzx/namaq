# I'rab in the reader, and the phone's books

Owner decisions 2026-11-15: a long press on a word shows its i'rab. A classical book split onto words, with the Quranic Arabic Corpus for every word. On the phone every book is the person's to keep or remove; one tafsir ships by default and can be removed too. The website fetches what it shows and manages nothing.

## Sources

Darwish («إعراب القرآن وبيانه», d. 1982), Safi («الجدول», d. 1985), al-Da'as (2004) and al-Kharrat («المجتبى», 2005) are under copyright. They cover every word, but they need their publishers' permission. What is free:

- **Every word, short:** Quranpedia's `morphology.json` is the Quranic Arabic Corpus 0.4 with Arabic labels («اسم مجرور، مذكر، الجذر (سمو)»). Its terms let any app use it with the corpus named and linked. `syntax.json` is NoorBayan's Quranic Treebank (MIT), the whole Quran, with each word's role in Arabic («خبر يكن», «بدل», «مضاف إليه») and the word it attaches to.
- **A book, where it speaks:** al-'Ukbari's «التبيان في إعراب القرآن» (d. 616), Quranpedia's book 309, public domain. He parses the words he finds worth a note, not every word.

## Data

`npm run quran:irab` reads the three dumps (versions pinned in `scripts/quran/buildIrab.ts`) and writes two files. Both are modules that parse a JSON string, with a declaration beside them, like `compareCards.js`: as plain JSON, TypeScript ran out of memory inferring their types.

- `shared/data/quran/irab.js` (2.9 MB, built into the app): for each of the 6,236 ayat in mushaf order, each corpus word's `[role, morphology, head]`, the strings stored once. 67,604 of 77,429 words have a role; the rest (mostly the subject of a nominal sentence, which the treebank leaves unnamed) show their morphology only.
- `shared/data/quran/irabUkbari.js` (3.3 MB, downloaded by the phone, read on the server by the website): 5,795 passages `[surah, ayah, firstWord, lastWord, page, text]`, 5,616 on words and 179 on a whole ayah.

Al-'Ukbari's dump has the same shape as al-Sa'di's (`docs/records/R0034`): each ayah carries printed pages. `scripts/quran/irabUkbari.ts` lays them end to end and reads the book once:

- «سورة …» on its own line opens the next surah.
- «قال تعالى: (… (٢) … (٣))» quotes the ayat the next lines discuss. Some quotes put the number after the parenthesis: «(…) (٨٢).» or «(…) ((١٨)).»
- «قوله تعالى: (…) :», a line opening on «(…) :», and «وَ (…) :» after a stop each start a passage on the words they name. The words are found in the quoted ayat, then three ayat either side, then in the next 20 ayat after the last one found, where they occur exactly once (a quote numbered «(٣١٦)» in al-Baqara meant 216). A quote behind the last ayah found is taken as misprinted, and the search starts from that ayah instead. Matching compares consonants only, without vowel marks or alif, waw, ya and hamza seats, so the book's spelling («الصلاة») meets the mushaf's rasm («ٱلصَّلَوٰةَ»). A leading ف, ل, ب or ك may differ («رَءُوفٌ», «لَرَءُوفࣱ»). The build fails if more than 20 passages run back within their surah (14 do, some of them al-'Ukbari's own look back).
- A «قوله تعالى» heading found nowhere becomes a passage on the quoted ayah. A line heading found nowhere stays in the passage before, and so does a heading with a reference to another surah («[الأنعام: ١٥٣]»).
- The heading's parenthesis becomes ﴿…﴾ so the sheets set it in the Quran font.

## Display

The long-press buttons gain «الإعراب» (a tree-list icon) when a word was pressed. The sheet shows the ayah's words as chips, the pressed one lit and the word its role points at outlined with a dashed border. Below, the word in large Quran type, its role, and its morphology. Then each of al-'Ukbari's passages on the word, the book and page above it as a link to the page on quranpedia.net. With none on the word, his passages on the whole ayah show, marked «على الآية». The corpus and treebank are linked at the bottom.

A mushaf word maps to corpus words through `corpusWords` (`shared/quran/words.ts`), which handles the seven ayat where the two texts space words differently.

The website's reader numbers each word span (`data-word`, the ayah's words on that page, ۞ included, recite mode's title steps not) and its page (`data-page`), and fetches `/api/quran/irab?k=…&p=…&n=…`.

## The phone's books

`shared/books.ts` lists the books: al-Sa'di and the short i'rab line are built in, al-'Ukbari is a download (`/api/books/ukbari`). Settings have a «الكتب» section, grouped by kind, each book with a download or remove button. Removing a built-in book hides it (the app's own files cannot shrink) and adding it back needs no connection; removing a downloaded one deletes its file under the app's documents. A download that does not read as the book's data is deleted and shows as failed; a kept file that cannot be read later shows a line asking to download it again. A sheet whose kind has no book left (the tafsir sheet with al-Sa'di removed, the i'rab sheet with both removed) lists that kind's books to add. The i'rab sheet also lists them while al-'Ukbari is not downloaded.

Later: another tafsir (al-Jalalayn is public domain), al-Nahhas's «إعراب القرآن» (public domain, needs more hand work to split), and a complete modern book if its publisher agrees.
