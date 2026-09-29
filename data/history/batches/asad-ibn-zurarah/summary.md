# أسعد بن زرارة

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي، تحقيق حسين الأسد
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 299–303
- **Shamela pages**: 1725–1729
- **Entry**: 58 (the Shamela table of contents jumps from ٥٧ to ٥٩; this
  unnumbered entry sits between them)

## Source account

The entry spans five printed pages, so the batch has five page files. The
first Shamela page (1725) opens with the tail of entry 57 (زيد بن الخطاب —
the Yamama-martyrs roster and the remark about Abu Dujanah), so the slice
starts at `p3` (`--start-anchor p3`) and the notes are trimmed to the entry's
own `(*)` bibliography (`--notes-start-marker '(*) المسند لأحمد'`), dropping
Zaid's (١) note about عباد بن بشر's staff. The last Shamela page (1729) holds
only this entry: the "٥٩ - عتبة بن غزوان" hit on that page is the sidebar
table of contents, and entry 59 starts on the next reading page (1730,
printed 304), so nothing is cut on the far side. Anchors run `299-p3`–`299-p5`
on the first page (the entry begins at the reading page's third paragraph);
the five pages hold 3, 14, 6, 11 and 12 paragraphs, each count checked
against its anchor list rather than renumbered blind.

One claim (`virtues`) cites across the 300/301 boundary: the sentence
"فكان أسعد مقدم النقباء الاثني عشر، فهو نقيب بني النجار" starts at `300-p14`
and the naqib roster it introduces continues at `301-p1`, so the citation
carries `pageReference` "300–301" with the omitted roster marked by an
ellipsis.

## What the entry supports

Seven claims, all on these five pages.

- `asad-ibn-zurarah-siyar58/full-name` — the chain the header opens with,
  `أَسَعْدُ بنُ زُرَارَةَ بنِ عُدَسَ بنِ عُبَيْدِ بنِ ثَعْلَبَةَ` (`299-p3`)
  continued `ابْنِ غَنْمِ بنِ مَالِكِ بنِ النَّجَّارِ` (`299-p4`).
- `asad-ibn-zurarah-siyar58/father` — SON → `zurarah-ibn-udas`, from the
  entry's own patronymic (`299-p3`).
- `asad-ibn-zurarah-siyar58/kunya` — `أَبُو أُمَامَةَ` (`299-p5`). The catalog
  entry held no kunya; this is new.
- `asad-ibn-zurarah-siyar58/tribal-affiliation` — `الأنصاري، الخزرجي،
  النجاري` (`299-p5` for the first two, `299-p4` for بن النجار). The retired
  seed's `fullName` carried these nisbas as a suffix; they move here, matching
  how the neighbouring batches split the header, and nothing is dropped.
- `asad-ibn-zurarah-siyar58/titles` — صحابي, on `مِنْ كُبَرَاءِ الصَّحَابَةِ`
  (`299-p5`).
- `asad-ibn-zurarah-siyar58/virtues` — first to gather the Medinans for
  Friday prayer (`300-p12`), foremost of the twelve nuqaba (`300-p14`–`301-p1`),
  first to bring Islam to Medina with Dhakwan ibn Abd Qays (`302-p8`), and
  leading the people in prayer before the Prophet's arrival (`302-p9`). Joins
  the sira batch's `asad/naqib` on the catalog `virtues` value.
- `asad-ibn-zurarah-siyar58/death` — INVOLVED_IN `death-of-asad-ibn-zurarah`:
  died a martyr of الذبحة while the Prophet was building his mosque, before
  Badr (`300-p1`, `300-p4`), with the `وقيل` dating to the first year of the
  hijra (`302-p1`).

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — heading plus chain, printed 299 |
| Nasab (father edge) | Found — زرارة بن عدس, a catalog person |
| Kunya | Found — أبو أمامة |
| Manaqeb | Found — first to gather, foremost naqib, first with Islam, led prayer |
| Appearance | Confirmed absent — no physical description; a diacritic-insensitive grep for طويل/أسمر/قصير/الأدمة/أبيض/أفطس/لحية/جسيم/ربعة/أصلع hits nothing |
| Wives | Confirmed absent — the entry names three daughters (فريعة وكبشة وحبيبة, `303-p7`) and no wife; a grep for تزوج/امرأة/زوج/نكح/خطب/عرس hits nothing |
| Siblings | Confirmed absent — a grep for أخو/أخت/شقيق/لأمه/لأبيه hits nothing |

## Not modelled

- The three daughters فريعة وكبشة وحبيبة (`303-p7`), whom he entrusted to
  the Prophet's household: daughters are not a checklist item and they hold
  no catalog nodes, so no edge is authored. They stay in the account page.
- The twelve-naqib roster (`300-p14`–`301-p1`) names eleven other men in
  passing as list members, not as kin or narrators of this subject; per the
  transmission-chain rule they become no nodes or edges.
- The Baqi dispute (`303-p11`–`303-p12`): the Ansar say As'ad was the first
  buried in al-Baqi, the Muhajirun say Uthman ibn Maz'un. The model holds no
  burial-order value, so both reports stay in the account page.
- The cautery reports (`301-p2`–`301-p6`, `303-p1`–`303-p6`) and the
  "ميتة سوء لليهود" saying stay in the account pages; the death claim records
  the outcome (martyrdom by الذبحة), not each transmitted wording.

## Legacy values visited

`data/catalog/people/asad-ibn-zurarah.ts` carried three legacy values, and
the scoped ledger confirmed exactly these three were owed.

- **`fullName`** — promoted. The legacy chain matches the entry's reading
  word for word; only the nisba suffix moved to `tribalAffiliation`.
- **`companion` title** — promoted, on من كبراء الصحابة.
- **`SON` → `zurarah-ibn-udas`** — promoted to the new father claim. The
  target module is left untouched: his own `SON` edge to `udas-ibn-ubayd`
  agrees with this entry's chain (زرارة بن عدس بن عبيد), and citing his sex
  and ancestry is his own entry's work, not this batch's.

`sex` MALE stays `legacy-unreviewed`: the entry never states his sex
outright, and the rosters that state it are cited elsewhere (`asad/sex` from
the sira chapter covers the catalog value; this entry adds nothing to it).

## Battle registration

None: he died before Badr (`قَبْلَ بَدْرٍ`, `300-p4`), so no participation is
authored. The death event module gains the new claim key on its `people`
link beside `asad/death`; its description and year rest on the sira claim
alone.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/asad-ibn-zurarah`
lists no remaining owed values on `people/asad-ibn-zurarah` once the catalog
carry lands. Values on subjects this batch's claims point at but did not
read (`zurarah-ibn-udas` sex and ancestry, the death event's description and
year) stay owed to their own entries' batches.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block: approving for publication and marking claims reviewed are the
user's separate decisions.
