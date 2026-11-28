# حديث الصحيح

`mobile/src/app/(tabs)/(hadith)/hadith-sahih.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["حديث الصحيح"]
  style me stroke-width:3px
  me -- "…" --> out0["الترجمة"]
  me -- "…" --> out1["القصة"]
  me -- "…" --> out2["أبواب الكتاب"]
  me -- "…" --> out3["حديث الأربعين"]
  me -- "…" --> out4["صفحة الآية"]
  me -- "…" --> out5["الحديث"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [البحث](search.md)
- [القرآن](quran.md)
- [مشاهد](lataif.md)
- [المشهد](scene.md)
- [صفحة الآية](ayah.md)
- [الحديث](hadith.md)
- [أبواب الكتاب](hadith-kitab.md)
- [القصة](story.md)
- [الاختبارات](quizzes.md)
- [غرفة الاختبار الجماعي](quiz-party-code.md)
- [الاختبار](quiz-play.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:130](../../mobile/src/components/battles/BattleParts.tsx#L130) |
| `StoryLinkRow` | (onPress) | [القصة](story.md) | [components/stories/StoryParts.tsx:166](../../mobile/src/components/stories/StoryParts.tsx#L166) |
| `SahihPage` | ‹›‹› | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithSahih.tsx:44](../../mobile/src/screens/hadithSahih.tsx#L44) |
|  | ‹›‹› | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithSahih.tsx:44](../../mobile/src/screens/hadithSahih.tsx#L44) |
|  | (onOpen) | [حديث الصحيح](hadith-sahih.md) | [screens/hadithSahih.tsx:55](../../mobile/src/screens/hadithSahih.tsx#L55) |
|  | (onPress) | [حديث الأربعين](hadith-forty.md) | [screens/hadithSahih.tsx:57](../../mobile/src/screens/hadithSahih.tsx#L57) |
| `InHadith` | ‹› · ‹› | [صفحة الآية](ayah.md) | [screens/hadithSahih.tsx:83](../../mobile/src/screens/hadithSahih.tsx#L83) |
| `HadithSahihScreen` | (back) | [الحديث](hadith.md) | [screens/hadithSahih.tsx:126](../../mobile/src/screens/hadithSahih.tsx#L126) |

## Sheets

None of its own.
