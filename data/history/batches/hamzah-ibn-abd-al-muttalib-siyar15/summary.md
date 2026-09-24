# Batch: Hamzah ibn Abd al-Muttalib, Siyar entry 15

This batch preserves al-Dhahabi's dedicated Siyar entry on Hamzah ibn Abd
al-Muttalib and supports the small amount of canonical ground it covers
that `prophet-muhammad-sira` had not already claimed. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/hamzah-ibn-abd-al-muttalib/](accounts/hamzah-ibn-abd-al-muttalib/)

## Source account

Entry 15 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on
printed page 171, paragraph 19, right after Salim mawla Abi Hudhayfah's
entry closes with the roster of the Muslim and Quraysh dead at Badr, and
runs to page 184, where it ends with two reports on the Prophet's grief
at Hamzah's body and his prayer over the dead of Uhud; entry 16, Aqil ibn
al-Bukayr, opens fresh on the next page with its own heading and its own
source-list footnote, so nothing from this entry's closing page is shared
with a neighbor.

Page 171 carries only the heading and the first line of Hamzah's genealogy;
his own source list opens in that page's footnote, right after the source
list this batch's predecessor already claimed for Salim, so the extraction
keeps both footnote blocks and the notes-start marker trims the batch's
own copy down to Hamzah's list.

This is a long entry: fourteen printed pages against Salim's five, because
Hamzah is a central figure in the Uhud narrative and the book gives most of
those pages to Wahshi's own account of killing him, told twice, once in
brief and once at length when two men from Abu Hudhayfah's own line
travelled to Homs to ask Wahshi to tell it himself.

## What is already modeled

`prophet-muhammad-sira` carries eleven claims on `hamzah-ibn-abd-al-muttalib`
already: his sex, full name and paternal-uncle relation to the Prophet, his
milk-brother relation through Thuwaybah, participation in Badr and in a
raid to Sayf al-Bahr, his conversion, his death at Uhud with the mutilation
by Wahshi, the `asadu-allah` title, and the Prophet's line about no one
weeping for him. This entry restates most of that ground: the milk-brother
line, the conversion narrative, the two-sworded fighting and the
`أَسَدُ اللهِ` cry, the mutilation, and the Prophet's line about the weeping
all appear again here in close to the same wording, since both accounts
draw on Ibn Ishaq. None of it is claimed twice.

## What this entry adds

Three claims and four citations.

His kunya. The entry's opening line of honorifics gives two:
"أَبُو عُمَارَةَ، وَأَبُو يَعْلَى" (`172-p1`). `kunya` is a plain catalog field and
was unset; this batch is the first to claim it.

A second Badr killing. `prophet-muhammad-sira`'s existing Badr claim covers
Hamzah killing al-Aswad ibn Abd al-Asad at the trough and being one of the
three who came forward that day. This entry names the man Hamzah met in
formal single combat: "فَبَارَزَ يَوْمَئِذٍ حَمْزَةُ عُتْبَةَ، فَقَتَلَهُ" (`172-p7`), Utbah ibn
Rabiah, one of the three Quraysh who stepped out to face Hamzah, Ubaydah
ibn al-Harith and Ali. This is added as a second `PARTICIPATED_IN` claim
against `badr` rather than folded into the existing one, since it is a
separate reported act on the same day with its own chain.

The `sayyid-al-shuhada` title. It was carried as `legacy-unreviewed` on the
catalog entry, with no batch having cited it. This entry gives it twice:
once from al-Hakim's *Mustadrak* through Jabir, "سَيِّدُ الشُّهَدَاءِ: حَمْزَةُ"
(`173-p3`), and once through al-Daghuli's own chain, "سَيِّدُ الشُّهَدَاءِ حَمْزَةُ بنُ
عَبْدِ المُطَّلِبِ" (`173-p6`). Al-Dhahabi marks the first "سَنَدُهُ ضَعِيْفٌ" and the
second "هَذَا غَرِيْبٌ" in his own voice right after each report, so the claim
carries `UNASSESSED` confidence rather than `ESTABLISHED`, with a
`reviewerNote` recording both weaknesses.

## What the model has no shape for yet

Hind bint Utbah's mutilation of Hamzah's body and Wahshi's carrying his
liver to her, fulfilling a vow she had made when her father was killed at
Badr (`179-p10`). Hind is not a catalog subject and no relation type models
one person mutilating another's remains, so this stays in the source text
only, alongside the sira batch's existing coverage of the mutilation
itself.

Jubayr ibn Mut'im's promise of manumission to his slave Wahshi if Wahshi
killed Hamzah, to avenge Jubayr's uncle Tu'aymah ibn Adi killed at Badr
(`174-p9` through `174-p13`, and again at `178-p6` through `178-p8`). Wahshi
is not a catalog subject; the motive behind his killing of Hamzah has
nowhere to attach.

The Prophet's declaration "أَنَا شَهِيْدٌ عَلَيْكُم" over the Uhud dead as a group
(`173-p8`, `177-p5`) and his statement that he would have left Hamzah's body
for the beasts and birds to raise had Safiyyah not grieved (`177-p2`,
`180-p9`). Both concern the burial of the Uhud dead generally rather than a
field the catalog holds specifically for Hamzah.

## Corroboration and disputes

Nothing here conflicts with `prophet-muhammad-sira`. Where the two accounts
overlap, on the conversion, the two swords, the mutilation and the line
about the weeping, the wording is close enough that both plainly draw on
Ibn Ishaq's account, and this batch adds no second citation to claims that
already have one.

## Leaving the seed

`prisma/personSeedData3.ts` no longer carries `hamzah-ibn-abd-al-muttalib`
as an active entry; `data/catalog/people/hamzah-ibn-abd-al-muttalib.ts`
already retired it before this batch, and this batch only adds to that
catalog file.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
