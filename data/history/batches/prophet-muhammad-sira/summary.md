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

Chapters one to twelve, printed pages ١/٢٩ to ٢/٢٨٩, Shamela page ids 167 to
948. 390 claims and 552 citations. One chapter remains, ending at ٢/٤٩٦.

Chapter one covers his lineage, his names, his birth, the deaths of his parents
and grandfather, Abu Talib's guardianship, his marriage to Khadijah, his
children, the rebuilding of the Kaaba, the first revelation, and the first
conversions. Chapter two runs from the first emigration to Abyssinia to the
arrival at Medina. Chapter three is the first year after it, and the chapters
run a year each from there: chapter six is the fourth.

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

## Rebuilding the Kaaba

Quraysh pulled the Kaaba down to Ibrahim's foundation and rebuilt it, and when
the building reached the place of the Black Stone they quarrelled four nights
over who would set it. Abu Umayyah, the oldest of them, said to take the first
man through the gate as judge; it was him, and they said هذا الأمين رضينا به. He
laid it in a cloth, had each tribe take a corner, and set it himself
(`1/64-p2`).

**The title came first and the event second.** `prophet/al-amin` was authored
from this passage in the first pass, and the rebuilding it was earned in was
left out. A test now holds the two to the same pages.

Undated. Urwah and Mujahid put the building قبل المبعث بخمس عشرة سنة
(`1/65-p2`), counted from the calling, which is not a value `hijriYear` holds,
so it is unset the way the birth's and the Isra's are.

The description also carries the call that came while he was carrying stones
with them, عورتك, فما رؤيت له عورة بعد (`1/65-p3`, `1/66-p4`).

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

**Four more expeditions** and **بنو قينقاع** were left here for the next pass.
The heading sweep below took them.

**The long roster of the Uhud dead by clan** (`1/421-p5` to `1/423-p7`), where
almost none has a subject in the app.

# The heading sweep

Five chapters in, the same question kept coming back. The claims are authored
from what the reader noticed, and nothing says what the reader walked past. So
this pass went back over chapters one to five with the book's own table of
contents as the checklist.

al-Dhahabi's editor brackets every section heading, which makes them
extractable. Of the 53 headings before السنة الرابعة, 17 sections had produced
no citation at all. Four of those are headings over other headings or the title
of the book. The other 13 were misses, and this pass authored every one.

The check catches a section nothing cites, not a section cited for the wrong
thing. زيد بن عمرو بن نفيل is the example: his section was already cited, but
for the Prophet, and nothing in it was about him. He came out of reading the
section rather than out of the check, and so did بنو قينقاع, which sits inside
بحران's section rather than under a heading of its own.

`headingSweep.test.ts` now runs the check on every `npm test`. A section that
cites nothing fails the suite unless `DECLINED` names it and says why, and a
decline that no longer matches an empty section fails too, so the list cannot
rot. `UNSWEPT_FROM` marks where the authored chapters stop and moves forward as
chapters land.

## People the app did not have

**زيد بن عمرو بن نفيل** (`1/76-p1` to `1/78`), who has a section of his own in
chapter one. He is not a Companion, since he died before the mission, and Sa'id
ibn Zayd, who is one, is his son. The chapter has him standing against the
Kaaba saying ما منكم أحد على دين إبراهيم غيري, refusing what was slaughtered
for idols at the foot of Baldah, and saving buried daughters. Two events come
with him, the meeting (MET) and the death (DEATH), with إنه يبعث يوم القيامة
أمة وحده, of which al-Dhahabi says إسناده حسن.

**سمية بنت خياط** (`1/176-p5`), أول شهيد في الإسلام. Her relation to Ammar is
not recorded: the chapter calls her أم عمار, which is how it identifies her
rather than a statement about parentage, and it says nothing else about the
family.

**ضماد الأزدي** (`1/158-p2`), who came to Mecca to treat what he had heard
called madness, heard خطبة الحاجة instead, and gave his hand on Islam and on
his people's.

## Sections that had produced nothing

**فأول من آمن به خديجة** (`1/102`). Ibn al-Athir's خديجة أول خلق الله أسلم
بإجماع المسلمين is one claim; the disagreement over أول الرجال, Abu Bakr
against Ali against Ibn Ishaq's ordering, is a second, marked DISPUTED. Both
back the same event description, which is where the model holds the value they
compete over.

**إسلام أبي ذر** (`1/133` to `1/136`), **إسلام حمزة** (`1/137`) and **إسلام
عمر** (`1/138`), one event each. Abu Dharr's two narrations disagree on who led
him in, Ali at Zamzam or the Prophet himself, and the description keeps what
both give, the concealment he refused.

**ذكر أذية المشركين** (`1/174` to `1/178`), the seven who first declared Islam.
Five of them already had subjects, and the roster now cites them: Abu Bakr,
Ammar, Suhayb, Bilal with أحد أحد, and the Prophet. Sumayyah's killing sits in
this event rather than a death of its own, because that is how the chapter
gives it.

