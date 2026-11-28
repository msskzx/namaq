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
| `Names` | (onPress) | [الترجمة](person.md) | [screens/person.tsx:268](../../mobile/src/screens/person.tsx#L268) |
| `PersonScreen` | (showBattle) | [الغزوة](battle.md) | [screens/person.tsx:314](../../mobile/src/screens/person.tsx#L314) |
|  | (back) | [التراجم](tarajim.md) | [screens/person.tsx:323](../../mobile/src/screens/person.tsx#L323) |
|  | (tree) | [النسب](nasab.md) | [screens/person.tsx:326](../../mobile/src/screens/person.tsx#L326) |
|  | (onPress) | [كل التراجم](people.md) | [screens/person.tsx:370](../../mobile/src/screens/person.tsx#L370) |
|  | قارن حياته بغيره | [حياتهم جنبًا إلى جنب](life.md) | [screens/person.tsx:392](../../mobile/src/screens/person.tsx#L392) |
|  | (onPin) | [الغزوة](battle.md) | [screens/person.tsx:403](../../mobile/src/screens/person.tsx#L403) |
|  | (onPress) | [الغزوة](battle.md) | [screens/person.tsx:405](../../mobile/src/screens/person.tsx#L405) |
|  | تنقّل في صلاته | [الصلات](ties.md) | [screens/person.tsx:414](../../mobile/src/screens/person.tsx#L414) |
|  | بينه وبين… | [بين عدة أشخاص](between.md) | [screens/person.tsx:415](../../mobile/src/screens/person.tsx#L415) |
|  | (onPick) | [الترجمة](person.md) | [screens/person.tsx:418](../../mobile/src/screens/person.tsx#L418) |
|  | ‹›‹› | [صفحة الآية](ayah.md) | [screens/person.tsx:439](../../mobile/src/screens/person.tsx#L439) |
|  | (onPress) | [صفحة الآية](ayah.md) | [screens/person.tsx:449](../../mobile/src/screens/person.tsx#L449) |

## Sheets

- `LifeSheet`
- `TieSheet`
