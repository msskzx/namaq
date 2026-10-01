# Summary: عباد بن بشر (Siyar A'lam al-Nubala', vol 4, pp. 337-340)

## Source
**Siyar A'lam al-Nubala'** by al-Dhahabi, vol 4 (سير أعلام النبلاء ج١), pp. 337-340 (entry 73). Edition: دار الرسالة, 3rd ed. 1405/1985. Digital: المكتبة الشاملة (shamela.ws/book/10906/1763 for p. 337, /1764 for p. 338, /1765 for p. 339, /1766 for p. 340). Shamela's الجزء ١ is this edition's volume 4 (its الجزء count skips the two sira volumes and the caliph volume bound before the Siyar proper), so the worktree's volume 4 stands as declared — verified live against shamela.ws.

## Extracted Content
The entry spans four printed pages and opens at the top of p. 337, so nothing is cut on the near side. The far side is shared: p. 340 carries the entry's last nine paragraphs — the poem's remaining lines and the closing hadith — before Usayd ibn al-Hudayr's entry (entry 74) opens on the same page. Anchors checked against paragraph counts: 8 + 12 + 10 + 9 paragraphs, running 4/337-p1 through 4/340-p9:

- **Header** (337-p1..p3): "٧٣ - عَبَّادُ بنُ بِشْرِ بنِ وَقْشِ بنِ زُغْبَةَ بنِ زَعُوْرَاءَ الأَنْصَارِيُّ" — "ابْنِ عَبْدِ الأَشْهَلِ الإِمَامُ، أَبُو الرَّبِيْعِ" — "أَحَدُ البَدْرِيِّيْنَ، كَانَ مِنْ سَادَةِ الأَوْسِ".
- **Forty-five years and the staff** (337-p4): lifespan 45, the staff that lit his way home from the Prophet.
- **Islam and Ka'b** (337-p5): Islam at Mus'ab ibn Umayr's hands; among Ka'b ibn al-Ashraf's killers.
- **Appointments and Tabuk** (337-p6): sadaqat over Muzaynah and Banu Sulaym; the Prophet's guard at Tabuk; Yamama valor.
- **Aisha's three** (337-p8..338-p1, one selection across the page turn): three Ansaris none outdoes in merit — Sa'd ibn Mu'adh, Abbad, Usayd ibn Hudayr.
- **Pact-brotherhood** (338-p2): between him and Abu Hudhayfah ibn Utbah — wording carried inside virtues; no separate relation claim.
- **Dream of the sky** (338-p5), **Yamama death** (338-p6: "احْطِمُوا جُفُوْنَ السُّيُوْفِ", killed by face wounds).
- **Night voice and prayer** (338-p8..p10): the Prophet hears him praying Tahajjud-time, "اللهم اغفر له".
- **Shi'ar hadith** (338-p11..p12, 340-p8..p9): "أنتم الشعار والناس الدثار", closing with "فلا أوتين من قبلكم" — narration, not a profile value.
- **Grandfather dispute** (339-p1..p3): Ali ibn al-Madini remembers only "عباد بن بشر بن قيظي الأشهلي"; Ibn al-Athir calls the grandfather's name garbled, then gives the وقش chain extended to al-Aws.
- **Martyrdom** (339-p4): "استشهد يوم اليمامة".
- **The other Abbad** (339-p5..p6): Abbad ibn Bishr ibn Qayzi of Banu Harithah — a different man, no node.
- **Poem** (339-p9..340-p7): his verses on the Ka'b night; the الاستيعاب prints one extra line, noted in footnotes, not reconstructed.

## Claims Authored (10)
| Key | Type | Confidence |
|-----|------|------------|
| abbad-ibn-bishr-siyar73/full-name | field: fullName | ESTABLISHED |
| abbad-ibn-bishr-siyar73/father | relation: SON (bishr-ibn-waqsh) | ESTABLISHED |
| abbad-ibn-bishr-siyar73/kunya | field: kunya | ESTABLISHED |
| abbad-ibn-bishr-siyar73/tribal-affiliation | field: tribalAffiliation | ESTABLISHED |
| abbad-ibn-bishr-siyar73/titles | field: titles (companion) | ESTABLISHED |
| abbad-ibn-bishr-siyar73/virtues | field: virtues | ESTABLISHED |
| abbad-ibn-bishr-siyar73/badr | relation: PARTICIPATED_IN (badr) | ESTABLISHED |
| abbad-ibn-bishr-siyar73/tabuk | relation: PARTICIPATED_IN (tabuk) | ESTABLISHED |
| abbad-ibn-bishr-siyar73/kaab-ashraf | relation: INVOLVED_IN (killing-of-kaab-ibn-al-ashraf) | ESTABLISHED |
| abbad-ibn-bishr-siyar73/death-place | field: placeOfDeathArabic | ESTABLISHED |

Claim keys carry siyar73: the worktree draft tagged them siyar74, but 74 is Usayd ibn al-Hudayr's entry number (his batch already owns siyar74 keys). Renamed throughout, including the four catalog carriers.

## Not in Source
- **appearance**: no physical description (grep for طويل/أسمر/القصير/الأدمة/أفطس/أبيض hits nothing)
- **wives**: no marriage mentioned (grep for تزوج/امرأة/زوج/نكح/خطب hits nothing in body; the one تزوج in the notes is about Ka'b's father)
- **siblings**: no sibling named (grep for أخو/أخت/شقيق hits nothing)

These are recorded in `account.notInSource`. The entry was read in full across all four pages.

## Discrepancy in the source
The entry disputes the grandfather's name (339-p1..p3): Ibn al-Madini's قيظي against Ibn al-Athir's وقش with a تخبيط admission. The batch's fullName takes the reading al-Dhahabi's own header carries (وقش) and nothing is resolved; the rival reading stays in the store page, where the source has it. The second Abbad ibn Bishr ibn Qayzi of Banu Harithah (339-p5..p6) is a different man and gets no node.

## Legacy values visited
The catalog entry carried four legacy values: sex MALE stays legacy (the entry never states it outright); fullName promoted (nisba labels moved to tribalAffiliation, with البدري new from the source); companion title promoted on أحد البدريين; SON → bishr-ibn-waqsh promoted (his own module untouched until a batch reads his entry).

## Battle and event registration
Badr and Tabuk participations live in the battle files, not the person file: badr.ts gains him on أحد البدريين (PARTICIPATED_IN, no status — his martyrdom was at Yamama, recorded as placeOfDeathArabic per ADR 0013); tabuk.ts gains him with the guard summary in the entry's wording. The Ka'b killing lives in the event file alongside Muhammad ibn Maslamah and Abu Abs.

## Not modelled
Lifespan 45 (a duration, not a death year — no deathYearHijri written); the poem and hadith chains (preserved page by page, backing no field the model holds); the pact-brotherhood wording (inside virtues, no relation claim); the second Abbad (different man, no node). All stay in the store pages.
