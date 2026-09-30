# Batch: Sawdah bint Zam'ah, Siyar entry 40

This batch cites al-Dhahabi's dedicated Siyar entry on سودة أم المؤمنين بنت
زمعة against her existing catalog file, `data/catalog/people/sawdah-bint-
zamah.ts`, which was already populated with `legacy-unreviewed` values
carried from the retired `neo4j/graphSeedData*.ts`. No prisma seed covers
her; the catalog is already her sole author, so this batch visits every
legacy value on the file rather than migrating one off a seed.

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/sawdah-bint-zamah/](accounts/sawdah-bint-zamah/)

## Source account

Entry 40 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
السيرة النبوية ج٢ (volume 2), pages 265-269 (Shamela 2245-2249). It opens
on page 265, sharing that page with the closing lines of entry 39
(Juwayriyyah bint al-Harith); her own entry starts at `265-p9` and each
page's body file is trimmed to her paragraphs, so the anchors keep the
printed page's true paragraph numbers even where the file starts mid-page.
The entry closes on page 269 before entry 41 (Safiyyah bint Abd
al-Muttalib) opens at `269-p7`; the page's tail footnote is trimmed the
same way, keeping only the two notes (`269` footnotes 1-2) that belong to
her account.

## What this entry supports

Seven claims.

Her nasab, from the entry's own heading: "سَوْدَةُ أُمُّ المُؤْمِنِيْنَ
بِنْتُ زَمْعَةَ بنِ قَيْسٍ العَامِرِيَّةُ" (`265-p9`), continuing
"القُرَشِيَّةُ، العَامِرِيَّةُ" (`265-p10`). This backs `fullName` and a
`DAUGHTER`/`FATHER` relation to `zamah-ibn-qais-al-amiri`, whose own file
already declared the reciprocal edge, uncited, before this batch.

Her title: the heading names her "أُمُّ المُؤْمِنِيْنَ" outright, so the
existing `mother-of-believers` title moves off the legacy marker onto that
same citation. `companion` stays legacy — the entry never uses the word
صحابية for her, only the fact of her marriage to the Prophet, which the
model already expresses through the `WIFE` relation rather than a second,
redundant title claim.

Her appearance: "وَكَانَتْ سَيِّدَةً جَلِيْلَةً، نَبِيْلَةً، ضَخْمَةً"
(`265-p12`).

Her virtues, drawn from three passages: being the first woman the Prophet
married after Khadijah and having him to herself roughly three years until
he married Aisha (`265-p11`); waiving her turn to Aisha "رِعَايَةً لِقَلْبِ
رَسُوْلِ اللهِ" (`266-p1`); and, from the closing page, giving away a sack
of dirhams Umar sent her rather than keep them, asking instead for food she
could measure by hand (`269-p4`). The seed's old virtues text ("عرفت بخفة
روحها وحبها للخير") is replaced rather than kept beside the cited version,
since it paraphrased the same ground this citation now covers directly.

Two `WIFE` relations, both stated in her own account. To the Prophet:
"وَهِيَ أَوَّلُ مَنْ تَزَوَّجَ بِهَا النَّبِيُّ ... بَعْدَ خَدِيْجَةَ"
(`265-p11`) — a second, independent citation for the same marriage the
`prophet-muhammad-sira` batch already cites from his side (`prophet/wife-
sawdah`); this batch adds her side of it rather than reusing that key, so
her file has its own author. To her first husband: "وَكَانَتْ أَوَّلاً
عِنْدَ: السَّكْرَانِ بنِ عَمْرٍو، أَخِي سُهَيْلِ بنِ عَمْرٍو العَامِرِيِّ"
(`265-p13`) — al-Sakran's own file already declared this edge from his
side, uncited, before this batch; hers now matches it, cited, closing the
one-directional gap the extraction checklist warns about.

## What the checklist marks absent

`kunya` and `siblings` are marked `notInSource` on the account. The entry
never gives her a kunya of her own, and the only sibling named anywhere in
the sources — her brother Abd ibn Zam'ah, who appears in the marriage
narrative on السيرة 1/230 (`prophet-muhammad-sira`'s own account, not
hers) — falls outside her own entry's page range. Per the extraction
checklist, a sibling surfaced only in another subject's account is not a
blocking requirement for this batch, and Abd ibn Zam'ah has no catalog
entry of his own to link to.

## What the model has no shape for yet

Her death is reported two ways in the same entry: page 266 says she died
"فِي آخِرِ خِلاَفَةِ عُمَرَ" (end of Umar's caliphate, so by 23 AH), while
page 267 quotes al-Waqidi giving Shawwal 54 AH, and separately a report
that she died "زَمَنَ عُمَر" (in Umar's time) — three years apart in the
same book, competing over the same value. Her catalog file has no
`deathYearHijri` today, so there is nothing legacy to visit and nothing
this batch is obligated to add; it leaves the field unset rather than
picking a side of a dispute the source itself does not resolve. A future
batch modeling her death year should carry both reports as competing cited
claims per AGENTS.md's rule on disputed values, not average or guess
between them.

The near-divorce narrative (pages 267-268: the Prophet sends word of
divorce, she asks him to keep her among his wives and gives her day to
Aisha in exchange) restates the same `HUSBAND`/`WIFE` relation and the
day-waiving virtue already cited elsewhere in the entry, so it is not
claimed again — per AGENTS.md, a citation is one meaningful selection, not
every paragraph that mentions the same fact. The remaining anecdotes (her
prayer behind the Prophet, her request to leave Muzdalifah early, the
Hijrah travel list naming her among Zayd's party) name no field or
relationship this model holds and stay in the source text.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed. This batch
carries no `approval` block, so `history:import --apply` has nothing to
act on yet.
