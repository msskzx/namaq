# Al-Zubayr re-parse: what the entry states and what it does not

Unit: `units/siyar-v4-3-az-zubayr.json` (Siyar v4, entry 3, printed pages 41-67).
Source: Risalah third edition, witness `siyar-alam-al-nubala-risalah`.
Read page by page with the editor's footnotes; each value below cites its page anchor.

## Changes in this pass

- `fullName` closes in the diff, not in the span. `sp_zb2` stays without the
  printed period, since a final full stop is not part of a name, and the diff
  ignores a trailing period when it compares. The span keeps the book's `ابْنِ`;
  `joinName` renders `بنِ` in the model view by code (`src/lib/model/name.ts`).
- New `sp_sabiqoon` (p62): `وَمِنَ السَّابِقِيْنَ الأَوَّلِيْنَ`, from the author's
  own `قُلْتُ` analysis. New statement `st_sabiqoon` and title assertion
  `a_title_sabiqoon` (`al-sabiqoon`).
- New `sp_death_place` (p64): `وَادِي السِّبَاعِ`, with `:` as suffix so the
  short quote resolves once. New statement `st_death_place` and `a_death_place`
  (`died.place`).
- Nothing else added. Virtues stay limited to the author's narration; quoted
  speech never becomes a virtue ([ADR 0024](../../../docs/adr/0024-read-the-text-and-stop-where-it-is-unclear.md)).

## Classified diff (`npm run model:diff -- az-zubayr-ibn-al-awwam`)

- `fullName`: same. The diff ignores the catalog's final full stop. Book view keeps `ابْنِ قُصَيِّ`;
  the joined model form gives `بنِ قُصَيِّ` by code.
- `kunya`: same (`أَبُو عَبْدِ اللهِ`, p41).
- `appearance`: different in shape, both sides supported. The catalog merges
  the author's sentence (p42) with Urwah's `أَشْعَرَ` (p45) into one value;
  the model keeps the two observations separate (`sp_app_author`,
  `sp_app_urwa`). No change; the difference is presentation.
- `placeOfDeathArabic`: same. Closed this pass via the p64 gloss
  (`وَادِي السِّبَاعِ: عَلَى سَبْعَةِ فَرَاسِخَ مِنَ البَصْرَةِ`); the p61 burial
  sentence (`وَدُفِنَ بِوَادِي السِّبَاعِ`) says the same.
- `sex`: same. `deathYearHijri`: same (36, p64).
- `titles`: different, by decision. The model now holds the four the entry
  states: `hawari-al-ummah`, `the-ten-promised-paradise`, `the-six-of-the-shura`
  (all p41 epithets) and `al-sabiqoon` (p62 author analysis). The catalog's two
  remaining extras are unsupported by the text: `companion` is never stated as
  a title, and `al-sabiqoon` appears twice (a duplicate, not a second title).
