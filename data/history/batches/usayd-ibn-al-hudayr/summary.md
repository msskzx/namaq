# Usayd ibn al-Hudayr — extraction summary

**Source**: سير أعلام النبلاء (Siyar A'lam al-Nubala'), vol. 4, pp. 340–343
**Extracted**: 2026-10-01 from shamela.ws/book/10906/1766–1769
**Subject**: أسيد بن الحضير (Usayd ibn al-Hudayr)
**Subject kind**: PERSON

## Claims authored (10)

| Key | Type | Target | Excerpt |
|-----|------|--------|---------|
| full-name | field fullName | — | أُسَيْدُ بنُ الحُضَيْرِ بنِ سِمَاكِ بنِ عَتِيْكٍ ... ابْنِ نَافِعِ بنِ امْرِئِ القَيْسِ بنِ زَيْدِ بنِ عَبْدِ الأَشْهَلِ |
| father | relation SON | al-hudayr-ibn-simak | أُسَيْدُ بنُ الحُضَيْرِ بنِ سِمَاكِ |
| kunya | field kunya | — | الإِمَامُ أَبُو يَحْيَى - وَقِيْلَ: أَبُو عَتِيْكٍ |
| tribal-affiliation | field tribalAffiliation | — | الأَنْصَارِيُّ، الأَوْسِيُّ، الأَشْهَلِيُّ |
| titles | field titles | — | أَحَدُ النُّقَبَاءِ الاثْنَيْ عَشَرَ لَيْلَةَ العَقَبَةِ، أَسْلَمَ قَدِيْماً — صحابي |
| sex | field sex | — | MALE — الإِمَامُ … أَسْلَمَ قَدِيْماً |
| virtues | field virtues | — | النقيب، عقلاء الأشراف، المؤاخاة مع زيد، نعم الرجل، الصوت بالقرآن، الثلاثة، المزاح، الجابية، الدين، البقيع، بدر، أحد |
| badr-absence | relation ABSENT_FROM | badr | مَا شَهِدَ بَدْراً … ظَنَنْتُ أَنَّهَا العِيْرُ |
| uhud | relation PARTICIPATED_IN | uhud | وَقَدْ جُرِحَ يَوْمَ أُحُدٍ سَبْعَ جِرَاحَاتٍ |
| death-year | field deathYearHijri | — | مَاتَ أُسَيْدٌ سَنَةَ عِشْرِيْنَ |

## Confirmed absent from this account

- **appearance** — no physical description present
- **wives** — no spouse mentioned
- **siblings** — no brothers/sisters mentioned

## Notes

- The entry opens mid-page: printed p. 340 carries the عباد بن بشر tail first, and أسيد opens at its own `p10`. The store page holds the whole printed page, so the derived anchors run `4/340-p10`–`p11` for the heading and nasab.
- The legacy catalog `fullName` ran the chain into the nisba labels; the chain ends at بن عبد الأشهل, so the nisbas moved to `tribalAffiliation`.
- The kunya carries the variant: أبو يحيى، وقيل أبو عتيك.
- The مؤاخاة with زيد بن حارثة goes into virtues, not a relation — the way the عباد batch handled his pact.
- `رَوَتْ عَنْهُ` is transmission; no narrator becomes a node or edge.
- `حَمَلَهُ عُمَرُ … حَتَّى وَضَعَهُ بِالبَقِيْعِ` records his burial, not where he died, so no `placeOfDeathArabic`; the honour stays in virtues.
- The editor corrects the print's `بدر` to `أحد` from الاستيعاب on the wound report.
- The father's module is untouched; his values stay legacy until his own entry is read.

All claims are `NOT_REVIEWED` — the batch carries no approval block.