**Three Qur'an links** the sections exist for: ويسألونك عن الروح (17:85),
إنا كفيناك المستهزئين (15:95), and إسلام الجن (46:29), all on the Prophet.
ذكر الروم gives a fourth, and it belongs to Abu Bakr, who made the wager: the
chapter quotes الروم ٢-٤ whole, so the link is recorded verse by verse.

## The year-three engagements

The four the chapter-five summary left for later, plus one the sweep turned up.

**غزوة ذي أمر** (`1/375-p4`), Muharram of year three against Ghatafan at Najd,
with Uthman over Medina. **غزوة بحران** (`1/375-p7` to `1/376-p1`), where Ibn
Ishaq has him set out for Quraysh and al-Waqidi for Banu Sulaym. The model
records neither target, so the disagreement stays on the page. Both are
undated in the section beyond the year, and both ended رجع ولم يلق كيدا.

**غزوة بني قينقاع** (`1/377-p2` to `1/378-p2`), first of the Jews to break the
covenant, besieged until they came down on his judgment and exiled to
Adhri'at. The section dates it only فيما بين بدر وأحد, which is a span rather
than a year, so `hijriYear` stays unset.

**غزوة حمراء الأسد** (`1/437-p7` to `1/438-p3`), the morning after Uhud and open
only to those who had fought there. Aishah names her father and al-Zubayr among
the seventy. Nobody carries a status: لم يلقوا عدوا.

قرقرة الكدر and سرية زيد إلى القردة turn out to be cited already, inside
sections the sweep found covered.

## What the sweep declines

Four headings, all structural, all listed in `DECLINED` with the reason:
the book's title, the title of the part holding these chapters, and the two
headings that stand over غزوة بواط and غزوة العشيرة, and over غزوة ذي أمر and
غزوة بحران. Their sections carry the citations.

The ledger moved from 443 cited values to 516. The 37 awaiting evidence did not
change.

# Four counts on a battle

Chapter five had to leave an argument on the page. The chapter counts the Uhud
dead five different ways and al-Dhahabi settles it himself, قول من قال سبعين
أصح, explaining the smaller figures as counts of the named. The model held no
count, so none of that was recorded.

`Battle` now carries four: `muslimForceCount`, `nonMuslimForceCount`,
`muslimDeathCount` and `nonMuslimDeathCount`. Four rather than two because the
sources count the two sides separately, and a battle where one side was counted
and the other was not is the ordinary case, not the exception.

**Badr**: 313 against 950, with 14 Muslim dead and 70 Meccan. The Muslim figure
is Abu Ayyub's own count (`1/325-p2`), which al-Dhahabi's telling repeats
(`1/345-p7`) and al-Bara's ثلاثمائة وبضعة عشر agrees with (`1/324-p5`). Umar's
319 and Ibn Amr's 315 are DISPUTED claims. Quraysh's 950 is Musa ibn Uqbah's
(`1/345-p5`), from the maghazi this chapter introduces as فإنها من أصح
المغازي; the round ألف that Umar gives (`1/330-p2`) is DISPUTED. The dead are
the Sahihayn's seventy killed and seventy captured (`1/352-p1`, `1/330-p3`)
against Ibn Ishaq's بضعة وأربعون (`1/351-p7`), and fourteen Muslims, six of
Quraysh and eight of the Ansar (`1/351-p5`), against his eleven. Chapter four's
roster names fourteen, which is what settles that one.

**Uhud**: 700 against 3000, with 70 Muslim dead. The seven hundred is not a
choice between readings. Urwah's ألف counts before Abd Allah ibn Ubayy turned
back with three hundred, and the same sentence says so (`1/392-p3`), so Qatadah
(`1/391-p2`), al-Zuhri (`1/392-p2`) and Urwah all land on seven hundred in the
field. Three thousand is al-Zuhri's and Urwah's; Qatadah's ألفين, which he
hedges with أو ما شاء الله من ذلك, is DISPUTED. Nobody counted the Meccan dead,
so that column stays unset.

**بحران**: 300, al-Waqidi's count of the force he took out (`1/376-p1`). The
other side is not counted, and the column is empty rather than zero.

Every competing figure is a claim of its own, marked DISPUTED, citing the same
column the taken figure cites. `counts.test.ts` checks that: a competing figure
that no column took must be DISPUTED, and a column must cite a claim about that
same column.

# Years before the hijra

Four events said the same thing in their module comments: the chapter dates
this only against the hijra, so the field stays unset. `hijriYear` is a plain
`Int` and always could have held a negative, so the gap was a convention nobody
had written down.

It is written down now. A year before the hijra is negative, there is no year
zero, and `-1` is the year the sira writes قبل الهجرة بسنة, the one the hijra
came at the end of. `npm run catalog:validate` rejects a zero. `formatHijriYear`
is the one place the sign becomes something a reader sees, `1 ق.هـ` or `1 BH`
beside `3 هـ` and `3 AH`, and `compareHijriYear` orders a timeline with them.
The old `(a ?? 0) - (b ?? 0)` put an undated entry at zero, which was before
everything only while every year was positive.

