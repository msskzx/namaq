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

Chapters one to five, printed pages ١/٢٩ to ١/٤٣٢, Shamela page ids 167 to
578. 202 claims and 320 citations. Eight chapters remain, ending at ٢/٤٩٦.

Chapter one covers his lineage, his names, his birth, the deaths of his parents
and grandfather, Abu Talib's guardianship, his marriage to Khadijah, his
children, the rebuilding of the Kaaba, the first revelation, and the first
conversions. Chapter two runs from the first emigration to Abyssinia to the
arrival at Medina. Chapter three is the first year after it.

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

# Chapter three

Printed ١/٢٨٣ to ١/٢٩٥, ids 421 to 433. Thirteen pages, fourteen claims and
twenty-five citations, seven new events and four people who gain a cited
field.

## The first chapter that can be dated

Chapters one and two dated everything against the calling or against the
hijra, and neither is a value the model holds, so every event they authored
left `hijriYear` unset. This chapter is headed السنة الأولى من الهجرة
(`1/283-p1`), which dates what sits under it. Every event here carries
`hijriYear: 1`, and every claim backing one cites that heading alongside its
own passage, so the dating is visible rather than assumed.

## The mosque

The camel knelt on a مربد belonging to two orphans of Banu al-Najjar, who
refused payment: لا نطلب ثمنه إلا إلى الله. The graves of the mushrikin were
dug up, the ruins levelled, the palms cut, and the pillars made of palm trunks
with a roof of fronds (`1/290-p2`, `1/286-p1`). Abu Ayyub is linked because the
Prophet stayed in his house until it was finished.

**Ammar carried two bricks to everyone else's one**, and the word came then:
ويح عمار، تقتله الفئة الباغية (`1/292-p2`, `1/292-p3`). al-Dhahabi notes the
addition is absent from al-Bukhari's wording and calls its isnad ثابتة, so it
is authored as it stands.

**مسجد قباء** is its own event, founded during the stay with Banu Amr ibn Awf
before he moved on (`1/285-p4`).

## The المؤاخاة

The act itself, which `PACT_BROTHER` records pair by pair. The chapter states
it and its legal effect, that they inherited from one another until al-Anfal 75
ended it (`1/294-p3`, `1/294-p4`), and names nobody, so only the Prophet is
linked. The pairs come from the companions' own entries.

## The adhan, and a name the source does not finish

عبد الله بن زيد and Umar were both shown it (`1/293-p8`). The chapter gives no
patronymic for the first, and two subjects in the app carry that name,
`abdullah-ibn-zayd-ibn-abd-rabbih` and `abdullah-ibn-zayd-al-najjari`. Choosing
between them would take knowledge this source does not supply, so only Umar is
linked and the description keeps both names as the book gives them.

## Two deaths and one Islam

**أسعد بن زرارة** died of الذبحة while the mosque was going up, and the Prophet
left his naqib place unfilled, saying أنا نقيبكم (`1/286-p2`). **البراء بن
معرور**, one of the twelve naqibs and the first hand to take the Prophet's at
the second Aqaba, died in the same year (`1/293-p3`).

**عبد الله بن سلام** came the day the Prophet arrived (`1/288-p2`, `1/289-p3`).
His own words about himself are his `virtues`, and the first thing he heard is
in the event's description.

## What chapter three does not author

**Which banner was first.** Hamzah's in Ramadan, called أول لواء عقد في الإسلام
(`1/293-p9`), against Ubaydah ibn al-Harith's, which Urwah calls أول راية عقدها
(`1/294-p2`). The model holds no ordering for them to compete in, so the
question stays on the page. The expeditions themselves are now recorded; see
**The expeditions** below.

**The list of munafiqun** (`1/292-p4` to `1/293-p2`), some thirty names. The
model has no field for it, and several of those named are noted as disputed in
the same breath.

**Three deaths on kufr** at Mecca and Ta'if (`1/293-p6`, `1/293-p7`), and
أبو قيس بن الأسلت, who nearly accepted Islam and swore off it for a year and
died inside the year (`1/294-p6` to `1/295-p3`). None has a subject in the app.

# Chapter four

Printed ١/٢٩٧ to ١/٣٧٤, ids 434 to 511. Seventy-eight pages, twenty-six claims
and forty-seven citations. This is Badr.

## A legacy value retired

