# Batch: Abdullah ibn Abdullah ibn Ubayy, Siyar entry 65

Al-Dhahabi's entry on عَبْدُ اللهِ بنُ عَبْدِ اللهِ بنِ أُبَيِّ, read against
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [v4/321.md](../../../sources/siyar-alam-al-nubala-risalah/v4/321.md),
  [v4/322.md](../../../sources/siyar-alam-al-nubala-risalah/v4/322.md),
  [v4/323.md](../../../sources/siyar-alam-al-nubala-risalah/v4/323.md)

## Scope

Companion, no contest: entry 65 in `فصل في بقية كبراء الصحابة`, the third run
`docs/data-pipelines.md#companion-scope` marks in scope, sitting between معن بن
عدي (entry 64) and عكرمة بن أبي جهل (entry 66).

This replaces the `batch.json` an abandoned worktree left at
`.claude/worktrees/abdullah-ibn-abdullah-ibn-abi`. Its slug was wrong — the
catalog's person is `abdullah-ibn-abdullah-ibn-ubayy` — its `accounts` array was
empty, and its one transcribed page was not this entry at all: entry 61, عُثْمَانُ
بنُ حُنَيْف. Nothing was salvageable, so the entry was read from Shamela directly.

## Source account

Shamela 1747-1749, printed 321-323, volume 4. Shamela reports `ج1` for all three,
and Shamela's `الجزء` does not count the two sira volumes and the caliph volume
bound before them, so `ج1` is this edition's volume 4 (*سير أعلام النبلاء ج١*,
printed 5-558). Printed 321-323 all fall inside it, so the account declares
`volumeNumber: 4`.

The heading is `4/321-p10`, not the top of the page: printed 321's first nine
paragraphs are the tail of معن بن عدي. The entry runs to `4/323-p1`, and عكرمة
بن أبي جهل opens at `4/323-p2`.

**Page 323 is shared, and its single paragraph belongs here.** `4/323-p1` is this
entry's closing lines — the Ansar's intended kingship — and the rest of the page
is entry 66. The page's editorial footnotes are this entry's: the note on
`4/323-p1` is the report of `عبد الله بن أبي` dying and `عبد الله بن عبد الله`
asking the Prophet for his shirt to shroud him. So the page spans both entries,
which is what `docs/adr/0018-a-page-belongs-to-the-edition.md` asks for.

**Two neighbouring pages in the store were partial and are now whole.** Printed
320 held five paragraphs where the page has thirteen, and printed 321 held nine
where it has twelve. Both grew at the end only, so no existing anchor moved and no
batch's approval was invalidated. Printed 322 was absent entirely. None of the
three pages was cited by another batch's claims before this one, apart from معن بن
عدي on the two pages that were partial.

## What the entry supports

Seven claims over three printed pages.

**Nasab.** `4/321-p10` and `4/321-p11` give the chain exactly as the catalog
already carries it, and the `SON → abdullah-ibn-ubayy` edge with it.

**The father is Ibn Ubayy, and the entry says so twice.** `4/321-p11` ends "والدُهُ
بابنِ سَلُوْلٍ، المُنافِقُ المَشْهُوْرُ", and `4/321-p12` adds "وسلول الخزاعية: هي
والدتُ أبي" — Salul al-Khuza'iyya is Ubayy's mother, which fixes the abbreviated
أُبَيّ in the heading as Ibn Ubayy rather than a separate Ibn Abi Sarh. The
catalog's edge agrees, so nothing here contradicts the seed.

**Tribal affiliation.** الأنصاري، الخزرجي (`4/321-p10`, `4/321-p11`).

**Title.** "من سادة الصحابة وأخيارهم" (`4/322-p2`).

**Virtues.** `4/322-p2`, that his name was the الحبّاب, that his father was
nicknamed from it, and that the Prophet renamed him; the gold nose and the gold
tooth at Uhud (`4/322-p4`, `4/322-p6`); his martyrdom at Yarmouk, his father's
death in 9 AH, and the Prophet clothing him in his own shirt and praying over him
out of respect for his offspring, until the verse forbidding the prayer came down
(`4/322-p7`); and the closing lines on the intended kingship (`4/323-p1`).

**Participations.** Badr (`4/322-p3`, "شهد بدراً وما بعدها") and Uhud with status
`INJURED` (`4/322-p4` and the variant at `4/322-p6`).

## What the entry does not support, and why

**Yamama is not claimed as a battle.** `4/322-p7` gives "استشهد عبد الله يوم
اليمامة", but the catalog has no `yamama` battle, so there is nothing to attach
the relation to. The martyrdom rides in virtues instead.

**No death year.** The entry says he was martyred at Yarmouk and that his father
died in year 9; it never dates his own death, so `deathYearHijri` is left unset
rather than inferred from the battle.

**Kunya — confirmed absent, and the reason matters.** `4/322-p2` says "وبِهِ كان
أبوه يُكْنَى" — *his father* was nicknamed from the name, أبو عبيدة, وقيل أبو
سلول. The kunya belongs to Ibn Ubayy, not to this man. Marked `notInSource`.

**Appearance — confirmed absent.** طويل، أسمر، شديد الأدمة, آمرد and the other
physical-description patterns return no match across all three pages, body or
notes. Marked `notInSource`.

**Wives — confirmed absent.** زوج، زوجه، تزوج and نكح return no match, and no wife
is named. Marked `notInSource`.

**Siblings — confirmed absent.** أخو، أُخو، أخت، إخوة and شقيق return no match;
the entry names his father and his grandfather's mother and no brother or sister.
Marked `notInSource`.

**Transmission chains stay in the text.** `4/322-p5` names Aisha as the reporter of
the tooth report; per `AGENTS.md` a narrator does not become a node or an edge.

## Legacy values visited

`npm run catalog:ledger -- --batch` reported four values owed on this subject, and
all four were checked against the entry:

- **`sex: MALE`.** Left on the legacy marker. The entry uses masculine grammar
  throughout, but never states his sex as a fact.
- **`fullName`.** Promoted. The promoted value is the source's own chain and
  matches the legacy string exactly, so there is nothing to reconcile.
- **`titles: [companion]`.** Promoted to the claim above.
- **`relations[0]` (`SON → abdullah-ibn-ubayy`).** Promoted to the claim above.

The ledger also pulls in `people/abdullah-ibn-ubayy` and `battles/badr`,
`battles/uhud`, since these claims point at them. Ibn Ubayy already declares
`FATHER → abdullah-ibn-abdullah-ibn-ubayy` on his side, so both directions of that
edge are now cited; his own fields are owed by whichever batch reads his entry. The
two battles' own fields are not this batch's to settle.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block, so its claims are not yet usable by `catalog:validate`. Both gates
stay closed on purpose: review needs someone to compare the batch against its
pages, and approval records a revision someone has chosen to publish.
