# الترجمة

`mobile/src/app/(tabs)/(tarajim)/person.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الترجمة"]
  style me stroke-width:3px
  me -- "…" --> out0["الغزوة"]
  me -- "…" --> out1["القصة"]
  me -- "…" --> out2["التراجم"]
  me -- "…" --> out3["النسب"]
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
| `Item` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:123](../../mobile/src/components/LifeTimeline.tsx#L123) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:164](../../mobile/src/components/LifeTimeline.tsx#L164) |
| `StoryLinkRow` | (onPress) | [القصة](story.md) | [components/stories/StoryParts.tsx:166](../../mobile/src/components/stories/StoryParts.tsx#L166) |
| `Names` | (onPress) | [الترجمة](person.md) | [screens/person.tsx:269](../../mobile/src/screens/person.tsx#L269) |
| `PersonScreen` | (showBattle) | [الغزوة](battle.md) | [screens/person.tsx:315](../../mobile/src/screens/person.tsx#L315) |
|  | (back) | [التراجم](tarajim.md) | [screens/person.tsx:324](../../mobile/src/screens/person.tsx#L324) |
|  | (tree) | [النسب](nasab.md) | [screens/person.tsx:327](../../mobile/src/screens/person.tsx#L327) |
|  | (onPress) | [كل التراجم](people.md) | [screens/person.tsx:371](../../mobile/src/screens/person.tsx#L371) |
|  | قارن حياته بغيره | [حياتهم جنبًا إلى جنب](life.md) | [screens/person.tsx:393](../../mobile/src/screens/person.tsx#L393) |
|  | (onPin) | [الغزوة](battle.md) | [screens/person.tsx:404](../../mobile/src/screens/person.tsx#L404) |
|  | (onPress) | [الغزوة](battle.md) | [screens/person.tsx:406](../../mobile/src/screens/person.tsx#L406) |
|  | تنقّل في صلاته | [الصلات](ties.md) | [screens/person.tsx:415](../../mobile/src/screens/person.tsx#L415) |
|  | بينه وبين… | [بين عدة أشخاص](between.md) | [screens/person.tsx:416](../../mobile/src/screens/person.tsx#L416) |
|  | (onPick) | [الترجمة](person.md) | [screens/person.tsx:419](../../mobile/src/screens/person.tsx#L419) |
|  | ‹›‹› | [صفحة الآية](ayah.md) | [screens/person.tsx:440](../../mobile/src/screens/person.tsx#L440) |
|  | (onPress) | [صفحة الآية](ayah.md) | [screens/person.tsx:450](../../mobile/src/screens/person.tsx#L450) |

## Sheets

- `LifeSheet`
- `TieSheet`