**الإسراء والمعراج** at -1, from al-Zuhri through Musa ibn Uqbah: قبل الهجرة
بسنة (`1/197-p2`). Ibn Sa'd's قبل الهجرة بثمانية عشر شهرا (`1/221-p2`) reaches
back into the year before that, so it is DISPUTED rather than a second value.

**وفاة أبي طالب**, **وفاة خديجة** and **الخروج من الشعب**, all at -3 and all
from one sentence of al-Waqidi's: خرجوا من الشعب قبل الهجرة بثلاث سنين، وأنهما
توفيا في ذلك العام (`1/194-p5`). The boycott's year is the year it ended, which
is the only point the chapter numbers; its description carries the ثلاث سنين
that says so.

What still has no year is anything the chapter counts from the mission rather
than the hijra: the two emigrations to Abyssinia at سنة خمس من المبعث, the
pledges at العقبة, the rebuilding of the Kaaba at قبل المبعث بخمس عشرة سنة.
A year from the mission is a different era, not a negative hijri year.

# What someone said

A profile field holds what is said about a person. `virtues` is the sira's own
wording for why the subject matters, and a hadith in praise of someone lands
there as part of that. Nothing held what a person said, and the sira is full of
it: 50 runs of verse in chapters one to five alone, before counting prose.

`Utterance` is one record for both, `POETRY` or `SAYING`, with the text as the
source prints it, a speaker, who the words are about, the occasion in the
source's wording, an optional event or battle, and a `grading` that is the
source's own verdict and nothing else. The reasoning is
[ADR 0015](../../../docs/adr/0015-one-record-for-what-someone-said.md), which
also says why this is not a hadith model and will not become one.

Ten to start with, which is what the structure needed to be exercised rather
than the back-fill:

- **أبو طالب** twice: the istisqa لامية, وأبيض يستسقى الغمام بوجهه (`1/56-p2`
  to `1/56-p4`), which the istisqa event had the occasion for and no place for
  the verse; and والله لن يصلوا إليك بجمعهم (`1/121-p3` to `1/121-p7`), whose
  last line says what kept him from the دين he calls the best of them.
- **زيد بن عمرو بن نفيل** twice: عذت بما عاذ به إبراهيم (`1/78-p2`) and أربا
  واحدا أم ألف رب (`1/80-p3`). The heading sweep gave him a subject a few
  sections ago; these are his own words, which had nowhere to go.
- **معبد الخزاعي** at Hamra al-Asad (`1/439-p3` to `1/440-p4`), six lines that
  turned Abu Sufyan back. He was a mushrik that day and has no subject, so his
  name is text.
- **نحن بنات طارق** (`1/396-p3`), sung by a woman the chapter never names, and
  **هند بنت عتبة**'s نحن جزيناكم بيوم بدر from the rock (`1/425-p2`). Both are
  names rather than subjects, for the same reason.
- **The Prophet's rajaz** at the mosque, هذا الحمال لا حمال خيبر (`1/290-p6`).
  POETRY rather than SAYING: the kind is about what the words are, not who said
  them.
- **Two sayings**, which is where `grading` earns its place: إنه يبعث يوم
  القيامة أمة وحده with al-Dhahabi's إسناده حسن (`1/77-p3`), and غفار غفر الله
  لها with أخرجه مسلم (`1/135-p1`). One is a verdict and the other a takhrij,
  and the column holds both because it holds whatever the source wrote.

## Chapter one's verse

Chapter one is now swept, the way its headings were. The editor prints a
hemistich break as ` ... `, which finds a line of verse without knowing any
metre, and consecutive lines are one poem. That gives 17 runs before `1/146`,
one of which is prose abbreviating a hadith it had already quoted. The other 16
are all recorded.

Eleven are new here, on top of the five the structure arrived with:

- **أبو طالب** four more times. وشق له من اسمه ليجله (`1/40-p4`), quoted for
  what the Arabs said of it rather than for what it says. ألا قل لعمرو والوليد
  ومطعم (`1/123-p3`), after Quraysh offered him Umarah ibn al-Walid for his
  nephew. And the لامية (`1/130-p3` to `1/131-p7`), which the chapter prints in
  two runs with its own break between them: the citation keeps that break as an
  ellipsis rather than joining them into a poem the source did not print. Two of
  its lines are the istisqa quotation from seventy pages earlier with different
  wording, ثمال اليتامى against ربيع اليتامى, so they stay two records.
- **العباس** (`1/48-p4`), after asking leave to praise him and being answered
  لا يفضض الله فاك, and **عبد المطلب** circling the House when the boy he had
  sent after his camels was late back (`1/54-p5`).
- **ورقة بن نوفل** twice (`1/100-p3`, `1/107-p5`). He has no subject in the
  app, so his name is text; that is a statement about the catalog and not about
  him.
