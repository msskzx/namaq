# The app's feature map

Every screen of the phone app, by the name a person would give it, and the tap that opens it. Use these names when
talking about the app and with `npm run phone -- open <name>`. This file is written by `npm run feature-map` from
[e2e/featureMap.mjs](../e2e/featureMap.mjs); `e2e/featureMap.test.ts` fails when a route file in `mobile/src/app` is
missing from the map, when a fixed label in the map no longer appears in the app's code, when a screen cannot be
reached from the tab bar, or when this file is out of date.

On the arrows, `←` separates taps made one after another, and a label in ‹› is what the row shows (a name, a title),
not fixed text. A rounded, dashed box is a screen from another section that leads in.

## القرآن

```mermaid
flowchart TB
  s0["القرآن"]
  s1["المصحف"]
  s2["صفحة الآية"]
  s3["متشابهات القرآن"]
  s4["مقارنة السور"]
  s5["قصص الأنبياء"]
  s6["قصة النبي"]
  s7["تحفة الأطفال"]
  s8["ألفاظ القرآن"]
  s9["الكلمة"]
  s10["الأقسام"]
  s11["مشاهد"]
  s12["المشهد"]
  s13["مصطلحات البلاغة"]
  s14["المصطلح"]
  s15["القراءات"]
  s16["فواتح السور"]
  s17["ترتيب السور"]
  bars0{{"شريط التبويب: القرآن"}} --> s0
  s0 -- "المصحف" --> s1
  s1 -- "‹اضغط مطولًا على آية› ← صفحة الآية" --> s2
  s24(["الرئيسية"])
  class s24 elsewhere
  s24 -- "افتح صفحة الآية" --> s2
  s0 -- "متشابهات القرآن" --> s3
  s2 -- "متشابهات الآية" --> s3
  s0 -- "مقارنة السور" --> s4
  s24 -- "افتح الآيات المتشابهة" --> s4
  s0 -- "قصص الأنبياء" --> s5
  s25(["البحث"])
  class s25 elsewhere
  s25 -- "‹اسم النبي›" --> s6
  s24 -- "‹بطاقة قصة نبي›" --> s6
  s0 -- "تحفة الأطفال" --> s7
  s0 -- "ألفاظ القرآن" --> s8
  s8 -- "‹الكلمة›" --> s9
  s0 -- "الأقسام" --> s10
  s0 -- "مشاهد" --> s11
  s24 -- "مشاهد" --> s11
  s11 -- "‹غلاف المشهد›" --> s12
  s0 -- "مصطلحات البلاغة" --> s13
  s13 -- "‹اسم المصطلح›" --> s14
  s0 -- "القراءات" --> s15
  s0 -- "فواتح السور" --> s16
  s0 -- "ترتيب السور" --> s17
  classDef elsewhere stroke-dasharray: 4 3
```

## الحديث

```mermaid
flowchart TB
  s18["الحديث"]
  s19["كتاب الحديث"]
  s20["أبواب الكتاب"]
  s21["حديث الصحيح"]
  s22["حديث الأربعين"]
  s23["رواية الصحيح"]
  bars18{{"شريط التبويب: الحديث"}} --> s18
  s18 -- "‹اسم الكتاب›" --> s19
  s18 -- "‹كتاب من الصحيح›" --> s20
  s19 -- "‹كتاب من الصحيح›" --> s20
  s20 -- "‹الحديث›" --> s21
  s25(["البحث"])
  class s25 elsewhere
  s25 -- "‹الحديث›" --> s21
  s18 -- "‹رقم الحديث›" --> s22
  s22 -- "المشاهد في صحيح مسلم" --> s23
  classDef elsewhere stroke-dasharray: 4 3
```

## الرئيسية

```mermaid
flowchart TB
  s24["الرئيسية"]
  s25["البحث"]
  s26["الأدوات والأذكار"]
  s27["الذكر"]
  s28["مدونتي"]
  s29["المكتبة"]
  s30["الكتاب"]
  bars24{{"شريط التبويب: الرئيسية"}} --> s24
  s24 -- "البحث" --> s25
  s24 -- "القبلة" --> s26
  s24 -- "الأذكار" --> s26
  s26 -- "‹الذكر›" --> s27
  s24 -- "افتح الذكر في الأذكار" --> s27
  s24 -- "مدونتي" --> s28
  s24 -- "المكتبة" --> s29
  s29 -- "‹اسم الكتاب›" --> s30
  s24 -- "افتح تفسير السعدي" --> s30
  classDef elsewhere stroke-dasharray: 4 3
```

