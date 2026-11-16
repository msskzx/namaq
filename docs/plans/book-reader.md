# Book reader

The owner asked for this on 2026-11-16 and agreed to the sketch at `/mnt/project-files/book-reader/sketch-light.png`.

## What it does

- The Quran hub has a «الكتب» tile. It opens a shelf of every book the app reads: al-Sa'di (comes with the app), al-'Ukbari and al-Kashshaf (downloads), and Tuhfat al-Atfal, which opens its own poem page. A book that is not on the phone shows its download button. Under a book the shelf shows only the reader's فاصلة, never a count of pages read.
- A book turns page by page as its printed edition runs. One screen is one printed page with its page number at the bottom. A swipe turns it, following the finger, with the mushaf's pager (`ReaderPager.tsx`). A long page scrolls down.
- Each passage opens with a pill naming its surah and ayat. The pill, and any Quran quote in the text, opens the mushaf at the passage's first ayah.
- A long press on a paragraph lights it and shows four buttons: save, فاصلة, open in the mushaf, and share.
- One sheet holds the contents (surahs with their pages), the saved paragraphs and a search through the book. The search ignores vowel marks and treats the alif, ya and ta marbuta forms alike.
- Each book sheet in the mushaf (al-Sa'di's tafsir, al-'Ukbari's i'rab, al-Kashshaf's balagha) has a book button that opens the book at the passage on that ayah.

## Two marks, never one

The owner's rule:

- A saved paragraph, or a saved ayah in the mushaf, is a bookmark. A reader keeps as many as they like.
- The «فاصلة» is where the reader stopped. The reader sets it, from the long-press buttons, and nothing else moves it. There is one for the mushaf and one for each book (`reading-fasila`).
- The page last open is kept by itself (`reader-place` in the mushaf, `book-last` for books), so the reader opens where it was left. Peeking at another page moves that and never the فاصلة.
- Away from the فاصلة's page, a button «عُد إلى فاصلتك» goes back to it. In the mushaf it shows with the bars (a tap), so it never covers the page's last line.

The marks are in `shared/readingMarks.ts`, so the website can keep them the same way.

## Pages

The books' data keeps passages, not pages. `npm run quran:book-pages` reads the same Quranpedia dumps again and finds where each printed page starts inside the passages by its first letters (record R0051). It writes `shared/data/quran/bookPages.json`. Run it after rebuilding any of the three books. `shared/bookReader.ts` lays the pages out, finds a page by place, splits paragraphs and searches.

## Not yet

- The website's book reader and its mushaf فاصلة.
- Al-Itqan joins the shelf once its thread adds the book.
