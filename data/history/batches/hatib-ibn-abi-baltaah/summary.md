# Hatib ibn Abi Balta'ah — extraction summary

**Source**: سير أعلام النبلاء (Siyar A'lam al-Nubala'), vol. 5, pp. 43–45, entry 9
**Extracted**: 2026-10-01 from shamela.ws/book/10906/2023–2025
**Subject**: حاطب بن أبي بلتعة (Hatib ibn Abi Balta'ah)
**Subject kind**: PERSON

## Claims authored (18)

| Key | Type | Target | Excerpt |
|-----|------|--------|---------|
| full-name | field fullName | — | حاطب بن أبي بلتعة عمرو بن عمير بن سلمة اللخمي |
| sex | field sex | — | MALE — وكان تاجراً في الطعام، له عبيد |
| kunya | field kunya | — | أبو بلتعة |
| tribal-affiliation | field tribalAffiliation | — | المَكِّيُّ، حَلِيْفُ بَنِي أَسَدِ بنِ عَبْدِ العُزَّى بنِ قُصَيٍّ |
| titles | field titles | — | مِنْ مَشَاهِيْرِ المُهَاجِرِيْنَ |
| appearance | field appearance | — | كان حسن الجسم، خفيف اللحية، أجنى… قاله الواقدي |
| father | relation SON | amr-ibn-umayr-al-lakhmi | حاطب بن أبي بلتعة عمرو بن عمير بن سلمة اللخمي |
| father-of-amr | relation SON (subject: عمرو بن عمير) | umayr-ibn-salamah-al-lakhmi | حاطب بن أبي بلتعة عمرو بن عمير بن سلمة اللخمي |
| virtues-messenger | field virtues | — | كان رسول النبي إلى المقوقس، صاحب مصر |
| virtues-trade | field virtues | — | وكان تاجراً في الطعام، له عبيد |
| virtues-archer | field virtues | — | وكان من الرماة الموصوفين |
| virtues-uhud | field virtues | — | (رَضِيَ اللهُ عَنْكَ)، مَرَّتَيْنِ — وإسنادٌ مظلمٌ |
| virtues-fire | field virtues | — | كَذَبْتَ، لاَ يَدْخُلُهَا أَبَداً — وصحيحٌ |
| virtues-letter | field virtues | — | كتب إلى كفار قريش كتاباً… لا، إنه قد شهد بدراً |
| badr | relation PARTICIPATED_IN | badr | شَهِدَ بَدْراً وَالمَشَاهِدَ |
| uhud | relation PARTICIPATED_IN | uhud | فَضَرَبْتُهُ بِالسَّيْفِ، فَطَرَحْتُ رَأْسَهُ |
| hudaybiyyah | relation PARTICIPATED_IN | hudaybiyyah | وَقَدْ شَهِدَ بَدْراً وَالحُدَيْبِيَةَ |
| death-year | field deathYearHijri | — | وَمَاتَ حَاطِبٌ سَنَةَ ثَمَلاَثِيْنَ |

## Confirmed absent from this account

- **wives** — nothing on marriage; the only people the entry puts around him are `لَهُ عَبِيْدٌ` and `عَبْداً لِحَاطِبٍ`, a slave of his who brought a complaint against him
- **siblings** — no brother or sister is named anywhere in the entry

## Notes

- The entry runs printed pp. 43–45 of volume 5 (سير أعلام النبلاء ج٢, Shamela part 2, ids 2023–2025). Page 43 shares its top with the closing paragraphs of أشعث بن قيس above it, so the store holds the whole page; entry 10, أبو ذر, opens on p. 46.
- The volume was checked against the pages' own extraction ids rather than taken on trust: id 2023 prints p. 43 and the part-2 offset holds across the whole part (printed p. 5 = id 1985), which is what makes part 2 this edition's volume 5 (`الجزء ٢` on the host, volume 5 in `source.json`).
- `fullName` moves off the legacy marker onto a value the entry supports, and it is not the retired seed's: the heading gives the kunya and the real name together (حاطب بن أبي بلتعة عمرو بن عمير بن سلمة اللخمي), where the seed had dropped أبي بلتعة. `المكي، حليف بني أسد…` was in the seed's fullName too and now sits on `tribalAffiliation`, which is where a name like it belongs. Nothing contradicts the seed; the entry carries more.
- The `son of` edge to عمرو بن عمير بن سلمة اللخمي is now cited rather than legacy: the heading names him as the father. He and his father عمير بن سلمة are graph-only people, and the chain stops there.
- **The letter to Quraysh** is the entry's best-known passage, and `fath-makkah` exists as a battle — but the entry never says he was at the conquest, so no participation is added. The episode is recorded in `virtues` instead: the Prophet's refusal to let Umar kill him, in his own words. There is no event in the catalog for the letter itself, and an event is not invented for it here.
- The Uhud report is al-Dhahabi's, carried by هارون بن يحيى الحاطبي and أبو ربيعة, and he grades it إسنادٌ مظلمٌ. The grade rides on the claim rather than being dropped, and the killing of عتبة بن أبي واص — named in the entry, with no catalog entry of his own — stays in the source text rather than becoming a node.
- `deathYearHijri` 30 comes from the entry's own closing line. The تُوُفِّيَ: سَنَةَ ثَمَانٍ وَسِتِّيْنَ immediately above it is his son عبد الرحمن بن حاطب, not him, and is left in the page.
- عبد الرحمن بن حاطب and his report (`مِمَّنْ وُلِدَ فِي حَيَاةِ النَّبِيِّ وَلَهُ رُؤْيَةٌ`) stay in the source text: neither has a catalog entry, so no FATHER edge is authorable, and the narrator list below him is a transmission chain.
- His clients' complaint to Umar about his spending on them (`وَقَدْ أَتَى بَعْضُ مَوَالِيْهِ إِلَى عُمَرَ… فَلاَمَهُ فِي ذَلِكَ`) is not manaqeb and the catalog holds no field for it; it stays in the store page.

## Ledger: legacy values this batch walked past

`npm run catalog:ledger -- --batch …` reports values still owed on the subjects
these claims point at. Each one was looked at and left on the marker, because
the entry says nothing that settles it:

- `people/amr-ibn-umayr-al-lakhmi` — his `sex` stays legacy. The heading names him, which is the same class of evidence `khadijah-siyar/father` left on `khuwaylid-ibn-asad`; his `SON` edge to عمير بن سلمة is now cited from this entry's heading.
- `people/umayr-ibn-salamah-al-lakhmi` — his `FATHER` edge back to عمرو is the same heading cited from his own side, so it stays on the marker rather than being restated as a third claim; `catalog:project-graph` writes the reciprocal anyway. His `sex` is likewise left.
- `battles/badr` and `battles/uhud` `fields.location`, and the `legacyUnreviewed` participants of `badr`, `uhud` and `hudaybiyyah` (أبو بكر, عمر, عثمان, العباس) — the entry places حاطب at these three battles and names Umar once, in the letter, which says nothing about where Umar stood. Nothing here settles those values.

All claims are `NOT_REVIEWED` — the batch carries no approval block.