- **عبد المسيح بن بقيلة** twice, from the Satih story (`1/43-p2`, `1/44-p1`).
  al-Dhahabi closes it with هذا حديث منكر غريب, and both carry that as their
  grading. A rejected report can be recorded because the grading is what keeps
  it from reading as an accepted one.
- **أم جميل بنت حرب**'s مذمما أبينا (`1/119-p1`), which is verse against him
  rather than for him. The occasion says who said it and why, and the chapter
  gives his answer in the same passage.
- **أبو قيس بن الأسلت** (`1/131-p9`), an Awsi calling Quraysh to the hanifi
  religion and reminding them of the Elephant.

`poetrySweep.test.ts` runs the check, with `UNSWEPT_FROM` at `1/146-p1` and a
`DECLINED` entry for the one prose run. It moves forward as chapters are swept,
never to make a failure go away.

## Chapters two to five's verse

The boundary moved to `1/443-p1`, which puts the whole authored run under the
check. **46 poems in chapters one to five, all recorded.**

The detector got one thing right that a decline had been papering over. Prose
borrows the same three dots to abbreviate a hadith it has already quoted, and
marks it by what follows: `... الحديث`. That is the editor's own sign, not a
hemistich, so the sweep skips it outright and `DECLINED` is empty. Four runs
that would have needed declining are simply not verse.

Twenty-two new poems. The ones worth naming:

- **Two Abyssinia poems** (`1/148-p1`, `1/148-p8`). Abd Allah ibn al-Harith's
  is tied to neither crossing, so it carries no event; Uthman ibn Mazun's is
  reproach of his own cousin Umayyah ibn Khalaf, and he has a subject, so it is
  a link.
- **Four from the jinn sections** (`1/163-p3`, `1/165-p2`, `1/165-p6`,
  `1/165-p10`) and **Sawad ibn Qarib's own answer** (`1/166-p2`). The three
  nights are three records: the chapter prints them with the same opening and a
  different rhyme each time, and joining them would invent a poem it never
  printed.
- **Two hawatif on Abu Qubays** (`1/239-p3`, `1/239-p5`). The first names no
  Sa'd and Abu Sufyan spends the morning guessing; the second answers him.
- **عمرو بن الجموح** to his own idol, found in a pit tied to a dead dog
  (`1/257-p4`), and **the Prophet in the cave** to Abu Bakr, whose hand a stone
  had cut (`1/268-p4`).
- **The hatif of Umm Ma'bad** (`1/274-p2`), sung through upper Mecca by a voice
  nobody could see, which is how the chapter has Mecca learn where he had gone.
- **أم سلمة** for al-Walid ibn al-Walid (`1/319-p2`), the one poem in these
  chapters by a Mother of the Believers, and **عاتكة** after Badr (`1/324-p3`),
  answering the men who had called her dream a lie.
- **حسان** twice (`1/383-p2`, `1/414-p8`), **كعب بن الأشرف**'s first open
  hija (`1/386-p4`) and **أبو عزة** calling Kinanah out for Uhud after Badr let
  him go on a promise (`1/394-p4`).

Two quotations became citations rather than records. هذا الحمال لا حمال خيبر is
printed twice in the same words (`1/284-p2`, `1/290-p6`), and أبو قيس's qasida
is quoted a second time as قصيدته المشهورة التي أولها (`1/294-p7`) with one
line's wording changed. Both join the claim that already holds them: one poem,
one record, two citations. That is the opposite call from the لامية and the
istisqa quotation, and for the opposite reason -- there the chapter frames two
separate quotations, here it points back at one poem.

The mosque's اللهم rajaz is one record with three citations for the same
reason. `1/284-p4`, `1/290-p3` and `1/290-p8` differ over a word each way
(إن الأجر أجر الآخره against لا خير إلا خير الآخره, فارحم against فانصر), which
is three isnads on one rajaz rather than three poems.

## ورقة بن نوفل

He had been carrying two poems as `speakerName` for want of a subject. He has
one now: no seed file declares him, so the catalog is his only author. He is not
a Companion -- he died before the message spread, and the chapter says so in the
same breath as his word to the Prophet -- but chapter one keeps returning to him.

The chapter disagrees with itself about how he is related to Khadijah. Ibn Ishaq
has عمها (`1/100-p2`), al-Zuhri's account ابن عمها (`1/106-p2`). The relation
takes the cousin reading, which the chapter's own lineages support: Uthman ibn
al-Huwayrith **ibn Asad** is called ابن عم ورقة at `1/79-p3`, so Waraqah
descends from Asad, as Khadijah bint Khuwaylid **ibn Asad** does.
`waraqah/uncle-khadijah` carries the other as DISPUTED.

From chapter six the verse is captured as it is read.

# إسلام السابقين الأولين

The heading sweep passed this section: one anchor in its span was cited
(`1/111-p3`, the Zayd manumission), and the check asks whether a section
produced anything, not whether it was mined. Sixteen passages, one citation.
That is the same shape of miss as زيد بن عمرو, whose section was cited for the
Prophet and not for him, and it is the limit of what a coverage check can catch.

