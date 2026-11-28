# الاختبارات

`mobile/src/app/(tabs)/quizzes.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الاختبارات"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  me -.-> sheet0{{"LifeSheet"}}
  me -.-> sheet1{{"SurahSheet"}}
```

## Ways in

- The tab bar's «الاختبارات».
- [الرئيسية](home.md)
- [مدونتي](library.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
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
| `Item` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
| `SurahCard` | افتح سورة ‹› في المصحف | [المصحف](read.md) | [components/OrderSurah.tsx:105](../../mobile/src/components/OrderSurah.tsx#L105) |
| `CompareFeedback` | (open) | [مقارنة السور](compare.md) | [components/QuizCompare.tsx:135](../../mobile/src/components/QuizCompare.tsx#L135) |
| `TreeActions` | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/QuizTree.tsx:204](../../mobile/src/components/QuizTree.tsx#L204) |
| `TermChips` | أمثلته في مصطلحات البلاغة | [المصطلح](term.md) | [components/TermSheet.tsx:39](../../mobile/src/components/TermSheet.tsx#L39) |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:130](../../mobile/src/components/battles/BattleParts.tsx#L130) |
| `Box` | (onPress) | [الترجمة](person.md) | [screens/nasab.tsx:33](../../mobile/src/screens/nasab.tsx#L33) |
| `QuizzesScreen` | (five) | [الاختبار](quiz-play.md) | [screens/quizzes.tsx:91](../../mobile/src/screens/quizzes.tsx#L91) |
|  | اختبار مخصص | [اختبار مخصص](quiz-solo.md) | [screens/quizzes.tsx:108](../../mobile/src/screens/quizzes.tsx#L108) |
|  | اختبار جماعي | [اختبار جماعي](quiz-party.md) | [screens/quizzes.tsx:109](../../mobile/src/screens/quizzes.tsx#L109) |
| `HadithOpen` | افتح ‹› | [حديث الصحيح](hadith-sahih.md) | [screens/story.tsx:77](../../mobile/src/screens/story.tsx#L77) |

## Sheets

- `LifeSheet`
- `SurahSheet`