- `virtues`: different, by rule. The model holds the one author-narrated deed,
  `أَوَّلُ مَنْ سَلَّ سَيْفَهُ فِي سَبِيْلِ اللهِ` (p41). The catalog's long value
  folds in quoted speech (the Prophet's hawari sayings, the `فِدَاكَ أَبِي
وَأُمِّي` scene); quoted speech never enters virtues, so it is not copied.
- `parents`: same (al-Awwam from the nasab line, Safiyyah from p41).
  `spouses`: different, by addition. The model holds Asma (p64) and the three
  further wives the same sentence names, `عَاتِكَةُ أُخْتُ سَعِيْدِ بنِ زَيْدٍ`,
  `أُمُّ خَالِدٍ بِنْتُ خَالِدِ بنِ سَعِيْدٍ` and `أُمُّ مُصْعَبٍ الكَلْبِيَّةُ`. The
  catalog has only Asma, and none of the three has a catalog person yet, so
  they stay unidentified mentions.
- `cousins`: same. The Prophet rests on `الزُّبَيْرُ ابْنُ عَمَّتِي` (p48). Hakim
  ibn Hizam is carried as a legacy assertion: his father Hizam and al-Awwam were
  brothers, so the catalog is right, but this entry does not state the tie.
  Hakim only calls Abd Allah `يَا ابْنَ أَخِي` (p66), and the name on that page
  identifies him. The assertion stays legacy until Hakim's own entry supplies
  the nasab line.
- `companionOf`: same. `مَا فَارَقْتُهُ مُنْذُ أَسْلَمْتُ` (p43), answering the
  question about the Prophet, rests the new `COMPANION_OF` assertion
  ([ADR 0026](../../../docs/adr/0026-companionship-and-verses-about-a-person-are-predicates.md)).
- `ayat`: same. Aisha's report on Al Imran 172 (p47) rests the new `ABOUT_AYAH`
  assertion.
- `islam.age` (16, 8), `PARTICIPATED_IN` (Badr, Yarmuk, Khandaq, Fath Makkah):
  model-only. Extra model evidence; the diff has no catalog counterpart.

## Coverage (hand list; `model:coverage` does not exist yet)

Covered sentences: heading and nasab (p41), epithets with kunya (p41), Islam
age 16 (p41), Urwah age-8 report with frame and isnad (p41), author appearance
(p42), Urwah appearance with frame and isnad (p45), Badr riders with isnad
(p46), cousin hadith with frame and isnad (p48), Khandaq blow with isnad
(p51), Fath Makkah standards with isnad (p51), three wounds with isnad (p52),
death month and year with frame (p64), death-place gloss (p64), the four marriages
with frame (p64), the companionship reply (p43), Aisha's Al Imran 172 report (p47), sabiqoon clause from the author analysis (p62).

Not modeled, by page (date sentences: `time-layer`; fight outcomes: `outcome`):

- p41: the sword-drawn anecdote (`فَخَرَجَ ... بِيَدِهِ السَّيْفُ`) and its
  dialogue; transmitted narrative, quoted speech kept as text.
- p42: end of the anecdote with the Prophet's question and answer (quoted
  speech); `رَوَى أَحَادِيْثَ يَسِيْرَةً` (needs a predicate); the transmitters
  list and the Bukhari/Muslim hadith counts (names stay text; counts need a
  predicate).
- p43-44: the `مَنْ كَذَبَ عَلَيَّ` isnads and wording (quoted speech); the
  `مَا فَارَقْتُهُ مُنْذُ أَسْلَمْتُ` reply (owner decision, see above);
  the single-birth-year remarks (`time-layer`); the hijra at eighteen and the
  uncle's torment with `لاَ أَرْجِعُ إِلَى الكُفْرِ أَبَداً` (`time-layer`,
  quoted speech).
- p45: Safiyyah's beating and the two rajaz passages (transmitted poetry);
  Ibn Ishaq's five converts at Abu Bakr's hands (event link, needs a
  predicate); the fighting age that spills to p46 (`time-layer`).
- p46: the yellow turban and angels reports (transmitted marvels).
- p47: Amir ibn Salih's verses (poetry); the Abyssinia hijra (event link,
  needs a predicate); Aisha's ayah report and the pursuit narrative
  (ayah needs a predicate and an ADR; pursuit `outcome`).
- p48-49: the hawari hadiths (quoted speech, never virtues); the lexical
  glosses of `الحَوَارِيُّ` (commentary, not modeled).
- p50: the gathered-parents reports (quoted speech, never virtues); the
  Khawthara dialogue (quoted speech); the Banu Qurayzah sighting (transmitted;
  no new assertion this pass).
- p51: the sword-praise exchange (quoted speech); Asma's brocade arms
  (transmitted object, no predicate); the weak-isnad note (editor note).
- p52: the silk cloak (no predicate); `مَا تَخَلَّفْتُ عَنْ غَزْوَةٍ` (broad
  attendance claim, not modeled); al-Thawri's trio saying (transmitted
  speech); the chest wounds and sword-flaw dialogue (`outcome`, quoted
  speech).
- p53: the Hira hadith (quoted speech); cross-references to other entries.
- p54: the Paradise-neighbour hadith (quoted speech); Umar's shura-six
  (duplicate support for a held title, not separately asserted); the Uthman
  nomination dialogue (quoted speech).
- p55: Umar's bequest fragment and the seven-companion wasiyya (event, no
  predicate); the Egypt campaign (event, needs a predicate); the
  prayer-lightness exchange (quoted speech).
- p56: the thousand slaves and kharaj (no predicate); the Asma/Hassan
  gathering and Hassan's verses (quoted speech, poetry).
- p57: the house sale (wealth, no predicate); the diwan erasure
  (`time-layer`); the Anfal-verse answer (ayah, needs a predicate and an ADR).
- p58-60: the Jamal withdrawal and killing narratives (`outcome`); the elegiac
  verses (poetry).
- p61: the killing details and the head brought to Ali (`outcome`); `قَاتِلَ
الزُّبَيْرِ فِي النَّارِ` (quoted speech).
- p62: al-Sha'bi's five hundred (transmitted tally); the rest of the author
  analysis beyond the sabiqoon clause (ten, Badri, Ridwan, shahada reasons and
  `فَنَحْنُ مُحِبُّوْنَ لَهُم` stance, not separately asserted); the Badr duel
  and spear history (`outcome`).
- p63: the charge and wounds (`outcome`); the Yamama dating (`time-layer`,
  author inference with `إِنْ شَاءَ اللهُ`); the `قَائِدَ فِتْنَةٍ` report with
  the author's `مَعَاذَ الله` rejection (deliberately not modeled); the elegy
  line naming the valley (poetry; the prose gloss carries the place instead).
- p64: the opening elegy verses (poetry); the competing death ages (`خَمْسُوْنَ`
  reports, `time-layer:waiting`, no age held); the debt counsel (wealth, no predicate).
- p65-67: the estate, debt and inheritance saga including the four-year
  announcement (wealth, no predicate); the `ابْنَ أَخِي` passage (it
  identifies Hakim; the tie is carried as legacy, see cousins); Atika's share and elegy (no predicate; poetry);
  the hadith-count colophon (no predicate).

Footnotes on the cited pages (41, 42, 45, 48, 61, 62, 64) are takhrij and rijal
notes; they settle no new name and add no assertion.
