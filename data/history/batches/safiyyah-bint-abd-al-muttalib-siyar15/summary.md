# Batch: Safiyyah bint Abd al-Muttalib, Siyar entry 41

This batch reads al-Dhahabi's Siyar entry on Safiyyah bint Abd al-Muttalib,
the Prophet's paternal aunt and Hamzah's full sister, and cites her existing
catalog entry's legacy values. It follows
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/safiyyah-bint-abd-al-muttalib/](accounts/safiyyah-bint-abd-al-muttalib/)

## Source account

Entry 41 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 2 of the Siyar proper (`volumeNumber: 5` in this batch's numbering,
matching the Hamzah batch's volume table). It opens on printed page 269,
paragraph 8, right after Sawdah bint Zam'ah's entry closes with a report on
her charity and a hadith count, and runs through page 271, where it ends
with a poem attributed to her mourning the Prophet and al-Dhahabi's own
caution about that poem's authenticity; entry 42, Arwa, the Prophet's other
paternal aunt, opens fresh on page 272 with its own heading.

Page 269 carries only the heading and the entry's first line; the rest of
the page belongs to Sawdah's entry, so the extraction starts at the
paragraph anchor for Safiyyah's own heading (`p8`) and the notes-start
marker trims the shared footnote block down to Safiyyah's own bibliography
line.

## What was found, checklist item by item

- **Nasab**: the heading gives `صَفِيَّةُ بِنْتُ عَبْدِ المُطَّلِبِ الهَاشِمِيَّةُ` and
  states she is "شقيقة حمزة" (Hamzah's full sister) with "أمها من بني زهرة"
  (their mother from Banu Zuhrah) — the same maternal line her existing
  catalog entry's own comment already named as `legacy-unreviewed`. Her
  `DAUGHTER`/`FATHER` edge to `abd-al-muttalib-ibn-hashim` was already
  declared and needed no change.
- **Kunya**: not in this entry. Marked `notInSource`.
- **Appearance**: not in this entry. Marked `notInSource`.
- **Manaqeb**: she is named among "المهاجرات الأول" (the first women to
  emigrate), killed an intruding Jewish man with a tent pole while guarding
  Hasan ibn Thabit's fortress at the Trench, and is one of three people the
  Prophet named by name — with Fatimah and "Bani Abd al-Muttalib" — when
  "وأنذر عشيرتك الأقربين" (26:214) was revealed.
- **Wives** (her own marriages): two. Al-Harith, brother of Abu Sufyan ibn
  Harb, who died leaving her a widow — he has no catalog slug and this
  batch does not create one for a name the entry gives no further detail
  on. Al-Awwam ibn Khuwaylid, by whom she bore al-Zubayr, al-Sa'ib and Abd
  al-Kaaba — this marriage already had a `HUSBAND`/`WIFE` edge on
  `al-awwam-ibn-khuwaylid`'s module, carried `legacy-unreviewed`; this
  batch cites it.
- **Siblings**: confirmed full sister of Hamzah, already declared as a
  `BROTHER`/`SISTER` edge on `hamzah-ibn-abd-al-muttalib`'s own module,
  carried `legacy-unreviewed`; this batch cites it.

## What this batch adds

Eight claims: her full name, her sex (inferred from the feminine verb
"وَلَدَتْ" describing her childbirth, since the entry never states it
directly), the "من المهاجرات الأول" line supporting her `companion` title,
a `virtues` claim combining the Trench killing and the Qur'an-revelation
address, a `PARTICIPATED_IN` claim against `khandaq` for the same killing,
her death year (20 AH, buried at al-Baqi), and citations for the two
pre-existing legacy relations above (the Hamzah sibling edge and the
al-Awwam marriage edge).

## What the model has no shape for yet

Her first husband al-Harith (brother of Abu Sufyan ibn Harb) and her sons
al-Sa'ib and Abd al-Kaaba have no catalog entries. Creating profiles for
them is out of this batch's scope — the entry gives al-Harith no further
identifying detail beyond his brother, and the sons' own entries (al-Sa'ib
appears in *al-Isabah* per this entry's footnote) are a separate extraction.
The poem attributed to her mourning the Prophet is preserved in the account
page only: al-Dhahabi himself doubts it ("فَاللهُ أَعْلَمُ بِصِحَّتِهِ"), and the
catalog holds no field for an attributed elegy.

## Corroboration and disputes

Nothing here conflicts with the existing catalog entry or with Hamzah's own
batch (`hamzah-ibn-abd-al-muttalib-siyar15`); this entry's "أمها من بني
زهرة" matches Hamzah's module's own comment about their shared Zuhri
mother.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and this batch
carries no publication approval yet — that is a separate step this task
does not perform.
