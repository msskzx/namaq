# Summary — سَعْدُ بنُ مُعَاذِ بنِ النُّعْمَانِ الأَنْصَارِيُّ

Entry 56 of *سير أعلام النبلاء*, section أعيان البدريين. Printed pages
279–297, volume 4, Shamela 1705–1723. The entry is nineteen printed pages, the
longest in this run of the companion index, and it does not spill past 297:
entry 57 (زيد بن الخطاب) opens on that same page, immediately after Saad's last
paragraph (`كَانَ لِسَعْدٍ مِنَ الوَلَدِ: عَبْدُ اللهِ، وَعَمْرٌو`).

The first page is shared with entry 55 (سعد بن عبادة), whose last two
paragraphs were cut with `--start-anchor p3` at the numbered heading
`٥٦ - سَعْدُ بنُ مُعَاذِ`. The last page was cut with `--end-anchor p10` at
`كَانَ لِسَعْدٍ مِنَ الوَلَدِ`, dropping the heading of entry 57. The notes were
trimmed the same way: the `(١) ابن سعد ٣ / ٢ / ١٤٢` note on page 279 belongs to
entry 55's tail and was dropped with `--notes-start-marker "(*) طبقات ابن
سعد"`, keeping the entry's own tarjama bibliography (*) and the note (٢) on
فإن يسلم السعدان; the `(*) طبقات ابن سعد: ٣ / ١ / ٢٧٤` refs on page 297 belong
to entry 57 and were dropped with the matching `--notes-end-marker`.

## What the entry supports

Seven claims — six on Saad, one on his father. The pages hold a great deal
more: nineteen pages of hadith, reports and the Prophet's sayings about the
Throne shaking for his death. None of that becomes a claim, because the model
holds no value for it. What the model does hold is already cited, in every
case to the Prophet's sira volume of the same book: `virtues` and
`deathYearHijri` to `saad-muadh/islam`, `saad-muadh/arsh` and
`saad-muadh/death-year`, and the three battle participations (Badr, Khandaq,
Banu Qurayzah) to `saad-muadh/badr`, `saad-muadh/khandaq-wound` and
`saad-muadh/qurayzah-judgement`. This batch does not add a second citation to a
value that already has one.

- **Nasab** — the heading split across the digital edition's line break:
  `سعد بن معاذ بن النعمان بن امرئ القيس الأنصاري` (`279-p3`), `ابن زيد بن عبد
  الأشهل` (`279-p4`), with `الأوسي` in the epithet line at `279-p5`. Three
  paragraphs, one selection, so `fullName` carries one citation per paragraph. The same passage supports the `SON` edge to `muadh-ibn-al-numan`, whose
  own module does not restate the reciprocal `FATHER` edge —
  `catalog:project-graph` writes it from the `inverse`.
- **Kunya** — `أبو عمرو`, in the epithet line at `279-p5`. The entry names it
  once more in verse at `294-p13` (`لِسَعْدٍ أَبِي عَمْرِو`), which adds nothing the
  heading does not.
- **Titles** — the same line classes him `السَّيِّدُ الكَبِيْرُ، الشَّهِيْدُ` and
  `البَدْرِيُّ`, which is the evidence for the companion title. Ibn Shihab's
  independent report that he witnessed Badr (`281-p6`) is a second, later piece
  of evidence for a value the model already carries as his Badr participation,
  so it is left in the pages.
- **Appearance** — `289-p10`: `كان سعد بن معاذ رجلاً أبيض، طوالاً، جميلاً، حسن
  الوجه، أعين، حسن اللحية`. Two other reports describe him, `من أطول الناس
  وأعظمهم` at `284-p5` and `رجلاً أبيض جسماً` at `286-p6`, and the same
  description is repeated with his age at `296-p3`; none adds to the fuller
  statement at 289, so the citation stops at the first one. The catalogue value
  keeps `رجلاً`, which the earlier legacy value had dropped, because that word
  is what marks him male and so carries the `sex` claim as well.
