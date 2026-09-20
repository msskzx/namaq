# Batch: the Prophet's sira

This batch preserves al-Dhahabi's السيرة النبوية from *Siyar A'lam al-Nubala'*
and supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/prophet-muhammad/](accounts/prophet-muhammad/)

## Source account

The sira opens the Risalah third edition (1405/1985) and runs across the two
volumes the edition labels جزء السيرة ١ and ٢. All 988 printed pages are stored,
from ١/٢٩ to ٢/٤٩٦, in 5,246 paragraphs. The whole account is here because the
sira is one continuous text and slicing it by chapter would leave anchors that
later chapters have to renumber.

Printed numbering restarts at 5 when the account crosses into the second volume,
so page alone does not identify a passage. Anchors carry the volume, `1/29-p1`
through `2/496-p5`, which `passageAnchor()` in `src/lib/history/shamelaEntry.ts`
builds and `extractShamelaEntry.ts --volume` sets.

## What this instalment reads

Chapters one and two, printed pages ١/٢٩ to ١/٢٧٦, Shamela page ids 167 to 420.
Eighty-four claims and 117 citations. Eleven chapters remain, ending at
٢/٤٩٦.

Chapter one covers his lineage, his names, his birth, the deaths of his parents
and grandfather, Abu Talib's guardianship, his marriage to Khadijah, his
children, the rebuilding of the Kaaba, the first revelation, and the first
conversions. Chapter two runs from the first emigration to Abyssinia to the
arrival at Medina.

The Prophet has no legacy values yet, because his seed entry still stands and
nothing has been moved across. The same holds for every other subject this
batch touches.

## He stays seed-authored

`prisma/personSeedData.ts` still declares him, which keeps `catalog:project`
additive for him: it connects what this module holds and leaves every other
seeded value alone. Retiring his seed entry is what hands the catalog authority
over him, and that waits until all thirteen chapters are read. Reading one
chapter and taking the seed's author away would put the legacy marker on
everything the chapter did not reach, for no gain.

The chapter's Arabic is unvowelled where the companion entries are vowelled, so
every excerpt here matches its own pages rather than theirs.

## Seeking rain through him, and Abu Talib's verses

Quraysh were in drought and came to Abu Talib, who brought out the boy, put his
back to the Kaaba and let him hold his finger; the clouds came and the valley
ran (`1/55-p1`, `1/56-p1`). Abu Talib's three verses follow it as his own words
about the day, and the description keeps the one the poem is known by,
وأبيض يستسقى الغمام بوجهه ... ربيع اليتامى عصمة للأرامل (`1/56-p2`).

**Recorded LIKELY, and that is the finding.** al-Dhahabi reports it on a single
chain and grades it neither way, while grading what sits on either side: the
Bahira report is حديث منكر جدا with four reasons, and the very next report he
marks عبد الله بن شبيب وهو ضعيف. Letting this one stand is weaker than
authenticating it and stronger than the treatment a rejected report gets, so the
claim is neither ESTABLISHED nor dropped.

## Names and titles

**Ten of the seed's twelve titles are cited.** The hadith of أبي موسى names
محمد، أحمد، الماحي، الحاشر، العاقب، الخاتم، المقفى، نبي الرحمة، نبي التوبة،
نبي الملحمة (`1/38-p2`, `1/38-p4`, `1/38-p5`). الشفيع and سيد ولد آدم are not in
this chapter, so they stay the seed's.

**الأمين is his before the prophethood.** Quraysh called him that, and when they
quarrelled over who would set the Black Stone back in the rebuilt Kaaba they took
the first man through the gate as judge and said هذا الأمين رضينا به
(`1/40-p2`, `1/65-p1`).

**The kunya is a name, not a title.** أبو القاسم goes in the `kunya` column, as
[ADR 0014](../../../../docs/adr/0014-a-kunya-is-a-name.md) requires, with the
تواتر of it and the prohibition on combining the two (`1/40-p7`, `1/40-p8`).

**The lineage stops at عدنان.** al-Dhahabi says the chain to Adnan is
بإجماع الناس and gives the names behind the bynames: عبد المطلب is شيبة, هاشم is
عمرو, عبد مناف is المغيرة, قصي is زيد (`1/29-p7`). Four different counts of the
fathers beyond Adnan sit on the next two pages. None is taken, because the book
does not settle them.

## Nine Qur'an links

All nine come from verses the chapter quotes about him: al-Baqarah 129 and
al-Saff 6 for إبراهيم's prayer and عيسى's announcement (`1/47-p6`), al-Anbiya
107 for رحمة للعالمين (`1/39-p4`), al-Ahzab 45 for the Torah description
(`1/81-p1`), al-Ma'arij 13 for فصيلته (`1/32-p4`), al-Shu'ara 214 for the call to
his kin (`1/116-p2`), al-Ma'idah 67 for the end of the guard (`1/121-p8`),
al-Alaq 1 for the first revelation (`1/108-p4`), and al-Muddaththir 1 for the
second (`1/101-p4`).

