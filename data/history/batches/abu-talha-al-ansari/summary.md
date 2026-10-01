# Abu Talha al-Ansari — extraction summary

**Source**: سير أعلام النبلاء (Siyar A'lam al-Nubala'), vol. 5, pp. 27–34
**Extracted**: 2026-10-01 from shamela.ws/book/10906/2007–2014
**Subject**: أبو طلحة الأنصاري زيد بن سهل بن الأسود (Abu Talha al-Ansari)
**Subject kind**: PERSON

Entry 5 of الجزء ٢ (Siyar part 2 = edition volume 5): opens p. 27 with
"٥ - أَبُو طَلْحَةَ", closes p. 34; p. 35 opens entry 6 (Abu Bardah), so the
transcription is the complete entry. All 8 pages and their notes match the
parked transcription in `.claude/worktrees/abu-talha-al-ansari` verbatim.

## Claims authored (17)

| Key | Type | Target | Excerpt |
|-----|------|--------|---------|
| sex | field | — | صَاحِبُ رَسُوْلِ اللهِ … وَاسْمُهُ: زَيْدُ |
| full-name | field | — | وَاسْمُهُ: زَيْدُ بنُ سَهْلِ … النَّجَّارِيُّ |
| kunya | field | — | أَبُو طَلْحَةَ الأَنْصَارِيُّ زَيْدُ بنُ سَهْلِ بنِ الأَسْوَدِ |
| father | relation SON | sahl-ibn-al-aswad | أَبُو طَلْحَةَ … زَيْدُ بنُ سَهْلِ بنِ الأَسْوَدِ |
| titles | field | — | صَاحِبُ رَسُوْلِ اللهِ … أَحَدُ النُّقَبَاءِ الاثْنَيْ عَشَرَ |
| virtues | field | — | صَوْتُ أَبِي طَلْحَةَ فِي الجَيْشِ خَيْرٌ مِنْ فِئَةٍ (7 citations) |
| appearance | field | — | كَانَ جَلْداً، صَيِّتاً، آدَمَ، مَرْبُوْعاً، لاَ يُغَيِّرُ شَيْبَهُ |
| wife-umm-sulaym | relation HUSBAND | umm-sulaym-al-ghumaysa | فَأَسْلَمَ، وَتَزَوَّجَهَا |
| aqaba | relation PARTICIPATED_IN | EVENT second-pledge-of-aqaba | أَحَدُ النُّقَبَاءِ الاثْنَيْ عَشَرَ لَيْلَةَ العَقَبَةِ |
| badr | relation PARTICIPATED_IN | BATTLE badr | لَقَدْ سَقَطَ السَّيْفُ مِنِّي يَوْمَ بَدْرٍ |
| uhud | relation PARTICIPATED_IN | BATTLE uhud | نَحْرِي دُوْنَ نَحْرِكَ |
| hunayn | relation PARTICIPATED_IN | BATTLE hunayn | فَقَتَلَ أَبُو طَلْحَةَ يَوْمَئِذٍ عِشْرِيْنَ رَجُلاً |
| death-year | field deathYearHijri | — | مَاتَ: سَنَةَ أَرْبَعٍ وَثَلاَثِيْنَ |
| death-year-khalifah | field deathYearHijri, DISPUTED | — | وَقَالَ خَلِيْفَةُ وَحْدَهُ: سَنَةَ اثْنَتَيْنِ وَثَلاَثِيْنَ |
| death-year-51 | field deathYearHijri, DISPUTED | — | وَقِيْلَ: مَاتَ سَنَةَ إِحْدَى وَخَمْسِيْنَ |
| death-place | field placeOfDeathArabic | — | وَالأَشْهَرُ: أَنَّهُ مَاتَ بِالمَدِيْنَةِ |
| death-place-sea | field placeOfDeathArabic, DISPUTED | — | قِيْلَ: إِنَّهُ غَزَا بَحْرَ الرُّوْمِ، فَتُوُفِّيَ فِي السَّفِيْنَةِ |

## Confirmed absent from this account

- **siblings** — no brothers/sisters stated. "خُذْ عَنْ عَمِّكَ" (p. 34) is
  Anas addressing his stepfather, not a blood uncle; "مِنْ بَنِي أَخْوَالِهِ"
  (p. 27) names the clan, not a person.

## Notes

- Death year and death place each carry competing reports, kept as separate
  DISPUTED claims: 34 AH in Medina (الأشهر, what the catalog holds) against
  32 AH per Khalifah alone, 51 AH per قيل, and death at sea off Byzantium.
- The entry's {انْفِرُوا خِفَافاً وَثِقَالاً} [التوبة: 42] (p. 34) is not
  authored as an ayah claim: the printed numbering (42) does not match the
  numbering the app links verses by (41), so no clean {surah, ayah} value can
  back it without editorializing. The passage stays in the store.
- Hadith counts (نحو عشرين حديثا؛ حديثان في الصحيحين) and narrator lists are
  preserved in the store pages; the model holds no field for them, so no
  claims.
- Badr summary notes the دrowsiness report as the source gives it for Badr;
  the editor's footnote records the البخاري parallel as يوم أحد without
  adjudicating.

All claims are `NOT_REVIEWED` — the batch is unapproved; approval and
`history:import` happen after review, on main, by the user.
