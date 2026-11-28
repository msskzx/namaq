# مدونتي

`mobile/src/app/(tabs)/(home)/library.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["مدونتي"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  me -.-> sheet0{{"CompareTargetsSheet"}}
  me -.-> sheet1{{"DoubtedSheet"}}
  me -.-> sheet2{{"LifeSheet"}}
  me -.-> sheet3{{"NoteSheet"}}
  me -.-> sheet4{{"TieSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `DarkSeaActions` | افتح مشهد ‹› | [المشهد](scene.md) | [components/DarkSea.tsx:256](../../mobile/src/components/DarkSea.tsx#L256) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [components/DarkSea.tsx:257](../../mobile/src/components/DarkSea.tsx#L257) |
| `EventPlaces` | افتح ‹› في المصحف | [المصحف](read.md) | [components/EventPlaces.tsx:101](../../mobile/src/components/EventPlaces.tsx#L101) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:117](../../mobile/src/components/EventPlaces.tsx#L117) |
| `CompareButton` | قارن ‹› | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:129](../../mobile/src/components/EventPlaces.tsx#L129) |
| `useHomeCards` | (onPress) | [المصحف](read.md) | [components/HomeCards.tsx:95](../../mobile/src/components/HomeCards.tsx#L95) |
|  | (onPress) | [متشابهات القرآن](branches.md) | [components/HomeCards.tsx:95](../../mobile/src/components/HomeCards.tsx#L95) |
|  | (onPress) | [مقارنة السور](compare.md) | [components/HomeCards.tsx:95](../../mobile/src/components/HomeCards.tsx#L95) |
|  | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeCards.tsx:117](../../mobile/src/components/HomeCards.tsx#L117) |
|  | افتح المقارنة | [متشابهات القرآن](branches.md) | [components/HomeCards.tsx:120](../../mobile/src/components/HomeCards.tsx#L120) |
|  | افتح المقارنة | [مقارنة السور](compare.md) | [components/HomeCards.tsx:120](../../mobile/src/components/HomeCards.tsx#L120) |
|  | افتح المقارنة | [المصحف](read.md) | [components/HomeCards.tsx:120](../../mobile/src/components/HomeCards.tsx#L120) |
|  | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeCards.tsx:124](../../mobile/src/components/HomeCards.tsx#L124) |
|  | (onPick) | [المصحف](read.md) | [components/HomeCards.tsx:127](../../mobile/src/components/HomeCards.tsx#L127) |
|  | (onPick) | [متشابهات القرآن](branches.md) | [components/HomeCards.tsx:127](../../mobile/src/components/HomeCards.tsx#L127) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/HomeCards.tsx:127](../../mobile/src/components/HomeCards.tsx#L127) |
| `ForgottenPost` | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:415](../../mobile/src/components/HomeFeed.tsx#L415) |
|  | افتح ما نسيته | [مدونتي](library.md) | [components/HomeFeed.tsx:417](../../mobile/src/components/HomeFeed.tsx#L417) |
|  | (head) | [الاختبارات](quizzes.md) | [components/HomeFeed.tsx:417](../../mobile/src/components/HomeFeed.tsx#L417) |
| `TarajimPost` | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:617](../../mobile/src/components/HomeFeed.tsx#L617) |
|  | من التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:619](../../mobile/src/components/HomeFeed.tsx#L619) |
| `TiePost` | (open) | [بين عدة أشخاص](between.md) | [components/HomeFeed.tsx:641](../../mobile/src/components/HomeFeed.tsx#L641) |
|  | صلة | [التراجم](tarajim.md) | [components/HomeFeed.tsx:643](../../mobile/src/components/HomeFeed.tsx#L643) |
| `NamePost` | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:667](../../mobile/src/components/HomeFeed.tsx#L667) |
|  | كنية وصاحبها | [التراجم](tarajim.md) | [components/HomeFeed.tsx:670](../../mobile/src/components/HomeFeed.tsx#L670) |
| `LifePost` | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:691](../../mobile/src/components/HomeFeed.tsx#L691) |
|  | من حياته | [الترجمة](person.md) | [components/HomeFeed.tsx:693](../../mobile/src/components/HomeFeed.tsx#L693) |
| `NasabPost` | (open) | [النسب](nasab.md) | [components/HomeFeed.tsx:713](../../mobile/src/components/HomeFeed.tsx#L713) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:715](../../mobile/src/components/HomeFeed.tsx#L715) |
| `TiesPost` | (open) | [الصلات](ties.md) | [components/HomeFeed.tsx:730](../../mobile/src/components/HomeFeed.tsx#L730) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:732](../../mobile/src/components/HomeFeed.tsx#L732) |
|  | (onPick) | [الترجمة](person.md) | [components/HomeFeed.tsx:736](../../mobile/src/components/HomeFeed.tsx#L736) |
| `GroupPost` | (open) | [بين عدة أشخاص](between.md) | [components/HomeFeed.tsx:760](../../mobile/src/components/HomeFeed.tsx#L760) |
|  | (open) | [التراجم](tarajim.md) | [components/HomeFeed.tsx:762](../../mobile/src/components/HomeFeed.tsx#L762) |
| `LivesPost` | (open) | [حياتهم جنبًا إلى جنب](life.md) | [components/HomeFeed.tsx:781](../../mobile/src/components/HomeFeed.tsx#L781) |
|  | حياتهما | [التراجم](tarajim.md) | [components/HomeFeed.tsx:783](../../mobile/src/components/HomeFeed.tsx#L783) |
| `MeetPost` | (open) | [النسب](nasab.md) | [components/HomeFeed.tsx:803](../../mobile/src/components/HomeFeed.tsx#L803) |
|  | أين يلتقي نسبهما؟ | [التراجم](tarajim.md) | [components/HomeFeed.tsx:806](../../mobile/src/components/HomeFeed.tsx#L806) |
| `RingPost` | (go) | [الترجمة](person.md) | [components/HomeFeed.tsx:832](../../mobile/src/components/HomeFeed.tsx#L832) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:848](../../mobile/src/components/HomeFeed.tsx#L848) |
|  | (open) | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:849](../../mobile/src/components/HomeFeed.tsx#L849) |
|  | (open) | [التراجم](tarajim.md) | [components/HomeFeed.tsx:849](../../mobile/src/components/HomeFeed.tsx#L849) |
|  | (open) | [الصلات](ties.md) | [components/HomeFeed.tsx:850](../../mobile/src/components/HomeFeed.tsx#L850) |
|  | (open) | [كل التراجم](people.md) | [components/HomeFeed.tsx:851](../../mobile/src/components/HomeFeed.tsx#L851) |
|  | (open) | [حديث الصحيح](hadith-sahih.md) | [components/HomeFeed.tsx:852](../../mobile/src/components/HomeFeed.tsx#L852) |
| `BattlePost` | (open) | [الغزوة](battle.md) | [components/HomeFeed.tsx:880](../../mobile/src/components/HomeFeed.tsx#L880) |
|  | (open) | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:882](../../mobile/src/components/HomeFeed.tsx#L882) |
| `BattleYearPost` | (toYear) | [الأطلس](atlas.md) | [components/HomeFeed.tsx:905](../../mobile/src/components/HomeFeed.tsx#L905) |
|  | من الأطلس | [الأطلس](atlas.md) | [components/HomeFeed.tsx:910](../../mobile/src/components/HomeFeed.tsx#L910) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:920](../../mobile/src/components/HomeFeed.tsx#L920) |
| `ArmiesPost` | الجيشان في الغزوات | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:943](../../mobile/src/components/HomeFeed.tsx#L943) |
|  | افتح الغزوات والمعارك | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:944](../../mobile/src/components/HomeFeed.tsx#L944) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:953](../../mobile/src/components/HomeFeed.tsx#L953) |
| `HadithScenePost` | (open) | [رواية الصحيح](hadith-unit.md) | [components/HomeFeed.tsx:970](../../mobile/src/components/HomeFeed.tsx#L970) |
|  | من ‹› | [الحديث](hadith.md) | [components/HomeFeed.tsx:972](../../mobile/src/components/HomeFeed.tsx#L972) |
| `OpeningCardPost` | (open) | [فواتح السور](openings.md) | [components/HomeFeed.tsx:993](../../mobile/src/components/HomeFeed.tsx#L993) |
|  | من فواتح السور | [فواتح السور](openings.md) | [components/HomeFeed.tsx:995](../../mobile/src/components/HomeFeed.tsx#L995) |
| `OathPost` | (open) | [الأقسام](oaths.md) | [components/HomeFeed.tsx:1011](../../mobile/src/components/HomeFeed.tsx#L1011) |
|  | من الأقسام | [الأقسام](oaths.md) | [components/HomeFeed.tsx:1013](../../mobile/src/components/HomeFeed.tsx#L1013) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [components/HomeFeed.tsx:1015](../../mobile/src/components/HomeFeed.tsx#L1015) |
| `SurahAimPost` | مقصود السورة | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1034](../../mobile/src/components/HomeFeed.tsx#L1034) |
|  | افتح سورة ‹› في ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1035](../../mobile/src/components/HomeFeed.tsx#L1035) |
| `SurahLinkPost` | بين سورتين | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1051](../../mobile/src/components/HomeFeed.tsx#L1051) |
|  | افتح ‹› و‹› في ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1052](../../mobile/src/components/HomeFeed.tsx#L1052) |
| `EventPost` | (open) | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:1072](../../mobile/src/components/HomeFeed.tsx#L1072) |
|  | (open) | [قصص الأنبياء](prophets.md) | [components/HomeFeed.tsx:1074](../../mobile/src/components/HomeFeed.tsx#L1074) |
| `StoryPost` | (open) | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:1180](../../mobile/src/components/HomeFeed.tsx#L1180) |
|  | (open) | [قصص الأنبياء](prophets.md) | [components/HomeFeed.tsx:1182](../../mobile/src/components/HomeFeed.tsx#L1182) |
| `ScenePost` | افتح المشاهد | [مشاهد](lataif.md) | [components/HomeFeed.tsx:1332](../../mobile/src/components/HomeFeed.tsx#L1332) |
|  | (onPress) | [المشهد](scene.md) | [components/HomeFeed.tsx:1335](../../mobile/src/components/HomeFeed.tsx#L1335) |
|  | افتح المشاهد | [مشاهد](lataif.md) | [components/HomeFeed.tsx:1340](../../mobile/src/components/HomeFeed.tsx#L1340) |
|  | (onPress) | [المشهد](scene.md) | [components/HomeFeed.tsx:1343](../../mobile/src/components/HomeFeed.tsx#L1343) |
| `SiraPost` | (open) | [القصة](story.md) | [components/HomeFeed.tsx:1358](../../mobile/src/components/HomeFeed.tsx#L1358) |
|  | من قصص السيرة | [قصص السيرة](stories.md) | [components/HomeFeed.tsx:1360](../../mobile/src/components/HomeFeed.tsx#L1360) |
| `RajabPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1391](../../mobile/src/components/HomeFeed.tsx#L1391) |
|  | من شرح ابن رجب | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1393](../../mobile/src/components/HomeFeed.tsx#L1393) |
| `HadithPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1407](../../mobile/src/components/HomeFeed.tsx#L1407) |
|  | من الحديث | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1409](../../mobile/src/components/HomeFeed.tsx#L1409) |
| `SahihPost` | (open) | [حديث الصحيح](hadith-sahih.md) | [components/HomeFeed.tsx:1433](../../mobile/src/components/HomeFeed.tsx#L1433) |
|  | من ‹› | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1436](../../mobile/src/components/HomeFeed.tsx#L1436) |
| `RecordedPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1453](../../mobile/src/components/HomeFeed.tsx#L1453) |
|  | من أخرجه | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1455](../../mobile/src/components/HomeFeed.tsx#L1455) |
| `IsnadPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1477](../../mobile/src/components/HomeFeed.tsx#L1477) |
|  | من الإسناد | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1479](../../mobile/src/components/HomeFeed.tsx#L1479) |
| `TermPost` | (open) | [المصطلح](term.md) | [components/HomeFeed.tsx:1504](../../mobile/src/components/HomeFeed.tsx#L1504) |
|  | من مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1506](../../mobile/src/components/HomeFeed.tsx#L1506) |
|  | مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1508](../../mobile/src/components/HomeFeed.tsx#L1508) |
| `GharibPost` | (open) | [الكلمة](word.md) | [components/HomeFeed.tsx:1546](../../mobile/src/components/HomeFeed.tsx#L1546) |
|  | (open) | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1546](../../mobile/src/components/HomeFeed.tsx#L1546) |
|  | من غريب القرآن | [ألفاظ القرآن](words.md) | [components/HomeFeed.tsx:1548](../../mobile/src/components/HomeFeed.tsx#L1548) |
| `TuhfaPost` | من تحفة الأطفال | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1569](../../mobile/src/components/HomeFeed.tsx#L1569) |
|  | افتح المنظومة | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1570](../../mobile/src/components/HomeFeed.tsx#L1570) |
| `MomentPost` | (open) | [الغزوة](battle.md) | [components/HomeFeed.tsx:1591](../../mobile/src/components/HomeFeed.tsx#L1591) |
|  | من ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:1593](../../mobile/src/components/HomeFeed.tsx#L1593) |
| `NOTE_TOPICS` | (tafsir) | [الكتاب](book.md) | [components/HomeFeed.tsx:1635](../../mobile/src/components/HomeFeed.tsx#L1635) |
|  | (balagha) | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1636](../../mobile/src/components/HomeFeed.tsx#L1636) |
|  | (irab) | [المكتبة](books.md) | [components/HomeFeed.tsx:1637](../../mobile/src/components/HomeFeed.tsx#L1637) |
|  | (qiraat) | [القراءات](qiraat.md) | [components/HomeFeed.tsx:1638](../../mobile/src/components/HomeFeed.tsx#L1638) |
| `AyahNotePost` | (show) | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1660](../../mobile/src/components/HomeFeed.tsx#L1660) |
| `DhikrPost` | افتح الأذكار | [الأدوات والأذكار](utilities.md) | [components/HomeFeed.tsx:1707](../../mobile/src/components/HomeFeed.tsx#L1707) |
|  | افتح الذكر في الأذكار | [الذكر](dhikr.md) | [components/HomeFeed.tsx:1708](../../mobile/src/components/HomeFeed.tsx#L1708) |
| `Cell` | (onPress) | [الغزوة](battle.md) | [components/LifeColumns.tsx:18](../../mobile/src/components/LifeColumns.tsx#L18) |
|  | (onPress) | [القصة](story.md) | [components/LifeColumns.tsx:18](../../mobile/src/components/LifeColumns.tsx#L18) |
| `Item` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
| `RahmanActions` | افتح مشهد ‹› | [المشهد](scene.md) | [components/RahmanScene.tsx:208](../../mobile/src/components/RahmanScene.tsx#L208) |
| `TiesChain` | (open) | [الصلات](ties.md) | [components/TiesChain.tsx:164](../../mobile/src/components/TiesChain.tsx#L164) |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:130](../../mobile/src/components/battles/BattleParts.tsx#L130) |
| `Hadith` | افتح الحديث كاملًا: ‹› | [حديث الصحيح](hadith-sahih.md) | [components/scenes/RahmanPage.tsx:143](../../mobile/src/components/scenes/RahmanPage.tsx#L143) |
| `LibraryScreen` | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [المصحف](read.md) | [screens/library.tsx:95](../../mobile/src/screens/library.tsx#L95) |
|  | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [متشابهات القرآن](branches.md) | [screens/library.tsx:95](../../mobile/src/screens/library.tsx#L95) |
|  | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [مقارنة السور](compare.md) | [screens/library.tsx:95](../../mobile/src/screens/library.tsx#L95) |
|  | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [صفحة الآية](ayah.md) | [screens/library.tsx:95](../../mobile/src/screens/library.tsx#L95) |
|  | افتح الآية في المصحف | [المصحف](read.md) | [screens/library.tsx:138](../../mobile/src/screens/library.tsx#L138) |
|  | (back) | [الرئيسية](home.md) | [screens/library.tsx:151](../../mobile/src/screens/library.tsx#L151) |
| `Box` | (onPress) | [الترجمة](person.md) | [screens/nasab.tsx:33](../../mobile/src/screens/nasab.tsx#L33) |
| `OpeningRows` | افتح ‹› في المصحف | [المصحف](read.md) | [screens/openings.tsx:74](../../mobile/src/screens/openings.tsx#L74) |

## Sheets

- `CompareTargetsSheet`
- `DoubtedSheet`
- `LifeSheet`
- `NoteSheet`
- `TieSheet`
