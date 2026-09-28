# Batch: Amr ibn al-Jumuh, Siyar entry 44

Al-Dhahabi's own entry on عَمْرُو بنُ الجَمُوْحِ, read against
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/amr-ibn-al-jumuh/](accounts/amr-ibn-al-jumuh/)

## Source account

Entry 44 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (*سير أعلام النبلاء ج١*), edited by حسين الأسد under شعيب الأرناؤوط.
Shamela 1678–1681, printed 252–255.

Both ends of the entry share a printed page with a neighbour, and both cuts
are by the extractor's own bounds:

- Printed 252 (Shamela 1678) also carries entries 42 and 43 above entry 44.
  `--start-anchor p9` drops that text, and `--notes-start-marker '(* * *)'`
  drops entries 42 and 43's footnotes from the shared notes block. The
  marker is the spaced form the footnote block uses, not the `***` the body
  text carries.
- Printed 255 (Shamela 1681) ends with entry 44, and its notes block holds
  only entry 44's footnotes. Ubaydah (entry 45) starts on the next printed
  page, and entries 42 and 43 on this one are separate batches. No
  `--end-anchor` or `--notes-end-marker` was needed, and none was invented.

Volume 4 is declared on the account, so the reader files the entry under the
book's own contents rather than under "entries with no assigned volume".

## Scope call: Companion

The entry settles the question itself: الأنصاري السلمي, present at Uhud,
killed there. Taken in as a Companion, no contest recorded.

## What the entry supports

Nine claims across four pages.

**Nasab.** The heading and the chain that follows it: "٤٤ - عَمْرُو بنُ الجَمُوْحِ
بنِ زَيْدِ بنِ حَرَامٍ السَّلَمِيُّ" (`252-p9`) and "ابْنِ كَعْبِ بنِ غَنْمِ بنِ
كَعْبِ (١) بنِ سَلِمَةَ بن سَعْدِ بنِ عَلِيِّ بنِ أَسَدِ بنِ سَارِدَةَ بنِ تَزِيْدَ
بنِ جُشَمَ بنِ الخَزْرَجِ الأَنْصَارِيُّ، السَّلَمِيَ، الغَنْمِيُّ" (`252-p10`).
Both sit on printed page 252; the schema's single anchor per citation cannot
hold a selection that crosses an extracted paragraph boundary, so the claim
carries one citation per paragraph.

The chain is carried as plain text, not as graph nodes. The Banu Sulaym
lineage already models three generations above Amr — `al-jumuh-ibn-zayd`,
`zayd-ibn-haram-ibn-kaab`, `haram-ibn-kaab` — and everything below حرام بن كعب
stays in `fullName`, matching that depth.

**Father.** "عَمْرُو بنُ الجَمُوْحِ بنِ زَيْدِ بنِ حَرَامٍ" (`252-p9`) carries
the legacy `SON → al-jumuh-ibn-zayd` edge to a cited claim.

**Children.** "وَالِدُ مُعَاذٍ، وَمُعَوَّذٍ، وَخَلاَّدٍ المَذْكُوْرِيْنَ، وَعَبْدِ
الرَّحْمَنِ، وَهِنْدٍ." (`252-p10`) gives three `FATHER` edges — to
`muadh-ibn-amr-ibn-al-jumuh`, `muawwidh-ibn-amr-ibn-al-jumuh` and
`khallad-ibn-amr-ibn-al-jumuh` — which is what completes each
`FATHER`/`SON` pair; every son's module already declares the `SON` side.
Khallad is confirmed twice over: "فَقُتِلَ هُوَ وَابْنُهُ خَلاَّدٌ." (`255-p1`)
names him as the son a second time, on the son's own killing. عبد الرحمن and
هند are named as his children too, and neither has a catalog entry, so no edge
is declared for them.

**Appearance.** "فَقَامَ وَهُوَ أَعْرَجُ" (`253-p19`) and "لَمْ يَشْهَدْ بَدْراً، كَانَ
أَعْرَجَ" (`254-p10`). The entry calls him a cripple four times across the
account, always in the course of an event rather than as a portrait, and
always functionally: it is why he missed Badr, why he went out limping on the
morning of Uhud, and why the editor's footnote records Abu Qutadah's report
that his leg was lame. Citing it is right — it is a stated physical fact, not
an inference, and the Badr absence turns on it. `fields.appearance` is a
free-text field with no narrower slot for it.

**Virtues.** Chief of Banu Salimah, "وَكَانَ سَيِّدَ بَنِي سَلِمَةَ"
(`253-p5`); the Islam he declared to his clan, "فَأُشْهِدُكُم أَنِّي قَدْ آمَنْتُ
بِمَا أُنْزِلَ عَلَى مُحَمَّدٍ." (`253-p17`); the Prophet's praise, "بَلْ سَيِّدُكُم
الجَعْدُ الأَبْيَضُ: عَمْرُو بنُ الجَمُوْحِ" (`254-p9`); the ruling that cleared
his sons for letting him fight, "لاَ عَلَيْكُم أَنْ لاَ تَمْنَعُوْهُ، لَعَلَّ اللهُ
يَرْزُقُهُ الشَّهَادَةَ" (`254-p12`); his fight to the death, "فَقَاتَلَ حَتَّى
قُتِلَ." (`253-p20`); and the burial, "كُفِّنَ هُوَ وَعَبْدُ اللهِ بنُ عَمْرِو
بنِ حَرَامٍ فِي كَفَنٍ وَاحِدٍ." (`255-p5`).

