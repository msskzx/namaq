# الغزوات والمعارك

`mobile/src/app/(tabs)/(tarajim)/battles.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الغزوات والمعارك"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["التراجم"]) --> me
  me -- "…" --> out0["الغزوة"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [التراجم](tarajim.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `Station` | (onPress) | [الغزوة](battle.md) | [components/battles/BattleLine.tsx:30](../../mobile/src/components/battles/BattleLine.tsx#L30) |

## Sheets

None of its own.
