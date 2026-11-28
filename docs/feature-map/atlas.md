# الأطلس

`mobile/src/app/(tabs)/(tarajim)/atlas.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الأطلس"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["مدونتي"]) --> me
  in3(["التراجم"]) --> me
  me -- "افتح ‹›" --> out0["الغزوة"]
  me -.-> sheet0{{"DrawerSheet"}}
  me -.-> sheet1{{"PlaceSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [التراجم](tarajim.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `BattleRow` | افتح ‹› | [الغزوة](battle.md) | [screens/atlas.tsx:38](../../mobile/src/screens/atlas.tsx#L38) |
| `AtlasBattle` | افتح ‹› | [الغزوة](battle.md) | [screens/atlas.tsx:59](../../mobile/src/screens/atlas.tsx#L59) |
| `PlaceSheet` | افتح ‹› | [الغزوة](battle.md) | [screens/atlas.tsx:82](../../mobile/src/screens/atlas.tsx#L82) |
| `AtlasScreen` | (pickFound) | [الغزوة](battle.md) | [screens/atlas.tsx:138](../../mobile/src/screens/atlas.tsx#L138) |

## Sheets

- `DrawerSheet`
- `PlaceSheet`
