# البراء بن معرور بن صخر

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 267–269
- **Shamela pages**: 1693–1695
- **Section**: أعيان البدريين

The entry's last sentence runs over the top of printed 269 and stops one line
into that page, at the dangling وَكَانَ ابْنُهُ: that introduces the next entry,
54 (بشر بن البراء). Both fragments are kept in the account; entry 53's page
range therefore ends at 269 rather than 268, and entry 54's batch should start
its first page at the second paragraph of printed 269.

## What the entry says

The header gives the chain البراء بن معرور بن صخر بن خنساء بن سنان الخزرجي,
then the labels السيد، النقيب، أبو بشر الأنصاري الخزرجي. The body adds that he
was one of the naqibs of the night of Aqaba, a cousin of Sa'd ibn Mu'adh, and
naqib of his own people Banu Salimah.

al-Dhahabi dates his death to Safar, a month before the Prophet's arrival in
Medina, and closes by calling him the most august of the seventy at Aqaba and
the first of them to pledge.

The body is the story of his prayer toward the Kaaba. Ibn Ishaq transmits it from
Mu'bad ibn Ka'b, from his brother Abdullah, from his father: on a caravan out of
Medina, al-Bara'a — described by the narrator as their lord and the eldest of
them — swore he would not have the Kaaba behind him, and prayed to it, and did
so until they reached Mecca. Asked about him, the Prophet called him a poet; he
answered that he had done this and that, and the Prophet said قد كنت على قبلة لو
صبرت عليها. He returned to his old qibla. The Prophet then met him again at the
second Aqaba.

Yahya ibn Abd Allah ibn Abi Qudatah transmits that al-Bara'a bequeathed a third
of his property to the Prophet, a third in the path of God and a third to his
children; the Prophet returned it to the heirs. When he came to Medina and
learned al-Bara'a had died, he asked for the grave, stood over it and magnified,
and said اللهم اغفر له وارحمه وأدخله الجنة وقد فعلت.

Mu'bad, Ka'b ibn Malik, Sa'd ibn Mu'adh, Ka'b's brother Abdullah, and Yahya's
father and grandfather are named in passing as narrators or as people present.
They stay in the account text and become no graph nodes or edges.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — the entry's own patronymic, p1, printed 267 |
| Nasab (father edge) | Found — the same patronymic, p1, printed 267 → `marur-ibn-sakhr` |
| Kunya | Found — أبو بشر, p2, printed 267 |
| Appearance | Confirmed absent |
| Manaqeb | Found — the Aqaba pledge and the Prophet's saying on the qibla, printed 267–268 |
| Wives | Confirmed absent |
| Siblings | Confirmed absent — see below |

## Values already held, visited

The `prophet-muhammad-sira` batch had already cited two of this subject's
values from the sira's roster of those who died in Medina, so neither was on the
legacy marker:

- **sex** (MALE, `al-baraa/sex`): left alone. This entry does not state his sex
  outright, so it adds nothing; the sira's citation stands.
- **virtues** (`al-baraa/first-to-pledge`): rewritten in this entry's own
  wording and both keys now cite the field. The two accounts agree. The sira
  says he was أول من بايع النبي صلى الله عليه وسلم ليلة العقبة، وكان كبير
  Significance; this entry says أول من بايع **ليلة العقبة الأولى** — a
  qualification the sira's line drops — and adds فاضلاً تقياً فقيه النفس and
  أَجَلُّ السَّبْعِيْنَ, which is what carried "great in rank". Its other
  material, the qibla report and the Prophet at his grave, is now cited too.

## Legacy values visited

- **fullName**: promoted, with its tail re-homed. The legacy value ended
  الأنصاري الخزرجي السلمي; the entry's opening line carries the chain and
  الخزرجي only, and states الأنصاري on the labels line and بني سلمة a line
  later. The chain is the name, and الخزرجي، الأنصاري، السلمي and نقيب بني سلمة
  went to `tribalAffiliation`. Nothing was dropped.
- **title companion**: promoted from أحد نقباء ليلة العقبة.
- **relation SON → marur-ibn-sakhr**: promoted from the entry's patronymic.
- **relation FATHER → bishr-ibn-al-baraa**: left on the legacy marker, for the
  reason given next.

## Bishr ibn al-Bara'a is his son, not his brother

The retired graph seeds recorded a FATHER edge from al-Bara'a to
`bishr-ibn-al-baraa`, and the working note for this batch assumed they were
brothers. The entry says otherwise. It ends وَكَانَ ابْنُهُ: — "and his son was:"
— and the next entry's header is ٥٤ - بِشْرُ بنُ البَرَاءِ بنِ مَعْرُوْرٍ. The seed's
`FATHER` edge is right; the `BROTHER` reading is wrong, and no `BROTHER` or
`HALF_BROTHER` edge was written.

The father edge therefore stays on the legacy marker: this entry names no son.
Only the word ابن appears, in a clause that ends in a colon, and the name that
answers it is on the next entry's header, which belongs to entry 54's batch.
That batch is where the citation belongs.

`bishr-ibn-al-baraa.ts` declares no `SON` edge back. That matches how the batches
already merged in this run handle a promoted nasab edge (`amr-ibn-al-jumuh`,
`said-ibn-al-as`): the edge is declared once, on the subject the batch is about,
and `catalog:project-graph` writes the reciprocal from its `inverse`. Entry 54's
batch should cite its own header for the same edge if it wants the value
evidenced on both sides.

## Not a Badr figure

The batch was briefed as a Badr subject needing a participation in
`data/catalog/battles/badr.ts`. He is not in that file and does not belong in it.
The entry dates his death to Safar, a month before the Prophet reached Medina —
over two years before Badr — and says nothing about the battle. Nothing was
added. If a Badr roster elsewhere in the catalog lists him, that is a separate
question this entry cannot answer.

## The "الله أعلم" report is not in this entry

The batch was also briefed to cite the well-known report of the first mosque in
Medina, where the Prophet says الله أعلم after al-Bara'a's companion gives a date
differing by a day. That report is not here. What this entry carries is the other
version of the story, in which the Prophet says قد كنت على قبلة لو صبرت عليها and
no date is disputed. The cited passage is the source's own.

## Claims authored

1. `al-baraa-ibn-marur-siyar53/full-name`
2. `al-baraa-ibn-marur-siyar53/father` — SON → marur-ibn-sakhr
3. `al-baraa-ibn-marur-siyar53/kunya`
4. `al-baraa-ibn-marur-siyar53/tribal-affiliation`
5. `al-baraa-ibn-marur-siyar53/titles` — صحابي
6. `al-baraa-ibn-marur-siyar53/virtues`

Every claim is `NOT_REVIEWED`, and the batch carries no approval, so nothing has
been written to the database. The reciprocal of the `SON` edge on
`marur-ibn-sakhr` is derived by `catalog:project-graph`; that node has no
profile of its own, so declaring the edge there would add nothing.

`npm run catalog:ledger -- --batch <this dir>` reports three values still owing
evidence, and each is accounted for:

- `people/al-baraa-ibn-marur` `relations[1]` — the FATHER edge to
  `bishr-ibn-al-baraa`, left on the legacy marker as explained above.
- `people/marur-ibn-sakhr` `fields.sex` and `relations[0]` — his own values,
  untouched by this batch. It says only that al-Bara'a is his son.
