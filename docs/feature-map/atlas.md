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
| `BattleRow` | افتح ‹› | [الغزوة](battle.md) | [screens/atlas.tsx:39](../../mobile/src/screens/atlas.tsx#L39) |
| `AtlasBattle` | افتح ‹› | [الغزوة](battle.md) | [screens/atlas.tsx:64](../../mobile/src/screens/atlas.tsx#L64) |
| `PlaceSheet` | افتح ‹› | [الغزوة](battle.md) | [screens/atlas.tsx:92](../../mobile/src/screens/atlas.tsx#L92) |
| `AtlasScreen` | (pickFound) | [الغزوة](battle.md) | [screens/atlas.tsx:165](../../mobile/src/screens/atlas.tsx#L165) |

## Sheets

- `DrawerSheet`
- `PlaceSheet`
