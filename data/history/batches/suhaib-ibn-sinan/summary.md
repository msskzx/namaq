# Suhaib ibn Sinan — extraction summary

**Source**: سير أعلام النبلاء (Siyar A'lam al-Nubala'), vol. 5, pp. 17–26
**Extracted**: 2026-10-01 from shamela.ws/book/10906/1997–2006
**Subject**: صهيب بن سنان (Suhaib ibn Sinan al-Rumi)
**Subject kind**: PERSON

## Claims authored (11)

| Key | Type | Target | Excerpt |
|-----|------|--------|---------|
| full-name | field fullName | — | صُهَيْبُ بنُ سِنَانٍ أَبُو يَحْيَى النَّمِرِيُّ / full Ibn Asakir chain |
| sex | field sex | — | MALE — أَبُو يَحْيَى النَّمِرِيُّ … البَدْرِيُّ المُهَاجِرِيُّ |
| kunya | field kunya | — | كَنَّانِي النَّبِيُّ … أَبَا يَحْيَى |
| kunya-alt | field kunya DISPUTED | — | وَيُقَالُ أَبُو غَسَّانَ |
| appearance | field appearance | — | رَجُلاً أَحْمَرَ شَدِيْدَ الحُمْرَةِ لَيْسَ بِالطَّوِيْلِ |
| virtues | field virtues | — | السابقون البدريون، سابق الروم، السبعة، التعذيب والآيات، خلع المال وربح البيع، الاستنابة على الصلاة، الكرم، اعتزال الفتنة، ٣٠ حديثا |
| titles | field titles | — | مِنَ السَّابِقِيْنَ البَدْرِيِّيْنَ — صحابي |
| badr | relation PARTICIPATED_IN | badr | فِيْمَنْ شَهِدَ بَدْراً |
| father | relation SON | sinan-ibn-malik-al-namri | صُهَيْبُ بنُ سِنَانِ بنِ مَالِكِ … بنِ عَامِرٍ |
| death-year | field deathYearHijri | — | سَنَةَ ثَمَانٍ وَثَلاَثِيْنَ (بالمدينة، في شوال) |
| death-place | field placeOfDeathArabic | — | بِالمَدِيْنَةِ |

## Confirmed absent from this account

- **wives** — no تزوج/زوجة/امرأة trigger anywhere across pp. 17–26; the only فلانة is a woman holding goods in the hijrah story (5/23-p6), not a wife
- **siblings** — no أخ/أخت/شقيق trigger anywhere across pp. 17–26 (عمومتي at 5/23-p1 are the narrator's uncles, not the subject's siblings)

## Notes

- The entry runs printed pp. 17–26 (Shamela Juz 2 = edition vol. 5). Page 17 is shared with the Abu Rafi' tail above the heading and the store holds the whole page; page 26 ends the entry and Abu Talha starts on p. 27. The parked transcription (10 pages, no batch.json) was verified byte-identical against a fresh Shamela pull before structuring.
- `kunya-alt` keeps the ويقال أبو غسان report in the batch as DISPUTED, the way the سعد بن عبادة batch kept its death-year alt; the catalog takes أبو يحيى.
- The age reports (سبعين / ثلاث وسبعين / أربع وثمانين) compete and the model holds no age field; all three stay in the store pages.
- The mother سلمى بنت قعيد and the named sons (حبيب، حمزة، صيفي، سعد، عباد، صالح، محمد، عثمان…) have no catalog entries, so no mother/children edges are authorable; they stay in the store text.
- The revealed-verse reports (البقرة 207, النحل 110, الأنعام 51–58) stay in the store text; the batch cites two of them inside `virtues` but adds no Qur'an links.
- The hadith-transmitter lists stay in the store text; no narrator becomes a node or edge.

All claims are `NOT_REVIEWED` — the batch carries no approval block.
