# حياتهم جنبًا إلى جنب

`mobile/src/app/(tabs)/(tarajim)/life.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["حياتهم جنبًا إلى جنب"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["الترجمة"]) --> me
  in3(["التراجم"]) --> me
  me -- "…" --> out0["الغزوة"]
  me -- "…" --> out1["القصة"]
  me -- "…" --> out2["التراجم"]
  me -.-> sheet0{{"LifeSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [الترجمة](person.md)
- [التراجم](tarajim.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `Cell` | (onPress) | [الغزوة](battle.md) | [components/LifeColumns.tsx:17](../../mobile/src/components/LifeColumns.tsx#L17) |
|  | (onPress) | [القصة](story.md) | [components/LifeColumns.tsx:17](../../mobile/src/components/LifeColumns.tsx#L17) |
| `LifeSheet` | (onPress) | [الغزوة](battle.md) | [components/LifeTimeline.tsx:145](../../mobile/src/components/LifeTimeline.tsx#L145) |
|  | (onPress) | [القصة](story.md) | [components/LifeTimeline.tsx:145](../../mobile/src/components/LifeTimeline.tsx#L145) |
| `LifeScreen` | (back) | [التراجم](tarajim.md) | [screens/life.tsx:33](../../mobile/src/screens/life.tsx#L33) |

## Sheets

- `LifeSheet`
