# الرئيسية

`mobile/src/app/(tabs)/(home)/index.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الرئيسية"]
  style me stroke-width:3px
  in0(["صفحة الآية"]) --> me
  in1(["المكتبة"]) --> me
  in2(["عن نمق"]) --> me
  in3(["المصادر والتراخيص"]) --> me
  in4(["سياسة الخصوصية"]) --> me
  in5(["مدونتي"]) --> me
  me -.-> sheet0{{"CompareTargetsSheet"}}
  me -.-> sheet1{{"DoubtedSheet"}}
  me -.-> sheet2{{"InterestsSheet"}}
  me -.-> sheet3{{"LifeSheet"}}
  me -.-> sheet4{{"MoreMenu"}}
  me -.-> sheet5{{"NotMineMenu"}}
  me -.-> sheet6{{"SurahSheet"}}
  me -.-> sheet7{{"TieSheet"}}
  me -.-> sheet8{{"VideoSheet"}}
```

## Ways in

- The tab bar's «الرئيسية».
- [صفحة الآية](ayah.md)
- [المكتبة](books.md)
- [عن نمق](about.md)
- [المصادر والتراخيص](attributions.md)
- [سياسة الخصوصية](privacy.md)
- [مدونتي](library.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `HomeScreen` | (search) | [البحث](search.md) | [app/(tabs)/(home)/index.tsx:78](../../mobile/src/app/(tabs)/(home)/index.tsx#L78) |
| `SideHead` | (onPress) | [المصحف](read.md) | [components/CompareCard.tsx:111](../../mobile/src/components/CompareCard.tsx#L111) |
|  | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/CompareCard.tsx:112](../../mobile/src/components/CompareCard.tsx#L112) |
| `LaneHead` | اقرأ ‹› في المصحف | [المصحف](read.md) | [components/CompareCard.tsx:124](../../mobile/src/components/CompareCard.tsx#L124) |
|  | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/CompareCard.tsx:125](../../mobile/src/components/CompareCard.tsx#L125) |
| `CompareCard` | اقرأ ‹› في المصحف | [المصحف](read.md) | [components/CompareCard.tsx:376](../../mobile/src/components/CompareCard.tsx#L376) |
|  | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/CompareCard.tsx:385](../../mobile/src/components/CompareCard.tsx#L385) |
| `DarkSeaActions` | افتح مشهد ‹› | [المشهد](scene.md) | [components/DarkSea.tsx:256](../../mobile/src/components/DarkSea.tsx#L256) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [components/DarkSea.tsx:257](../../mobile/src/components/DarkSea.tsx#L257) |
| `EventPlaces` | افتح ‹› في المصحف | [المصحف](read.md) | [components/EventPlaces.tsx:101](../../mobile/src/components/EventPlaces.tsx#L101) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:117](../../mobile/src/components/EventPlaces.tsx#L117) |
| `CompareButton` | قارن ‹› | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:129](../../mobile/src/components/EventPlaces.tsx#L129) |
| `BUTTONS` | القبلة | [الأدوات والأذكار](utilities.md) | [components/HomeButtons.tsx:15](../../mobile/src/components/HomeButtons.tsx#L15) |
|  | الأذكار | [الأدوات والأذكار](utilities.md) | [components/HomeButtons.tsx:16](../../mobile/src/components/HomeButtons.tsx#L16) |
|  | المكتبة | [المكتبة](books.md) | [components/HomeButtons.tsx:17](../../mobile/src/components/HomeButtons.tsx#L17) |
|  | مشاهد | [مشاهد](lataif.md) | [components/HomeButtons.tsx:18](../../mobile/src/components/HomeButtons.tsx#L18) |
|  | مدونتي | [مدونتي](library.md) | [components/HomeButtons.tsx:19](../../mobile/src/components/HomeButtons.tsx#L19) |
| `ContinueReading` | (read) | [المصحف](read.md) | [components/HomeFeed.tsx:338](../../mobile/src/components/HomeFeed.tsx#L338) |
|  | ابدأ القراءة | [القرآن](quran.md) | [components/HomeFeed.tsx:342](../../mobile/src/components/HomeFeed.tsx#L342) |
| `PairPost` | (compare) | [مقارنة السور](compare.md) | [components/HomeFeed.tsx:357](../../mobile/src/components/HomeFeed.tsx#L357) |
|  | آيتان متشابهتان | [مقارنة السور](compare.md) | [components/HomeFeed.tsx:364](../../mobile/src/components/HomeFeed.tsx#L364) |
| `ForgottenPost` | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:427](../../mobile/src/components/HomeFeed.tsx#L427) |
|  | افتح ما نسيته | [مدونتي](library.md) | [components/HomeFeed.tsx:429](../../mobile/src/components/HomeFeed.tsx#L429) |
|  | (head) | [الاختبارات](quizzes.md) | [components/HomeFeed.tsx:429](../../mobile/src/components/HomeFeed.tsx#L429) |
| `ReciteAction` | تسميع | [المصحف](read.md) | [components/HomeFeed.tsx:475](../../mobile/src/components/HomeFeed.tsx#L475) |
| `QuizPost` | (open) | [الاختبارات](quizzes.md) | [components/HomeFeed.tsx:583](../../mobile/src/components/HomeFeed.tsx#L583) |
|  | افتح ما يشرح الجواب | [الترجمة](person.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [متشابهات القرآن](branches.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [مقارنة السور](compare.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [الأطلس](atlas.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [النسب](nasab.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [المصطلح](term.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [أبواب الكتاب](hadith-kitab.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [الحديث](hadith.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [القصة](story.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [الغزوة](battle.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [المصحف](read.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [الذكر](dhikr.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
|  | افتح ما يشرح الجواب | [ترتيب السور](order.md) | [components/HomeFeed.tsx:585](../../mobile/src/components/HomeFeed.tsx#L585) |
| `TarajimPost` | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:629](../../mobile/src/components/HomeFeed.tsx#L629) |
|  | من التراجم | [التراجم](tarajim.md) | [components/HomeFeed.tsx:631](../../mobile/src/components/HomeFeed.tsx#L631) |
| `TiePost` | (open) | [بين عدة أشخاص](between.md) | [components/HomeFeed.tsx:653](../../mobile/src/components/HomeFeed.tsx#L653) |
|  | صلة | [التراجم](tarajim.md) | [components/HomeFeed.tsx:655](../../mobile/src/components/HomeFeed.tsx#L655) |
| `NamePost` | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:679](../../mobile/src/components/HomeFeed.tsx#L679) |
|  | كنية وصاحبها | [التراجم](tarajim.md) | [components/HomeFeed.tsx:682](../../mobile/src/components/HomeFeed.tsx#L682) |
| `LifePost` | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:703](../../mobile/src/components/HomeFeed.tsx#L703) |
|  | من حياته | [الترجمة](person.md) | [components/HomeFeed.tsx:705](../../mobile/src/components/HomeFeed.tsx#L705) |
| `NasabPost` | (open) | [النسب](nasab.md) | [components/HomeFeed.tsx:725](../../mobile/src/components/HomeFeed.tsx#L725) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:727](../../mobile/src/components/HomeFeed.tsx#L727) |
| `TiesPost` | (open) | [الصلات](ties.md) | [components/HomeFeed.tsx:742](../../mobile/src/components/HomeFeed.tsx#L742) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:744](../../mobile/src/components/HomeFeed.tsx#L744) |
|  | (onPick) | [الترجمة](person.md) | [components/HomeFeed.tsx:748](../../mobile/src/components/HomeFeed.tsx#L748) |
| `GroupPost` | (open) | [بين عدة أشخاص](between.md) | [components/HomeFeed.tsx:772](../../mobile/src/components/HomeFeed.tsx#L772) |
|  | (open) | [التراجم](tarajim.md) | [components/HomeFeed.tsx:774](../../mobile/src/components/HomeFeed.tsx#L774) |
| `LivesPost` | (open) | [حياتهم جنبًا إلى جنب](life.md) | [components/HomeFeed.tsx:793](../../mobile/src/components/HomeFeed.tsx#L793) |
|  | حياتهما | [التراجم](tarajim.md) | [components/HomeFeed.tsx:795](../../mobile/src/components/HomeFeed.tsx#L795) |
| `MeetPost` | (open) | [النسب](nasab.md) | [components/HomeFeed.tsx:815](../../mobile/src/components/HomeFeed.tsx#L815) |
|  | أين يلتقي نسبهما؟ | [التراجم](tarajim.md) | [components/HomeFeed.tsx:818](../../mobile/src/components/HomeFeed.tsx#L818) |
| `RingPost` | (go) | [الترجمة](person.md) | [components/HomeFeed.tsx:844](../../mobile/src/components/HomeFeed.tsx#L844) |
|  | (open) | [الترجمة](person.md) | [components/HomeFeed.tsx:860](../../mobile/src/components/HomeFeed.tsx#L860) |
|  | (open) | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:861](../../mobile/src/components/HomeFeed.tsx#L861) |
|  | (open) | [التراجم](tarajim.md) | [components/HomeFeed.tsx:861](../../mobile/src/components/HomeFeed.tsx#L861) |
|  | (open) | [الصلات](ties.md) | [components/HomeFeed.tsx:862](../../mobile/src/components/HomeFeed.tsx#L862) |
|  | (open) | [كل التراجم](people.md) | [components/HomeFeed.tsx:863](../../mobile/src/components/HomeFeed.tsx#L863) |
|  | (open) | [حديث الصحيح](hadith-sahih.md) | [components/HomeFeed.tsx:864](../../mobile/src/components/HomeFeed.tsx#L864) |
| `BattlePost` | (open) | [الغزوة](battle.md) | [components/HomeFeed.tsx:892](../../mobile/src/components/HomeFeed.tsx#L892) |
|  | (open) | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:894](../../mobile/src/components/HomeFeed.tsx#L894) |
| `BattleYearPost` | (toYear) | [الأطلس](atlas.md) | [components/HomeFeed.tsx:917](../../mobile/src/components/HomeFeed.tsx#L917) |
|  | من الأطلس | [الأطلس](atlas.md) | [components/HomeFeed.tsx:922](../../mobile/src/components/HomeFeed.tsx#L922) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:932](../../mobile/src/components/HomeFeed.tsx#L932) |
| `ArmiesPost` | الجيشان في الغزوات | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:955](../../mobile/src/components/HomeFeed.tsx#L955) |
|  | افتح الغزوات والمعارك | [الغزوات والمعارك](battles.md) | [components/HomeFeed.tsx:956](../../mobile/src/components/HomeFeed.tsx#L956) |
|  | افتح ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:965](../../mobile/src/components/HomeFeed.tsx#L965) |
| `HadithScenePost` | (open) | [رواية الصحيح](hadith-unit.md) | [components/HomeFeed.tsx:982](../../mobile/src/components/HomeFeed.tsx#L982) |
|  | من ‹› | [الحديث](hadith.md) | [components/HomeFeed.tsx:984](../../mobile/src/components/HomeFeed.tsx#L984) |
| `OpeningCardPost` | (open) | [فواتح السور](openings.md) | [components/HomeFeed.tsx:1005](../../mobile/src/components/HomeFeed.tsx#L1005) |
|  | من فواتح السور | [فواتح السور](openings.md) | [components/HomeFeed.tsx:1007](../../mobile/src/components/HomeFeed.tsx#L1007) |
| `OathPost` | (open) | [الأقسام](oaths.md) | [components/HomeFeed.tsx:1023](../../mobile/src/components/HomeFeed.tsx#L1023) |
|  | من الأقسام | [الأقسام](oaths.md) | [components/HomeFeed.tsx:1025](../../mobile/src/components/HomeFeed.tsx#L1025) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [components/HomeFeed.tsx:1027](../../mobile/src/components/HomeFeed.tsx#L1027) |
| `SurahAimPost` | مقصود السورة | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1046](../../mobile/src/components/HomeFeed.tsx#L1046) |
|  | افتح سورة ‹› في ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1047](../../mobile/src/components/HomeFeed.tsx#L1047) |
| `SurahLinkPost` | بين سورتين | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1063](../../mobile/src/components/HomeFeed.tsx#L1063) |
|  | افتح ‹› و‹› في ترتيب السور | [ترتيب السور](order.md) | [components/HomeFeed.tsx:1064](../../mobile/src/components/HomeFeed.tsx#L1064) |
| `EventPost` | (open) | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:1084](../../mobile/src/components/HomeFeed.tsx#L1084) |
|  | (open) | [قصص الأنبياء](prophets.md) | [components/HomeFeed.tsx:1086](../../mobile/src/components/HomeFeed.tsx#L1086) |
| `TreePost` | (open) | [متشابهات القرآن](branches.md) | [components/HomeFeed.tsx:1134](../../mobile/src/components/HomeFeed.tsx#L1134) |
|  | من متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/HomeFeed.tsx:1142](../../mobile/src/components/HomeFeed.tsx#L1142) |
| `SavedAyahPost` | افتح المحفوظات | [مدونتي](library.md) | [components/HomeFeed.tsx:1155](../../mobile/src/components/HomeFeed.tsx#L1155) |
|  | افتح صفحة الآية | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1156](../../mobile/src/components/HomeFeed.tsx#L1156) |
| `StoryPost` | (open) | [قصة النبي](prophets-slug.md) | [components/HomeFeed.tsx:1192](../../mobile/src/components/HomeFeed.tsx#L1192) |
|  | (open) | [قصص الأنبياء](prophets.md) | [components/HomeFeed.tsx:1194](../../mobile/src/components/HomeFeed.tsx#L1194) |
| `JuzPost` | (open) | [المصحف](read.md) | [components/HomeFeed.tsx:1222](../../mobile/src/components/HomeFeed.tsx#L1222) |
|  | جزء اليوم | [القرآن](quran.md) | [components/HomeFeed.tsx:1225](../../mobile/src/components/HomeFeed.tsx#L1225) |
| `KahfPost` | (read) | [المصحف](read.md) | [components/HomeFeed.tsx:1238](../../mobile/src/components/HomeFeed.tsx#L1238) |
|  | سورة الكهف | [القرآن](quran.md) | [components/HomeFeed.tsx:1240](../../mobile/src/components/HomeFeed.tsx#L1240) |
| `PrayerPost` | (open) | [الأدوات والأذكار](utilities.md) | [components/HomeFeed.tsx:1260](../../mobile/src/components/HomeFeed.tsx#L1260) |
|  | مواقيت الصلاة | [الأدوات والأذكار](utilities.md) | [components/HomeFeed.tsx:1264](../../mobile/src/components/HomeFeed.tsx#L1264) |
|  | القبلة | [الأدوات والأذكار](utilities.md) | [components/HomeFeed.tsx:1265](../../mobile/src/components/HomeFeed.tsx#L1265) |
| `BooksPost` | افتح المكتبة | [المكتبة](books.md) | [components/HomeFeed.tsx:1324](../../mobile/src/components/HomeFeed.tsx#L1324) |
|  | (onPress) | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1327](../../mobile/src/components/HomeFeed.tsx#L1327) |
| `ScenePost` | افتح المشاهد | [مشاهد](lataif.md) | [components/HomeFeed.tsx:1344](../../mobile/src/components/HomeFeed.tsx#L1344) |
|  | (onPress) | [المشهد](scene.md) | [components/HomeFeed.tsx:1347](../../mobile/src/components/HomeFeed.tsx#L1347) |
|  | افتح المشاهد | [مشاهد](lataif.md) | [components/HomeFeed.tsx:1352](../../mobile/src/components/HomeFeed.tsx#L1352) |
|  | (onPress) | [المشهد](scene.md) | [components/HomeFeed.tsx:1355](../../mobile/src/components/HomeFeed.tsx#L1355) |
| `SiraPost` | (open) | [القصة](story.md) | [components/HomeFeed.tsx:1370](../../mobile/src/components/HomeFeed.tsx#L1370) |
|  | من قصص السيرة | [قصص السيرة](stories.md) | [components/HomeFeed.tsx:1372](../../mobile/src/components/HomeFeed.tsx#L1372) |
| `RajabPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1403](../../mobile/src/components/HomeFeed.tsx#L1403) |
|  | من شرح ابن رجب | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1405](../../mobile/src/components/HomeFeed.tsx#L1405) |
| `HadithPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1420](../../mobile/src/components/HomeFeed.tsx#L1420) |
|  | من الحديث | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1422](../../mobile/src/components/HomeFeed.tsx#L1422) |
| `SahihPost` | (open) | [حديث الصحيح](hadith-sahih.md) | [components/HomeFeed.tsx:1446](../../mobile/src/components/HomeFeed.tsx#L1446) |
|  | من ‹› | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1449](../../mobile/src/components/HomeFeed.tsx#L1449) |
| `RecordedPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1466](../../mobile/src/components/HomeFeed.tsx#L1466) |
|  | من أخرجه | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1468](../../mobile/src/components/HomeFeed.tsx#L1468) |
| `IsnadPost` | (open) | [حديث الأربعين](hadith-forty.md) | [components/HomeFeed.tsx:1490](../../mobile/src/components/HomeFeed.tsx#L1490) |
|  | من الإسناد | [كتاب الحديث](hadith-book.md) | [components/HomeFeed.tsx:1492](../../mobile/src/components/HomeFeed.tsx#L1492) |
| `TermPost` | (open) | [المصطلح](term.md) | [components/HomeFeed.tsx:1517](../../mobile/src/components/HomeFeed.tsx#L1517) |
|  | من مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1519](../../mobile/src/components/HomeFeed.tsx#L1519) |
|  | مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1521](../../mobile/src/components/HomeFeed.tsx#L1521) |
| `GharibPost` | (open) | [الكلمة](word.md) | [components/HomeFeed.tsx:1559](../../mobile/src/components/HomeFeed.tsx#L1559) |
|  | (open) | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1559](../../mobile/src/components/HomeFeed.tsx#L1559) |
|  | من غريب القرآن | [ألفاظ القرآن](words.md) | [components/HomeFeed.tsx:1561](../../mobile/src/components/HomeFeed.tsx#L1561) |
| `TuhfaPost` | من تحفة الأطفال | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1582](../../mobile/src/components/HomeFeed.tsx#L1582) |
|  | افتح المنظومة | [تحفة الأطفال](tuhfa.md) | [components/HomeFeed.tsx:1583](../../mobile/src/components/HomeFeed.tsx#L1583) |
| `MomentPost` | (open) | [الغزوة](battle.md) | [components/HomeFeed.tsx:1604](../../mobile/src/components/HomeFeed.tsx#L1604) |
|  | من ‹› | [الغزوة](battle.md) | [components/HomeFeed.tsx:1606](../../mobile/src/components/HomeFeed.tsx#L1606) |
| `NOTE_TOPICS` | (tafsir) | [الكتاب](book.md) | [components/HomeFeed.tsx:1648](../../mobile/src/components/HomeFeed.tsx#L1648) |
|  | (balagha) | [مصطلحات البلاغة](terms.md) | [components/HomeFeed.tsx:1649](../../mobile/src/components/HomeFeed.tsx#L1649) |
|  | (irab) | [المكتبة](books.md) | [components/HomeFeed.tsx:1650](../../mobile/src/components/HomeFeed.tsx#L1650) |
|  | (qiraat) | [القراءات](qiraat.md) | [components/HomeFeed.tsx:1651](../../mobile/src/components/HomeFeed.tsx#L1651) |
| `AyahNotePost` | (show) | [صفحة الآية](ayah.md) | [components/HomeFeed.tsx:1673](../../mobile/src/components/HomeFeed.tsx#L1673) |
| `DhikrPost` | افتح الأذكار | [الأدوات والأذكار](utilities.md) | [components/HomeFeed.tsx:1720](../../mobile/src/components/HomeFeed.tsx#L1720) |
|  | افتح الذكر في الأذكار | [الذكر](dhikr.md) | [components/HomeFeed.tsx:1721](../../mobile/src/components/HomeFeed.tsx#L1721) |
| `Feed` | (review) | [المصحف](read.md) | [components/HomeFeed.tsx:2035](../../mobile/src/components/HomeFeed.tsx#L2035) |
| `Cell` | (onPress) | [الغزوة](battle.md) | [components/LifeColumns.tsx:18](../../mobile/src/components/LifeColumns.tsx#L18) |
|  | (onPress) | [القصة](story.md) | [components/LifeColumns.tsx:18](../../mobile/src/components/LifeColumns.tsx#L18) |
| `Item` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
| `SurahCard` | افتح سورة ‹› في المصحف | [المصحف](read.md) | [components/OrderSurah.tsx:105](../../mobile/src/components/OrderSurah.tsx#L105) |
| `CompareFeedback` | (open) | [مقارنة السور](compare.md) | [components/QuizCompare.tsx:135](../../mobile/src/components/QuizCompare.tsx#L135) |
| `TreeActions` | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/QuizTree.tsx:204](../../mobile/src/components/QuizTree.tsx#L204) |
| `RahmanActions` | افتح مشهد ‹› | [المشهد](scene.md) | [components/RahmanScene.tsx:208](../../mobile/src/components/RahmanScene.tsx#L208) |
| `TermChips` | أمثلته في مصطلحات البلاغة | [المصطلح](term.md) | [components/TermSheet.tsx:39](../../mobile/src/components/TermSheet.tsx#L39) |
| `TiesChain` | (open) | [الصلات](ties.md) | [components/TiesChain.tsx:164](../../mobile/src/components/TiesChain.tsx#L164) |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:130](../../mobile/src/components/battles/BattleParts.tsx#L130) |
| `Hadith` | افتح الحديث كاملًا: ‹› | [حديث الصحيح](hadith-sahih.md) | [components/scenes/RahmanPage.tsx:143](../../mobile/src/components/scenes/RahmanPage.tsx#L143) |
| `BookCard` | (open) | [كتاب الحديث](hadith-book.md) | [screens/books.tsx:77](../../mobile/src/screens/books.tsx#L77) |
|  | (open) | [الكتاب](book.md) | [screens/books.tsx:78](../../mobile/src/screens/books.tsx#L78) |
| `Box` | (onPress) | [الترجمة](person.md) | [screens/nasab.tsx:33](../../mobile/src/screens/nasab.tsx#L33) |
| `OpeningRows` | افتح ‹› في المصحف | [المصحف](read.md) | [screens/openings.tsx:74](../../mobile/src/screens/openings.tsx#L74) |
| `HadithOpen` | افتح ‹› | [حديث الصحيح](hadith-sahih.md) | [screens/story.tsx:77](../../mobile/src/screens/story.tsx#L77) |

## Sheets

- `CompareTargetsSheet`
- `DoubtedSheet`
- `InterestsSheet`
- `LifeSheet`
- `MoreMenu`
- `NotMineMenu`
- `SurahSheet`
- `TieSheet`
- `VideoSheet`
