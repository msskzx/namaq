# Quran mushaf fonts

The reader at `/quran/read` sets the Quran in the King Fahd Complex's KFGQPC
HAFS Uthmanic Script font (version 18). It is one Unicode font for all pages.
Its licence lets anyone use, copy and distribute it free of charge, unchanged.

The printed Madinah mushaf fills every line by stretching letters (kashida).
A single web font cannot do that, so the reader stretches or squeezes each
line slightly and lets a few short lines keep small gaps between words.

## Page fonts that copy the print exactly

The Complex also makes page fonts: one font per page (or a few dozen fonts for
the whole mushaf), where each word is a glyph drawn as it is printed, kashida
included. Text set in them looks the same as the printed page.

- QCF4, the 1441 edition (calligraphy by Uthman Taha), packaged with line data
  in the npm package `quran-qcf4`.
- The QPC V4 page fonts published by the Quranic Universal Library:
  https://qul.tarteel.ai/resources/font

These files are © King Fahd Glorious Qur'an Printing Complex, all rights
reserved. Their notices forbid redistribution or publishing without the
Complex's prior permission, and serving them from Namaq is redistribution.
Namaq does not use them.

## Asking for permission

The owner may ask the Complex for permission later. Requests go through the
Complex's page for developers, which also lists its fonts and Quran data:
https://qurancomplex.gov.sa/en/techquran/dev/

With permission, the reader could draw each word from the page fonts using
the glyph codes in `quran-qcf4` and drop the line stretching.