## Family

Eleven relations, all cited. His father died while he was a foetus or twenty
eight months old (`1/53-p5`). His grandfather took him in after his mother died
and kept him until his own death, when the boy was eight (`1/54-p3`), and willed
him to Abu Talib, who said والله لا أسلمك أبدا (`1/54-p3`, `1/121-p1`). He
married Khadijah at twenty five and married nobody else while she lived
(`1/63-p1`). All seven children are hers but Ibrahim (`1/63-p4`).

**Zayd, and a second half for MAWLA.** Khadijah gave Zayd to him, he freed him
and adopted him before the revelation, and the boy was called زيد بن محمد until
al-Ahzab 5 ended the adoption (`1/111-p3`). The adoption is over and the
manumission is what the model can hold, but `MAWLA` had no other side in the
vocabulary, and the catalog rejects a relation that would reach the graph one
directional. `PATRON` is added for it. `MAWLA` points from the freedman to the
man who freed him, the way سالم مولى أبي حذيفة's name reads, and `PATRON` points
back, so this relation is the Prophet's `PATRON` to Zayd's `MAWLA`. Both sit in
the household colour beside `CONCUBINE`, which is still one sided and stays that
way, since Arabic has no separate word for its other side either.

## The birth, and its two days

The year is agreed and unusable. He was born عام الفيل, المجمع عليه
(`1/33-p2`, `1/35-p1`), which is not a hijri year, so the event's `hijriYear`
stays the seed's rather than being restated here.

The day is disputed and the model has one description to hold it in. al-Dhahabi
gives الإثنين لاثنتي عشرة ليلة مضت من ربيع الأول (`1/35-p2`, `1/35-p3`), and
reports أبو جعفر محمد بن علي on لعشر ليال خلون منه, which الدمياطي authenticated
(`1/36-p2`, `1/36-p4`). Both are authored, the second as `DISPUTED` and flagged,
and the description names both readings.

## The first revelation

The event takes two claims. The first is the opening of the wahy, الرؤيا الصالحة
then the angel at حراء with اقرأ باسم ربك الذي خلق (`1/95-p2`). The second places
the month: he would retreat to Hira a month each year, and the month God honoured
him in was Ramadan (`1/105-p4`). The chapter dates it by his age, forty, and not
by a year, so `hijriYear` is left alone.

Three ages compete at the calling, forty, forty three, and forty with Israfil
sent first and Jibril after. The model has no field for the age at prophethood,
so the disagreement stays on the page where it already is.

## Salman al-Farisi

Chapter one carries his own account of his search, and one sentence of it
settles three battle records: وحبسني الرق حتى فاتتني بدر وأحد، ثم شهدت الخندق،
ثم لم يفتني معه مشهد (`1/86-p2`). Badr and Uhud become `ABSENT_FROM` with
`ABSENT_EXCUSED`, since the source remarks on the absence and gives its reason,
and Khandaq becomes `PARTICIPATED_IN`. This follows
[ADR 0013](../../../../docs/adr/0013-separate-attendance-from-outcome.md): being
there is the relation, what happened there is the status.

His Islam is a new event, undated. He became Muslim at Medina after testing the
Prophet with charity and then a gift, and seeing the seal of prophethood between
his shoulders (`1/90-p3`). The long search that brought him from Ramahurmuz is
the book's and stays on its pages.

He is still declared in `prisma/personSeedData7.ts`, so the catalog only adds to
him. Nothing of his is removed by this batch.

## What al-Dhahabi rejects, and what that leaves

The Bahira report is in the pages and out of the model. al-Dhahabi calls it
حديث منكر جدا and gives four reasons against it, so no claim rests on it. Two of
the Salman chains draw the same treatment, منكر غريب for one and منقطع with
علي بن عاصم ضعيف كثير الوهم for the other. The account Salman gives in his own
words is the one the battle claims cite.

Removing a claim removes a selection and never the passage it selected from. All
988 pages stay as they are.

## Notes

This account has no footnote files. The sira pages on the digital host carry no
`hamesh` block, no rule, and no `(١)` markers, unlike the companion entries,
where the editor's notes are stored beside each page as `NNN.notes.md`. The sira
annotates itself inline instead, in al-Dhahabi's own voice: إسناده منقطع,
هذا منكر, الكلبي متروك. No claim in this batch cites a note, so nothing is lost.
`notesFile` is optional per page and can be filled in later without touching an
anchor.

# Chapter two

Printed ١/١٤٦ to ١/٢٧٦, ids 284 to 420. Forty-six claims and sixty-seven citations.
Nine new events, two existing ones extended, two titles, two of his wives, and
six people who gain a cited field.

## The two emigrations to Abyssinia

Ibn Ishaq names the first party outright, so the existing
`first-hijra-to-abyssinia` gains nine more people (`1/147-p3`, `1/147-p4`). Only
those with subjects in the app are linked; he counts eighty-three in all.

