# الترجمة

`mobile/src/app/(tabs)/(tarajim)/person.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الترجمة"]
  style me stroke-width:3px
  me -- "…" --> out0["الغزوة"]
  me -- "…" --> out1["القصة"]
  me -- "…" --> out2["التراجم"]
  me -- "شجرة النسب" --> out3["النسب"]
  me -- "…" --> out4["كل التراجم"]
  me -- "قارن حياته بغيره" --> out5["حياتهم جنبًا إلى جنب"]
  me -- "تنقّل في صلاته" --> out6["الصلات"]
  me -- "بينه وبين…" --> out7["بين عدة أشخاص"]
  me -- "…" --> out8["صفحة الآية"]
  me -.-> sheet0{{"LifeSheet"}}
  me -.-> sheet1{{"TieSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [البحث](search.md)
- [القرآن](quran.md)
- [حديث الصحيح](hadith-sahih.md)
- [الغزوة](battle.md)
- [القصة](story.md)
- [صفحة الآية](ayah.md)
- [غرفة الاختبار الجماعي](quiz-party-code.md)
- [الاختبار](quiz-play.md)
- [كل التراجم](people.md)
- [التراجم](tarajim.md)
- [النسب](nasab.md)
- [الصلات](ties.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `Item` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:107](../../mobile/src/components/LifeTimeline.tsx#L107) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:107](../../mobile/src/components/LifeTimeline.tsx#L107) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:146](../../mobile/src/components/LifeTimeline.tsx#L146) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:146](../../mobile/src/components/LifeTimeline.tsx#L146) |
| `StoryLinkRow` | (onPress) | [القصة](story.md) | [components/stories/StoryParts.tsx:131](../../mobile/src/components/stories/StoryParts.tsx#L131) |
| `Names` | (onPress) | [الترجمة](person.md) | [screens/person.tsx:214](../../mobile/src/screens/person.tsx#L214) |
| `PersonScreen` | (showBattle) | [الغزوة](battle.md) | [screens/person.tsx:251](../../mobile/src/screens/person.tsx#L251) |
|  | (back) | [التراجم](tarajim.md) | [screens/person.tsx:256](../../mobile/src/screens/person.tsx#L256) |
|  | شجرة النسب | [النسب](nasab.md) | [screens/person.tsx:258](../../mobile/src/screens/person.tsx#L258) |
|  | (onPress) | [كل التراجم](people.md) | [screens/person.tsx:298](../../mobile/src/screens/person.tsx#L298) |
|  | قارن حياته بغيره | [حياتهم جنبًا إلى جنب](life.md) | [screens/person.tsx:320](../../mobile/src/screens/person.tsx#L320) |
|  | (onPin) | [الغزوة](battle.md) | [screens/person.tsx:331](../../mobile/src/screens/person.tsx#L331) |
|  | (onPress) | [الغزوة](battle.md) | [screens/person.tsx:333](../../mobile/src/screens/person.tsx#L333) |
|  | تنقّل في صلاته | [الصلات](ties.md) | [screens/person.tsx:342](../../mobile/src/screens/person.tsx#L342) |
|  | بينه وبين… | [بين عدة أشخاص](between.md) | [screens/person.tsx:343](../../mobile/src/screens/person.tsx#L343) |
|  | (onPick) | [الترجمة](person.md) | [screens/person.tsx:346](../../mobile/src/screens/person.tsx#L346) |
|  | ‹›‹› | [صفحة الآية](ayah.md) | [screens/person.tsx:365](../../mobile/src/screens/person.tsx#L365) |
|  | (onPress) | [صفحة الآية](ayah.md) | [screens/person.tsx:374](../../mobile/src/screens/person.tsx#L374) |

## Sheets

- `LifeSheet`
- `TieSheet`
