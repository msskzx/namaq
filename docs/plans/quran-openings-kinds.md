# Surah openings by kind

Owner, 2026-11-13: rework `/quran/openings` and compare the beginnings of surahs. Built for the website and the phone app from one file, `shared/quran/openingKinds.ts`.

## The ten kinds

Al-Suyuti, al-Itqan, النوع الستون في فواتح السور, after Abu Shama (al-Zarkashi gives the same list in al-Burhan): God opened the surahs with ten kinds of speech, and no surah falls outside them. Praise (14: tahmid 5, tabarak 2, tasbih 7), the separate letters (29), a call (10), a statement (23), an oath (15), a condition (7), a command (6), a question (6), a supplication (3), a reason clause (1). Every surah sits in exactly one kind, and the 114 are covered (tested). Al-Suyuti names the surahs for most kinds. For the letters, tahmid and tabarak he only gives the counts, and the surahs follow from the text. The Shamela edition's list of questions names five, though the count says six. The sixth is al-Insan («هل أتى»). Source: al-Itqan, ed. Muhammad Abu al-Fadl Ibrahim (al-Hay'a al-Misriyya al-'Amma lil-Kitab, 1974), vol. 3 pp. 361-363, https://shamela.ws/book/11728/1125. The help sheet quotes his sentence for each kind word for word with its page (`ITQAN_QUOTES`). Checked 2026-11-16: every surah he names sits under the kind he names it for.

## Cards

Owner, 2026-11-16: the cards follow al-Suyuti's own groups wherever he gives them, and each such card quotes him with its page (`refs` in `OPENING_CARDS`). The call kind is his two fives from al-Itqan («نداء الرسول ﷺ», «نداء الأمة»), and the oath kind is his split by what is sworn by (the heavens, what goes with them, the wind, and one surah each for the rest, labelled as he labels them). Inside the letters kind the groups and names come from Tanasuq al-Durar: ذوات الر، الطواسين، مريم وطه، the الم surahs, and الزمر والحواميم. That last card holds al-Zumar (a statement) and the seven Ha-Mims in two labelled parts (`parts`), because al-Suyuti joins them by «تنزيل الكتاب» (p. 129). A card with no quote under its title is our own grouping, and the page's legend says so. Each kind's quote from al-Itqan sits under the kind's heading, collapsed to its page (`Reference`, web and app).

- Opening: the first ayah. When that ayah has two words or fewer (the letters, «والصافات صفا»), the next ayah is added too. The Fatiha uses 1:2, after the basmala.
- Colour: the rule every view uses (`sharedByAll`, ADR 0037): a word every surah on the card shares is coloured by its likeness, one only some share is faded, as in the matrix. Cards of surahs that stand alone colour nothing.
- Rows over 16 words show their first 12 and «…». The surah name opens the mushaf. The share and expand buttons sit under the card.
- The «إذا السماء» card (81, 82, 84) expands to the conditions and their answer, with the notes on the answer inside the card. 82's answer is our reading, and 84's is disputed.

The surah order page links a surah to its card (`openingLike`). The openings quiz (#709) is linked from the page's pen button.
