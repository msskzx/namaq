# Surah openings by kind

Owner, 2026-11-13: rework `/quran/openings` and compare the beginnings of surahs. Built for the website and the phone app from one file, `shared/quran/openingKinds.ts`.

## The ten kinds

Al-Suyuti, al-Itqan, النوع الستون في فواتح السور, after Abu Shama (al-Zarkashi gives the same list in al-Burhan): God opened the surahs with ten kinds of speech, and no surah falls outside them. Praise (14: tahmid 5, tabarak 2, tasbih 7), the separate letters (29), a call (10), a statement (23), an oath (15), a condition (7), a command (6), a question (6), a supplication (3), a reason clause (1). Every surah sits in exactly one kind, and the 114 are covered (tested). Al-Suyuti names the surahs for most kinds. For the letters, tahmid and tabarak he only gives the counts, and the surahs follow from the text. The Shamela edition's list of questions names five, though the count says six. The sixth is al-Insan («هل أتى»). Source: https://shamela.ws/book/11728/1125

## Cards

Inside a kind, surahs whose openings look alike share a card. The grouping is ours, and the help sheet says so. A card may take a surah from another kind when its opening is the same wording (الزمر in the حم card, tagged «الخبر»). The surahs of a kind that resemble none of the others share one «وحدها» card.

- Opening: the first ayah. When that ayah has two words or fewer (the letters, «والصافات صفا»), the next ayah is added too. The Fatiha uses 1:2, after the basmala.
- Colour: a word is coloured when no other row of the card has it on their longest common run of words (normalized letters). A card whose rows share less than one word on average is alike in form only, so it colours nothing (`saffat`). «وحدها» cards colour nothing either.
- Rows over 16 words show their first 12 and «…». The surah name opens the mushaf.
- The «إذا السماء» card (81, 82, 84) expands to the earlier page's conditions and their answer. 82's answer is our reading, and 84's is disputed. The explanation is in the help.

The surah order page links a surah to its card (`openingLike`). The openings quiz (#709) is linked from the page's pen button.