## التراجم

```mermaid
flowchart TB
  s31["التراجم"]
  s32["كل التراجم"]
  s33["الترجمة"]
  s34["الصلات"]
  s35["قصص السيرة"]
  s36["القصة"]
  s37["الغزوات والمعارك"]
  s38["الغزوة"]
  s39["الأطلس"]
  s40["النسب"]
  s41["بين عدة أشخاص"]
  s42["حياتهم جنبًا إلى جنب"]
  bars31{{"شريط التبويب: التراجم"}} --> s31
  s31 -- "كل التراجم" --> s32
  s32 -- "‹اسم الشخص›" --> s33
  s31 -- "‹اسم الشخص›" --> s33
  s33 -- "تنقّل في صلاته" --> s34
  s31 -- "قصص السيرة" --> s35
  s35 -- "‹اسم القصة›" --> s36
  s31 -- "الغزوات والمعارك" --> s37
  s37 -- "‹اسم الغزوة›" --> s38
  s39 -- "‹اسم الغزوة›" --> s38
  s31 -- "الأطلس" --> s39
  s31 -- "النسب" --> s40
  s31 -- "بين عدة أشخاص" --> s41
  s31 -- "حياتهم جنبًا إلى جنب" --> s42
  classDef elsewhere stroke-dasharray: 4 3
```

## الاختبارات

```mermaid
flowchart TB
  s43["الاختبارات"]
  s44["اختبار مخصص"]
  s45["الاختبار"]
  s46["اختبار جماعي"]
  s47["غرفة الاختبار الجماعي"]
  bars43{{"شريط التبويب: الاختبارات"}} --> s43
  s43 -- "اختبار مخصص" --> s44
  s44 -- "ابدأ الاختبار" --> s45
  s43 -- "اختبار جماعي" --> s46
  s46 -- "ابدأ" --> s47
  s46 -- "انضم" --> s47
  classDef elsewhere stroke-dasharray: 4 3
```

## خارج الشريط

```mermaid
flowchart TB
  s48["عن نمق"]
  s49["سياسة الخصوصية"]
  s50["المصادر والتراخيص"]
  s51["مقاسات الأشجار"]
  s24(["الرئيسية"])
  class s24 elsewhere
  s24 -- "الإعدادات ← عن نمق" --> s48
  s24 -- "الإعدادات ← سياسة الخصوصية" --> s49
  s24 -- "الإعدادات ← المصادر والتراخيص" --> s50
  classDef elsewhere stroke-dasharray: 4 3
```

## Every screen