`battles/badr` carried `hijriYear: 2` on the legacy marker, extracted by an
earlier agent from this same work without a citation. This chapter is headed
سنة اثنتين من الهجرة (`1/297-p1`) and al-Dhahabi dates the battle itself to
Friday morning, the seventeenth of Ramadan (`1/307-p1`, `1/307-p2`). `sira/badr`
cites both, so the value moves off the marker to a cited claim. It is the first
carried value this pass has been able to promote.

Zayd ibn Thabit's reading is recorded in the same breath, that he would honour
the seventeenth as Laylat al-Qadr because it was Badr. Ibn Mas'ud put it at the
eleventh from the end instead, and al-Dhahabi says المشهور ما قبله. The model
holds no night of Qadr, so that disagreement stays on the page.

## Badr's roster

Seventeen participations, on a battle that previously held five.

**In the عريش:** the Prophet and Abu Bakr, ليس معهما غيرهما. Sa'd ibn Mu'adh
proposed building it and then stood at its door with a sword (`1/327-p1`,
`1/308-p3`).

**The three who fought the duel:** Hamzah, Ali and Ubaydah ibn al-Harith, and
al-Dhahabi records that هذان خصمان اختصموا في ربهم was revealed about them and
their three opponents (`1/334-p2`, `1/335-p5`). Ubaydah is `MARTYRED`: Utbah
took his leg and he died two days later at as-Safra (`1/336-p3`, `1/314-p1`).

Also al-Miqdad, whose words made the Prophet's face light up and who was the
only horseman by al-Bara's account; Ibn Mas'ud, who finished Abu Jahl and
brought his head; Mus'ab, who carried the لواء; Ukkashah, whose broken sword was
replaced with a stick that became a sword; Bilal, who called out رأس الكفر أمية
بن خلف; and Ubadah ibn al-Samit, who narrates that al-Anfal came down about them
over the spoils.

**All fourteen martyrs are recorded** (`1/313-p6`, `1/314-p2`, `1/314-p3`), and
al-Dhahabi closes the list with فالجملة أربعة عشر رجلا, so the count is part of
what the source says and a test holds the record to it. Four were already
declared under `prisma/`; the other ten had no subject anywhere, and the catalog
now creates them. See **The martyrs, and a sex column** below.

**Two excused absences**, both with the Prophet's ruling attached. Uthman stayed
to nurse Ruqayyah and was given his share and his reward (`1/360-p6`,
`1/361-p1`). Sa'id ibn Zayd was in Syria and was given a share on his return
(`1/361-p2`). The same sentence covers Talhah, whose absence his own batch had
already recorded, so the two extractions agree.

## Five events of year two

The **change of the qiblah** in Rajab (`1/301-p2`), the **obligation of fasting
Ramadan** with Ashura's obligation abrogated and the fitrah at its end
(`1/362-p5`), the **marriage of Ali and Fatimah** with the درع حطمية as her
dower (`1/372-p7`, `1/373-p1`), the **death of Ruqayyah** during Badr itself
(`1/361-p1`), and the **death of Uthman ibn Mazun** shortly after it
(`1/363-p2`, `1/363-p3`).

Three relations come with them: Ali to Fatimah, and Uthman to both Ruqayyah and
Umm Kulthum, which is what دو النورين rests on.

## What chapter four does not author

**The Muslim headcount at Badr.** The chapter gives 313 (`1/325-p2`), 314,
315 (`1/325-p3`) and 319 (`1/330-p2`), and al-Bara's ثلاثمائة وبضعة عشر over
them all. There is no count field, so none is recorded.

**The casualty figures**, which disagree the same way: Musa ibn Uqbah and Urwah
say six Muhajirun and eight Ansar dead and forty-nine mushrikin killed; Ibn
Ishaq says four and seven, and forty-odd; al-Zuhri says over seventy killed and
as many captured (`1/351-p5` to `1/351-p8`).

**The ransom accounts and the captives' roster**, which al-Dhahabi himself
abridges with تركتهم خوفا من التطويل.

# The expeditions

Chapters three and four name twelve movements the app had no shape for, because
every record under `data/catalog/battles/` was a battle and a سرية that met no
fighting is not one. `Battle.engagement` is added for it, and ten of them are
now records.

The value is read off the source, not assigned. al-Dhahabi heads his own
sections غزوة when the Prophet went out himself and بعث or سرية when he sent a
detachment, so each expedition's `engagement` cites the passage that names it.
`GHAZWAH` covers الأبواء, بواط, العشيرة, بدر الأولى, بني سليم and السويق, and
Badr itself, which `1/301-p3` heads غزوة بدر الكبرى. `SARIYYAH` covers بعث حمزة,
بعث عبيدة, سرية سعد and سرية نخلة. Everything outside his campaigns is `BATTLE`
and stays on the legacy marker, since this pass has not reached those pages.