Uthman is the one the chapter singles out. Anas has the Prophet say of him and
Ruqayyah صحبهما الله، إن عثمان أول من هاجر بأهله بعد لوط (`1/146-p2`), which is
both his link to the event and his `virtues`.

**The second is a new event, and undated.** al-Waqidi puts it سنة خمس من المبعث
(`1/152-p3`), counted from the calling and not from the hijra, so it is not a
value `hijriYear` can hold. Ja'far leads it and speaks for them before the
Najashi (`1/154-p1`), who answers إن هذا والذي جاء به موسى ليخرج من مشكاة واحدة
and refuses to hand them over (`1/154-p2`). al-Zubayr swam the Nile on an
inflated waterskin to watch the battle for the Najashi's throne and bring the
news back (`1/155-p1`), which links him to this event as well as the first.

## Six more new events

**انشقاق القمر**, at Mecca, قبل مخرج النبي to Medina (`1/169-p2`, `1/169-p4`).

**The boycott in the شعب**, three years of it, ending when the صحيفة was found
eaten by the أرضة (`1/179-p2`, `1/179-p3`, `1/180-p2`). Abu Talib is linked to
it: he gathered his father's sons and put the Prophet inside their quarter.

**الإسراء والمعراج**, dated only against the hijra. al-Zuhri says قبل الهجرة
بسنة (`1/197-p2`), al-Waqidi قبل الهجرة بثمانية عشر شهرا, and Ibn Sa'd's
collective account moves it from Ramadan to Rabi al-Awwal. None is a hijri year,
so the field is unset. al-Waqidi also splits the Isra' from the Mi'raj and dates
them separately; the model has one event, and the description says both legs
share it.

**The two pledges at Aqaba.** The first is twelve men on بيعة النساء, before
fighting was made an obligation, which Ubadah ibn al-Samit narrates in his own
words (`1/241-p1`, `1/240-p4`). The second is seventy, with twelve نقباء named
(`1/247-p2`, `1/252-p1`). Only the six naqibs with subjects in the app are
linked.

**The deaths of Khadijah and Abu Talib**, in one year the chapter never numbers
(`1/194-p3`). Their order is disputed: al-Waqidi has her die thirty-five days
before him (`1/194-p5`), al-Hakim three days after (`1/194-p6`). A description
is one value, so it names both and the second claim is `DISPUTED`.

**الطائف**, where Thaqif turned him away and the angel of the mountains offered
to close the two hills on them (`1/231-p4`, `1/233-p1`).

## The hijra to Medina

The existing event gains the Prophet's own hijra: three nights in غار ثور with
Abu Bakr (`1/267-p1`), and the arrival on Monday the twelfth of Rabi al-Awwal
(`1/280-p3`). A day and a month are not a `hijriYear`, so the seed's date
stands.

Abu Salamah is linked too, but for the opposite reason: Ibn Ishaq makes him the
first of all of them, a year before the greater Aqaba (`1/258-p3`), not one of
the party that left with the Prophet. Abu Ayyub is linked because the camel
knelt at his door (`1/279-p2`).

## Two titles, both earned in this chapter

Neither is a new title. **`siddiq-al-ummah`** is Abu Bakr's, and the chapter
gives the naming outright: he affirmed the Isra' when others turned back,
فلذلك سمي أبو بكر الصديق (`1/202-p4`). **`dhat-an-nitaqayn`** is Asma's, from
the waistband she cut to tie the provisions for the hijra (`1/267-p1`).

## Wives, and what the model cannot hold of them

Aisha and Sawdah become `HUSBAND` relations, both married after Khadijah died
and both before the hijra (`1/229-p2`, `1/230-p1`).

Khadijah's own entry gives a great deal the model has no shape for: الطاهرة as
her name in the jahiliyyah, her two husbands before him, her age at marriage and
at death, and the house of قصب she was promised. Only the virtues land, in the
Prophet's own words, آمنت بي إذ كفر بي الناس (`1/195-p5`).

## What chapter two does not author

**The غرانيق report.** Musa ibn Uqbah carries it (`1/148-p13`, `1/149-p1`), and
it names no value the model holds. It stays on the page.

**سواد بن قارب.** al-Dhahabi calls the long version حديث منكر بالمرة with two
unknown narrators and a suspicion of forgery, and the shorter chains منقطع with
a narrator متفق على تركه (`1/166-p10`, `1/167-p3`). He allows that أصل الحديث
مشهور, which is not enough to rest a claim on.

**يوم بعاث** (`1/237`, `1/238`). It is a fight between Aws and Khazraj before
Islam, not a Muslim battle, and the app's battle model is for the latter.

**The wager on the Romans** (`1/186`, `1/187`). Abu Bakr staked five قلائص
against Ubayy ibn Khalaf before gambling was forbidden, and the reports
disagree over five years or seven or nine. The model records no wager and no
such year.

**Three ages at the calling, and the headcount at Aqaba.** Urwah counts seventy
men and one woman, Ibn Ishaq seventy and two (`1/250-p3`). There is no
headcount field, so the disagreement stays where it is.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed.
