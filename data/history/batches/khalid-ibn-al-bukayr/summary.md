# Batch: Khalid ibn al-Bukayr, Siyar entry 17

This batch gives خالد بن البكير الليثي his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/khalid-ibn-al-bukayr/](accounts/khalid-ibn-al-bukayr/)

## Source account

Entry 17 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on the same
printed page (186) where Aqil ibn al-Bukayr's entry closes, right after "أخوه"
introduces him as Aqil's brother, and it closes on the same page: entry 18,
their brother Iyas, opens a few lines later with its own numbered heading and
its own source-list footnote. The whole entry is five paragraphs on one page,
so this batch's account has a single page rather than a range.

## What this entry supports

Seven claims, all citing the same page. Khalid had no catalog file before this
batch; the seed row only gave his name and a bare "companion" title, so this
batch is his first author.

His full name, from the entry's own heading: "خَالِدُ بنُ البُكَيْرِ بنِ عَبْدِ
يَا لَيْلَ بنِ نَاشِبٍ اللَّيْثِيُّ" (`186-p5`). The entry adds one line, "أَوِ
ابْنُ أَبِي البُكَيْرِ", offering the same alternate father's name that Aqil's
entry already argued over at length; that dispute was told once there, so this
batch does not re-cite it.

The Prophet paired him with Zayd ibn al-Dathinah under the pact of
brotherhood (`186-p7`), which gives Khalid his first `PACT_BROTHER` relation.
Zayd had no catalog subject anywhere in the app, so this batch creates a bare
one for him, the same way Aqil's batch created Mubashshir's, and reads the same
pairing as evidence of his `sex`, the same way an earlier batch read Abdullah
ibn Jubayr's place in a named roster.

He attended Badr and Uhud, and was killed at al-Raji' in Safar of year four:
"شَهِدَ خَالِدٌ بَدْراً، وَأُحُداً، وَقُتِلَ يَوْمَ الرَّجِيْعِ فِي صَفَرٍ
سَنَةَ أَرْبَعٍ" (`186-p8`). Unlike Aqil, he survived Badr, so this batch adds
him to `data/catalog/battles/badr.ts` with no `status`, and the same clause
adds him to `data/catalog/battles/uhud.ts`. The death clause splits into two
field claims, `deathYearHijri` ("4") and `placeOfDeathArabic` ("الرجيع"),
since one citation can back more than one field.

## What the model has no shape for yet

His age at death, thirty-four, has no catalog field, the same gap Aqil's age
left. It stays in the source text.

Al-Raji' itself is not a battle in this app's catalog: it was a small party
sent to teach, not a ghazwah, and the model's `Battle` kind covers named
battles and expeditions rather than every fatal encounter. `placeOfDeathArabic`
records where he died without needing a Battle row for it.

## Corroboration

`prophet-muhammad-sira`'s account of the Raji' incident (pages 415-417 of
that batch, not part of this one) names "خالد بن البكير الليثي" among six
companions sent out with Asim ibn Thabit, corroborating this entry's death
account. No claim in that batch attaches to Khalid specifically, so there is
nothing to compare against at the claim level, and this batch does not add
one: doing so would extend `prophet-muhammad-sira`, not this batch. The two
accounts do not conflict; the Raji' narrative is a much longer telling of the
same event this entry states in one line.

## Leaving the seed

`prisma/personSeedData3.ts` no longer carries `khalid-ibn-al-bukayr` as an
active entry. `data/catalog/people/khalid-ibn-al-bukayr.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its seed
row in the same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
