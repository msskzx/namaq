# Batch: Sa'id ibn Zayd, Siyar entry 6

This batch preserves al-Dhahabi's complete entry on Sa'id ibn Zayd and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/saeed-ibn-zaid/](accounts/saeed-ibn-zaid/)

## Source account

Entry 6 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs from
printed page 124 to page 143, twenty pages.

It shares its first page with a neighbor. Entry 5 on Sa'd ibn Abi Waqqas holds
the first five paragraphs of page 124, so the body here starts at `124-p6` and
the notes are cut before this entry's `(*)` source list. Page 143 closes the
entry cleanly: the next page opens a new section, السابقون الأولون, which is
a roster rather than a person and stays out of this batch.

## What the entry supports

Fourteen claims and sixteen citations.

**Name and kunya.** The heading gives سعيد بن زيد بن عمرو بن نفيل and unpacks
the nasab back to غالب, then his kunya أبو الأعور and nisbas (`124-p6`,
`124-p7`).

**Two titles, one word away from the seed's three.** The entry calls him
أحد العشرة المشهود لهم بالجنة and counts him among السابقين الأولين البدريين
(`124-p8`). The seed's third title, `awwal-rami`, belongs to Sa'd, not him,
and this entry never claims it for him, so it is not carried.

**Companion of the Prophet, cited.** شهد المشاهد مع رسول الله (`124-p9`) backs
the `COMPANION_OF` relation the seed asserted without a citation.

**His appearance, once and without dispute.** Al-Waqidi describes him:
كان سعيد رجلاً آدم، طويلاً، أشعر (`140-p10`). The seed's appearance value said
the same in different wording; this entry's exact phrasing replaces it.

**Death year and place, each with a rival.** Al-Waqidi dates his death to 51
AH at al-Aqiq, and a burial account naming Sa'd ibn Abi Waqqas and Ibn Umar at
his grave agrees on the place (`140-p5`, `140-p7`, `140-p8`). Ubaydullah ibn
Sa'd al-Zuhri gives 52 instead (`140-p12`), and al-Haytham ibn Adi alone
places the death at Kufa (`140-p11`). Both are kept as their own `DISPUTED`
claims rather than dropped.

**Father, now a graph relation.** The entry states his father plainly: كان
والده زيد بن عمرو ممن فر إلى الله من عبادة الأصنام (`126-p6`). Zayd ibn Amr
ibn Nufayl already has a catalog entry of his own, authored from the sira's
account of him; this batch adds the `SON` edge from Sa'id to him.

**Three battles by name.** وشهد سعيد أحداً، والخندق، والحديبية، والمشاهد
(`137-p3`) gives Uhud, Khandaq and Hudaybiyyah each their own `PARTICIPATED_IN`
claim, plus one `virtues` claim carrying the sentence whole.

## Corroboration against the sira batch

`prophet-muhammad-sira` already cites Sa'id twice, and this entry speaks to
both without contradicting either.

**Badr.** The sira's citation has him and Talhah بالشام, arriving after Badr
and given a share by the Prophet. This entry's own account of the battle says
the same in Urwah's telling: قدم من الشام بعد بدر، فكلم رسول الله فضرب له
بسهمه، وأجره (`135-p11`, `135-p12`). Neither account puts him at the battle
itself.

One line in this same entry calls him مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ
البَدْرِيِّيْنَ, "Badri," in the same breath as the absence it goes on to
narrate. Al-Dhahabi is not contradicting himself: the heading uses "Badri" for
everyone the Prophet counted into Badr's share, present or not, and the
account beneath it is explicit about which one Sa'id was. The `titles` claim
here cites only the heading and does not assert battle attendance; `badr` in
the catalog carries `ABSENT_FROM`, unchanged by this batch.

**Umar's conversion.** The sira's citation has him say: والله لقد رأيتني وإن
عمر لموثقي وأخته على الإسلام، قبل أن يسلم عمر. This entry gives a shorter
version of the same report through a different chain: لقد رأيتني، وإن عمر
لموثقي على الإسلام وأخته (`136-p5`). Same claim, fewer words, no new citation
needed here.

## What the model has no shape for yet

**His wife**, ابنة عمه فاطمة أخت عمر بن الخطاب (`136-p2`), has no subject to
link to and stays unlinked in the profile prose rather than authored as a
relation.

**Why Umar left him off the Shura.** Al-Dhahabi's own comment, that Umar
excluded him only to keep the appointment above suspicion since Sa'id was his
kinsman and brother-in-law (`137` area, not separately cited), has no field.

**His hadith count and the mu'akhat report attributed to him** (pages 141-143)
are transmission history rather than anything the model records, and stay in
the source text.

## Leaving the seed

His seed entry's `fullName`, `appearance`, `virtues` and `titles` are retired
with this batch. `ayat: [{surah: 9, ayah: 100}]` carries forward on the
legacy marker: nothing in this entry names al-Tawbah 100 for him, and the
seed's own comment shows why it was there in the first place, the verse
addresses السابقون الأولون collectively rather than naming him.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