- **Sex** — the same selection at `289-p10`, on `رجلاً`.
- **Muadh ibn al-Numan** — cited for `sex` on the masculine chain at `279-p3`,
  the only mention of him anywhere in nineteen pages.

## What the entry does not state

Wives: no name and no marriage anywhere in the entry. Three women appear, none
of them his wife and none named as such — Umayyah ibn Khalaf's unnamed wife,
who answers him at `281-p1` and `281-p3`; Usayd ibn Hudayr's unnamed wife,
whose death is announced to him at `284-p12`; and `رُفَيْدَةُ` at `287-p4`, a
woman who tended the wounded. `notInSource`.

Brothers and sisters: no `أخو`/`أخت`/`شقيق` naming one of his. The `أخي
اليثربي` / `أخوك اليثربي` at `281-p1` and `281-p3` is Umayyah's pact-name for
Saad himself, his Medinan friend, not blood kinship. `notInSource`.

## Recorded in the pages, not in the catalog

- **Children.** `كان لسعد من الولد: عبد الله، وعمر، فكان لعمرو تسعة أولاد`
  (`297-p10`). Neither son has a module under `data/catalog/people/`, and this
  batch does not invent people.
- **Cousin.** `قيل: كان سعد بن معاذ، وأسعد بن زرارة ابني خالة` (`292-p3`).
  A cousin is a relation the model has no type for.
- **Pact brotherhood.** Three reports name his brothers in faith: Abu Ubayda
  (`292-p4`), Saad ibn Abi Waqqas (`292-p5`), and the verse at `294-p13` —
  `وَمَا اهْتَزَّ عَرْشُ اللهِ مِنْ مَوْتِ هَالِكٍ ... سَمِعْنَا بِهِ إِلاَّ لِسَعْدٍ
  أَبِي عَمْرِو` — which puts the name in the mouth of a poet of his own clan.
  The first two are `وُقِيل`/`وَقِيلَ`, reported not asserted, and the model
  holds no value for any of them.
- **The reports the entry grades.** The musk from his grave (`289-p5`,
  `289-p7`, `295-p9`, `295-p11`), the Prophet carrying his funeral on foot
  (`295-p7`, marked `ولم يصحّ`), and the gathering in his `زمرة` (`291-p2`).
  Al-Dhahabi's footnotes grade most of these, and the grading is kept in the
  notes files beside the text it belongs to.

## Legacy values

`npm run catalog:ledger -- --batch data/history/batches/saad-ibn-muadh` prints
one value still awaiting evidence, and it is not the subject's own: the
`SON` edge from `muadh-ibn-al-numan` to his own father
`al-numan-ibn-imri-al-qays`. The heading at `279-p3` does carry that link —
`سعد بن معاذ بن النعمان بن امرئ القيس` — so the debt is real, and it is left
open on purpose. This batch's nasab work stops at the subject's own father, as
docs/extraction-checklist.md scopes it; promoting Muadh's edge to al-Numan
would pull al-Numan and then امرؤ القيس and then زيد بن عبد الأشهل into the
ledger as subjects this batch has not read, on one and the same sentence. The
edge belongs to the batch that reads Muadh's own account. His `sex` is
promoted here, since the same chain carries it and it costs one claim.

On the subject himself, every legacy value the retired seed left is now cited:
sex, fullName, the companion title, and the `SON` edge to his father. The seed
held no kunya and no appearance, and both are new fields on the module, taken
from this entry. Nothing is left legacy on `saad-ibn-muadh` and nothing here
contradicts an earlier extraction.

One change to an existing value: `appearance` gained the word `رجلاً`, so the
field now reads exactly what `289-p10` says. The seed's shorter form was a
faithful selection of the same sentence, not a mistake.

## Review

Every claim is `NOT_REVIEWED`, and the batch carries an approval block that
says so: it is approved for publication and reviewed by nobody.
