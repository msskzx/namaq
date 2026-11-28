# بين عدة أشخاص

`mobile/src/app/(tabs)/(tarajim)/between.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["بين عدة أشخاص"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["الترجمة"]) --> me
  in3(["التراجم"]) --> me
  in4(["الصلات"]) --> me
  me -- "…" --> out0["الصلات"]
  me -- "…" --> out1["التراجم"]
  me -.-> sheet0{{"TieSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [الترجمة](person.md)
- [التراجم](tarajim.md)
- [الصلات](ties.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `TiesChain` | (open) | [الصلات](ties.md) | [components/TiesChain.tsx:135](../../mobile/src/components/TiesChain.tsx#L135) |
| `BetweenScreen` | (back) | [التراجم](tarajim.md) | [screens/between.tsx:34](../../mobile/src/screens/between.tsx#L34) |

## Sheets

- `TieSheet`