**Two of the twelve are left out.** سرية عمير بن عدي against عصماء بنت مروان
(`1/370-p5`) and سرية سالم بن عمير against أبو عفك (`1/371-p2`) both rest on
الواقدي alone, with no isnad given, where every other expedition here comes
through ابن إسحاق, موسى بن عقبة or عروة. Neither leader has a subject in the app
either.

**One expedition is dated two ways.** Chapter four puts بعث حمزة in one of the
two Rabi's of year two (`1/297-p5`); chapter three puts his banner in Ramadan of
year one and calls it the first in Islam (`1/293-p9`). The record takes year
two, where the narrative sits, and `hamzah/sariyyah-year-alt` carries the other
reading as `DISPUTED`.

**What the expeditions gave beyond themselves.** Ali's kunya أبو تراب, which the
Prophet gave him at العشيرة when he woke him out of the dust (`1/299-p1`), goes
in the `kunya` column as [ADR 0014](../../../../docs/adr/0014-a-kunya-is-a-name.md)
requires. Sa'd ibn Abi Waqqas loosed أول سهم رمي في سبيل الله at بعث عبيدة
(`1/298-p1`).

# The martyrs, and a sex column

Ten of the fourteen dead of Badr had no subject in the app, so the roster could
only be recorded four deep. They are authored now, and since nothing under
`prisma/` declares them, these modules are their only author: `catalog:project`
creates the rows and `people:sync` gives them graph nodes.

Two of the ten the chapter narrates rather than lists. **مهجع مولى عمر** was shot
and is أول قتيل في سبيل الله, and **حارثة بن سراقة** was shot drinking at the
cistern (`1/307-p4`). **عمير بن الحمام** heard قوموا إلى جنة عرضها السموات
والأرض, said بخ بخ, threw away the dates he was eating rather than live long
enough to finish them, and fought until he was killed (`1/334-p4`, `1/335-p2`).
**معوذ بن عفراء** struck Abu Jahl down, and the Prophet called the two sons of
Afra partners in killing فرعون هذه الأمة (`1/310-p8`, `1/340-p3`).

## Sex is a value like any other

`Person.sex` is added, `MALE` or `FEMALE`, a string with its vocabulary in
`SEXES` and `catalog:validate` enforcing it. What it buys is in the graph: a
`FATHER` relation reverses to `SON` or `DAUGHTER` depending on the sex of whoever
the inverse edge points at, and `relations.ts` had no way to know, so every such
relation had to state its `inverse` by hand.

**It is cited, not inferred.** The martyrs take it from the roster's own count
of the fourteen as رجالا, not from their names being masculine Arabic. Everyone
else takes it from a passage that says it outright: بن, بنت, أبو, or Uthman's
زوجته. Where no passage says it, the column is left unset rather than marked
owed, because `legacyUnreviewed` belongs to the one-time migration and not to an
authored module.

That discipline was enforced by a test already in the repo rather than by me.
The first pass backed each `sex` with whatever claim was nearest, and
`prophet-muhammad.test.ts`'s rule that a single-claim field must cite a claim
about that same field rejected it: `prophet/lineage` is about `fullName`. Each
person now has a claim whose own field is `sex`.

# Chapter five

Printed ١/٣٧٥ to ١/٤٣٢, ids 512 to 578. Thirty claims and forty-four citations.
This is Uhud.

## A second legacy value retired

`battles/uhud` carried both `hijriYear: 3` and its `engagement` on the legacy
marker. The chapter is headed سنة ثلاث من الهجرة and غزوة أحد: وكانت في شوال,
and Qatadah dates the fighting to Saturday the eleventh of Shawwal
(`1/375-p1`, `1/391-p1`, `1/391-p2`). `sira/uhud` cites all three, so the year
and the fact that he led it in person both move onto evidence.

Ibn Ishaq says للنصف من شوال instead (`1/391-p3`). The model holds no day, so
that is `sira/uhud-date-alt`, DISPUTED, and stays in prose.

## Uhud's roster

Six participations became twenty-two.

**The Prophet is INJURED and present**, which is the distinction ADR 0013
exists for: his face was cut, a front tooth broken and the helmet driven into
his cheek, and Fatimah washed the blood while Ali poured (`1/412-p2`).