**Abu Bakr brought five in** (`1/112-p1`). He was مألف لقومه, أنسب قريش لقريش,
and فأسلم بدعائه عثمان والزبير وعبد الرحمن بن عوف وطلحة وسعد بن أبي وقاص، فجاء
بهم إلى رسول الله. The graph had no way to say that, so
`CALLED_TO_ISLAM`/`ANSWERED_CALL_OF` is new. The direction is Ibn Ishaq's own:
reversed, the graph would say the five brought Abu Bakr in.

**The eight** of that same sentence, فكان هؤلاء النفر الثمانية أول من سبق
بالإسلام وصلوا وصدقوا, now hold `al-sabiqoon`. The title already existed; this
is where it is cited.

**القرينان** (`1/113-p2`). Nawfal ibn Khuwaylid, who was called أسد قريش, tied
Abu Bakr and Talhah in one rope after they became Muslims, ولم تمنعهما بنو تيم,
فلذلك سمي أبو بكر وطلحة القرينين. A new title, and one neither of them holds
alone, so both modules carry it. Talhah's Busra monk comes from the same
passage: the monk asked after أحمد and told him فإياك أن تسبق إليه.

**The rest of the section**: Sa'd's لقد مكثت سبعة أيام وإني لثلث الإسلام
(`1/114-p4`), Sa'id ibn Zayd bound by Umar over Islam before Umar's own
(`1/114-p6`, now on the islam-of-umar event), and Ibn Mas'ud herding sheep for
Uqbah ibn Abi Mu'ayt, ending with إنك غلام معلم and فأخذت من فيه سبعين سورة
(`1/115-p1`).

Ibn Ishaq's ordering of the first men, ثم أسلم زيد... فكان أول ذكر أسلم، وصلى
بعد علي (`1/111-p2`), is the same report `sira/first-man-to-believe` already
holds as DISPUTED, so it joins that claim as a second citation rather than
becoming a record of its own.

## حليف بني كذا

The roster names six men by their حلف: خباب حليف بني زهرة, عامر بن ربيعة حليف
آل الخطاب, واقد حليف بني عدي, بنو البكير حلفاء بني عدي, عمار حليف بني مخزوم,
صهيب النمري حليف بني تميم.

It is recorded as `tribalAffiliation`, a text column on the person, and
**deliberately not as a relationship**. Ibn Ishaq uses a حلف the way he uses a
nisba, to tell forty names apart in one list, which makes it a name -- the same
call [ADR 0014](../../../docs/adr/0014-a-kunya-is-a-name.md) made for a kunya.

A relationship would need something on the far end, and that something is a
tribe. Once tribes are nodes, every person in the app needs an edge to one,
because every one of them has a nasab; and `npm run graph:layout` computes
centrality over every edge regardless of type, so قريش and بنو هاشم would
outrank the people the graph exists to show. Four of the six have subjects and
carry the value; the other two do not, and the roster keeps them.

# حمزة, and what a module can miss

He had a module from the heading sweep and one field on it. The battles had
him: Badr, the سرية to سيف البحر, Uhud with a MARTYRED status and وحشي in the
summary. What nothing held was that he is the Prophet's uncle.

The book says it three times and never makes a section of it, which is how it
got past both sweeps: مع عمه حمزة at `1/49-p4`, بعث عمه حمزة at `1/297-p5`,
and عم رسول الله at `1/410-p6`. A heading check finds a section nobody mined; a
verse check finds a poem nobody recorded. Neither finds a fact the book states
in passing, in three different chapters, as something the reader already knows.

**PATERNAL_UNCLE** to the Prophet, and **MILK_BROTHER** besides. The same
sentence at `1/49-p4` says Thuwaybah, Abu Lahab's slave woman, nursed the
Prophet together with Hamzah and with Abu Salamah. رضاع is kinship in its own
right and the vocabulary had nothing for it, so `MILK_BROTHER`/`MILK_SISTER`
are new. They are each other's reciprocal, resolved by the far end's sex the
way FATHER and SON are, and they sit in the sibling colour. Thuwaybah herself
needs no subject: the tie is between the nurslings.

**أسد الله** is his by his own words rather than by the book's assignment:
كان يقاتل يوم أحد بين يدي رسول الله بسيفين ويقول: أنا أسد الله (`1/404-p7`).
The title already existed in the vocabulary.

**لكن حمزة لا بواكي له** (`1/410-p6`), which he said hearing Medina weep for
the Ansari dead, joins his virtues.

# Chapter six

The fourth year of the hijra, printed pages ١/٤٤٣ to ١/٤٦٦. The year's events
are mostly its losses — الرجيع, بئر معونة, the seventy القراء — and almost none
of the people they killed have subjects in the app. عاصم بن ثابت, حرام بن
ملحان, المنذر بن عمرو and عامر بن فهيرة are named, given nasab, and given the
words they died saying, and not one of them is a person this model holds. So
the chapter's claims are not where its weight is. They are where its weight
meets something the app can carry, which in this year is its marriages and its
deaths.

