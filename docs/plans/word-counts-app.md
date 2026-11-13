# Word counts in the phone app

Status: built (owner's go, 2026-11-13).

The website's `/quran/words` counts each word of the Quran by its lemma in the Quranic Arabic Corpus (morphology 0.4).
The app gets the same counts, kept small: a sheet for one word and a search page.

## What the app has

- **Long press a word in the mushaf.** The ayah buttons gain one more when the pressed word has a lemma.
  It opens a sheet with the word, «ترد في القرآن N مرة في M آية» and its root, then the ayat as cards with the word in
  colour. A card opens that ayah in the mushaf. A mushaf word holding two lemmas («مِمَّا») picks one at the top.
- **«ألفاظ القرآن» on the Quran tab.** A search box and a list (the most frequent words when the box is empty). A word
  opens the same sheet. The help icon says how words are counted.

The opposites chart and the repeated-phrases stats stay on the website. The opposites chart mixes counting rules
(«الآخرة» counts one form, the other words their whole lemma), so it belongs with the numerical-miracles work, where
each claim will carry its source and its rule.

## Data

`npm run quran:lemmas` (`scripts/quran/buildLemmas.ts`) writes `shared/data/quran/words.json`: the lemma list as
`countLemmas` gives it, and for each ayah one entry per corpus word with the ids of its lemmas. `shared/quran/words.ts`
reads it (places of a lemma, search, the lemmas under a mushaf word).

Checks, pinned in `shared/quran/words.test.ts`:

- The counts match corpus.quran.com: ٱللَّه 2699 (in 1821 ayat), جَنَّة 147, يَوْم 405, حَيَوٰة 76. Root totals for
  ten roots were also checked by hand against the site (قول 1722, كفر 525, أمن 879, علم 854, نور 194, موت 165,
  شهر 21, سمو 381, أرض 461).
- Each lemma marks as many words as it counts. No word holds the same lemma twice.
- Prefixes (و ف ب ل ك ال), the 3,277 separate pronouns and the 30 opening letters carry no lemma, so they are not counted.
  The basmala counts once, in al-Fatiha 1:1.
- 30 lemmas share a spelling. The corpus numbers them, which read as «عصا ١» (27 times, the verb "disobey") and
  «عصا ٢» (10, the staff). `SHARED_SPELLINGS` in `src/lib/quran/lemmas.ts` names each one instead; the website uses
  the same names.
- The reader's 1441 Madinah mushaf spaces seven ayat differently from the corpus text («بعد ما» in 2:181, 8:6, 13:37;
  «إل ياسين» in 37:130; «لوما» in 15:7; «مالي» in 27:20 and 36:22). `corpusWords` maps them, and a test walks all
  6,236 ayat. The ۞ mark is not a word.

## Counts about the text, not the reader

Every number is about the Quran's text and is the same for everyone. Nothing counts what a reader read, saved or
memorized, and nothing is stored.