| Screen | Opens with | Reached from | File |
| --- | --- | --- | --- |
| القرآن | `/quran` | شريط التبويب: القرآن | `mobile/src/app/(tabs)/(quran)/quran.tsx` |
| المصحف | `/read` | القرآن ← المصحف | `mobile/src/app/(tabs)/read.tsx` |
| صفحة الآية | `/ayah?key=1:1` | المصحف ← ‹اضغط مطولًا على آية› ← صفحة الآية<br>الرئيسية ← افتح صفحة الآية | `mobile/src/app/ayah.tsx` |
| متشابهات القرآن | `/branches` | القرآن ← متشابهات القرآن<br>صفحة الآية ← متشابهات الآية | `mobile/src/app/(tabs)/(quran)/branches.tsx` |
| مقارنة السور | `/compare` | القرآن ← مقارنة السور<br>الرئيسية ← افتح الآيات المتشابهة | `mobile/src/app/(tabs)/(quran)/compare.tsx` |
| قصص الأنبياء | `/prophets` | القرآن ← قصص الأنبياء | `mobile/src/app/(tabs)/(quran)/prophets.tsx` |
| قصة النبي | `/prophets/musa` | البحث ← ‹اسم النبي›<br>الرئيسية ← ‹بطاقة قصة نبي› | `mobile/src/app/prophets/[slug].tsx` |
| تحفة الأطفال | `/tuhfa` | القرآن ← تحفة الأطفال | `mobile/src/app/(tabs)/(quran)/tuhfa.tsx` |
| ألفاظ القرآن | `/words` | القرآن ← ألفاظ القرآن | `mobile/src/app/(tabs)/(quran)/words.tsx` |
| الكلمة | `/word?ids=814` | ألفاظ القرآن ← ‹الكلمة› | `mobile/src/app/(tabs)/(quran)/word.tsx` |
| الأقسام | `/oaths` | القرآن ← الأقسام | `mobile/src/app/(tabs)/(quran)/oaths.tsx` |
| مشاهد | `/lataif` | القرآن ← مشاهد<br>الرئيسية ← مشاهد | `mobile/src/app/(tabs)/(quran)/lataif.tsx` |
| المشهد | `/scene?id=rahman` | مشاهد ← ‹غلاف المشهد› | `mobile/src/app/scene.tsx` |
| مصطلحات البلاغة | `/terms` | القرآن ← مصطلحات البلاغة | `mobile/src/app/(tabs)/(quran)/terms.tsx` |
| المصطلح | `/term?name=الجناس` | مصطلحات البلاغة ← ‹اسم المصطلح› | `mobile/src/app/(tabs)/(quran)/term.tsx` |
| القراءات | `/qiraat` | القرآن ← القراءات | `mobile/src/app/(tabs)/(quran)/qiraat.tsx` |
| فواتح السور | `/openings` | القرآن ← فواتح السور | `mobile/src/app/(tabs)/(quran)/openings.tsx` |
| ترتيب السور | `/order` | القرآن ← ترتيب السور | `mobile/src/app/(tabs)/(quran)/order.tsx` |
| الحديث | `/hadith` | شريط التبويب: الحديث | `mobile/src/app/(tabs)/(hadith)/hadith.tsx` |
| كتاب الحديث | `/hadith-book?book=bukhari` | الحديث ← ‹اسم الكتاب› | `mobile/src/app/(tabs)/(hadith)/hadith-book.tsx` |
| أبواب الكتاب | `/hadith-kitab?book=bukhari&kitab=2` | الحديث ← ‹كتاب من الصحيح›<br>كتاب الحديث ← ‹كتاب من الصحيح› | `mobile/src/app/(tabs)/(hadith)/hadith-kitab.tsx` |
| حديث الصحيح | `/hadith-sahih?book=bukhari&n=1` | أبواب الكتاب ← ‹الحديث›<br>البحث ← ‹الحديث› | `mobile/src/app/(tabs)/(hadith)/hadith-sahih.tsx` |
| حديث الأربعين | `/hadith-forty?n=1` | الحديث ← ‹رقم الحديث› | `mobile/src/app/(tabs)/(hadith)/hadith-forty.tsx` |
| رواية الصحيح | `/hadith-unit?unit=muslim-jibril` | حديث الأربعين ← المشاهد في صحيح مسلم | `mobile/src/app/(tabs)/(hadith)/hadith-unit.tsx` |
| الرئيسية | `/` | شريط التبويب: الرئيسية | `mobile/src/app/(tabs)/(home)/index.tsx` |
| البحث | `/search` | الرئيسية ← البحث | `mobile/src/app/(tabs)/(home)/search.tsx` |
| الأدوات والأذكار | `/utilities` | الرئيسية ← القبلة<br>الرئيسية ← الأذكار | `mobile/src/app/(tabs)/(home)/utilities.tsx` |
| الذكر | `/dhikr?occasion=waking&id=waking-life` | الأدوات والأذكار ← ‹الذكر›<br>الرئيسية ← افتح الذكر في الأذكار | `mobile/src/app/(tabs)/(home)/dhikr.tsx` |
| مدونتي | `/library` | الرئيسية ← مدونتي | `mobile/src/app/(tabs)/(home)/library.tsx` |
| المكتبة | `/books` | الرئيسية ← المكتبة | `mobile/src/app/(tabs)/(library)/books.tsx` |
| الكتاب | `/book?id=sadi` | المكتبة ← ‹اسم الكتاب›<br>الرئيسية ← افتح تفسير السعدي | `mobile/src/app/(tabs)/(library)/book.tsx` |
| التراجم | `/tarajim` | شريط التبويب: التراجم | `mobile/src/app/(tabs)/(tarajim)/tarajim.tsx` |
| كل التراجم | `/people` | التراجم ← كل التراجم | `mobile/src/app/(tabs)/(tarajim)/people.tsx` |
| الترجمة | `/person?slug=abu-bakr-as-siddiq` | كل التراجم ← ‹اسم الشخص›<br>التراجم ← ‹اسم الشخص› | `mobile/src/app/(tabs)/(tarajim)/person.tsx` |
| الصلات | `/ties?slug=abu-bakr-as-siddiq` | الترجمة ← تنقّل في صلاته | `mobile/src/app/(tabs)/(tarajim)/ties.tsx` |
| قصص السيرة | `/stories` | التراجم ← قصص السيرة | `mobile/src/app/(tabs)/(tarajim)/stories.tsx` |
| القصة | `/story?slug=islam-of-dimad` | قصص السيرة ← ‹اسم القصة› | `mobile/src/app/(tabs)/(tarajim)/story.tsx` |
| الغزوات والمعارك | `/battles` | التراجم ← الغزوات والمعارك | `mobile/src/app/(tabs)/(tarajim)/battles.tsx` |
| الغزوة | `/battle?slug=badr` | الغزوات والمعارك ← ‹اسم الغزوة›<br>الأطلس ← ‹اسم الغزوة› | `mobile/src/app/(tabs)/(tarajim)/battle.tsx` |
| الأطلس | `/atlas` | التراجم ← الأطلس | `mobile/src/app/(tabs)/(tarajim)/atlas.tsx` |
| النسب | `/nasab` | التراجم ← النسب | `mobile/src/app/(tabs)/(tarajim)/nasab.tsx` |
| بين عدة أشخاص | `/between` | التراجم ← بين عدة أشخاص | `mobile/src/app/(tabs)/(tarajim)/between.tsx` |
| حياتهم جنبًا إلى جنب | `/life` | التراجم ← حياتهم جنبًا إلى جنب | `mobile/src/app/(tabs)/(tarajim)/life.tsx` |
| الاختبارات | `/quizzes` | شريط التبويب: الاختبارات | `mobile/src/app/(tabs)/quizzes.tsx` |
| اختبار مخصص | `/quiz/solo` | الاختبارات ← اختبار مخصص | `mobile/src/app/quiz/solo.tsx` |
| الاختبار | `/quiz/play` | اختبار مخصص ← ابدأ الاختبار | `mobile/src/app/quiz/play.tsx` |
| اختبار جماعي | `/quiz/party` | الاختبارات ← اختبار جماعي | `mobile/src/app/quiz/party/index.tsx` |
| غرفة الاختبار الجماعي | `/quiz/party/[code]` | اختبار جماعي ← ابدأ<br>اختبار جماعي ← انضم | `mobile/src/app/quiz/party/[code].tsx` |
| عن نمق | `/about` | الرئيسية ← الإعدادات ← عن نمق | `mobile/src/app/about.tsx` |
| سياسة الخصوصية | `/privacy` | الرئيسية ← الإعدادات ← سياسة الخصوصية | `mobile/src/app/privacy.tsx` |
| المصادر والتراخيص | `/attributions` | الرئيسية ← الإعدادات ← المصادر والتراخيص | `mobile/src/app/attributions.tsx` |
| مقاسات الأشجار | `/tree-sizes` | لا يُفتح من التطبيق (npm run tree-sizes opens it to measure every tree) | `mobile/src/app/tree-sizes.tsx` |

## Adding a screen

Add the route file, then an entry in `SCREENS` in `e2e/featureMap.mjs`, and run `npm run feature-map`:

- `file`: the route file under `mobile/src/app`, without `.tsx`.
- `name`: what a person would call the screen. It must be unique.
- `section`: the tab bar button it sits under, or «خارج الشريط».
- `tabBar`: only on the screen a tab bar button opens, the button's label.
- `from`: each way in, as the screen a person is on, then the labels tapped there in order. A label in ‹› is what a
  row shows; every other label must appear in the app's code.
- `sample`: for a screen that needs params, a query (`?slug=badr`) or a path (`/musa`) that gives it something to show.
- `unlinked`: why nothing in the app opens the screen, for a tool such as `tree-sizes`.