## Six claims that pay off the legacy marker

Retiring the seeds put 214 values on `legacyUnreviewed`, and a chapter that
says nothing about them only adds to the debt. This one says something about
six.

Zaynab bint Khuzaymah's obituary at `1/465-p6` is the single densest paragraph
in the chapter and it carries four of them: her nasab, أم المؤمنين, her
marriage to the Prophet, and the fuller reading of her name. The nasab the
seed carried ended at بن عبد الله الهلالية; the obituary runs it through عمرو
بن عبد مناف بن هلال بن عامر بن صعصعة and adds القيسية الهوازنية العامرية. The
carried value is replaced rather than merely cited, because the source's is the
longer of the two and the shorter was nobody's reading in particular.

Abu Salamah's mother, برة بنت عبد المطلب, is the fifth: the edge came off the
graph seed with its evidence owed, and `1/465-p7` names her in the same
sentence that gives his nasab. The Prophet's marriages to Umm Salamah and
Zaynab bint Jahsh are the sixth and seventh, both carried from the graph seed
in the hand-off and both cited here.

`companion` stays on the marker for every one of them. The chapter calls these
women أم المؤمنين and never صحابية, and letting one title stand in for the
other would be the seed's assignment wearing a citation it did not earn.

## Two deaths and a wound that reopened

Abu Salamah is the year's shape in one man. It opens with the سرية he led to
قطن in المحرم, a لواء and a hundred and fifty men, and it closes with him dead
of the Uhud wound that reopened when he got home. The expedition is a battle
row the old seed never had, so the catalog creates it, the way the sira's other
سرايا reach the app. It is a سرية by the book's own heading and because the
Prophet sent him rather than going, which is the distinction the vocabulary
draws.

His death takes two citations for one value. `1/466-p1` dates it to جمادى
الآخرة سنة أربع, and `1/444-p1`, on the expedition's own page, gives the day
within the month — لثلاث بقين. Neither states the year and the day together,
so the value is not supported by either alone.

Zaynab bint Khuzaymah's death is the other, and it is the first time this batch
records where someone is buried: البقيع, in the same sentence that has the
Prophet praying over her.

## The wives, and what the model would not hold

Umm Salamah married in شوال once her عدة had run, and Zaynab bint Jahsh بأيام
يسيرة after her. Both needed modules, and a module makes a subject
catalog-owned, so what their rows already held — `companion`,
`mother-of-believers`, the edge to each father — is carried on the marker
beside what the chapter cites.

Zaynab bint Jahsh brings the chapter's one Qur'an link, and the book gives it
outright rather than by inference: وهي التي نزلت هذه الآية فيها, الأحزاب ٣٧.
Her name was برة before the Prophet changed it. Nothing here holds a former
name on its own, so it stays inside `fullName` where the source puts it, and
آية الحجاب stays in the page: the model has no value for which verse a person
occasioned beyond the link itself.

عبيدة بن الحارث reaches the catalog sideways, through her obituary naming him
her second husband. That is the whole of what this chapter adds to him, and it
is enough to make him the eleventh of Badr's fourteen dead to have a module.
الطفيل, the first husband who divorced her, gets no edge: he has no subject,
and a relation needs something on the far end.

## One birth

وفيها في شعبان ولد الحسين بن علي. One line, one claim, and a module that exists
mostly to hold it — everything else al-Husayn's rows had is carried on the
marker. شعبان is the month; the year is the chapter's own heading, and the
model holds the year.

# Chapter seven

The fifth year of the hijra, printed pages ١/٤٦٧ to ١/٥٢٧. Nine claims, which
is fewer than the year deserves and as many as the model can hold: the year is
the Khandaq and Banu Qurayzah, and both already had modules carrying the seeds'
assertions with their evidence owed. Five of the nine take those off the
marker.

## The first battle this batch can count

Chapter seven is the first text here to describe the Khandaq rather than
mention it, and it gives both hosts as figures in one sentence: فكان جميع
الأحزاب عشرة آلاف ... وكان المسلمون في ثلاثة آلاف. Badr and Uhud have had
counts since the columns existed; the Khandaq is the third battle to get them,
and the first whose numbers came from a chapter written about it.

Quraysh's own four thousand and their three hundred horses are in the page and
not in the record. The column holds one figure for a side, the sentence above
gives it, and a claim for the sub-contingent would name no value this model
holds. `npm run history:validate` rejects such a claim outright, which is how
four of this chapter's drafts came to be dropped rather than kept.

## A month with nowhere to live

al-Waqidi dates the battle to ذو القعدة and Ibn Ishaq to شوال, and chapter six
already carried a third reading putting the whole thing in سنة أربع against Ibn
Ishaq's سنة خمس. Three readings, and the model holds a year.

So the year is cited and the months are not. Competing readings become DISPUTED
claims **where the model holds the value they compete over**, and a month is
not a value here. Both disagreements stay in the pages, which is where a reader
who cares about them will find them anyway.