**Six of the dead.** Hamzah, fighting with two swords saying أنا أسد الله,
killed by Wahshi's javelin and then mutilated (`1/404-p7`, `1/410-p2`). Mus'ab,
killed carrying the لواء by Ibn Qami'ah, who thought he was the Prophet
(`1/401-p3`). Abdullah ibn Jubayr, who commanded the fifty archers and was the
one who held the hill (`1/395-p1`). Hanzalah, غسيل الملائكة (`1/411-p4`). Anas
ibn an-Nadr, found with eighty-odd wounds and known only by his sister from his
fingertips (`1/407-p2`). Sa'd ibn al-Rabi, with seventy blows in him
(`1/409-p2`). Amr ibn al-Jamuh, lame, who asked whether he would walk into the
Garden on that leg sound, and Abdullah ibn Amr ibn Haram, buried with him in one
grave because they were متصافيين (`1/408-p3`, `1/429-p4`).

**And the living.** Abu Dujanah, who took the sword بحقه and then shielded the
Prophet with his own back until it filled with arrows (`1/395-p4`, `1/399-p2`).
Talhah, whose hand was crippled shielding him and who was told أوجب طلحة
(`1/399-p5`, `1/407-p1`). Abu Ubaydah, who drew the helmet rings out of the
Prophet's face with his teeth and lost two of his own (`1/413-p3`). Qatadah ibn
al-Nu'man, whose eye fell onto his cheek and was put back (`1/415-p2`). Ka'b ibn
Malik, the first to recognise him after the rout (`1/406-p3`). Hudhayfah, whose
father the Muslims killed by mistake and whose blood he gave away (`1/404-p6`).
Umm Sulaym, carrying waterskins on her back (`1/400-p2`).

**Three had no subject in the app**: Hanzalah, Abdullah ibn Jubayr and Anas ibn
an-Nadr. The catalog creates them, as it did the ten of Badr.

**al-Zubayr's title gets its origin.** His own entry listed `hawari-al-ummah`;
this chapter gives where it came from, the duel on camelback and إن لكل نبي
حواريا والزبير حواريي (`1/397-p3`). The assignment now cites both batches.

## The rest of year three

**قتل كعب بن الأشرف** (`1/387-p4`, `1/388-p1`), a new event: he satirised the
Prophet and roused Quraysh after Badr, and Muhammad ibn Maslamah volunteered.

**إجلاء بني النضير**, and the chapter dates it two ways itself. al-Zuhri on
Urwah puts it على رأس ستة أشهر من وقعة بدر, which the same chapter makes المحرم
سنة ثلاث (`1/378-p4`, `1/382-p2`). Musa ibn Uqbah and Ibn Ishaq put it after
Uhud (`1/380-p5`), which would be year four. The event takes the dated reading
and `sira/banu-nadir-after-uhud` carries the other as DISPUTED.

**The birth of al-Hasan** in Ramadan (`1/390-p3`), and two marriages: Hafsah
bint Umar, and Zaynab bint Khuzaymah, who is أم المساكين and lived only months
(`1/390-p4`, `1/390-p5`). The title is not new; this is where it is cited for
her.

## What chapter five does not author

**The casualty count**, which the chapter argues with itself about: seventy by
al-Bara and Ibn Abbas, forty-nine by Musa ibn Uqbah, forty-seven, sixty-five by
Ibn Ishaq, sixty-four Ansar and six Muhajirun by Ubayy. al-Dhahabi settles it,
قول من قال سبعين أصح, explaining the smaller numbers as counts of the named
(`1/420-p4` to `1/421-p4`). The model holds no count, so none is recorded.

**Four more expeditions**: ذي أمر, بحران, قرقرة الكدر and سرية زيد إلى القردة.
They fit `engagement` now, and are left for the next pass rather than widening
this one.

**بنو قينقاع**, which the chapter treats before Uhud (`1/377-p2`). It has no
battle record and is a siege rather than a غزوة the book heads as one; adding
it is the same shape of decision the expeditions were, and it can travel with
them.

**The long roster of the Uhud dead by clan** (`1/421-p5` to `1/423-p7`), where
almost none has a subject in the app.

# Review

Nothing in this batch is reviewed, across all four chapters. The claims are
authored but nobody has compared them against the stored pages, so every one of
the 124 is Not reviewed. The batch's approval permits publication and says
nothing about review.
