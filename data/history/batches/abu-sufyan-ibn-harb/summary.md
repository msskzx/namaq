# Abu Sufyan ibn Harb — extraction summary

**Source**: سير أعلام النبلاء (Siyar A'lam al-Nubala'), vol. 5, pp. 105–107
**Extracted**: 2026-10-01 from shamela.ws/book/10906/2085–2087
**Subject**: أبو سفيان صخر بن حرب بن أمية الأموي (Abu Sufyan ibn Harb)
**Subject kind**: PERSON

Entry 13 of الجزء ٢ (Siyar part 2 = edition volume 5): opens p. 105 with
"١٣ - أَبُو سُفْيَانَ", closes p. 107 with the death reports; p. 107 then
opens entry 14 (al-Hakam). The parked transcription in
`.claude/worktrees/abu-sufyan-ibn-harb` held only pp. 105–106 — two pages is
thin for someone this prominent, and checking Shamela showed the entry runs
onto p. 107, so the tail (p. 107, paragraphs 1–11) was transcribed from
shamela.ws/book/10906/2087 for this batch. Pages 105–106 and their notes
match the parked transcription verbatim.

## Claims authored (19)

| Key | Type | Target | Excerpt |
|-----|------|--------|---------|
| sex | field | — | رَأْسُ قُرَيْشٍ … وَكَانَ حَمْوَ النَّبِيِّ |
| full-name | field | — | صَخْرُ بنُ حَرْبِ بنِ أُمَيَّةَ … بنِ كِلاَبٍ |
| kunya | field | — | أَبُو سُفْيَانَ |
| father | relation SON | harb-ibn-umayyah | صخر بن حرب … فحرب أبوه |
| companion | field titles | — | تَدَارَكَهُ اللهُ بِالإِسْلاَمِ يَوْمَ الفَتْحِ |
| virtues | field | — | دهاة العرب؛ حسن إيمانه؛ تحريضه يوم اليرموك؛ حديث هرقل (4 citations) |
| uhud | relation PARTICIPATED_IN | BATTLE uhud | قَائِدُهُمْ يَوْمَ أُحُدٍ (pre-Islam, non-Muslim) |
| khandaq | relation PARTICIPATED_IN | BATTLE khandaq | قَائِدُهُمْ يَوْمَ الخَنْدَقِ (pre-Islam, non-Muslim) |
| fath-makkah | relation PARTICIPATED_IN | BATTLE fath-makkah | أَسْلَمَ يَوْمَ الفَتْحِ … صَلُحَ إِسْلاَمُهُ |
| hunayn | relation PARTICIPATED_IN | BATTLE hunayn | شَهِدَ حُنَيْناً؛ مائة من الإبل وأربعون أوقية يتألفه |
| taif | relation PARTICIPATED_IN | BATTLE taif | شَهِدَ قِتَالَ الطَّائِفِ، فَقُلِعَتْ عَيْنُهُ |
| yarmuk | relation PARTICIPATED_IN | BATTLE yarmuk | قلعت الأخرى؛ تحت راية ولده يزيد؛ يا نصر الله اقترب |
| father-of-yazid | relation FATHER | yazid-ibn-abi-sufyan | تحت راية ولده يزيد؛ رآه أميراً على دمشق |
| father-of-muawiyah | relation FATHER | muawiyah-ibn-abi-sufyan | رأى ولديه يزيد ثم معاوية أميرين على دمشق |
| father-in-law | relation FATHER_IN_LAW | prophet-muhammad | كَانَ حَمْوَ النَّبِيِّ؛ صِهْرُهُ |
| death-year | field deathYearHijri | — | تُوُفِّيَ بِالمَدِيْنَةِ سَنَةَ إِحْدَى وَثَلاَثِيْنَ |
| death-year-32 | field deathYearHijri, DISPUTED | — | وَقِيْلَ: سَنَةَ اثْنَتَيْنِ |
| death-year-33-34 | field deathYearHijri, DISPUTED | — | سَنَةَ ثَلاَثٍ أَوْ أَرْبَعٍ وَثَلاَثِيْنَ، وَلَهُ نَحْوُ التِّسْعِيْنَ |
| death-place | field placeOfDeathArabic | — | بِالمَدِيْنَةِ |

## Confirmed absent from this account

- **appearance** — no physical description stated.
- **wives** — no wife named. Hind bint Utbah stays `legacy-unreviewed` on
  the catalog entry; the entry never names her.
- **siblings** — no brothers/sisters stated. "ابْنُ عَمِّ أَبِي سُفْيَانَ"
  (p. 107) is said of al-Hakam in the *next* entry, not here; cousins are
  not siblings either way.

## Notes

- Uhud and Khandaq are pre-Islam commands: he led Quraysh, so both catalog
  participations carry `isMuslim: false` with no status, the way Suhail ibn
  Amr's Badr entry records a pre-Islam presence.
- Death year and the age carry three reports, kept as separate DISPUTED
  claims: 31 AH in Medina (what the catalog holds) against 32 AH per قيل,
  and 33-or-34 AH with نحو التسعين. The related age reports (أسن من رسول
  الله بعشر سنين؛ عاش بعده عشرين سنة) stay in the store pages; the model
  holds no age field, so no claims.
- "فَإِنْ صَحَّ هَذَا عَنْهُ" (p. 107) refers back to the Yarmouk
  exhortation on p. 106 — the entry's own hedge on that report, preserved
  in the store.
- The Heraclius hadith is cited only for what the entry uses it for
  (يَدُلُّ عَلَى إِيْمَانِهِ); the hadith text itself stays in the store.
- "وَكَانَ حَمْوَ النَّبِيِّ" names the Prophet, not Umm Habibah, so the
  edge goes to the Prophet as FATHER_IN_LAW (inverse SON_IN_LAW, the Abu
  Bakr precedent) rather than inventing a FATHER edge off an unnamed
  daughter. Umm Habibah's, Mu'awiyah's and Yazid's legacy edges toward him
  are untouched — reciprocity is the graph projection's job.
- Hadith-transmitter-style isnads (ابن لهيعة عن يونس عن الزهري on p. 105
  belongs to the Umayr tail) stay in the store text; no narrator becomes a
  node or edge.
- Store page v5/107.md previously held only the al-Hakam head (4
  paragraphs). This batch completes the whole printed page by prepending
  the Abu Sufyan tail (11 paragraphs); al-Hakam's three `5/107` anchors
  move to their true positions (p12/p14/p15) with identical excerpts, and
  its recorded approval no longer covers its revision — it needs
  re-approval on main.

All claims are `NOT_REVIEWED` — the batch is unapproved; approval and
`history:import` happen after review, on main, by the user.