## Saad ibn Muadh, who is two battles and one wound

The year wounds him at the first and kills him at the second, and the sequence
is why his death is not a standalone fact. حبان بن العرقة hit him in the أكحل
at the Khandaq, the Prophet pitched him a tent in the mosque to visit him
nearby, بنو قريظة came down to his judgement, and the vein reopened once he had
given it. Two participations carry it — INJURED at the one, MARTYRED at the
other — and `deathYearHijri` takes the ذو الحجة سنة خمس the book states
outright.

His `virtues` take what the book says after the death rather than the death
again: إن هذا الذي تحرك له العرش, and the seventy thousand angels at the
funeral. The value already held his Islam from chapter four, so it now carries
two claims and reads as one life.

## What the year has and the app has not

The chapter is full of people this model cannot hold. The الرجيع and بئر معونة
dead of chapter six were the same, and the pattern is worth naming: the sira's
years are mostly made of names, and a name without a subject is not a claim
waiting to be written. It is the source doing what the source does, and the
pages keep it.

# Chapter eight

The sixth year of the hijra, printed pages ٢/٥ to ٢/٦٠, and the first citations
this batch takes from volume two. Eight claims, and the year's two set pieces
are the whole of them.

## al-Hudaybiyyah, read at last

Its module was one of the eleven created when the seeds were retired: a battle
nobody had read, carrying a year, an engagement and a location that the seed
had asserted and nothing supported. Chapter eight reads it, and all three come
off the marker at once, along with the Prophet's own participation.

The date has more chains behind it than any other in this batch — نافع, قتادة,
الزهري, ابن إسحاق, عروة, all giving ذو القعدة سنة ست. علي بن مسهر's رمضان is
marked تفرد by the book itself and competes over a month, so it stays where it
is, like the Khandaq's two months in chapter seven.

The three companions on that module stay on the marker. The chapter has the
Prophet going and says nothing that puts any of them there by name, and a
roster is not something to infer from a treaty everyone remembers.

## Banu al-Mustaliq, and the first year worth disputing

Chapter seven had to throw away four drafted claims because the readings
competed over months. This chapter has the opposite case and it is worth
naming, because it is the first in this batch.

Ibn Ishaq dates the غزوة to شعبان سنة ست. Ibn Shihab, Urwah and Qatadah date it
to سنة خمس, al-Waqidi gives the day within that year, and al-Dhahabi closes the
passage وهو الصحيح. Two readings, and they compete over `hijriYear`, which the
model holds.

So the column takes five and Ibn Ishaq's six is recorded as a DISPUTED claim
beside it. Neither is dropped and neither is averaged. That is the difference a
column makes: the same kind of disagreement, one year apart in the same book,
is evidence when there is a value to attach it to and a page-note when there is
not.

The battle row itself is new — the old seed never had it, so the catalog
creates it, as it did for Abu Salamah's سرية in chapter six.

## What the year holds and the model does not

بيعة الرضوان is cited to الفتح ١٨, and the verse is about the believers who
pledged, collectively. `ayat` links a verse to a person, and there is no person
here to link it to. أم رومان dies in ذو الحجة and has no subject. سلمة بن
الأكوع carries غزوة ذي قرد almost single-handed and has none either.

# Chapter nine

The seventh year of the hijra, printed pages ٢/٦١ to ٢/١١٢. Eight claims, and
every one of them takes a value off the legacy marker rather than adding a new
one. The ledger moves 713 cited to 720 and 252 awaiting evidence to 248, which
is the first chapter in this batch to reduce the debt without adding to it.

## Khaybar, and a reading the book rejects

Its module was another of the eleven made when the seeds were retired. Chapter
nine reads it: the year, the engagement and the location all come off the
marker, along with the Prophet's own participation.

The year has a competing reading, and this one is worth keeping for a reason
the earlier ones were not. al-Zuhri puts the fighting in سنة ست, and al-Dhahabi
does not merely prefer another date — he marks the report شذ and says outright
وهذا لا يصح. Recording it as DISPUTED keeps the rejection visible. Dropping it
would hide both the reading and the fact that the book threw it out, and the
second is the more useful of the two.

The three companions on the module stay where they are, as they did at
al-Hudaybiyyah. The chapter has the Prophet taking the forts حصنا حصنا and
names neither Abu Bakr nor Umar nor Uthman among the men who did it.

## Two wives, and a dower the model cannot hold

صفية بنت حيي enters as a captive of Khaybar and leaves the chapter married, and
the book puts the whole of it in one sentence: فصارت صفية لدحية الكلبي، ثم صارت
لرسول الله، ثم تزوجها وجعل صداقها عتقها.

عتقها as her صداق is the detail that matters and the one the model has no field
for. There is no value here for what a dower was, so it stays in the page and
the marriage edge is what the catalog takes. Her module is new, so what her rows
already held — `companion`, `mother-of-believers` — is carried on the marker
beside it.