**Badr.** "لَمْ يَشْهَدْ بَدْراً، كَانَ أَعْرَجَ، وَلَمَّا خَرَجُوا يَوْمَ أُحُدٍ
مَنَعَهُ بَنُوْهُ" (`254-p10`), al-Waqidi's report. Attendance and outcome are
split per [ADR 0013](../../../../docs/adr/0013-separate-attendance-from-outcome.md):
this is an `ABSENT_FROM` participation, not a `PARTICIPATED_IN` one, so
`battles/badr.ts` records him as absent and his sons as the reason.

**Uhud.** "فَقَاتَلَ حَتَّى قُتِلَ." (`253-p20`) and "فَإِذَا هُوَ فِي الرَّعِيْلِ
الأَوَّلِ" (`255-p4`), a `PARTICIPATED_IN` participation with `MARTYRED` status.
`battles/uhud.ts` already held a legacy row for him; this batch adds its claim
key to that row's citations rather than adding a second row.

## Confirming absence

**Kunya — confirmed absent.** Trigger words كنية and يكنى return no match
across all four pages, body or notes, and no أبو فلان / أم فلانة form appears
anywhere in the entry. Marked `notInSource`. The one "أبو" on the page is
"وَأَبُوْهُم:" (`252-p8`), the collective lead-in to entries 44–46 and now
trimmed out of the stored text, and it names no kunya.

**Siblings — confirmed absent.** أخو, إخوة, إخوان and شقيق return no match in
the author's text. The one أخت hit is Hind's, not Amr's: "أُخْتُ عَبْدِ اللهِ بنِ
عَمْرِو بنِ حَرَامٍ" (`255-p1`) is a relation between Hind and Abdullah ibn Amr
ibn Haram. Marked `notInSource`.

**Wives — the entry states one, and it is not modelled.** `catalog:checklist`
reports ⚠️ here, and the reason is not that the item went unread.
"قَالَتِ امْرَأَتُهُ هِنْدٌ أُخْتُ عَبْدِ اللهِ بنِ عَمْرِو بنِ حَرَامٍ" (`255-p1`)
names his wife: Hind, sister of Abdullah ibn Amr ibn Haram. زوج, نكح and تزوج
appear nowhere else in the entry, so she is the only wife it gives.

No `HUSBAND`/`WIFE` edge is authored, because no catalog entry exists for this
Hind — the only Hind in `data/catalog/people/` is `hind-bint-utbah`, a
different person. The checklist resolves ⚠️ by finding a spouse relation or a
`notInSource` mark, and neither is honest here: the source states a wife, so
marking the item absent would be false, and minting a person node for a woman
this entry names once, in one clause, is a separate piece of work with its own
review. Her husband's brother `abdullah-ibn-amr-ibn-haram` *is* a catalog
person, but that is a tie between Hind and Abdullah, not between Amr and
either of them. The ⚠️ stands until someone batches Hind.

## Legacy values visited

`npm run catalog:ledger -- --batch` for this batch reports `people/amr-ibn-al-jumuh`
owing evidence on two values. Both were checked against the entry:

- **`sex: MALE`.** Left on the legacy marker. The entry uses masculine grammar
  throughout and calls him أبو, but never states his sex as a fact, and the
  neighbouring batches in this run left theirs the same way.
- **`titles: [companion]`.** Left on the legacy marker. He is الأنصاري
  السلمي, fought at Uhud and was killed there, and the Prophet is recorded
  speaking of him to بني سلمة — a Companion on any reading. The entry never
  says the word, so the title stands as carried rather than as cited.

The `fullName` and the `SON → al-jumuh-ibn-zayd` edge are promoted to the
claims above. The promoted `fullName` is longer than the legacy value, which
stopped at سلمة and reordered the tail into الأنصاري الخزرجي السلمي; the
source's own chain and nisba are carried instead. Not a contradiction between
two readings of the book — the legacy string is an abbreviation of the same
chain, and nothing is lost but the redundancy.

The ledger also pulls in subjects this batch's claims point at, and none of
them are this batch's to settle:

- `people/muadh-ibn-amr-ibn-al-jumuh` — `sex`, `fullName`, the `companion`
  title and his own `SON` edge are his batch's work (PR #169, still open). The
  reciprocal `FATHER` side is authored here; the `SON` side is cited there.
- `people/al-jumuh-ibn-zayd` — `sex` and his legacy `SON →
  zayd-ibn-haram-ibn-kaab`. This entry's chain does state
  الجموح بن زيد بن حرام بن كعب, but `zayd-ibn-haram-ibn-kaab` and
  `zayd-ibn-haram` are two legacy nodes with the same name and different
  fathers, so which one the edge should point at is a reconciliation of that
  lineage, not a citation this entry can settle.
- `battles/badr` and `battles/uhud` — `fields.location` is the battle's own
  place, and the three participants awaiting evidence on Uhud and the one on
  Badr are Umar, Abu Bakr and Uthman. None is on a page this batch read.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block, so its claims are not yet usable by `catalog:validate` and
appear in that run's "no batch declares claim" output alongside the other
eighteen unapproved batches in the tree. Both gates stay closed on purpose:
review needs someone to compare the batch against its pages, and approval
records a revision someone has chosen to publish.
