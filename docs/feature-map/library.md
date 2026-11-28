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
| `DarkSeaActions` | افتح مشهد ‹› | [المشهد](scene.md) | [components/DarkSea.tsx:229](../../mobile/src/components/DarkSea.tsx#L229) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [components/DarkSea.tsx:230](../../mobile/src/components/DarkSea.tsx#L230) |
| `EventPlaces` | ‹›:‹› | [المصحف](read.md) | [components/EventPlaces.tsx:92](../../mobile/src/components/EventPlaces.tsx#L92) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:106](../../mobile/src/components/EventPlaces.tsx#L106) |
| `CompareButton` | قارن ‹› | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:116](../../mobile/src/components/EventPlaces.tsx#L116) |
| `useHomeCards` | (onPress) | [المصحف](read.md) | [components/HomeCards.tsx:81](../../mobile/src/components/HomeCards.tsx#L81) |
|  | (onPress) | [متشابهات القرآن](branches.md) | [components/HomeCards.tsx:81](../../mobile/src/components/HomeCards.tsx#L81) |
|  | (onPress) | [مقارنة السور](compare.md) | [components/HomeCards.tsx:81](../../mobile/src/components/HomeCards.tsx#L81) |
|  | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeCards.tsx:100](../../mobile/src/components/HomeCards.tsx#L100) |
|  | افتح المقارنة | [متشابهات القرآن](branches.md) | [components/HomeCards.tsx:103](../../mobile/src/components/HomeCards.tsx#L103) |
|  | افتح المقارنة | [مقارنة السور](compare.md) | [components/HomeCards.tsx:103](../../mobile/src/components/HomeCards.tsx#L103) |
|  | افتح المقارنة | [المصحف](read.md) | [components/HomeCards.tsx:103](../../mobile/src/components/HomeCards.tsx#L103) |
|  | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeCards.tsx:107](../../mobile/src/components/HomeCards.tsx#L107) |
|  | (onPick) | [المصحف](read.md) | [components/HomeCards.tsx:110](../../mobile/src/components/HomeCards.tsx#L110) |
|  | (onPick) | [متشابهات القرآن](branches.md) | [components/HomeCards.tsx:110](../../mobile/src/components/HomeCards.tsx#L110) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/HomeCards.tsx:110](../../mobile/src/components/HomeCards.tsx#L110) |
| `ForgottenPost` | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:334](../../mobile/src/components/HomeFeed.tsx#L334) |
|  | افتح ما نسيته | [مدونتي](library.md) | [components/HomeFeed.tsx:335](../../mobile/src/components/HomeFeed.tsx#L335) |
|  | افتح الاختبارات | [الاختبارات](quizzes.md) | [components/HomeFeed.tsx:335](../../mobile/src/components/HomeFeed.tsx#L335) |
| `TarajimPost` | افتح ترجمة ‹› | [الترجمة](person.md) | [components/HomeFeed.tsx:493](../../mobile/src/components/HomeFeed.tsx#L493) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:495](../../mobile/src/components/HomeFeed.tsx#L495) |
| `TiePost` | ارسم الصلة بين ‹› و‹› | [بين عدة أشخاص](between.md) | [components/HomeFeed.tsx:512](../../mobile/src/components/HomeFeed.tsx#L512) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:514](../../mobile/src/components/HomeFeed.tsx#L514) |
| `NamePost` | افتح ترجمة ‹› | [الترجمة](person.md) | [components/HomeFeed.tsx:532](../../mobile/src/components/HomeFeed.tsx#L532) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:535](../../mobile/src/components/HomeFeed.tsx#L535) |
| `LifePost` | افتح ترجمة ‹› | [الترجمة](person.md) | [components/HomeFeed.tsx:552](../../mobile/src/components/HomeFeed.tsx#L552) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:554](../../mobile/src/components/HomeFeed.tsx#L554) |
| `NasabPost` | افتح نسب ‹› | [النسب](nasab.md) | [components/HomeFeed.tsx:569](../../mobile/src/components/HomeFeed.tsx#L569) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:571](../../mobile/src/components/HomeFeed.tsx#L571) |
| `TiesPost` | افتح ‹›: ‹› | [الصلات](ties.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:587](../../mobile/src/components/HomeFeed.tsx#L587) |
|  | (onPick) | [الترجمة](person.md) | [components/HomeFeed.tsx:591](../../mobile/src/components/HomeFeed.tsx#L591) |
| `GroupPost` | ارسم الصلة بينهم | [بين عدة أشخاص](between.md) | [components/HomeFeed.tsx:610](../../mobile/src/components/HomeFeed.tsx#L610) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:612](../../mobile/src/components/HomeFeed.tsx#L612) |
| `LivesPost` | قارن حياة ‹› و‹› | [حياتهم جنبًا إلى جنب](life.md) | [components/HomeFeed.tsx:630](../../mobile/src/components/HomeFeed.tsx#L630) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:632](../../mobile/src/components/HomeFeed.tsx#L632) |
| `MeetPost` | افتح النسب | [النسب](nasab.md) | [components/HomeFeed.tsx:648](../../mobile/src/components/HomeFeed.tsx#L648) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:651](../../mobile/src/components/HomeFeed.tsx#L651) |
| `RingPost` | (go) | [الترجمة](person.md) | [components/HomeFeed.tsx:672](../../mobile/src/components/HomeFeed.tsx#L672) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:686](../../mobile/src/components/HomeFeed.tsx#L686) |
|  | افتح ‹› | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:687](../../mobile/src/components/HomeFeed.tsx#L687) |
|  | افتح التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:687](../../mobile/src/components/HomeFeed.tsx#L687) |
|  | (open) | [الصلات](ties.md) | [components/HomeFeed.tsx:688](../../mobile/src/components/HomeFeed.tsx#L688) |
|  | (open) | [كل التراجم](people.md) | [components/HomeFeed.tsx:689](../../mobile/src/components/HomeFeed.tsx#L689) |
|  | (open) | [حديث الصحيح](hadith-sahih.md) | [components/HomeFeed.tsx:690](../../mobile/src/components/HomeFeed.tsx#L690) |
| `BattlePost` | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:713](../../mobile/src/components/HomeFeed.tsx#L713) |
|  | افتح الغزوات والمعارك | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:715](../../mobile/src/components/HomeFeed.tsx#L715) |
| `BattleYearPost` | (toYear) | [الأطلس](atlas.md) | [components/HomeFeed.tsx:732](../../mobile/src/components/HomeFeed.tsx#L732) |
|  | افتح الأطلس | [الأطلس](atlas.md) | [components/HomeFeed.tsx:736](../../mobile/src/components/HomeFeed.tsx#L736) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:746](../../mobile/src/components/HomeFeed.tsx#L746) |
| `ArmiesPost` | افتح الغزوات والمعارك | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:765](../../mobile/src/components/HomeFeed.tsx#L765) |
|  | افتح الغزوات والمعارك | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:766](../../mobile/src/components/HomeFeed.tsx#L766) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:775](../../mobile/src/components/HomeFeed.tsx#L775) |
| `HadithScenePost` | افتح الحديث في ‹› | [رواية الصحيح](hadith-unit.md) | [components/HomeFeed.tsx:791](../../mobile/src/components/HomeFeed.tsx#L791) |
|  | افتح الحديث | [الحديث](hadith.md) | [components/HomeFeed.tsx:793](../../mobile/src/components/HomeFeed.tsx#L793) |
| `OpeningCardPost` | افتح «‹›» في فواتح السور | [فواتح السور](openings.md) | [components/HomeFeed.tsx:811](../../mobile/src/components/HomeFeed.tsx#L811) |
|  | افتح فواتح السور | [فواتح السور](openings.md) | [components/HomeFeed.tsx:813](../../mobile/src/components/HomeFeed.tsx#L813) |
| `OathPost` | افتح ‹› في الأقسام | [الأقسام](oaths.md) | [components/HomeFeed.tsx:828](../../mobile/src/components/HomeFeed.tsx#L828) |
|  | افتح الأقسام | [الأقسام](oaths.md) | [components/HomeFeed.tsx:830](../../mobile/src/components/HomeFeed.tsx#L830) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [components/HomeFeed.tsx:832](../../mobile/src/components/HomeFeed.tsx#L832) |
| `SurahAimPost` | افتح ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:846](../../mobile/src/components/HomeFeed.tsx#L846) |
|  | افتح سورة ‹› في ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:847](../../mobile/src/components/HomeFeed.tsx#L847) |
| `SurahLinkPost` | افتح ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:859](../../mobile/src/components/HomeFeed.tsx#L859) |
|  | افتح ‹› و‹› في ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:860](../../mobile/src/components/HomeFeed.tsx#L860) |
| `EventPost` | افتح ‹› في القصة | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:876](../../mobile/src/components/HomeFeed.tsx#L876) |
|  | افتح قصص الأنبياء | [قصص الأنبياء](prophets.md) | [components/HomeFeed.tsx:878](../../mobile/src/components/HomeFeed.tsx#L878) |
| `StoryPost` | (open) | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:958](../../mobile/src/components/HomeFeed.tsx#L958) |
|  | افتح قصص الأنبياء | [قصص الأنبياء](prophets.md) | [components/HomeFeed.tsx:960](../../mobile/src/components/HomeFeed.tsx#L960) |
| `ScenePost` | افتح المشاهد | [مشاهد](lataif.md) | [components/HomeFeed.tsx:1082](../../mobile/src/components/HomeFeed.tsx#L1082) |
|  | (onPress) | [المشهد](scene.md) | [components/HomeFeed.tsx:1084](../../mobile/src/components/HomeFeed.tsx#L1084) |
|  | افتح المشاهد | [مشاهد](lataif.md) | [components/HomeFeed.tsx:1089](../../mobile/src/components/HomeFeed.tsx#L1089) |
|  | (onPress) | [المشهد](scene.md) | [components/HomeFeed.tsx:1092](../../mobile/src/components/HomeFeed.tsx#L1092) |
| `SiraPost` | افتح ‹› | [القصة](story.md) | [components/HomeFeed.tsx:1102](../../mobile/src/components/HomeFeed.tsx#L1102) |
|  | افتح قصص السيرة | [قصص السيرة](stories.md) | [components/HomeFeed.tsx:1104](../../mobile/src/components/HomeFeed.tsx#L1104) |
| `RajabPost` | افتح ‹› | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1127](../../mobile/src/components/HomeFeed.tsx#L1127) |
|  | (open) | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1129](../../mobile/src/components/HomeFeed.tsx#L1129) |
| `HadithPost` | افتح ‹› | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1142](../../mobile/src/components/HomeFeed.tsx#L1142) |
|  | (open) | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1144](../../mobile/src/components/HomeFeed.tsx#L1144) |
| `SahihPost` | افتح ‹› ‹› | [حديث الصحيح](hadith-sahih.md) | [components/HomeFeed.tsx:1162](../../mobile/src/components/HomeFeed.tsx#L1162) |
|  | افتح ‹› | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1165](../../mobile/src/components/HomeFeed.tsx#L1165) |
| `RecordedPost` | افتح ‹› | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1178](../../mobile/src/components/HomeFeed.tsx#L1178) |
|  | (open) | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1180](../../mobile/src/components/HomeFeed.tsx#L1180) |
| `IsnadPost` | افتح ‹› | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1197](../../mobile/src/components/HomeFeed.tsx#L1197) |
|  | (open) | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1199](../../mobile/src/components/HomeFeed.tsx#L1199) |
| `TermPost` | ‹›: تعريفه وأمثلته | [المصطلح](term.md) | [components/HomeFeed.tsx:1219](../../mobile/src/components/HomeFeed.tsx#L1219) |
|  | افتح مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1221](../../mobile/src/components/HomeFeed.tsx#L1221) |
|  | مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1223](../../mobile/src/components/HomeFeed.tsx#L1223) |
| `GharibPost` | افتح صفحة الآية | [الكلمة](word.md) | [components/HomeFeed.tsx:1255](../../mobile/src/components/HomeFeed.tsx#L1255) |
|  | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1255](../../mobile/src/components/HomeFeed.tsx#L1255) |
|  | افتح ألفاظ القرآن | [ألفاظ القرآن](words.md) | [components/HomeFeed.tsx:1257](../../mobile/src/components/HomeFeed.tsx#L1257) |
| `TuhfaPost` | افتح تحفة الأطفال | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1274](../../mobile/src/components/HomeFeed.tsx#L1274) |
|  | افتح المنظومة | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1275](../../mobile/src/components/HomeFeed.tsx#L1275) |
| `MomentPost` | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:1294](../../mobile/src/components/HomeFeed.tsx#L1294) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:1296](../../mobile/src/components/HomeFeed.tsx#L1296) |
| `NOTE_TOPICS` | افتح تفسير السعدي | [الكتاب](book.md) | [components/HomeFeed.tsx:1331](../../mobile/src/components/HomeFeed.tsx#L1331) |
|  | افتح مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1332](../../mobile/src/components/HomeFeed.tsx#L1332) |
|  | افتح المكتبة | [المكتبة](books.md) | [components/HomeFeed.tsx:1333](../../mobile/src/components/HomeFeed.tsx#L1333) |
|  | افتح القراءات | [القراءات](qiraat.md) | [components/HomeFeed.tsx:1334](../../mobile/src/components/HomeFeed.tsx#L1334) |
| `AyahNotePost` | افتح صفحة الآية، ‹› | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1347](../../mobile/src/components/HomeFeed.tsx#L1347) |
| `DhikrPost` | افتح الأذكار | [الأدوات والأذكار](utilities.md) | [components/HomeFeed.tsx:1387](../../mobile/src/components/HomeFeed.tsx#L1387) |
|  | افتح الذكر في الأذكار | [الذكر](dhikr.md) | [components/HomeFeed.tsx:1388](../../mobile/src/components/HomeFeed.tsx#L1388) |
| `Cell` | (onPress) | [الغزوة](battle.md) | [components/LifeColumns.tsx:17](../../mobile/src/components/LifeColumns.tsx#L17) |
|  | (onPress) | [القصة](story.md) | [components/LifeColumns.tsx:17](../../mobile/src/components/LifeColumns.tsx#L17) |
| `Item` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:106](../../mobile/src/components/LifeTimeline.tsx#L106) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:106](../../mobile/src/components/LifeTimeline.tsx#L106) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:145](../../mobile/src/components/LifeTimeline.tsx#L145) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:145](../../mobile/src/components/LifeTimeline.tsx#L145) |
| `RahmanActions` | افتح مشهد ‹› | [المشهد](scene.md) | [components/RahmanScene.tsx:182](../../mobile/src/components/RahmanScene.tsx#L182) |
| `SahihSaying` | افتح ‹› | [حديث الصحيح](hadith-sahih.md) | [components/SahihSaying.tsx:43](../../mobile/src/components/SahihSaying.tsx#L43) |
| `TiesChain` | (open) | [الصلات](ties.md) | [components/TiesChain.tsx:135](../../mobile/src/components/TiesChain.tsx#L135) |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:113](../../mobile/src/components/battles/BattleParts.tsx#L113) |
| `Hadith` | افتح الحديث كاملًا: ‹› | [حديث الصحيح](hadith-sahih.md) | [components/scenes/RahmanPage.tsx:119](../../mobile/src/components/scenes/RahmanPage.tsx#L119) |
| `LibraryScreen` | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [المصحف](read.md) | [screens/library.tsx:77](../../mobile/src/screens/library.tsx#L77) |
|  | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [متشابهات القرآن](branches.md) | [screens/library.tsx:77](../../mobile/src/screens/library.tsx#L77) |
|  | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [مقارنة السور](compare.md) | [screens/library.tsx:77](../../mobile/src/screens/library.tsx#L77) |
|  | ({ cards, noteCards, savedItems, noteItems, openOf, openAyah, menus }) | [صفحة الآية](ayah.md) | [screens/library.tsx:77](../../mobile/src/screens/library.tsx#L77) |
|  | افتح الآية في المصحف | [المصحف](read.md) | [screens/library.tsx:120](../../mobile/src/screens/library.tsx#L120) |
|  | (back) | [الرئيسية](home.md) | [screens/library.tsx:132](../../mobile/src/screens/library.tsx#L132) |
| `Box` | (onPress) | [الترجمة](person.md) | [screens/nasab.tsx:31](../../mobile/src/screens/nasab.tsx#L31) |
| `OpeningRows` | ‹›:1 | [المصحف](read.md) | [screens/openings.tsx:70](../../mobile/src/screens/openings.tsx#L70) |

## Sheets

- `CompareTargetsSheet`
- `DoubtedSheet`
- `LifeSheet`
- `NoteSheet`
- `TieSheet`