أم حبيبة is married at a distance: the Prophet writes to النجاشي to marry him
to her while she is still in Abyssinia, and عمرو بن أمية الضمري carries the
letter. Both marriages had been sitting on the graph seed's word since the
hand-off, and both are now cited.

## A chapter that only pays

Six chapters have added values and this one adds none. That is not a thin
chapter; it is what a batch looks like when the reading catches up with what
the seeds asserted. Every claim here points at something the app already
showed and had no reason to believe.

# Chapter ten

The eighth year of the hijra, printed pages ٢/١١٣ to ٢/١٩٢. Five claims, and
the point of them is one correction.

## مؤتة, and a value with evidence against it

When the seeds were retired, Mu'tah got a module built out of what the old rows
held, and the module was written down contradicting itself on purpose. The seed
named the battle غزوة مؤتة and recorded the Prophet as a participant, and the
vocabulary cannot hold both: a غزوة is one he went out for. The note in the
module said so and left both values standing, because nothing had been read
that could settle it.

Chapter ten settles it. بعث إلى مؤتة في جمادى من سنة ثمان، وأمر على الناس زيد
بن حارثة — he sent, and he named the man who went. So the engagement is a
سرية, the year is eight, Zayd's command is recorded, and the Prophet's
participation is **dropped**.

Dropped, and not moved to the legacy marker. That distinction is the whole of
what this chapter is for. The marker means a value is in use and its evidence
is owed; it does not mean a value is doubtful. A value the source contradicts
has evidence against it, which is a different state and the only one here that
warrants deleting a row. PostgreSQL lost it on the projection and Neo4j kept it
— the syncs never delete — so the edge was removed by hand, the way the stale
title in chapter six's session was.

جعفر and ابن رواحة, named in the same breath as the succession if Zayd fell,
are not recorded. The model holds who was at a battle, not the order in which
command would pass.

## حنين

سار إليهم رسول الله صلى الله عليه وسلم is the whole of what the engagement
needs: he went, so it is a غزوة and he is a participant, and both come off the
marker.

The year stays on it. The chapter places Hunayn after the فتح without dating
either, and taking a year from the sections around it would be inference
wearing a citation.

# Chapter eleven

The ninth year of the hijra, printed pages ٢/١٩٣ to ٢/٢٣٦. Three claims, all
of them Tabuk, and all three take values off the legacy marker.

## An absence that stopped being a guess

Ali's row is the one worth following, because it has been through every state
this pipeline has.

The seed put him at Tabuk. The catalog, when it took him over, carried an
`ABSENT_FROM` with `ABSENT_EXCUSED` on the marker, which was the seed's own
later correction and cited nothing. The graph then held both edges at once,
PARTICIPATED_IN beside ABSENT_FROM, because `battles:sync` only ever adds and
cannot retract an attendance that flipped; the stale one had to be deleted by
hand before the sync would run at all.

Chapter eleven says what happened: خلف رسول الله صلى الله عليه وسلم عليا في
غزوة تبوك, and Ali asks أتخلفني في النساء والصبيان. He was left behind, and
left in charge. That is an absence the source remarks on rather than a gap in
a roster, which is the distinction ADR 0013 exists for, and it is now cited
instead of asserted.

## What stayed on the marker

The year. The chapter is headed السنة التاسعة and the battle sits inside it,
but the section never dates the march. A heading two pages up is not what the
value cites, and the difference between reading a date and inferring one from
where a section falls is the difference this batch is built on.

# Chapter twelve

The tenth year of the hijra, printed pages ٢/٢٣٧ to ٢/٢٨٩. Three claims, and
for the first time since chapter six the chapter makes a subject rather than
citing one.

## حجة الوداع

The old seed never had it. Fourteen battles and forty-five events came through
the hand-off and the pilgrimage that closes the sira was not among them, so the
catalog creates the row, the way it does for a سرية the seeds never held.

The year is cited here, which is worth setting beside chapter eleven, where it
was not. Tabuk sits inside a section headed السنة التاسعة and the section never
dates the march; the year stayed owed. The pilgrimage sits inside السنة
العاشرة **and** the section dates the departure within it — لخمس بقين من ذي
القعدة. A month inside a stated year is a date the section gives. A heading two
pages up standing in for a date the section never gives is not.

## Asma bint Umays, who is here because the chapter puts her here

She bore محمد بن أبي بكر at ذو الحليفة on the way out, and sent to ask the
Prophet what to do; he told her to wash and bind herself with a cloth. Her son
has no subject in the app, so the birth is not a second event. It is what she
did at this one, and the link records that she was there.

This is the shape the whole batch has taken. A chapter gives dozens of names
and the model holds the few it already knows; the rest stay in the pages, which
is where they were always going to be.

# Review

Nothing in this batch is reviewed, across any of its chapters. The claims are
authored but nobody has compared them against the stored pages, so every one of
the 390 is Not reviewed. The batch's approval permits publication and says
nothing about review.
