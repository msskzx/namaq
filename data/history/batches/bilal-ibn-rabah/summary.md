# Bilal ibn Rabah — extraction summary

**Source**: سير أعلام النبلاء (Siyar A'lam al-Nubala'), vol. 4, pp. 347–360
**Extracted**: 2026-10-01 from shamela.ws/book/10906/1773–1786
**Subject**: بلال بن رباح (Bilal ibn Rabah)
**Subject kind**: PERSON

## Claims authored (9)

| Key | Type | Target | Excerpt |
|-----|------|--------|---------|
| full-name | field fullName | — | بِلاَلُ بنُ رَبَاحٍ |
| sex | field sex | — | MALE — مُؤَذِّنُ رَسُوْلِ اللهِ |
| kunya | field kunya | — | أَبُو عَبْدِ الكَرِيْمِ، وَأَبُو عَبْدِ اللهِ، وَأَبُو عَمْرٍو |
| titles | field titles | — | مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ — صحابي |
| appearance | field appearance | — | آدَمَ شَدِيْدَ الأُدْمَةِ نَحِيْفاً طُوَالاً … لاَ يُغَيِّرُ |
| virtues | field virtues | — | المؤذن، السابقون، خشخشة النعل، أول من أذن، العتق، سابق الحبشة، ٤٤ حديثا |
| badr | relation PARTICIPATED_IN | badr | شَهِدَ بَدْراً |
| death-year | field deathYearHijri | — | سَنَةَ عِشْرِيْنَ (بداريا؛ بدمشق) |
| death-year-alt | field deathYearHijri DISPUTED | — | وَقِيْلَ: مَاتَ سَنَةَ … إِحْدَى وَعِشْرِيْنَ |

## Confirmed absent from this account

- **nasab** — the heading names his father رباح, but رباح has no catalog entry, so no SON edge is authorable; the chain itself is the `fullName` claim
- **wives** — a wife is mentioned but never named (`تَقُوْلُ امْرَأَتُهُ` at 4/359-p10); the model holds no edge to an unnamed spouse
- **siblings** — al-Bukhari names his brother خالد and sister غفرة (`بِلاَلٌ أَخُو خَالِدٍ وَغُفْرَةَ` at 4/351-p5), but neither has a catalog entry, so no BROTHER/SISTER edge is authorable

## Notes

- The entry runs printed pp. 347–360. Page 347 is shared with the الطفيل tail above it and page 360 with the ابن أم مكتوم heading below; the store holds both whole pages. The death-year-alt sentence crosses the 359–360 page turn and is cited with an ellipsis at `4/359-p17`.
- `virtues` was already sira-cited (`bilal/ahad`, `bilal/persecution`), so this batch is additive: the sira sentence stays verbatim with its claims, and the Siyar manaqeb append after it under the new claim.
- The catalog takes `deathYearHijri` `20` from the two عشرين reports; the إحدى وعشرين report stays in the batch as DISPUTED, the way the سعد بن عبادة batch kept its alt.
- No death place is recorded: داريا, دمشق, باب الصغير, باب كيسان, and حلب compete across the reports, and the model holds one value. All reports stay in the store pages.
- The mother حمامة (of Banu Jumah) and the حبشي/مولد الحجاز origin reports stay in the store text; the model holds neither a mother edge without a catalog entry nor an origin field.
- The hadith-transmitter lists stay in the store text; no narrator becomes a node or edge.

All claims are `NOT_REVIEWED` — the batch carries no approval block.
