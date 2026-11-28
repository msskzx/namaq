# فواتح السور

`mobile/src/app/(tabs)/(quran)/openings.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["فواتح السور"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["صفحة الآية"]) --> me
  in3(["القرآن"]) --> me
  me -- "…" --> out0["المصحف"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [صفحة الآية](ayah.md)
- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `OpeningRows` | ‹›:1 | [المصحف](read.md) | [screens/openings.tsx:70](../../mobile/src/screens/openings.tsx#L70) |

## Sheets

None of its own.
