# Batch: Abdullah ibn Maz'un al-Jumahi, Siyar entry 11

This batch preserves al-Dhahabi's complete entry on Abdullah ibn Maz'un
al-Jumahi and supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdullah-ibn-mazun-al-jumahi/](accounts/abdullah-ibn-mazun-al-jumahi/)

## Source account

Entry 11 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs
entirely on printed page 163, right after Qudamah ibn Maz'un's entry closes
on page 162 and right before entry 12, as-Saib ibn Uthman, opens further
down the same page.

Page 163 opens with the heading "١١ - عَبْدُ اللهِ بنُ مَظْعُوْنٍ الجُمَحِيُّ أَبُو
مُحَمَّدٍ *" and its own `(*)` source list in the page's notes. Four paragraphs
later, as-Saib's entry begins with its own heading, marked "**", and its own
source list, marked "(* *)", in the same notes block. The extraction keeps
only the four body paragraphs before as-Saib's heading and trims the notes at
the "(* *)" marker, so nothing here belongs to as-Saib's entry.

`abdullah-ibn-mazun-al-jumahi` had no catalog file before this batch:
`prisma/personSeedData3.ts` carries only his name and the `companion` title,
and `neo4j/graphSeedData3.ts` carries an uncited `SON` edge to
`mazun-ibn-habib`. The `prophet-muhammad-sira` batch does not cite him at
all. Uthman ibn Maz'un's own batch already declares the `BROTHER` edges
between Uthman and Abdullah, from Uthman's side, so this batch adds none.

## What the entry supports

Six claims and six citations.

**Kunya.** The heading gives it directly: "عَبْدُ اللهِ بنُ مَظْعُوْنٍ الجُمَحِيُّ
أَبُو مُحَمَّدٍ" (`163-p1`), so `kunya` holds "أَبُو مُحَمَّدٍ".

**A second hijra to Abyssinia.** The entry's second line names which of two
hijras to Abyssinia this one was: "وَهَاجَرَ عَبْدُ اللهِ إِلَى الحَبَشَةِ الهِجْرَةَ
الثَّانِيَةَ" (`163-p2`). This adds him to the `second-hijra-to-abyssinia`
event, alongside Ja'far ibn Abi Talib, az-Zubayr ibn al-Awwam, and his own
brother Qudamah.

**Badr, Uhud, and the Trench.** Ibn Sa'd's account: "شَهِدَ بَدْراً، وَأُحُداً،
وَالخَنْدَقَ" (`163-p3`). This adds him as a plain participant to all three
battles, the one entry among the three Maz'un brothers that names Khandaq.

**Death year.** The same account closes: "وَمَاتَ فِي خِلاَفَةِ عُثْمَانَ سَنَةَ
ثَلاَثِيْنَ" (`163-p4`), thirty AH, in Uthman's caliphate. `deathYearHijri` holds
this value.

## What the model has no shape for yet

**The brotherhood pairing.** The same Ibn Sa'd passage pairs him with Sahl
ibn Ubayd ibn al-Mu'alla al-Ansari through the Prophet's mu'akhat at Medina
("وَآخَى رَسُوْلُ اللهِ ... بَيْنَهُ وَبَيْنَ سَهْلِ بنِ عُبَيْدِ بنِ المُعَلَّى الأَنْصَارِيِّ",
`163-p3`). The catalog has no relation type for this pairing and Sahl ibn
Ubayd is not a catalog subject, so it stays in the source text.

**Age at death.** The same line that gives his death year also gives his age,
"وَهُوَ ابْنُ سِتِّيْنَ سَنَةً" (`163-p4`), sixty. Deriving a birth year from a death
year and an age would be arithmetic on the source rather than a value it
states, so `birthYearHijri` stays unset.

**His brothers, named in his own entry.** The opening line lists Uthman,
Qudamah, and his nephew as-Saib ibn Uthman as present with him at Badr
("شَهِدَ بَدْراً هُوَ وَإِخْوَتُهُ: عُثْمَانُ، وَقُدَامَةُ، وَالسَّائِبُ وَلَدُ أَخِيْهِ", `163-p2`). All
three already have their own Badr claims from their own entries or seeds, so
this passage adds no new Badr participation; it stays as corroborating text
for the family's shared attendance rather than a separate claim.

## Corroboration and disputes

No other batch cites Abdullah ibn Maz'un, so there is nothing here to
corroborate or dispute against. His Badr, Uhud, and second-hijra dates agree
with his brother Qudamah's own entry, which records the same three events
for Qudamah without disagreement between the two accounts.

## Leaving the seed

`prisma/personSeedData3.ts` still carries `abdullah-ibn-mazun-al-jumahi`
with only a name and the `companion` title. This batch does not retire that
entry: the new `data/catalog/people/abdullah-ibn-mazun-al-jumahi.ts` carries
`companion` forward on its legacy marker and the `SON` edge to
`mazun-ibn-habib` on its legacy marker too, since this entry never restates
his father's name, matching both brothers' entries.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
